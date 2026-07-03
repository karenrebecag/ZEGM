// Menú mobile: el burger aparece <992px (donde se ocultan los navlinks) y abre un overlay
// bajo la barra. Animación burger->X + stagger de items (patrón recortado del mega-nav de
// Osmo; ZEGM no tiene paneles). Bloquea el scroll con Lenis mientras está abierto. Guard de
// reduced-motion: estados sin animar.
import { gsap, prefersReducedMotion } from './gsap-env';
import { $, $$ } from '../core/dom';
import { getLenis } from './smooth-scroll';

// gap(0.2em) + grosor de línea(0.125em): distancia para colapsar las líneas al centro (X).
const LINE_SHIFT = '0.325em';

export function initNavMobile(root: HTMLElement): void {
  const nav = $<HTMLElement>('.aa-nav', root);
  const burger = $<HTMLButtonElement>('[data-aa-nav-burger]', root);
  const menu = $<HTMLElement>('[data-aa-nav-mobile]', root);
  if (!nav || !burger || !menu) return;

  const items = $$<HTMLElement>('[data-aa-nav-item]', menu);
  const top = $<HTMLElement>('[data-line="top"]', burger);
  const mid = $<HTMLElement>('[data-line="mid"]', burger);
  const bot = $<HTMLElement>('[data-line="bot"]', burger);

  let open = false;

  // El overlay arranca justo bajo la barra (alto real, no hardcodeado).
  const syncTop = (): void => {
    menu.style.top = `${nav.offsetHeight}px`;
  };
  syncTop();

  const lockScroll = (lock: boolean): void => {
    const lenis = getLenis();
    if (lenis) {
      if (lock) lenis.stop();
      else lenis.start();
    } else {
      document.documentElement.style.overflow = lock ? 'hidden' : '';
    }
  };

  const burgerTo = (toX: boolean): void => {
    if (prefersReducedMotion) {
      gsap.set(top, { y: toX ? LINE_SHIFT : 0, rotation: toX ? 45 : 0 });
      gsap.set(bot, { y: toX ? `-${LINE_SHIFT}` : 0, rotation: toX ? -45 : 0 });
      gsap.set(mid, { autoAlpha: toX ? 0 : 1 });
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    if (toX) {
      tl.to(top, { y: LINE_SHIFT, duration: 0.15 }, 0);
      tl.to(bot, { y: `-${LINE_SHIFT}`, duration: 0.15 }, 0);
      tl.to(mid, { autoAlpha: 0, duration: 0.1 }, 0.1);
      tl.to(top, { rotation: 45, duration: 0.2 }, 0.15);
      tl.to(bot, { rotation: -45, duration: 0.2 }, 0.15);
    } else {
      tl.to([top, bot], { rotation: 0, duration: 0.2 }, 0);
      tl.to([top, bot], { y: 0, duration: 0.15 }, 0.15);
      tl.to(mid, { autoAlpha: 1, duration: 0.1 }, 0.15);
    }
  };

  const setOpen = (next: boolean): void => {
    if (next === open) return;
    open = next;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.classList.toggle('is--open', open);
    lockScroll(open); // síncrono: así el scroll a anclas (Lenis) funciona al cerrar por click

    if (open) syncTop();
    burgerTo(open);

    if (prefersReducedMotion) {
      gsap.set(menu, { autoAlpha: open ? 1 : 0 });
      if (open) gsap.set(items, { autoAlpha: 1, y: 0 });
      return;
    }

    if (open) {
      const tl = gsap.timeline();
      tl.to(menu, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' }, 0);
      if (items.length) {
        tl.fromTo(
          items,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power3.out' },
          0.1,
        );
      }
    } else {
      gsap.to(menu, { autoAlpha: 0, duration: 0.25, ease: 'power2.in' });
    }
  };

  burger.addEventListener('click', () => setOpen(!open));
  items.forEach((item) => item.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) setOpen(false);
  });
  window.addEventListener('resize', () => {
    syncTop();
    if (window.innerWidth > 991 && open) setOpen(false);
  });
}
