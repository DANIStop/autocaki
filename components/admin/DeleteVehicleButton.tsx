"use client";

import { useTransition } from "react";
import { deleteVehicle } from "@/lib/admin/actions";

export default function DeleteVehicleButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        confirm("Trajno obrisati vozilo, njegove fotografije i troškove? Ovo se ne može poništiti.") &&
        startTransition(() => deleteVehicle(id))
      }
      className="text-sm font-semibold text-accent hover:text-accent-dark disabled:opacity-60"
    >
      {pending ? "Brisanje…" : "Obriši vozilo"}
    </button>
  );
}
