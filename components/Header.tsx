import Image from "next/image";
import Link from "next/link";

const NAV = [
  { href: "/usluge/prijevoz", label: "Prijevoz" },
  { href: "/usluge/uvoz", label: "Uvoz" },
  { href: "/o-nama", label: "O nama" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Header() {
  return (
    <header className="w-full border-b border-line bg-white sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="shrink-0" aria-label="Auto Čaki — početna">
          <Image
            src="/logo.png"
            alt="Auto Čaki"
            width={640}
            height={201}
            priority
            className="h-12 w-auto"
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
          className="shrink-0 bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-4 py-2.5 rounded transition-colors"
        >
          Kontaktirajte nas
        </Link>
      </div>

      {/* mobile nav */}
      <nav className="md:hidden flex items-center gap-4 overflow-x-auto px-5 pb-3 -mt-1">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm font-medium text-ink whitespace-nowrap"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
