import type { Client } from "@/lib/admin/modules";
import { Field } from "@/components/admin/controls";
import { inputClass } from "@/components/admin/ui";

export default function ClientFields({ c }: { c?: Client }) {
  return (
    <>
      {c && <input type="hidden" name="id" value={c.id} />}
      <Field label="Ime i prezime *"><input name="name" required defaultValue={c?.name} className={inputClass} /></Field>
      <Field label="Telefon"><input name="phone" type="tel" defaultValue={c?.phone ?? ""} className={inputClass} /></Field>
      <Field label="E-mail"><input name="email" type="email" defaultValue={c?.email ?? ""} className={inputClass} /></Field>
      <Field label="Oznaka">
        <select name="flag" defaultValue={c?.flag ?? ""} className={inputClass}>
          <option value="">—</option>
          <option value="bitan">★ Bitan</option>
          <option value="ignoriraj">Ignoriraj</option>
        </select>
      </Field>
      <Field label="Bilješke" wide>
        <textarea name="notes" rows={4} defaultValue={c?.notes ?? ""} className={`${inputClass} resize-y`} />
      </Field>
    </>
  );
}
