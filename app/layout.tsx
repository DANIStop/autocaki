import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Auto Čaki | Uvoz automobila iz EU, prijevoz i prodaja vozila – Zagreb",
    template: "%s | Auto Čaki Zagreb",
  },
  description:
    "Uvoz automobila iz Njemačke, Austrije, Italije i cijele EU, prijevoz vozila autoprikolicom i prodaja provjerenih auta. Obiteljski biznis iz Zagreba — brzo i pouzdano.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "hr_HR",
    siteName: SITE.name,
    url: SITE.url,
  },
};

// Strukturirani podaci za Google (lokalna firma: adresa, telefon, usluge).
const LOCAL_BUSINESS = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  "@id": `${SITE.url}/#firma`,
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/logo.png`,
  image: `${SITE.url}/opengraph-image.png`,
  telephone: SITE.phone,
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.street,
    addressLocality: SITE.city,
    addressCountry: SITE.country,
  },
  areaServed: ["Hrvatska", "Europska unija"],
  sameAs: [SITE.instagram],
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Uvoz automobila iz EU", url: `${SITE.url}/usluge/uvoz` } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Prijevoz vozila autoprikolicom", url: `${SITE.url}/usluge/prijevoz` } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Prodaja rabljenih i novih vozila" } },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="hr" className="h-full antialiased">
      <head>
        {/* next/font ne radi u build okruženju iza proxyja bez pristupa fonts.googleapis.com,
            pa fontove učitavamo klasičnim <link> tagom — radi identično u pregledniku. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Work+Sans:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS) }}
        />
        {children}
      </body>
    </html>
  );
}
