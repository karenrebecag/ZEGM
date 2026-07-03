// Recalcula ScrollTrigger cuando el layout cambia DESPUÉS del refresh inicial de boot()
// — típicamente imágenes que aún no cargaron y corren el alto del documento al hacerlo.
// Mismo problema que en el portafolio (lib/scroll-trigger-refresh.ts): sin este refresh
// tardío, los triggers calculados al boot quedan con offsets viejos y las secciones de
// abajo revelan en el punto de scroll equivocado ("se pintan" tarde/temprano al azar).
import { ScrollTrigger } from './gsap-env';
import { getLenis } from './smooth-scroll';

let refreshRaf = 0;

function scheduleRefresh(): void {
  cancelAnimationFrame(refreshRaf);
  refreshRaf = requestAnimationFrame(() => {
    // Lenis recalcula el alto virtual del documento antes de que ScrollTrigger recompute.
    getLenis()?.resize();
    ScrollTrigger.refresh();
  });
}

export function watchLayoutShifts(root: HTMLElement): void {
  root.querySelectorAll('img').forEach((img) => {
    if (img.complete) return;
    img.addEventListener('load', scheduleRefresh, { once: true });
  });

  // Última red de seguridad: fuentes/última imagen que no dispararon arriba.
  window.addEventListener('load', scheduleRefresh, { once: true });
}
