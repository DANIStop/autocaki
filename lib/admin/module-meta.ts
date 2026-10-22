// Statusi i vrste za admin module — dijele ih server i klijent.
export const REPAIR_STATUSES = {
  ceka_dijelove: "Čeka dijelove",
  lakira_se: "Lakira se",
  slaze_se: "Slaže se",
  spremno: "Spremno",
} as const;
export type RepairStatus = keyof typeof REPAIR_STATUSES;

export const EVENT_TYPES = { pregled: "Pregled", servis: "Servis", preuzimanje: "Preuzimanje", ostalo: "Ostalo" } as const;
export type EventType = keyof typeof EVENT_TYPES;

export const LISTING_STATUSES = { novo: "Novo", kontaktirano: "Kontaktirano", odbaceno: "Odbačeno" } as const;
export type ListingStatus = keyof typeof LISTING_STATUSES;

export type RepairJob = {
  id: string; vehicle_id: string; parts_needed: string[]; status: RepairStatus; updated_at: string;
  vehicle?: { id: string; make: string; model: string; variant: string | null; images: string[] } | null;
};
