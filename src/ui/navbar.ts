// Auto-hide del navbar fijo: oculto al hacer scroll down fuera del top; visible en el
// top (scrollY 0) o al hacer scroll up. rAF-throttled + listener pasivo.
import { $ } from '../core/dom';

export function initNavbar(root: HTMLElement): void {
  const nav = $<HTMLElement>('.aa-nav', root);
  if (!nav) return;

  let lastY = window.scrollY;
  let ticking = false;

  const update = (): void => {
    const y = window.scrollY;
    if (y <= 0) {
      nav.classList.remove('is--hidden'); // top: siempre visible
    } else if (y > lastY) {
      nav.classList.add('is--hidden'); // scroll down
    } else if (y < lastY) {
      nav.classList.remove('is--hidden'); // scroll up
    }
    lastY = y;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );
}
