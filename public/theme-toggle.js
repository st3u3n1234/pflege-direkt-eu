// Verkabelt jeden Button mit [data-theme-toggle] auf jeder Seite (über
// BaseLayout eingebunden). Kein Modul-Script nötig, läuft mit `defer`.
(function () {
  function setTheme(dark) {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch (e) {
      // ignorieren, wenn localStorage nicht verfügbar ist
    }
  }

  document.addEventListener("click", function (event) {
    var button = event.target instanceof Element ? event.target.closest("[data-theme-toggle]") : null;
    if (!button) return;
    setTheme(!document.documentElement.classList.contains("dark"));
  });
})();
