"use client";

import { startTransition, useActionState, useEffect, useState, type FormEvent } from "react";
import { saveVehicle } from "@/lib/admin/actions";
import { FUELS, GEARBOXES, VEHICLE_STATUSES, type Vehicle } from "@/lib/vehicle-meta";
import { inputClass } from "@/components/admin/ui";

const BODY_TYPES = ["Limuzina", "Karavan", "Hatchback", "SUV", "Coupe", "Kabriolet", "Monovolumen", "Kombi", "Pick-up"];

export default function VehicleForm({ vehicle }: { vehicle?: Vehicle }) {
  const [state, action, pending] = useActionState(saveVehicle, undefined);
  const [toast, setToast] = useState<string | null>(null);

  // Kratka potvrda „Spremljeno.“ nakon svake uspješne izmjene.
  useEffect(() => {
    if (!state?.ok) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToast(state.ok);
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [state]);

  // Ručni submit: React inače resetira formu nakon akcije, pa bi se kod greške izgubili upisani podaci.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  };

  const v = vehicle;
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {v && <input type="hidden" name="id" value={v.id} />}

      <Section title="Osnovno">
        <Field label="Marka *"><input name="make" required defaultValue={v?.make} placeholder="BMW" className={inputClass} /></Field>
        <Field label="Model *"><input name="model" required defaultValue={v?.model} placeholder="X5" className={inputClass} /></Field>
        <Field label="Izvedba"><input name="variant" defaultValue={v?.variant ?? ""} placeholder="xDrive30d M Sport" className={inputClass} /></Field>
        <Field label="Godište"><input name="year" inputMode="numeric" defaultValue={v?.year ?? ""} placeholder="2019" className={inputClass} /></Field>
        <Field label="Kilometraža"><input name="km" inputMode="numeric" defaultValue={v?.km ?? ""} placeholder="145000" className={inputClass} /></Field>
        <Field label="Snaga (kW)"><input name="power_kw" inputMode="numeric" defaultValue={v?.power_kw ?? ""} placeholder="195" className={inputClass} /></Field>
        <Field label="Gorivo">
          <select name="fuel" defaultValue={v?.fuel ?? ""} className={inputClass}>
            <option value="">—</option>
            {Object.entries(FUELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </Field>
        <Field label="Mjenjač">
          <select name="gearbox" defaultValue={v?.gearbox ?? ""} className={inputClass}>
            <option value="">—</option>
            {Object.entries(GEARBOXES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </Field>
        <Field label="Karoserija">
          <select name="body_type" defaultValue={v?.body_type ?? ""} className={inputClass}>
            <option value="">—</option>
            {BODY_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </Field>
        <Field label="Boja"><input name="color" defaultValue={v?.color ?? ""} className={inputClass} /></Field>
        <Field label="VIN (interno)"><input name="vin" defaultValue={v?.vin ?? ""} className={inputClass} /></Field>
      </Section>

      <Section title="Cijene i status">
        <Field label="Oglasna cijena (€)"><input name="listing_price" inputMode="decimal" defaultValue={v?.listing_price ?? ""} className={inputClass} /></Field>
        <Field label="Nabavna cijena (€, interno)"><input name="purchase_price" inputMode="decimal" defaultValue={v?.purchase_price ?? ""} className={inputClass} /></Field>
        <Field label="Prodajna cijena (€, kad se proda)"><input name="sale_price" inputMode="decimal" defaultValue={v?.sale_price ?? ""} className={inputClass} /></Field>
        <Field label="Status">
          <select name="status" defaultValue={v?.status ?? "u_ponudi"} className={inputClass}>
            {Object.entries(VEHICLE_STATUSES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </Field>
        <label className="flex items-center gap-2.5 text-sm font-medium sm:col-span-2">
          <input type="checkbox" name="featured" defaultChecked={v?.featured} className="h-4 w-4 accent-[var(--color-accent)]" />
          Izdvoji na naslovnoj stranici
        </label>
      </Section>

      <Section title="Opis oglasa">
        <div className="sm:col-span-2">
          <textarea
            name="description"
            rows={7}
            defaultValue={v?.description ?? ""}
            placeholder="Oprema, servisna povijest, stanje vozila…"
            className={`${inputClass} resize-y`}
          />
        </div>
      </Section>

      {state?.error && <p className="text-sm text-accent">{state.error}</p>}

      <div className="sticky bottom-20 md:bottom-4 z-20 flex justify-end">
        <button
          disabled={pending}
          className="bg-accent hover:bg-accent-dark disabled:opacity-60 text-white text-sm font-semibold px-6 py-3 rounded shadow-lg shadow-black/10"
        >
          {pending ? "Spremanje…" : v ? "Spremi izmjene" : "Spremi i dodaj fotografije"}
        </button>
      </div>

      {toast && (
        <div role="status" className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded bg-navy text-white text-sm font-semibold px-4 py-2.5 shadow-lg">
          ✓ {toast}
        </div>
      )}
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-lg border border-line bg-white p-5">
      <legend className="px-1 text-sm font-semibold">{title}</legend>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </fieldset>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}
