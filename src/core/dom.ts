export const $ = <T extends Element = Element>(s: string, r: ParentNode = document): T | null =>
  r.querySelector<T>(s);

export const $$ = <T extends Element = Element>(s: string, r: ParentNode = document): T[] =>
  Array.from(r.querySelectorAll<T>(s));

export const has = (s: string, r: ParentNode = document): boolean => !!$(s, r);

// Crea un elemento con clase y atributos en una sola llamada (reduce boilerplate DOM).
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  attrs?: Record<string, string>,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (attrs) for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
}
