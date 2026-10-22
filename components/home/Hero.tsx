import Link from "next/link";
import TowScene from "@/components/home/TowScene";

const HEADLINE = ["Prodaja,", "uvoz", "i", "prijevoz", "vozila"];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      {/* Suptilna mreža u pozadini */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-12 sm:pt-14 lg:pt-12 pb-4 sm:pb-6">
        <span className="hero-fade block text-accent text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase" style={{ animationDelay: "0.1s" }}>
          Prodaja · Uvoz · Prijevoz
        </span>
        <h1 className="mt-4 text-[clamp(2.4rem,7vw,4.2rem)] leading-[1.02] font-bold max-w-4xl">
          {HEADLINE.map((w, i) => (
            <span key={w} className="hero-word mr-[0.22em]">
              <span style={{ animationDelay: `${0.15 + i * 0.08}s` }}>{w}</span>
            </span>
          ))}
        </h1>
        <p className="hero-fade mt-5 text-white/70 text-base sm:text-lg max-w-xl leading-relaxed" style={{ animationDelay: "0.6s" }}>
          Rabljeni automobili s provjerenom poviješću, uvoz vozila iz Europske unije i
          prijevoz vlastitom autoprikolicom na području Hrvatske i Europe.
        </p>
        <div className="hero-fade flex flex-wrap gap-3 mt-7" style={{ animationDelay: "0.75s" }}>
          <Link href="/vozila" className="bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-6 py-3.5 rounded transition-colors">
            Pogledajte vozila
          </Link>
          <Link href="/kontakt" className="border border-white/30 hover:border-white text-white text-sm font-semibold px-6 py-3.5 rounded transition-colors">
            Zatražite ponudu
          </Link>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-2 sm:px-8 pb-6 sm:pb-8 lg:-mt-6">

        <TowScene />
      </div>
    </section>
  );
}
