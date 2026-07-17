// ============================================================
// evuy — Cache de respuestas
//
// Uruguay es un mercado chico: "¿cuánto sale el Dolphin?" te la
// preguntan cincuenta veces. Cachear 24h es plata directa de API
// ahorrada.
//
// Solo se cachean preguntas sin contexto conversacional. Si hay
// historial, la respuesta depende de él y el cache mentiría.
// ============================================================

import { createHash } from 'crypto';
import { Redis } from 'ioredis';

declare global {
  // eslint-disable-next-line no-var
  var __evuyRedis: Redis | undefined;
}

export const redis =
  global.__evuyRedis ??
  new Redis(process.env.REDIS_URL ?? 'redis://redis:6379', {
    maxRetriesPerRequest: 2,
    lazyConnect: true,
    // El cache es un lujo, no un requisito: si Redis se cae,
    // el chat tiene que seguir funcionando.
    retryStrategy: (times) => (times > 3 ? null : Math.min(times * 200, 1000)),
  });

if (process.env.NODE_ENV !== 'production') {
  global.__evuyRedis = redis;
}

redis.on('error', (err) => {
  console.warn('[cache] redis error (degradando sin cache):', err.message);
});

const TTL_SECONDS = 60 * 60 * 24; // 24h

/**
 * Normaliza la pregunta para que variantes triviales peguen en la
 * misma entrada: "cuanto sale el dolphin?" == "¿Cuánto sale el Dolphin?"
 */
function normalize(q: string): string {
  return q
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // sacar acentos
    .replace(/[¿?¡!.,;:]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function cacheKey(question: string, modelId?: string): string {
  const h = createHash('sha256')
    .update(normalize(question))
    .update(modelId ?? '')
    .digest('hex')
    .slice(0, 32);
  return `chat:${h}`;
}

export interface CachedAnswer {
  answer: string;
  citations: Array<{ label: string; page: number | null; docTitle: string }>;
  modelsShown: string[];
  cachedAt: number;
}

export async function getCached(key: string): Promise<CachedAnswer | null> {
  try {
    const raw = await redis.get(key);
    return raw ? (JSON.parse(raw) as CachedAnswer) : null;
  } catch (err) {
    console.warn('[cache] lectura falló:', (err as Error).message);
    return null;
  }
}

export async function setCached(key: string, value: Omit<CachedAnswer, 'cachedAt'>): Promise<void> {
  try {
    await redis.setex(key, TTL_SECONDS, JSON.stringify({ ...value, cachedAt: Date.now() }));
  } catch (err) {
    console.warn('[cache] escritura falló:', (err as Error).message);
  }
}

/**
 * Invalidación por modelo. Se llama cuando cambia un precio:
 * una respuesta cacheada con el precio viejo es peor que no cachear.
 *
 * Usa SCAN, no KEYS: KEYS bloquea Redis entero mientras recorre,
 * y con miles de claves eso es una caída del sitio.
 */
export async function invalidateModel(modelSlug: string): Promise<number> {
  try {
    let cursor = '0';
    let count = 0;

    do {
      const [next, keys] = await redis.scan(cursor, 'MATCH', 'chat:*', 'COUNT', 100);
      cursor = next;
      if (!keys.length) continue;

      // MGET en lote en vez de un GET por clave
      const values = await redis.mget(...keys);
      const toDelete = keys.filter((_, i) => values[i]?.includes(modelSlug));

      if (toDelete.length) {
        await redis.del(...toDelete);
        count += toDelete.length;
      }
    } while (cursor !== '0');

    console.log(`[cache] invalidadas ${count} entradas de ${modelSlug}`);
    return count;
  } catch (err) {
    console.warn('[cache] invalidación falló:', (err as Error).message);
    return 0;
  }
}

export async function cacheStats(): Promise<{ entries: number }> {
  try {
    let cursor = '0';
    let entries = 0;
    do {
      const [next, keys] = await redis.scan(cursor, 'MATCH', 'chat:*', 'COUNT', 500);
      cursor = next;
      entries += keys.length;
    } while (cursor !== '0');
    return { entries };
  } catch {
    return { entries: 0 };
  }
}
