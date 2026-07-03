// Dropdown genérico por atributos (portado del accordion de FAQ del template ATFX):
// [data-aa-accordion-toggle] alterna [data-open] en su [data-aa-accordion-item] más
// cercano. Single-open dentro del mismo contenedor padre. La animación (grid-template-rows
// 0fr → 1fr) es CSS puro — acá solo se gestiona el estado.
export function initAccordion(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('[data-aa-accordion-toggle]').forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault(); // el toggle puede ser un <a> (renderButton) — no navega, solo abre/cierra
      const item = toggle.closest<HTMLElement>('[data-aa-accordion-item]');
      if (!item) return;
      const isOpen = item.hasAttribute('data-open');

      item.parentElement?.querySelectorAll<HTMLElement>('[data-aa-accordion-item][data-open]').forEach((other) => {
        if (other === item) return;
        other.removeAttribute('data-open');
        other.querySelector('[data-aa-accordion-toggle]')?.setAttribute('aria-expanded', 'false');
      });

      if (isOpen) {
        item.removeAttribute('data-open');
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        item.setAttribute('data-open', '');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });
}
