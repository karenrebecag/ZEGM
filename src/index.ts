// Entry point. Cada punto de montaje declara su configuración por atributos:
//   <div data-aa-mount data-aa-theme="light|dark" data-aa-lang="es|en"></div>
//   <script data-cfasync="false"
//     src="https://cdn.jsdelivr.net/gh/karenrebecag/ZEGM@latest/loader.js"></script>
const _v = document.querySelector<HTMLScriptElement>('script[src*="ZEGM@"]')?.src.match(/ZEGM@([^/]+)/)?.[1] ?? 'dev';
console.log(`[zegm-web] v${_v} loaded`);

import { type Theme, type Lang, type Page, PAGES } from './core/types';
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
import { renderAcerca } from './sections/acerca';
import { renderFooter } from './sections/footer';
import { initSplitText } from './ui/split-text';
import { watchLayoutShifts } from './ui/scroll-refresh';
import { initRevealGroup } from './ui/reveal-group';
import { initParallax } from './ui/parallax';
import { initCardHover } from './ui/card-hover';
import { initAccordion } from './ui/accordion';
import { initSmoothScroll, scrollToTarget } from './ui/smooth-scroll';
import { initPageTransition } from './ui/page-transition';
import { applySeo } from './ui/seo';

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
// Un valor fuera de PAGES cae a 'home' (nunca renderiza una ruta inexistente).
function resolvePage(raw: string | undefined): Page {
  const urlPage = new URLSearchParams(window.location.search).get('page');
  const value = urlPage ?? raw ?? 'home';
  return (PAGES as readonly string[]).includes(value) ? (value as Page) : 'home';
}

// El overlay del loader (dropping cards) corre SOLO en el primer mount de la sesión.
// sessionStorage → se muestra una vez por pestaña; en visitas repetidas a home dentro
// de la misma sesión el hero se renderiza sin overlay. (localStorage sería "una vez por
// usuario para siempre" — cambiar aquí si se prefiere ese comportamiento.) Si no está
// disponible (modo privado, etc.) se muestra por defecto.
function shouldPlayLoaderOverlay(): boolean {
  try {
    if (sessionStorage.getItem('aa-loader-shown')) return false;
    sessionStorage.setItem('aa-loader-shown', '1');
    return true;
  } catch {
    return true;
  }
}

// Composición del home: hero (siempre) + overlay del loader (solo primer mount) +
// secciones. Cada entrada del registro recibe (root, lang) y encadena sus renders.
function renderHome(root: HTMLElement, lang: Lang): void {
  renderLoader(root, lang, shouldPlayLoaderOverlay());
  renderAbout(root, lang);
  renderQuote(root, lang);
  renderServices(root, lang);
}

function renderAreas(root: HTMLElement, lang: Lang): void {
  renderPageHeading(root, AREAS[lang], 'areas');
  renderPracticeAreas(root, lang);
}

// Registro página → render. Reemplaza la escalera if/else: agregar una página es una
// entrada más y TypeScript exige cubrir todas las claves de Page (exhaustividad).
const PAGE_RENDERERS: Record<Page, (root: HTMLElement, lang: Lang) => void> = {
  home: renderHome,
  nosotros: renderNosotrosRows,
  areas: renderAreas,
  acerca: renderAcerca,
  contacto: renderContact,
};

function boot(): void {
  // Navegación fresca: no restaurar scroll ni honrar un #anchor de otra página en el
  // page-load — cada página monta desde el top. Así el navbar (que se muestra en el top)
  // aparece al montar en vez de quedar oculto por aterrizar scrolleado.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  // top0 siempre: quita el #anchor entrante (el nav apunta a la sección top de cada
  // página) para que el browser no salte, y resetea el scroll. Al quedar en top0 se
  // activa la regla del navbar (mostrar en el top).
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  window.scrollTo(0, 0);
  const mounts = document.querySelectorAll<HTMLElement>('[data-aa-mount]');
  mounts.forEach((mount) => {
    const theme = resolveTheme(mount.dataset.aaTheme);
    const lang = resolveLang(mount.dataset.aaLang);
    const page = resolvePage(mount.dataset.aaPage);

    // title/meta description/JSON-LD: piso mínimo mientras el host no diferencie el
    // <head> por página (las 5 páginas comparten el mismo bundle).
    applySeo(page, lang);

    // Root wrapper — todo el CSS está scopeado a .aa-landing
    const root = document.createElement('div');
    root.className = 'aa-landing';
    root.setAttribute('data-aa-theme', theme);
    root.setAttribute('data-aa-lang', lang);

    // Fase de render: el navbar y el footer son comunes; en medio, las secciones de
    // cada página resueltas por el registro (PAGE_RENDERERS).
    renderNavbar(root, lang, page);
    PAGE_RENDERERS[page](root, lang);
    renderFooter(root, lang, page);

    mount.replaceChildren(root);
    window.scrollTo(0, 0); // top garantizado antes de la fase de init (Lenis + navbar)

    // Fase de init: enganches de comportamiento/animación una vez montado el DOM.
    initSmoothScroll(); // Lenis global (idempotente); antes del anchor scroll y los reveals.
    initAnchorScroll(root);
    initPageTransition(root); // retira el enter overlay + arma el exit en links internos
    initNavbar(root);
    initNavMobile(root);
    // Loader: solo home. initLoader engancha el parallax de scroll del hero (SIEMPRE) y,
    // si existe el overlay (primer mount), reproduce la timeline dropping-cards. Import
    // dinámico → chunk aparte que las páginas cortas no descargan. Si el chunk falla,
    // retira el overlay para no dejar la página bloqueada.
    if (page === 'home') {
      import('./ui/loader')
        .then(({ initLoader }) => initLoader(root))
        .catch(() => {
          const overlay = root.querySelector<HTMLElement>('[data-aa-loader]');
          if (overlay) overlay.style.display = 'none';
        });
    }
    initSplitText(root);
    initRevealGroup(root);
    initParallax(root);
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
