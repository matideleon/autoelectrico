// ============================================================
// evuy — Enrutador de intención del chatbot
//
// El problema que resuelve: antes, cualquier pregunta que no
// trajera presupuesto se buscaba como si fuera un nombre de auto
// (`listModels({ search: question })`). Entonces "¿cuál es el más
// barato?" buscaba la marca "cual es el mas barato", devolvía 0
// filas, y el bot respondía honestamente que no tenía datos —
// aunque la respuesta estuviera en la base.
//
// Acá detectamos qué TIPO de pregunta es y armamos la consulta
// adecuada. Cuatro tipos, más el texto libre de siempre:
//
//   AGREGADO     "cuántos modelos hay", "qué marcas manejan"
//   COMPARACION  "BYD Dolphin vs Geely EX5"
//   FILTRO       "SUV hasta 40 mil", "más de 400 km"
//   SUPERLATIVO  "el más barato", "el de mayor autonomía"
//   TEXTO        "garantía del EX5" (búsqueda por nombre, como antes)
//
// Los patrones están verificados contra casos reales antes de
// escribirse: "cuánto sale el X" (singular) es TEXTO, no AGREGADO.
// ============================================================

import { query } from '../db/client';
import type { Model } from '../db/types';

const COLS = `
  m.id, m.slug, m.brand, m.model, m.variant, m.year_from, m.body, m.status,
  m.price_usd, m.price_source, m.price_updated_at,
  m.battery_kwh, m.range_wltp_km, m.range_real_km, m.range_real_n, m.range_real_source,
  m.consumption_kwh_100,
  m.charge_ac_kw, m.charge_dc_kw, m.charge_10_80_min, m.connector_ac, m.connector_dc,
  m.power_hp, m.seats, m.trunk_l,
  m.importer, m.warranty_vehicle, m.warranty_battery,
  m.summary
`;

const PUB = `m.status = 'published'`;

function norm(s: string): string {
  let out = s.toLowerCase();
  const pares: [string, string][] = [
    ['á', 'a'], ['é', 'e'], ['í', 'i'], ['ó', 'o'], ['ú', 'u'], ['ü', 'u'],
  ];
  for (const [a, b] of pares) out = out.split(a).join(b);
  return out;
}

/* ---------- Detección de tipo ---------- */
// Orden importa: agregado y comparación son más específicos que
// superlativo, que a su vez es más específico que texto libre.
const RE_AGREGADO = /\bcuantos\b|\bcuantas\b|\bque marcas\b|\bcuales marcas\b|\btodos los modelos\b|\bque modelos hay\b/;
const RE_COMPARACION = /\bvs\b|\bversus\b|\bcompar\w+\b|\bcontra\b/;
const RE_FILTRO = /\b(suv|hatchback|sedan|sedán|pickup|van|coupe|wagon)\b|\b(hasta|menos de|maximo|por debajo de)\b.{0,15}\d/;
const RE_SUPERLATIVO = /\b(mas|menos|mayor|menor|mejor|peor)\b/;

export type Intencion = 'agregado' | 'comparacion' | 'filtro' | 'superlativo' | 'texto';

export function detectarIntencion(pregunta: string): Intencion {
  const n = norm(pregunta);
  if (RE_AGREGADO.test(n)) return 'agregado';
  if (RE_COMPARACION.test(n)) return 'comparacion';
  if (RE_FILTRO.test(n)) return 'filtro';
  if (RE_SUPERLATIVO.test(n)) return 'superlativo';
  return 'texto';
}

/* ---------- Extractores de parámetros ---------- */

/** "SUV", "hatchback"… → el enum del body en la base */
function extraerBody(n: string): string | null {
  const map: Record<string, string> = {
    suv: 'suv', hatchback: 'hatchback', sedan: 'sedan', 'sedán': 'sedan',
    pickup: 'pickup', van: 'van', coupe: 'coupe', wagon: 'wagon',
  };
  for (const [k, v] of Object.entries(map)) {
    if (new RegExp(`\\b${k}\\b`).test(n)) return v;
  }
  return null;
}

/** "hasta 40 mil", "menos de 35000" → 40000 / 35000 */
function extraerPrecioMax(n: string): number | null {
  const m = n.match(/\b(?:hasta|menos de|maximo|por debajo de)\b[^\d]{0,15}(\d[\d.]*)\s*(mil|k)?/);
  if (!m) return null;
  const base = parseInt(m[1].replace(/\./g, ''), 10);
  if (Number.isNaN(base)) return null;
  return m[2] ? base * 1000 : base;
}

/** "más de 400 km" → 400 */
function extraerRangoMin(n: string): number | null {
  const m = n.match(/\b(?:mas de|minimo|arriba de|al menos)\b[^\d]{0,15}(\d{2,4})\s*km/);
  if (!m) return null;
  const v = parseInt(m[1], 10);
  return Number.isNaN(v) ? null : v;
}

/** Qué métrica pide el superlativo, y en qué dirección gana */
function extraerMetrica(n: string): { col: string; dir: 'ASC' | 'DESC'; etiqueta: string } | null {
  // Precio
  if (/\b(barat|economic|accesible)\w*/.test(n)) return { col: 'price_usd', dir: 'ASC', etiqueta: 'más barato' };
  if (/\bcar[oa]s?\b|\bcostos\w*/.test(n)) return { col: 'price_usd', dir: 'DESC', etiqueta: 'más caro' };
  // Autonomía
  if (/\bautonomia\b|\brango\b|\bkilometr\w+\b|\bkm\b/.test(n)) {
    return { col: 'COALESCE(m.range_real_km, m.range_wltp_km)', dir: 'DESC', etiqueta: 'mayor autonomía' };
  }
  // Carga
  if (/\bcarga\b|\bcargar\b|\brapid\w+\b/.test(n)) return { col: 'charge_dc_kw', dir: 'DESC', etiqueta: 'carga más rápida' };
  // Batería
  if (/\bbateria\b|\bkwh\b/.test(n)) return { col: 'battery_kwh', dir: 'DESC', etiqueta: 'batería más grande' };
  // Potencia
  if (/\bpotencia\b|\bhp\b|\bcaball\w+\b|\bpotent\w+\b/.test(n)) return { col: 'power_hp', dir: 'DESC', etiqueta: 'más potente' };
  // Baúl
  if (/\bbaul\b|\bmaleter\w+\b|\bespacio\b/.test(n)) return { col: 'trunk_l', dir: 'DESC', etiqueta: 'baúl más grande' };
  return null;
}

/** Nombres de marca/modelo mencionados, para comparaciones */
async function extraerModelosMencionados(pregunta: string, limit = 4): Promise<Partial<Model>[]> {
  const terms = norm(pregunta)
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 3);
  if (!terms.length) return [];

  const conds = terms
    .map((_, i) => `immutable_unaccent(m.brand || ' ' || COALESCE(m.model,'') || ' ' || COALESCE(m.variant,'')) ILIKE immutable_unaccent($${i + 1})`)
    .join(' OR ');

  return query<Partial<Model>>(
    `SELECT ${COLS} FROM models m
     WHERE ${PUB} AND (${conds})
     ORDER BY m.price_usd ASC NULLS LAST
     LIMIT ${limit}`,
    terms.map((t) => `%${t}%`)
  );
}

/* ---------- Resultado ---------- */

export interface ResultadoConsulta {
  modelos: Partial<Model>[];
  /** Texto ya resuelto para agregados: el bot lo cita tal cual. */
  resumen: string | null;
  intencion: Intencion;
}

/**
 * Punto de entrada: dada una pregunta, devuelve los modelos
 * relevantes (y, para agregados, un resumen ya calculado).
 */
export async function consultarPorIntencion(pregunta: string): Promise<ResultadoConsulta> {
  const n = norm(pregunta);
  const intencion = detectarIntencion(pregunta);

  // ---- AGREGADO: contar, listar marcas ----
  if (intencion === 'agregado') {
    if (/\bmarcas\b/.test(n)) {
      const rows = await query<{ brand: string; n: string }>(
        `SELECT m.brand, COUNT(*) AS n FROM models m
         WHERE ${PUB} GROUP BY m.brand ORDER BY m.brand ASC`
      );
      const lista = rows.map((r) => `${r.brand} (${r.n})`).join(', ');
      return {
        modelos: [],
        resumen: `MARCAS EN EL CATÁLOGO (${rows.length} en total, con cantidad de modelos de cada una): ${lista}`,
        intencion,
      };
    }

    // ¿Cuántos de una marca puntual?
    const marcas = await query<{ brand: string }>(
      `SELECT DISTINCT m.brand FROM models m WHERE ${PUB}`
    );
    const marcaMencionada = marcas.find((r) => n.includes(norm(r.brand)));

    if (marcaMencionada) {
      const rows = await query<Partial<Model>>(
        `SELECT ${COLS} FROM models m
         WHERE ${PUB} AND m.brand = $1
         ORDER BY m.price_usd ASC NULLS LAST LIMIT 12`,
        [marcaMencionada.brand]
      );
      return {
        modelos: rows,
        resumen: `CONTEO: hay ${rows.length} modelos de ${marcaMencionada.brand} publicados en el catálogo.`,
        intencion,
      };
    }

    // Conteo general
    const [stats] = await query<{ total: string; con_precio: string; marcas: string }>(
      `SELECT COUNT(*) AS total,
              COUNT(*) FILTER (WHERE m.price_usd IS NOT NULL) AS con_precio,
              COUNT(DISTINCT m.brand) AS marcas
       FROM models m WHERE ${PUB}`
    );
    return {
      modelos: [],
      resumen: `CONTEO DEL CATÁLOGO: ${stats.total} modelos publicados, de ${stats.marcas} marcas distintas. ${stats.con_precio} tienen precio verificado con fuente.`,
      intencion,
    };
  }

  // ---- COMPARACION: traer los modelos nombrados ----
  if (intencion === 'comparacion') {
    const encontrados = await extraerModelosMencionados(pregunta, 4);
    return { modelos: encontrados, resumen: null, intencion };
  }

  // ---- FILTRO: body, precio máximo, autonomía mínima ----
  if (intencion === 'filtro') {
    const body = extraerBody(n);
    const precioMax = extraerPrecioMax(n);
    const rangoMin = extraerRangoMin(n);

    const conds: string[] = [PUB];
    const params: unknown[] = [];
    if (body) { params.push(body); conds.push(`m.body = $${params.length}`); }
    if (precioMax) { params.push(precioMax); conds.push(`m.price_usd <= $${params.length}`); }
    if (rangoMin) { params.push(rangoMin); conds.push(`COALESCE(m.range_real_km, m.range_wltp_km) >= $${params.length}`); }

    const rows = await query<Partial<Model>>(
      `SELECT ${COLS} FROM models m
       WHERE ${conds.join(' AND ')}
       ORDER BY m.price_usd ASC NULLS LAST
       LIMIT 8`,
      params
    );

    const criterios = [
      body ? `carrocería ${body}` : null,
      precioMax ? `hasta USD ${precioMax.toLocaleString('es-UY')}` : null,
      rangoMin ? `al menos ${rangoMin} km de autonomía` : null,
    ].filter(Boolean).join(', ');

    return {
      modelos: rows,
      resumen: rows.length
        ? `FILTRO APLICADO (${criterios}): ${rows.length} modelos coinciden. Están listados abajo.`
        : `FILTRO APLICADO (${criterios}): ningún modelo del catálogo cumple esos criterios. Decilo así, no inventes alternativas.`,
      intencion,
    };
  }

  // ---- SUPERLATIVO: el más X ----
  if (intencion === 'superlativo') {
    const metrica = extraerMetrica(n);
    if (metrica) {
      const rows = await query<Partial<Model>>(
        `SELECT ${COLS} FROM models m
         WHERE ${PUB} AND ${metrica.col} IS NOT NULL
         ORDER BY ${metrica.col} ${metrica.dir}
         LIMIT 5`
      );
      return {
        modelos: rows,
        resumen: rows.length
          ? `RANKING por ${metrica.etiqueta}: los modelos de abajo vienen ORDENADOS, el primero es el que gana. Solo se consideran los que tienen ese dato cargado — puede haber otros sin medir todavía.`
          : `No hay ningún modelo con ese dato cargado todavía. Decilo así.`,
        intencion,
      };
    }
    // Superlativo sin métrica clara: caemos a texto libre
  }

  // ---- TEXTO: búsqueda por nombre, como antes ----
  const encontrados = await extraerModelosMencionados(pregunta, 3);
  return { modelos: encontrados, resumen: null, intencion: 'texto' };
}
