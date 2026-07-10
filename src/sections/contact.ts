// Página de contacto: grid de 4 slots (intro top-left · 2 y 3 vacíos · datos abajo-der)
// + mapa Google Maps (iframe embed) full-width. Mismo lenguaje que la home (sans, navy
// sobre blanco).
import type { Lang } from '../core/types';
import { el } from '../core/dom';
import { CONTACT } from '../constants/content';

// Embed de Sierra Nevada 156, Lomas de Chapultepec.
const MAP_EMBED_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5100.184287064595!2d-99.20753350000001!3d19.426573699999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d201f43364b375%3A0x663e4d06cc5a487b!2sSierra%20Nevada%20156%2C%20Lomas%20-%20Virreyes%2C%20Lomas%20de%20Chapultepec%2C%20Miguel%20Hidalgo%2C%2011000%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX!5e1!3m2!1ses-419!2smx!4v1783714103756!5m2!1ses-419!2smx';

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

  // Mapa Google Maps full-width (embed estático, sin token/JS de por medio).
  const map = el('div', 'aa-contact__map', { 'data-aa-section-theme': 'dark' });
  map.append(
    el('iframe', 'aa-contact__map-frame', {
      src: MAP_EMBED_SRC,
      title: t.mapTitle,
      loading: 'lazy',
      referrerpolicy: 'strict-origin-when-cross-origin',
      allowfullscreen: '',
    }),
  );

  section.append(inner, map);
  root.append(section);
}
