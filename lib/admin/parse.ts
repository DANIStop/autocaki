// Čitanje polja iz FormData (prazno -> null, brojevi u hrvatskom zapisu „1.234,56“).
export const text = (fd: FormData, k: string) => {
  const v = String(fd.get(k) ?? "").trim();
  return v === "" ? null : v;
};

export const int = (fd: FormData, k: string) => {
  const v = text(fd, k);
  if (v == null) return null;
  const n = Number.parseInt(v.replace(/[^\d-]/g, ""), 10);
  return Number.isFinite(n) ? n : null;
};

export function parseMoney(v: string | null | undefined): number | null {
  if (v == null || v.trim() === "") return null;
  const s = v.trim().replace(/\s|€/g, "");
  // „1.234,56“ → 1234.56 ; „1234.56“ → 1234.56
  const normalized = s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export const money = (fd: FormData, k: string) => parseMoney(text(fd, k));

export const oneOf = <T extends string>(v: string | null, allowed: Record<T, string>) =>
  v != null && v in allowed ? (v as T) : null;

export const isUuid = (v: string | null | undefined): v is string => !!v && /^[0-9a-f-]{36}$/i.test(v);
