// ============================================================
// evuy — Embeddings (OpenAI text-embedding-3-small, 1536 dims)
//
// Único servicio externo del pipeline de datos. Stateless.
// Si migrás a self-hosted, solo cambia este archivo (y las
// dimensiones del schema).
// ============================================================

const MODEL = 'text-embedding-3-small';
const DIMS = 1536;
const MAX_BATCH = 100;        // límite práctico por request
const MAX_TOKENS_PER_INPUT = 8000;

export interface EmbedOptions {
  signal?: AbortSignal;
}

interface OpenAIEmbeddingResponse {
  data: Array<{ embedding: number[]; index: number }>;
  usage: { prompt_tokens: number; total_tokens: number };
}

function apiKey(): string {
  const k = process.env.OPENAI_API_KEY;
  if (!k) throw new Error('Falta OPENAI_API_KEY');
  return k;
}

/** Backoff exponencial. 429 y 5xx se reintentan; 4xx no. */
async function withRetry<T>(fn: () => Promise<T>, tries = 4): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const status = (err as { status?: number }).status;
      if (status && status >= 400 && status < 500 && status !== 429) throw err;
      if (i === tries - 1) break;
      const wait = Math.min(1000 * 2 ** i, 16_000) + Math.random() * 500;
      console.warn(`[embed] reintento ${i + 1}/${tries} en ${Math.round(wait)}ms`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

async function callApi(inputs: string[], signal?: AbortSignal): Promise<number[][]> {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey()}`,
    },
    body: JSON.stringify({ model: MODEL, input: inputs }),
    signal,
  });

  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`OpenAI embeddings ${res.status}: ${body.slice(0, 200)}`);
    (err as { status?: number }).status = res.status;
    throw err;
  }

  const json = (await res.json()) as OpenAIEmbeddingResponse;
  // La API puede devolver desordenado: reordenar por index es obligatorio.
  return json.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
}

/** Embeddings en batch. Respeta el orden de entrada. */
export async function embedBatch(
  texts: string[],
  opts: EmbedOptions = {}
): Promise<number[][]> {
  if (!texts.length) return [];

  const clean = texts.map((t) => {
    const s = t.replace(/\s+/g, ' ').trim();
    if (!s) throw new Error('Texto vacío en el batch de embeddings');
    // ~4 chars por token; corte defensivo
    return s.slice(0, MAX_TOKENS_PER_INPUT * 4);
  });

  const out: number[][] = [];
  for (let i = 0; i < clean.length; i += MAX_BATCH) {
    const slice = clean.slice(i, i + MAX_BATCH);
    const vectors = await withRetry(() => callApi(slice, opts.signal));

    if (vectors.length !== slice.length) {
      throw new Error(`Embeddings desalineados: ${vectors.length} vs ${slice.length}`);
    }
    for (const v of vectors) {
      if (v.length !== DIMS) {
        throw new Error(`Dimensión inesperada: ${v.length}, se esperaba ${DIMS}`);
      }
    }
    out.push(...vectors);
  }
  return out;
}

export async function embedOne(text: string, opts: EmbedOptions = {}): Promise<number[]> {
  const [v] = await embedBatch([text], opts);
  return v;
}

/** Formato literal de pgvector: '[0.1,0.2,...]' */
export function toVectorLiteral(v: number[]): string {
  return `[${v.join(',')}]`;
}

export const EMBEDDING_DIMS = DIMS;
export const EMBEDDING_MODEL = MODEL;
