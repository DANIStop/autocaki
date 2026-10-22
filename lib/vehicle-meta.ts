// Tipovi, konstante i formatiranje vozila — dijele ih server i klijent.
export const VEHICLE_STATUSES = {
  u_ponudi: "U ponudi",
  rezervirano: "Rezervirano",
  prodano: "Prodano",
  na_obradi: "Na obradi",
} as const;
export type VehicleStatus = keyof typeof VEHICLE_STATUSES;

export const FUELS = {
  benzin: "Benzin",
  dizel: "Dizel",
  hibrid: "Hibrid",
  plug_in_hibrid: "Plug-in hibrid",
  elektricni: "Električni",
  plin: "Plin",
} as const;
export type Fuel = keyof typeof FUELS;

export const GEARBOXES = { rucni: "Ručni", automatski: "Automatski" } as const;
export type Gearbox = keyof typeof GEARBOXES;

export type Vehicle = {
  id: string;
  slug: string;
  make: string;
  model: string;
  variant: string | null;
  year: number | null;
  km: number | null;
  fuel: Fuel | null;
  gearbox: Gearbox | null;
  power_kw: number | null;
  body_type: string | null;
  color: string | null;
  vin: string | null;
  listing_price: number | null;
  purchase_price: number | null;
  sale_price: number | null;
  status: VehicleStatus;
  description: string | null;
  images: string[];
  featured: boolean;
  created_by: string | null;
  sold_at: string | null;
  created_at: string;
  updated_at: string;
};

// Polja koja smiju na javnu stranicu (bez nabavne cijene, VIN-a i internih podataka).
export type PublicVehicle = Pick<
  Vehicle,
  | "id" | "slug" | "make" | "model" | "variant" | "year" | "km" | "fuel" | "gearbox"
  | "power_kw" | "body_type" | "color" | "listing_price" | "status" | "description"
  | "images" | "featured" | "updated_at"
>;

export const PUBLIC_COLUMNS =
  "id, slug, make, model, variant, year, km, fuel, gearbox, power_kw, body_type, color, listing_price, status, description, images, featured, updated_at";

export const VEHICLES_TAG = "vehicles";
export const PHOTO_BUCKET = "vehicle-photos";

export function photoUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${PHOTO_BUCKET}/${path}`;
}

export function vehicleTitle(v: Pick<Vehicle, "make" | "model" | "variant">) {
  return [v.make, v.model, v.variant].filter(Boolean).join(" ");
}

const eur = new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const num = new Intl.NumberFormat("hr-HR");
export const formatEur = (n: number | null | undefined) => (n == null ? "—" : eur.format(n));
export const formatKm = (n: number | null | undefined) => (n == null ? "—" : `${num.format(n)} km`);
