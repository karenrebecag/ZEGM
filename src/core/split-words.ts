// Split-text por palabra, sin el plugin SplitText de GSAP (no licenciado). Primitiva
// compartida entre el reveal declarativo (ui/split-text.ts) y la cabecera del loader
// (sections/loader.ts): ambos envuelven cada palabra en <span.word><span.inner>word</span></span>
// para animar el translateY sin recortar letras adyacentes. Las clases (y un atributo
// opcional en el inner) se parametrizan por call site.

export interface SplitWordClasses {
  word: string; // span exterior con overflow:clip
  inner: string; // span interior animable
  innerAttr?: string; // atributo opcional en el inner (p. ej. data-aa-loader-word)
}

// Envuelve una palabra en <span.word><span.inner>chunk</span></span>.
function wrapChunk(chunk: string, cls: SplitWordClasses): { wrap: HTMLElement; inner: HTMLElement } {
  const wrap = document.createElement('span');
  wrap.className = cls.word;
  const inner = document.createElement('span');
  inner.className = cls.inner;
  inner.textContent = chunk;
  if (cls.innerAttr) inner.setAttribute(cls.innerAttr, '');
  wrap.append(inner);
  return { wrap, inner };
}

// Recorre `node` en el lugar: parte cada nodo de texto en palabras preservando la
// whitespace y cualquier elemento inline (<strong>, copy estático de confianza).
// Devuelve los spans interiores animables.
export function splitWordsInPlace(node: HTMLElement, cls: SplitWordClasses): HTMLElement[] {
  const words: HTMLElement[] = [];

  const walk = (parent: Node): void => {
    Array.from(parent.childNodes).forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
        return;
      }
      if (child.nodeType !== Node.TEXT_NODE) return;

      const text = child.textContent ?? '';
      const frag = document.createDocumentFragment();

      text.split(/(\s+)/).forEach((chunk) => {
        if (chunk === '') return;
        if (/^\s+$/.test(chunk)) {
          frag.append(document.createTextNode(chunk));
          return;
        }
        const { wrap, inner } = wrapChunk(chunk, cls);
        frag.append(wrap);
        words.push(inner);
      });

      parent.replaceChild(frag, child);
    });
  };

  walk(node);
  return words;
}

// Construye un fragment con el texto plano partido en palabras (separador espacio
// simple). Para headings de texto plano construidos en render.
export function splitWordsToFragment(text: string, cls: SplitWordClasses): DocumentFragment {
  const frag = document.createDocumentFragment();
  const words = text.split(' ');
  words.forEach((word, index) => {
    const { wrap } = wrapChunk(word, cls);
    frag.append(wrap);
    if (index < words.length - 1) frag.append(document.createTextNode(' '));
  });
  return frag;
}
