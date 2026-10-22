import "server-only";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getResendClient, CONTACT_EMAIL_FROM } from "@/lib/resend";
import { isAllowedAdminEmail } from "@/lib/admin/auth";
import { SITE } from "@/lib/site";

// Šalje link za postavljanje lozinke (Supabase recovery token, mail ide preko Resenda).
// Tiho ne radi ništa za adrese izvan ADMIN_EMAILS, da se ne otkriva koje adrese postoje.
export async function sendPasswordLink(email: string): Promise<void> {
  if (!isAllowedAdminEmail(email)) return;
  const supabase = getSupabaseServerClient();
  const resend = getResendClient();
  if (!supabase || !resend) throw new Error("Supabase ili Resend nije konfiguriran.");

  const { data, error } = await supabase.auth.admin.generateLink({ type: "recovery", email });
  if (error || !data.properties?.hashed_token) {
    console.error("generateLink:", error?.message);
    return;
  }

  const link = `${SITE.url}/admin/lozinka/potvrda?token_hash=${encodeURIComponent(data.properties.hashed_token)}`;
  const { error: mailError } = await resend.emails.send({
    from: CONTACT_EMAIL_FROM,
    to: email,
    subject: "Auto Čaki admin — postavljanje lozinke",
    text: [
      "Pozdrav,",
      "",
      "za postavljanje lozinke za Auto Čaki admin panel otvorite link:",
      link,
      "",
      "Link vrijedi 1 sat i može se iskoristiti jednom.",
      "Ako niste tražili novu lozinku, zanemarite ovu poruku.",
    ].join("\n"),
  });
  if (mailError) console.error("Resend (lozinka):", mailError);
}
