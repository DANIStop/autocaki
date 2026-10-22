"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addVehicleCost, deleteVehicleCost } from "@/lib/admin/actions";
import type { VehicleCost } from "@/lib/admin/data";
import { inputClass } from "@/components/admin/ui";

const eur = new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });

export default function CostsPanel({
  vehicleId,
  costs,
  purchasePrice,
  listingPrice,
  salePrice,
}: {
  vehicleId: string;
  costs: VehicleCost[];
  purchasePrice: number | null;
  listingPrice: number | null;
  salePrice: number | null;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(addVehicleCost.bind(null, vehicleId), undefined);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state, router]);

  const costsTotal = costs.reduce((s, c) => s + Number(c.amount), 0);
  const totalIn = Number(purchasePrice ?? 0) + costsTotal;
  const revenue = salePrice ?? listingPrice;
  const margin = revenue != null && purchasePrice != null ? Number(revenue) - totalIn : null;

  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <h2 className="text-sm font-semibold normal-case font-body mb-4">Troškovi i marža (interno)</h2>

      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 text-sm">
        <Stat label="Nabava" value={purchasePrice == null ? "—" : eur.format(purchasePrice)} />
        <Stat label="Troškovi" value={eur.format(costsTotal)} />
        <Stat label="Ukupno uloženo" value={eur.format(totalIn)} />
        <Stat
          label={salePrice != null ? "Ostvarena marža" : "Očekivana marža"}
          value={margin == null ? "—" : eur.format(margin)}
          tone={margin == null ? undefined : margin >= 0 ? "pos" : "neg"}
        />
      </dl>

      {costs.length > 0 && (
        <ul className="divide-y divide-line mb-4 border-y border-line">
          {costs.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
              <div className="min-w-0">
                <span className="font-medium">{c.note || (c.type === "fiksni" ? "Fiksni trošak" : "Dodatni trošak")}</span>
                <span className="text-xs text-muted ml-2">{c.type} · {c.added_by.split("@")[0]}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-semibold">{eur.format(c.amount)}</span>
                <button
                  type="button"
                  aria-label="Obriši trošak"
                  onClick={() =>
                    confirm("Obrisati trošak?") &&
                    startTransition(async () => {
                      await deleteVehicleCost(c.id);
                      router.refresh();
                    })
                  }
                  className="text-muted hover:text-accent"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form ref={formRef} action={action} className="grid gap-3 sm:grid-cols-[1fr_8rem_8rem_auto] items-end">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Opis
          <input name="note" placeholder="npr. prijevoz, registracija, lakiranje" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Iznos (€)
          <input name="amount" inputMode="decimal" required className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Vrsta
          <select name="type" className={inputClass}>
            <option value="dodatni">Dodatni</option>
            <option value="fiksni">Fiksni</option>
          </select>
        </label>
        <button disabled={pending} className="bg-navy text-white text-sm font-semibold px-4 py-2.5 rounded disabled:opacity-60">
          {pending ? "…" : "Dodaj"}
        </button>
      </form>
      {state?.error && <p className="text-sm text-accent mt-2">{state.error}</p>}
      {state?.ok && <p className="text-sm text-emerald-600 font-semibold mt-2">✓ {state.ok}</p>}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "pos" | "neg" }) {
  return (
    <div className="rounded bg-paper px-3 py-2.5">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</dt>
      <dd className={`font-semibold mt-0.5 ${tone === "pos" ? "text-emerald-700" : tone === "neg" ? "text-accent" : ""}`}>{value}</dd>
    </div>
  );
}
