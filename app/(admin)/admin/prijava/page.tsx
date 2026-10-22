import Image from "next/image";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Prijava", robots: { index: false, follow: false } };

export default function PrijavaPage() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <Image
          src="/logo-white.png"
          alt="Auto Čaki"
          width={640}
          height={216}
          priority
          className="h-16 w-auto mx-auto mb-8"
        />
        <div className="rounded-lg bg-white p-6 sm:p-8">
          <h1 className="text-xl font-semibold mb-1">Prijava</h1>
          <p className="text-sm text-muted mb-6">Interni panel Auto Čaki</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
