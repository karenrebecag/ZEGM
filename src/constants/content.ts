// Contenido bilingüe centralizado. Cada sección lee su slice tipado por Lang.
// Patrón: COPY[lang] → objeto con los strings de esa sección. El copy real de ZEGM
// reemplaza estos placeholders; la SHAPE es lo que las secciones consumen.
import type { Lang } from '../core/types';

export interface HeroCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
}

export const HERO: Record<Lang, HeroCopy> = {
  es: {
    eyebrow: 'ZEGM',
    title: 'Título del hero',
    subtitle: 'Subtítulo descriptivo del sitio ZEGM. Reemplazar con el copy real.',
    cta: 'Empezar',
  },
  en: {
    eyebrow: 'ZEGM',
    title: 'Hero title',
    subtitle: 'Descriptive subtitle for the ZEGM site. Replace with real copy.',
    cta: 'Get started',
  },
};

// Loader (dropping cards) + cabecera hero. `lead` (top-left, sans) y `firm`
// (bottom-right, serif). La firma se guarda en caja normal y se pasa a mayúsculas
// vía CSS para preservar el acento de "Gómez".
export interface LoaderCopy {
  lead: string;
  firm: string;
  ctaAbout: string;
}

export const LOADER: Record<Lang, LoaderCopy> = {
  es: {
    lead: 'Defensa penal en delitos de cuello blanco, con experiencia en casos complejos a nivel nacional e internacional.',
    firm: 'Zinser, Esponda y Gómez Mont Abogados',
    ctaAbout: 'Sobre nosotros',
  },
  en: {
    lead: 'White-collar criminal defense, with experience in complex cases at the national and international level.',
    firm: 'Zinser, Esponda y Gómez Mont Abogados',
    ctaAbout: 'About us',
  },
};

// Navbar: cada link declara su `page` + `anchor` (id de sección). navHref() resuelve
// el href según la página actual: misma página → ancla interna (scroll suave); otra
// página → ruta + ancla. Labels en caja normal (uppercase por CSS).
export interface NavLink {
  label: string;
  page: string;
  anchor: string;
}

export const NAV: Record<Lang, NavLink[]> = {
  es: [
    { label: 'Home', page: 'home', anchor: 'inicio' },
    { label: 'Nosotros', page: 'nosotros', anchor: 'nosotros' },
    { label: 'Áreas y Experiencia', page: 'areas', anchor: 'areas' },
    { label: 'Contacto', page: 'contacto', anchor: 'contacto' },
  ],
  en: [
    { label: 'Home', page: 'home', anchor: 'inicio' },
    { label: 'About', page: 'nosotros', anchor: 'nosotros' },
    { label: 'Areas & Experience', page: 'areas', anchor: 'areas' },
    { label: 'Contact', page: 'contacto', anchor: 'contacto' },
  ],
};

// href de un navlink según la página actual. Dev/preview usa ?page=; en producción,
// pagePath se mapea a los slugs reales del host (p. ej. '/' y '/contacto').
function pagePath(page: string): string {
  return `?page=${page}`;
}

export function navHref(link: { page: string; anchor: string }, currentPage: string): string {
  return link.page === currentPage ? `#${link.anchor}` : `${pagePath(link.page)}#${link.anchor}`;
}

// Sección "Nosotros" (Relume Header 49): statement izquierda / cuerpo derecha.
// Los strings llevan <strong> inline para el bold parcial; son copy estático y de
// confianza (sin input del usuario), por eso se inyectan con innerHTML en el builder.
export interface AboutCopy {
  heading: string;
  body: string[];
}

export const ABOUT: Record<Lang, AboutCopy> = {
  es: {
    heading:
      'Despacho de abogados en México <strong>especializado</strong> en delitos de cuello blanco.',
    body: [
      'Zinser, Esponda y Gómez Mont, Abogados, es <strong>uno de los despachos más reconocidos en México</strong>, enfocado en la defensa y procesamiento de delitos de cuello blanco. Su experiencia en asuntos nacionales e internacionales lo ha posicionado como firma de referencia para instituciones financieras, corporaciones internacionales con intereses en México y personas de alto perfil.',
      'La firma cuenta con un amplio historial en la representación de instituciones y personas en casos penales complejos. <strong>Su práctica incluye asesoría y defensa en investigaciones y juicios penales relacionados con fraude fiscal, fraude bursátil, fraude bancario y delitos ambientales, entre otros.</strong>',
    ],
  },
  en: {
    heading: 'Law firm in Mexico <strong>specialized</strong> in white-collar crime.',
    body: [
      'Zinser, Esponda y Gómez Mont, Abogados, is <strong>one of the most recognized law firms in Mexico</strong>, focused on the defense and prosecution of white-collar crimes. Its experience in national and international matters has positioned it as a reference firm for financial institutions, international corporations with interests in Mexico, and high-profile individuals.',
      'The firm has an extensive track record representing institutions and individuals in complex criminal cases. <strong>Its practice includes advisory and defense in investigations and criminal trials related to tax fraud, securities fraud, bank fraud, and environmental crimes, among others.</strong>',
    ],
  },
};

// Página "Nosotros" (dedicada): heading (page-heading.ts) + el mismo contenido de
// ABOUT reusado como cuerpo (renderAbout). La descripción reusa ABOUT.heading sin el
// <strong> (texto real ya existente, no placeholder).
export const NOSOTROS: Record<Lang, PageHeadingContentCopy> = {
  es: {
    megaHeading: 'Nosotros',
    description: 'Despacho de abogados en México especializado en delitos de cuello blanco.',
  },
  en: {
    megaHeading: 'About Us',
    description: 'Law firm in Mexico specialized in white-collar crime.',
  },
};

// Cuerpo de "Nosotros" (nosotros-rows.ts). Copy real. `detail` y `quote` llevan <strong>
// inline para el bold parcial (texto de confianza → innerHTML en el builder).
export interface NosotrosBodyCopy {
  lead: string;
  detail: string;
  ctaLabel: string;
  quote: string;
  diffHeading: string;
  diffSub: string;
  diffBody: string[];
}

export const NOSOTROS_BODY: Record<Lang, NosotrosBodyCopy> = {
  es: {
    lead: 'La firma cuenta con un amplio historial en la representación de instituciones y personas en casos penales complejos.',
    detail:
      '<strong>Su práctica incluye asesoría y defensa en investigaciones y juicios penales relacionados con fraude fiscal, fraude bursátil, fraude bancario y delitos ambientales</strong>, entre otros.',
    ctaLabel: 'Contáctanos',
    quote:
      'El despacho considera que una <strong>defensa penal eficaz no exige solo conocimiento técnico, sino que también una estrategia orientada a anticipar riesgos</strong> y de esa manera proteger la reputación de sus clientes.',
    diffHeading: 'Diferenciador',
    diffSub: 'Experiencia en asuntos <strong>penales complejos y multijurisdiccionales</strong>.',
    diffBody: [
      'Zinser, Esponda y Gómez Mont, Abogados, se ha consolidado como una firma de referencia en la conducción de asuntos penales de alta complejidad, incluyendo procedimientos regulatorios simultáneos y estrategias coordinadas en distintas jurisdicciones.',
      'Su práctica destaca por el manejo de casos sensibles y de alto perfil, así como por la ejecución de estrategias legales orientadas a anticipar escenarios y controlar riesgos legales y reputacionales en contextos de alta exposición.',
    ],
  },
  en: {
    lead: 'The firm has an extensive track record representing institutions and individuals in complex criminal cases.',
    detail:
      '<strong>Its practice includes advisory and defense in investigations and criminal trials related to tax fraud, securities fraud, bank fraud, and environmental crimes</strong>, among others.',
    ctaLabel: 'Contact us',
    quote:
      'The firm believes that an <strong>effective criminal defense does not require only technical knowledge, but also a strategy aimed at anticipating risks</strong>, thereby protecting the reputation of its clients.',
    diffHeading: 'Differentiator',
    diffSub: 'Experience in <strong>complex, multi-jurisdictional criminal matters</strong>.',
    diffBody: [
      'Zinser, Esponda y Gómez Mont, Abogados, has established itself as a reference firm in handling highly complex criminal matters, including simultaneous regulatory proceedings and coordinated strategies across different jurisdictions.',
      'Its practice stands out for handling sensitive, high-profile cases, as well as for executing legal strategies aimed at anticipating scenarios and controlling legal and reputational risks in high-exposure contexts.',
    ],
  },
};

// Quote full-width (Relume Testimonial 1, sin avatar/logo). `text` lleva <strong>
// inline para el bold parcial (copy estático de confianza → innerHTML en el builder).
export interface QuoteCopy {
  text: string;
  citeName: string;
  citeRole: string;
}

export const QUOTE: Record<Lang, QuoteCopy> = {
  es: {
    text: '“Su principal diferenciador es <strong>la combinación de experiencia en casos de alta complejidad, visión estratégica y el manejo de asuntos</strong> de personas o empresas de alto perfil.”',
    citeName: 'Zinser, Esponda y Gómez Mont',
    citeRole: 'Abogados',
  },
  en: {
    text: '“Its main differentiator is <strong>the combination of experience in highly complex cases, strategic vision, and the handling of matters</strong> involving high-profile individuals or companies.”',
    citeName: 'Zinser, Esponda y Gómez Mont',
    citeRole: 'Abogados',
  },
};

// Servicios: heading full-width + grid editorial 4 slots. Los body llevan <strong>
// inline (copy estático de confianza → innerHTML en el builder).
export interface ServicesCopy {
  heading: string;
  slot2Title: string;
  slot2Body: string;
  slot2Cta: string;
  slot4Body: string;
}

export const SERVICES: Record<Lang, ServicesCopy> = {
  es: {
    heading: 'Nuestros Servicios',
    slot2Title: 'Áreas de práctica en litigio penal, compliance e investigaciones regulatorias',
    slot2Body:
      '<strong>La experiencia de la firma le permite defender acusaciones penales en casos complejos y multifacéticos,</strong> particularmente aquellos que involucran procedimientos penales, civiles y regulatorios desarrollados de forma simultánea.',
    slot2Cta: 'Saber más',
    slot4Body:
      '<strong>Su enfoque interdisciplinario</strong> permite <strong>integrar y coordinar</strong> equipos especializados, <strong>gestionar</strong> investigaciones paralelas y <strong>articular estrategias</strong> en distintas jurisdicciones.',
  },
  en: {
    heading: 'Our Services',
    slot2Title: 'Practice areas in criminal litigation, compliance and regulatory investigations',
    slot2Body:
      '<strong>The firm’s experience allows it to defend criminal charges in complex, multifaceted cases,</strong> particularly those involving criminal, civil and regulatory proceedings conducted simultaneously.',
    slot2Cta: 'Learn more',
    slot4Body:
      '<strong>Its interdisciplinary approach</strong> makes it possible to <strong>integrate and coordinate</strong> specialized teams, <strong>manage</strong> parallel investigations and <strong>articulate strategies</strong> across different jurisdictions.',
  },
};

// Footer dark: row superior (marca centrada) + 3 columnas. addressLead va en bold
// (copy estático de confianza → innerHTML). Los navlinks reusan NAV.
export interface FooterCopy {
  brand: string;
  brandSub: string;
  contactTitle: string;
  addressLead: string;
  addressLines: string[];
  phones: string;
  email: string;
  backToTop: string;
}

export const FOOTER: Record<Lang, FooterCopy> = {
  es: {
    brand: 'Zinser, Esponda y Gómez Mont',
    brandSub: 'Abogados',
    contactTitle: 'Contáctanos',
    addressLead: 'Abogados penalistas en Ciudad de México',
    addressLines: [
      'Zinser, Esponda y Gómez Mont, Abogados',
      'Sierra Nevada #156, Lomas de Chapultepec, CDMX',
    ],
    phones: '(55) 5202-8610 / 5202-2605',
    email: 'contacto@zegm.mx',
    backToTop: 'Volver arriba',
  },
  en: {
    brand: 'Zinser, Esponda y Gómez Mont',
    brandSub: 'Abogados',
    contactTitle: 'Contact us',
    addressLead: 'Criminal defense attorneys in Mexico City',
    addressLines: [
      'Zinser, Esponda y Gómez Mont, Abogados',
      'Sierra Nevada #156, Lomas de Chapultepec, CDMX',
    ],
    phones: '(55) 5202-8610 / 5202-2605',
    email: 'contacto@zegm.mx',
    backToTop: 'Back to top',
  },
};

// Página de contacto. `subheading` lleva <strong> inline (copy estático de confianza →
// innerHTML). Los valores (teléfonos/correo) van en bold, la firma también.
export interface ContactCopy {
  heading: string;
  subheading: string;
  firm: string;
  address: string;
  phonesLabel: string;
  phones: string;
  emailLabel: string;
  email: string;
  mapTitle: string;
}

export const CONTACT: Record<Lang, ContactCopy> = {
  es: {
    heading: 'Contáctanos',
    subheading:
      '<strong>Despacho penal</strong> en Ciudad de México <strong>especializado en delitos</strong> de cuello blanco.',
    firm: 'Zinser, Esponda y Gómez Mont, Abogados',
    address: 'Sierra Nevada #156, Lomas de Chapultepec, CDMX',
    phonesLabel: 'Teléfonos',
    phones: '(55) 5202-8610 / 5202-2605',
    emailLabel: 'Correo',
    email: 'contacto@zegm.mx',
    mapTitle: 'Ubicación de ZEGM Abogados',
  },
  en: {
    heading: 'Contact us',
    subheading:
      '<strong>Criminal law firm</strong> in Mexico City <strong>specialized in white-collar crimes</strong>.',
    firm: 'Zinser, Esponda y Gómez Mont, Abogados',
    address: 'Sierra Nevada #156, Lomas de Chapultepec, CDMX',
    phonesLabel: 'Phone',
    phones: '(55) 5202-8610 / 5202-2605',
    emailLabel: 'Email',
    email: 'contacto@zegm.mx',
    mapTitle: 'ZEGM Abogados location',
  },
};

// Copy de heading para páginas secundarias (page-heading.ts, navy sólido) — mega
// uppercase abajo-der + descripción sans arriba-izq (misma shape para cualquier página).
export interface PageHeadingContentCopy {
  megaHeading: string;
  description: string;
}

// Página "Áreas y Experiencia".
export const AREAS: Record<Lang, PageHeadingContentCopy> = {
  es: {
    megaHeading: 'Experiencia y Áreas',
    description: 'Áreas de práctica en litigio penal, compliance e investigaciones regulatorias.',
  },
  en: {
    megaHeading: 'Experience and Areas',
    description: 'Practice areas in criminal litigation, compliance, and regulatory investigations.',
  },
};

// Sección de dos columnas debajo del heading: columna fija (label + párrafos de
// experiencia) + columna de scroll natural (lista numerada de áreas de práctica).
export interface ExperienceCopy {
  label: string;
  paragraphs: string[];
}

export const EXPERIENCE: Record<Lang, ExperienceCopy> = {
  es: {
    label: 'Experiencia | Áreas',
    paragraphs: [
      'La experiencia de la firma le permite defender acusaciones penales de alta complejidad, especialmente en asuntos que implican la concurrencia de procedimientos penales, civiles y regulatorios.',
      'Su enfoque interdisciplinario facilita la integración y coordinación de equipos especializados, la conducción de investigaciones paralelas y el diseño de estrategias jurídicas coherentes en distintas jurisdicciones, garantizando una defensa integral con ejecución técnica precisa.',
    ],
  },
  en: {
    label: 'Experience | Areas',
    paragraphs: [
      'The firm’s experience allows it to defend criminal charges of high complexity, particularly in matters involving the concurrence of criminal, civil, and regulatory proceedings.',
      'Its interdisciplinary approach facilitates the integration and coordination of specialized teams, the conduct of parallel investigations, and the design of coherent legal strategies across different jurisdictions, ensuring a comprehensive defense with precise technical execution.',
    ],
  },
};

// Lista numerada de áreas de práctica (columna con scroll natural). `detail` es el
// contenido del dropdown ("SABER MÁS") — placeholder, no se proveyó el detalle real
// por área. Numeración 01-05, 07-08 tal cual se recibió (falta el 06, confirmar si es
// intencional o quedó fuera por error).
export interface PracticeAreaItem {
  number: string;
  title: string;
  detail: string;
}

export const PRACTICE_AREAS: Record<Lang, PracticeAreaItem[]> = {
  es: [
    {
      number: '01',
      title: 'Litigio constitucional ante la Suprema Corte de Justicia de la Nación',
      detail: 'Placeholder — reemplazar con el detalle real de esta área de práctica.',
    },
    {
      number: '02',
      title: 'Defensa penal en tribunales federales, estatales y locales',
      detail: 'Placeholder — reemplazar con el detalle real de esta área de práctica.',
    },
    {
      number: '03',
      title: 'Investigaciones ante FGR, fiscalías estatales, COFECE, CNBV, ASF y otros reguladores',
      detail: 'Placeholder — reemplazar con el detalle real de esta área de práctica.',
    },
    {
      number: '04',
      title: 'Litigio en conflictos multijurisdiccionales',
      detail: 'Placeholder — reemplazar con el detalle real de esta área de práctica.',
    },
    {
      number: '05',
      title: 'Extradición y asistencia jurídica internacional',
      detail: 'Placeholder — reemplazar con el detalle real de esta área de práctica.',
    },
    {
      number: '07',
      title: 'Compliance y anticorrupción',
      detail: 'Placeholder — reemplazar con el detalle real de esta área de práctica.',
    },
    {
      number: '08',
      title: 'Investigación y asesoría en cumplimiento y ciberseguridad',
      detail: 'Placeholder — reemplazar con el detalle real de esta área de práctica.',
    },
  ],
  en: [
    {
      number: '01',
      title: 'Constitutional litigation before the Supreme Court of Justice of the Nation',
      detail: 'Placeholder — replace with the real detail for this practice area.',
    },
    {
      number: '02',
      title: 'Criminal defense in federal, state, and local courts',
      detail: 'Placeholder — replace with the real detail for this practice area.',
    },
    {
      number: '03',
      title: 'Investigations before FGR, state prosecutors, COFECE, CNBV, ASF, and other regulators',
      detail: 'Placeholder — replace with the real detail for this practice area.',
    },
    {
      number: '04',
      title: 'Litigation in multi-jurisdictional disputes',
      detail: 'Placeholder — replace with the real detail for this practice area.',
    },
    {
      number: '05',
      title: 'Extradition and international legal assistance',
      detail: 'Placeholder — replace with the real detail for this practice area.',
    },
    {
      number: '07',
      title: 'Compliance and anti-corruption',
      detail: 'Placeholder — replace with the real detail for this practice area.',
    },
    {
      number: '08',
      title: 'Investigation and advisory on compliance and cybersecurity',
      detail: 'Placeholder — replace with the real detail for this practice area.',
    },
  ],
};
