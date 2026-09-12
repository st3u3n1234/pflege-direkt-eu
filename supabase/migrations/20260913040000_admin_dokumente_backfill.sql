-- Admin-Layer (Phase 6), Teil 4: bestehende zeugnis_pfad-Daten ins neue
-- dokumente-Modell nachtragen. Der Funnel-Upload wird als "urkunde"
-- eingeordnet (Nachweis über den Berufsabschluss, kein Arbeitszeugnis im
-- Sinne einer Referenz).
insert into dokumente (bewerbung_id, typ, storage_pfad, dateiname, quelle, hochgeladen_am)
select id, 'urkunde', zeugnis_pfad, 'zeugnis', 'bewerber_upload', created_at
from bewerbungen
where zeugnis_pfad is not null;
