// Navbar portado de Relume Navbar 1 (Logo Left, Menu Right) al patrón ZEGM.
// En <992px los navlinks se ocultan y aparece el burger → overlay mobile (initNavMobile).
import type { Lang } from '../core/types';
import { el } from '../core/dom';
import { NAV, navHref } from '../constants/content';
import { LOGOS } from '../constants/assets';
import { renderButton } from '../ui/button';

export function renderNavbar(root: HTMLElement, lang: Lang, page: string): void {
  // Arranca oculto (is--hidden = translateY -100%); initNavbar lo revela al montar
  // (bajando suave vía la transition base), tras el loader en home.
  const nav = el('nav', 'aa-nav is--hidden', { 'data-aa-section-theme': 'light' });

  // El logo lleva al home (o al top del home si ya estamos ahí).
  const homeHref = navHref({ page: 'home', anchor: 'inicio' }, page);
  const logo = el('a', 'aa-nav__logo', { href: homeHref, 'aria-label': 'ZEGM' });
  logo.append(el('img', 'aa-nav__logo-img', { src: LOGOS.mark, alt: 'ZEGM' }));

  const items = NAV[lang];

  // El último item (Contacto) es el CTA → botón primary; el resto, links con subrayado
  // animado (data-underline-link, 100% CSS).
  const buildItem = (item: (typeof items)[number], i: number, mobile: boolean): HTMLElement => {
    const href = navHref(item, page);
    if (i === items.length - 1) {
      const cta = renderButton(item.label, { variant: 'primary', href });
      if (mobile) {
        cta.classList.add('aa-nav__mobile-cta');
        cta.setAttribute('data-aa-nav-item', '');
      }
      return cta;
    }
    const cls = mobile ? 'aa-nav__mobile-link' : 'aa-nav__link';
    const attrs: Record<string, string> = mobile
      ? { href, 'data-aa-nav-item': '' }
      : { href, 'data-underline-link': '' };
    const a = el('a', cls, attrs);
    a.textContent = item.label;
    return a;
  };

  // Links desktop (ocultos <992px).
  const links = el('div', 'aa-nav__links');
  items.forEach((item, i) => links.append(buildItem(item, i, false)));

  // Burger (solo <992px).
  const burger = el('button', 'aa-nav__burger', {
    type: 'button',
    'aria-label': 'Abrir menú',
    'aria-expanded': 'false',
    'aria-controls': 'aa-nav-mobile',
    'data-aa-nav-burger': '',
  });
  (['top', 'mid', 'bot'] as const).forEach((pos) =>
    burger.append(el('span', 'aa-nav__burger-line', { 'data-line': pos })),
  );

  // Overlay mobile (bajo la barra) con los mismos items apilados.
  const menu = el('div', 'aa-nav__mobile', {
    id: 'aa-nav-mobile',
    'data-aa-nav-mobile': '',
    'data-lenis-prevent': '',
  });
  const menuList = el('div', 'aa-nav__mobile-list');
  items.forEach((item, i) => menuList.append(buildItem(item, i, true)));
  menu.append(menuList);

  nav.append(logo, links, burger);
  root.append(nav, menu);
}
