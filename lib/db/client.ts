// ============================================================
// evuy — Cliente Postgres
// Pool único, queries parametrizadas, transacciones.
// ============================================================

import { Pool, type PoolClient, type QueryResultRow } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var __evuyPool: Pool | undefined;
}

/**
 * Pool global. En dev, Next.js recarga módulos en cada cambio;
 * sin el global se abren pools nuevos hasta agotar conexiones.
 */
export const pool =
  global.__evuyPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

if (process.env.NODE_ENV !== 'production') {
  global.__evuyPool = pool;
}

pool.on('error', (err) => {
  console.error('[db] error en cliente idle', err);
});

/** Query parametrizada. NUNCA interpolar valores en el string. */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params as never[]);
    const ms = Date.now() - start;
    if (ms > 500) {
      console.warn(`[db] query lenta (${ms}ms):`, text.slice(0, 120));
    }
    return res.rows;
  } catch (err) {
    console.error('[db] query falló:', text.slice(0, 200), err);
    throw err;
  }
}

/** Una fila o null. */
export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

/** Transacción con rollback automático. */
export async function transaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Constructor de WHERE con placeholders numerados.
 * Evita el error clásico de desalinear $1,$2,$3 al armar filtros.
 */
export class WhereBuilder {
  private clauses: string[] = [];
  private params: unknown[] = [];

  /** Cláusula con uno o más parámetros. Reemplaza cada '?' por $n,$n+1,... */
  add(clause: string, ...values: unknown[]): this {
    const validValues = values.filter((v) => v !== undefined && v !== null);
    if (validValues.length === 0) return this;
    let idx = 0;
    const replaced = clause.replace(/\?/g, () => `$${this.params.length + ++idx}`);
    this.params.push(...validValues);
    this.clauses.push(replaced);
    return this;
  }

  /** Cláusula sin parámetros. */
  raw(clause: string): this {
    this.clauses.push(clause);
    return this;
  }

  build(): { where: string; params: unknown[]; nextIndex: number } {
    return {
      where: this.clauses.length ? `WHERE ${this.clauses.join(' AND ')}` : '',
      params: this.params,
      nextIndex: this.params.length + 1,
    };
  }
}
