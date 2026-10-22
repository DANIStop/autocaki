"use client";

import { startTransition, useActionState, useEffect, useRef, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { FormState } from "@/lib/admin/actions";

// Forma za Server Action: poruka „✓ …“ nakon uspjeha, osvježavanje podataka, bez gubitka unosa kod greške.
export function ActionForm({
  action,
  children,
  submitLabel = "Spremi",
  className = "",
  resetOnOk = true,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  children: React.ReactNode;
  submitLabel?: string;
  className?: string;
  resetOnOk?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const ref = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!state?.ok) return;
    if (resetOnOk) ref.current?.reset();
    router.refresh();
  }, [state, resetOnOk, router]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => formAction(fd));
  };

  return (
    <form ref={ref} onSubmit={onSubmit} className={className}>
      {children}
      <div className="flex flex-wrap items-center gap-3 sm:col-span-full">
        <button disabled={pending} className="bg-accent hover:bg-accent-dark disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded">
          {pending ? "Spremanje…" : submitLabel}
        </button>
        {state?.error && <span className="text-sm text-accent">{state.error}</span>}
        {state?.ok && !pending && <span className="text-sm font-semibold text-emerald-700">✓ {state.ok}</span>}
      </div>
    </form>
  );
}

// Gumb koji pokreće Server Action (npr. brisanje), uz potvrdu i osvježavanje.
export function ActionButton({
  action,
  children,
  confirmText,
  className = "text-sm font-semibold text-accent hover:text-accent-dark",
}: {
  action: () => Promise<void>;
  children: React.ReactNode;
  confirmText?: string;
  className?: string;
}) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirmText && !confirm(confirmText)) return;
        start(async () => {
          await action();
          router.refresh();
        });
      }}
      className={`${className} disabled:opacity-50`}
    >
      {pending ? "…" : children}
    </button>
  );
}

// Padajući izbornik koji odmah sprema novu vrijednost (npr. status).
export function ActionSelect<T extends string>({
  action,
  value,
  options,
  className = "",
}: {
  action: (value: T) => Promise<void>;
  value: T;
  options: Record<T, string>;
  className?: string;
}) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <select
      defaultValue={value}
      disabled={pending}
      onChange={(e) => {
        const v = e.target.value as T;
        start(async () => {
          await action(v);
          router.refresh();
        });
      }}
      className={`border border-line bg-white rounded px-2 py-1.5 text-xs font-semibold disabled:opacity-50 ${className}`}
    >
      {(Object.entries(options) as [T, string][]).map(([k, l]) => (
        <option key={k} value={k}>{l}</option>
      ))}
    </select>
  );
}

export function Field({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm font-medium ${wide ? "sm:col-span-full" : ""}`}>
      {label}
      {children}
    </label>
  );
}
