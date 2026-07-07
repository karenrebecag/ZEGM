// Transición de página estilo crossfade — SIN Barba. El mount-point no puede ser el router
// (el host es dueño del documento) y la navegación es un page-load real, así que NO existen
// las dos páginas en el DOM a la vez para un crossfade verdadero (eso lo da Barba vía XHR).
// Lo más fiel sobre navegación real es un DISSOLVE: al salir, el contenido actual (.aa-landing)
// se desvanece a opacity 0 y luego navegamos; al entrar, la página nueva usa sus reveals
// (loader/split/reveal-group). Sin panel de color encima.
import { gsap, prefersReducedMotion, LEAVE_DURATION, LEAVE_EASE } from './gsap-env';
import { getLenis } from './smooth-scroll';

// ¿El click es una navegación interna (a otra página del host) que debemos transicionar?
// Descarta: modificadores/teclas, target=_blank, download, #anclas (misma página), mailto/tel,
// externos y la misma URL. Las anclas internas las maneja initAnchorScroll.
function navigableHref(e: MouseEvent): string | null {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
  const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
  if (!link || link.target === '_blank' || link.hasAttribute('download')) return null;
  const raw = link.getAttribute('href') ?? '';
  if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) return null;
  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin) return null; // externo
  if (url.pathname === window.location.pathname && url.search === window.location.search) return null; // misma página
  return url.href;
}

export function initPageTransition(root: HTMLElement): void {
  let navigating = false; // evita disparos dobles

  root.addEventListener('click', (e) => {
    if (navigating) return;
    const href = navigableHref(e);
    if (!href) return;
    e.preventDefault();

    if (prefersReducedMotion) {
      window.location.href = href;
      return;
    }

    navigating = true;
    getLenis()?.stop(); // congela el scroll durante el fade de salida

    // opacity (no autoAlpha): la página queda visible mientras se desvanece; navegamos al
    // completar. La nueva página entra con sus propios reveals.
    gsap.to(root, {
      opacity: 0,
      duration: LEAVE_DURATION,
      ease: LEAVE_EASE,
      onComplete: () => {
        window.location.href = href;
      },
    });
  });
}
