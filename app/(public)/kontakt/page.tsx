import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Kontakt — Auto Čaki" };

export default function KontaktPage() {
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20 grid gap-12 md:grid-cols-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold mb-4">Kontakt</h1>
          <p className="text-sm text-muted leading-relaxed mb-8 max-w-sm">
            Pošaljite upit ili nas nazovite direktno — javljamo se čim prije.
          </p>
          <div className="flex flex-col gap-5 text-sm">
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase text-accent mb-1">
                E-mail
              </div>
              <a href="mailto:info@autocaki.com">info@autocaki.com</a>
            </div>
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase text-accent mb-1">
                Telefon
              </div>
              <a href="tel:+385996600888">+385 99 660 0888</a>
            </div>
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase text-accent mb-1">
                Lokacija
              </div>
              <span>Zagreb, Hrvatska</span>
            </div>
          </div>
        </div>
        <ContactForm defaultSubject="Opći upit s /kontakt" />
      </div>
    </section>
  );
}
