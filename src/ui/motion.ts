// Sistema de reveals por scroll, declarativo vía data-attrs en el DOM generado:
//   data-aa-fade      → fade + translateY (data-aa-delay opcional, en s)
//   data-aa-stagger   → stagger sobre los hijos directos
// initMotion() se llama una vez tras render; degrada a "todo visible" si el usuario
// pidió reduced-motion o si algo falla (nunca deja contenido oculto).
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap-env';
import { $$ } from '../core/dom';

const FADE = { y: 24, opacity: 0 } as const;

export function initMotion(root: HTMLElement): void {
  if (prefersReducedMotion) return; // el CSS deja el contenido visible por defecto

  $$('[data-aa-fade]', root).forEach((node) => {
    const delay = Number((node as HTMLElement).dataset.aaDelay ?? 0);
    gsap.from(node, {
      ...FADE,
      delay,
      duration: 0.9,
      ease: 'expo.out',
      // clamp(): evita que el trigger calcule un offset inválido (negativo o más allá
      // del alto del documento) — sin esto, secciones cerca del tope o cuyo layout aún
      // no asienta pueden revelar en el punto de scroll equivocado.
      scrollTrigger: { trigger: node, start: 'clamp(top 85%)', once: true },
    });
  });

  $$('[data-aa-stagger]', root).forEach((group) => {
    gsap.from(Array.from(group.children), {
      ...FADE,
      duration: 0.9,
      ease: 'expo.out',
      stagger: 0.08,
      scrollTrigger: { trigger: group, start: 'clamp(top 85%)', once: true },
    });
  });

  ScrollTrigger.refresh();
}
