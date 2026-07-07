// Smooth scroll con Lenis, montado sobre el ticker de GSAP y sincronizado con ScrollTrigger
// — mismo esquema que OSMO/Portfolio2026. Un solo RAF: Lenis corre dentro de gsap.ticker, y
// ScrollTrigger se actualiza en cada scroll virtual de Lenis (sin esto, los triggers no siguen
// al scroll suavizado). Guard de reduced-motion: si el usuario lo pidió, no arranca y el scroll
// queda nativo.
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap-env';

let lenis: Lenis | undefined;

export function initSmoothScroll(): void {
  if (prefersReducedMotion || lenis) return; // reduced-motion o ya inicializado (idempotente)

  lenis = new Lenis({
    lerp: 0.165, // factor de interpolación por frame: bajo = más glide/inercia (el "flotado")
    wheelMultiplier: 1.25, // recorrido por muesca de rueda (feel del portafolio)
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });
  // lagSmoothing(0): NUNCA falsear el delta de tiempo. Con valores (500,33) un pico de frame
  // distorsiona el tiempo que recibe el raf de Lenis → stutter/catch-up visible en el scroll.
  gsap.ticker.lagSmoothing(0);
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
