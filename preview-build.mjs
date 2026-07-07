// Build de Vercel para el preview. Corre desde la raíz del repo (cwd). Inyecta el token
// público de Mapbox (env MAPBOX_TOKEN) en TODOS los mounts SOLO en el deploy — nunca en el
// repo (es un pk. público protegido por URL restriction en Mapbox).
//
// En todos los mounts (no solo contacto.html) porque el navbar navega con ?page=contacto
// sobre index.html: la página de contacto se puede renderizar desde cualquier HTML base,
// así que el token debe estar en cada mount. El atributo solo se lee cuando hay mapa
// (página contacto), en el resto es inofensivo.
//
// El pin del loader al tag inmutable se hace antes del push con pin-previews.mjs.
import { readFileSync, writeFileSync } from 'node:fs';

const PAGES = ['index', 'nosotros', 'areas', 'acerca', 'contacto'];

const token = process.env.MAPBOX_TOKEN;
if (!token) {
  console.log('[preview] Sin MAPBOX_TOKEN: el mapa de contacto quedará vacío.');
  process.exit(0);
}

for (const page of PAGES) {
  const path = `preview/${page}.html`;
  const html = readFileSync(path, 'utf8').replace(
    'data-aa-mount',
    `data-aa-mount data-aa-mapbox-token="${token}"`,
  );
  writeFileSync(path, html);
}
console.log('[preview] Token de Mapbox inyectado en todos los mounts.');
