// ============================================================
// autoelectrico.uy — Patente
//
// Un solo lugar para las tasas y el tipo de cambio. Lo usan la
// ficha de modelo (/modelos/[slug]) y el simulador (/ahorro):
// si los números viven en dos archivos, tarde o temprano dicen
// cosas distintas en la misma web.
//
// La patente se paga sobre el valor del vehículo SIN IVA, así
// que al precio de venta hay que sacarle el 22% antes de
// aplicar la tasa. Los eléctricos tributan al 3%; los de
// combustión, al 5%.
//
// Las tasas y los aforos los fija cada intendencia y cambian
// todos los años: esto es una estimación, no la boleta.
// ============================================================

export const IVA = 1.22;
export const TASA_PATENTE_EV = 0.03;
export const TASA_PATENTE_COMBUSTION = 0.05;

/** Pesos por dólar. Actualizar acá y cambia en toda la web. */
export const TIPO_CAMBIO = 40.5;

/** Mes/año del tipo de cambio de arriba, para mostrarlo con fecha. */
export const TIPO_CAMBIO_FECHA = 'jul 2026';

/**
 * Patente anual en pesos uruguayos.
 * Devuelve null si no hay precio: preferimos el hueco al invento.
 */
export function patenteAnualUyu(
  precioUsd: number | null | undefined,
  tasa: number = TASA_PATENTE_EV,
  tipoCambio: number = TIPO_CAMBIO
): number | null {
  if (precioUsd == null || !(precioUsd > 0)) return null;
  return (precioUsd / IVA) * tasa * tipoCambio;
}

/** Patente anual en dólares, sin depender del tipo de cambio. */
export function patenteAnualUsd(
  precioUsd: number | null | undefined,
  tasa: number = TASA_PATENTE_EV
): number | null {
  if (precioUsd == null || !(precioUsd > 0)) return null;
  return (precioUsd / IVA) * tasa;
}
