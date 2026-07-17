// ============================================================
// evuy — Constantes de presentación
//
// Existe por un motivo concreto: la escala de las barras de
// autonomía tiene que ser IDÉNTICA en toda la app. Si la landing
// escala a 500 y la ficha a 600, el mismo auto se ve con barras
// de largo distinto según la página, y el ojo saca conclusiones
// falsas comparando pestañas.
//
// Una sola fuente de verdad.
// ============================================================

/** Escala fija de las barras de autonomía, en km. Cubre el 100%
 *  del mercado uruguayo con margen. Si algún día entra un modelo
 *  de más de 600 km, se sube ACÁ y cambia en todos lados a la vez. */
export const RANGE_SCALE_KM = 600;

/** Paleta. El color codifica confianza del dato, no decora. */
export const COLORS = {
  bg: '#141619',
  surface: '#1B1E23',
  line: '#2A2E35',
  text: '#E6E8EB',
  dim: '#8A9099',
  faint: '#565C66',
  /** Medido en Uruguay, con fuente citable. */
  real: '#3DDC97',
  /** Declarado por fábrica: medición de laboratorio. */
  lab: '#E8A33D',
  /** No lo sabemos todavía. */
  gap: '#4A505A',
} as const;

export const FONTS = {
  mono: "'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace",
  sans: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif",
} as const;

/** Enums de Postgres → etiquetas legibles. */
export const LABELS: Record<string, string> = {
  suv: 'SUV', hatchback: 'Hatchback', sedan: 'Sedán', pickup: 'Pickup',
  van: 'Van', coupe: 'Coupé', wagon: 'Wagon',
  lfp: 'LFP', nmc: 'NMC', nca: 'NCA', other: '—',
  fwd: 'FWD', rwd: 'RWD', awd: 'AWD',
  type1: 'Type 1', type2: 'Type 2', ccs1: 'CCS1', ccs2: 'CCS2',
  chademo: 'CHAdeMO', gbt: 'GB/T', tesla: 'Tesla',
  lt_3m: 'En menos de 3 meses',
  '3_6m': 'Entre 3 y 6 meses',
  '6_12m': 'Entre 6 y 12 meses',
  browsing: 'Todavía estoy mirando',
};

export const label = (v: string | null | undefined): string | null =>
  v == null ? null : LABELS[v] ?? v;

export const fmtNum = (n: number | null | undefined): string | null =>
  n == null ? null : new Intl.NumberFormat('es-UY').format(n);

/** Fecha segura: new Date(null) devuelve 1/1/1970, no null. */
export const fmtDate = (d: Date | string | null | undefined): string | null =>
  d == null ? null : new Date(d).toLocaleDateString('es-UY');
