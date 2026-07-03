// Assets servidos desde el bucket público R2 de ZEGM. Los <img>/background CSS no
// requieren CORS (a diferencia de las fuentes, que van self-hosted en dist/fonts).
// asset() URL-encodea la key (maneja espacios y '+' en los nombres de archivo).

const R2_BASE = 'https://pub-689bd7bf1ef94ab08b150945eac861e5.r2.dev';

const asset = (key: string): string => `${R2_BASE}/${encodeURIComponent(key)}`;

// ─── Logos (SVG) ────────────────────────────────────────────────────────────────
export const LOGOS = {
  // Wordmark completo con isotipo (navy #112a3c sobre claro).
  full: asset('ZEGM_web.svg'),
  // Wordmark ZEGM.
  wordmark: asset('ZEGM_web_Logo.svg'),
  // Versión de reducción (favicon / espacios chicos).
  mark: asset('ZEGM_web_logoReduccion-07.svg'),
} as const;

// ─── Hero ──────────────────────────────────────────────────────────────────────────
export const HERO = {
  main: asset('Hero_ZEGM_image_6a861a4e48e87339f8b85417f4fd1010f9c9ac601e173f49542492f2b65c807c.webp'),
} as const;

// ─── Personas / speakers ─────────────────────────────────────────────────────────
export const SPEAKERS = {
  hernandez: asset('A Hernandez_5317d7d31def422c9283507dc29a61b51227f6e706f4a8bbe377f978e0b7156a.webp'),
  alan: asset('Alan P_6501a658ad18f3bf9bb1975a751e76b19a9e4fb7225743e0e2a75b592a022a0a.webp'),
  gomezmont: asset('GomezMont+_cd611bfd6d65fe118b46eac6e0c2aeea0f61eb2769b6acc59ebf96db261aad31.webp'),
  gonzalo: asset('Gonzalo_80330cab7c4fe8e28dd47683262ba9b566a138edf16504d16a8e3edabd69d134.webp'),
  zinzer: asset('Zinzer_8e29c4a229524993b98b296dc742b4be1d25e5aa3cbdae9ac95f031543275ebe.webp'),
} as const;

// ─── Fotos de evento / galería ────────────────────────────────────────────────────
export const GALLERY = {
  acs5950: asset('_ACS5950_9a81fca31645c5ee7b0a24d948fa0565b8ce2e6bfb1ec7a0ad5d3cae58ae5640.webp'),
  i6a6149: asset('_I6A6149_182a2824b65c75606597fbc9428a4282c8a9ff6f0f2a9c2fef7871d4a657b04e.webp'),
} as const;

// ─── Stock ────────────────────────────────────────────────────────────────────────
export const STOCK = {
  lawyers: asset('asian-business-and-lawyers-discussing-contract-pap-2026-01-09-11-16-18-utc_3e5a7ca6c2ed7db8e5e711bfb688c9acd7998bad8fa4300f07d4f6859b442638.webp'),
  nilov: asset('pexels-mikhail-nilov-8729809_325405c13d828c9f5e4c138d150e0ee8ceceb2a93767bbf367643096a68c31f7.webp'),
} as const;
