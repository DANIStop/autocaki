import Link from "next/link";
import { Suspense } from "react";
import { EVENT_TYPES, listUpcomingEvents, listVehicleOptions } from "@/lib/admin/modules";
import { addEvent, deleteEvent } from "@/lib/admin/module-actions";
import { ActionButton, ActionForm, Field } from "@/components/admin/controls";
import { Card, PageTitle, Skeleton, inputClass } from "@/components/admin/ui";

const dayFmt = new Intl.DateTimeFormat("hr-HR", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Zagreb" });
const timeFmt = new Intl.DateTimeFormat("hr-HR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Zagreb" });
const keyFmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Zagreb" });

const TYPE_STYLE = {
  pregled: "bg-sky-50 text-sky-700",
  servis: "bg-amber-50 text-amber-700",
  preuzimanje: "bg-emerald-50 text-emerald-700",
  ostalo: "bg-zinc-100 text-zinc-600",
} as const;

export default function RasporedPage() {
  return (
    <>
      <PageTitle>Raspored</PageTitle>
      <Suspense fallback={<Skeleton rows={4} />}>
        <Content />
      </Suspense>
    </>
  );
}

async function Content() {
  const [events, vehicles] = await Promise.all([listUpcomingEvents(), listVehicleOptions()]);
  const today = keyFmt.format(new Date());
  const groups = new Map<string, typeof events>();
  for (const e of events) {
    const k = keyFmt.format(new Date(e.event_at));
    groups.set(k, [...(groups.get(k) ?? []), e]);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h2 className="text-sm font-semibold normal-case font-body mb-4">Novi termin</h2>
        <ActionForm action={addEvent} submitLabel="Dodaj u raspored" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Naslov *"><input name="title" required placeholder="Tehnički pregled — Golf" className={inputClass} /></Field>
          <Field label="Datum *"><input name="date" type="date" required className={inputClass} /></Field>
          <Field label="Vrijeme"><input name="time" type="time" defaultValue="09:00" className={inputClass} /></Field>
          <Field label="Vrsta">
            <select name="type" className={inputClass}>
              {Object.entries(EVENT_TYPES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </Field>
          <Field label="Vozilo">
            <select name="vehicle_id" className={inputClass}>
              <option value="">—</option>
              {vehicles.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
            </select>
          </Field>
        </ActionForm>
      </Card>

      {events.length === 0 ? (
        <p className="text-sm text-muted">Nema termina u sljedećih 60 dana.</p>
      ) : (
        [...groups.entries()].map(([k, list]) => (
          <section key={k}>
            <h2 className={`text-sm font-semibold mb-2 font-body normal-case ${k === today ? "text-accent" : ""}`}>
              {k === today ? "Danas · " : ""}{dayFmt.format(new Date(list[0].event_at))}
            </h2>
            <ul className="flex flex-col gap-2">
              {list.map((e) => (
                <li key={e.id} className="rounded-lg border border-line bg-white p-3.5 flex items-center gap-4">
                  <span className="font-heading text-lg w-14 shrink-0">{timeFmt.format(new Date(e.event_at))}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{e.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${TYPE_STYLE[e.type]}`}>{EVENT_TYPES[e.type]}</span>
                      {e.vehicle && <Link href={`/admin/vozila/${e.vehicle.id}`} className="text-xs text-accent">{e.vehicle.make} {e.vehicle.model}</Link>}
                    </div>
                  </div>
                  <ActionButton action={deleteEvent.bind(null, e.id)} confirmText="Obrisati termin?" className="text-muted hover:text-accent">✕</ActionButton>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
