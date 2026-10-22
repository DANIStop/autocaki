import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { listVehicles } from "@/lib/admin/data";
import { formatEur, formatKm, photoUrl, VEHICLE_STATUSES, vehicleTitle, type VehicleStatus } from "@/lib/vehicles";
import { PageTitle, Skeleton, StatusBadge } from "@/components/admin/ui";

export default function VozilaPage({ searchParams }: PageProps<"/admin/vozila">) {
  return (
    <>
      <PageTitle
        action={
          <div className="flex items-center gap-4">
          <a href="/admin/izvoz/vozila" className="hidden sm:inline text-sm font-semibold text-accent">⬇ Excel</a>
          <Link href="/admin/vozila/novo" className="bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-4 py-2.5 rounded">
            + Novo vozilo
          </Link>
          </div>
        }
      >
        Vozila
      </PageTitle>
      <Suspense fallback={<Skeleton rows={5} />}>
        <VehicleList searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function VehicleList({ searchParams }: Pick<PageProps<"/admin/vozila">, "searchParams">) {
  const { status: raw } = await searchParams;
  const status = typeof raw === "string" && raw in VEHICLE_STATUSES ? (raw as VehicleStatus) : undefined;
  const vehicles = await listVehicles(status);

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4 -mx-1 px-1">
        <Filter href="/admin/vozila" active={!status}>Sva</Filter>
        {(Object.keys(VEHICLE_STATUSES) as VehicleStatus[]).map((s) => (
          <Filter key={s} href={`/admin/vozila?status=${s}`} active={status === s}>
            {VEHICLE_STATUSES[s]}
          </Filter>
        ))}
      </div>

      {vehicles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line bg-white p-10 text-center">
          <p className="text-sm text-muted mb-4">Nema vozila{status ? " s ovim statusom" : ""}.</p>
          <Link href="/admin/vozila/novo" className="text-sm font-semibold text-accent">+ Dodaj prvo vozilo</Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {vehicles.map((v) => (
            <li key={v.id}>
              <Link
                href={`/admin/vozila/${v.id}`}
                className="flex items-center gap-4 rounded-lg border border-line bg-white p-3 hover:border-ink transition-colors"
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded bg-paper">
                  {v.images[0] && (
                    <Image src={photoUrl(v.images[0])} alt="" fill sizes="96px" className="object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm truncate">{vehicleTitle(v)}</span>
                    <StatusBadge status={v.status} />
                    {v.featured && <span className="text-[11px] font-semibold text-accent">★ Izdvojeno</span>}
                  </div>
                  <div className="text-xs text-muted mt-1">
                    {[v.year, formatKm(v.km)].filter(Boolean).join(" · ")}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold text-sm">{formatEur(v.listing_price)}</div>
                  <div className="text-xs text-muted">{v.images.length} foto</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function Filter({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
        active ? "bg-navy text-white border-navy" : "bg-white border-line text-muted hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}
