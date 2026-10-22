import Testimonials from "@/components/Testimonials";

export const metadata = {
  title: "O nama – obiteljski auto biznis iz Zagreba",
  description:
    "Auto Čaki vode braća Danis i Dino — uvoz automobila iz EU, prijevoz vozila i prodaja provjerenih auta iz Zagreba, bez posrednika.",
  alternates: { canonical: "/o-nama" },
};

export default function ONamaPage() {
  return (
    <>
      <section className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <span className="text-accent text-xs font-semibold tracking-[0.14em] uppercase">
            O nama
          </span>
          <h1 className="text-[clamp(1.8rem,5vw,2.8rem)] font-bold mt-2 max-w-xl">
            Braća Danis i Dino
          </h1>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 flex flex-col gap-5 text-sm sm:text-base leading-relaxed text-muted">
          {/* TODO: zamijeniti kratkim, osobnim tekstom o Danisu i Dinu */}
          <p>
            Auto Čaki je obiteljski biznis iz Zagreba koji vode braća Danis i Dino.
            Bavimo se prodajom provjerenih rabljenih i novih vozila, prijevozom
            vozila te uvozom iz cijele Europske unije.
          </p>
          <p>
            Vodimo posao osobno — svaki upit dobije direktan odgovor, bez
            posrednika, i svaki auto prolazi provjeru prije nego dođe u ponudu.
          </p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
          <h2 className="text-2xl font-semibold mb-10">Što kažu klijenti</h2>
          <Testimonials />
        </div>
      </section>
    </>
  );
}
