export type Theme = 'light' | 'dark';
export type Lang = 'es' | 'en';

// Páginas del sitio. La ruta se resuelve contra estas claves (?page= o data-aa-page);
// un valor desconocido cae a 'home'. El registro de render vive en index.ts.
export type Page = 'home' | 'nosotros' | 'areas' | 'acerca' | 'contacto';
export const PAGES: readonly Page[] = ['home', 'nosotros', 'areas', 'acerca', 'contacto'];

export interface LandingConfig {
  theme: Theme;
  lang: Lang;
}

export interface MountAttrs {
  theme: Theme;
  lang: Lang;
}
