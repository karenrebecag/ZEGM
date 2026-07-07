// Split-text por palabra + ScrollTrigger, sin el plugin SplitText de GSAP (no está
// licenciado en este proyecto). El wrapping vive en core/split-words.ts, compartido con
// la cabecera del loader (sections/loader.ts). Declarativo vía data-aa-split, mismo
// criterio que data-aa-fade en motion.ts: se llama una vez tras el render, degrada a
// "todo visible" si el usuario pidió reduced-motion.
import { gsap, prefersReducedMotion, ENTER_DELAY } from './gsap-env';
import { $$ } from '../core/dom';
import { splitWordsInPlace } from '../core/split-words';

const SPLIT_CLASSES = { word: 'aa-split-word', inner: 'aa-split-word-inner' } as const;

export function initSplitText(root: HTMLElement): void {
  if (prefersReducedMotion) return; // el CSS deja el contenido visible por defecto

  $$<HTMLElement>('[data-aa-split]', root).forEach((node) => {
    const words = splitWordsInPlace(node, SPLIT_CLASSES);
    if (!words.length) return;

    // data-aa-split="mount" → dispara en mount (para headings sobre el fold, donde el
    // ScrollTrigger no dispara confiable). Default → scroll-reveal.
    const onMount = node.dataset.aaSplit === 'mount';

    gsap.from(words, {
      yPercent: 110,
      duration: 0.7,
      ease: 'expo.out',
      stagger: 0.03,
      // clamp(): mismo motivo que en motion.ts — evita offsets inválidos cerca del tope
      // del documento o antes de que el layout final asiente.
      ...(onMount ? { delay: ENTER_DELAY } : { scrollTrigger: { trigger: node, start: 'clamp(top 85%)', once: true } }),
    });
  });
}
