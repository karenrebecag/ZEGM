// Navbar portado de Relume Navbar 1 (Logo Left, Menu Right) al patrón ZEGM.
// Simplificado: sin mega-menú, sin CTA, sin hamburguesa. En <992px los links se
// ocultan por CSS (mobile sin navlinks), así que no necesita JS.
import type { Lang } from '../core/types';
import { el } from '../core/dom';
import { NAV, navHref } from '../constants/content';
import { LOGOS } from '../constants/assets';
import { renderButton } from '../ui/button';

export function renderNavbar(root: HTMLElement, lang: Lang, page: string): void {
  const nav = el('nav', 'aa-nav', { 'data-aa-section-theme': 'light' });

  // El logo lleva al home (o al top del home si ya estamos ahí).
  const homeHref = navHref({ page: 'home', anchor: 'inicio' }, page);
  const logo = el('a', 'aa-nav__logo', { href: homeHref, 'aria-label': 'ZEGM' });
  logo.append(el('img', 'aa-nav__logo-img', { src: LOGOS.mark, alt: 'ZEGM' }));

  const links = el('div', 'aa-nav__links');
  const items = NAV[lang];
  items.forEach((item, i) => {
    const href = navHref(item, page);
    // El último item (Contacto) es el CTA → botón primary; el resto, links con
    // subrayado animado (data-underline-link, animación 100% CSS).
    if (i === items.length - 1) {
      links.append(renderButton(item.label, { variant: 'primary', href }));
    } else {
      const a = el('a', 'aa-nav__link', { href, 'data-underline-link': '' });
      a.textContent = item.label;
      links.append(a);
    }
  });

  nav.append(logo, links);
  root.append(nav);
}
