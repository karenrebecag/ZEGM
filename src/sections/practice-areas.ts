// Dos columnas: panel de experiencia fijo (sticky, izq) + lista numerada de áreas de
// práctica con scroll natural (der). Cada item abre su detalle con el botón "SABER MÁS"
// (renderButton reusado como trigger de dropdown, no como link — ver initAccordion).
import type { Lang } from '../core/types';
import { el } from '../core/dom';
import { renderButton } from '../ui/button';
import { EXPERIENCE, PRACTICE_AREAS } from '../constants/content';

export function renderPracticeAreas(root: HTMLElement, lang: Lang): void {
  const t = EXPERIENCE[lang];
  const items = PRACTICE_AREAS[lang];

  const section = el('section', 'aa-practice-areas', { 'data-aa-section-theme': 'light' });
  const inner = el('div', 'aa-practice-areas__inner aa-container');
  const grid = el('div', 'aa-practice-areas__grid');

  // Columna con scroll natural.
  const list = el('div', 'aa-practice-areas__list', { 'data-reveal-group': '', 'data-stagger': '80' });
  items.forEach((item, index) => {
    const row = el('div', 'aa-practice-areas__item', { 'data-aa-accordion-item': '' });

    const number = el('span', 'aa-practice-areas__number');
    number.textContent = `${item.number}.`;

    const body = el('div', 'aa-practice-areas__body');

    const title = el('p', 'aa-practice-areas__title');
    title.textContent = item.title;

    const panelId = `aa-practice-area-${index}`;
    const toggle = renderButton('Saber más', { variant: 'tertiary' });
    toggle.classList.add('aa-practice-areas__toggle');
    toggle.setAttribute('data-aa-accordion-toggle', '');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', panelId);

    const panel = el('div', 'aa-practice-areas__panel', { id: panelId });
    const panelInner = el('div', 'aa-practice-areas__panel-inner');
    const detail = el('p', 'aa-practice-areas__detail');
    detail.textContent = item.detail;
    panelInner.append(detail);
    panel.append(panelInner);

    body.append(title, toggle, panel);
    row.append(number, body);
    list.append(row);
  });

  // Columna fija (sticky) — label + párrafos de experiencia.
  const sticky = el('div', 'aa-practice-areas__sticky');
  const label = el('p', 'aa-practice-areas__label');
  label.textContent = t.label;

  const copy = el('div', 'aa-practice-areas__copy', { 'data-reveal-group': '' });
  t.paragraphs.forEach((paragraph) => {
    const p = el('p', 'aa-p-l');
    p.textContent = paragraph;
    copy.append(p);
  });

  sticky.append(label, copy);

  grid.append(sticky, list);
  inner.append(grid);
  section.append(inner);
  root.append(section);
}
