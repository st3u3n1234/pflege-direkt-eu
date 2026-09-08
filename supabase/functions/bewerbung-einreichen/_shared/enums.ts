// Einzige kanonische Quelle für Formular-/Datenbank-Enums. Wird sowohl von
// der Edge Function (Deno) als auch vom Astro-Frontend (src/data/content.ts)
// importiert. Bei Änderung: auch die Postgres-Enums per neuer Migration und
// die Zod-Validierung (liest automatisch von hier) im Blick behalten.
export const enums = {
  qualifikation: [
    "Pflegefachfrau / Pflegefachmann",
    "Gesundheits- und Krankenpfleger/in",
    "Gesundheits- und Kinderkrankenpfleger/in",
    "Altenpfleger/in",
    "OTA",
    "ATA",
  ],
  fachweiterbildung: [
    "Nein",
    "Intensivpflege",
    "Anästhesie",
    "Notfallpflege",
    "OP",
    "Sonstige Fachweiterbildung",
  ],
  einsatzbereich: [
    "OP",
    "Anästhesie",
    "Intensivstation",
    "Neo-Intensivstation",
    "Zentrale Notaufnahme",
    "Normalstation",
  ],
  arbeitszeitmodell: ["Vollzeit", "Teilzeit", "Nebenjob", "Minijob", "Individuelle Wochenstunden"],
  eintrittstermin: ["Sofort", "Innerhalb von 4 Wochen", "In 1-3 Monaten", "Später"],
  bewerbungStatus: ["eingegangen", "in_pruefung", "vermittelt", "abgelehnt", "abgebrochen"],
} as const;
