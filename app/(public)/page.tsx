import Link from "next/link";
import Testimonials from "@/components/Testimonials";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24 flex flex-col gap-6">
          <span className="text-accent text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase">
            Prijevoz · Prodaja · Uvoz vozila
          </span>
          <h1 className="text-[clamp(2rem,6vw,3.4rem)] leading-[1.08] font-bold max-w-2xl">
            Vaš pouzdan partner za vozila
          </h1>
          <p className="text-white/70 text-base sm:text-lg max-w-xl leading-relaxed">
            Obiteljski biznis iz Zagreba — prijevoz vozila, uvoz iz cijele EU i
            prodaja provjerenih rabljenih i novih automobila.
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <Link
              href="/kontakt"
              className="bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-6 py-3.5 rounded transition-colors"
            >
              Kontaktirajte nas
            </Link>
            <Link
              href="/usluge/prijevoz"
              className="border border-white/30 hover:border-white text-white text-sm font-semibold px-6 py-3.5 rounded transition-colors"
            >
              Naše usluge
            </Link>
          </div>
        </div>
      </section>

      {/* USLUGE */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-10">Čime se bavimo</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                n: "01",
                title: "Prodaja vozila",
                body: "Rabljena i nova vozila, provjerena prije nego dođu u ponudu, s jasnom i realnom cijenom.",
                href: "/kontakt",
              },
              {
                n: "02",
                title: "Prijevoz vozila",
                body: "Prevozimo vaše vozilo sigurno i na vrijeme, u Hrvatskoj i iz cijele Europe.",
                href: "/usluge/prijevoz",
              },
              {
                n: "03",
                title: "Uvoz iz EU",
                body: "Pratimo tržišta po cijeloj Europi i donosimo vam vozila po konkurentnim cijenama.",
                href: "/usluge/uvoz",
              },
            ].map((item) => (
              <Link
                key={item.n}
                href={item.href}
                className="group flex flex-col gap-3"
              >
                <span className="font-heading text-4xl text-accent">{item.n}</span>
                <h3 className="text-lg font-semibold normal-case">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.body}</p>
                <span className="text-sm font-semibold text-accent group-hover:text-accent-dark">
                  Više →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIJA (placeholder) */}
      <section className="bg-paper">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-10">Naš rad</h2>
          {/* TODO: zamijeniti sa stvarnim fotografijama vozila/usluga (public/galerija/...) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded bg-navy/5 border border-line flex items-center justify-center text-xs text-muted"
              >
                Slika {i + 1}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIJALI */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-10">Što kažu klijenti</h2>
          <Testimonials />
        </div>
      </section>

      {/* PONUDA VOZILA (oglasnik dolazi u fazi 2) */}
      <section className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24 text-center flex flex-col items-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-semibold">Ponuda vozila</h2>
          <p className="text-white/70 max-w-xl">
            Trenutno pripremamo katalog vozila. Pratite nas na društvenim mrežama za
            najnovije oglase — prva ponuda stiže uskoro.
          </p>
          <div className="flex gap-3 mt-2">
            <a
              href="https://instagram.com/autocaki"
              className="border border-white/30 hover:border-white text-sm font-semibold px-5 py-2.5 rounded"
            >
              Instagram
            </a>
            <a
              href="https://facebook.com/autocaki"
              className="border border-white/30 hover:border-white text-sm font-semibold px-5 py-2.5 rounded"
            >
              Facebook
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
