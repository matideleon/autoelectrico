// ============================================================
// evuy — subscribers (newsletter)
//
// La única audiencia que poseés. Google y Meta te la pueden
// sacar mañana; esta lista no.
// ============================================================

import { randomBytes } from 'crypto';
import { query, queryOne } from './client';
import { requireAdmin } from './auth';
import type { Actor, Subscriber, BuyerTimeframe } from './types';

export interface SubscribeInput {
  email: string;
  name?: string;
  model_interest?: string[];
  timeframe?: BuyerTimeframe;   // la pregunta que después vendés
  source?: string;
}

/**
 * Alta con double opt-in. Devuelve el token para el mail.
 * Idempotente: re-suscribirse regenera el token, no explota.
 */
export async function subscribe(
  input: SubscribeInput
): Promise<{ subscriber: Subscriber; token: string; alreadyConfirmed: boolean }> {
  const email = input.email.toLowerCase().trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw new Error('Email inválido');
  }

  const token = randomBytes(32).toString('hex');

  const row = await queryOne<Subscriber>(
    `INSERT INTO subscribers (email, name, model_interest, timeframe, source, confirm_token)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (email) DO UPDATE SET
       name           = COALESCE(EXCLUDED.name, subscribers.name),
       model_interest = CASE
                          WHEN cardinality(EXCLUDED.model_interest) > 0
                          THEN EXCLUDED.model_interest
                          ELSE subscribers.model_interest
                        END,
       timeframe      = COALESCE(EXCLUDED.timeframe, subscribers.timeframe),
       confirm_token  = CASE
                          WHEN subscribers.status = 'confirmed'
                          THEN subscribers.confirm_token
                          ELSE EXCLUDED.confirm_token
                        END,
       status         = CASE
                          WHEN subscribers.status = 'unsubscribed' THEN 'pending'::sub_status
                          ELSE subscribers.status
                        END
     RETURNING *`,
    [
      email,
      input.name ?? null,
      input.model_interest ?? [],
      input.timeframe ?? null,
      input.source ?? 'landing',
      token,
    ]
  );
  if (!row) throw new Error('subscribe falló');

  return {
    subscriber: row,
    token: row.confirm_token ?? token,
    alreadyConfirmed: row.status === 'confirmed',
  };
}

export async function confirmSubscription(token: string): Promise<Subscriber | null> {
  return queryOne<Subscriber>(
    `UPDATE subscribers
     SET status = 'confirmed', confirmed_at = now(), confirm_token = NULL
     WHERE confirm_token = $1 AND status = 'pending'
     RETURNING *`,
    [token]
  );
}

export async function unsubscribe(email: string): Promise<void> {
  await query(
    `UPDATE subscribers
     SET status = 'unsubscribed', unsubscribed_at = now()
     WHERE email = $1`,
    [email.toLowerCase().trim()]
  );
}

// ---------- Admin ----------

/** Segmentación. Un sub con timeframe='lt_3m' vale 100x uno genérico. */
export async function getSegment(
  actor: Actor | null,
  opts: { timeframe?: BuyerTimeframe; modelId?: string } = {}
): Promise<Subscriber[]> {
  requireAdmin(actor);

  const params: unknown[] = [];
  const clauses = [`status = 'confirmed'`];

  if (opts.timeframe) {
    params.push(opts.timeframe);
    clauses.push(`timeframe = $${params.length}`);
  }
  if (opts.modelId) {
    params.push(opts.modelId);
    clauses.push(`$${params.length} = ANY(model_interest)`);
  }

  return query<Subscriber>(
    `SELECT * FROM subscribers WHERE ${clauses.join(' AND ')} ORDER BY created_at DESC`,
    params
  );
}

export async function getSubscriberStats(actor: Actor | null) {
  requireAdmin(actor);
  return queryOne(
    `SELECT
       COUNT(*) FILTER (WHERE status = 'confirmed')                  AS confirmed,
       COUNT(*) FILTER (WHERE status = 'pending')                    AS pending,
       COUNT(*) FILTER (WHERE status = 'unsubscribed')               AS churned,
       COUNT(*) FILTER (WHERE status = 'confirmed'
                        AND timeframe = 'lt_3m')                     AS hot,
       COUNT(*) FILTER (WHERE created_at > now() - interval '7 days'
                        AND status = 'confirmed')                    AS last_7d
     FROM subscribers`
  );
}
