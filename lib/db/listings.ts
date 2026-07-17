// ============================================================
// evuy — listings (usados)
// Acá está el riesgo real: contenido generado por usuarios.
// Visibilidad y ownership se chequean en TODAS las funciones.
// ============================================================

import { query, queryOne } from './client';
import {
  listingVisibility,
  requireAuth,
  requireOwnerOrAdmin,
  requireAdmin,
  NotFoundError,
} from './auth';
import type { Actor, Listing, ListingWithModel, ListingFilters } from './types';

const JOIN_COLS = `
  l.*,
  m.slug AS model_slug,
  m.brand,
  m.model AS model_name,
  m.range_real_km,
  m.battery_kwh
`;

export async function listListings(
  actor: Actor | null,
  filters: ListingFilters = {}
): Promise<ListingWithModel[]> {
  // La visibilidad consume $1 si hay actor, así que los params
  // se arman en orden desde ahí.
  const vis = listingVisibility(actor, 1);
  const params: unknown[] = [...vis.params];
  const clauses: string[] = [vis.clause];

  const push = (clause: string, value: unknown) => {
    if (value === undefined || value === null) return;
    params.push(value);
    clauses.push(clause.replace('?', `$${params.length}`));
  };

  push('l.model_id = ?', filters.modelId);
  push('m.slug = ?', filters.modelSlug);
  push('l.price_usd >= ?', filters.priceMin);
  push('l.price_usd <= ?', filters.priceMax);
  push('l.year >= ?', filters.yearMin);
  push('l.km <= ?', filters.kmMax);
  push('l.department = ?', filters.department);

  const limit = Math.min(filters.limit ?? 24, 100);
  params.push(limit, filters.offset ?? 0);

  return query<ListingWithModel>(
    `SELECT ${JOIN_COLS}
     FROM listings l
     JOIN models m ON m.id = l.model_id
     WHERE ${clauses.join(' AND ')}
     ORDER BY
       (l.featured_until > now()) DESC NULLS LAST,
       l.published_at DESC NULLS LAST
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
}

export async function getListing(
  actor: Actor | null,
  id: string
): Promise<ListingWithModel | null> {
  const vis = listingVisibility(actor, 2);
  return queryOne<ListingWithModel>(
    `SELECT ${JOIN_COLS}
     FROM listings l
     JOIN models m ON m.id = l.model_id
     WHERE l.id = $1 AND ${vis.clause}`,
    [id, ...vis.params]
  );
}

export async function getMyListings(actor: Actor | null): Promise<ListingWithModel[]> {
  const a = requireAuth(actor);
  return query<ListingWithModel>(
    `SELECT ${JOIN_COLS}
     FROM listings l
     JOIN models m ON m.id = l.model_id
     WHERE l.user_id = $1
     ORDER BY l.created_at DESC`,
    [a.id]
  );
}

export type CreateListingInput = Pick<
  Listing,
  'model_id' | 'year' | 'km' | 'price_usd'
> &
  Partial<
    Pick<
      Listing,
      | 'price_original_uyu'
      | 'fx_rate'
      | 'soh_pct'
      | 'color'
      | 'location'
      | 'department'
      | 'description'
      | 'photos'
      | 'contact_phone'
    >
  >;

/**
 * Alta de listing. Entra como 'pending' → moderación manual.
 * En fase 1 moderás vos. No hay auto-publicación.
 */
export async function createListing(
  actor: Actor | null,
  input: CreateListingInput
): Promise<Listing> {
  const a = requireAuth(actor);

  const row = await queryOne<Listing>(
    `INSERT INTO listings (
       model_id, user_id, status, year, km, price_usd,
       price_original_uyu, fx_rate, soh_pct, color,
       location, department, description, photos, contact_phone,
       expires_at
     ) VALUES ($1,$2,'pending',$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14, now() + interval '90 days')
     RETURNING *`,
    [
      input.model_id,
      a.id,
      input.year,
      input.km,
      input.price_usd,
      input.price_original_uyu ?? null,
      input.fx_rate ?? null,
      input.soh_pct ?? null,
      input.color ?? null,
      input.location ?? null,
      input.department ?? null,
      input.description ?? null,
      input.photos ?? [],
      input.contact_phone ?? null,
    ]
  );
  if (!row) throw new Error('createListing falló');
  return row;
}

export async function updateListing(
  actor: Actor | null,
  id: string,
  patch: Partial<CreateListingInput>
): Promise<Listing> {
  const existing = await queryOne<Listing>(
    `SELECT user_id, status FROM listings WHERE id = $1`,
    [id]
  );
  if (!existing) throw new NotFoundError('Listing no existe');
  requireOwnerOrAdmin(actor, existing.user_id);

  const cols = Object.keys(patch);
  if (!cols.length) throw new Error('Nada para actualizar');

  const sets = cols.map((c, i) => `${c} = $${i + 2}`);
  const vals = cols.map((c) => (patch as Record<string, unknown>)[c]);

  const row = await queryOne<Listing>(
    `UPDATE listings SET ${sets.join(', ')} WHERE id = $1 RETURNING *`,
    [id, ...vals]
  );
  return row!;
}

export async function deleteListing(actor: Actor | null, id: string): Promise<void> {
  const existing = await queryOne<Listing>(
    `SELECT user_id FROM listings WHERE id = $1`,
    [id]
  );
  if (!existing) throw new NotFoundError('Listing no existe');
  requireOwnerOrAdmin(actor, existing.user_id);
  await query(`DELETE FROM listings WHERE id = $1`, [id]);
}

export async function markSold(actor: Actor | null, id: string): Promise<void> {
  const existing = await queryOne<Listing>(
    `SELECT user_id FROM listings WHERE id = $1`,
    [id]
  );
  if (!existing) throw new NotFoundError('Listing no existe');
  requireOwnerOrAdmin(actor, existing.user_id);
  await query(`UPDATE listings SET status = 'sold' WHERE id = $1`, [id]);
}

// ---------- Moderación (admin) ----------

export async function getPendingListings(actor: Actor | null): Promise<ListingWithModel[]> {
  requireAdmin(actor);
  return query<ListingWithModel>(
    `SELECT ${JOIN_COLS}
     FROM listings l
     JOIN models m ON m.id = l.model_id
     WHERE l.status = 'pending'
     ORDER BY l.created_at ASC`
  );
}

export async function moderateListing(
  actor: Actor | null,
  id: string,
  decision: 'approve' | 'reject'
): Promise<void> {
  requireAdmin(actor);
  if (decision === 'approve') {
    await query(
      `UPDATE listings SET status = 'published', published_at = now() WHERE id = $1`,
      [id]
    );
  } else {
    await query(`UPDATE listings SET status = 'rejected' WHERE id = $1`, [id]);
  }
}

/** Contador de vistas. Sin auth: es público. */
export async function incrementViews(id: string): Promise<void> {
  await query(`UPDATE listings SET views = views + 1 WHERE id = $1`, [id]);
}
