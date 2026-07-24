// ============================================================
// evuy — models
// El catálogo canónico. Lectura pública (solo published),
// escritura solo admin.
// ============================================================

import { query, queryOne, WhereBuilder } from './client';
import { modelVisibility, requireAdmin, NotFoundError } from './auth';
import type { Actor, Model, ModelFilters } from './types';
import { TIER1_REQUIRED } from './types';

const LIST_COLS = `
  m.id, m.slug, m.brand, m.model, m.variant, m.year_from, m.body, m.status,
  m.price_usd, m.price_source, m.price_updated_at,
  m.battery_kwh, m.range_wltp_km, m.range_real_km, m.range_real_n, m.range_real_source,
  m.consumption_kwh_100,
  m.charge_ac_kw, m.charge_dc_kw, m.charge_10_80_min, m.connector_ac, m.connector_dc,
  m.power_hp, m.seats, m.trunk_l,
  m.importer, m.warranty_vehicle, m.warranty_battery,
  m.summary, m.hero_image
`;

export async function listModels(
  actor: Actor | null,
  filters: ModelFilters = {}
): Promise<Partial<Model>[]> {
  const w = new WhereBuilder();
  w.raw(modelVisibility(actor));
  w.add('m.brand = ?', filters.brand);
  w.add('m.body = ?', filters.body);
  w.add('m.price_usd <= ?', filters.priceMax);
  w.add('m.price_usd >= ?', filters.priceMin);
  w.add('m.range_real_km >= ?', filters.rangeMin);
  w.add('m.connector_dc = ?', filters.connectorDc);

  if (filters.search) {
    // Búsqueda por palabra clave: permite encontrar 'EX5' en
    // 'Geely EX5', o 'Dolphin' en 'BYD Dolphin'.
    const terms = filters.search
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(Boolean)
      .map((t) => t.toLowerCase())
      .filter((t) => t.length >= 2);

    if (terms.length) {
      const expr = terms
        .map((_, i) => `immutable_unaccent(m.brand || ' ' || COALESCE(m.model, '')) ILIKE immutable_unaccent($${i + 1})`)
        .join(' OR ');
      w.add(`(${expr})`, ...terms.map((t) => `%${t}%`));
    }
  }

  const { where, params, nextIndex } = w.build();
  const limit = Math.min(filters.limit ?? 50, 200);

  return query<Partial<Model>>(
    `SELECT ${LIST_COLS}
     FROM models m
     ${where}
     ORDER BY m.brand ASC, m.model ASC
     LIMIT $${nextIndex} OFFSET $${nextIndex + 1}`,
    [...params, limit, filters.offset ?? 0]
  );
}

export async function getModelBySlug(
    actor: Actor | null,
    slug: string
  ): Promise<Model | null> {
    return queryOne<Model>(
      `SELECT m.* FROM models m
     WHERE m.slug = $1 AND ${modelVisibility(actor)}`,
      [slug]
    );
  }

  /** Comparador: hasta 3 modelos, ficha completa. */
  export async function compareModels(
    actor: Actor | null,
    slugs: string[]
  ): Promise<Model[]> {
    if (!slugs.length) return [];
    return query<Model>(
      `SELECT m.* FROM models m
     WHERE m.slug = ANY($1::text[]) AND ${modelVisibility(actor)}
     ORDER BY m.price_usd ASC NULLS LAST`,
      [slugs.slice(0, 3)]
    );
  }

  /** Flujo "tengo USD X" del chatbot. Ordena por autonomía real. */
  export async function recommendByBudget(
    budgetUsd: number,
    opts: { minRange?: number; body?: string; limit?: number } = {}
  ): Promise<Partial<Model>[]> {
    const w = new WhereBuilder();
    w.raw(`m.status = 'published'`);
    w.raw('m.available_uy = TRUE');
    w.raw('m.price_usd IS NOT NULL');
    w.add('m.price_usd <= ?', budgetUsd);
    w.add('m.range_real_km >= ?', opts.minRange);
    w.add('m.body = ?', opts.body);

    const { where, params, nextIndex } = w.build();

    return query<Partial<Model>>(
      `SELECT ${LIST_COLS},
            COALESCE(m.range_real_km, m.range_wltp_km * 0.85) AS range_effective
     FROM models m
     ${where}
     ORDER BY range_effective DESC NULLS LAST, m.price_usd ASC
     LIMIT $${nextIndex}`,
      [...params, opts.limit ?? 3]
    );
  }

  export async function getPriceHistory(modelId: string) {
    return query(
      `SELECT price_usd, source, recorded_at
     FROM price_history
     WHERE model_id = $1
     ORDER BY recorded_at DESC
     LIMIT 50`,
      [modelId]
    );
  }

  // ---------- Escritura (admin) ----------

  export async function upsertModel(
    actor: Actor | null,
    data: Partial<Model> & { slug: string }
  ): Promise<Model> {
    requireAdmin(actor);

    const cols = Object.keys(data).filter((k) => k !== 'id');
    const vals = cols.map((c) => (data as Record<string, unknown>)[c]);
    const placeholders = cols.map((_, i) => `$${i + 1}`);
    const updates = cols
      .filter((c) => c !== 'slug')
      .map((c) => `${c} = EXCLUDED.${c}`);

    const row = await queryOne<Model>(
      `INSERT INTO models (${cols.join(', ')})
     VALUES (${placeholders.join(', ')})
     ON CONFLICT (slug) DO UPDATE SET ${updates.join(', ')}
     RETURNING *`,
      vals
    );
    if (!row) throw new Error('upsert falló');
    return row;
  }

  /**
   * Publicar exige Tier 1 completo.
   * La credibilidad del dato es el activo: no se publica a medias.
   */
  export async function publishModel(
    actor: Actor | null,
    slug: string
  ): Promise<{ ok: boolean; missing: string[] }> {
    requireAdmin(actor);

    const m = await queryOne<Model>(`SELECT * FROM models WHERE slug = $1`, [slug]);
    if (!m) throw new NotFoundError(`Modelo ${slug} no existe`);

    const missing = TIER1_REQUIRED.filter((f) => m[f] === null || m[f] === undefined);
    if (missing.length) return { ok: false, missing: missing as string[] };

    await query(
      `UPDATE models
     SET status = 'published',
         specs_json = jsonb_set(specs_json, '{data_gaps}', '[]'::jsonb)
     WHERE slug = $1`,
      [slug]
    );
    return { ok: true, missing: [] };
  }

  /** Dashboard interno: qué falta para publicar cada modelo. */
  export async function getDataGaps(actor: Actor | null) {
    requireAdmin(actor);
    const rows = await query<Model>(`SELECT * FROM models WHERE status = 'draft'`);
    return rows.map((m) => ({
      slug: m.slug,
      brand: m.brand,
      model: m.model,
      missing: TIER1_REQUIRED.filter((f) => m[f] === null || m[f] === undefined),
    }));
  }
