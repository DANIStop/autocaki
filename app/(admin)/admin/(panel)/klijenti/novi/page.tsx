import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin/auth";
import { saveClient } from "@/lib/admin/module-actions";
import { ActionForm } from "@/components/admin/controls";
import ClientFields from "@/components/admin/ClientFields";
import { Card, PageTitle, Skeleton } from "@/components/admin/ui";

export default function NoviKlijentPage() {
  return (
    <>
      <Link href="/admin/klijenti" className="text-sm text-muted hover:text-ink">← Klijenti</Link>
      <PageTitle>Novi klijent</PageTitle>
      <Suspense fallback={<Skeleton rows={3} />}>
        <Guarded />
      </Suspense>
    </>
  );
}

async function Guarded() {
  await requireAdmin();
  return (
    <Card>
      <ActionForm action={saveClient} submitLabel="Spremi klijenta" resetOnOk={false} className="grid gap-4 sm:grid-cols-2">
        <ClientFields />
      </ActionForm>
    </Card>
  );
}
