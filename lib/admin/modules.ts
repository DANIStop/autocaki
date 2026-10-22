import "server-only";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";
import type { EventType, ListingStatus, RepairJob } from "@/lib/admin/module-meta";

export * from "@/lib/admin/module-meta";

function db() {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase nije konfiguriran.");
  return supabase;
}

// ---------------------------------------------------------------------------
// Kalkulator uvoza
// ---------------------------------------------------------------------------
export type ImportBreakdown = {
  make?: string; model?: string; year?: number | null; url?: string | null;
  price: number; vatDeductible: boolean; originVat: number; net: number;
  transport: number; ppmv: number; hrVat: number; homologation: number;
  registration: number; other: number; total: number; expectedSale: number | null;
  margin: number | null; vehicleId?: string;
};
export type ImportCalc = {
  id: string; vehicle_description: string | null; origin_country: string;
  base_price: number; breakdown: ImportBreakdown; created_at: string;
};

export async function listImportCalcs(): Promise<ImportCalc[]> {
  await requireAdmin();
  const { data } = await db().from("import_calculations").select("*").order("created_at", { ascending: false }).limit(30);
  return (data ?? []) as ImportCalc[];
}

// ---------------------------------------------------------------------------
// Prijevozi i putni nalozi
// ---------------------------------------------------------------------------
export type TransportJob = {
  id: string; client_name: string; route: string; price_charged: number; cost: number | null;
  travel_order_id: string | null; job_date: string; created_at: string;
};
export type TravelOrder = {
  id: string; travel_date: string; destination: string; costs: { label: string; amount: number }[];
  linked_vehicle_ids: string[]; created_by: string | null; created_at: string;
};

export async function listTransportJobs(): Promise<TransportJob[]> {
  await requireAdmin();
  const { data } = await db().from("transport_jobs").select("*").order("job_date", { ascending: false }).limit(200);
  return (data ?? []) as TransportJob[];
}

export async function listTravelOrders(): Promise<TravelOrder[]> {
  await requireAdmin();
  const { data } = await db().from("travel_orders").select("*").order("travel_date", { ascending: false }).limit(200);
  return (data ?? []) as TravelOrder[];
}

// ---------------------------------------------------------------------------
// Klijenti
// ---------------------------------------------------------------------------
export type Client = {
  id: string; name: string; phone: string | null; email: string | null;
  flag: "bitan" | "ignoriraj" | null; notes: string | null; created_at: string;
  interests?: { id: string; type: "upit" | "dolazak" | "kupnja"; created_at: string; vehicle: { id: string; make: string; model: string } | null }[];
};

export async function listClients(q?: string): Promise<Client[]> {
  await requireAdmin();
  let query = db().from("clients").select("*").order("created_at", { ascending: false }).limit(300);
  if (q) {
    const safe = q.replace(/[%,()]/g, " ").trim();
    query = query.or(`name.ilike.%${safe}%,phone.ilike.%${safe}%,email.ilike.%${safe}%`);
  }
  const { data } = await query;
  return (data ?? []) as Client[];
}

export async function getClient(id: string): Promise<Client | null> {
  await requireAdmin();
  const { data } = await db()
    .from("clients")
    .select("*, interests:client_vehicle_interest(id, type, created_at, vehicle:vehicles(id, make, model))")
    .eq("id", id)
    .maybeSingle();
  return (data as Client | null) ?? null;
}

// ---------------------------------------------------------------------------
// Obrada / štete
// ---------------------------------------------------------------------------

export async function listRepairJobs(): Promise<RepairJob[]> {
  await requireAdmin();
  const { data } = await db()
    .from("repair_jobs")
    .select("*, vehicle:vehicles(id, make, model, variant, images)")
    .order("updated_at", { ascending: false });
  return (data ?? []) as RepairJob[];
}

export async function getRepairJobForVehicle(vehicleId: string): Promise<RepairJob | null> {
  await requireAdmin();
  const { data } = await db().from("repair_jobs").select("*").eq("vehicle_id", vehicleId).maybeSingle();
  return (data as RepairJob | null) ?? null;
}

// ---------------------------------------------------------------------------
// Raspored
// ---------------------------------------------------------------------------
export type ScheduleEvent = {
  id: string; title: string; type: EventType; event_at: string; related_vehicle_id: string | null;
  vehicle?: { id: string; make: string; model: string } | null;
};

export async function listUpcomingEvents(days = 60): Promise<ScheduleEvent[]> {
  await requireAdmin();
  const from = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const to = new Date(Date.now() + days * 24 * 3600 * 1000).toISOString();
  const { data } = await db()
    .from("schedule_events")
    .select("*, vehicle:vehicles(id, make, model)")
    .gte("event_at", from)
    .lte("event_at", to)
    .order("event_at", { ascending: true });
  return (data ?? []) as ScheduleEvent[];
}

// ---------------------------------------------------------------------------
// Strani oglasi
// ---------------------------------------------------------------------------
export type WatchedListing = {
  id: string; source: "autoscout24" | "mobile.de" | "drugo"; url: string; title: string | null;
  price: number | null; status: ListingStatus; captured_at: string;
};

export async function listWatchedListings(): Promise<WatchedListing[]> {
  await requireAdmin();
  const { data } = await db().from("watched_listings").select("*").order("captured_at", { ascending: false }).limit(300);
  return (data ?? []) as WatchedListing[];
}

// Za odabir vozila u formama
export async function listVehicleOptions(): Promise<{ id: string; label: string }[]> {
  await requireAdmin();
  const { data } = await db().from("vehicles").select("id, make, model, variant, year, status").order("created_at", { ascending: false });
  return (data ?? []).map((v) => ({
    id: v.id,
    label: [v.make, v.model, v.variant, v.year].filter(Boolean).join(" "),
  }));
}
