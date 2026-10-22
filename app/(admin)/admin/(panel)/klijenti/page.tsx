import Link from "next/link";
import { Suspense } from "react";
import { listClients } from "@/lib/admin/modules";
import { PageTitle, Skeleton, inputClass } from "@/components/admin/ui";

export default function KlijentiPage({ searchParams }: PageProps<"/admin/klijenti">) {
  return (
    <>
      <PageTitle action={<Link href="/admin/klijenti/novi" className="bg-accent text-white text-sm font-semibold px-4 py-2.5 rounded">+ Novi klijent</Link>}>
        Klijenti
      </PageTitle>
      <Suspense fallback={<Skeleton rows={5} />}>
        <List searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function List({ searchParams }: Pick<PageProps<"/admin/klijenti">, "searchParams">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  const clients = await listClients(query || undefined);

  return (
    <>
      <form className="mb-4">
        <input name="q" defaultValue={query} placeholder="Traži po imenu, telefonu ili e-mailu…" className={inputClass} />
      </form>
      {clients.length === 0 ? (
        <p className="text-sm text-muted">{query ? "Nema rezultata." : "Još nema klijenata. Upit se jednim klikom može pretvoriti u klijenta."}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {clients.map((c) => (
            <li key={c.id}>
              <Link href={`/admin/klijenti/${c.id}`} className="flex items-center justify-between gap-4 rounded-lg border border-line bg-white p-4 hover:border-ink">
                <div className="min-w-0">
                  <div className="font-semibold text-sm flex items-center gap-2">
                    {c.name}
                    {c.flag === "bitan" && <span className="text-[11px] font-bold text-accent">★ BITAN</span>}
                    {c.flag === "ignoriraj" && <span className="text-[11px] font-bold text-muted">IGNORIRAJ</span>}
                  </div>
                  <div className="text-xs text-muted truncate mt-0.5">{[c.phone, c.email].filter(Boolean).join(" · ")}</div>
                </div>
                <span className="text-muted">→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
