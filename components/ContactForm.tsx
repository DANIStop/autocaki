"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm({
  defaultSubject,
  vehicleId,
}: {
  defaultSubject?: string;
  vehicleId?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      email: String(data.get("email") || ""),
      message: String(data.get("message") || ""),
      subject: defaultSubject ?? "Upit s kontakt forme",
      vehicleId,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("send_failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setError("Nešto je pošlo po zlu. Pokušajte ponovno ili nas nazovite.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded border border-line bg-paper p-6 text-sm">
        Hvala na upitu! Javljamo se što prije na uneseni broj ili e-mail.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 max-w-lg">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Ime i prezime
        </label>
        <input
          id="name"
          name="name"
          required
          className="border border-line rounded px-3.5 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium">
            Telefon
          </label>
          <input
            id="phone"
            name="phone"
            required
            className="border border-line rounded px-3.5 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="border border-line rounded px-3.5 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          Poruka
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="border border-line rounded px-3.5 py-2.5 text-sm outline-none focus:border-accent resize-none"
        />
      </div>

      {error && <p className="text-sm text-accent">{error}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="self-start bg-accent hover:bg-accent-dark disabled:opacity-60 text-white text-sm font-semibold px-6 py-3 rounded transition-colors"
      >
        {status === "sending" ? "Slanje…" : "Pošalji upit"}
      </button>
    </form>
  );
}
