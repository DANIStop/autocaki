import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import VehicleGallery from "@/components/VehicleGallery";
import {
  FUELS, GEARBOXES, formatEur, formatKm, getPublicVehicle, photoUrl, vehicleTitle,
} from "@/lib/vehicles";
import { SITE } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/vozila/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const v = await getPublicVehicle(slug);
  if (!v) return { title: "Vozilo nije pronađeno" };
  const title = `${vehicleTitle(v)}${v.year ? ` (${v.year})` : ""}`;
  return {
    title,
    description: [vehicleTitle(v), v.year, formatKm(v.km), v.fuel && FUELS[v.fuel], formatEur(v.listing_price)]
      .filter(Boolean)
      .join(" · "),
    alternates: { canonical: `/vozila/${v.slug}` },
    openGraph: v.images[0] ? { images: [{ url: photoUrl(v.images[0]) }] } : undefined,
  };
}

export default function VoziloPage({ params }: PageProps<"/vozila/[slug]">) {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-5 sm:px-8 py-16"><div className="aspect-[4/3] max-w-3xl rounded-lg bg-paper animate-pulse" /></div>}>
      <VehicleDetail params={params} />
    </Suspense>
  );
}

async function VehicleDetail({ params }: Pick<PageProps<"/vozila/[slug]">, "params">) {
  const { slug } = await params;
  const v = await getPublicVehicle(slug);
  if (!v) notFound();

  const title = vehicleTitle(v);
  const sold = v.status === "prodano";
  const specs: [string, string | null][] = [
    ["Godište", v.year ? String(v.year) : null],
    ["Kilometraža", v.km != null ? formatKm(v.km) : null],
    ["Gorivo", v.fuel ? FUELS[v.fuel] : null],
    ["Mjenjač", v.gearbox ? GEARBOXES[v.gearbox] : null],
    ["Snaga", v.power_kw ? `${v.power_kw} kW (${Math.round(v.power_kw * 1.36)} KS)` : null],
    ["Karoserija", v.body_type],
    ["Boja", v.color],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: title,
    brand: { "@type": "Brand", name: v.make },
    model: v.model,
    vehicleModelDate: v.year ?? undefined,
    mileageFromOdometer: v.km != null ? { "@type": "QuantitativeValue", value: v.km, unitCode: "KMT" } : undefined,
    image: v.images.map(photoUrl),
    url: `${SITE.url}/vozila/${v.slug}`,
    offers:
      v.listing_price != null
        ? {
            "@type": "Offer",
            price: v.listing_price,
            priceCurrency: "EUR",
            availability: sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
            seller: { "@id": `${SITE.url}/#firma` },
          }
        : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-6 pb-16">
        <Link href="/vozila" className="text-sm text-muted hover:text-ink">← Sva vozila</Link>

        <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_22rem]">
          <div className="min-w-0">
            <VehicleGallery urls={v.images.map(photoUrl)} alt={title} />
          </div>

          <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
            <div>
              {v.status !== "u_ponudi" && (
                <span className={`inline-block mb-2 rounded px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white ${sold ? "bg-zinc-500" : "bg-amber-500"}`}>
                  {sold ? "Prodano" : "Rezervirano"}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{title}</h1>
              <div className="font-heading text-3xl text-accent mt-3">{formatEur(v.listing_price)}</div>
            </div>

            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line text-sm">
              {specs.filter(([, val]) => val).map(([label, val]) => (
                <div key={label} className="bg-white px-3.5 py-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</dt>
                  <dd className="font-semibold mt-0.5">{val}</dd>
                </div>
              ))}
            </dl>

            {!sold && (
              <div className="grid grid-cols-2 gap-2">
                <a href={`tel:${SITE.phone}`} className="text-center bg-navy text-white text-sm font-semibold py-3 rounded">
                  Nazovite
                </a>
                <a
                  href={`https://wa.me/${SITE.phone.replace("+", "")}?text=${encodeURIComponent(`Pozdrav, zanima me ${title} (${SITE.url}/vozila/${v.slug})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center bg-[#25D366] text-white text-sm font-semibold py-3 rounded"
                >
                  WhatsApp
                </a>
              </div>
            )}
          </aside>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
          <div>
            {v.description && (
              <>
                <h2 className="text-xl font-semibold mb-3">Opis</h2>
                <p className="text-sm sm:text-base text-muted leading-relaxed whitespace-pre-line">{v.description}</p>
              </>
            )}
          </div>
          {!sold && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Pošaljite upit</h2>
              <ContactForm defaultSubject={`Upit za vozilo: ${title}`} vehicleId={v.id} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
