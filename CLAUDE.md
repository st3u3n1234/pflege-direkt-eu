# SymplyMedical — Projektkontext

Direktvermittlung von examinierten Pflegefachpersonen, OTA und ATA an Kliniken.
Markenname seit Phase 5 „SymplyMedical" (vorher „PflegeDirekt" — Projekt-/
Repo-/Netlify-Bezeichner blieben bewusst unverändert, siehe
„Live-Infrastruktur" unten). Logo: Siegel-Emblem `public/logo-symplymedical.png`
(Eule + Äskulapstab), Lockup mit Schriftzug in `public/logo-symplymedical-lockup.png`.

**Hinweis zur Zielgruppe:** Der Nutzer hat eine Erweiterung auf ca. 25
Berufsgruppen (inkl. Ärzte, Rettungsdienst, Therapieberufe, MFA — teils
bisher explizit ausgeschlossen) angekündigt. Das ist ein eigener, noch nicht
umgesetzter Umbau mit eigener Planung — der Abschnitt „Zielgruppe" unten
beschreibt den *aktuellen* Stand (examinierte Pflegefachpersonen/OTA/ATA),
nicht den Zielzustand.
Konzeptgrundlage: [docs/Website-Konzept_Pflegevermittlung.pdf](docs/Website-Konzept_Pflegevermittlung.pdf).
Offene fachliche/rechtliche Fragen, die das PDF nicht beantwortet, werden in
Phase 0 geklärt und in `docs/SPEC.md` festgehalten — dieses Dokument enthält
nur, was aus dem Konzept bereits feststeht.

## Kernversprechen

- Einmal Daten und Abschlussnachweis übermitteln, keine Mehrfachbewerbung.
- Abgleich mit den Anforderungen der jeweiligen Klinik, danach direkte
  Vermittlung bei passender Qualifikation.
- Vorstellungstermin so kurzfristig wie möglich, je nach Klinik auch am
  Folgetag — **keine Garantie**.
- Kostenlos für Bewerberinnen und Bewerber.
- 400 € Sonderzahlung, wenn das vermittelte Arbeitsverhältnis nach drei
  Monaten weiterhin besteht.

## Zielgruppe

**Gesucht:** Pflegefachfrau/-mann, Gesundheits- und Krankenpfleger/in,
Gesundheits- und Kinderkrankenpfleger/in, Altenpfleger/in mit staatlicher
Anerkennung, Pflegefachkräfte mit Fachweiterbildung (insbesondere
Intensivpflege, Anästhesie, Notfallpflege, OP, Pädiatrie), OTA, ATA.

**Nicht vermittelt:** Pflegehelfer/in, Pflegeassistent/in, MFA, Auszubildende,
ungelernte Pflegekräfte, sonstige nicht examinierte Assistenzberufe.

Diese Trennung ist ein Produktkernpunkt, kein Detail — sie muss im Funnel,
im Formular und in jeder Fehlerbehandlung konsequent durchgehalten werden.

## Navigation (verbindlich)

Start · Stelle finden · So funktioniert es · FAQ · Kontakt

Footer verlinkt zwingend: Impressum, Datenschutzerklärung, Bonusbedingungen.

## Einsatzbereiche (Enum)

OP, Anästhesie, Intensivstation, Neo-Intensivstation, Zentrale Notaufnahme,
Normalstation.

## Arbeitszeitmodelle (Enum)

Vollzeit, Teilzeit, Nebenjob, Minijob, Individuelle Wochenstunden (numerisch,
z. B. 20/25/30/35 — nur relevant, wenn "Individuelle Wochenstunden" gewählt
wurde). Die real angebotenen Modelle hängen vom jeweiligen Arbeitgeber ab —
das nie als feste Zusage formulieren.

## Formular / Datenmodell (aus Konzept Abschnitt 6–7)

Persönliche Daten: Vorname, Nachname, Straße/Hausnummer, PLZ (exakt 5
Ziffern), Ort, E-Mail, Telefonnummer. (In Phase 2 aus dem ursprünglich
einzelnen "Adresse"-Feld präzisiert, weil die PLZ-Constraint ein eigenes
Feld braucht — inhaltlich keine Änderung des Konzepts.)

Berufliche Angaben:
- Qualifikation: Pflegefachfrau/-mann, Gesundheits- und Krankenpfleger/in,
  Gesundheits- und Kinderkrankenpfleger/in, Altenpfleger/in, OTA, ATA
- Fachweiterbildung: Nein, Intensivpflege, Anästhesie, Notfallpflege, OP,
  Sonstige Fachweiterbildung
- gewünschter Einsatzbereich (siehe Enum oben)
- gewünschtes Arbeitszeitmodell / Wochenstunden (siehe Enum oben)
- gewünschter Arbeitsort / Region
- möglicher Eintrittstermin: Sofort, Innerhalb von 4 Wochen, In 1-3 Monaten,
  Später

Pflichtdokument: Zeugnis bzw. Nachweis über den abgeschlossenen
Berufsabschluss (Upload).

Reihenfolge im Funnel (verbindlich): Qualifikation → Fachweiterbildung →
Einsatzbereich → Arbeitsmodell → Eintrittstermin → persönliche Daten →
Zeugnis-Upload.

## DSGVO-Anforderungen (aus Konzept Abschnitt 8)

- Checkbox zur Kenntnisnahme der Datenschutzerklärung, nicht vorausgewählt.
- Klare Zweckangabe direkt bei der Checkbox: Verarbeitung zum Zweck der
  Stellenvermittlung.
- Weitergabe von Bewerbungsdaten an eine konkrete Klinik nur auf geeigneter
  datenschutzrechtlicher Grundlage bzw. mit Zustimmung, sofern erforderlich.
- Konkrete Aufbewahrungsfristen, Auftragsverarbeiter und die genaue
  Rechtsgrundlage für die Weitergabe sind **offen** und werden in
  `docs/SPEC.md` (Phase 0) geklärt — bis dahin nur Platzhalter mit
  "TODO: juristisch prüfen" verwenden, keine Fristen erfinden.

## Verbotene Formulierungen (aus Konzept Abschnitt 10)

Niemals Garantien versprechen, insbesondere nicht:
- „Du wirst garantiert am nächsten Tag zum Vorstellungsgespräch eingeladen.“
  → stattdessen: „Wir koordinieren dein Vorstellungsgespräch so schnell wie
  möglich – je nach Verfügbarkeit der Klinik auch am Folgetag.“
- „Du wirst garantiert eingestellt.“ → stattdessen: „Wenn die Voraussetzungen
  der Klinik erfüllt sind, stellen wir den direkten Kontakt her und
  koordinieren den weiteren Bewerbungsprozess.“

Jeder neue Text auf der Seite muss gegen diese Regel geprüft werden, bevor er
gemerged wird.

## Design-Ton

Ruhig, vertrauenswürdig, medizinisches Umfeld. Kuratierte, nicht generische
klinische Fotografie statt beliebiger Stock-Bilder (seit Phase 5: drei
Unsplash-Fotos — EKG-Monitor, OP-Team, OP-Handschuhe — bewusst ausgewählt,
per CSS-Overlay auf die Petrol-Palette abgestimmt), kein generischer
Startup-Blau-Gradient. Barrierefreiheit (WCAG 2.1 AA) ist
Anforderung, nicht Kür: Kontraste, Fokuszustände, Formularlabels,
Tastaturbedienung, Screenreader-Ansage bei Schrittwechseln im Funnel.

## Tech-Stack (Zielarchitektur)

- Frontend: Astro, TypeScript strict, Tailwind, npm
- Backend: Supabase (Projekt-Region **eu-central-1**, verbindlich) für
  Datenbank, Storage (privater Bucket für Zeugnisse) und Edge Functions
- Hosting: Netlify, Produktion nur von `main`, Deploy Previews für Branches
- Kein Klartext-Secret im Client-Bundle. Service-Role-Key ausschließlich in
  Supabase, nie bei Netlify.

## Live-Infrastruktur (Phase 4)

- Git-Repo: `https://github.com/st3u3n1234/pflege-direkt-eu`
- Netlify-Site: `pflege-direkt` → Live-URL `https://pflege-direkt.netlify.app`
  (Produktion öffentlich, Deploy-Previews hinter Netlify-Team-SSO-Login)
- Supabase-Projekt: `dnjdykrpbdhsvsyfzxxa` (Frankfurt/eu-central-1)
- Netlify-Env-Vars: ausschließlich `PUBLIC_SUPABASE_URL` und
  `PUBLIC_SUPABASE_ANON_KEY` — kein Service-Role-Key.

## Datenbankschema (Phase 2)

Kanonisch in `supabase/migrations/` (Reihenfolge = Ausführungsreihenfolge).
Wichtigste Tabellen: `bewerbungen` (ein Datensatz pro Bewerbung, inkl.
`status`-Enum für die manuelle Team-Pipeline aus `docs/SPEC.md` und
`klinik_id` für die spätere manuelle Zuordnung), `kliniken` (minimal, kein
Self-Service), `bewerbung_rate_limits` (kurzlebiges IP-Hash-Log fürs
Rate-Limiting, kein Klartext). RLS ist auf allen dreien aktiv, bewusst ohne
Policy für `anon`/`authenticated` — einziger Schreib-/Lesezugriff ist die
Edge Function `supabase/functions/bewerbung-einreichen` über den
Service-Role-Key.

Die Formular-/Datenbank-Enums (Qualifikation, Fachweiterbildung,
Einsatzbereich, Arbeitszeitmodell, Eintrittstermin) leben kanonisch in
`supabase/functions/bewerbung-einreichen/_shared/enums.ts` — sowohl die Zod-
Validierung der Edge Function als auch `src/data/content.ts` (Frontend)
importieren von dort. Bei einer Änderung: zuerst diese Datei anpassen, dann
per neuer Migration die Postgres-Enums nachziehen.

Zeugnis-Upload läuft nie durch die Edge Function selbst, sondern über eine
von ihr erzeugte signierte Storage-Upload-URL (Pfadschema
`bewerbungen/{bewerbung_id}/zeugnis`) — das Frontend lädt direkt zu Storage
hoch.

## Beruf→Bereich-Matrix (Phase 5, berufsrechtlich geprüft)

Rechtsgrundlage: ATA-OTA-Gesetz §§ 9/10, PflBG §§ 1, 4, 64/64a (vom Nutzer
gegengeprüft). Zwei Felder pro Beruf statt einer einzelnen Erlaubt/Verboten-
Flagge, weil „berufsrechtlich zulässig" und „praktisch ausgeschrieben"
auseinanderfallen (z. B. bei Altenpflege):

| Beruf | `rechtlich_zulaessig` | `marktgaengig` |
|---|---|---|
| OTA | OP, Zentrale Notaufnahme | OP |
| ATA | Anästhesie, OP, Zentrale Notaufnahme | Anästhesie |
| Pflegefachfrau/-mann | alle 6 | alle 6 |
| Gesundheits- und Krankenpfleger/in | alle 6 | alle außer Neo-Intensivstation |
| Gesundheits- und Kinderkrankenpfleger/in | alle 6 | Neo-Intensivstation, Normalstation, Zentrale Notaufnahme |
| Altenpfleger/in | alle 6 | Normalstation |

OTA/ATA erhalten **nie** Intensivstation/Neo-Intensivstation (ITS ist laut
Rechtsprüfung „No-go-Area" für beide). Quelle:
`supabase/functions/bewerbung-einreichen/_shared/enums.ts`
(`berufBereichMatrix`). Fachweiterbildung ist eine eigene Filterdimension,
kein Teil dieser Matrix. Job-Titel-Synonyme seit PflStudStG 15.12.2023
(„Pflegefachperson", „Altenpflegefachperson") sind reine Anzeige-Zusätze
(`qualifikationAnzeige`), keine eigenen Enum-Werte.

## Nicht Teil dieses Dokuments

Klinik-Onboarding, Matching-Logik, Benachrichtigungswege, Domain und
Aufbewahrungsfristen für Bewerberdaten sind bewusst offen gelassen und werden
in Phase 0 per Interview geklärt → Ergebnis in `docs/SPEC.md`.

## Lokale Entwicklung (Astro)

Dev-Server im Hintergrund starten: `astro dev --background`. Verwalten mit
`astro dev stop`, `astro dev status`, `astro dev logs`.

Vor artverwandten Aufgaben die passende Astro-Doku konsultieren:
- [Seiten, dynamische Routen, Middleware](https://docs.astro.build/en/guides/routing/)
- [Astro-Komponenten](https://docs.astro.build/en/basics/astro-components/)
- [React/Vue/Svelte-Komponenten](https://docs.astro.build/en/guides/framework-components/)
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling / Tailwind](https://docs.astro.build/en/guides/styling/)
- [Internationalisierung](https://docs.astro.build/en/guides/internationalization/)
