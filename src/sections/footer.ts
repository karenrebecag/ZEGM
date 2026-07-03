// Footer dark: row superior con la marca centrada + 3 columnas (contacto / teléfonos /
// back-to-top + nav). Theme dark → navy de fondo, fg claros. Textura vía ::before (CSS).
import type { Lang } from '../core/types';
import { el } from '../core/dom';
import { FOOTER, NAV, navHref } from '../constants/content';

// id de la primera sección de cada página (para el "volver arriba" del footer).
const TOP_ANCHOR: Record<string, string> = {
  contacto: '#contacto',
  areas: '#areas',
  nosotros: '#nosotros',
};

export function renderFooter(root: HTMLElement, lang: Lang, page: string): void {
  const t = FOOTER[lang];

  const footer = el('footer', 'aa-footer', { 'data-aa-section-theme': 'dark' });
  const inner = el('div', 'aa-footer__inner');

  // ─── Row superior: marca centrada ───────────────────────────────────────────
  const top = el('div', 'aa-footer__top');
  const brand = el('p', 'aa-footer__brand');
  const brandMain = el('span', 'aa-footer__brand-main');
  brandMain.textContent = t.brand;
  brandMain.setAttribute('data-aa-split', '');
  const brandSub = el('span', 'aa-footer__brand-sub');
  brandSub.textContent = t.brandSub;
  brand.append(brandMain, brandSub);
  top.append(brand);

  // ─── 3 columnas ─────────────────────────────────────────────────────────────
  const cols = el('div', 'aa-footer__cols', { 'data-reveal-group': '' });

  // Col 1: título arriba, dirección abajo (space-between).
  const col1 = el('div', 'aa-footer__col aa-footer__col--contact');
  const title = el('h3', 'aa-footer__title');
  title.textContent = t.contactTitle;
  title.setAttribute('data-aa-split', '');
  const addr = el('p', 'aa-footer__address');
  // innerHTML: copy estático de confianza (addressLead en bold).
  addr.innerHTML = `<strong>${t.addressLead}</strong><br>${t.addressLines.join('<br>')}`;
  col1.append(title, addr);

  // Col 2: teléfonos + email.
  const col2 = el('div', 'aa-footer__col');
  const contact = el('p', 'aa-footer__contact');
  contact.innerHTML = `${t.phones}<br><a href="mailto:${t.email}">${t.email}</a>`;
  col2.append(contact);

  // Col 3: back-to-top + navegación.
  const col3 = el('div', 'aa-footer__col aa-footer__col--nav');
  // Back-to-top al top de la página actual (id de su primera sección).
  const topAnchor = TOP_ANCHOR[page] ?? '#inicio';
  const backTop = el('a', 'aa-footer__backtop', { href: topAnchor });
  backTop.textContent = t.backToTop;
  const nav = el('nav', 'aa-footer__nav');
  NAV[lang].forEach((item) => {
    const link = el('a', 'aa-footer__nav-link', {
      href: navHref(item, page),
      'data-underline-link': '',
    });
    link.textContent = item.label;
    nav.append(link);
  });
  col3.append(backTop, nav);

  cols.append(col1, col2, col3);
  inner.append(top, cols);
  footer.append(inner);
  root.append(footer);
}
