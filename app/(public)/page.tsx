import Link from "next/link";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import VehicleCard from "@/components/VehicleCard";
import { getPublicVehicles } from "@/lib/vehicles";
import { SITE } from "@/lib/site";

const SERVICES = [
  {
    n: "01",
    title: "Prodaja vozila",
    body: "Rabljeni automobili koji prije prodaje prolaze provjeru stanja i povijesti vozila.",
    href: "/vozila",
  },
  {
    n: "02",
    title: "Uvoz iz EU",
    body: "Uvoz vozila iz Njemačke, Austrije, Italije, Belgije, Nizozemske i drugih zemalja EU, prema zahtjevima klijenta.",
    href: "/usluge/uvoz",
  },
  {
    n: "03",
    title: "Prijevoz vozila",
    body: "Prijevoz vlastitim transportnim vozilom i autoprikolicom, do dva automobila, na području Hrvatske i Europe.",
    href: "/usluge/prijevoz",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="bg-navy-soft">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-14">
          <Stats />
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-10">Čime se bavimo</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {SERVICES.map((item) => (
              <Link key={item.n} href={item.href} className="group flex flex-col gap-3 border-t border-line pt-6">
                <span className="font-heading text-4xl text-accent">{item.n}</span>
                <h3 className="text-lg font-semibold normal-case">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.body}</p>
                <span className="text-sm font-semibold text-accent group-hover:translate-x-1 transition-transform">
                  Više →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TODO: galerija „Naš rad“ i recenzije klijenata (components/Testimonials) —
          vratiti kad stignu stvarne fotografije i stvarne recenzije. */}

      <LatestVehicles />
    </>
  );
}

async function LatestVehicles() {
  const vehicles = (await getPublicVehicles()).slice(0, 6);

  return (
    <section className="bg-paper">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold">Ponuda vozila</h2>
          {vehicles.length > 0 && (
            <Link href="/vozila" className="text-sm font-semibold text-accent">
              Sva vozila →
            </Link>
          )}
        </div>

        {vehicles.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v) => (
              <VehicleCard key={v.id} v={v} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-line bg-white p-8 sm:p-10 text-center">
            <p className="text-muted max-w-xl mx-auto">
              Nova ponuda rabljenih vozila uskoro. Tražite određeni model? Pronaći ćemo ga i
              uvesti iz EU prema vašim zahtjevima.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Link href="/usluge/uvoz" className="bg-accent text-white text-sm font-semibold px-5 py-2.5 rounded">
                Uvoz po narudžbi
              </Link>
              <a href={SITE.instagram} className="border border-line text-sm font-semibold px-5 py-2.5 rounded">
                Instagram
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
