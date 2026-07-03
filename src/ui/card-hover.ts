// Hover-comb con falloff (transitions-dev #11 "avatar group hover"), sin GSAP: al pasar
// el mouse sobre un [data-t-avatar] dentro de un [data-t-avatar-group], levanta ese
// elemento y sus vecinos con caída exponencial, y los devuelve con un spring al salir.
// El timing-function se fija inline ANTES de escribir las variables — así hover-in usa
// la curva de entrada y mouseleave la de rebote, sin duplicar la transición en CSS.
function num(cs: CSSStyleDeclaration, name: string, fallback: number): number {
  const value = parseFloat(cs.getPropertyValue(name));
  return Number.isFinite(value) ? value : fallback;
}

function ease(cs: CSSStyleDeclaration, name: string, fallback: string): string {
  return cs.getPropertyValue(name).trim() || fallback;
}

export function initCardHover(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('.t-avatar-group').forEach((group) => {
    const items = Array.from(group.querySelectorAll<HTMLElement>('.t-avatar'));
    if (!items.length) return;

    const cs = getComputedStyle(document.documentElement);

    const setShifts = (activeIndex: number | null, phase: 'in' | 'out'): void => {
      const lift = num(cs, '--avatar-lift', -4);
      const falloff = num(cs, '--avatar-falloff', 0.45);
      const scale = num(cs, '--avatar-scale', 1.05);
      const timingFn =
        phase === 'out'
          ? ease(cs, '--avatar-ease-out', 'cubic-bezier(0.34, 3.85, 0.64, 1)')
          : ease(cs, '--avatar-ease-in', 'cubic-bezier(0.22, 1, 0.36, 1)');

      items.forEach((el, index) => {
        el.style.transitionTimingFunction = timingFn;
        if (activeIndex === null) {
          el.style.setProperty('--shift', '0px');
          el.style.setProperty('--scale-active', '1');
          return;
        }
        const distance = Math.abs(index - activeIndex);
        el.style.setProperty('--shift', `${(lift * falloff ** distance).toFixed(3)}px`);
        el.style.setProperty('--scale-active', index === activeIndex ? String(scale) : '1');
      });
    };

    items.forEach((el, index) => {
      el.addEventListener('mouseenter', () => setShifts(index, 'in'));
    });
    group.addEventListener('mouseleave', () => setShifts(null, 'out'));
  });
}
