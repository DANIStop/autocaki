import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin/auth";
import VehicleForm from "@/components/admin/VehicleForm";
import { PageTitle, Skeleton } from "@/components/admin/ui";

export default function NovoVoziloPage() {
  return (
    <>
      <Link href="/admin/vozila" className="text-sm text-muted hover:text-ink">← Vozila</Link>
      <PageTitle>Novo vozilo</PageTitle>
      <Suspense fallback={<Skeleton rows={4} />}>
        <Guarded />
      </Suspense>
    </>
  );
}

async function Guarded() {
  await requireAdmin();
  return <VehicleForm />;
}
