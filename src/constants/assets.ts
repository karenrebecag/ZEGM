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
  alan: asset('assdadsad_363ce7cd22a1a34d029d2efe2b1d13f6574e603bece09974df33fa17bbc7915c.webp'),
  gomezmont: asset('GomezMont+_cd611bfd6d65fe118b46eac6e0c2aeea0f61eb2769b6acc59ebf96db261aad31.webp'),
  gonzalo: asset('adsdsa1_f8c2f6bcd9364fbf8c614fc20f6c950726a6d28df6dad9ebc8698146589b6e63.webp'),
  zinzer: asset('Zinzer_8e29c4a229524993b98b296dc742b4be1d25e5aa3cbdae9ac95f031543275ebe.webp'),
} as const;

// ─── Fotos de evento / galería ────────────────────────────────────────────────────
export const GALLERY = {
  acs5950: asset('_ACS5950_9a81fca31645c5ee7b0a24d948fa0565b8ce2e6bfb1ec7a0ad5d3cae58ae5640.webp'),
  i6a6149: asset('asdasda2_da4ae29c0e9234fbc5f4104384e2946b1776906fef1215674278ae19af7ef974.webp'),
  acs5950Row3: asset('asdadsas5_7bdbc4ad56460aee6b4ffdbc1f502bdd9c98cfd2a171ab9455add94f9b260a6a.webp'),
  i6a6149Row3: asset('asdasdsadassda6_b1bf04ca9900c40f7cd857ab82b10a44e9fd21d709d810f0e99c1be7a623b28e.webp'),
} as const;

// ─── Stock ────────────────────────────────────────────────────────────────────────
export const STOCK = {
  lawyers: asset('asfdsadasdsa3_56ea3002a05f98c102521746df176a5ac2539160a1596a42aab8157b2db0f84f.webp'),
  lawyersRow1: asset('adssad1sads_150d820a8c024db7bbd3dbae87c03f89a59782b9759291717fc1c576c02e141c.webp'),
  nilov: asset('pexels-mikhail-nilov-8729809_325405c13d828c9f5e4c138d150e0ee8ceceb2a93767bbf367643096a68c31f7.webp'),
  nilovRow2: asset('asdasdasasad2_3788ce0ffcc91a23fc4883c9d3fc9c90c04905278dcd022da9cb66fc85a16673.webp'),
  nilovRow3: asset('asdsafsadfsafsa4_b6537764ce0d4089c6c5dfbff8789768ee66e13f6239bef31bb4332e0fdeed44.webp'),
} as const;
