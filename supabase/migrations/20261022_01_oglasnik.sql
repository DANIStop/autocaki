-- Oglasnik + admin V1: dodatna polja vozila, bucket za fotografije, updated_at trigger.

alter table vehicles
  add column if not exists variant text,
  add column if not exists km int,
  add column if not exists fuel text
    check (fuel in ('benzin', 'dizel', 'hibrid', 'plug_in_hibrid', 'elektricni', 'plin')),
  add column if not exists gearbox text check (gearbox in ('rucni', 'automatski')),
  add column if not exists power_kw int,
  add column if not exists body_type text,
  add column if not exists color text,
  add column if not exists vin text,
  add column if not exists purchase_price numeric(10, 2),
  add column if not exists featured boolean not null default false,
  add column if not exists sold_at timestamptz;

create index if not exists idx_vehicles_status on vehicles(status);

create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists vehicles_updated_at on vehicles;
create trigger vehicles_updated_at before update on vehicles
  for each row execute function set_updated_at();

-- Javni bucket: fotografije oglasa su javne; upload ide preko servera (signed upload URL).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('vehicle-photos', 'vehicle-photos', true, 10485760,
        array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
