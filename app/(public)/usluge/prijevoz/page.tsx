import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Prijevoz vozila — Auto Čaki" };

export default function PrijevozPage() {
  return (
    <>
      <section className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <span className="text-accent text-xs font-semibold tracking-[0.14em] uppercase">
            Usluga
          </span>
          <h1 className="text-[clamp(1.8rem,5vw,2.8rem)] font-bold mt-2 max-w-xl">
            Prijevoz vozila
          </h1>
          <p className="text-white/70 max-w-xl mt-4 leading-relaxed">
            Prevozimo vozila sigurno, osigurano i na vrijeme — unutar Hrvatske i iz
            cijele Europe. Idealno kad ste kupili auto u drugoj državi ili ga samo
            trebate premjestiti.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold mb-4">Kako to izgleda</h2>
            <ul className="flex flex-col gap-3 text-sm text-muted leading-relaxed">
              <li>1. Javite nam relaciju i vrstu vozila putem forme ili telefona.</li>
              <li>2. Dogovorimo termin preuzimanja i cijenu prijevoza.</li>
              <li>3. Vozilo preuzimamo, prevozimo i dostavljamo na dogovorenu adresu.</li>
            </ul>
            {/* TODO: dodati galeriju fotografija s prijevoza kad budu dostupne */}
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Zatražite ponudu</h2>
            <ContactForm defaultSubject="Upit — prijevoz vozila" />
          </div>
        </div>
      </section>
    </>
  );
}
