import Link from "next/link";
import { getPublicVehicles } from "@/lib/vehicles";
import VehicleCard from "@/components/VehicleCard";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "Rabljeni automobili – ponuda vozila",
  description:
    "Aktualna ponuda provjerenih rabljenih automobila Auto Čaki. Vozila prolaze provjeru stanja i povijesti prije prodaje.",
  alternates: { canonical: "/vozila" },
};

export default async function VozilaPage() {
  const vehicles = await getPublicVehicles();

  return (
    <>
      <section className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-16">
          <span className="text-accent text-xs font-semibold tracking-[0.14em] uppercase">Prodaja</span>
          <h1 className="text-[clamp(1.8rem,5vw,2.8rem)] font-bold mt-2">Rabljeni automobili</h1>
          <p className="text-white/70 max-w-xl mt-3 leading-relaxed">
            Vozila u ponudi prolaze provjeru stanja i povijesti prije prodaje. Za dostupnost,
            probnu vožnju ili dodatne informacije kontaktirajte nas.
          </p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
          {vehicles.length === 0 ? (
            <div className="rounded-lg border border-line bg-white p-10 text-center">
              <h2 className="text-lg font-semibold mb-2">Nova ponuda uskoro</h2>
              <p className="text-sm text-muted max-w-md mx-auto mb-5">
                Trenutno pripremamo nova vozila. Tražite određeni model? Možemo ga pronaći i uvesti iz EU.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/usluge/uvoz" className="bg-accent text-white text-sm font-semibold px-5 py-2.5 rounded">
                  Uvoz po narudžbi
                </Link>
                <a href={SITE.instagram} className="border border-line text-sm font-semibold px-5 py-2.5 rounded">
                  Instagram
                </a>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted mb-6">
                {vehicles.length} {vehicles.length === 1 ? "vozilo" : "vozila"} u ponudi
              </p>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((v) => (
                  <VehicleCard key={v.id} v={v} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
