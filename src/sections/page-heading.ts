// Heading de página secundaria: misma maquetación que .aa-loader-header (marco 1vw,
// padding que libera el navbar fijo) pero sin imagen de fondo — el navy sólido lo pinta
// el sistema de tema (data-aa-section-theme="dark"), no un color a mano. Descripción
// arriba-izq (chica, sans) + mega heading abajo-der (grande, uppercase, sans también —
// nunca la fuente display/serif) — exactamente el lead/firma del loader, sin imagen.
import { el } from '../core/dom';

export interface PageHeadingCopy {
  megaHeading: string;
  description: string;
}

export function renderPageHeading(root: HTMLElement, copy: PageHeadingCopy, anchorId: string): void {
  const section = el('section', 'aa-page-heading', {
    'data-aa-section-theme': 'dark',
    id: anchorId,
  });

  const content = el('div', 'aa-page-heading__content');

  const desc = el('p', 'aa-page-heading__desc');
  desc.textContent = copy.description;

  const mega = el('h1', 'aa-page-heading__mega');
  mega.textContent = copy.megaHeading;
  mega.setAttribute('data-aa-split', 'mount');

  content.append(desc, mega);
  section.append(content);
  root.append(section);
}
