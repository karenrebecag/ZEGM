// Recalcula ScrollTrigger cuando el layout cambia DESPUÉS del refresh inicial de boot()
// — típicamente imágenes que aún no cargaron y corren el alto del documento al hacerlo.
// Sin este refresh tardío, los triggers calculados al boot quedan con offsets viejos y las
// secciones de abajo revelan en el punto de scroll equivocado.
//
// Consciente del alto (como Portfolio2026/lib/scroll-trigger-refresh.ts): solo refresca si
// el scrollHeight cambió de verdad. Las imágenes en celdas de tamaño fijo (aspect-ratio,
// object-fit) NO cambian el alto → así se evita un ScrollTrigger.refresh() GLOBAL inútil por
// cada <img> que carga. En páginas con muchas imágenes (grid de equipo) esa cascada de
// refreshes durante el scroll causaba jank.
import { ScrollTrigger } from './gsap-env';
import { getLenis } from './smooth-scroll';

let refreshRaf = 0;
let lastHeight = 0;

function scheduleRefresh(): void {
  cancelAnimationFrame(refreshRaf);
  refreshRaf = requestAnimationFrame(() => {
    const height = document.documentElement.scrollHeight;
    if (Math.abs(height - lastHeight) < 4) return; // sin cambio real de layout → no refrescar
    lastHeight = height;
    // Lenis recalcula el alto virtual del documento antes de que ScrollTrigger recompute.
    getLenis()?.resize();
    ScrollTrigger.refresh();
  });
}

export function watchLayoutShifts(root: HTMLElement): void {
  lastHeight = document.documentElement.scrollHeight; // baseline tras el render

  root.querySelectorAll('img').forEach((img) => {
    if (img.complete) return;
    img.addEventListener('load', scheduleRefresh, { once: true });
  });

  // Última red de seguridad: fuentes/última imagen que no dispararon arriba.
  window.addEventListener('load', scheduleRefresh, { once: true });
}
