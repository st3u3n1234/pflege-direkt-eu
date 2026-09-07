# SPEC — PflegeDirekt v1

Ergebnis des Phase-0-Interviews. Ergänzt `CLAUDE.md` um die Punkte, die das
Konzept-PDF offen lässt. Bei Widerspruch zwischen PDF und diesem Dokument
gilt dieses Dokument als aktueller Stand.

## Scope v1

- Öffentliche Marketing-/Bewerbungswebsite mit den Seiten aus der Navigation
  in `CLAUDE.md` (Start, Stelle finden, So funktioniert es, FAQ, Kontakt).
- Bewerbungsfunnel gemäß Datenmodell und Reihenfolge in `CLAUDE.md`, inkl.
  Zeugnis-Upload.
- Serverseitige Speicherung der Bewerbungen (Supabase: Datenbank + privater
  Storage-Bucket für Zeugnisse).
- Datenmodell trennt von Anfang an mehrere Kliniken sauber voneinander
  (Mandantentrennung), auch wenn das Klinik-Onboarding in v1 noch nicht
  automatisiert ist.
- Interne Benachrichtigung (E-Mail) ans Vermittlungsteam bei jeder neuen
  Bewerbung.
- Automatische Bestätigungsmail an den Bewerber direkt nach dem Absenden.
- Automatische Status-Mails an den Bewerber bei wichtigen Schritten
  (Anforderungen abgeglichen, Vermittlung erfolgt, Termin vorgeschlagen) —
  ausgelöst durch eine manuelle Statusänderung des Teams (siehe
  Matching-Logik unten), nicht durch einen Matching-Algorithmus.
- Rechtstexte (Impressum, Datenschutzerklärung, Bonusbedingungen) nur als
  Platzhalter mit „TODO: juristisch prüfen".

## Explizite Nicht-Ziele für v1

- **Kein Klinik-Self-Service-Portal.** Kliniken pflegen ihre Anforderungen in
  v1 nicht selbst ein. Wie genau Klinik-Anforderungen ins System kommen, ist
  noch offen (siehe unten) — bis zur Entscheidung reicht ein einfacher
  manueller Weg (z. B. direktes Einpflegen durch das Team), kein eigenes
  Klinik-Login.
- **Kein automatisches/regelbasiertes Matching.** Das interne Team gleicht
  Bewerbungen manuell mit den Klinik-Anforderungen ab. Die Software liefert
  dafür nur eine filterbare interne Übersicht der eingegangenen Bewerbungen,
  keinen Matching-Algorithmus.
- **Keine eigene Domain.** Betrieb zunächst über eine `*.netlify.app`-
  Subdomain; Anbindung einer echten Domain ist ein späterer Schritt außerhalb
  von v1.
- **Kein Klinik-Dashboard/-Login.**
- **Keine Zahlungsabwicklung der 400-€-Sonderzahlung über die Plattform** —
  bleibt ein manueller Prozess außerhalb der Software.
- **Keine Mehrsprachigkeit.**

## Betriebsmodell (aus Interview)

| Frage | Entscheidung |
|---|---|
| Anzahl Kliniken in v1 | Mehrere Kliniken von Anfang an, Datenmodell muss sauber trennen |
| Klinik-Onboarding | Noch offen — für v1 manuell/außerhalb der Software |
| Matching-Logik | Manuell durch das interne Vermittlungsteam |
| Team-Benachrichtigung | Sofortige E-Mail bei jeder neuen Bewerbung |
| Bewerber-Benachrichtigung | Bestätigungsmail nach Absenden **plus** automatische Status-Mails je Schritt |
| Domain | Noch keine — Start auf Netlify-Subdomain |

## Offene Rechtsfragen (bewusst nicht in v1 final entschieden)

1. **Aufbewahrungsfrist für Bewerberdaten** (inkl. Zeugnis-Upload) bei nicht
   erfolgter Vermittlung — als „TODO: juristisch prüfen" markieren. Technisch
   trotzdem vorbereiten: Der Löschmechanismus muss so gebaut sein, dass eine
   Frist später einfach konfiguriert werden kann (kein Hardcoding auf „nie
   löschen", keine erfundene Frist wie „6 Monate").
2. **Rechtsgrundlage für die Weitergabe** von Bewerbungsdaten an eine
   konkrete Klinik (Einwilligung vs. berechtigtes Interesse) — TODO.
3. **Rechtliche Trägerschaft/Impressum-Angaben** — komplett offen, TODO.
4. **Datenschutzerklärung und Bonusbedingungen** — nur Platzhaltertexte, kein
   finaler Rechtstext.

Diese vier Punkte müssen vor einem echten Produktivbetrieb mit echten
Bewerberdaten juristisch geprüft werden. Bis dahin darf die Seite nur mit
synthetischen/Test-Daten befüllt werden oder muss offline bleiben.

## Abnahmekriterien v1

- [ ] Alle Navigationsseiten aus `CLAUDE.md` sind erreichbar und enthalten
      die Texte aus dem Konzept-PDF (Abschnitte 1–4, 9).
- [ ] Bewerbungsfunnel läuft in der Reihenfolge aus `CLAUDE.md` durch, mit
      Fortschrittsanzeige, Zurück-Navigation und Zustandserhalt beim
      Schrittwechsel.
- [ ] Bewerbungen inkl. Zeugnis-Datei landen nachweisbar in Supabase
      (DB-Zeile + Datei im privaten Bucket); RLS verhindert anonymen
      Lese- und Schreibzugriff.
- [ ] Bei einer Testbewerbung erhält das Team eine interne
      Benachrichtigungsmail, der Bewerber eine Bestätigungsmail.
- [ ] Keine der in `CLAUDE.md` verbotenen Garantie-Formulierungen kommt im
      Live-Text vor.
- [ ] Rechtstexte sind als Platzhalter mit „TODO: juristisch prüfen"
      vorhanden — keine erfundenen Fristen oder Firmenangaben.
- [ ] Deployment läuft unter einer `*.netlify.app`-Subdomain, Produktion
      ausschließlich vom `main`-Branch.
- [ ] WCAG-2.1-AA-Basics (Kontrast, Fokus, Labels, Tastaturbedienung) im
      Funnel geprüft und dokumentiert.
