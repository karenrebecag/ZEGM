// Registro y centralización de GSAP. Cualquier módulo que anime importa desde aquí,
// así el plugin se registra UNA sola vez y el bundle no duplica GSAP.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Respeta la preferencia de accesibilidad del usuario: sin animaciones si lo pidió.
export const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, ScrollTrigger };
