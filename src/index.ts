// Entry point. Cada punto de montaje declara su configuración por atributos:
//   <div data-aa-mount data-aa-theme="light|dark" data-aa-lang="es|en"></div>
//   <script data-cfasync="false"
//     src="https://cdn.jsdelivr.net/gh/karenrebecag/ZEGM@latest/loader.js"></script>
const _v = document.querySelector<HTMLScriptElement>('script[src*="ZEGM@"]')?.src.match(/ZEGM@([^/]+)/)?.[1] ?? 'dev';
console.log(`[zegm-web] v${_v} loaded`);

import { type Theme, type Lang } from './core/types';
import { AREAS } from './constants/content';
import { initMotion } from './ui/motion';
import { renderNavbar } from './sections/navbar';
import { initNavbar } from './ui/navbar';
import { initNavMobile } from './ui/nav-mobile';
import { renderLoader } from './sections/loader';
import { renderAbout } from './sections/about';
import { renderQuote } from './sections/quote';
import { renderServices } from './sections/services';
import { renderContact } from './sections/contact';
import { renderPageHeading } from './sections/page-heading';
import { renderPracticeAreas } from './sections/practice-areas';
import { renderNosotrosRows } from './sections/nosotros-rows';
import { renderFooter } from './sections/footer';
import { initLoader } from './ui/loader';
import { initMapbox } from './ui/mapbox';
import { initSplitText } from './ui/split-text';
import { watchLayoutShifts } from './ui/scroll-refresh';
import { initRevealGroup } from './ui/reveal-group';
import { initCardHover } from './ui/card-hover';
import { initAccordion } from './ui/accordion';
import { initSmoothScroll, scrollToTarget } from './ui/smooth-scroll';

// Scroll suave para anclas internas (#id) sin tocar CSS global del host.
function initAnchorScroll(root: HTMLElement): void {
  root.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href')?.slice(1);
    if (!id) return;
    const target = root.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
    if (!target) return;
    e.preventDefault();
    scrollToTarget(target);
  });
}

function resolveTheme(raw: string | undefined): Theme {
  return raw === 'dark' ? 'dark' : 'light';
}

// El ?lang= de la URL tiene prioridad sobre el data-aa-lang del mount.
function resolveLang(raw: string | undefined): Lang {
  const urlLang = new URLSearchParams(window.location.search).get('lang');
  const value = urlLang ?? raw;
  return value === 'en' ? 'en' : 'es';
}

// Página a renderizar. data-aa-page del mount (default 'home'); ?page= lo sobreescribe.
function resolvePage(raw: string | undefined): string {
  const urlPage = new URLSearchParams(window.location.search).get('page');
  return urlPage ?? raw ?? 'home';
}

// Token público de Mapbox: atributo del mount (host) — nunca en el repo. ?mbtoken= lo
// sobreescribe (solo dev/preview). Su protección real es la URL restriction en Mapbox.
function resolveMapToken(raw: string | undefined): string | undefined {
  const urlToken = new URLSearchParams(window.location.search).get('mbtoken');
  return urlToken ?? raw ?? undefined;
}

function boot(): void {
  const mounts = document.querySelectorAll<HTMLElement>('[data-aa-mount]');
  mounts.forEach((mount) => {
    const theme = resolveTheme(mount.dataset.aaTheme);
    const lang = resolveLang(mount.dataset.aaLang);
    const page = resolvePage(mount.dataset.aaPage);
    const mapToken = resolveMapToken(mount.dataset.aaMapboxToken);

    // Root wrapper — todo el CSS está scopeado a .aa-landing
    const root = document.createElement('div');
    root.className = 'aa-landing';
    root.setAttribute('data-aa-theme', theme);
    root.setAttribute('data-aa-lang', lang);

    // Fase de render: el navbar y el footer son comunes; en medio, las secciones de
    // cada página. El home lleva el loader (overlay + hero); las páginas cortas no.
    renderNavbar(root, lang, page);
    if (page === 'contacto') {
      renderContact(root, lang);
    } else if (page === 'areas') {
      renderPageHeading(root, AREAS[lang], 'areas');
      renderPracticeAreas(root, lang);
    } else if (page === 'nosotros') {
      renderNosotrosRows(root, lang);
    } else {
      renderLoader(root, lang);
      renderAbout(root, lang);
      renderQuote(root, lang);
      renderServices(root, lang);
    }
    renderFooter(root, lang, page);

    mount.replaceChildren(root);

    // Fase de init: enganches de comportamiento/animación una vez montado el DOM.
    initSmoothScroll(); // Lenis global (idempotente); antes del anchor scroll y los reveals.
    initAnchorScroll(root);
    initNavbar(root);
    initNavMobile(root);
    initLoader(root);
    initMapbox(root, mapToken);
    initSplitText(root);
    initRevealGroup(root);
    initMotion(root);
    initCardHover(root);
    initAccordion(root);
    watchLayoutShifts(root);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
