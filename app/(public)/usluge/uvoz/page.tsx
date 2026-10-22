import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Uvoz automobila iz Njemačke, Austrije, Italije i cijele EU",
  description:
    "Uvoz automobila iz Njemačke, Austrije, Italije, Belgije, Nizozemske i drugih zemalja EU. Pronalazak vozila prema zahtjevima klijenta, provjera stanja i povijesti te isporuka do kupca.",
  alternates: { canonical: "/usluge/uvoz" },
};

const COUNTRIES = ["Njemačka", "Austrija", "Italija", "Belgija", "Nizozemska", "i ostatak EU"];

const STEPS = [
  {
    title: "Recite nam što tražite",
    body: "Marka, model, godište, kilometraža i budžet. Ako već imate oglas iz inozemstva, pošaljite nam poveznicu.",
  },
  {
    title: "Pronalazimo i provjeravamo vozilo",
    body: "Pretražujemo ponudu po cijeloj Europi, provjeravamo stanje i povijest vozila te dostavljamo izračun svih troškova prije kupnje.",
  },
  {
    title: "Kupnja i preuzimanje",
    body: "Nakon vaše potvrde dogovaramo kupnju i preuzimamo vozilo kod prodavatelja u inozemstvu.",
  },
  {
    title: "Isporuka",
    body: "Vozilo isporučujemo vlastitim transportnim vozilom i autoprikolicom na adresu kupca.",
  },
];

const FAQ = [
  {
    q: "Iz kojih država uvozite automobile?",
    a: "Najčešće iz Njemačke, Austrije, Italije, Belgije i Nizozemske, a prema potrebi i iz drugih zemalja EU.",
  },
  {
    q: "Što je uključeno u cijenu?",
    a: "Cijena vozila, prijevoz, PDV i carina (po potrebi), te troškovi registracije u Hrvatskoj — sve razloženo prije kupnje.",
  },
  {
    q: "Koliko traje uvoz automobila?",
    a: "Trajanje ovisi o državi, udaljenosti i dostupnosti vozila. Budući da prijevoz obavljamo vlastitim vozilom, nema čekanja na termin vanjskog prijevoznika.",
  },
  {
    q: "Mogu li sam pronaći vozilo, a vi ga uvezete?",
    a: "Da. Pošaljite nam poveznicu na oglas — provjeravamo vozilo i prodavatelja, dostavljamo izračun troškova uvoza i organiziramo isporuku.",
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
          <h1 className="text-[clamp(1.8rem,5vw,2.8rem)] font-bold mt-2 max-w-2xl">
            Uvoz automobila iz EU
          </h1>
          <p className="text-white/70 max-w-xl mt-4 leading-relaxed">
            Uvozimo vozila iz Njemačke, Austrije, Italije, Belgije, Nizozemske i
            drugih zemalja EU, prema zahtjevima klijenta. Usluga uključuje
            pronalazak vozila, provjeru i isporuku do kupca.
          </p>
          <ul className="flex flex-wrap gap-2 mt-6">
            {COUNTRIES.map((c) => (
              <li key={c} className="border border-white/25 rounded px-3 py-1 text-xs font-semibold">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
          <h2 className="text-2xl font-semibold mb-8">Kako izgleda uvoz automobila</h2>
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex flex-col gap-2">
                <span className="font-heading text-3xl text-accent">0{i + 1}</span>
                <h3 className="text-base font-semibold normal-case">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-paper">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 flex flex-col gap-4 text-sm sm:text-base text-muted leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">Uvoz vozila preko Auto Čaki</h2>
          <p>
            Tržišta rabljenih vozila u Njemačkoj, Austriji i drugim zemljama EU
            nude širi izbor modela i opreme. Kupnja u inozemstvu ipak zahtijeva
            poznavanje tržišta, provjeru vozila i prodavatelja te organizaciju
            prijevoza.
          </p>
          <p>
            Auto Čaki preuzima cijeli postupak: pretragu i provjeru vozila,
            dogovor s prodavateljem i isporuku do kupca. Prijevoz obavljamo
            vlastitim transportnim vozilom i autoprikolicom, bez angažiranja
            vanjskih prijevoznika.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold mb-4">Često pitano o uvozu</h2>
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
