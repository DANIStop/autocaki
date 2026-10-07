# Auto Čaki — autocaki.com

Next.js 16 (App Router) + Tailwind v4 + Supabase + Resend.

Faza 1 (gotova u ovom paketu): javna landing stranica — usluge (prijevoz, prodaja,
uvoz), galerija (placeholder), testimonijali (placeholder), kontakt forma koja šalje
mail i (ako je Supabase spojen) sprema upit u bazu. `/admin` je prazan placeholder —
CRM moduli dolaze u Fazi 2, po spec dokumentu.

## Checklist za postavljanje (redoslijed)

### 1. Supabase (baza)
1. Na [supabase.com](https://supabase.com) otvori novi projekt (ako već nemaš).
2. **SQL Editor -> New query** -> zalijepi sadržaj `supabase/schema.sql` -> Run.
3. **Project Settings -> API** -> kopiraj `Project URL`, `anon public` key i
   `service_role` key.

### 2. Resend (mail)
1. Na [resend.com](https://resend.com) -> **API Keys** -> napravi novi key.
2. (Kasnije, kad budeš spreman) **Domains** -> dodaj `autocaki.com`, slijedi upute za
   DNS zapise (slično kao kod Zoha) da mail ide s `info@autocaki.com` umjesto
   privremene `onboarding@resend.dev` adrese.

### 3. GitHub
1. Napravi novi repozitorij (npr. `autocaki`).
2. Push ovog koda tamo (ili to uradim ja ako mi daš pristup/token).

### 4. Vercel (hosting)
1. **New Project** -> importiraj GitHub repo.
2. U **Environment Variables** unesi sve iz `.env.example` sa stvarnim vrijednostima.
3. Deploy.
4. **Settings -> Domains** -> dodaj `autocaki.com`, slijedi DNS upute (A/CNAME zapis
   kod registrara, isti princip kao Zoho MX/TXT zapisi).

### 5. Lokalno pokretanje (opcionalno)
```bash
npm install
cp .env.example .env.local   # pa upiši stvarne vrijednosti
npm run dev
```

## Što je potrebno od tebe da krenemo dalje

- Stvarne fotografije vozila/usluga (zamjena za "Slika 1..8" placeholdere na
  naslovnoj).
- Stvarni broj telefona (trenutno `[BROJ TELEFONA]` u headeru/footeru/kontaktu).
- Pravi testimonijali kad ih skupiš (trenutno 3 izmišljena, za test).
- Supabase, Resend, GitHub i Vercel pristup/tokeni — kad kažeš da si spreman, javi i
  provest ćemo postavljanje zajedno (ti otvoriš, ja pišem/deployam).
