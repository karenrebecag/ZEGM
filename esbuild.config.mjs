import * as esbuild from 'esbuild';
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';

const watch = process.argv.includes('--watch');
const serve = process.argv.includes('--serve');
const dev = watch || serve;

// Self-hosted fonts: las @font-face referencian ./fonts/... (relativo a landing.css, que vive
// en dist/assets), así que las fuentes deben vivir junto al CSS en dist/assets/fonts.
if (existsSync('src/fonts')) cpSync('src/fonts', 'dist/assets/fonts', { recursive: true });

const shared = {
  bundle: true,
  format: 'esm',
  target: ['es2019'],
  metafile: true,
  logLevel: 'info',
};

// Hash solo en prod (cache inmutable). En dev los nombres son estables para que el loader y las
// páginas de preview los enlacen sin recalcular el hash en cada rebuild.
const entryNames = dev ? '[name]' : '[name].[hash]';

const jsOptions = {
  ...shared,
  // Object form: [name] = "landing" (contrato con el loader). El import() dinámico se parte a un
  // chunk hasheado (chunk-[hash].js) que solo la home descarga; el entry lo referencia por ruta
  // relativa (mismo dir /assets en el deploy).
  entryPoints: { landing: 'src/index.ts' },
  outdir: 'dist/assets',
  entryNames,
  chunkNames: 'chunk-[hash]',
  splitting: true,
  minify: !dev,
  sourcemap: dev,
};

const cssOptions = {
  ...shared,
  entryPoints: { styles: 'src/styles/landing.css' },
  outdir: 'dist/assets',
  entryNames,
  minify: true,
  // Conserva las URLs de fuentes literales (./fonts/...) en vez de empaquetarlas.
  external: ['*.woff2', '*.otf', '*.ttf'],
};

// El loader es el único contrato con el host: un <script> sin versión que mantener. Se regenera
// en cada build con los nombres hasheados ya resueltos + auto-localizado (document.currentScript),
// así los bundles se cachean como inmutables y aun así el host recibe el build nuevo. Reemplaza el
// pin de tag + purga que exigía jsDelivr.
function writeLoader(js, css) {
  const src = `(function () {
  if (window.__aaZegm) return;
  window.__aaZegm = true;

  var self = document.currentScript || document.querySelector('script[src*="loader.js"]');
  var base = self ? self.src.replace(/\\/loader\\.js.*$/, '') : '';

  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = base + '/assets/${css}';
  document.head.appendChild(css);

  var js = document.createElement('script');
  js.type = 'module';
  js.setAttribute('data-cfasync', 'false');
  js.src = base + '/assets/${js}';
  document.head.appendChild(js);
})();
`;
  mkdirSync('dist', { recursive: true });
  writeFileSync('dist/loader.js', src);
}

// Copia las páginas de preview al deploy (dist/), sirviendo de demo hosteada y, en dev, de páginas
// que abre el server (servedir: dist). Cargan el loader mismo-origen (./loader.js).
//
// El mapa de contacto necesita un token público (pk.) de Mapbox. NO se hornea en el repo: en el
// deploy se inyecta desde la env MAPBOX_TOKEN en TODOS los mounts (el navbar navega con ?page=
// sobre cualquier HTML base, así que el token debe estar en cada página). Sin token, el mapa
// degrada en silencio.
function copyPreview() {
  const pages = ['index', 'nosotros', 'areas', 'acerca', 'contacto'];
  const token = process.env.MAPBOX_TOKEN;
  mkdirSync('dist', { recursive: true });
  for (const page of pages) {
    let html = readFileSync(`preview/${page}.html`, 'utf8');
    if (token) {
      html = html.replaceAll('data-aa-mount', `data-aa-mount data-aa-mapbox-token="${token}"`);
    }
    writeFileSync(`dist/${page}.html`, html);
  }
  if (!token && !dev) console.log('[preview] Sin MAPBOX_TOKEN: el mapa de contacto quedará vacío.');
}

// Con metafile, toma el nombre hasheado del ENTRY output de la extensión pedida (ignora .map y
// los chunks de splitting, que no tienen entryPoint).
function entryOut(metafile, ext) {
  for (const [file, meta] of Object.entries(metafile.outputs)) {
    if (meta.entryPoint && file.endsWith(ext)) return basename(file);
  }
}

if (dev) {
  const jsCtx = await esbuild.context(jsOptions);
  const cssCtx = await esbuild.context(cssOptions);
  await Promise.all([jsCtx.watch(), cssCtx.watch()]);
  writeLoader('landing.js', 'styles.css');
  copyPreview();
  if (serve) {
    const { host, port } = await jsCtx.serve({ servedir: 'dist', port: Number(process.env.PORT) || 8770 });
    console.log(`dev server: http://${host}:${port}/`);
  } else {
    console.log('watching src/...');
  }
} else {
  const [jsResult, cssResult] = await Promise.all([
    esbuild.build(jsOptions),
    esbuild.build(cssOptions),
  ]);
  writeLoader(entryOut(jsResult.metafile, '.js'), entryOut(cssResult.metafile, '.css'));
  copyPreview();
}
