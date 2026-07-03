// Smooth scroll con Lenis, montado sobre el ticker de GSAP y sincronizado con ScrollTrigger
// — mismo esquema que OSMO. Un solo RAF: Lenis corre dentro de gsap.ticker, y ScrollTrigger
// se actualiza en cada scroll virtual de Lenis (sin esto, los triggers no siguen al scroll
// suavizado). Guard de reduced-motion: si el usuario lo pidió, no arranca y el scroll queda
// nativo. Valores idénticos a OSMO (lerp 0.165 / wheelMultiplier 1.25 / lagSmoothing 500,33).
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap-env';

let lenis: Lenis | undefined;

export function initSmoothScroll(): void {
  if (prefersReducedMotion || lenis) return; // reduced-motion o ya inicializado (idempotente)

  lenis = new Lenis({
    lerp: 0.3, // más cerca del scroll nativo (casi imperceptible), pero conserva el glide/inercia
    wheelMultiplier: 1, // velocidad nativa (sin sobre-acelerar la rueda)
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(500, 33);
}

// Scroll suave a un ancla. Lenis no intercepta scrollIntoView, así que se usa lenis.scrollTo;
// sin Lenis (reduced-motion) cae al scroll nativo.
export function scrollToTarget(target: HTMLElement): void {
  if (lenis) {
    lenis.scrollTo(target);
    return;
  }
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function getLenis(): Lenis | undefined {
  return lenis;
}
