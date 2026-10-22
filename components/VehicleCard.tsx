import Image from "next/image";
import Link from "next/link";
import { FUELS, GEARBOXES, formatEur, formatKm, photoUrl, vehicleTitle, type PublicVehicle } from "@/lib/vehicle-meta";

export default function VehicleCard({ v, dark = false }: { v: PublicVehicle; dark?: boolean }) {
  const specs = [v.year, formatKm(v.km), v.fuel && FUELS[v.fuel], v.gearbox && GEARBOXES[v.gearbox]].filter(Boolean);
  return (
    <Link
      href={`/vozila/${v.slug}`}
      className={`group flex flex-col overflow-hidden rounded-lg border transition-colors ${
        dark ? "border-white/10 bg-navy-soft hover:border-white/40" : "border-line bg-white hover:border-ink"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-paper">
        {v.images[0] ? (
          <Image
            src={photoUrl(v.images[0])}
            alt={vehicleTitle(v)}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-muted">Fotografije uskoro</div>
        )}
        {v.status === "rezervirano" && (
          <span className="absolute left-3 top-3 rounded bg-amber-500 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            Rezervirano
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className={`text-base font-semibold normal-case leading-snug ${dark ? "text-white" : ""}`}>{vehicleTitle(v)}</h3>
        <p className={`text-xs ${dark ? "text-white/60" : "text-muted"}`}>{specs.join(" · ")}</p>
        <div className="mt-auto pt-2 font-heading text-xl text-accent">{formatEur(v.listing_price)}</div>
      </div>
    </Link>
  );
}
