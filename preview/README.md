# Preview (Vercel) — despliegue para cliente

Mini-sitio estático que renderiza **el bundle real** (jsDelivr `@latest`) de ZEGM en
todas sus páginas, para mostrarle al cliente el despliegue navegable con URLs limpias.
Es el mismo embed que va en el host (Elementor): un `mount` + el `loader.js` de jsDelivr.

## Rutas

| URL          | Archivo            | `data-aa-page` |
| ------------ | ------------------ | -------------- |
| `/`          | `index.html`       | `home`         |
| `/nosotros`  | `nosotros.html`    | `nosotros`     |
| `/areas`     | `areas.html`       | `areas`        |
| `/contacto`  | `contacto.html`    | `contacto`     |

- Idioma: agrega `?lang=en` a cualquier ruta (p. ej. `/nosotros?lang=en`).
- El navbar del sitio navega con `?page=`; también funciona (el `?page=` de la URL
  tiene prioridad sobre el `data-aa-page` del mount).

## Deploy en Vercel

Configuración en `vercel.json` (raíz del repo): deploy **estático**, sin instalar deps,
sirve la carpeta `preview/` con `cleanUrls` (rutas sin `.html`).

1. Vercel → New Project → importa el repo `karenrebecag/ZEGM`.
2. Framework Preset: **Other** (lo fuerza `vercel.json`). No cambiar Output/Build.
3. (Opcional, para el mapa de `/contacto`) Project → Settings → Environment Variables:
   `MAPBOX_TOKEN = pk.…` (token público con URL restriction). El build lo inyecta solo
   en el deploy vía `preview-build.mjs`; **nunca** se commitea al repo.
4. Deploy. Cada push a `main` redeploya el preview.

> El preview carga JS/CSS desde jsDelivr `@latest`, así que refleja el último release.
> Para previsualizar un build local no publicado, cambia el `src` del script a
> `/dist/landing.js` y agrega `dist/` al `outputDirectory`.
