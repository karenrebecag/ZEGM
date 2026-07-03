// Mapbox GL en el mount point: mapa personalizable (style/markers/controles) por JS.
// La lib se carga del CDN de Mapbox (no se bundlea: es pesada y dep-install está
// bloqueado). El token público (pk.) llega por atributo del mount → nunca vive en
// el repo/bundle; su protección real es la URL restriction en el dashboard de Mapbox.

interface StyleLayer {
  id: string;
  type: string;
}
interface MapboxMap {
  addControl(control: unknown, position?: string): void;
  on(type: string, listener: () => void): void;
  getStyle(): { layers?: StyleLayer[] };
  setPaintProperty(layer: string, name: string, value: unknown): void;
}
interface MapboxMarker {
  setLngLat(coords: [number, number]): { addTo(map: MapboxMap): MapboxMarker };
}
interface MapboxNs {
  accessToken: string;
  Map: new (options: Record<string, unknown>) => MapboxMap;
  Marker: new (options?: Record<string, unknown>) => MapboxMarker;
  NavigationControl: new (options?: Record<string, unknown>) => unknown;
}
declare global {
  interface Window {
    mapboxgl?: MapboxNs;
  }
}

const MAPBOX_VERSION = 'v3.9.3';
const DEFAULT_STYLE = 'mapbox://styles/mapbox/dark-v11';
const MARKER_COLOR = '#112a3c'; // navy de marca

// Paleta navy para recolorear el estilo por defecto (dark-v11). Roads (line) y labels
// (symbol) se dejan como están para conservar legibilidad.
const NAVY = { land: '#182a3b', water: '#0e2233', building: '#182d3d' };

// Recolorea tierra/agua/edificios a navy vía setPaintProperty (mapa "personalizado
// dentro", sin filtro CSS). Solo corre sobre el estilo default; un estilo propio de
// Studio ya viene con su color y no se toca.
function tintNavy(map: MapboxMap): void {
  const layers = map.getStyle().layers ?? [];
  for (const { id, type } of layers) {
    const water = /water/i.test(id);
    if (type === 'background') {
      map.setPaintProperty(id, 'background-color', NAVY.land);
    } else if (type === 'fill') {
      map.setPaintProperty(id, 'fill-color', water ? NAVY.water : NAVY.land);
    } else if (type === 'fill-extrusion') {
      map.setPaintProperty(id, 'fill-extrusion-color', NAVY.building);
    }
  }
}

// Inyecta CSS + JS de Mapbox desde el CDN una sola vez; resuelve con el namespace.
function loadMapbox(): Promise<MapboxNs> {
  if (window.mapboxgl) return Promise.resolve(window.mapboxgl);

  if (!document.querySelector('link[data-aa-mapbox]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://api.mapbox.com/mapbox-gl-js/${MAPBOX_VERSION}/mapbox-gl.css`;
    link.setAttribute('data-aa-mapbox', '');
    document.head.append(link);
  }

  return new Promise((resolve, reject) => {
    const done = (): void =>
      window.mapboxgl ? resolve(window.mapboxgl) : reject(new Error('mapbox-gl no cargó'));
    const existing = document.querySelector<HTMLScriptElement>('script[data-aa-mapbox]');
    if (existing) {
      existing.addEventListener('load', done);
      existing.addEventListener('error', () => reject(new Error('mapbox-gl script error')));
      return;
    }
    const script = document.createElement('script');
    script.src = `https://api.mapbox.com/mapbox-gl-js/${MAPBOX_VERSION}/mapbox-gl.js`;
    script.setAttribute('data-aa-mapbox', '');
    script.addEventListener('load', done);
    script.addEventListener('error', () => reject(new Error('mapbox-gl script error')));
    document.head.append(script);
  });
}

export function initMapbox(root: HTMLElement, token: string | undefined): void {
  const container = root.querySelector<HTMLElement>('[data-aa-map]');
  if (!container) return; // esta página no tiene mapa
  if (!token) {
    // Sin token: degradar en silencio (no romper la página).
    console.warn('[zegm-web] Mapbox: falta el token (data-aa-mapbox-token / ?mbtoken=).');
    return;
  }

  const lat = Number(container.dataset.aaMapLat ?? '19.4265737');
  const lng = Number(container.dataset.aaMapLng ?? '-99.2075335');
  const zoom = Number(container.dataset.aaMapZoom ?? '15');
  const style = container.dataset.aaMapStyle ?? DEFAULT_STYLE;

  loadMapbox()
    .then((mapboxgl) => {
      mapboxgl.accessToken = token;
      const map = new mapboxgl.Map({
        container,
        style,
        center: [lng, lat],
        zoom,
        cooperativeGestures: true, // ctrl/cmd + scroll para zoom: no secuestra la página
      });
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
      new mapboxgl.Marker({ color: MARKER_COLOR }).setLngLat([lng, lat]).addTo(map);
      // Tinte navy por código solo sobre el estilo default (no pisa un estilo de Studio).
      if (style === DEFAULT_STYLE) map.on('load', () => tintNavy(map));
    })
    .catch((err) => {
      console.warn('[zegm-web] Mapbox no disponible:', err);
    });
}
