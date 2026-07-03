# zegm-web

Sitio ZEGM versionado. La lógica y estilos se sirven vía **jsDelivr**; el host
(Elementor/CMS) solo aporta un **punto de montaje**. Stack: esbuild + TypeScript + GSAP,
sin React/Tailwind. Todo el CSS está scopeado bajo `.aa-landing`.

## Embed en el host

Widget HTML con el mount + loader:

```html
<div data-aa-mount data-aa-theme="light" data-aa-lang="es"></div>
<script data-cfasync="false"
  src="https://cdn.jsdelivr.net/gh/karenrebecag/ZEGM@latest/loader.js"></script>
```

Atributos: `data-aa-theme` (`light|dark`, default `light`) · `data-aa-lang` (`es|en`, default `es`).

## Desarrollo

```bash
npm install
npm run typecheck            # tsc --noEmit
npm run build                # genera dist/
PORT=8770 npm run dev        # watch + server; sirve preview.html
```

`preview.html` monta la landing contra el dist local. Idioma conmutable con `?lang=en`.

## Reglas

- CSS prefijado `.aa-*` — nunca selectores globales (colisionan con el host).
- No meter secretos: el bundle es público en jsDelivr.
- El repo debe ser público (requisito de jsDelivr `/gh/`) y llamarse igual que en `loader.js`.
- Comentarios = WHY, no WHAT. Sin emojis.
