// loader.js — entry point CDN. Auto-generado por CI en cada release (no editar a mano).
// El host carga SOLO este archivo con @latest; el loader inyecta CSS y JS apuntando al
// tag inmutable correcto, evitando el cache agresivo de assets en @latest.
//
// ⚠️ El path /gh/<owner>/<repo> debe coincidir EXACTO con el repo público real en GitHub.
// Si el repo no se llama "ZEGM", cambiar `base` aquí y en src/index.ts antes de deploy.
(function () {
  var v = "1.0.4";
  var base = "https://cdn.jsdelivr.net/gh/karenrebecag/ZEGM";

  var css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = base + "@" + v + "/dist/landing.css";
  document.head.appendChild(css);

  var js = document.createElement("script");
  js.type = "module";
  js.setAttribute("data-cfasync", "false");
  js.src = base + "@" + v + "/dist/landing.js";
  document.head.appendChild(js);
})();
