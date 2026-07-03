// Sección "Nosotros" (Relume Header 49): grid 2 columnas — statement izquierda,
// cuerpo derecha. Theme light → navy (--aa-fg) sobre blanco (--aa-bg).
import type { Lang } from '../core/types';
import { el } from '../core/dom';
import { ABOUT } from '../constants/content';

export function renderAbout(root: HTMLElement, lang: Lang): void {
  const t = ABOUT[lang];

  const section = el('section', 'aa-about', {
    'data-aa-section-theme': 'light',
    id: 'nosotros',
  });
  const inner = el('div', 'aa-about__inner aa-container');
  const grid = el('div', 'aa-about__grid');

  const left = el('div', 'aa-about__col');
  const heading = el('h2', 'aa-about__heading');
  // innerHTML: copy estático de confianza con <strong> inline (bold parcial).
  heading.innerHTML = t.heading;
  heading.setAttribute('data-aa-split', '');
  left.append(heading);

  const right = el('div', 'aa-about__col aa-about__body', { 'data-reveal-group': '' });
  t.body.forEach((html) => {
    const p = el('p', 'aa-p-l');
    p.innerHTML = html;
    right.append(p);
  });

  grid.append(left, right);
  inner.append(grid);
  section.append(inner);
  root.append(section);
}
