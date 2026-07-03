# zegm-web

Sitio ZEGM versionado. **El host (Elementor/CMS) solo aporta un punto de montaje.**
Lógica + estilos vía jsDelivr. Build: esbuild + TypeScript + GSAP. Sin React/Tailwind.

Arquitectura scaffoldeada desde el patrón "Mount Point Pattern" de `ATFX_PeruLP`.

## Arquitectura (Mount Point Pattern)

```
Host (widget HTML)
  └─ <div data-aa-mount data-aa-theme="light" data-aa-lang="es"></div>
  └─ <script src=".../loader.js"></script>   → inyecta dist/landing.css + dist/landing.js
        └─ boot() en src/index.ts: lee atributos del mount, crea .aa-landing, renderiza secciones
```

- **`src/index.ts`** — `boot()`: resuelve `theme` y `lang` (el `?lang=` de la URL gana sobre
  `data-aa-lang`), crea el root `.aa-landing`, llama a cada `renderX(root, lang)` en orden y
  luego a los `initX(root)` (comportamiento/animaciones GSAP).
- **Secciones** = funciones que crean DOM (`src/sections/*.ts`). Una por strip.
- **UI/átomos** = `src/ui/*.ts`. GSAP centralizado en `src/ui/gsap-env.ts`.
- **Estilos** = `src/styles/*.css`, agregados por `landing.css` (entry con `@import`).
- **Constantes/contenido** = `src/constants/*.ts` (bilingüe `Record<Lang, {...}>`).
- Build: `esbuild.config.mjs` → `dist/landing.js` + `dist/landing.css`.

## Estructura actual (esqueleto)

```
src/
├── index.ts              # boot: mount → .aa-landing → render + init
├── core/{types,dom}.ts   # Theme/Lang + helpers ($, $$, el)
├── sections/hero.ts      # sección demo bilingüe
├── ui/{gsap-env,motion}.ts
├── constants/content.ts  # shape de contenido bilingüe
└── styles/               # tokens, typography, layout, components, section-theme, hero, landing(entry)
```

## Sistema de tema (light/dark por strip)

`src/styles/section-theme.css`. Cada sección declara `data-aa-section-theme="light|dark"`;
eso remapea los tokens `--aa-*` → los componentes leen tokens y se adaptan solos.
- **Gotcha de overdraw**: una sección cuyo tema COINCIDE con el root se pinta
  `background-color: transparent` (deja ver `.aa-landing::before`). Si necesitas un fondo
  visible ahí, píntalo con `background-image: linear-gradient(var(--aa-bg), var(--aa-bg))`.

## Tipografía (capa semántica)

`src/styles/typography.css`. Títulos → `.aa-h-*`; cuerpo → `.aa-p-*`; etiqueta → `.aa-eyebrow`.
NUNCA `font-size: var(--aa-text-*)` crudo (rompe jerarquía y pierde la fuente display).

## i18n (ES/EN)

Patrón por constante: `const COPY: Record<Lang, {...}> = { es:{}, en:{} }`. `boot()` resuelve
`lang` con `?lang=` (prioridad) → `data-aa-lang`. Toggle futuro: links a `?lang=es|en`.

## Desarrollo

```bash
npm install
npm run typecheck
npm run build
PORT=8770 npm run dev
```

## Deploy (jsDelivr)

- El repo debe ser **público** y llamarse EXACTO como en `loader.js` (`/gh/<owner>/<repo>`).
  Hoy: `karenrebecag/ZEGM_web`. Si el repo real difiere, cambiar `loader.js` e `index.ts`.
- `loader.js` `@latest` inyecta el tag inmutable `@vX.Y.Z`.
- Falta wirear CI (`.github/workflows/release.yml`) para auto-tag si se quiere el flujo de PeruLP.

## Reglas de operación

- CSS siempre `.aa-*` (nunca global) · sin secretos en el bundle · comentarios = WHY · sin emojis.
- Push / deploy son operaciones bloqueadas: pedir OK explícito.
