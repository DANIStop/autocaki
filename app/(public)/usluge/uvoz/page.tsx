import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Uvoz vozila — Auto Čaki" };

const FAQ = [
  {
    q: "Iz kojih država uvozite vozila?",
    a: "Najčešće iz Njemačke i okolnih zemalja EU, ali pratimo ponudu po cijeloj Europi.",
  },
  {
    q: "Što je uključeno u cijenu?",
    a: "Cijena vozila, prijevoz, PDV i carina (po potrebi), te troškovi registracije u Hrvatskoj — sve razloženo prije kupnje.",
  },
  {
    q: "Koliko traje cijeli proces?",
    a: "Ovisi o vozilu i dostupnosti, u prosjeku nekoliko tjedana od dogovora do registracije.",
  },
];

export default function UvozPage() {
  return (
    <>
      <section className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <span className="text-accent text-xs font-semibold tracking-[0.14em] uppercase">
            Usluga
          </span>
          <h1 className="text-[clamp(1.8rem,5vw,2.8rem)] font-bold mt-2 max-w-xl">
            Uvoz vozila iz EU
          </h1>
          <p className="text-white/70 max-w-xl mt-4 leading-relaxed">
            Pratimo tržišta po cijeloj Europi i pronalazimo vozila po konkurentnim
            cijenama — s transparentnim izračunom svih troškova uvoza prije kupnje.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold mb-4">Često pitano</h2>
            <div className="flex flex-col gap-6">
              {FAQ.map((item) => (
                <div key={item.q}>
                  <h3 className="text-sm font-semibold normal-case mb-1.5">
                    {item.q}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Recite nam što tražite</h2>
            <ContactForm defaultSubject="Upit — uvoz vozila" />
          </div>
        </div>
      </section>
    </>
  );
}
