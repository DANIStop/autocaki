import Link from "next/link";

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
            Prodaja, uvoz i prijevoz vozila
          </h1>
          <p className="text-white/70 text-base sm:text-lg max-w-xl leading-relaxed">
            Auto Čaki se bavi prodajom rabljenih automobila, uvozom vozila iz
            Europske unije i prijevozom vozila na području Hrvatske i Europe.
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
                body: "Rabljeni automobili koji prije prodaje prolaze provjeru stanja i povijesti vozila.",
                href: "/kontakt",
              },
              {
                n: "02",
                title: "Prijevoz vozila",
                body: "Prijevoz vlastitim transportnim vozilom i autoprikolicom, do dva automobila, na području Hrvatske i Europe.",
                href: "/usluge/prijevoz",
              },
              {
                n: "03",
                title: "Uvoz iz EU",
                body: "Uvoz vozila iz Njemačke, Austrije, Italije, Belgije, Nizozemske i drugih zemalja EU, prema zahtjevima klijenta.",
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

      {/* TODO: galerija „Naš rad“ i recenzije klijenata (components/Testimonials) —
          vratiti kad stignu stvarne fotografije i stvarne recenzije. */}

      {/* PONUDA VOZILA (oglasnik dolazi u fazi 2) */}
      <section className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24 text-center flex flex-col items-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-semibold">Ponuda vozila</h2>
          <p className="text-white/70 max-w-xl">
            Aktualna ponuda rabljenih vozila objavljuje se na našem Instagram
            profilu. Za dostupnost i cijenu određenog vozila kontaktirajte nas.
          </p>
          <div className="flex gap-3 mt-2">
            <a
              href="https://instagram.com/autocaki.hr"
              className="border border-white/30 hover:border-white text-sm font-semibold px-5 py-2.5 rounded"
            >
              Instagram
            </a>
            {/* TODO: Facebook gumb — dodati kad dobijemo pravu adresu stranice */}
          </div>
        </div>
      </section>
    </>
  );
}
