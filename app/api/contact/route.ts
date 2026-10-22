import { NextResponse } from "next/server";
import { getResendClient, CONTACT_EMAIL_TO, CONTACT_EMAIL_FROM } from "@/lib/resend";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type ContactPayload = {
  name: string;
  phone: string;
  email: string;
  message: string;
  subject?: string;
  vehicleId?: string;
};

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { name, phone, email, message, subject, vehicleId } = body;

  if (!name?.trim() || !phone?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  // 1) Spremi upit u Supabase (tablica `inquiries`) ako je baza spojena.
  const supabase = getSupabaseServerClient();
  let saved = false;
  if (supabase) {
    const { error } = await supabase.from("inquiries").insert({
      name,
      phone,
      email: email || null,
      message,
      vehicle_id: vehicleId && /^[0-9a-f-]{36}$/i.test(vehicleId) ? vehicleId : null,
    });
    if (error) {
      console.error("Supabase insert (inquiries) failed:", error.message);
      // ne prekidamo - mail ide dalje i bez zapisa u bazi
    } else {
      saved = true;
    }
  }

  // Ako upit nije ni spremljen ni poslan, javi grešku da forma ne prikaže lažni uspjeh.
  const notDelivered = () =>
    saved
      ? NextResponse.json({ ok: true, emailed: false })
      : NextResponse.json({ error: "not_delivered" }, { status: 502 });

  // 2) Pošalji mail preko Resenda.
  const resend = getResendClient();
  if (!resend) {
    console.warn(
      "RESEND_API_KEY nije postavljen — upit je zapisan u bazu (ako je spojena), mail nije poslan.",
    );
    return notDelivered();
  }

  try {
    // Resend ne baca grešku nego je vraća u `error` — zato je provjeravamo ručno.
    const { error } = await resend.emails.send({
      from: CONTACT_EMAIL_FROM,
      to: CONTACT_EMAIL_TO,
      replyTo: email || undefined,
      subject: `[autocaki.com] ${subject || "Novi upit"} — ${name}`,
      text: [
        `Ime: ${name}`,
        `Telefon: ${phone}`,
        `E-mail: ${email || "—"}`,
        vehicleId ? `Vozilo: ${vehicleId}` : null,
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });
    if (error) {
      console.error("Resend send failed:", error);
      return notDelivered();
    }
  } catch (err) {
    console.error("Resend send failed:", err);
    return notDelivered();
  }

  return NextResponse.json({ ok: true, emailed: true });
}
