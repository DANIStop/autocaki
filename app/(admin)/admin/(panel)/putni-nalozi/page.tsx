import { Suspense } from "react";
import { listTravelOrders, listVehicleOptions } from "@/lib/admin/modules";
import { addTravelOrder, deleteTravelOrder } from "@/lib/admin/module-actions";
import { ActionButton, ActionForm, Field } from "@/components/admin/controls";
import { Card, PageTitle, Skeleton, inputClass } from "@/components/admin/ui";

const eur = new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
const date = new Intl.DateTimeFormat("hr-HR", { day: "numeric", month: "numeric", year: "numeric" });

const COST_FIELDS = [
  ["gorivo", "Gorivo"], ["cestarine", "Cestarine"], ["vinjete_trajekt", "Vinjete / trajekt"],
  ["smjestaj", "Smještaj"], ["dnevnice", "Dnevnice"], ["ostalo", "Ostalo"],
] as const;

export default function PutniNaloziPage() {
  return (
    <>
      <PageTitle>Putni nalozi</PageTitle>
      <Suspense fallback={<Skeleton rows={5} />}>
        <Content />
      </Suspense>
    </>
  );
}

async function Content() {
  const [orders, vehicles] = await Promise.all([listTravelOrders(), listVehicleOptions()]);
  const vehicleLabel = new Map(vehicles.map((v) => [v.id, v.label]));

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h2 className="text-sm font-semibold normal-case font-body mb-4">Novi putni nalog</h2>
        <ActionForm action={addTravelOrder} submitLabel="Spremi nalog" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Datum *"><input name="travel_date" type="date" required className={inputClass} /></Field>
          <Field label="Odredište *"><input name="destination" required placeholder="Stuttgart" className={inputClass} /></Field>
          <Field label="Vozila (po želji)">
            <select name="vehicle_ids" multiple className={`${inputClass} h-24`}>
              {vehicles.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
            </select>
          </Field>
          {COST_FIELDS.map(([name, label]) => (
            <Field key={name} label={`${label} (€)`}><input name={name} inputMode="decimal" className={inputClass} /></Field>
          ))}
        </ActionForm>
      </Card>

      {orders.length === 0 ? (
        <p className="text-sm text-muted">Još nema putnih naloga.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {orders.map((o) => {
            const total = o.costs.reduce((s, c) => s + Number(c.amount), 0);
            return (
              <li key={o.id} className="rounded-lg border border-line bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-sm">{o.destination}</div>
                    <div className="text-xs text-muted mt-0.5">{date.format(new Date(o.travel_date))}{o.created_by && ` · ${o.created_by.split("@")[0]}`}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-sm">{eur.format(total)}</span>
                    <ActionButton action={deleteTravelOrder.bind(null, o.id)} confirmText="Obrisati putni nalog?" className="text-muted hover:text-accent">✕</ActionButton>
                  </div>
                </div>
                {o.costs.length > 0 && (
                  <div className="text-xs text-muted mt-2">{o.costs.map((c) => `${c.label} ${eur.format(c.amount)}`).join(" · ")}</div>
                )}
                {o.linked_vehicle_ids.length > 0 && (
                  <div className="text-xs mt-1">Vozila: {o.linked_vehicle_ids.map((id) => vehicleLabel.get(id) ?? "obrisano").join(", ")}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
