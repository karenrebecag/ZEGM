// Quote full-width (Relume Testimonial 1, sin avatar/logo). Texto centrado con bold
// parcial; atribución en mono uppercase. Theme light con tinte sutil.
import type { Lang } from '../core/types';
import { el } from '../core/dom';
import { QUOTE } from '../constants/content';

export function renderQuote(root: HTMLElement, lang: Lang): void {
  const t = QUOTE[lang];

  const section = el('section', 'aa-quote', { 'data-aa-section-theme': 'light' });
  const inner = el('div', 'aa-quote__inner aa-container');

  const quote = el('blockquote', 'aa-quote__text');
  // innerHTML: copy estático de confianza con <strong> inline (bold parcial).
  quote.innerHTML = t.text;
  quote.setAttribute('data-aa-split', '');

  const cite = el('div', 'aa-quote__cite', { 'data-reveal-group': '' });
  const name = el('span', 'aa-quote__cite-name');
  name.textContent = t.citeName;
  const role = el('span', 'aa-quote__cite-role');
  role.textContent = t.citeRole;
  cite.append(name, role);

  inner.append(quote, cite);
  section.append(inner);
  root.append(section);
}
