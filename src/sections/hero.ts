// Sección demo del patrón: recibe el root y el idioma, crea su propio strip con
// data-aa-section-theme (el sistema de tema remapea los tokens --aa-*). Los reveals
// se declaran con data-aa-fade; initMotion los engancha tras el render.
import type { Lang } from '../core/types';
import { el } from '../core/dom';
import { HERO } from '../constants/content';

export function renderHero(root: HTMLElement, lang: Lang): void {
  const t = HERO[lang];

  const section = el('section', 'aa-hero', {
    'data-aa-section-theme': 'dark',
    id: 'inicio',
  });

  const inner = el('div', 'aa-hero__inner aa-container');

  const eyebrow = el('span', 'aa-eyebrow');
  eyebrow.textContent = t.eyebrow;

  const title = el('h1', 'aa-h-xxl');
  title.textContent = t.title;
  title.setAttribute('data-aa-fade', '');

  const subtitle = el('p', 'aa-p-l');
  subtitle.textContent = t.subtitle;
  subtitle.setAttribute('data-aa-fade', '');
  subtitle.setAttribute('data-aa-delay', '0.1');

  const cta = el('a', 'aa-btn', { href: '#inicio' });
  cta.textContent = t.cta;
  cta.setAttribute('data-aa-fade', '');
  cta.setAttribute('data-aa-delay', '0.2');

  inner.append(eyebrow, title, subtitle, cta);
  section.append(inner);
  root.append(section);
}
