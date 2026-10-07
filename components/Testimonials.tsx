// TODO: zamijeniti test podatke stvarnim testimonijalima klijenata (tekst ili screenshot)
// kad ih prikupite — po spec dokumentu idu u tablicu `testimonials` u Supabaseu.
const PLACEHOLDER_TESTIMONIALS = [
  {
    name: "Marko P.",
    text: "Brzo i transparentno — auto je stigao iz Njemačke točno kako je opisano, bez skrivenih troškova.",
  },
  {
    name: "Ivana K.",
    text: "Tražili su mi baš ono što sam htjela i javili se čim su našli pravu ponudu. Preporuka!",
  },
  {
    name: "Tomislav B.",
    text: "Korektna cijena za prijevoz vozila, auto stigao na vrijeme i u istom stanju.",
  },
];

export default function Testimonials() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {PLACEHOLDER_TESTIMONIALS.map((t) => (
        <figure
          key={t.name}
          className="rounded border border-line bg-white p-6 flex flex-col gap-4"
        >
          <blockquote className="text-sm leading-relaxed text-ink">
            “{t.text}”
          </blockquote>
          <figcaption className="text-xs font-semibold text-muted">
            — {t.name}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
