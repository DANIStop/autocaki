"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";
import { isUuid, money, oneOf, parseMoney, text } from "@/lib/admin/parse";
import { EVENT_TYPES, LISTING_STATUSES, REPAIR_STATUSES, type ListingStatus, type RepairStatus } from "@/lib/admin/module-meta";
import type { ImportBreakdown } from "@/lib/admin/modules";
import type { FormState } from "@/lib/admin/actions";
import { VEHICLES_TAG } from "@/lib/vehicle-meta";

function db() {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase nije konfiguriran.");
  return supabase;
}

const fail = (e: { message: string } | null) => (e ? { error: `Spremanje nije uspjelo: ${e.message}` } : null);

// ---------------------------------------------------------------------------
// Kalkulator uvoza
// ---------------------------------------------------------------------------

export async function saveImportCalc(b: ImportBreakdown, country: string): Promise<{ id?: string; error?: string }> {
  await requireAdmin();
  const description = [b.make, b.model, b.year].filter(Boolean).join(" ") || null;
  const { data, error } = await db()
    .from("import_calculations")
    .insert({ vehicle_description: description, origin_country: country, base_price: b.price, breakdown: b })
    .select("id")
    .single();
  if (error) return { error: error.message };
  return { id: data.id };
}

export async function deleteImportCalc(id: string) {
  await requireAdmin();
  await db().from("import_calculations").delete().eq("id", id);
}

// Iz izračuna napravi vozilo (status „na obradi“) s nabavnom cijenom i troškovima uvoza.
export async function createVehicleFromCalc(calcId: string) {
  const admin = await requireAdmin();
  const supabase = db();
  const { data: calc } = await supabase.from("import_calculations").select("*").eq("id", calcId).single();
  if (!calc) return;
  const b = calc.breakdown as ImportBreakdown;
  if (b.vehicleId) redirect(`/admin/vozila/${b.vehicleId}`);

  const make = b.make || "Vozilo";
  const model = b.model || "iz uvoza";
  const slug = `${`${make}-${model}-${b.year ?? ""}`.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}-${crypto.randomUUID().slice(0, 6)}`;
  const { data: vehicle, error } = await supabase
    .from("vehicles")
    .insert({
      slug, make, model, year: b.year ?? null,
      purchase_price: b.vatDeductible ? b.net : b.price,
      listing_price: b.expectedSale,
      status: "na_obradi",
      created_by: admin.email,
      description: b.url ? `Izvor: ${b.url}` : null,
    })
    .select("id")
    .single();
  if (error || !vehicle) return;

  const costs = [
    ["Prijevoz", b.transport], ["PPMV", b.ppmv], ["HR PDV", b.hrVat],
    ["Homologacija / tehnički", b.homologation], ["Registracija", b.registration], ["Ostali troškovi uvoza", b.other],
  ].filter(([, amount]) => Number(amount) > 0);
  if (costs.length) {
    await supabase.from("vehicle_costs").insert(
      costs.map(([note, amount]) => ({ vehicle_id: vehicle.id, amount, type: "fiksni", note, added_by: admin.email })),
    );
  }
  await supabase.from("import_calculations").update({ breakdown: { ...b, vehicleId: vehicle.id } }).eq("id", calcId);
  updateTag(VEHICLES_TAG);
  redirect(`/admin/vozila/${vehicle.id}?novo=1`);
}

// ---------------------------------------------------------------------------
// Prijevozi
// ---------------------------------------------------------------------------

export async function addTransportJob(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const client_name = text(fd, "client_name");
  const route = text(fd, "route");
  const price_charged = money(fd, "price_charged");
  if (!client_name || !route || price_charged == null) return { error: "Klijent, relacija i cijena su obavezni." };
  const travel = text(fd, "travel_order_id");
  const { error } = await db().from("transport_jobs").insert({
    client_name, route, price_charged,
    cost: money(fd, "cost") ?? 0,
    job_date: text(fd, "job_date") ?? new Date().toISOString().slice(0, 10),
    travel_order_id: isUuid(travel) ? travel : null,
  });
  return fail(error) ?? { ok: "Prijevoz spremljen." };
}

export async function deleteTransportJob(id: string) {
  await requireAdmin();
  await db().from("transport_jobs").delete().eq("id", id);
}

// ---------------------------------------------------------------------------
// Putni nalozi
// ---------------------------------------------------------------------------

const TRAVEL_COSTS = ["gorivo", "cestarine", "vinjete_trajekt", "smjestaj", "dnevnice", "ostalo"] as const;
export async function addTravelOrder(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const destination = text(fd, "destination");
  const travel_date = text(fd, "travel_date");
  if (!destination || !travel_date) return { error: "Datum i odredište su obavezni." };
  const labels: Record<(typeof TRAVEL_COSTS)[number], string> = {
    gorivo: "Gorivo", cestarine: "Cestarine", vinjete_trajekt: "Vinjete / trajekt",
    smjestaj: "Smještaj", dnevnice: "Dnevnice", ostalo: "Ostalo",
  };
  const costs = TRAVEL_COSTS.map((k) => ({ label: labels[k], amount: money(fd, k) ?? 0 })).filter((c) => c.amount > 0);
  const vehicleIds = fd.getAll("vehicle_ids").map(String).filter(isUuid);
  const { error } = await db().from("travel_orders").insert({
    destination, travel_date, costs, linked_vehicle_ids: vehicleIds, created_by: admin.email,
  });
  return fail(error) ?? { ok: "Putni nalog spremljen." };
}

export async function deleteTravelOrder(id: string) {
  await requireAdmin();
  await db().from("travel_orders").delete().eq("id", id);
}

// ---------------------------------------------------------------------------
// Klijenti
// ---------------------------------------------------------------------------

export async function saveClient(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = text(fd, "id");
  const name = text(fd, "name");
  if (!name) return { error: "Ime je obavezno." };
  const fields = {
    name,
    phone: text(fd, "phone"),
    email: text(fd, "email"),
    flag: oneOf(text(fd, "flag"), { bitan: "", ignoriraj: "" }),
    notes: text(fd, "notes"),
  };
  if (id) {
    const { error } = await db().from("clients").update(fields).eq("id", id);
    return fail(error) ?? { ok: "Spremljeno." };
  }
  const { data, error } = await db().from("clients").insert(fields).select("id").single();
  if (error || !data) return fail(error) ?? { error: "Greška." };
  redirect(`/admin/klijenti/${data.id}`);
}

export async function deleteClient(id: string) {
  await requireAdmin();
  await db().from("clients").delete().eq("id", id);
  redirect("/admin/klijenti");
}

// Upit → klijent (ako već postoji klijent s istim brojem, samo dodaj interes za vozilo).
export async function clientFromInquiry(inquiryId: string) {
  await requireAdmin();
  const supabase = db();
  const { data: q } = await supabase.from("inquiries").select("*").eq("id", inquiryId).single();
  if (!q) return;
  const digits = String(q.phone).replace(/[^\d]/g, "").slice(-8);
  const { data: existing } = await supabase.from("clients").select("id, phone").ilike("phone", `%${digits.slice(-6)}%`);
  let clientId = existing?.find((c) => String(c.phone ?? "").replace(/[^\d]/g, "").endsWith(digits))?.id;
  if (!clientId) {
    const { data } = await supabase
      .from("clients")
      .insert({ name: q.name, phone: q.phone, email: q.email, notes: `Iz upita (${new Date(q.created_at).toLocaleDateString("hr-HR")}): ${q.message}` })
      .select("id")
      .single();
    clientId = data?.id;
  }
  if (clientId && q.vehicle_id) {
    await supabase.from("client_vehicle_interest").insert({ client_id: clientId, vehicle_id: q.vehicle_id, type: "upit" });
  }
  if (clientId) redirect(`/admin/klijenti/${clientId}`);
}

export async function addClientInterest(clientId: string, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const vehicleId = text(fd, "vehicle_id");
  const type = oneOf(text(fd, "type"), { upit: "", dolazak: "", kupnja: "" });
  if (!isUuid(vehicleId) || !type) return { error: "Odaberite vozilo i vrstu." };
  const { error } = await db().from("client_vehicle_interest").insert({ client_id: clientId, vehicle_id: vehicleId, type });
  return fail(error) ?? { ok: "Dodano." };
}

// ---------------------------------------------------------------------------
// Obrada / štete
// ---------------------------------------------------------------------------

export async function saveRepairJob(vehicleId: string, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const status = oneOf(text(fd, "status"), REPAIR_STATUSES) ?? "ceka_dijelove";
  const parts_needed = String(fd.get("parts") ?? "")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);
  const supabase = db();
  const { data: existing } = await supabase.from("repair_jobs").select("id").eq("vehicle_id", vehicleId).maybeSingle();
  const row = { parts_needed, status, updated_at: new Date().toISOString() };
  const { error } = existing
    ? await supabase.from("repair_jobs").update(row).eq("id", existing.id)
    : await supabase.from("repair_jobs").insert({ ...row, vehicle_id: vehicleId });
  return fail(error) ?? { ok: "Spremljeno." };
}

export async function setRepairStatus(id: string, status: RepairStatus) {
  await requireAdmin();
  if (!(status in REPAIR_STATUSES)) return;
  await db().from("repair_jobs").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
}

export async function deleteRepairJob(id: string) {
  await requireAdmin();
  await db().from("repair_jobs").delete().eq("id", id);
}

// ---------------------------------------------------------------------------
// Raspored
// ---------------------------------------------------------------------------

export async function addEvent(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const title = text(fd, "title");
  const date = text(fd, "date");
  const time = text(fd, "time") ?? "09:00";
  if (!title || !date) return { error: "Naslov i datum su obavezni." };
  // Unos je po zagrebačkom vremenu; offset se računa za taj datum (ljetno/zimsko vrijeme).
  const offset = new Intl.DateTimeFormat("en", { timeZone: "Europe/Zagreb", timeZoneName: "longOffset" })
    .formatToParts(new Date(`${date}T12:00:00Z`))
    .find((p) => p.type === "timeZoneName")?.value.replace("GMT", "") || "+01:00";
  const vehicleId = text(fd, "vehicle_id");
  const { error } = await db().from("schedule_events").insert({
    title,
    type: oneOf(text(fd, "type"), EVENT_TYPES) ?? "ostalo",
    event_at: new Date(`${date}T${time}:00${offset}`).toISOString(),
    related_vehicle_id: isUuid(vehicleId) ? vehicleId : null,
  });
  return fail(error) ?? { ok: "Dodano u raspored." };
}

export async function deleteEvent(id: string) {
  await requireAdmin();
  await db().from("schedule_events").delete().eq("id", id);
}

// ---------------------------------------------------------------------------
// Strani oglasi
// ---------------------------------------------------------------------------

export async function addWatchedListing(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const url = text(fd, "url");
  if (!url || !/^https?:\/\//i.test(url)) return { error: "Zalijepite cijelu poveznicu oglasa (https://…)." };
  const host = new URL(url).hostname;
  const source = host.includes("autoscout24") ? "autoscout24" : host.includes("mobile.de") ? "mobile.de" : "drugo";
  const { error } = await db().from("watched_listings").insert({
    url, source, title: text(fd, "title"), price: parseMoney(text(fd, "price")),
  });
  return fail(error) ?? { ok: "Oglas spremljen." };
}

export async function setListingStatus(id: string, status: ListingStatus) {
  await requireAdmin();
  if (!(status in LISTING_STATUSES)) return;
  await db().from("watched_listings").update({ status }).eq("id", id);
}

export async function deleteWatchedListing(id: string) {
  await requireAdmin();
  await db().from("watched_listings").delete().eq("id", id);
}

