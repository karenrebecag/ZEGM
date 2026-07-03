import * as esbuild from 'esbuild';
import { cpSync, existsSync } from 'node:fs';

// Self-hosted fonts: copia src/fonts → dist/fonts si existen. Las @font-face referencian
// ./fonts/... (relativo a dist/landing.css), así que deben vivir junto al CSS.
if (existsSync('src/fonts')) cpSync('src/fonts', 'dist/fonts', { recursive: true });

// Bundle TS + GSAP + CSS hacia dist/. jsDelivr sirve el tag versionado.
const shared = {
  bundle: true,
  format: 'esm',
  target: ['es2019'],
  logLevel: 'info',
};

const jsOptions = {
  ...shared,
  entryPoints: ['src/index.ts'],
  outfile: 'dist/landing.js',
  minify: true,
  sourcemap: true,
};

const cssOptions = {
  ...shared,
  entryPoints: ['src/styles/landing.css'],
  outfile: 'dist/landing.css',
  minify: true,
  // Conserva las URLs de fuentes literales (./fonts/...) en vez de empaquetarlas.
  external: ['*.woff2', '*.otf', '*.ttf'],
};

const watch = process.argv.includes('--watch');
const serve = process.argv.includes('--serve');

if (watch || serve) {
  const jsCtx = await esbuild.context(jsOptions);
  const cssCtx = await esbuild.context(cssOptions);
  await Promise.all([jsCtx.watch(), cssCtx.watch()]);
  if (serve) {
    const { host, port } = await jsCtx.serve({ servedir: '.', port: Number(process.env.PORT) || 8770 });
    console.log(`dev server: http://${host}:${port}`);
  } else {
    console.log('watching src/...');
  }
} else {
  await Promise.all([esbuild.build(jsOptions), esbuild.build(cssOptions)]);
}
