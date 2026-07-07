// Registro y centralización de GSAP. Cualquier módulo que anime importa desde aquí,
// así el plugin se registra UNA sola vez y el bundle no duplica GSAP.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Respeta la preferencia de accesibilidad del usuario: sin animaciones si lo pidió.
export const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Timing compartido: dissolve de salida (page-transition) + beat de entrada de los
// reveals de mount, para que la transición de página se lea como un out→in continuo.
export const LEAVE_DURATION = 0.5;
export const LEAVE_EASE = 'power1.in';
export const ENTER_DELAY = 0.15;

export { gsap, ScrollTrigger };
