"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAuthClient } from "@/lib/supabase/auth";
import { isAllowedAdminEmail, requireAdmin } from "@/lib/admin/auth";
import {
  FUELS, GEARBOXES, PHOTO_BUCKET, VEHICLE_STATUSES, VEHICLES_TAG,
  type VehicleStatus,
} from "@/lib/vehicles";

export type FormState = { error?: string; ok?: string } | undefined;

function db() {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase nije konfiguriran.");
  return supabase;
}

// ---------------------------------------------------------------------------
// Prijava / odjava
// ---------------------------------------------------------------------------

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Upišite e-mail i lozinku." };
  if (!isAllowedAdminEmail(email)) return { error: "Pogrešan e-mail ili lozinka." };

  const supabase = await getSupabaseAuthClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Pogrešan e-mail ili lozinka." };
  redirect("/admin");
}

export async function signOut() {
  const supabase = await getSupabaseAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/prijava");
}

// ---------------------------------------------------------------------------
// Vozila
// ---------------------------------------------------------------------------

const text = (fd: FormData, k: string) => {
  const v = String(fd.get(k) ?? "").trim();
  return v === "" ? null : v;
};
const int = (fd: FormData, k: string) => {
  const v = text(fd, k);
  if (v == null) return null;
  const n = Number.parseInt(v.replace(/[^\d-]/g, ""), 10);
  return Number.isFinite(n) ? n : null;
};
const money = (fd: FormData, k: string) => {
  const v = text(fd, k);
  if (v == null) return null;
  const n = Number(v.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
};
const oneOf = <T extends string>(v: string | null, allowed: Record<T, string>) =>
  v != null && v in allowed ? (v as T) : null;

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function saveVehicle(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const id = text(formData, "id");
  const make = text(formData, "make");
  const model = text(formData, "model");
  if (!make || !model) return { error: "Marka i model su obavezni." };

  const status = oneOf(text(formData, "status"), VEHICLE_STATUSES) ?? "u_ponudi";
  const fields = {
    make,
    model,
    variant: text(formData, "variant"),
    year: int(formData, "year"),
    km: int(formData, "km"),
    fuel: oneOf(text(formData, "fuel"), FUELS),
    gearbox: oneOf(text(formData, "gearbox"), GEARBOXES),
    power_kw: int(formData, "power_kw"),
    body_type: text(formData, "body_type"),
    color: text(formData, "color"),
    vin: text(formData, "vin"),
    listing_price: money(formData, "listing_price"),
    purchase_price: money(formData, "purchase_price"),
    sale_price: money(formData, "sale_price"),
    description: text(formData, "description"),
    featured: formData.get("featured") === "on",
    status,
  };

  const supabase = db();
  let vehicleId = id;
  if (id) {
    const { data: current } = await supabase.from("vehicles").select("status, sold_at").eq("id", id).single();
    const sold_at =
      status === "prodano" ? current?.sold_at ?? new Date().toISOString() : null;
    const { error } = await supabase.from("vehicles").update({ ...fields, sold_at }).eq("id", id);
    if (error) return { error: `Spremanje nije uspjelo: ${error.message}` };
  } else {
    const base = slugify(`${make} ${model} ${fields.variant ?? ""} ${fields.year ?? ""}`);
    const slug = `${base}-${crypto.randomUUID().slice(0, 6)}`;
    const { data, error } = await supabase
      .from("vehicles")
      .insert({
        ...fields,
        slug,
        created_by: admin.email,
        sold_at: status === "prodano" ? new Date().toISOString() : null,
      })
      .select("id")
      .single();
    if (error || !data) return { error: `Spremanje nije uspjelo: ${error?.message}` };
    vehicleId = data.id;
  }

  updateTag(VEHICLES_TAG);
  if (!id) redirect(`/admin/vozila/${vehicleId}?novo=1`);
  return { ok: "Spremljeno." };
}

export async function setVehicleStatus(id: string, status: VehicleStatus) {
  await requireAdmin();
  if (!(status in VEHICLE_STATUSES)) return;
  await db()
    .from("vehicles")
    .update({ status, sold_at: status === "prodano" ? new Date().toISOString() : null })
    .eq("id", id);
  updateTag(VEHICLES_TAG);
}

export async function deleteVehicle(id: string) {
  await requireAdmin();
  const supabase = db();
  const { data } = await supabase.from("vehicles").select("images").eq("id", id).single();
  if (data?.images?.length) await supabase.storage.from(PHOTO_BUCKET).remove(data.images);
  await supabase.from("vehicles").delete().eq("id", id);
  updateTag(VEHICLES_TAG);
  redirect("/admin/vozila");
}

// ---------------------------------------------------------------------------
// Fotografije — upload ide direktno iz preglednika na signed URL (bez limita veličine Server Actiona)
// ---------------------------------------------------------------------------

export async function createPhotoUploads(vehicleId: string, count: number) {
  await requireAdmin();
  const n = Math.min(Math.max(count, 0), 30);
  const supabase = db();
  const uploads: { path: string; token: string }[] = [];
  for (let i = 0; i < n; i++) {
    const path = `${vehicleId}/${crypto.randomUUID()}.jpg`;
    const { data, error } = await supabase.storage.from(PHOTO_BUCKET).createSignedUploadUrl(path);
    if (error || !data) throw new Error(`Upload URL: ${error?.message}`);
    uploads.push({ path, token: data.token });
  }
  return uploads;
}

export async function setVehiclePhotos(vehicleId: string, images: string[]) {
  await requireAdmin();
  const supabase = db();
  const { data } = await supabase.from("vehicles").select("images").eq("id", vehicleId).single();
  const before: string[] = data?.images ?? [];
  // Dopuštene su samo putanje unutar mape ovog vozila.
  const clean = images.filter((p) => p.startsWith(`${vehicleId}/`));
  await supabase.from("vehicles").update({ images: clean }).eq("id", vehicleId);
  const removed = before.filter((p) => !clean.includes(p));
  if (removed.length) await supabase.storage.from(PHOTO_BUCKET).remove(removed);
  updateTag(VEHICLES_TAG);
}

// ---------------------------------------------------------------------------
// Troškovi vozila
// ---------------------------------------------------------------------------

export async function addVehicleCost(vehicleId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const amount = money(formData, "amount");
  if (amount == null || amount <= 0) return { error: "Upišite iznos troška." };
  const type = formData.get("type") === "fiksni" ? "fiksni" : "dodatni";
  const { error } = await db().from("vehicle_costs").insert({
    vehicle_id: vehicleId,
    amount,
    type,
    note: text(formData, "note"),
    added_by: admin.email,
  });
  if (error) return { error: error.message };
  return { ok: "Trošak dodan." };
}

export async function deleteVehicleCost(costId: string) {
  await requireAdmin();
  await db().from("vehicle_costs").delete().eq("id", costId);
}
