import { saveRepairJob, deleteRepairJob } from "@/lib/admin/module-actions";
import { REPAIR_STATUSES, type RepairJob } from "@/lib/admin/module-meta";
import { ActionButton, ActionForm, Field } from "@/components/admin/controls";
import { Card, inputClass } from "@/components/admin/ui";

// Obrada / šteta vozila: popis dijelova i status popravka.
export default function RepairPanel({ vehicleId, job }: { vehicleId: string; job: RepairJob | null }) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-sm font-semibold normal-case font-body">Obrada / štete</h2>
        {job && (
          <ActionButton action={deleteRepairJob.bind(null, job.id)} confirmText="Ukloniti vozilo iz obrade?" className="text-xs font-semibold text-muted hover:text-accent">
            Ukloni iz obrade
          </ActionButton>
        )}
      </div>
      <ActionForm action={saveRepairJob.bind(null, vehicleId)} submitLabel={job ? "Spremi obradu" : "Dodaj u obradu"} resetOnOk={false} className="grid gap-4 sm:grid-cols-[1fr_12rem]">
        <Field label="Potrebni dijelovi / radovi (jedan po retku)">
          <textarea name="parts" rows={3} defaultValue={job?.parts_needed.join("\n") ?? ""} placeholder={"prednji branik\nlakiranje vrata"} className={`${inputClass} resize-y`} />
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={job?.status ?? "ceka_dijelove"} className={inputClass}>
            {Object.entries(REPAIR_STATUSES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </Field>
      </ActionForm>
    </Card>
  );
}
