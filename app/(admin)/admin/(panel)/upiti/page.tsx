import Link from "next/link";
import { Suspense } from "react";
import { listInquiries } from "@/lib/admin/data";
import { clientFromInquiry } from "@/lib/admin/module-actions";
import { ActionButton } from "@/components/admin/controls";
import { PageTitle, Skeleton } from "@/components/admin/ui";

const dateFmt = new Intl.DateTimeFormat("hr-HR", {
  day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Zagreb",
});

export default function UpitiPage() {
  return (
    <>
      <PageTitle>Upiti</PageTitle>
      <Suspense fallback={<Skeleton rows={5} />}>
        <InquiryList />
      </Suspense>
    </>
  );
}

async function InquiryList() {
  const inquiries = await listInquiries();
  if (inquiries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-white p-10 text-center text-sm text-muted">
        Još nema upita. Upiti s kontakt forme i oglasa pojavit će se ovdje.
      </div>
    );
  }
  return (
    <ul className="flex flex-col gap-3">
      {inquiries.map((q) => {
        const wa = `https://wa.me/${q.phone.replace(/[^\d]/g, "").replace(/^0/, "385")}`;
        return (
          <li key={q.id} className="rounded-lg border border-line bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{q.name}</div>
                <div className="text-xs text-muted mt-0.5">{dateFmt.format(new Date(q.created_at))}</div>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${q.phone}`} className="rounded border border-line px-3 py-1.5 text-xs font-semibold hover:border-ink">
                  ☎ {q.phone}
                </a>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white">
                  WhatsApp
                </a>
                <ActionButton action={clientFromInquiry.bind(null, q.id)} className="rounded bg-navy px-3 py-1.5 text-xs font-semibold text-white">
                  → Klijent
                </ActionButton>
                {q.email && (
                  <a href={`mailto:${q.email}`} className="rounded border border-line px-3 py-1.5 text-xs font-semibold hover:border-ink">
                    E-mail
                  </a>
                )}
              </div>
            </div>
            {q.vehicle && (
              <Link href={`/vozila/${q.vehicle.slug}`} target="_blank" className="mt-3 inline-block text-xs font-semibold text-accent">
                Vozilo: {q.vehicle.make} {q.vehicle.model} ↗
              </Link>
            )}
            <p className="mt-3 text-sm whitespace-pre-line">{q.message}</p>
          </li>
        );
      })}
    </ul>
  );
}
