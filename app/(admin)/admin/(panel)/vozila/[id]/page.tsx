import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getVehicle, listVehicleCosts } from "@/lib/admin/data";
import { vehicleTitle } from "@/lib/vehicles";
import VehicleForm from "@/components/admin/VehicleForm";
import PhotoManager from "@/components/admin/PhotoManager";
import CostsPanel from "@/components/admin/CostsPanel";
import DeleteVehicleButton from "@/components/admin/DeleteVehicleButton";
import { PageTitle, Skeleton, StatusBadge } from "@/components/admin/ui";

export default function UrediVoziloPage({ params, searchParams }: PageProps<"/admin/vozila/[id]">) {
  return (
    <>
      <Link href="/admin/vozila" className="text-sm text-muted hover:text-ink">← Vozila</Link>
      <Suspense fallback={<Skeleton rows={6} />}>
        <Editor params={params} searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Editor({ params, searchParams }: PageProps<"/admin/vozila/[id]">) {
  const { id } = await params;
  const { novo } = await searchParams;
  const vehicle = await getVehicle(id);
  if (!vehicle) notFound();
  const costs = await listVehicleCosts(id);
  const isPublic = vehicle.status === "u_ponudi" || vehicle.status === "rezervirano";

  return (
    <>
      <PageTitle
        action={
          isPublic ? (
            <Link href={`/vozila/${vehicle.slug}`} target="_blank" className="text-sm font-semibold text-accent shrink-0">
              Pogledaj oglas ↗
            </Link>
          ) : undefined
        }
      >
        <span className="flex items-center gap-3 flex-wrap">
          {vehicleTitle(vehicle)} <StatusBadge status={vehicle.status} />
        </span>
      </PageTitle>

      {novo && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          ✓ Vozilo je spremljeno. Dodajte fotografije ispod.
        </div>
      )}

      <div className="flex flex-col gap-6">
        <PhotoManager vehicleId={vehicle.id} initial={vehicle.images} />
        <VehicleForm vehicle={vehicle} />
        <CostsPanel
          vehicleId={vehicle.id}
          costs={costs}
          purchasePrice={vehicle.purchase_price}
          listingPrice={vehicle.listing_price}
          salePrice={vehicle.sale_price}
        />
        <div className="flex justify-end">
          <DeleteVehicleButton id={vehicle.id} />
        </div>
      </div>
    </>
  );
}
