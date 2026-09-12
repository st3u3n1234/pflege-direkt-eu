// Läuft blockierend im <head>, bevor irgendetwas gerendert wird — verhindert
// ein Aufblitzen des falschen Modus. Bewusst kein Modul-Script (die
// Content-Security-Policy erlaubt kein unsafe-inline, aber ein externes,
// klassisches Script wie dieses ist davon unberührt).
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var theme = stored === "dark" || stored === "light" ? stored : null;
    if (!theme) {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {
    // localStorage kann in manchen Kontexten (privates Fenster o. Ä.) werfen
    // — dann bleibt es einfach beim Standard-Hell-Modus.
  }
})();
