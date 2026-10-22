import type { VehicleStatus } from "@/lib/vehicle-meta";
import { VEHICLE_STATUSES } from "@/lib/vehicle-meta";

export const inputClass =
  "w-full border border-line bg-white rounded px-3.5 py-2.5 text-sm font-normal outline-none focus:border-accent";

const STATUS_STYLE: Record<VehicleStatus, string> = {
  u_ponudi: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rezervirano: "bg-amber-50 text-amber-700 border-amber-200",
  prodano: "bg-zinc-100 text-zinc-600 border-zinc-200",
  na_obradi: "bg-sky-50 text-sky-700 border-sky-200",
};

export function StatusBadge({ status }: { status: VehicleStatus }) {
  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[status]}`}>
      {VEHICLE_STATUSES[status]}
    </span>
  );
}

export function PageTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <h1 className="text-2xl font-semibold">{children}</h1>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-line bg-white p-5 ${className}`}>{children}</div>;
}

export function Skeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3" aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 rounded-lg bg-white border border-line animate-pulse" />
      ))}
    </div>
  );
}
