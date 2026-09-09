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

// Beruf→Bereich-Matrix (Phase 5), berufsrechtlich geprüft: ATA-OTA-G §§ 9/10,
// PflBG §§ 1, 4, 64/64a. "rechtlichZulaessig" = alle Bereiche, die der Beruf
// laut Berufsrecht ausüben darf (nie versteckt, immer wählbar).
// "marktgaengig" = Teilmenge davon, die in der Praxis tatsächlich
// ausgeschrieben wird (nur zur Anzeige-Kennzeichnung "selten ausgeschrieben",
// kein Ausschluss). OTA/ATA bekommen nie Intensivstation/Neo-Intensivstation
// (ITS ist für beide Berufsgruppen ausgeschlossen).
const alleBereiche = enums.einsatzbereich;

export const berufBereichMatrix: Record<
  (typeof enums.qualifikation)[number],
  { rechtlichZulaessig: readonly string[]; marktgaengig: readonly string[] }
> = {
  "OTA": {
    rechtlichZulaessig: ["OP", "Zentrale Notaufnahme"],
    marktgaengig: ["OP"],
  },
  "ATA": {
    rechtlichZulaessig: ["Anästhesie", "OP", "Zentrale Notaufnahme"],
    marktgaengig: ["Anästhesie"],
  },
  "Pflegefachfrau / Pflegefachmann": {
    rechtlichZulaessig: alleBereiche,
    marktgaengig: alleBereiche,
  },
  "Gesundheits- und Krankenpfleger/in": {
    rechtlichZulaessig: alleBereiche,
    marktgaengig: alleBereiche.filter((b) => b !== "Neo-Intensivstation"),
  },
  "Gesundheits- und Kinderkrankenpfleger/in": {
    rechtlichZulaessig: alleBereiche,
    marktgaengig: ["Neo-Intensivstation", "Normalstation", "Zentrale Notaufnahme"],
  },
  "Altenpfleger/in": {
    rechtlichZulaessig: alleBereiche,
    marktgaengig: ["Normalstation"],
  },
};

// Job-Titel-Synonyme seit PflStudStG (15.12.2023) — reine Anzeige-Zusätze,
// keine eigenen Enum-Werte (würde Matching/Daten fragmentieren).
export const qualifikationAnzeige: Record<(typeof enums.qualifikation)[number], string> = {
  "Pflegefachfrau / Pflegefachmann": "Pflegefachfrau / Pflegefachmann (auch: Pflegefachperson)",
  "Gesundheits- und Krankenpfleger/in": "Gesundheits- und Krankenpfleger/in",
  "Gesundheits- und Kinderkrankenpfleger/in": "Gesundheits- und Kinderkrankenpfleger/in",
  "Altenpfleger/in": "Altenpfleger/in (auch: Altenpflegefachperson)",
  "OTA": "OTA",
  "ATA": "ATA",
};
