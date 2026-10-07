import { createClient } from "@supabase/supabase-js";

// Server-side only client. Uses the service role key so API routes (e.g. /api/contact)
// can insert into `inquiries` etc. bypassing RLS. NEVER import this from a client component.
export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
