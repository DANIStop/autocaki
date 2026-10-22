import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAuthClient } from "@/lib/supabase/auth";

// Link iz maila: provjeri recovery token, postavi sesiju (kolačići) i pošalji na postavljanje lozinke.
export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const target = new URL("/admin/lozinka", request.url);
  if (!tokenHash) {
    target.searchParams.set("greska", "1");
    return NextResponse.redirect(target);
  }

  const supabase = await getSupabaseAuthClient();
  const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" });
  if (error) target.searchParams.set("greska", "1");
  return NextResponse.redirect(target);
}
