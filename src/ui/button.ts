// Botón animado (portado de Osmo "Button 041"). El split de caracteres se hace en
// render (cada char con su índice --char) → la animación de hover es 100% CSS, sin
// SplitText/GSAP ni init en runtime. Variantes: primary | secondary | tertiary.
import { el } from '../core/dom';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

interface ButtonOptions {
  variant?: ButtonVariant;
  href?: string;
}

// Capa de texto (default o hover): cada letra en un <span.aa-btn__char> con --char
// para el stagger. Espacios → nbsp (los inline-block colapsarían un espacio normal).
function buildText(label: string, hover: boolean): HTMLSpanElement {
  const text = el('span', `aa-btn__text ${hover ? 'is--hover' : 'is--default'}`);
  if (hover) text.setAttribute('aria-hidden', 'true');
  Array.from(label).forEach((ch, i) => {
    const char = el('span', 'aa-btn__char');
    char.style.setProperty('--char', String(i + 1));
    char.textContent = ch === ' ' ? ' ' : ch;
    text.append(char);
  });
  return text;
}

export function renderButton(label: string, options: ButtonOptions = {}): HTMLAnchorElement {
  const { variant = 'primary', href = '#' } = options;
  const btn = el('a', `aa-btn aa-btn--${variant}`, { href });
  const bg = el('span', 'aa-btn__bg');
  const inner = el('span', 'aa-btn__inner');
  inner.append(buildText(label, false), buildText(label, true));
  btn.append(bg, inner);
  return btn;
}
