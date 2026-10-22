export const metadata = { title: "Admin", robots: { index: false, follow: false } };

// Faza 2: Supabase Auth login (Danis + Dino), Dashboard, Flota/vozila, Troškovnik,
// Klijenti, Štete, Putni nalozi, Prijevoz (usluga), Praćenje stranih oglasa,
// Uvoz kalkulator, Raspored, Izvoz u XLS — vidi spec dokument za detalje svakog modula.
export default function AdminPlaceholder() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy text-white text-center px-6">
      <div>
        <p className="text-accent text-xs font-semibold tracking-[0.14em] uppercase mb-3">
          /admin
        </p>
        <h1 className="text-2xl font-semibold mb-2">CRM dolazi u fazi 2</h1>
        <p className="text-white/60 text-sm max-w-sm mx-auto">
          Auth, Dashboard i svi moduli iz spec dokumenta grade se u sljedećem koraku.
        </p>
      </div>
    </div>
  );
}
