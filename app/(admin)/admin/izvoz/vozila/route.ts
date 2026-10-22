import { getAdmin } from "@/lib/admin/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { csvResponse, toCsv } from "@/lib/admin/csv";
import { FUELS, GEARBOXES, VEHICLE_STATUSES, type Vehicle } from "@/lib/vehicle-meta";

// Izvoz svih vozila s troškovima i maržom (otvara se u Excelu).
export async function GET() {
  if (!(await getAdmin())) return new Response("Unauthorized", { status: 401 });
  const supabase = getSupabaseServerClient()!;
  const [{ data: vehicles }, { data: costs }] = await Promise.all([
    supabase.from("vehicles").select("*").order("created_at", { ascending: false }),
    supabase.from("vehicle_costs").select("vehicle_id, amount"),
  ]);
  const costByVehicle = new Map<string, number>();
  for (const c of costs ?? []) costByVehicle.set(c.vehicle_id, (costByVehicle.get(c.vehicle_id) ?? 0) + Number(c.amount));

  const rows = ((vehicles ?? []) as Vehicle[]).map((v) => {
    const extra = costByVehicle.get(v.id) ?? 0;
    const invested = v.purchase_price != null ? Number(v.purchase_price) + extra : null;
    const revenue = v.sale_price ?? v.listing_price;
    return [
      v.make, v.model, v.variant, v.year, v.km, v.fuel ? FUELS[v.fuel] : null, v.gearbox ? GEARBOXES[v.gearbox] : null,
      v.power_kw, v.vin, VEHICLE_STATUSES[v.status], v.purchase_price, extra, invested, v.listing_price, v.sale_price,
      invested != null && revenue != null ? Number(revenue) - invested : null,
      v.created_at.slice(0, 10), v.sold_at?.slice(0, 10) ?? null,
    ];
  });

  const header = [
    "Marka", "Model", "Izvedba", "Godište", "Km", "Gorivo", "Mjenjač", "kW", "VIN", "Status",
    "Nabavna (€)", "Troškovi (€)", "Ukupno uloženo (€)", "Oglasna (€)", "Prodajna (€)", "Marža (€)", "Dodano", "Prodano",
  ];
  return csvResponse(`autocaki-vozila-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(header, rows));
}
