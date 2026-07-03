// Build de Vercel para el preview. Corre desde la raíz del repo (cwd). Inyecta el token
// público de Mapbox (env MAPBOX_TOKEN) en /contacto SOLO en el deploy — nunca en el repo
// (es un pk. público protegido por URL restriction en Mapbox). Sin env, deja el HTML
// intacto (la página carga; el mapa degrada a vacío).
//
// El pin del loader al tag inmutable NO se hace aquí: se predice y hornea antes del push
// con pin-previews.mjs (ver preview/README.md).
import { readFileSync, writeFileSync } from 'node:fs';

const token = process.env.MAPBOX_TOKEN;
if (!token) {
  console.log('[preview] Sin MAPBOX_TOKEN: el mapa de /contacto quedará vacío.');
  process.exit(0);
}

const path = 'preview/contacto.html';
const html = readFileSync(path, 'utf8').replace(
  'data-aa-page="contacto"',
  `data-aa-page="contacto" data-aa-mapbox-token="${token}"`,
);
writeFileSync(path, html);
console.log('[preview] Token de Mapbox inyectado en /contacto.');
