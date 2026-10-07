-- Auto Čaki — Supabase shema (V1, jednostavna, bez multi-tenant polja).
-- Pokreni ovo u Supabase dashboardu: Project -> SQL Editor -> New query -> paste -> Run.

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- VOZILA
-- ---------------------------------------------------------------------------
create table if not exists vehicles (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  make text not null,
  model text not null,
  year int,
  listing_price numeric(10, 2),
  sale_price numeric(10, 2), -- null dok se ne proda; unosi se stvarna prodajna cijena
  status text not null default 'u_ponudi'
    check (status in ('u_ponudi', 'rezervirano', 'prodano', 'na_obradi')),
  description text,
  images text[] default '{}',
  view_count int not null default 0,
  created_by text, -- 'danis' | 'dino'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists vehicle_costs (
  id uuid primary key default uuid_generate_v4(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  amount numeric(10, 2) not null,
  type text not null check (type in ('fiksni', 'dodatni')),
  note text,
  added_by text not null, -- 'danis' | 'dino'
  created_at timestamptz not null default now()
);

create table if not exists vehicle_notes (
  id uuid primary key default uuid_generate_v4(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  author text not null,
  note text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- KLIJENTI
-- ---------------------------------------------------------------------------
create table if not exists clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text,
  email text,
  flag text check (flag in ('bitan', 'ignoriraj')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists client_vehicle_interest (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references clients(id) on delete cascade,
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  type text not null check (type in ('upit', 'dolazak', 'kupnja')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- ŠTETE / VOZILA NA OBRADI
-- ---------------------------------------------------------------------------
create table if not exists repair_jobs (
  id uuid primary key default uuid_generate_v4(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  parts_needed text[] default '{}',
  status text not null default 'ceka_dijelove'
    check (status in ('ceka_dijelove', 'lakira_se', 'slaze_se', 'spremno')),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- PUTNI NALOZI + PRIJEVOZ (USLUGA)
-- ---------------------------------------------------------------------------
create table if not exists travel_orders (
  id uuid primary key default uuid_generate_v4(),
  travel_date date not null,
  destination text not null,
  costs jsonb not null default '[]', -- [{ "label": "gorivo", "amount": 40 }, ...]
  linked_vehicle_ids uuid[] default '{}',
  created_by text,
  created_at timestamptz not null default now()
);

create table if not exists transport_jobs (
  id uuid primary key default uuid_generate_v4(),
  client_name text not null,
  route text not null, -- npr. "München -> Zagreb"
  price_charged numeric(10, 2) not null,
  cost numeric(10, 2) default 0,
  travel_order_id uuid references travel_orders(id) on delete set null,
  job_date date not null default current_date,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- PRAĆENJE STRANIH OGLASA (agregacija spremljenih pretraga, ne live scraping)
-- ---------------------------------------------------------------------------
create table if not exists watched_listings (
  id uuid primary key default uuid_generate_v4(),
  source text not null check (source in ('autoscout24', 'mobile.de', 'drugo')),
  url text not null,
  title text,
  price numeric(10, 2),
  status text not null default 'novo'
    check (status in ('novo', 'kontaktirano', 'odbaceno')),
  captured_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- UVOZ KALKULATOR
-- ---------------------------------------------------------------------------
create table if not exists import_calculations (
  id uuid primary key default uuid_generate_v4(),
  vehicle_description text,
  origin_country text not null,
  base_price numeric(10, 2) not null,
  breakdown jsonb not null default '{}', -- { vat, customs, excise, transport, registration, total }
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- RASPORED
-- ---------------------------------------------------------------------------
create table if not exists schedule_events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  type text not null default 'ostalo'
    check (type in ('pregled', 'servis', 'preuzimanje', 'ostalo')),
  event_at timestamptz not null,
  reminder_minutes_before int default 60,
  related_vehicle_id uuid references vehicles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- JAVNI UPITI (kontakt forma) + TESTIMONIJALI
-- ---------------------------------------------------------------------------
create table if not exists inquiries (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null,
  email text,
  message text not null,
  vehicle_id uuid references vehicles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists testimonials (
  id uuid primary key default uuid_generate_v4(),
  client_name text not null,
  text text,
  image_url text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indeksi koji se najčešće koriste
-- ---------------------------------------------------------------------------
create index if not exists idx_vehicle_costs_vehicle on vehicle_costs(vehicle_id);
create index if not exists idx_vehicle_notes_vehicle on vehicle_notes(vehicle_id);
create index if not exists idx_client_vehicle_interest_vehicle on client_vehicle_interest(vehicle_id);
create index if not exists idx_inquiries_vehicle on inquiries(vehicle_id);

-- NAPOMENA o sigurnosti: /admin je zaštićen Supabase Authom (Faza 2) i tamo se koristi
-- service role key sa servera, pa RLS politike nisu nužne za V1 (samo Danis i Dino imaju
-- pristup adminu). Javna strana (kontakt forma) piše u `inquiries` preko servera, ne
-- direktno iz browsera, pa tablice mogu ostati bez javnih RLS politika.
