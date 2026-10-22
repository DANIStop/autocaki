import Link from "next/link";
import { Suspense } from "react";
import { listImportCalcs } from "@/lib/admin/modules";
import { createVehicleFromCalc, deleteImportCalc } from "@/lib/admin/module-actions";
import { EU_COUNTRIES } from "@/lib/admin/eu-vat";
import ImportCalculator from "@/components/admin/ImportCalculator";
import { ActionButton } from "@/components/admin/controls";
import { PageTitle, Skeleton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";

const eur = new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export default function KalkulatorPage({ searchParams }: PageProps<"/admin/kalkulator">) {
  return (
    <>
      <PageTitle>Kalkulator uvoza</PageTitle>
      <Suspense fallback={<Skeleton rows={4} />}>
        <Calculator searchParams={searchParams} />
      </Suspense>
      <h2 className="text-lg font-semibold mt-10 mb-4">Spremljeni izračuni</h2>
      <Suspense fallback={<Skeleton rows={3} />}>
        <SavedCalcs />
      </Suspense>
    </>
  );
}

async function Calculator({ searchParams }: Pick<PageProps<"/admin/kalkulator">, "searchParams">) {
  await requireAdmin();
  const sp = await searchParams;
  const str = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);
  return <ImportCalculator prefill={{ url: str(sp.url), price: str(sp.price), title: str(sp.title) }} />;
}

async function SavedCalcs() {
  const calcs = await listImportCalcs();
  if (calcs.length === 0) return <p className="text-sm text-muted">Još nema spremljenih izračuna.</p>;
  return (
    <ul className="flex flex-col gap-2">
      {calcs.map((c) => {
        const b = c.breakdown;
        const country = EU_COUNTRIES.find((x) => x.code === c.origin_country)?.name ?? c.origin_country;
        return (
          <li key={c.id} className="rounded-lg border border-line bg-white p-4 flex flex-wrap items-center gap-4 justify-between">
            <div className="min-w-0">
              <div className="font-semibold text-sm">{c.vehicle_description || "Vozilo"} <span className="text-muted font-normal">· {country}</span></div>
              <div className="text-xs text-muted mt-0.5">
                Ukupno {eur.format(b.total)}
                {b.margin != null && <> · marža <span className={b.margin >= 0 ? "text-emerald-700 font-semibold" : "text-accent font-semibold"}>{eur.format(b.margin)}</span></>}
                {b.url && <> · <a href={b.url} target="_blank" rel="noopener noreferrer" className="text-accent">oglas ↗</a></>}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {b.vehicleId ? (
                <Link href={`/admin/vozila/${b.vehicleId}`} className="text-sm font-semibold text-accent">Vozilo →</Link>
              ) : (
                <ActionButton action={createVehicleFromCalc.bind(null, c.id)} confirmText="Napraviti vozilo (status „na obradi“) s troškovima iz ovog izračuna?" className="text-sm font-semibold text-white bg-navy px-3 py-2 rounded">
                  Napravi vozilo
                </ActionButton>
              )}
              <ActionButton action={deleteImportCalc.bind(null, c.id)} confirmText="Obrisati izračun?" className="text-sm text-muted hover:text-accent">
                ✕
              </ActionButton>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
