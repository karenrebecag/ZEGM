// Loader "Dropping Cards" (Osmo) + cabecera hero. Portado 1:1 al patrón ZEGM:
// clases .aa-loader__* scopeadas, GSAP centralizado, imágenes desde R2 (la CSP del
// bundle bloquea las de Webflow). La animación vive en initLoader (src/ui/loader.ts).
import type { Lang } from '../core/types';
import { el } from '../core/dom';
import { splitWordsToFragment } from '../core/split-words';
import { LOADER, navHref } from '../constants/content';
import { GALLERY, STOCK, SPEAKERS, LOGOS, HERO } from '../constants/assets';
import { renderButton } from '../ui/button';

// Placeholders R2 hasta tener el arte final: 5 cartas del deck + fondo del hero.
const CARDS = [
  GALLERY.acs5950,
  GALLERY.i6a6149,
  STOCK.lawyers,
  SPEAKERS.gomezmont,
  SPEAKERS.zinzer,
] as const;
const HEADER_BG = HERO.main;

// initLoader revela estas palabras (data-aa-loader-word) junto con la cabecera, en el
// mismo timeline del loader. El wrapping vive en core/split-words.ts.
const LOADER_WORD_CLASSES = {
  word: 'aa-loader-header__word',
  inner: 'aa-loader-header__word-inner',
  innerAttr: 'data-aa-loader-word',
} as const;

const splitWords = (text: string): DocumentFragment =>
  splitWordsToFragment(text, LOADER_WORD_CLASSES);

// showOverlay: el overlay dropping-cards solo se renderiza en el primer mount de la
// sesión (ver shouldPlayLoaderOverlay en index.ts). El hero se renderiza SIEMPRE — no
// depende del overlay para ser visible (initLoader solo lo animaba desde un estado
// oculto; su estado de reposo por CSS ya es visible).
export function renderLoader(root: HTMLElement, lang: Lang, showOverlay: boolean): void {
  const t = LOADER[lang];

  // ─── Cabecera hero (SIEMPRE) ────────────────────────────────────────────────
  const header = el('section', 'aa-loader-header', {
    'data-aa-loader-header': '',
    'data-aa-section-theme': 'dark',
    id: 'inicio',
  });
  header.append(
    el('img', 'aa-loader__cover is--bg', {
      src: HEADER_BG,
      alt: '',
      loading: 'eager',
      decoding: 'async',
      fetchpriority: 'high',
    }),
  );
  const content = el('div', 'aa-loader-header__content');
  // Intro (arriba): lead + CTA agrupados para que el space-between del content mantenga
  // el bloque pegado arriba y la firma (mega) abajo, con el CTA justo bajo el lead.
  const intro = el('div', 'aa-loader-header__intro');
  const lead = el('p', 'aa-loader-header__lead');
  lead.append(splitWords(t.lead));
  const cta = renderButton(t.ctaAbout, {
    variant: 'secondary',
    href: navHref({ page: 'nosotros', anchor: 'nosotros' }, 'home'),
  });
  intro.append(lead, cta);
  // h1: es el único heading de nivel 1 del home (nombre de la firma, semánticamente
  // correcto como título principal de la página) — antes era un <p> sin jerarquía.
  const firm = el('h1', 'aa-loader-header__firm');
  firm.append(splitWords(t.firm));
  content.append(intro, firm);
  header.append(content);

  // ─── Overlay fijo: fondo + logo + deck de cartas (SOLO primer mount) ────────
  if (showOverlay) {
    const container = el('div', 'aa-loader is--active', { 'data-aa-loader': '' });
    const screen = el('div', 'aa-loader__screen');

    const bg = el('div', 'aa-loader__bg', { 'data-aa-loader-bg': '' });

    const logo = el('div', 'aa-loader__logo', { 'data-aa-loader-logo': '' });
    const logoImg = el('img', 'aa-loader__logo-img', {
      src: LOGOS.wordmark,
      alt: 'ZEGM',
      loading: 'eager',
      decoding: 'async',
    });
    logo.append(logoImg);

    const list = el('div', 'aa-loader__list', { 'data-aa-loader-list': '' });
    CARDS.forEach((src) => {
      const card = el('div', 'aa-loader__card', { 'data-aa-loader-card': '' });
      // eager + alta prioridad: el deck es lo primero que anima; con lazy el navegador
      // difería la carga y la timeline arrancaba decodificando sobre el hilo principal.
      card.append(
        el('img', 'aa-loader__cover', { src, alt: '', loading: 'eager', fetchpriority: 'high', decoding: 'async' }),
      );
      list.append(card);
    });

    screen.append(bg, logo, list);
    container.append(screen);
    root.append(container);
  }

  root.append(header);
}
