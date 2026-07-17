// ============================================================
// evuy — GET /api/health
//
// Lo usa el healthcheck de Docker y Uptime Kuma.
//
// Verifica dependencias de verdad, no devuelve 200 porque el
// proceso está vivo. Un Next.js corriendo con Postgres caído
// está "vivo" y no sirve para nada.
// ============================================================

import { NextResponse } from 'next/server';
import { queryOne } from '@/lib/db/client';
import { redis } from '@/lib/rag/cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Check {
  ok: boolean;
  ms: number;
  detail?: string;
}

async function timed(fn: () => Promise<string | void>): Promise<Check> {
  const t = Date.now();
  try {
    const detail = await fn();
    return { ok: true, ms: Date.now() - t, detail: detail || undefined };
  } catch (err) {
    return { ok: false, ms: Date.now() - t, detail: (err as Error).message.slice(0, 120) };
  }
}

export async function GET() {
  const [db, cache] = await Promise.all([
    timed(async () => {
      const row = await queryOne<{ n: string }>(
        `SELECT count(*)::text AS n FROM models WHERE status = 'published'`
      );
      return `${row?.n ?? 0} modelos publicados`;
    }),
    timed(async () => {
      const pong = await redis.ping();
      if (pong !== 'PONG') throw new Error('redis no responde PONG');
    }),
  ]);

  // Redis caído degrada (se pierde cache y rate limit) pero no
  // tumba el sitio. Postgres caído sí: sin datos no hay producto.
  const healthy = db.ok;

  return NextResponse.json(
    {
      status: healthy ? (cache.ok ? 'ok' : 'degraded') : 'down',
      checks: { db, cache },
      ts: new Date().toISOString(),
    },
    {
      status: healthy ? 200 : 503,
      headers: { 'Cache-Control': 'no-store' },
    }
  );
}
