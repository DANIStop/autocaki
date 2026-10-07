import { createClient } from "@supabase/supabase-js";

// Browser-side client (anon key only). Used later for the admin panel (Faza 2) once
// Supabase Auth is wired up — not needed by the public landing pages yet.
export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase env vars nisu postavljeni (vidi .env.example).");
  }

  return createClient(url, anonKey);
}
