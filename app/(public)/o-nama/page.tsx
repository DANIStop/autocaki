
export const metadata = {
  title: "O nama – prodaja rabljenih automobila, uvoz i prijevoz vozila",
  description:
    "Auto Čaki se bavi prodajom rabljenih automobila, uvozom vozila iz Europske unije i prijevozom vozila vlastitim transportnim vozilom i autoprikolicom.",
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
            Auto Čaki
          </h1>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 flex flex-col gap-5 text-sm sm:text-base leading-relaxed text-muted">
          <p>
            Auto Čaki se bavi prodajom rabljenih automobila, uvozom vozila iz
            Europske unije i prijevozom vozila.
          </p>
          <p>
            U ponudi su rabljeni automobili koji prije prodaje prolaze provjeru
            stanja i povijesti vozila.
          </p>
          <p>
            Vozila uvozimo iz Njemačke, Austrije, Italije, Belgije, Nizozemske i
            drugih zemalja EU, prema zahtjevima klijenta. Usluga uključuje
            pronalazak vozila, provjeru i isporuku do kupca.
          </p>
          <p>
            Prijevoz vozila obavljamo vlastitim transportnim vozilom i
            autoprikolicom kapaciteta do dva automobila, na području Hrvatske i
            Europe. Cijena prijevoza ovisi o udaljenosti.
          </p>
        </div>
      </section>
    </>
  );
}
