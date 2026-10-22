import Link from "next/link";
import { ADMIN_NAV } from "@/lib/admin/nav";
import { PageTitle } from "@/components/admin/ui";

export default function VisePage() {
  return (
    <>
      <PageTitle>Moduli</PageTitle>
      <ul className="grid grid-cols-2 gap-3">
        {ADMIN_NAV.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="flex flex-col gap-3 rounded-lg border border-line bg-white p-4 hover:border-ink h-full">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-accent" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={item.icon} />
              </svg>
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          </li>
        ))}
        <li>
          <a href="/admin/izvoz/vozila" className="flex flex-col gap-3 rounded-lg border border-line bg-white p-4 hover:border-ink h-full">
            <span className="text-accent text-xl leading-none">⬇</span>
            <span className="text-sm font-semibold">Izvoz vozila (Excel)</span>
          </a>
        </li>
        <li>
          <Link href="/admin/lozinka" className="flex flex-col gap-3 rounded-lg border border-line bg-white p-4 hover:border-ink h-full">
            <span className="text-accent text-xl leading-none">🔑</span>
            <span className="text-sm font-semibold">Promjena lozinke</span>
          </Link>
        </li>
      </ul>
    </>
  );
}
