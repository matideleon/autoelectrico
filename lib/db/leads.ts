// ============================================================
// evuy — leads
//
// Esto es lo que le vendés a los concesionarios.
// Escritura: pública (cualquiera deja un lead).
// Lectura: SOLO admin. Un leak acá te funde el negocio.
// ============================================================

import { query, queryOne } from './client';
import { requireAdmin, canReadLeads, ForbiddenError } from './auth';
import type { Actor, Lead, LeadStatus, BuyerTimeframe } from './types';

export interface CreateLeadInput {
  model_id?: string;
  listing_id?: string;
  creator_id?: string;   // atribución → revenue share
  user_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  budget_usd?: number;
  timeframe?: BuyerTimeframe;
  message?: string;
  wants_test_drive?: boolean;
  source: string;        // 'chatbot' | 'listing' | 'calculator' | 'newsletter'
  utm_json?: Record<string, string>;
}

/** Captura pública. Sin auth: el visitante anónimo es el 90% de los leads. */
export async function createLead(input: CreateLeadInput): Promise<Lead> {
  if (!input.email && !input.phone) {
    throw new Error('Un lead necesita email o teléfono');
  }

  const row = await queryOne<Lead>(
    `INSERT INTO leads (
       model_id, listing_id, creator_id, user_id,
       name, email, phone, budget_usd, timeframe,
       message, wants_test_drive, source, utm_json
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     RETURNING *`,
    [
      input.model_id ?? null,
      input.listing_id ?? null,
      input.creator_id ?? null,
      input.user_id ?? null,
      input.name ?? null,
      input.email?.toLowerCase().trim() ?? null,
      input.phone ?? null,
      input.budget_usd ?? null,
      input.timeframe ?? null,
      input.message ?? null,
      input.wants_test_drive ?? false,
      input.source,
      JSON.stringify(input.utm_json ?? {}),
    ]
  );
  if (!row) throw new Error('createLead falló');
  return row;
}

// ---------- Lectura: admin only ----------

export async function listLeads(
  actor: Actor | null,
  opts: { status?: LeadStatus; timeframe?: BuyerTimeframe; limit?: number } = {}
): Promise<Lead[]> {
  if (!canReadLeads(actor)) throw new ForbiddenError('Los leads son solo para admin');

  const params: unknown[] = [];
  const clauses: string[] = ['TRUE'];

  if (opts.status) {
    params.push(opts.status);
    clauses.push(`status = $${params.length}`);
  }
  if (opts.timeframe) {
    params.push(opts.timeframe);
    clauses.push(`timeframe = $${params.length}`);
  }

  params.push(Math.min(opts.limit ?? 100, 500));

  return query<Lead>(
    `SELECT * FROM leads
     WHERE ${clauses.join(' AND ')}
     ORDER BY
       CASE timeframe
         WHEN 'lt_3m' THEN 1
         WHEN '3_6m'  THEN 2
         WHEN '6_12m' THEN 3
         ELSE 4
       END,
       created_at DESC
     LIMIT $${params.length}`,
    params
  );
}

/** Los calientes. Los que valen plata. */
export async function getHotLeads(actor: Actor | null): Promise<Lead[]> {
  requireAdmin(actor);
  return query<Lead>(
    `SELECT l.*, m.brand, m.model
     FROM leads l
     LEFT JOIN models m ON m.id = l.model_id
     WHERE l.timeframe = 'lt_3m'
       AND l.status IN ('new','contacted')
     ORDER BY l.created_at DESC`
  );
}

export async function updateLeadStatus(
  actor: Actor | null,
  id: string,
  status: LeadStatus,
  meta?: { sold_to?: string; sold_price_usd?: number; notes?: string }
): Promise<void> {
  requireAdmin(actor);
  await query(
    `UPDATE leads
     SET status = $2,
         sold_to = COALESCE($3, sold_to),
         sold_price_usd = COALESCE($4, sold_price_usd),
         notes = COALESCE($5, notes)
     WHERE id = $1`,
    [id, status, meta?.sold_to ?? null, meta?.sold_price_usd ?? null, meta?.notes ?? null]
  );
}

/**
 * Atribución a creators → base del revenue share.
 * Sin esto, no le prometas nada a nadie.
 */
export async function getLeadsByCreator(actor: Actor | null, period: string) {
  requireAdmin(actor);
  return query(
    `SELECT
       c.slug,
       c.name,
       c.revenue_share_pct,
       COUNT(*)                                    AS leads,
       COUNT(*) FILTER (WHERE l.status = 'won')    AS won,
       COALESCE(SUM(l.sold_price_usd), 0)          AS revenue_usd,
       COALESCE(SUM(l.sold_price_usd), 0) * c.revenue_share_pct / 100 AS share_usd
     FROM leads l
     JOIN creators c ON c.id = l.creator_id
     WHERE date_trunc('month', l.created_at) = $1::date
     GROUP BY c.id, c.slug, c.name, c.revenue_share_pct
     ORDER BY revenue_usd DESC`,
    [period]
  );
}

/** Métrica de la semana 12: ¿esto es un negocio o no? */
export async function getLeadFunnel(actor: Actor | null) {
  requireAdmin(actor);
  return queryOne(
    `SELECT
       COUNT(*)                                          AS total,
       COUNT(*) FILTER (WHERE timeframe = 'lt_3m')       AS hot,
       COUNT(*) FILTER (WHERE wants_test_drive)          AS test_drives,
       COUNT(*) FILTER (WHERE status = 'won')            AS won,
       COALESCE(SUM(sold_price_usd), 0)                  AS revenue_usd,
       COUNT(*) FILTER (WHERE source = 'chatbot')        AS from_chatbot,
       COUNT(*) FILTER (WHERE source = 'newsletter')     AS from_newsletter
     FROM leads
     WHERE created_at > now() - interval '90 days'`
  );
}
