// title/description por página+idioma. El host (Elementor) puede no diferenciar el
// <head> por ?page=/data-aa-page (las 5 páginas comparten el mismo bundle) — src/ui/seo.ts
// los aplica en runtime como piso mínimo. No reemplaza SEO del host (canonical, OG,
// robots.txt, sitemap.xml, hreflang) — eso sigue siendo responsabilidad del CMS.
import type { Lang, Page } from '../core/types';

export interface SeoCopy {
  title: string;
  description: string;
}

export const SEO: Record<Page, Record<Lang, SeoCopy>> = {
  home: {
    es: {
      title: 'ZEGM Abogados — Defensa penal en delitos de cuello blanco',
      description:
        'Defensa penal en delitos de cuello blanco, con experiencia en casos complejos a nivel nacional e internacional.',
    },
    en: {
      title: 'ZEGM Abogados — White-Collar Criminal Defense',
      description:
        'White-collar criminal defense, with experience in complex cases at the national and international level.',
    },
  },
  nosotros: {
    es: {
      title: 'Nosotros | ZEGM Abogados',
      description:
        'Despacho de abogados en México especializado en delitos de cuello blanco, con amplio historial representando instituciones y personas en casos penales complejos.',
    },
    en: {
      title: 'About Us | ZEGM Abogados',
      description:
        'Law firm in Mexico specialized in white-collar crime, with an extensive track record representing institutions and individuals in complex criminal cases.',
    },
  },
  areas: {
    es: {
      title: 'Áreas y Experiencia | ZEGM Abogados',
      description: 'Áreas de práctica en litigio penal, compliance e investigaciones regulatorias.',
    },
    en: {
      title: 'Experience and Areas | ZEGM Abogados',
      description: 'Practice areas in criminal litigation, compliance, and regulatory investigations.',
    },
  },
  acerca: {
    es: {
      title: 'Acerca de ZEGM | ZEGM Abogados',
      description:
        'Fundada en 1992 por Alberto Zinser y Julio Esponda. Equipo de 14 abogados especializados en litigio penal en Ciudad de México.',
    },
    en: {
      title: 'About ZEGM | ZEGM Abogados',
      description:
        'Founded in 1992 by Alberto Zinser and Julio Esponda. A team of 14 attorneys specialized in criminal litigation in Mexico City.',
    },
  },
  contacto: {
    es: {
      title: 'Contacto | ZEGM Abogados',
      description:
        'Despacho penal en Ciudad de México especializado en delitos de cuello blanco. Sierra Nevada #156, Lomas de Chapultepec, CDMX.',
    },
    en: {
      title: 'Contact | ZEGM Abogados',
      description:
        'Criminal law firm in Mexico City specialized in white-collar crimes. Sierra Nevada #156, Lomas de Chapultepec, CDMX.',
    },
  },
};
