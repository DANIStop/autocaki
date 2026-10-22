"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/nav";
import { SITE } from "@/lib/site";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  // Zaključaj skrolanje stranice i zatvori na Escape dok je meni otvoren.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Zatvori izbornik" : "Otvori izbornik"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line"
      >
        <span className="sr-only">Izbornik</span>
        <span className="relative block h-3.5 w-5">
          <span className={`absolute left-0 h-0.5 w-5 bg-ink transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
          <span className={`absolute left-0 top-1.5 h-0.5 w-5 bg-ink transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`absolute left-0 h-0.5 w-5 bg-ink transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
        </span>
      </button>

      <div
        id="mobile-menu"
        className={`fixed inset-x-0 top-[64px] bottom-0 z-50 bg-white transition-[opacity,transform] duration-300 ${
          open ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-2"
        }`}
        aria-hidden={!open}
      >
        <nav className="flex h-full flex-col px-5 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              style={{ transitionDelay: open ? `${60 + i * 40}ms` : "0ms" }}
              className={`flex items-center justify-between border-b border-line py-4 font-heading text-2xl uppercase transition-[opacity,transform] duration-300 ${
                open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
              }`}
            >
              {item.label}
              <span className="text-accent text-xl">→</span>
            </Link>
          ))}

          <div className="mt-auto grid gap-3">
            <a
              href={`tel:${SITE.phone}`}
              tabIndex={open ? 0 : -1}
              className="text-center bg-accent text-white font-semibold py-3.5 rounded"
            >
              Nazovite {SITE.phoneDisplay}
            </a>
            <a
              href={`https://wa.me/${SITE.phone.replace("+", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={open ? 0 : -1}
              className="text-center bg-[#25D366] text-white font-semibold py-3.5 rounded"
            >
              WhatsApp
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
