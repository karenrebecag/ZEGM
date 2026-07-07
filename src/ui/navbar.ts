// Visibilidad del navbar fijo — una sola fuente de verdad, idempotente y jerárquica.
//
// Jerarquía de reglas (mayor a menor prioridad):
//   1. En el top (y <= TOP_THRESHOLD) → SIEMPRE visible.
//   2. Fuera del top, con gesto de scroll → down oculta / up muestra.
//   3. En el mount (sin gesto) → oculto si no estás en el top (no forzamos mostrar).
//
// setHidden usa classList.toggle(cls, bool): llamar con el mismo estado es no-op, así el
// mount y el scroll convergen al mismo resultado sin pelearse (idempotencia).
//
// Entrada al montar: la barra se renderiza con is--hidden (translateY -100%). Si estás en
// el top, applyMountState la baja suave (transition base); si montas scrolleado, se queda
// oculta y aparece luego al hacer scroll up. En home (primer mount) espera al loader para
// no deslizar detrás del overlay.
import { $ } from '../core/dom';

const TOP_THRESHOLD = 0;

export function initNavbar(root: HTMLElement): void {
  const nav = $<HTMLElement>('.aa-nav', root);
  if (!nav) return;

  let lastY = window.scrollY;
  let ticking = false;

  const setHidden = (hidden: boolean): void => {
    nav.classList.toggle('is--hidden', hidden); // idempotente
  };

  // Regla 1 + 2: top gana sobre la dirección de scroll.
  const onScroll = (): void => {
    const y = window.scrollY;
    if (y <= TOP_THRESHOLD) setHidden(false);
    else if (y > lastY) setHidden(true);
    else if (y < lastY) setHidden(false);
    lastY = y;
    ticking = false;
  };

  // Regla 1 + 3: en mount solo se muestra si estás en el top; scrolleado queda oculto
  // (respeta el auto-hide en vez de forzar la entrada). Resetea lastY para que el primer
  // scroll no la oculte de golpe.
  const applyMountState = (): void => {
    lastY = window.scrollY;
    setHidden(window.scrollY > TOP_THRESHOLD);
  };

  // Overlay del loader presente (home, primer mount de la sesión) → espera a que termine
  // para aplicar el estado de entrada (durante el loader el scroll está en el top).
  if (root.querySelector('[data-aa-loader]')) {
    let applied = false;
    const onLoaderDone = (): void => {
      if (applied) return;
      applied = true;
      applyMountState();
    };
    root.addEventListener('aa:loader-done', onLoaderDone, { once: true });
    window.setTimeout(onLoaderDone, 6000); // fallback si el loader nunca despacha (chunk falla)
  } else {
    // Sin loader: doble rAF para pintar el estado oculto antes de disparar la transition.
    requestAnimationFrame(() => requestAnimationFrame(applyMountState));
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true },
  );
}
