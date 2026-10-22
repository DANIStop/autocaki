"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

const ITEMS = [
  { href: "/admin", label: "Pregled", icon: "M3 12l9-8 9 8M5 10v10h5v-6h4v6h5V10" },
  { href: "/admin/vozila", label: "Vozila", icon: "M3 16l2-6c.4-1.2 1.4-2 2.7-2h8.6c1.3 0 2.3.8 2.7 2l2 6v3h-3m-12 0H3v-3m3 3a2 2 0 104 0m4 0a2 2 0 104 0" },
  { href: "/admin/upiti", label: "Upiti", icon: "M4 5h16v11H8l-4 4V5z" },
];

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

// usePathname je podatak iz URL-a, pa ide unutar Suspense; fallback je ista navigacija bez oznake aktivne stavke.
function WithPathname({ render }: { render: (pathname: string | null) => React.ReactNode }) {
  return <Suspense fallback={render(null)}><PathnameReader render={render} /></Suspense>;
}
function PathnameReader({ render }: { render: (pathname: string | null) => React.ReactNode }) {
  return render(usePathname());
}

export function AdminSidebar() {
  return (
    <WithPathname
      render={(pathname) => (
        <nav className="flex flex-col gap-1">
          {ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive(pathname, item.href) ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon d={item.icon} />
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    />
  );
}

// Donja traka za mobitel
export function AdminTabBar() {
  return (
    <WithPathname
      render={(pathname) => (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
          <div className="grid grid-cols-3">
            {ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold ${
                  isActive(pathname, item.href) ? "text-accent" : "text-muted"
                }`}
              >
                <Icon d={item.icon} />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    />
  );
}

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
