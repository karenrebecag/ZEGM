// Página de contacto: grid de 4 slots (intro top-left · 2 y 3 vacíos · datos abajo-der)
// + mapa Mapbox full-width. Mismo lenguaje que la home (sans, navy sobre blanco).
import type { Lang } from '../core/types';
import { el } from '../core/dom';
import { CONTACT } from '../constants/content';

// Coordenadas de Sierra Nevada 156, Lomas de Chapultepec (el mapa lo monta initMapbox).
const MAP = { lat: '19.4265737', lng: '-99.2075335', zoom: '15' };

export function renderContact(root: HTMLElement, lang: Lang): void {
  const t = CONTACT[lang];

  const section = el('section', 'aa-contact', {
    'data-aa-section-theme': 'light',
    id: 'contacto',
  });
  const inner = el('div', 'aa-contact__inner aa-container');
  const grid = el('div', 'aa-contact__grid');

  // Slot 1 — heading + subheading.
  const slot1 = el('div', 'aa-contact__slot');
  const heading = el('h1', 'aa-contact__heading aa-h-xl');
  heading.textContent = t.heading;
  heading.setAttribute('data-aa-split', 'mount');
  const sub = el('p', 'aa-contact__sub');
  sub.innerHTML = t.subheading; // copy estático de confianza (bold parcial)
  slot1.append(heading, sub);

  // Slots 2 y 3 — vacíos (espaciado del grid).
  const slot2 = el('div', 'aa-contact__slot');
  const slot3 = el('div', 'aa-contact__slot');

  // Slot 4 — datos de contacto.
  const slot4 = el('div', 'aa-contact__slot aa-contact__details');
  const addr = el('p', 'aa-contact__addr');
  addr.innerHTML = `<strong>${t.firm}</strong><br>${t.address}`;

  const phoneBlock = el('div', 'aa-contact__block');
  const phoneLabel = el('p', 'aa-contact__label');
  phoneLabel.textContent = t.phonesLabel;
  const phoneVal = el('p', 'aa-contact__value');
  phoneVal.textContent = t.phones;
  phoneBlock.append(phoneLabel, phoneVal);

  const mailBlock = el('div', 'aa-contact__block');
  const mailLabel = el('p', 'aa-contact__label');
  mailLabel.textContent = t.emailLabel;
  const mailVal = el('p', 'aa-contact__value');
  mailVal.innerHTML = `<a href="mailto:${t.email}">${t.email}</a>`;
  mailBlock.append(mailLabel, mailVal);

  slot4.append(addr, phoneBlock, mailBlock);

  grid.append(slot1, slot2, slot3, slot4);
  inner.append(grid);

  // Mapa Mapbox full-width (lo monta initMapbox; el token llega por atributo del mount).
  const map = el('div', 'aa-contact__map', {
    'data-aa-section-theme': 'dark',
    'data-aa-map': '',
    'data-aa-map-lat': MAP.lat,
    'data-aa-map-lng': MAP.lng,
    'data-aa-map-zoom': MAP.zoom,
    role: 'img',
    'aria-label': t.mapTitle,
  });

  section.append(inner, map);
  root.append(section);
}
