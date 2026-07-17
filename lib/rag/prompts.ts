// ============================================================
// evuy — Prompts
//
// El activo del negocio es que el dato sea confiable. Un bot que
// inventa una autonomía sobre un auto de USD 40.000 destruye en
// una respuesta lo que costó meses construir.
//
// Regla rectora: si no está en el contexto, no se dice. Y se
// admite no saber, que es una respuesta perfectamente válida.
// ============================================================

import type { RetrievedChunk } from './retrieve';
import type { Model } from '../db/types';

export const SYSTEM_BASE = `Sos el asistente de evuy, la plataforma de movilidad eléctrica de Uruguay.

Hablás en español rioplatense: usás "vos" en lugar de "tú", "podés" en lugar de "puedes". Tono directo y claro, sin solemnidad y sin vender.

REGLAS SOBRE DATOS — no negociables:

1. Solo afirmás datos que estén en el CONTEXTO que recibís. Nada de memoria propia sobre modelos, precios o especificaciones.
2. Si el dato no está en el contexto, decís que no lo tenés y sugerís consultar al concesionario. "No lo sé" es una respuesta correcta.
3. Cada dato técnico se cita con su fuente: [1], [2], según el número del contexto.
4. NUNCA estimás, redondeás ni completás un dato faltante. Si el contexto dice que la autonomía real no está medida, decís exactamente eso.
5. Distinguís siempre autonomía WLTP (medición oficial de laboratorio) de autonomía real (medida por usuarios). Si citás WLTP, aclarás que en uso real suele ser menor.
6. Los precios cambian: cuando des uno, mencionás la fecha de actualización que figure en el contexto.
7. Si dos fuentes del contexto se contradicen, lo decís en vez de elegir una.

SOBRE TU ROL:

- No sos vendedor. No presionás ni exagerás. Si un auto no le sirve a la persona, se lo decís.
- Podés comparar modelos con objetividad, incluyendo lo malo de cada uno.
- Si preguntan algo fuera de movilidad eléctrica en Uruguay, redirigís con amabilidad.
- Respuestas breves. La gente lee en el celular.`;

export const SYSTEM_ADVISOR = `${SYSTEM_BASE}

MODO ASESOR:

La persona está evaluando una compra. Tu trabajo es ayudarla a decidir bien, no a comprar.

Para recomendar necesitás saber:
- Presupuesto
- Uso principal (ciudad, ruta, mixto)
- Si tiene dónde cargar en casa (esto define si un eléctrico le sirve o no)
- Cuántas personas viajan habitualmente

Preguntá lo que falte, de a una cosa por vez. No interrogues.

Cuando recomiendes, usás solo modelos del contexto. Para cada uno: por qué le sirve, y qué punto débil tiene. Siempre los dos.

Si por presupuesto o por falta de carga domiciliaria un eléctrico no le conviene, decilo.`;

export interface PromptContext {
  chunks: RetrievedChunk[];
  models: Partial<Model>[];
}

/**
 * Serializa un modelo para el contexto. Los NULL se marcan
 * explícitamente: así el bot sabe que el dato falta y puede
 * decirlo, en vez de completarlo de su memoria.
 */
function formatModel(m: Partial<Model>, idx: number): string {
  const lines: string[] = [`[M${idx}] ${m.brand} ${m.model}${m.variant ? ' ' + m.variant : ''}`];

  const field = (label: string, value: unknown, unit = '') => {
    if (value === null || value === undefined) {
      lines.push(`  ${label}: DATO NO DISPONIBLE`);
    } else {
      lines.push(`  ${label}: ${value}${unit}`);
    }
  };

  if (m.price_usd != null) {
    const when = m.price_updated_at
      ? new Date(m.price_updated_at).toLocaleDateString('es-UY')
      : 'sin fecha';
    lines.push(`  Precio: USD ${m.price_usd} (actualizado ${when})`);
  } else {
    lines.push('  Precio: DATO NO DISPONIBLE');
  }

  field('Batería', m.battery_kwh, ' kWh');
  field('Autonomía WLTP (laboratorio)', m.range_wltp_km, ' km');

  if (m.range_real_km != null) {
    const n = m.range_real_n ? ` sobre ${m.range_real_n} mediciones` : '';
    lines.push(`  Autonomía REAL (medida por usuarios): ${m.range_real_km} km${n}`);
    if (m.range_real_source) lines.push(`    fuente: ${m.range_real_source}`);
  } else {
    lines.push('  Autonomía REAL: TODAVÍA NO MEDIDA — no la estimes');
  }

  field('Carga AC', m.charge_ac_kw, ' kW');
  field('Carga DC', m.charge_dc_kw, ' kW');
  field('Conector DC', m.connector_dc);
  field('Potencia', m.power_hp, ' HP');
  field('Plazas', m.seats);
  field('Garantía batería', m.warranty_battery);
  field('Importador en Uruguay', m.importer);

  if (m.summary) lines.push(`  Resumen: ${m.summary}`);

  return lines.join('\n');
}

export function buildContext(ctx: PromptContext): string {
  const parts: string[] = [];

  if (ctx.models.length) {
    parts.push(
      '=== FICHAS DE MODELOS ===\n' +
      ctx.models.map((m, i) => formatModel(m, i + 1)).join('\n\n')
    );
  }

  if (ctx.chunks.length) {
    parts.push(
      '=== EXTRACTOS DE MANUALES ===\n' +
      ctx.chunks
        .map((c, i) => {
          const cite = c.page ? `${c.docTitle}, pág. ${c.page}` : c.docTitle;
          return `[${i + 1}] (${cite})\n${c.content}`;
        })
        .join('\n\n---\n\n')
    );
  }

  if (!parts.length) {
    return '=== CONTEXTO VACÍO ===\nNo se encontró información relevante. Decile a la persona que no tenés ese dato y ofrecé ayudarla con otra cosa. NO respondas de memoria.';
  }

  return parts.join('\n\n');
}

/** Detecta si conviene el modo asesor (flujo "tengo USD X"). */
export function looksLikeBuyingIntent(text: string): boolean {
  const t = text.toLowerCase();
  return (
    /\b(tengo|presupuesto|dispongo|cuento con)\b.*\b(usd|u\$s|dolares|dólares|mil)\b/.test(t) ||
    /\b(qué|que|cual|cuál)\b.*\b(me conviene|recomend|comprar|elegir)\b/.test(t) ||
    /\bestoy (buscando|pensando|por comprar)\b/.test(t)
  );
}

/** Extrae un presupuesto en USD del texto libre. */
export function extractBudget(text: string): number | null {
  const t = text.toLowerCase().replace(/\./g, '').replace(/,/g, '');

  // "38 mil", "38mil"
  const mil = t.match(/(\d{1,3})\s*mil\b/);
  if (mil) return parseInt(mil[1], 10) * 1000;

  // "usd 38000", "38000 dolares", "u$s38000"
  const explicit = t.match(/(?:usd|u\$s|d[oó]lares?)\s*(\d{4,7})|(\d{4,7})\s*(?:usd|u\$s|d[oó]lares?)/);
  if (explicit) return parseInt(explicit[1] ?? explicit[2], 10);

  // Número suelto en rango plausible de auto
  const bare = t.match(/\b(\d{5,6})\b/);
  if (bare) {
    const n = parseInt(bare[1], 10);
    if (n >= 10000 && n <= 300000) return n;
  }

  return null;
}
