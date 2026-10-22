import Image from "next/image";
import Link from "next/link";
import MobileMenu from "@/components/MobileMenu";
import { NAV } from "@/lib/nav";
import { SITE } from "@/lib/site";

export default function Header() {
  return (
    // Bez backdrop-filtera: on bi postao containing block za fiksni mobilni meni.
    <header className="w-full border-b border-line bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3 md:py-4 flex items-center justify-between gap-6">
        <Link href="/" className="shrink-0" aria-label="Auto Čaki — početna">
          <Image
            src="/logo.png"
            alt="Auto Čaki"
            width={640}
            height={201}
            priority
            className="h-10 md:h-12 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink hover:text-accent transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/kontakt"
          className="hidden md:inline-flex shrink-0 bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-4 py-2.5 rounded transition-colors"
        >
          Kontaktirajte nas
        </Link>

        <div className="flex md:hidden items-center gap-2">
          <a
            href={`tel:${SITE.phone}`}
            aria-label={`Nazovite ${SITE.phoneDisplay}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1z" />
            </svg>
          </a>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
