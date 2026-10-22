import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Uvoz automobila iz Njemačke, Austrije, Italije i cijele EU",
  description:
    "Uvoz automobila iz Njemačke, Austrije, Italije, Belgije, Nizozemske i gotovo svake europske zemlje. Pronađemo auto, provjerimo ga i dovezemo vlastitom prikolicom — brzo i efikasno.",
  alternates: { canonical: "/usluge/uvoz" },
};

const COUNTRIES = ["Njemačka", "Austrija", "Italija", "Belgija", "Nizozemska", "i ostatak EU"];

const STEPS = [
  {
    title: "Recite nam što tražite",
    body: "Marka, model, godište, kilometraža i budžet. Ako već imate oglas iz inozemstva, pošaljite nam link.",
  },
  {
    title: "Pronalazimo i provjeravamo vozilo",
    body: "Pretražujemo ponudu po cijeloj Europi, provjeravamo stanje i povijest vozila te vam javljamo sve troškove prije kupnje.",
  },
  {
    title: "Kupnja i preuzimanje",
    body: "Kad potvrdite, dogovaramo kupnju i preuzimamo auto kod prodavača u inozemstvu.",
  },
  {
    title: "Dovoz do vas",
    body: "Vozilo dovozimo vlastitim vozilom i autoprikolicom — bez posrednika i bez čekanja na tuđe prijevoznike.",
  },
];

const FAQ = [
  {
    q: "Iz kojih država uvozite automobile?",
    a: "Najčešće iz Njemačke, Austrije, Italije, Belgije i Nizozemske, ali uvozimo iz gotovo svake europske zemlje — tamo gdje je ponuda za vaš auto najbolja.",
  },
  {
    q: "Što je uključeno u cijenu?",
    a: "Cijena vozila, prijevoz, PDV i carina (po potrebi), te troškovi registracije u Hrvatskoj — sve razloženo prije kupnje.",
  },
  {
    q: "Koliko traje uvoz automobila?",
    a: "Ovisi o državi, udaljenosti i dostupnosti vozila. Uvoz traje otprilike kao i inače na tržištu, ali jer prijevoz radimo sami, sve ide brže i bez nepotrebnog čekanja.",
  },
  {
    q: "Mogu li sam pronaći auto, a vi ga uvezete?",
    a: "Da. Pošaljite nam link oglasa — provjerimo vozilo i prodavača, javimo vam trošak uvoza i dovezemo auto.",
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
            Uvozimo automobile iz Njemačke, Austrije, Italije, Belgije, Nizozemske i
            gotovo svake europske zemlje. Pronađemo pravi auto po konkurentnoj
            cijeni, provjerimo ga i dovezemo do vas u Zagreb ili bilo gdje u
            Hrvatskoj.
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
          <h2 className="text-2xl font-semibold text-ink">Zašto uvoz auta preko Auto Čaki</h2>
          <p>
            Rabljeni automobili u Njemačkoj, Austriji i drugim zemljama EU često su
            bolje opremljeni, s urednom servisnom poviješću i po nižoj cijeni nego
            kod nas. Problem je što kupnja u inozemstvu traži vrijeme, poznavanje
            tržišta i organizaciju prijevoza.
          </p>
          <p>
            Mi to radimo za vas. Kao obiteljski biznis iz Zagreba vodimo svaki uvoz
            osobno: od pretrage i provjere vozila do dovoza na vašu adresu. Prijevoz
            radimo vlastitim vozilom i prikolicom, pa ne ovisimo o vanjskim
            prijevoznicima — zato smo brzi i efikasni.
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
