import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { PUBLIC_COLUMNS, VEHICLES_TAG, type PublicVehicle } from "@/lib/vehicle-meta";

export * from "@/lib/vehicle-meta";

// Javni oglasnik: vozila u ponudi i rezervirana, izdvojena prva pa najnovija.
export async function getPublicVehicles(): Promise<PublicVehicle[]> {
  "use cache";
  cacheTag(VEHICLES_TAG);
  cacheLife("hours");

  const supabase = getSupabaseServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("vehicles")
    .select(PUBLIC_COLUMNS)
    .in("status", ["u_ponudi", "rezervirano"])
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getPublicVehicles:", error.message);
    return [];
  }
  return (data ?? []) as PublicVehicle[];
}

export async function getPublicVehicle(slug: string): Promise<PublicVehicle | null> {
  "use cache";
  cacheTag(VEHICLES_TAG);
  cacheLife("hours");

  const supabase = getSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("vehicles")
    .select(PUBLIC_COLUMNS)
    .eq("slug", slug)
    .in("status", ["u_ponudi", "rezervirano", "prodano"])
    .maybeSingle();
  return (data as PublicVehicle | null) ?? null;
}
