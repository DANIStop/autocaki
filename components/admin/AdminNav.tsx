"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { ADMIN_NAV, ADMIN_TABS } from "@/lib/admin/nav";


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
          {ADMIN_NAV.map((item) => (
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
          <div className="grid grid-cols-5">
            {ADMIN_TABS.map((item) => (
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
