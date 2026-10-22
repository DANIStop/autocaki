"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { EU_COUNTRIES, HR_VAT } from "@/lib/admin/eu-vat";
import { parseMoney } from "@/lib/admin/parse";
import { saveImportCalc } from "@/lib/admin/module-actions";
import type { ImportBreakdown } from "@/lib/admin/modules";
import { inputClass } from "@/components/admin/ui";

const eur = new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const num = (s: string) => parseMoney(s) ?? 0;

export default function ImportCalculator({ prefill }: { prefill: { url?: string; price?: string; title?: string } }) {
  const router = useRouter();
  const [saving, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const [f, setF] = useState({
    make: prefill.title?.split(" ")[0] ?? "",
    model: prefill.title?.split(" ").slice(1).join(" ") ?? "",
    year: "",
    url: prefill.url ?? "",
    country: "DE",
    originVat: "19",
    price: prefill.price ?? "",
    vatDeductible: false,
    hrVatOn: false,
    transport: "",
    ppmv: "",
    homologation: "",
    registration: "",
    other: "",
    expectedSale: "",
  });
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((s) => ({ ...s, [k]: v }));

  const r = useMemo(() => {
    const price = num(f.price);
    const originVat = num(f.originVat);
    const net = f.vatDeductible ? price / (1 + originVat / 100) : price;
    const transport = num(f.transport);
    const ppmv = num(f.ppmv);
    const hrVat = f.vatDeductible && f.hrVatOn ? (net + transport) * (HR_VAT / 100) : 0;
    const homologation = num(f.homologation);
    const registration = num(f.registration);
    const other = num(f.other);
    const total = net + transport + ppmv + hrVat + homologation + registration + other;
    const expectedSale = parseMoney(f.expectedSale);
    const margin = expectedSale != null ? expectedSale - total : null;
    return { price, originVat, net, transport, ppmv, hrVat, homologation, registration, other, total, expectedSale, margin };
  }, [f]);

  function onCountry(code: string) {
    const c = EU_COUNTRIES.find((x) => x.code === code);
    setF((s) => ({ ...s, country: code, originVat: String(c?.vat ?? s.originVat) }));
  }

  function save() {
    setMsg(null);
    if (!r.price) return setMsg("Upišite cijenu vozila.");
    const b: ImportBreakdown = {
      make: f.make.trim() || undefined,
      model: f.model.trim() || undefined,
      year: Number.parseInt(f.year, 10) || null,
      url: f.url.trim() || null,
      price: r.price, vatDeductible: f.vatDeductible, originVat: r.originVat, net: round(r.net),
      transport: r.transport, ppmv: r.ppmv, hrVat: round(r.hrVat), homologation: r.homologation,
      registration: r.registration, other: r.other, total: round(r.total),
      expectedSale: r.expectedSale, margin: r.margin == null ? null : round(r.margin),
    };
    start(async () => {
      const res = await saveImportCalc(b, f.country);
      setMsg(res.error ? `Greška: ${res.error}` : "✓ Izračun spremljen.");
      router.refresh();
    });
  }

  const marginPct = r.margin != null && r.total > 0 ? (r.margin / r.total) * 100 : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="flex flex-col gap-5">
        <Box title="Vozilo">
          <In label="Marka" value={f.make} onChange={(v) => set("make", v)} placeholder="BMW" />
          <In label="Model" value={f.model} onChange={(v) => set("model", v)} placeholder="X5 xDrive30d" />
          <In label="Godište" value={f.year} onChange={(v) => set("year", v)} inputMode="numeric" />
          <label className="flex flex-col gap-1.5 text-sm font-medium sm:col-span-full">
            Poveznica oglasa
            <input value={f.url} onChange={(e) => set("url", e.target.value)} placeholder="https://www.mobile.de/…" className={inputClass} />
          </label>
        </Box>

        <Box title="Kupnja">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Država
            <select value={f.country} onChange={(e) => onCountry(e.target.value)} className={inputClass}>
              {EU_COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </label>
          <In label="Cijena u oglasu (€)" value={f.price} onChange={(v) => set("price", v)} inputMode="decimal" />
          <In label="PDV u državi kupnje (%)" value={f.originVat} onChange={(v) => set("originVat", v)} inputMode="decimal" />
          <label className="flex items-start gap-2.5 text-sm sm:col-span-full">
            <input type="checkbox" checked={f.vatDeductible} onChange={(e) => set("vatDeductible", e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--color-accent)]" />
            <span>
              <span className="font-medium">Cijena je s odbitnim PDV-om</span>
              <span className="block text-xs text-muted">(npr. „MwSt. ausweisbar“) — kupuje se po neto cijeni</span>
            </span>
          </label>
          {f.vatDeductible && (
            <label className="flex items-start gap-2.5 text-sm sm:col-span-full">
              <input type="checkbox" checked={f.hrVatOn} onChange={(e) => set("hrVatOn", e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--color-accent)]" />
              <span>
                <span className="font-medium">Uračunaj hrvatski PDV {HR_VAT}% u trošak</span>
                <span className="block text-xs text-muted">na (neto + prijevoz); isključite ako vam se PDV odbija</span>
              </span>
            </label>
          )}
        </Box>

        <Box title="Troškovi uvoza">
          <In label="Prijevoz (€)" value={f.transport} onChange={(v) => set("transport", v)} inputMode="decimal" />
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            <span className="flex items-center justify-between gap-2">
              PPMV (€)
              <a href="https://carina.gov.hr" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-accent">Carinska uprava ↗</a>
            </span>
            <input value={f.ppmv} onChange={(e) => set("ppmv", e.target.value)} inputMode="decimal" className={inputClass} />
          </label>
          <In label="Homologacija / tehnički (€)" value={f.homologation} onChange={(v) => set("homologation", v)} inputMode="decimal" />
          <In label="Registracija (€)" value={f.registration} onChange={(v) => set("registration", v)} inputMode="decimal" />
          <In label="Ostalo (€)" value={f.other} onChange={(v) => set("other", v)} inputMode="decimal" />
          <In label="Očekivana prodajna cijena (€)" value={f.expectedSale} onChange={(v) => set("expectedSale", v)} inputMode="decimal" />
        </Box>
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start rounded-lg bg-navy text-white p-5 flex flex-col gap-3">
        <h2 className="text-base font-semibold">Izračun</h2>
        <Row label={f.vatDeductible ? "Neto cijena" : "Cijena vozila"} value={r.net} />
        <Row label="Prijevoz" value={r.transport} />
        <Row label="PPMV" value={r.ppmv} />
        {r.hrVat > 0 && <Row label={`HR PDV ${HR_VAT}%`} value={r.hrVat} />}
        <Row label="Homologacija / tehnički" value={r.homologation} />
        <Row label="Registracija" value={r.registration} />
        <Row label="Ostalo" value={r.other} />
        <div className="border-t border-white/15 pt-3 flex justify-between items-baseline">
          <span className="text-sm text-white/70">Ukupno</span>
          <span className="font-heading text-3xl">{eur.format(r.total)}</span>
        </div>
        {r.margin != null && (
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-white/70">Marža</span>
            <span className={`font-heading text-2xl ${r.margin >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {eur.format(r.margin)}{marginPct != null && <span className="text-sm ml-1.5">({marginPct.toFixed(1)}%)</span>}
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="mt-2 bg-accent hover:bg-accent-dark disabled:opacity-60 text-white text-sm font-semibold py-3 rounded"
        >
          {saving ? "Spremanje…" : "Spremi izračun"}
        </button>
        {msg && <p className="text-sm text-white/80">{msg}</p>}
        <p className="text-[11px] text-white/45 leading-snug">
          Stope PDV-a i PPMV provjerite prije kupnje. Izračun je pomoćni alat, ne službeni obračun.
        </p>
      </aside>
    </div>
  );
}

const round = (n: number) => Math.round(n * 100) / 100;

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-lg border border-line bg-white p-5">
      <legend className="px-1 text-sm font-semibold">{title}</legend>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </fieldset>
  );
}

function In(props: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; inputMode?: "numeric" | "decimal" }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium">
      {props.label}
      <input value={props.value} onChange={(e) => props.onChange(e.target.value)} placeholder={props.placeholder} inputMode={props.inputMode} className={inputClass} />
    </label>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-white/70">{label}</span>
      <span className="font-semibold tabular-nums">{eur.format(value)}</span>
    </div>
  );
}
