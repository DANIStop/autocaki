import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { listRepairJobs, REPAIR_STATUSES, type RepairStatus } from "@/lib/admin/modules";
import { setRepairStatus } from "@/lib/admin/module-actions";
import { photoUrl } from "@/lib/vehicle-meta";
import { ActionSelect } from "@/components/admin/controls";
import { PageTitle, Skeleton } from "@/components/admin/ui";

export default function ObradaPage() {
  return (
    <>
      <PageTitle>Obrada i štete</PageTitle>
      <p className="text-sm text-muted -mt-4 mb-6">Vozila koja se popravljaju. Obradu dodajete na stranici vozila.</p>
      <Suspense fallback={<Skeleton rows={4} />}>
        <Board />
      </Suspense>
    </>
  );
}

async function Board() {
  const jobs = await listRepairJobs();
  if (jobs.length === 0) return <p className="text-sm text-muted">Nijedno vozilo trenutno nije u obradi.</p>;
  const columns = Object.keys(REPAIR_STATUSES) as RepairStatus[];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {columns.map((s) => {
        const list = jobs.filter((j) => j.status === s);
        return (
          <section key={s} className="rounded-lg bg-white border border-line p-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3 font-body">
              {REPAIR_STATUSES[s]} · {list.length}
            </h2>
            <ul className="flex flex-col gap-2">
              {list.map((j) => (
                <li key={j.id} className="rounded border border-line p-2.5">
                  <Link href={`/admin/vozila/${j.vehicle_id}`} className="flex gap-2.5 items-center">
                    <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded bg-paper">
                      {j.vehicle?.images[0] && <Image src={photoUrl(j.vehicle.images[0])} alt="" fill sizes="56px" className="object-cover" />}
                    </div>
                    <span className="text-sm font-semibold leading-tight">{j.vehicle ? `${j.vehicle.make} ${j.vehicle.model}` : "Vozilo"}</span>
                  </Link>
                  {j.parts_needed.length > 0 && (
                    <ul className="mt-2 text-xs text-muted list-disc pl-4">
                      {j.parts_needed.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                  )}
                  <ActionSelect action={setRepairStatus.bind(null, j.id)} value={j.status} options={REPAIR_STATUSES} className="mt-2 w-full" />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
