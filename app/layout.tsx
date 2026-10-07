import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auto Čaki — prodaja, prijevoz i uvoz vozila",
  description:
    "Auto Čaki — obiteljski biznis iz Zagreba. Prodaja rabljenih i novih vozila, prijevoz vozila i uvoz iz cijele EU.",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
