import { getAdmin } from "@/lib/admin/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { csvResponse, toCsv } from "@/lib/admin/csv";

// Izvoz prijevoza (prihod, trošak, zarada) za Excel.
export async function GET() {
  if (!(await getAdmin())) return new Response("Unauthorized", { status: 401 });
  const { data } = await getSupabaseServerClient()!
    .from("transport_jobs")
    .select("job_date, client_name, route, price_charged, cost")
    .order("job_date", { ascending: false });

  const rows = (data ?? []).map((j) => [
    j.job_date, j.client_name, j.route, Number(j.price_charged), Number(j.cost ?? 0),
    Number(j.price_charged) - Number(j.cost ?? 0),
  ]);
  return csvResponse(
    `autocaki-prijevozi-${new Date().toISOString().slice(0, 10)}.csv`,
    toCsv(["Datum", "Klijent", "Relacija", "Naplaćeno (€)", "Trošak (€)", "Zarada (€)"], rows),
  );
}
