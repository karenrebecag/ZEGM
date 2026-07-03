// Servicios: heading full-width + grid 4 columnas (sin wrap en desktop).
// Slot 1: imagen 2:3 al fondo · Slot 2: texto + CTA (space-between) ·
// Slot 3: imagen de fondo cover · Slot 4: imagen 2:3 + texto.
import type { Lang } from '../core/types';
import { el } from '../core/dom';
import { SERVICES, navHref } from '../constants/content';
import { SPEAKERS, GALLERY } from '../constants/assets';
import { renderButton } from '../ui/button';

// Placeholders R2 hasta tener el arte final (2:3 los portrait, landscape el de fondo).
const IMG = {
  slot1: SPEAKERS.gonzalo,
  slot3: GALLERY.i6a6149,
  slot4: SPEAKERS.alan,
} as const;

const img = (className: string, src: string): HTMLImageElement =>
  el('img', className, { src, alt: '', loading: 'lazy', decoding: 'async' });

export function renderServices(root: HTMLElement, lang: Lang): void {
  const t = SERVICES[lang];

  const section = el('section', 'aa-services', {
    'data-aa-section-theme': 'light',
    id: 'practica',
  });
  const inner = el('div', 'aa-services__inner aa-container');

  const heading = el('h2', 'aa-services__heading aa-h-xl');
  heading.textContent = t.heading;
  heading.setAttribute('data-aa-split', '');

  // data-reveal-group: reveal en scroll de las 4 cards (ScrollTrigger + GSAP,
  // src/ui/reveal-group.ts). t-avatar-group: hover-comb en las imágenes de las cards
  // con foto (transitions-dev #11) — ambos conviven en el grid porque cada uno anima
  // un elemento distinto (card vs. imagen), sin pisarse la propiedad transform.
  const grid = el('div', 'aa-services__grid t-avatar-group', { 'data-reveal-group': '', 'data-stagger': '120' });

  // Slot 1 — imagen 2:3 anclada al fondo.
  const c1 = el('div', 'aa-services__card aa-services__card--imgbottom');
  c1.append(img('aa-services__img t-avatar', IMG.slot1));

  // Slot 2 — texto arriba, CTA abajo.
  const c2 = el('div', 'aa-services__card aa-services__card--text');
  const top = el('div', 'aa-services__text-top');
  const title = el('h3', 'aa-h-m');
  title.textContent = t.slot2Title;
  title.setAttribute('data-aa-split', '');
  const body2 = el('p', 'aa-p-l aa-services__body');
  body2.innerHTML = t.slot2Body; // copy estático de confianza (bold parcial)
  top.append(title, body2);
  // services solo se renderiza en home → currentPage 'home'; el CTA lleva a Contacto.
  const cta = renderButton(t.slot2Cta, {
    variant: 'primary',
    href: navHref({ page: 'contacto', anchor: 'contacto' }, 'home'),
  });
  c2.append(top, cta);

  // Slot 3 — imagen de fondo cover.
  const c3 = el('div', 'aa-services__card aa-services__card--bg');
  c3.append(img('aa-services__bg t-avatar', IMG.slot3));

  // Slot 4 — imagen 2:3 + texto debajo.
  const c4 = el('div', 'aa-services__card aa-services__card--imgtext');
  c4.append(img('aa-services__img t-avatar', IMG.slot4));
  // Slot 4 es un statement (heading), no cuerpo muted: navy pleno con bold parcial.
  const body4 = el('p', 'aa-services__statement');
  body4.innerHTML = t.slot4Body; // copy estático de confianza (bold parcial)
  body4.setAttribute('data-aa-split', '');
  c4.append(body4);

  grid.append(c1, c2, c3, c4);
  inner.append(heading, grid);
  section.append(inner);
  root.append(section);
}
