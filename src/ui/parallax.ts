// Parallax declarativo por data-attrs (portado del sistema de Portfolio2026). Un
// [data-aa-parallax="trigger"] mueve su [data-aa-parallax="target"] (o a sí mismo) en
// yPercent/xPercent atado al progreso de scroll (scrub), con GSAP + ScrollTrigger.
//
// El target debe poder desplazarse SIN dejar huecos: su contenedor (el trigger) lleva
// overflow:hidden y el target se sobredimensiona (p. ej. height:120%) — ver la clase
// .aa-parallax-frame en components.css. Guard de reduced-motion: no arranca.
//
// Atributos (todos opcionales salvo el trigger):
//   data-aa-parallax="trigger"            → contenedor observado
//   data-aa-parallax="target"             → elemento que se mueve (default: el trigger)
//   data-aa-parallax-direction            → 'vertical' (default) | 'horizontal'
//   data-aa-parallax-start / -end         → yPercent/xPercent inicial y final (default 20 / -20)
//   data-aa-parallax-scrub                → número (suavizado en s) | ausente = true
//   data-aa-parallax-scroll-start / -end  → rango ScrollTrigger (default 'top bottom' / 'bottom top')
// gsap-env registra ScrollTrigger al importarse; el scrollTrigger del config inline
// lo consume el plugin (no se referencia la clase directamente aquí).
import { gsap, prefersReducedMotion } from './gsap-env';

export function initParallax(root: HTMLElement): void {
  if (prefersReducedMotion) return; // el CSS deja el target en su posición base

  root.querySelectorAll<HTMLElement>('[data-aa-parallax="trigger"]').forEach((trigger) => {
    const target = trigger.querySelector<HTMLElement>('[data-aa-parallax="target"]') ?? trigger;
    const direction = trigger.getAttribute('data-aa-parallax-direction') ?? 'vertical';
    const prop = direction === 'horizontal' ? 'xPercent' : 'yPercent';

    const scrubAttr = trigger.getAttribute('data-aa-parallax-scrub');
    const scrub = scrubAttr ? parseFloat(scrubAttr) : true;

    const startVal = parseFloat(trigger.getAttribute('data-aa-parallax-start') ?? '20');
    const endVal = parseFloat(trigger.getAttribute('data-aa-parallax-end') ?? '-20');

    // clamp(): mismo criterio que el resto de triggers — evita offsets inválidos cerca
    // del tope del documento o antes de que el layout asiente.
    const scrollStart = `clamp(${trigger.getAttribute('data-aa-parallax-scroll-start') ?? 'top bottom'})`;
    const scrollEnd = `clamp(${trigger.getAttribute('data-aa-parallax-scroll-end') ?? 'bottom top'})`;

    gsap.fromTo(
      target,
      { [prop]: startVal },
      {
        [prop]: endVal,
        ease: 'none',
        scrollTrigger: { trigger, start: scrollStart, end: scrollEnd, scrub },
      },
    );
  });
}
