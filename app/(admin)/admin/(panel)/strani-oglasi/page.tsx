import Link from "next/link";
import { Suspense } from "react";
import { LISTING_STATUSES, listWatchedListings } from "@/lib/admin/modules";
import { addWatchedListing, deleteWatchedListing, setListingStatus } from "@/lib/admin/module-actions";
import { ActionButton, ActionForm, ActionSelect, Field } from "@/components/admin/controls";
import { Card, PageTitle, Skeleton, inputClass } from "@/components/admin/ui";

const eur = new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const SOURCE = { autoscout24: "AutoScout24", "mobile.de": "mobile.de", drugo: "Ostalo" } as const;

export default function StraniOglasiPage() {
  return (
    <>
      <PageTitle>Strani oglasi</PageTitle>
      <p className="text-sm text-muted -mt-4 mb-6">Spremite zanimljive oglase s mobile.de, AutoScout24 i drugih portala i izračunajte uvoz.</p>
      <Suspense fallback={<Skeleton rows={4} />}>
        <Content />
      </Suspense>
    </>
  );
}

async function Content() {
  const listings = await listWatchedListings();
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <ActionForm action={addWatchedListing} submitLabel="Spremi oglas" className="grid gap-4 sm:grid-cols-[2fr_1.5fr_8rem]">
          <Field label="Poveznica *"><input name="url" type="url" required placeholder="https://suchen.mobile.de/…" className={inputClass} /></Field>
          <Field label="Naziv"><input name="title" placeholder="BMW X5 xDrive30d 2019" className={inputClass} /></Field>
          <Field label="Cijena (€)"><input name="price" inputMode="decimal" className={inputClass} /></Field>
        </ActionForm>
      </Card>

      {listings.length === 0 ? (
        <p className="text-sm text-muted">Još nema spremljenih oglasa.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {listings.map((l) => {
            const calc = `/admin/kalkulator?${new URLSearchParams({ url: l.url, ...(l.price ? { price: String(l.price) } : {}), ...(l.title ? { title: l.title } : {}) })}`;
            return (
              <li key={l.id} className={`rounded-lg border border-line bg-white p-4 flex flex-wrap items-center justify-between gap-3 ${l.status === "odbaceno" ? "opacity-50" : ""}`}>
                <div className="min-w-0">
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-sm hover:text-accent">
                    {l.title || l.url.replace(/^https?:\/\/(www\.)?/, "").slice(0, 60)} ↗
                  </a>
                  <div className="text-xs text-muted mt-0.5">{SOURCE[l.source]}{l.price != null && ` · ${eur.format(l.price)}`}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Link href={calc} className="text-xs font-semibold text-white bg-navy px-3 py-2 rounded">Izračunaj uvoz</Link>
                  <ActionSelect action={setListingStatus.bind(null, l.id)} value={l.status} options={LISTING_STATUSES} />
                  <ActionButton action={deleteWatchedListing.bind(null, l.id)} confirmText="Obrisati oglas?" className="text-muted hover:text-accent">✕</ActionButton>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
