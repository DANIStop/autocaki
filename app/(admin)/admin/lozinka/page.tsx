import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getAdmin } from "@/lib/admin/auth";
import { ForgotPasswordForm, SetPasswordForm } from "@/components/admin/PasswordForms";

export const metadata = { title: "Lozinka", robots: { index: false, follow: false } };

export default function LozinkaPage({ searchParams }: PageProps<"/admin/lozinka">) {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <Image src="/logo-white.png" alt="Auto Čaki" width={640} height={216} priority className="h-16 w-auto mx-auto mb-8" />
        <div className="rounded-lg bg-white p-6 sm:p-8">
          <Suspense fallback={<p className="text-sm text-muted">Učitavanje…</p>}>
            <Body searchParams={searchParams} />
          </Suspense>
        </div>
        <Link href="/admin/prijava" className="block text-center text-sm text-white/60 hover:text-white mt-5">
          ← Natrag na prijavu
        </Link>
      </div>
    </div>
  );
}

async function Body({ searchParams }: Pick<PageProps<"/admin/lozinka">, "searchParams">) {
  const { greska } = await searchParams;
  const admin = await getAdmin();

  // Prijavljen (preko linka iz maila ili već otprije) → postavi novu lozinku.
  if (admin && !greska) {
    return (
      <>
        <h1 className="text-xl font-semibold mb-1">Nova lozinka</h1>
        <p className="text-sm text-muted mb-6">{admin.email}</p>
        <SetPasswordForm />
      </>
    );
  }

  return (
    <>
      <h1 className="text-xl font-semibold mb-1">Postavljanje lozinke</h1>
      {greska ? (
        <p className="text-sm text-accent mb-6">Link je istekao ili je već iskorišten. Zatražite novi.</p>
      ) : (
        <p className="text-sm text-muted mb-6">Upišite svoj e-mail i poslat ćemo vam link za postavljanje lozinke.</p>
      )}
      <ForgotPasswordForm />
    </>
  );
}
