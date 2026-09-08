-- Bewerbungen, Kliniken, Enums, RLS.
-- Enum-Werte spiegeln exakt supabase/functions/_shared/enums.json —
-- bei Änderung dort auch diese Migration (per neuer Folge-Migration) anpassen.

create type qualifikation_enum as enum (
  'Pflegefachfrau / Pflegefachmann',
  'Gesundheits- und Krankenpfleger/in',
  'Gesundheits- und Kinderkrankenpfleger/in',
  'Altenpfleger/in',
  'OTA',
  'ATA'
);

create type fachweiterbildung_enum as enum (
  'Nein',
  'Intensivpflege',
  'Anästhesie',
  'Notfallpflege',
  'OP',
  'Sonstige Fachweiterbildung'
);

create type einsatzbereich_enum as enum (
  'OP',
  'Anästhesie',
  'Intensivstation',
  'Neo-Intensivstation',
  'Zentrale Notaufnahme',
  'Normalstation'
);

create type arbeitszeitmodell_enum as enum (
  'Vollzeit',
  'Teilzeit',
  'Nebenjob',
  'Minijob',
  'Individuelle Wochenstunden'
);

create type eintrittstermin_enum as enum (
  'Sofort',
  'Innerhalb von 4 Wochen',
  'In 1-3 Monaten',
  'Später'
);

-- Manuelle Team-Pipeline (kein automatisches Matching, siehe docs/SPEC.md).
create type bewerbung_status_enum as enum (
  'eingegangen',
  'in_pruefung',
  'vermittelt',
  'abgelehnt',
  'abgebrochen'
);

-- Minimal, da Klinik-Onboarding laut docs/SPEC.md in v1 manuell/offen ist.
-- Dient nur der Mandantentrennung im Datenmodell, kein Self-Service.
create table kliniken (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text,
  created_at timestamptz not null default now()
);

alter table kliniken enable row level security;
-- Bewusst keine Policy für anon/authenticated: nur service_role (bypassed
-- RLS immer) darf lesen/schreiben.

create table bewerbungen (
  id uuid primary key default gen_random_uuid(),

  -- Persönliche Daten
  vorname text not null,
  nachname text not null,
  strasse text not null,
  plz text not null,
  ort text not null,
  email text not null,
  telefon text not null,

  -- Berufliche Angaben
  qualifikation qualifikation_enum not null,
  fachweiterbildung fachweiterbildung_enum not null default 'Nein',
  einsatzbereich einsatzbereich_enum not null,
  arbeitszeitmodell arbeitszeitmodell_enum not null,
  wochenstunden smallint,
  arbeitsort_region text not null,
  eintrittstermin eintrittstermin_enum not null,

  -- Pflichtdokument (Pfad im privaten Storage-Bucket "zeugnisse")
  zeugnis_pfad text,

  -- Manuelle Vermittlungs-Pipeline
  status bewerbung_status_enum not null default 'eingegangen',
  klinik_id uuid references kliniken (id),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint plz_fuenfstellig check (plz ~ '^[0-9]{5}$'),
  constraint wochenstunden_nur_bei_individuell check (
    (arbeitszeitmodell = 'Individuelle Wochenstunden' and wochenstunden is not null)
    or
    (arbeitszeitmodell <> 'Individuelle Wochenstunden' and wochenstunden is null)
  ),
  constraint wochenstunden_plausibel check (
    wochenstunden is null or (wochenstunden > 0 and wochenstunden <= 48)
  )
);

create index bewerbungen_status_idx on bewerbungen (status);
create index bewerbungen_klinik_id_idx on bewerbungen (klinik_id);

alter table bewerbungen enable row level security;
-- Bewusst keine Policy für anon/authenticated: der öffentliche Website-
-- Besucher darf nie direkt lesen oder schreiben. Der einzige Schreibweg ist
-- die Edge Function "bewerbung-einreichen", die serverseitig mit dem
-- Service-Role-Key arbeitet (bypassed RLS grundsätzlich).

create function set_updated_at() returns trigger
  language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger bewerbungen_set_updated_at
  before update on bewerbungen
  for each row
  execute function set_updated_at();

-- Kurzlebiges Rate-Limit-Log für die Edge Function (siehe dort). Nur
-- gehashte IPs (sha256(ip + Pepper-Secret)), keine Klartext-IPs.
create table bewerbung_rate_limits (
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index bewerbung_rate_limits_ip_hash_idx on bewerbung_rate_limits (ip_hash, created_at);

alter table bewerbung_rate_limits enable row level security;
-- Auch hier keine anon/authenticated-Policy — nur service_role.
