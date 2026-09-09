-- Offene Stellen je Klinik (Phase 5, Verfügbarkeits-Schritt im Funnel).
-- WICHTIG: Die hier eingefügten Kliniken sind Testdaten/Platzhalter, klar
-- als "(Beispiel)" gekennzeichnet — siehe docs/SPEC.md. Vor echtem Betrieb
-- mit echten Bewerbern müssen sie durch reale Daten ersetzt werden.

create table stellen (
  id uuid primary key default gen_random_uuid(),
  klinik_id uuid not null references kliniken (id),
  qualifikation qualifikation_enum not null,
  einsatzbereich einsatzbereich_enum not null,
  aktiv boolean not null default true,
  created_at timestamptz not null default now()
);

create index stellen_qualifikation_einsatzbereich_idx
  on stellen (qualifikation, einsatzbereich)
  where aktiv;

alter table stellen enable row level security;
-- Bewusst keine Policy für anon/authenticated — Zugriff ausschließlich über
-- die Edge Function "stellen-verfuegbarkeit" (service_role), analog zu allen
-- anderen Tabellen in diesem Projekt.

-- Testdaten: drei Beispiel-Kliniken mit einer Handvoll offenen Stellen, so
-- dass sowohl Treffer als auch der "keine Stelle gefunden"-Pfad beim Testen
-- vorkommen.
with neue_kliniken as (
  insert into kliniken (name, region)
  values
    ('Klinikum Nord (Beispiel)', 'Hamburg'),
    ('St. Elisabeth Krankenhaus (Beispiel)', 'Berlin'),
    ('Ambulantes OP-Zentrum Mitte (Beispiel)', 'München')
  returning id, name
)
insert into stellen (klinik_id, qualifikation, einsatzbereich)
select k.id, s.qualifikation, s.einsatzbereich
from neue_kliniken k
join (
  values
    ('Klinikum Nord (Beispiel)', 'OTA'::qualifikation_enum, 'OP'::einsatzbereich_enum),
    ('Klinikum Nord (Beispiel)', 'ATA'::qualifikation_enum, 'Anästhesie'::einsatzbereich_enum),
    ('Klinikum Nord (Beispiel)', 'Pflegefachfrau / Pflegefachmann'::qualifikation_enum, 'Intensivstation'::einsatzbereich_enum),
    ('Klinikum Nord (Beispiel)', 'Gesundheits- und Krankenpfleger/in'::qualifikation_enum, 'Normalstation'::einsatzbereich_enum),
    ('St. Elisabeth Krankenhaus (Beispiel)', 'Altenpfleger/in'::qualifikation_enum, 'Normalstation'::einsatzbereich_enum),
    ('St. Elisabeth Krankenhaus (Beispiel)', 'Pflegefachfrau / Pflegefachmann'::qualifikation_enum, 'Zentrale Notaufnahme'::einsatzbereich_enum),
    ('Ambulantes OP-Zentrum Mitte (Beispiel)', 'OTA'::qualifikation_enum, 'OP'::einsatzbereich_enum),
    ('Ambulantes OP-Zentrum Mitte (Beispiel)', 'ATA'::qualifikation_enum, 'OP'::einsatzbereich_enum)
) as s(klinik_name, qualifikation, einsatzbereich)
  on s.klinik_name = k.name;
