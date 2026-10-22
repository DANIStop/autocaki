"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import { requestPasswordLink, setPassword, type FormState } from "@/lib/admin/actions";
import { inputClass } from "@/components/admin/ui";

function manualSubmit(action: (fd: FormData) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  };
}

function Message({ state }: { state: FormState }) {
  if (state?.error) return <p className="text-sm text-accent">{state.error}</p>;
  if (state?.ok) return <p className="text-sm text-emerald-700 font-semibold">✓ {state.ok}</p>;
  return null;
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordLink, undefined);
  return (
    <form onSubmit={manualSubmit(action)} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        E-mail
        <input name="email" type="email" autoComplete="username" required className={inputClass} />
      </label>
      <Message state={state} />
      <button disabled={pending} className="bg-accent hover:bg-accent-dark disabled:opacity-60 text-white text-sm font-semibold py-3 rounded">
        {pending ? "Slanje…" : "Pošalji link"}
      </button>
    </form>
  );
}

export function SetPasswordForm() {
  const [state, action, pending] = useActionState(setPassword, undefined);
  return (
    <form onSubmit={manualSubmit(action)} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Nova lozinka (najmanje 10 znakova)
        <input name="password" type="password" autoComplete="new-password" minLength={10} required className={inputClass} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Ponovite lozinku
        <input name="password2" type="password" autoComplete="new-password" minLength={10} required className={inputClass} />
      </label>
      <Message state={state} />
      <button disabled={pending} className="bg-accent hover:bg-accent-dark disabled:opacity-60 text-white text-sm font-semibold py-3 rounded">
        {pending ? "Spremanje…" : "Spremi lozinku"}
      </button>
    </form>
  );
}
