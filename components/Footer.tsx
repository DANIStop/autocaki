import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="w-full bg-navy text-white mt-auto">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12">
        <Link href="/" aria-label="Auto Čaki — početna" className="inline-block">
          <Image src="/logo-white.png" alt="Auto Čaki" width={640} height={216} className="h-16 w-auto" />
        </Link>
      </div>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-8 pb-14 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">
            E-mail
          </div>
          <a href="mailto:info@autocaki.com" className="text-sm hover:text-accent">
            info@autocaki.com
          </a>
        </div>
        <div>
          <div className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">
            Telefon
          </div>
          <a href="tel:+385996600888" className="text-sm hover:text-accent">
            +385 99 660 0888
          </a>
        </div>
        <div>
          <div className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">
            Lokacija
          </div>
          <a
            href={SITE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:text-accent"
          >
            {SITE.street}
            <br />
            {SITE.city}, Hrvatska
          </a>
        </div>
        <div>
          <div className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">
            Društvene mreže
          </div>
          <div className="flex gap-4 text-sm">
            <a href="https://instagram.com/autocaki.hr" className="hover:text-accent">
              Instagram
            </a>
            {/* TODO: Facebook link — dodati kad dobijemo pravu adresu stranice */}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-4 pb-24 sm:pb-4 flex flex-wrap justify-between gap-2 text-xs text-white/60">
          {/* Next.js (cacheComponents) prerenderira statički, pa je godina fiksna — ažurirati kad treba */}
          <span>© 2026 Auto Čaki. Sva prava pridržana.</span>
          <Link href="/kontakt" className="hover:text-accent">
            Kontakt
          </Link>
        </div>
      </div>
    </footer>
  );
}
