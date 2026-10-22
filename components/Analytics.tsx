"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

// Google Analytics 4 s Consent Modeom: kolačići tek nakon pristanka (GDPR).
const GA_ID = "G-SS84R3WL4M";
const STORAGE_KEY = "autocaki-cookie-consent";

type Choice = "granted" | "denied";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function readChoice(): Choice | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export default function Analytics() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Odluka iz localStoragea dostupna je tek na klijentu, pa traku prikazujemo nakon montiranja.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowBanner(readChoice() === null);
  }, []);

  function decide(choice: Choice) {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // privatni prozor / blokirana pohrana — odluka vrijedi samo za ovu posjetu
    }
    window.gtag?.("consent", "update", { analytics_storage: choice });
    setShowBanner(false);
  }

  return (
    <>
      <Script id="ga-consent" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
var c = null;
try { c = localStorage.getItem("${STORAGE_KEY}"); } catch (e) {}
gtag("consent", "default", {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: c === "granted" ? "granted" : "denied"
});
gtag("js", new Date());
gtag("config", "${GA_ID}");`}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />

      {showBanner && (
        <div
          role="dialog"
          aria-label="Postavke kolačića"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
        >
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <p className="text-sm text-muted leading-relaxed flex-1">
              Koristimo analitičke kolačiće (Google Analytics) kako bismo pratili
              posjećenost stranice. Kolačići se postavljaju samo uz vaš pristanak.
            </p>
            <div className="flex gap-3 shrink-0">
              <button
                type="button"
                onClick={() => decide("denied")}
                className="border border-line hover:border-ink text-sm font-semibold px-4 py-2.5 rounded transition-colors"
              >
                Odbij
              </button>
              <button
                type="button"
                onClick={() => decide("granted")}
                className="bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-4 py-2.5 rounded transition-colors"
              >
                Prihvati
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
