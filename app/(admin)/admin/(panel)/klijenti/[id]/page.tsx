import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getClient, listVehicleOptions } from "@/lib/admin/modules";
import { addClientInterest, deleteClient, saveClient } from "@/lib/admin/module-actions";
import { isUuid } from "@/lib/admin/parse";
import { ActionButton, ActionForm, Field } from "@/components/admin/controls";
import ClientFields from "@/components/admin/ClientFields";
import { Card, PageTitle, Skeleton, inputClass } from "@/components/admin/ui";

const date = new Intl.DateTimeFormat("hr-HR", { day: "numeric", month: "numeric", year: "numeric" });
const TYPES = { upit: "Upit", dolazak: "Dolazak", kupnja: "Kupnja" } as const;

export default function KlijentPage({ params }: PageProps<"/admin/klijenti/[id]">) {
  return (
    <>
      <Link href="/admin/klijenti" className="text-sm text-muted hover:text-ink">← Klijenti</Link>
      <Suspense fallback={<Skeleton rows={4} />}>
        <Detail params={params} />
      </Suspense>
    </>
  );
}

async function Detail({ params }: Pick<PageProps<"/admin/klijenti/[id]">, "params">) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const [client, vehicles] = await Promise.all([getClient(id), listVehicleOptions()]);
  if (!client) notFound();
  const wa = client.phone ? `https://wa.me/${client.phone.replace(/[^\d]/g, "").replace(/^0/, "385")}` : null;

  return (
    <>
      <PageTitle
        action={
          <div className="flex gap-2">
            {client.phone && <a href={`tel:${client.phone}`} className="rounded border border-line bg-white px-3 py-2 text-xs font-semibold">☎ Nazovi</a>}
            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded bg-[#25D366] px-3 py-2 text-xs font-semibold text-white">WhatsApp</a>}
          </div>
        }
      >
        {client.name}
      </PageTitle>

      <div className="flex flex-col gap-6">
        <Card>
          <ActionForm action={saveClient} submitLabel="Spremi izmjene" resetOnOk={false} className="grid gap-4 sm:grid-cols-2">
            <ClientFields c={client} />
          </ActionForm>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold normal-case font-body mb-4">Interes za vozila</h2>
          {client.interests && client.interests.length > 0 ? (
            <ul className="divide-y divide-line border-y border-line mb-4">
              {client.interests.map((i) => (
                <li key={i.id} className="flex justify-between gap-3 py-2.5 text-sm">
                  {i.vehicle ? (
                    <Link href={`/admin/vozila/${i.vehicle.id}`} className="font-medium hover:text-accent">{i.vehicle.make} {i.vehicle.model}</Link>
                  ) : (
                    <span className="text-muted">Obrisano vozilo</span>
                  )}
                  <span className="text-muted">{TYPES[i.type]} · {date.format(new Date(i.created_at))}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted mb-4">Još nema zabilježenog interesa.</p>
          )}
          <ActionForm action={addClientInterest.bind(null, client.id)} submitLabel="Dodaj" className="grid gap-3 sm:grid-cols-[1fr_10rem_auto] items-end">
            <Field label="Vozilo">
              <select name="vehicle_id" required className={inputClass}>
                <option value="">—</option>
                {vehicles.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
              </select>
            </Field>
            <Field label="Vrsta">
              <select name="type" className={inputClass}>
                {Object.entries(TYPES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </Field>
          </ActionForm>
        </Card>

        <div className="flex justify-end">
          <ActionButton action={deleteClient.bind(null, client.id)} confirmText="Obrisati klijenta?">Obriši klijenta</ActionButton>
        </div>
      </div>
    </>
  );
}
