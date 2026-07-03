// Split-text por palabra + ScrollTrigger, sin el plugin SplitText de GSAP (no está
// licenciado en este proyecto — ver aa-loader-header__word en sections/loader.ts para
// el mismo patrón aplicado a mano dentro del timeline del loader). Declarativo vía
// data-aa-split, mismo criterio que data-aa-fade en motion.ts: se llama una vez tras
// el render, degrada a "todo visible" si el usuario pidió reduced-motion.
import { gsap, prefersReducedMotion } from './gsap-env';
import { $$ } from '../core/dom';

// Envuelve cada palabra de texto dentro de `node` en <span clip><span animable>word</span></span>,
// preservando cualquier <strong> inline (copy estático de confianza, estructura recorrida
// recursivamente). Devuelve los spans animables.
function wrapWords(node: HTMLElement): HTMLElement[] {
  const words: HTMLElement[] = [];

  const walk = (parent: Node): void => {
    Array.from(parent.childNodes).forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
        return;
      }
      if (child.nodeType !== Node.TEXT_NODE) return;

      const text = child.textContent ?? '';
      const frag = document.createDocumentFragment();

      text.split(/(\s+)/).forEach((chunk) => {
        if (chunk === '') return;
        if (/^\s+$/.test(chunk)) {
          frag.append(document.createTextNode(chunk));
          return;
        }
        const wrap = document.createElement('span');
        wrap.className = 'aa-split-word';
        const inner = document.createElement('span');
        inner.className = 'aa-split-word-inner';
        inner.textContent = chunk;
        wrap.append(inner);
        frag.append(wrap);
        words.push(inner);
      });

      parent.replaceChild(frag, child);
    });
  };

  walk(node);
  return words;
}

export function initSplitText(root: HTMLElement): void {
  if (prefersReducedMotion) return; // el CSS deja el contenido visible por defecto

  $$<HTMLElement>('[data-aa-split]', root).forEach((node) => {
    const words = wrapWords(node);
    if (!words.length) return;

    // data-aa-split="mount" → dispara en mount (para headings sobre el fold, donde el
    // ScrollTrigger no dispara confiable). Default → scroll-reveal.
    const onMount = node.dataset.aaSplit === 'mount';

    gsap.from(words, {
      yPercent: 100,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.025,
      // clamp(): mismo motivo que en motion.ts — evita offsets inválidos cerca del tope
      // del documento o antes de que el layout final asiente.
      ...(onMount ? {} : { scrollTrigger: { trigger: node, start: 'clamp(top 85%)', once: true } }),
    });
  });
}
