import Link from "next/link";
import { Suspense } from "react";
import { getDashboardStats, listInquiries } from "@/lib/admin/data";
import { formatEur, VEHICLE_STATUSES, type VehicleStatus } from "@/lib/vehicles";
import { Card, PageTitle, Skeleton } from "@/components/admin/ui";

export default function DashboardPage() {
  return (
    <>
      <PageTitle
        action={
          <Link href="/admin/vozila/novo" className="bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-4 py-2.5 rounded">
            + Novo vozilo
          </Link>
        }
      >
        Pregled
      </PageTitle>
      <Suspense fallback={<Skeleton rows={4} />}>
        <Dashboard />
      </Suspense>
    </>
  );
}

async function Dashboard() {
  const [stats, inquiries] = await Promise.all([getDashboardStats(), listInquiries(5)]);
  const order: VehicleStatus[] = ["u_ponudi", "rezervirano", "na_obradi", "prodano"];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {order.map((s) => (
          <Link key={s} href={`/admin/vozila?status=${s}`}>
            <Card className="hover:border-ink transition-colors">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">{VEHICLE_STATUSES[s]}</div>
              <div className="font-heading text-3xl mt-1">{stats.byStatus[s]}</div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted">Vrijednost ponude</div>
          <div className="font-heading text-3xl mt-1">{formatEur(stats.stockValue)}</div>
          <div className="text-xs text-muted mt-1">zbroj oglasnih cijena vozila u ponudi i rezerviranih</div>
        </Card>
        <Card>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted">Upiti (7 dana)</div>
          <div className="font-heading text-3xl mt-1">{stats.inquiriesWeek}</div>
          <div className="text-xs text-muted mt-1">s kontakt forme i oglasa</div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Zadnji upiti</h2>
          <Link href="/admin/upiti" className="text-sm font-semibold text-accent">Svi →</Link>
        </div>
        {inquiries.length === 0 ? (
          <p className="text-sm text-muted">Još nema upita.</p>
        ) : (
          <ul className="divide-y divide-line">
            {inquiries.map((q) => (
              <li key={q.id} className="py-3 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{q.name}</div>
                  <div className="text-sm text-muted truncate">{q.message}</div>
                </div>
                <a href={`tel:${q.phone}`} className="shrink-0 text-sm font-semibold text-accent">{q.phone}</a>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
