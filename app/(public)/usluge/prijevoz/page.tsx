import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Prijevoz vozila autoprikolicom – Hrvatska i Europa",
  description:
    "Prijevoz automobila vlastitim transportnim vozilom i autoprikolicom kapaciteta do dva vozila, na području Hrvatske i Europe. Cijena ovisi o udaljenosti.",
  alternates: { canonical: "/usluge/prijevoz" },
};

const FEATURES = [
  {
    title: "Vlastito vozilo i prikolica",
    body: "Prijevoz obavljamo vlastitim transportnim vozilom i autoprikolicom, od preuzimanja do dostave, bez vanjskih prijevoznika.",
  },
  {
    title: "Do 2 vozila odjednom",
    body: "Kapacitet autoprikolice je do dva automobila po prijevozu, bez pretovara.",
  },
  {
    title: "Hrvatska i cijela Europa",
    body: "Prevozimo vozila unutar Hrvatske, iz inozemstva u Hrvatsku i obrnuto.",
  },
  {
    title: "Cijena po kilometraži",
    body: "Cijena prijevoza ovisi o udaljenosti. Ponudu izrađujemo prema zadanoj relaciji.",
  },
];

const FAQ = [
  {
    q: "Koliko košta prijevoz automobila?",
    a: "Cijena ovisi o udaljenosti između mjesta preuzimanja i dostave. Na temelju zadane relacije dostavljamo točnu ponudu.",
  },
  {
    q: "Koliko traje prijevoz vozila?",
    a: "Trajanje ovisi o udaljenosti. Budući da prijevoz obavljamo vlastitim vozilom, termin preuzimanja dogovaramo izravno s klijentom.",
  },
  {
    q: "Mogu li prevesti auto kupljen u inozemstvu?",
    a: "Da. Vozilo preuzimamo kod prodavatelja u Njemačkoj, Austriji, Italiji ili drugoj zemlji EU i dostavljamo ga na adresu kupca.",
  },
];

export default function PrijevozPage() {
  return (
    <>
      <section className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <span className="text-accent text-xs font-semibold tracking-[0.14em] uppercase">
            Usluga
          </span>
          <h1 className="text-[clamp(1.8rem,5vw,2.8rem)] font-bold mt-2 max-w-2xl">
            Prijevoz vozila u Hrvatskoj i iz Europe
          </h1>
          <p className="text-white/70 max-w-xl mt-4 leading-relaxed">
            Prijevoz vozila vlastitim transportnim vozilom i autoprikolicom
            kapaciteta do dva automobila, na području Hrvatske i Europe. Cijena
            prijevoza ovisi o udaljenosti.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
          <h2 className="text-2xl font-semibold mb-8">Prijevoz automobila autoprikolicom</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex flex-col gap-2 border-t-2 border-accent pt-4">
                <h3 className="text-base font-semibold normal-case">{f.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold mb-4">Kako to izgleda</h2>
            <ol className="flex flex-col gap-3 text-sm text-muted leading-relaxed">
              <li>1. Javite nam relaciju i vrstu vozila putem forme, telefona ili WhatsAppa.</li>
              <li>2. Dogovorimo termin preuzimanja i cijenu prijevoza prema kilometraži.</li>
              <li>3. Vozilo preuzimamo, prevozimo na prikolici i dostavljamo na dogovorenu adresu.</li>
            </ol>
            {/* TODO: dodati galeriju fotografija s prijevoza kad budu dostupne */}
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Često pitano o prijevozu</h2>
            <div className="flex flex-col gap-6">
              {FAQ.map((item) => (
                <div key={item.q}>
                  <h3 className="text-sm font-semibold normal-case mb-1.5">{item.q}</h3>
                  <p className="text-sm text-muted leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16">
          <h2 className="text-xl font-semibold mb-4">Zatražite ponudu za prijevoz</h2>
          <ContactForm defaultSubject="Upit — prijevoz vozila" />
        </div>
      </section>
    </>
  );
}
