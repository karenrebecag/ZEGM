// Timeline del loader "Dropping Cards" (portado 1:1 de Osmo). GSAP central + CustomEase.
// Ajustes de tuning (scaleDecrease, patrones de caída…) se conservan del original.
import { gsap, prefersReducedMotion } from './gsap-env';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);
// Ease de Osmo — equivale a nuestro token --aa-ease cubic-bezier(0.625,0.05,0,1).
CustomEase.create('aa-loader-ease', 'M0,0 C0.625,0.05 0,1 1,1');

export function initLoader(root: HTMLElement): void {
  const container = root.querySelector<HTMLElement>('[data-aa-loader]');
  if (!container) return;
  const header = root.querySelector<HTMLElement>('[data-aa-loader-header]');

  // Al terminar (o sin animación): retira el overlay, libera el scroll y suelta las
  // capas de compositor (will-change permanente en imágenes grandes consume memoria GPU).
  const finish = (): void => {
    container.classList.remove('is--active');
    container.style.display = 'none';
    container.querySelectorAll<HTMLElement>('[data-aa-loader-card], [data-aa-loader-bg]').forEach((n) => {
      n.style.willChange = 'auto';
    });
  };

  if (prefersReducedMotion) {
    finish();
    return;
  }

  const build = (): void => {
  const cardsList = gsap.utils.toArray<HTMLElement>(container.querySelectorAll('[data-aa-loader-list]'));
  const cards = gsap.utils.toArray<HTMLElement>(container.querySelectorAll('[data-aa-loader-card]'));
  const background = container.querySelectorAll('[data-aa-loader-bg]');
  const logo = container.querySelectorAll('[data-aa-loader-logo]');
  const headers = header ? [header] : [];
  const words = header ? gsap.utils.toArray<HTMLElement>(header.querySelectorAll('[data-aa-loader-word]')) : [];
  const bgImage = header?.querySelector<HTMLElement>('.aa-loader__cover.is--bg') ?? null;

  const scaleDecrease = 0.1; // diferencia de escala entre cartas del stack
  const yOffset = -7.5; // separación vertical entre cartas apiladas
  const totalFallStagger = 0.75; // tiempo total entre la 1ª y la última carta que cae
  const deckMoveDuration = 1; // duración del avance del deck restante
  const rotationPattern = [-10, 10, -15, 10, 20];
  const xPattern = [-5, 7.5, 10, 5, -10];

  const has = (items: ArrayLike<unknown>): number => items.length;
  const patternValue = (pattern: number[], index: number): number => pattern[index % pattern.length];

  const getStack = (index: number, total: number): { scale: number; yPercent: number } => {
    const reverseIndex = total - 1 - index;
    return { scale: 1 - reverseIndex * scaleDecrease, yPercent: reverseIndex * yOffset };
  };
  const stackProp = (prop: 'scale' | 'yPercent', total: number) => (index: number): number =>
    getStack(index, total)[prop];

  const getFallY = (card: HTMLElement): number => {
    const containerRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    return containerRect.bottom - cardRect.top + cardRect.height;
  };

  // Acorta la duración total del loader SIN alterar las proporciones: timeScale escala
  // uniformemente cada duración/stagger/offset del timeline (1.5 = ~33% más corto). El
  // parallax de la cabecera es un tween aparte (ScrollTrigger), no lo afecta.
  const tl = gsap.timeline({ onComplete: finish });
  tl.timeScale(1.5);

  if (has(cardsList)) {
    tl.fromTo(cardsList, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.5);
  }

  if (has(cards)) {
    tl.fromTo(
      cards,
      { rotate: 0.001, scale: 0.5, yPercent: 0 },
      {
        rotate: 0.001,
        scale: stackProp('scale', cards.length),
        yPercent: stackProp('yPercent', cards.length),
        stagger: -0.05,
        duration: 1.5,
        ease: 'elastic.out(1,0.7)',
      },
      '<',
    );

    const fallCards = cards.slice().reverse();
    const fallStagger = totalFallStagger / Math.max(cards.length - 1, 1);
    const fallStart = tl.duration();

    fallCards.forEach((card, fallIndex) => {
      const remainingCards = cards.slice(0, cards.indexOf(card));
      const fallTime = fallStart + fallIndex * fallStagger;

      if (has(remainingCards)) {
        tl.to(
          remainingCards,
          {
            scale: stackProp('scale', remainingCards.length),
            yPercent: stackProp('yPercent', remainingCards.length),
            duration: deckMoveDuration,
            ease: 'sine.inOut',
          },
          fallTime,
        );
      }

      tl.to(
        card,
        {
          y: () => getFallY(card),
          xPercent: patternValue(xPattern, fallIndex),
          rotate: patternValue(rotationPattern, fallIndex),
          duration: 0.8,
          ease: 'power4.in',
        },
        fallTime,
      );
    });
  }

  if (has(background)) {
    tl.to(background, { rotate: 0.001, yPercent: 100, duration: 1.5, ease: 'aa-loader-ease' }, '-=0.6');
  }

  if (has(headers)) {
    tl.from(headers, { rotate: 0.001, yPercent: -25, scale: 1.1, duration: 1.5, ease: 'aa-loader-ease' }, '<');
  }

  if (has(words)) {
    // Cascada de palabras del lead/firma, un poco después de que la cabecera empieza a asentarse.
    tl.from(words, { yPercent: 100, duration: 0.6, ease: 'power3.out', stagger: 0.025 }, '<+=0.4');
  }

  if (has(logo)) {
    tl.to(logo, { rotate: 0.001, yPercent: 100, opacity: 0, duration: 0.8, ease: 'power4.in' }, '<-=1.5');
  }

  // Parallax de scroll sobre la imagen de fondo de la cabecera. La cabecera es la
  // PRIMERA sección (ocupa el viewport entero al cargar) — 'top top' → 'bottom top' es
  // el rango correcto para eso (no 'top bottom', pensado para secciones que entran
  // desde abajo; con esa la mitad del recorrido ya estaba "consumida" antes de scrollear).
  // clamp(): evita un offset inválido si el layout aún no asienta. La imagen mide 130%
  // de alto anclada arriba (ver loader.css), con sobra de sobra para el recorrido.
  if (bgImage) {
    gsap.fromTo(
      bgImage,
      { y: 0 },
      {
        y: 150,
        ease: 'none',
        scrollTrigger: {
          trigger: header,
          start: 'clamp(top top)',
          end: 'clamp(bottom top)',
          scrub: true,
        },
      },
    );
  }
  };

  // Espera a que las imágenes del deck decodifiquen ANTES de arrancar la timeline: si no,
  // el elastic.out corre mientras el navegador decodifica 5 WebP grandes en el hilo
  // principal → stutter al inicio. decode() degrada a un timeout corto para no dejar el
  // overlay colgado si una imagen falla.
  const deckImages = gsap.utils.toArray<HTMLImageElement>(
    container.querySelectorAll('[data-aa-loader-card] img'),
  );
  const ready = Promise.race([
    Promise.all(deckImages.map((img) => img.decode().catch(() => undefined))),
    new Promise((resolve) => setTimeout(resolve, 600)),
  ]);
  void ready.then(() => build());
}
