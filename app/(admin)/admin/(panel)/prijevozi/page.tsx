import { Suspense } from "react";
import { listTransportJobs, listTravelOrders } from "@/lib/admin/modules";
import { addTransportJob, deleteTransportJob } from "@/lib/admin/module-actions";
import { ActionButton, ActionForm, Field } from "@/components/admin/controls";
import { Card, PageTitle, Skeleton, inputClass } from "@/components/admin/ui";

const eur = new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const date = new Intl.DateTimeFormat("hr-HR", { day: "numeric", month: "numeric", year: "numeric" });

export default function PrijevoziPage() {
  return (
    <>
      <PageTitle action={<a href="/admin/izvoz/prijevozi" className="text-sm font-semibold text-accent">⬇ Excel</a>}>Prijevozi</PageTitle>
      <Suspense fallback={<Skeleton rows={5} />}>
        <Content />
      </Suspense>
    </>
  );
}

async function Content() {
  const [jobs, orders] = await Promise.all([listTransportJobs(), listTravelOrders()]);
  const month = new Date().toISOString().slice(0, 7);
  const thisMonth = jobs.filter((j) => j.job_date.startsWith(month));
  const income = thisMonth.reduce((s, j) => s + Number(j.price_charged), 0);
  const cost = thisMonth.reduce((s, j) => s + Number(j.cost ?? 0), 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-3">
        <Card><Stat label="Prihod (mjesec)" value={eur.format(income)} /></Card>
        <Card><Stat label="Trošak (mjesec)" value={eur.format(cost)} /></Card>
        <Card><Stat label="Zarada (mjesec)" value={eur.format(income - cost)} tone={income - cost >= 0 ? "pos" : "neg"} /></Card>
      </div>

      <Card>
        <h2 className="text-sm font-semibold normal-case font-body mb-4">Novi prijevoz</h2>
        <ActionForm action={addTransportJob} submitLabel="Dodaj prijevoz" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Klijent *"><input name="client_name" required className={inputClass} /></Field>
          <Field label="Relacija *"><input name="route" required placeholder="München → Zagreb" className={inputClass} /></Field>
          <Field label="Datum"><input name="job_date" type="date" className={inputClass} /></Field>
          <Field label="Naplaćeno (€) *"><input name="price_charged" required inputMode="decimal" className={inputClass} /></Field>
          <Field label="Trošak (€)"><input name="cost" inputMode="decimal" placeholder="gorivo, cestarine…" className={inputClass} /></Field>
          <Field label="Putni nalog">
            <select name="travel_order_id" className={inputClass}>
              <option value="">—</option>
              {orders.map((o) => <option key={o.id} value={o.id}>{date.format(new Date(o.travel_date))} · {o.destination}</option>)}
            </select>
          </Field>
        </ActionForm>
      </Card>

      {jobs.length === 0 ? (
        <p className="text-sm text-muted">Još nema prijevoza.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {jobs.map((j) => {
            const profit = Number(j.price_charged) - Number(j.cost ?? 0);
            return (
              <li key={j.id} className="rounded-lg border border-line bg-white p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-sm">{j.route}</div>
                  <div className="text-xs text-muted mt-0.5">{date.format(new Date(j.job_date))} · {j.client_name}</div>
                </div>
                <div className="flex items-center gap-5 text-sm">
                  <span>{eur.format(j.price_charged)}</span>
                  <span className="text-muted">−{eur.format(j.cost ?? 0)}</span>
                  <span className={`font-semibold ${profit >= 0 ? "text-emerald-700" : "text-accent"}`}>{eur.format(profit)}</span>
                  <ActionButton action={deleteTransportJob.bind(null, j.id)} confirmText="Obrisati prijevoz?" className="text-muted hover:text-accent">✕</ActionButton>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "pos" | "neg" }) {
  return (
    <>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</div>
      <div className={`font-heading text-xl sm:text-2xl mt-1 ${tone === "pos" ? "text-emerald-700" : tone === "neg" ? "text-accent" : ""}`}>{value}</div>
    </>
  );
}
