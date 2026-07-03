// Pinea los HTML del preview al PRÓXIMO tag del release (el que disparará el push que
// sigue). Se corre ANTES de commit+push cuando el push incluye cambios de bundle (src/**),
// porque el CI hará un bump de patch. Así los previews apuntan a un tag INMUTABLE de
// jsDelivr (no @latest, que tarda en purgar su cache).
//
// Proceso (== lo que hace el CI para calcular el tag): lee la versión actual de loader.js
// (que el CI regenera y commitea en cada release), predice el patch+1, y reescribe el src
// del loader en los 4 HTML a @vX.Y.Z.
//
// Uso:  node pin-previews.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const PAGES = ['index', 'nosotros', 'areas', 'contacto'];

const current = readFileSync('loader.js', 'utf8').match(/var v = "([^"]+)"/)?.[1];
if (!current) {
  console.error('[pin-previews] No pude leer la versión de loader.js.');
  process.exit(1);
}

const [major, minor, patch] = current.split('.').map(Number);
const next = `${major}.${minor}.${patch + 1}`;

for (const page of PAGES) {
  const path = `preview/${page}.html`;
  const html = readFileSync(path, 'utf8').replace(
    /ZEGM@[^/]+\/loader\.js/g,
    `ZEGM@v${next}/loader.js`,
  );
  writeFileSync(path, html);
}

console.log(`[pin-previews] Previews pinneados a @v${next} (versión actual: ${current}).`);
