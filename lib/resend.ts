import { Resend } from "resend";

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export const CONTACT_EMAIL_TO = process.env.CONTACT_EMAIL_TO || "info@autocaki.com";
// Dok domena nije verificirana u Resendu, slanje mora ići s njihove "onboarding" adrese.
// Nakon verifikacije autocaki.com u Resend dashboardu, promijeniti u npr. upiti@autocaki.com.
export const CONTACT_EMAIL_FROM =
  process.env.CONTACT_EMAIL_FROM || "Auto Čaki <onboarding@resend.dev>";
