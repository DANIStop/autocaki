"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import { signIn } from "@/lib/admin/actions";
import { inputClass } from "@/components/admin/ui";

export default function LoginForm() {
  const [state, action, pending] = useActionState(signIn, undefined);
  // Ručni submit: React inače resetira formu nakon akcije pa bi nestao upisani e-mail.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  };
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        E-mail
        <input name="email" type="email" autoComplete="username" required className={inputClass} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Lozinka
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </label>
      {state?.error && <p className="text-sm text-accent">{state.error}</p>}
      <button
        disabled={pending}
        className="bg-accent hover:bg-accent-dark disabled:opacity-60 text-white text-sm font-semibold py-3 rounded transition-colors"
      >
        {pending ? "Prijava…" : "Prijavi se"}
      </button>
    </form>
  );
}
