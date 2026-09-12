-- Admin-Layer (Phase 6), Teil 1: Datenmodell. Bewusst OHNE Policies — die
-- kommen in einer eigenen Folge-Migration zur expliziten Einzelfreigabe
-- (siehe docs/SPEC.md / CLAUDE.md).

-- 1. Status-Pipeline ersetzen (5 alte Werte -> 8 neue).
create type bewerbung_status_enum_v2 as enum (
  'neu',
  'gesichtet',
  'unterlagen_unvollstaendig',
  'gespraech',
  'an_klinik_vermittelt',
  'vermittelt_abgeschlossen',
  'abgelehnt',
  'zurueckgezogen'
);

alter table bewerbungen add column status_v2 bewerbung_status_enum_v2;

update bewerbungen set status_v2 = (case status
  when 'eingegangen' then 'neu'
  when 'in_pruefung' then 'gesichtet'
  when 'vermittelt' then 'an_klinik_vermittelt'
  when 'abgelehnt' then 'abgelehnt'
  when 'abgebrochen' then 'zurueckgezogen'
end)::bewerbung_status_enum_v2;

alter table bewerbungen alter column status_v2 set not null;
alter table bewerbungen alter column status_v2 set default 'neu';

drop index if exists bewerbungen_status_idx;
alter table bewerbungen drop column status;
alter table bewerbungen rename column status_v2 to status;
create index bewerbungen_status_idx on bewerbungen (status);

drop type bewerbung_status_enum;
alter type bewerbung_status_enum_v2 rename to bewerbung_status_enum;

-- 2. Aufbewahrungsfrist-Feld (manuell gesetzt, keine Automatik in v1).
alter table bewerbungen add column loeschdatum date;

-- 3. admin_users + is_admin()-Hilfsfunktion (Standard-Supabase-Pattern:
-- security definer umgeht gezielt die eigene RLS der Tabelle, gibt aber nur
-- ein Boolean zurück, nie Zeilen).
create table admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  angelegt_am timestamptz not null default now()
);
alter table admin_users enable row level security;

create function is_admin() returns boolean
  language sql security definer stable
  set search_path = ''
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- 4. Dokumente (mehrere typisierte Dateien pro Bewerbung, auch unzugeordnet).
create type dokument_typ_enum as enum (
  'lebenslauf',
  'urkunde',
  'anerkennungsbescheid',
  'arbeitszeugnis',
  'sprachzertifikat',
  'sonstiges'
);

create table dokumente (
  id uuid primary key default gen_random_uuid(),
  bewerbung_id uuid references bewerbungen (id) on delete cascade,
  typ dokument_typ_enum not null,
  storage_pfad text not null,
  dateiname text not null,
  hochgeladen_von uuid references admin_users (user_id),
  quelle text not null default 'bewerber_upload' check (quelle in ('bewerber_upload', 'admin_upload')),
  hochgeladen_am timestamptz not null default now()
);
create index dokumente_bewerbung_id_idx on dokumente (bewerbung_id);
alter table dokumente enable row level security;

-- 5. Interne Notizen.
create table notizen (
  id uuid primary key default gen_random_uuid(),
  bewerbung_id uuid not null references bewerbungen (id) on delete cascade,
  admin_user_id uuid not null references admin_users (user_id),
  text text not null,
  erstellt_am timestamptz not null default now()
);
create index notizen_bewerbung_id_idx on notizen (bewerbung_id);
alter table notizen enable row level security;

-- 6. Statusverlauf, automatisch per Trigger geschrieben (nicht auf
-- Admin-UI-Disziplin angewiesen) -- deckt auch Inserts durch die
-- öffentliche Edge Function ab (dort ohne admin_user_id).
create table status_verlauf (
  id uuid primary key default gen_random_uuid(),
  bewerbung_id uuid not null references bewerbungen (id) on delete cascade,
  alter_status bewerbung_status_enum,
  neuer_status bewerbung_status_enum not null,
  admin_user_id uuid references admin_users (user_id),
  zeitstempel timestamptz not null default now()
);
create index status_verlauf_bewerbung_id_idx on status_verlauf (bewerbung_id);
alter table status_verlauf enable row level security;

create function bewerbungen_log_status_change() returns trigger
  language plpgsql security definer
  set search_path = ''
as $$
begin
  if (TG_OP = 'INSERT') then
    insert into public.status_verlauf (bewerbung_id, alter_status, neuer_status, admin_user_id)
    values (new.id, null, new.status, null);
  elsif (TG_OP = 'UPDATE' and new.status is distinct from old.status) then
    insert into public.status_verlauf (bewerbung_id, alter_status, neuer_status, admin_user_id)
    values (new.id, old.status, new.status, auth.uid());
  end if;
  return new;
end;
$$;

create trigger bewerbungen_status_verlauf
  after insert or update on bewerbungen
  for each row execute function bewerbungen_log_status_change();

-- 7. Audit-Log (Detailansicht, Dokumentenabruf, Statuswechsel-Zusatzinfo,
-- Notiz, Löschung, CSV-Export, Listen-Abfrage -- nicht jede Listenzeile).
create table audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references admin_users (user_id),
  aktion text not null check (aktion in (
    'detail_angesehen', 'dokument_abgerufen', 'status_geaendert',
    'notiz_erstellt', 'bewerbung_geloescht', 'export_csv', 'liste_abgefragt'
  )),
  zieltabelle text,
  ziel_id uuid,
  details jsonb,
  zeitstempel timestamptz not null default now()
);
create index audit_log_admin_user_id_idx on audit_log (admin_user_id);
alter table audit_log enable row level security;

create function log_admin_audit(
  p_aktion text,
  p_zieltabelle text default null,
  p_ziel_id uuid default null,
  p_details jsonb default null
) returns void
  language plpgsql security definer
  set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'nicht autorisiert';
  end if;
  insert into public.audit_log (admin_user_id, aktion, zieltabelle, ziel_id, details)
  values (auth.uid(), p_aktion, p_zieltabelle, p_ziel_id, p_details);
end;
$$;
