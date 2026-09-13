-- Bewerber-Konto (Phase 7), Teil 1: Datenmodell. Bewusst OHNE neue
-- RLS-Policies -- die kommen in einer eigenen Folge-Migration zur
-- expliziten Einzelfreigabe (siehe CLAUDE.md / Plan-Prozess).

-- 1. Verknüpfung Bewerbung <-> Supabase-Auth-Konto. Nullable: alte
-- Bewerbungen bleiben bewusst unverknüpft (siehe Plan), nur neue
-- Bewerbungen bekommen ab jetzt automatisch ein Konto.
alter table bewerbungen add column user_id uuid references auth.users (id) on delete set null;
create index bewerbungen_user_id_idx on bewerbungen (user_id);

-- 2. Verknüpfungs-Funktion für den ersten Login nach einer Bewerbung.
-- security definer, weil es dafür bewusst KEINE offene RLS-Policy gibt
-- ("jede/r authentifizierte Nutzer darf jede unverknüpfte Zeile
-- verknüpfen" wäre zu breit) -- die Autorisierung (E-Mail muss zur
-- Bewerbung passen, Zeile darf noch nicht verknüpft sein) steckt
-- stattdessen in der Funktion selbst, analog zu log_admin_audit().
create function bewerbung_konto_verknuepfen(p_bewerbung_id uuid) returns boolean
  language plpgsql security definer
  set search_path = ''
as $$
declare
  v_email text;
  v_updated int;
begin
  if auth.uid() is null then
    raise exception 'nicht angemeldet';
  end if;

  v_email := auth.jwt() ->> 'email';

  update public.bewerbungen
    set user_id = auth.uid()
  where id = p_bewerbung_id
    and user_id is null
    and lower(email) = lower(coalesce(v_email, ''));

  get diagnostics v_updated = row_count;
  return v_updated > 0;
end;
$$;

-- Wie bei is_admin()/log_admin_audit(): security-definer-Funktionen sind
-- per PostgREST-Default für anon/authenticated aufrufbar -- explizit auf
-- authenticated einschränken.
revoke execute on function bewerbung_konto_verknuepfen(uuid) from public, anon;
grant execute on function bewerbung_konto_verknuepfen(uuid) to authenticated;

-- 3. Schutz sensibler Spalten vor Selbst-Service-Bearbeitung durch den
-- Bewerber. service_role (die bestehende Edge Function
-- bewerbung-einreichen aktualisiert zeugnis_pfad) und is_admin() bleiben
-- ausdrücklich ausgenommen -- nur ein eingeloggter, nicht-admin Bewerber
-- darf diese Spalten nicht anfassen.
create function bewerbungen_bewerber_spalten_schuetzen() returns trigger
  language plpgsql
  set search_path = ''
as $$
begin
  if auth.role() = 'service_role' or public.is_admin() then
    return new;
  end if;

  if new.status is distinct from old.status
    or new.klinik_id is distinct from old.klinik_id
    or new.user_id is distinct from old.user_id
    or new.loeschdatum is distinct from old.loeschdatum
    or new.zeugnis_pfad is distinct from old.zeugnis_pfad
    or new.email is distinct from old.email
  then
    raise exception 'diese Felder können nicht selbst geändert werden';
  end if;

  return new;
end;
$$;

create trigger bewerbungen_bewerber_spalten_schuetzen
  before update on bewerbungen
  for each row execute function bewerbungen_bewerber_spalten_schuetzen();

-- 4. audit_log erlaubt jetzt zusätzlich eine Selbst-Löschung durch den
-- Bewerber (Pendant zu "bewerbung_geloescht" durch einen Admin). Text-Check-
-- Constraints lassen sich nicht per ADD VALUE erweitern wie ein Enum,
-- daher neu definieren.
alter table audit_log drop constraint audit_log_aktion_check;
alter table audit_log add constraint audit_log_aktion_check check (aktion in (
  'detail_angesehen', 'dokument_abgerufen', 'status_geaendert',
  'notiz_erstellt', 'bewerbung_geloescht', 'export_csv', 'liste_abgefragt',
  'bewerbung_selbst_geloescht'
));
