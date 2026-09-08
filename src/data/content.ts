// Zentrale Inhalte aus dem Konzept-PDF (Website-Konzept_Pflegevermittlung.pdf).
//
// Die Formular-/Datenbank-Enums (Qualifikation, Fachweiterbildung,
// Einsatzbereich, Arbeitszeitmodell, Eintrittstermin) kommen NICHT von hier,
// sondern aus supabase/functions/_shared/enums.json — das ist die einzige
// kanonische Quelle, die sowohl Datenbank-Migration, Edge Function (Zod) als
// auch dieses Frontend verwenden. Nicht hier duplizieren.
import { enums } from "../../supabase/functions/bewerbung-einreichen/_shared/enums.ts";

export interface NavItem {
  label: string;
  href: string;
}

export const navigation: NavItem[] = [
  { label: "Start", href: "/" },
  { label: "Stelle finden", href: "/stelle-finden" },
  { label: "So funktioniert es", href: "/so-funktioniert-es" },
  { label: "FAQ", href: "/faq" },
  { label: "Kontakt", href: "/kontakt" },
];

export const footerLegalLinks: NavItem[] = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutzerklärung", href: "/datenschutz" },
  { label: "Bonusbedingungen", href: "/bonusbedingungen" },
];

// Zielgruppen-Darstellung auf der Marketing-Seite (Konzept Abschnitt 2) —
// bewusst ausführlicher formuliert als die knappen Enum-Werte im Formular
// (z. B. "mit staatlicher Anerkennung", eigene Fachweiterbildungs-Zeile).
export const zielgruppeGesucht = [
  "Pflegefachfrau / Pflegefachmann",
  "Gesundheits- und Krankenpfleger/in",
  "Gesundheits- und Kinderkrankenpfleger/in",
  "Altenpfleger/in mit staatlicher Anerkennung",
  "Pflegefachkräfte mit Fachweiterbildung",
  "OTA",
  "ATA",
] as const;

export const nichtVermittelt = [
  "Pflegehelfer/in",
  "Pflegeassistent/in",
  "MFA",
  "Auszubildende",
  "Ungelernte Pflegekräfte",
  "Sonstige nicht examinierte Assistenzberufe",
] as const;

// Tatsächliche Formular-/Enum-Werte (Konzept Abschnitt 7 + Datenbankschema).
export const qualifikationOptionen = enums.qualifikation;
export const fachweiterbildungen = enums.fachweiterbildung;

export interface QualifikationOption {
  label: string;
  vermittelbar: boolean;
}

// Auswahlliste für Schritt 1 des Bewerbungsfunnels: zeigt bewusst auch nicht
// vermittelbare Berufsbezeichnungen, damit Betroffene sofort ein
// verständliches Feedback bekommen statt sich zu fragen, warum ihre
// Berufsbezeichnung fehlt.
export const qualifikationAuswahl: QualifikationOption[] = [
  ...qualifikationOptionen.map((label) => ({ label, vermittelbar: true })),
  ...nichtVermittelt.map((label) => ({ label, vermittelbar: false })),
];

export interface Einsatzbereich {
  name: string;
  beschreibung: string;
}

export const einsatzbereiche: Einsatzbereich[] = [
  { name: "OP", beschreibung: "Tätigkeit im Operationsbereich." },
  { name: "Anästhesie", beschreibung: "Einsatz in der Anästhesie und perioperativen Versorgung." },
  { name: "Intensivstation", beschreibung: "Erwachsenen-Intensivmedizin." },
  { name: "Neo-Intensivstation", beschreibung: "Neonatologische Intensivversorgung." },
  { name: "Zentrale Notaufnahme", beschreibung: "Akut- und Notfallversorgung." },
  { name: "Normalstation", beschreibung: "Stationäre Pflege in unterschiedlichen Fachrichtungen." },
];

export const arbeitszeitmodelle = enums.arbeitszeitmodell;
export const eintrittstermine = enums.eintrittstermin;

export interface FunnelStep {
  nummer: number;
  titel: string;
  beschreibung: string;
}

export const funnelSchritte: FunnelStep[] = [
  {
    nummer: 1,
    titel: "Daten übermitteln",
    beschreibung:
      "Persönliche Daten, Qualifikation, Wunschbereich, Arbeitszeit und gewünschter Arbeitsort werden einmalig über die Website übermittelt.",
  },
  {
    nummer: 2,
    titel: "Abschluss nachweisen",
    beschreibung:
      "Zeugnis beziehungsweise Nachweis über den abgeschlossenen Berufsabschluss hochladen.",
  },
  {
    nummer: 3,
    titel: "Anforderungen abgleichen",
    beschreibung:
      "Die Angaben werden mit den von der Klinik vorgegebenen Voraussetzungen abgeglichen.",
  },
  {
    nummer: 4,
    titel: "Direkte Vermittlung",
    beschreibung:
      "Wenn die Anforderungen erfüllt sind, wird die Fachkraft direkt bei der Klinik vorgestellt.",
  },
  {
    nummer: 5,
    titel: "Vorstellungsgespräch koordinieren",
    beschreibung:
      "Der Termin wird so kurzfristig wie möglich organisiert. Je nach Verfügbarkeit kann dies auch sehr kurzfristig bzw. am Folgetag erfolgen.",
  },
  {
    nummer: 6,
    titel: "Entscheidung durch die Klinik",
    beschreibung: "Im weiteren Bewerbungsprozess entscheidet das Krankenhaus über die Einstellung.",
  },
  {
    nummer: 7,
    titel: "400 € Sonderzahlung",
    beschreibung:
      "Besteht das über die Plattform vermittelte Arbeitsverhältnis nach drei Monaten weiterhin, erfolgt die Sonderzahlung von 400 € durch den Vermittlungsservice.",
  },
];

export interface KlartextPaar {
  nicht: string;
  besser: string;
}

export const klartextPaare: KlartextPaar[] = [
  {
    nicht: "Du wirst garantiert am nächsten Tag zum Vorstellungsgespräch eingeladen.",
    besser:
      "Wir koordinieren dein Vorstellungsgespräch so schnell wie möglich – je nach Verfügbarkeit der Klinik auch am Folgetag.",
  },
  {
    nicht: "Du wirst garantiert eingestellt.",
    besser:
      "Wenn die Voraussetzungen der Klinik erfüllt sind, stellen wir den direkten Kontakt her und koordinieren den weiteren Bewerbungsprozess.",
  },
];

export interface FaqEntry {
  frage: string;
  antwort: string;
}

export const faqEintraege: FaqEntry[] = [
  {
    frage: "Ist die Bewerbung für mich kostenlos?",
    antwort: "Ja. Der Vermittlungsservice ist für Bewerberinnen und Bewerber vollständig kostenlos.",
  },
  {
    frage: "Wer wird über die Plattform vermittelt?",
    antwort:
      "Ausschließlich examinierte Pflegefachpersonen, Gesundheits- und (Kinder-)Krankenpfleger/innen, Altenpfleger/innen mit staatlicher Anerkennung, Pflegefachkräfte mit Fachweiterbildung sowie OTA und ATA. Pflegehelfer/innen, Pflegeassistent/innen, MFA, Auszubildende und sonstige nicht examinierte Assistenzberufe werden nicht vermittelt.",
  },
  {
    frage: "Wie schnell bekomme ich ein Vorstellungsgespräch?",
    antwort:
      "Wir koordinieren den Termin so kurzfristig wie möglich – je nach Klinik und Verfügbarkeit ist das auch am Folgetag möglich. Eine Garantie dafür können wir nicht geben.",
  },
  {
    frage: "Ist eine Einstellung garantiert?",
    antwort:
      "Nein. Wenn deine Qualifikation zu den Anforderungen der Klinik passt, stellen wir den direkten Kontakt her. Über die Einstellung entscheidet am Ende die Klinik.",
  },
  {
    frage: "Wann erhalte ich die 400 € Sonderzahlung?",
    antwort:
      "Sobald dein über die Plattform vermitteltes Arbeitsverhältnis drei Monate lang ununterbrochen bestanden hat, zahlt dir der Vermittlungsservice 400 € aus.",
  },
  {
    frage: "Was passiert mit meinen Daten?",
    antwort:
      "Deine Angaben werden ausschließlich zum Zweck der Stellenvermittlung verwendet. Eine Weitergabe an eine konkrete Klinik erfolgt nur auf einer hierfür geeigneten datenschutzrechtlichen Grundlage bzw. mit deiner Zustimmung, sofern erforderlich. Details findest du in unserer Datenschutzerklärung.",
  },
];
