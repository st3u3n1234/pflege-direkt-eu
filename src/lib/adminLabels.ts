// Anzeige-Labels für den Admin-Bereich — rein UI, keine Enum-Werte.
export const statusLabels: Record<string, string> = {
  neu: "Neu",
  gesichtet: "Gesichtet",
  unterlagen_unvollstaendig: "Unterlagen unvollständig",
  gespraech: "Gespräch",
  an_klinik_vermittelt: "An Klinik vermittelt",
  vermittelt_abgeschlossen: "Vermittelt/Abgeschlossen",
  abgelehnt: "Abgelehnt",
  zurueckgezogen: "Zurückgezogen",
};

export const statusReihenfolge = [
  "neu",
  "gesichtet",
  "unterlagen_unvollstaendig",
  "gespraech",
  "an_klinik_vermittelt",
  "vermittelt_abgeschlossen",
  "abgelehnt",
  "zurueckgezogen",
] as const;

export const dokumentTypLabels: Record<string, string> = {
  lebenslauf: "Lebenslauf",
  urkunde: "Urkunde",
  anerkennungsbescheid: "Anerkennungsbescheid",
  arbeitszeugnis: "Arbeitszeugnis",
  sprachzertifikat: "Sprachzertifikat",
  sonstiges: "Sonstiges",
};

export const dokumentTypOptionen = Object.keys(dokumentTypLabels);
