import Image from "next/image";
import Link from "next/link";
import { AdminSidebar, AdminTabBar } from "@/components/admin/AdminNav";
import { signOut } from "@/lib/admin/actions";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper md:flex">
      {/* Bočna traka (desktop) */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col gap-8 bg-navy px-4 py-6 sticky top-0 h-screen">
        <Link href="/admin" className="px-2">
          <Image src="/logo-white.png" alt="Auto Čaki" width={640} height={216} className="h-12 w-auto" />
        </Link>
        <AdminSidebar />
        <div className="mt-auto flex flex-col gap-1 px-1">
          <Link href="/" className="text-xs text-white/50 hover:text-white px-2 py-1.5">
            ↗ Javna stranica
          </Link>
          <form action={signOut}>
            <button className="w-full text-left text-xs text-white/50 hover:text-white px-2 py-1.5">Odjava</button>
          </form>
        </div>
      </aside>

      {/* Gornja traka (mobitel) */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between bg-navy px-4 py-3">
        <Link href="/admin">
          <Image src="/logo-white.png" alt="Auto Čaki" width={640} height={216} className="h-9 w-auto" />
        </Link>
        <form action={signOut}>
          <button className="text-xs font-semibold text-white/70">Odjava</button>
        </form>
      </header>

      <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 sm:py-8 pb-28 md:pb-10">{children}</main>
      <AdminTabBar />
    </div>
  );
}
