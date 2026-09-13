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

**Dark Mode (seit Phase 6):** Umschaltbar per Button im Header
(`[data-theme-toggle]`), persistiert in `localStorage`. Nur die neutralen
Design-Token (`--color-ink*`, `--color-surface*`, `--color-border*`) kehren
in `:root.dark` (`src/styles/global.css`) um — Petrol/Gold bleiben
markenkonform in beiden Modi identisch. `public/theme-init.js` setzt die
`dark`-Klasse clientseitig **vor** dem ersten Render (blockierendes
externes Script, kein Flackern, CSP-konform ohne `unsafe-inline` — die
Seite ist statisch, es gibt kein serverseitiges Rendering, das den Modus
vorab kennen könnte). Damit gibt es jetzt **zwei** JS-Stellen auf der
öffentlichen Seite (nicht mehr nur der Funnel): die beiden Theme-Scripts,
sitesweit über `BaseLayout` eingebunden — beide minimal, kein Framework.

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

## Admin-Layer (Phase 6)

Interner Backoffice-Bereich unter `/admin/*`, nicht öffentlich, aus
Sitemap/`robots.txt` ausgeschlossen. Architektur bewusst anders als der
öffentliche Teil: die Seite bleibt komplett statisch (`output: "static"`,
kein SSR-Adapter), Admin-Seiten authentifizieren sich clientseitig über
**Supabase Auth** (E-Mail/Passwort) und arbeiten danach **direkt** mit
`@supabase/supabase-js` gegen die Tabellen — autorisiert durch RLS-Policies,
die auf `is_admin()` prüfen (`security definer`-Funktion gegen die
`admin_users`-Tabelle). Das ist der Standard-Supabase-Weg für interne
Dashboards mit echten angemeldeten Nutzern, im Unterschied zum
öffentlichen Bewerbungsfunnel, der als anonymer Besucher ausschließlich über
Edge Functions mit `service_role` schreibt.

- **Admin-Verwaltung:** rein manuell — neuer Admin = Supabase-Auth-User im
  Dashboard anlegen, dann per SQL in `admin_users` verknüpfen (E-Mail-Match).
  Keine Self-Service-Oberfläche dafür in v1.
- **Status-Pipeline (ersetzt die alte 5-Werte-Pipeline aus Phase 2):**
  `neu → gesichtet → unterlagen_unvollstaendig → gespraech →
  an_klinik_vermittelt → vermittelt_abgeschlossen → abgelehnt →
  zurueckgezogen`. Jeder Wechsel wird automatisch per Trigger
  (`bewerbungen_status_verlauf`) in `status_verlauf` protokolliert — auch
  der initiale Eintrag beim Anlegen einer Bewerbung.
- **Dokumente:** Tabelle `dokumente` (Typen: Lebenslauf, Urkunde,
  Anerkennungsbescheid, Arbeitszeugnis, Sprachzertifikat, Sonstiges),
  mehrere pro Bewerbung, auch ohne Zuordnung möglich (`/admin/unzugeordnet`).
  Liegen weiterhin im bestehenden privaten `zeugnisse`-Bucket, Pfadschema
  erweitert auf `bewerbungen/{bewerbung_id}/{dokument_id}` bzw.
  `unzugeordnet/{dokument_id}`. Der Funnel (`bewerbung-einreichen`) legt bei
  jedem Zeugnis-Upload zusätzlich automatisch eine `dokumente`-Zeile an.
- **Audit-Log:** `audit_log` + Funktion `log_admin_audit()` (security
  definer, setzt `admin_user_id` serverseitig über `auth.uid()` — der Client
  kann sie nicht fälschen). Protokolliert werden Detailansicht-Aufrufe,
  Dokumentenabrufe, Notizen, CSV-Exporte und Listen-Abfragen (mit Filtern) —
  nicht jede einzelne Listenzeile.
- **Löschen (Art. 17 DSGVO):** ausschließlich über die Edge Function
  `admin-bewerbung-loeschen` (service_role) — Storage-Objekte lassen sich
  nicht per RLS/rohem SQL löschen (siehe Phase-2-Erkenntnis), nur über die
  Storage-API, und ein nur teilweise durchgeführter Cascade-Delete wäre
  schlimmer als keiner. Die Funktion prüft `is_admin()` über den
  mitgeschickten Nutzer-JWT, nicht über den service_role-Key selbst.
- **Aufbewahrung:** `bewerbungen.loeschdatum` (manuell gesetzt, keine
  automatische Bereinigung in v1 — offene Rechtsfrage aus `docs/SPEC.md`
  bleibt unverändert offen).

## Bewerber-Konto (Phase 7)

Self-Service-Bereich unter `/konto/*` für Bewerber:innen — anders als
`/admin/*` **mit** öffentlichem Header/Footer (`BaseLayout`), aber ebenfalls
aus Sitemap/`robots.txt` ausgeschlossen (personenbezogen, kein
Marketing-Ziel). Autorisierung läuft über Besitz (`bewerbungen.user_id =
auth.uid()`), nicht über eine Rolle wie beim Admin-Layer.

- **Konto-Erstellung ist Pflicht bei jeder Bewerbung**, passiert aber ohne
  zusätzlichen Schritt im Funnel: `BewerbungsFunnel.astro` ruft nach
  erfolgreichem Absenden `signInWithOtp()` auf (Magic Link, passwortlos) —
  ein normaler öffentlicher supabase-js-Aufruf, keine Änderung an der
  Edge Function `bewerbung-einreichen` nötig. **Alte, vor Phase 7
  eingegangene Bewerbungen bleiben bewusst unverknüpft** (kein
  rückwirkendes Verknüpfen per E-Mail-Abgleich).
- **Verknüpfung beim ersten Login:** Der Magic Link zeigt auf
  `/konto/?claim=<bewerbung_id>`. Die Funktion `bewerbung_konto_verknuepfen()`
  (security definer) setzt `user_id` nur, wenn die Zeile noch unverknüpft
  ist **und** die JWT-E-Mail exakt zur Bewerbung passt — Autorisierung
  steckt in der Funktion, nicht in einer offenen RLS-Policy (analog
  `log_admin_audit()`).
- **Geschützte Spalten:** Der Trigger
  `bewerbungen_bewerber_spalten_schuetzen` verhindert, dass ein
  eingeloggter Bewerber (nicht `service_role`, nicht `is_admin()`)
  `status`, `klinik_id`, `user_id`, `loeschdatum`, `zeugnis_pfad` oder
  `email` selbst ändert. Stammdaten/Berufsangaben darüber hinaus sind frei
  editierbar.
- **Dokumente:** dieselbe `dokumente`-Tabelle wie im Admin-Layer, RLS-scoped
  auf die eigene Bewerbung — ein Bewerber sieht/verwaltet damit automatisch
  auch das ursprüngliche Funnel-Zeugnis, ohne separate Migration.
- **Löschen (Art. 17 DSGVO, Selbstauskunft):** eigene Edge Function
  `konto-bewerbung-loeschen`, strukturell identisch zu
  `admin-bewerbung-loeschen`, aber Autorisierung über
  `bewerbungen.user_id === auth.uid()` statt `is_admin()`. Eigener
  `audit_log`-Aktionswert `bewerbung_selbst_geloescht`.
- **Nicht Teil von v1:** E-Mail-Änderung im Self-Service, Passwort-Login als
  Alternative zum Magic Link, rückwirkendes Verknüpfen alter Bewerbungen.

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
