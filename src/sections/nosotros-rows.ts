// Cuerpo de la página "Nosotros": 3 filas full-width apiladas en columna, cada una con
// 2 subcontenedores al 50% (inner row). Placeholder — contenido real (imágenes/texto)
// pendiente de definir.
import type { Lang } from '../core/types';
import { el } from '../core/dom';
import { ABOUT, NOSOTROS, NOSOTROS_BODY, navHref } from '../constants/content';
import { GALLERY, STOCK } from '../constants/assets';
import { renderButton } from '../ui/button';

// El cell recorta (aspect-ratio + overflow:clip) y actúa de trigger de parallax; la
// imagen (sobredimensionada vía .aa-parallax-target) es el target que se desplaza.
// alt: '' para stock genérico (decorativo, sin info más allá del texto adyacente);
// alt descriptivo para fotos reales (galería de evento).
function imgCell(src: string, alt: string): HTMLElement {
  const cell = el('div', 'aa-nosotros-row__imgcell', { 'data-aa-parallax': 'trigger' });
  cell.append(
    el('img', 'aa-nosotros-row__img aa-parallax-target', {
      src,
      alt,
      loading: 'lazy',
      decoding: 'async',
      'data-aa-parallax': 'target',
      'data-aa-parallax-start': '8',
      'data-aa-parallax-end': '-8',
    }),
  );
  return cell;
}

// Row 1: imagen (col A) + heading uppercase + copy real de ABOUT (col B). No hay foto de
// despacho/equipo en el catálogo aún — se usa STOCK.lawyers (temática más cercana) como
// placeholder hasta tener el asset real.
function renderRowOne(lang: Lang): HTMLElement {
  const t = NOSOTROS[lang];
  const row = el('div', 'aa-nosotros-row', { 'data-reveal-group': 'mount' });

  const colA = el('div', 'aa-nosotros-row__col aa-nosotros-row__col--img');
  const img = el('img', 'aa-nosotros-row__img', {
    src: STOCK.lawyers,
    alt: '',
    loading: 'lazy',
    decoding: 'async',
  });
  colA.append(img);

  const colB = el('div', 'aa-nosotros-row__col aa-nosotros-row__col--text');
  const heading = el('h2', 'aa-h-m aa-nosotros-row__heading');
  heading.textContent = t.megaHeading;
  heading.setAttribute('data-aa-split', '');
  const body = el('p', 'aa-p-l');
  body.innerHTML = ABOUT[lang].body[0];
  colB.append(heading, body);

  row.append(colA, colB);
  return row;
}

// Row 2: tres slots lado a lado. Slot 1: texto+CTA (space-between) a la izquierda de la
// imagen. Slot 2: imagen individual. Slot 3: imagen + quote. Placeholders STOCK.
function renderRowTwo(lang: Lang): HTMLElement {
  const t = NOSOTROS_BODY[lang];
  const row = el('div', 'aa-nosotros-row aa-nosotros-row--triple', { 'data-reveal-group': 'mount' });

  // ─── Slot 1: texto + CTA (space-between) ──────────────────────────────────────
  const copy = el('div', 'aa-nosotros-row__col aa-nosotros-row__col--copy');
  const textGroup = el('div', 'aa-nosotros-row__textgroup');
  const lead = el('p', 'aa-p-l');
  lead.textContent = t.lead;
  const detail = el('p', 'aa-p-l');
  detail.innerHTML = t.detail;
  textGroup.append(lead, detail);
  const cta = renderButton(t.ctaLabel, {
    variant: 'primary',
    href: navHref({ page: 'contacto', anchor: 'contacto' }, 'nosotros'),
  });
  copy.append(textGroup, cta);

  // ─── Slot 2: imagen individual ────────────────────────────────────────────────
  const imgSlot = el('div', 'aa-nosotros-row__col aa-nosotros-row__col--img');
  imgSlot.append(
    el('img', 'aa-nosotros-row__img', {
      src: STOCK.nilov,
      alt: '',
      loading: 'lazy',
      decoding: 'async',
    }),
  );

  // ─── Slot 3: imagen + quote ───────────────────────────────────────────────────
  const media = el('div', 'aa-nosotros-row__col aa-nosotros-row__col--media');
  media.append(
    el('img', 'aa-nosotros-row__img', {
      src: STOCK.lawyers,
      alt: '',
      loading: 'lazy',
      decoding: 'async',
    }),
  );
  const quote = el('p', 'aa-p-l aa-nosotros-row__quote');
  quote.innerHTML = t.quote;
  media.append(quote);

  row.append(copy, imgSlot, media);
  return row;
}

// Row 3. Slot 1: heading uppercase + subheading. Slot 2: dos párrafos + grid de dos
// imágenes (cada una autocontenida por su celda). Imágenes de galería como placeholder.
function renderRowThree(lang: Lang): HTMLElement {
  const t = NOSOTROS_BODY[lang];
  const row = el('div', 'aa-nosotros-row', { 'data-reveal-group': 'mount' });

  // ─── Slot 1: heading + subheading ─────────────────────────────────────────────
  const colA = el('div', 'aa-nosotros-row__col aa-nosotros-row__col--text');
  const heading = el('h2', 'aa-h-m aa-nosotros-row__heading');
  heading.textContent = t.diffHeading;
  heading.setAttribute('data-aa-split', '');
  const sub = el('p', 'aa-p-l');
  sub.innerHTML = t.diffSub;
  colA.append(heading, sub, imgCell(STOCK.nilov, ''));

  // ─── Slot 2: dos párrafos + grid de dos imágenes ──────────────────────────────
  const colB = el('div', 'aa-nosotros-row__col aa-nosotros-row__col--body');
  const textGroup = el('div', 'aa-nosotros-row__textgroup');
  t.diffBody.forEach((paragraph) => {
    const p = el('p', 'aa-p-l');
    p.textContent = paragraph;
    textGroup.append(p);
  });
  const grid = el('div', 'aa-nosotros-row__imggrid');
  grid.append(imgCell(GALLERY.acs5950, t.galleryAlt[0]), imgCell(GALLERY.i6a6149, t.galleryAlt[1]));
  colB.append(textGroup, grid);

  row.append(colA, colB);
  return row;
}

export function renderNosotrosRows(root: HTMLElement, lang: Lang): void {
  const section = el('section', 'aa-nosotros-rows', {
    'data-aa-section-theme': 'light',
    id: 'nosotros',
  });

  const inner = el('div', 'aa-nosotros-rows__inner');
  inner.append(renderRowOne(lang), renderRowTwo(lang), renderRowThree(lang));

  section.append(inner);
  root.append(section);
}
