import "server-only";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";
import type { Vehicle, VehicleStatus } from "@/lib/vehicles";

export type VehicleCost = {
  id: string;
  amount: number;
  type: "fiksni" | "dodatni";
  note: string | null;
  added_by: string;
  created_at: string;
};

export type Inquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  vehicle_id: string | null;
  created_at: string;
  vehicle?: { make: string; model: string; slug: string } | null;
};

function db() {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase nije konfiguriran.");
  return supabase;
}

export async function listVehicles(status?: VehicleStatus): Promise<Vehicle[]> {
  await requireAdmin();
  let q = db().from("vehicles").select("*").order("created_at", { ascending: false });
  if (status) q = q.eq("status", status);
  const { data } = await q;
  return (data ?? []) as Vehicle[];
}

export async function getVehicle(id: string): Promise<Vehicle | null> {
  await requireAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data } = await db().from("vehicles").select("*").eq("id", id).maybeSingle();
  return (data as Vehicle | null) ?? null;
}

export async function listVehicleCosts(vehicleId: string): Promise<VehicleCost[]> {
  await requireAdmin();
  const { data } = await db()
    .from("vehicle_costs")
    .select("id, amount, type, note, added_by, created_at")
    .eq("vehicle_id", vehicleId)
    .order("created_at", { ascending: true });
  return (data ?? []) as VehicleCost[];
}

export async function listInquiries(limit = 100): Promise<Inquiry[]> {
  await requireAdmin();
  const { data } = await db()
    .from("inquiries")
    .select("id, name, phone, email, message, vehicle_id, created_at, vehicle:vehicles(make, model, slug)")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as unknown as Inquiry[];
}

export async function getDashboardStats() {
  await requireAdmin();
  const supabase = db();
  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("status, listing_price, purchase_price, sale_price, sold_at, id");
  const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
  const { count: inquiriesWeek } = await supabase
    .from("inquiries")
    .select("id", { count: "exact", head: true })
    .gte("created_at", since);

  const byStatus: Record<VehicleStatus, number> = { u_ponudi: 0, rezervirano: 0, prodano: 0, na_obradi: 0 };
  let stockValue = 0;
  for (const v of vehicles ?? []) {
    byStatus[v.status as VehicleStatus]++;
    if (v.status === "u_ponudi" || v.status === "rezervirano") stockValue += Number(v.listing_price ?? 0);
  }
  return { byStatus, stockValue, inquiriesWeek: inquiriesWeek ?? 0 };
}
