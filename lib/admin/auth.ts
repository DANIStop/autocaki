import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getSupabaseAuthClient } from "@/lib/supabase/auth";

export type Admin = { id: string; email: string };

// Pristup adminu imaju samo e-mail adrese iz ADMIN_EMAILS (zarezom odvojene).
function allowedEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(email: string | undefined | null) {
  return !!email && allowedEmails().includes(email.toLowerCase());
}

export async function getAdmin(): Promise<Admin | null> {
  // Supabase Auth interno koristi Date.now(), pa provjeru sesije vežemo uz sam zahtjev.
  await connection();
  const supabase = await getSupabaseAuthClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user?.email || !isAllowedAdminEmail(user.email)) return null;
  return { id: user.id, email: user.email };
}

// Koristiti na vrhu svake admin stranice i u svakoj Server Action.
export async function requireAdmin(): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/prijava");
  return admin;
}
