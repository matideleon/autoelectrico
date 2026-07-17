// ============================================================
// evuy — Retrieval
//
// Híbrido: búsqueda vectorial + full-text en español, fusionadas
// con Reciprocal Rank Fusion.
//
// Por qué híbrido: el vector solo falla con códigos y números
// exactos ("error P0AA6", "60.22 kWh"). El full-text solo falla
// con paráfrasis ("¿cada cuánto cambio el filtro?" vs "intervalo
// de sustitución"). En un manual técnico necesitás los dos.
//
// Esta capa está desacoplada de la generación a propósito: si en
// el mes 6 querés que un agente use el retrieval como herramienta,
// ya está listo.
// ============================================================

import { query } from '../db/client';
import { embedOne, toVectorLiteral } from './embeddings';

export interface RetrievedChunk {
  id: number;
  content: string;
  page: number | null;
  docTitle: string;
  docId: string;
  modelSlug: string | null;
  score: number;
}

export interface RetrieveOptions {
  modelId?: string;      // acotar a un modelo
  limit?: number;        // chunks finales
  candidates?: number;   // candidatos por rama antes de fusionar
  minScore?: number;
}

interface RankedRow {
  id: number;
  content: string;
  page: number | null;
  doc_title: string;
  doc_id: string;
  model_slug: string | null;
  rank: number;
}

/** Búsqueda vectorial por similitud coseno. */
async function vectorSearch(
  embedding: number[],
  modelId: string | undefined,
  limit: number
): Promise<RankedRow[]> {
  return query<RankedRow>(
    `SELECT
       c.id, c.content, c.page,
       d.title AS doc_title,
       d.id::text AS doc_id,
       m.slug AS model_slug,
       ROW_NUMBER() OVER (ORDER BY c.embedding <=> $1::vector) AS rank
     FROM doc_chunks c
     JOIN model_docs d ON d.id = c.doc_id
     LEFT JOIN models m ON m.id = c.model_id
     WHERE c.embedding IS NOT NULL
       AND ($2::uuid IS NULL OR c.model_id = $2::uuid)
     ORDER BY c.embedding <=> $1::vector
     LIMIT $3`,
    [toVectorLiteral(embedding), modelId ?? null, limit]
  );
}

/** Full-text en español. Atrapa códigos y cifras exactas. */
async function textSearch(
  q: string,
  modelId: string | undefined,
  limit: number
): Promise<RankedRow[]> {
  return query<RankedRow>(
    `SELECT
       c.id, c.content, c.page,
       d.title AS doc_title,
       d.id::text AS doc_id,
       m.slug AS model_slug,
       ROW_NUMBER() OVER (
         ORDER BY ts_rank(to_tsvector('spanish', c.content),
                          plainto_tsquery('spanish', $1)) DESC
       ) AS rank
     FROM doc_chunks c
     JOIN model_docs d ON d.id = c.doc_id
     LEFT JOIN models m ON m.id = c.model_id
     WHERE to_tsvector('spanish', c.content) @@ plainto_tsquery('spanish', $1)
       AND ($2::uuid IS NULL OR c.model_id = $2::uuid)
     ORDER BY ts_rank(to_tsvector('spanish', c.content),
                      plainto_tsquery('spanish', $1)) DESC
     LIMIT $3`,
    [q, modelId ?? null, limit]
  );
}

/**
 * Reciprocal Rank Fusion. k=60 es el valor estándar del paper;
 * amortigua el peso de los primeros puestos y evita que una rama
 * domine a la otra.
 */
function fuse(lists: RankedRow[][], k = 60): Map<number, { row: RankedRow; score: number }> {
  const scores = new Map<number, { row: RankedRow; score: number }>();
  for (const list of lists) {
    for (const row of list) {
      const prev = scores.get(row.id);
      const inc = 1 / (k + Number(row.rank));
      if (prev) {
        prev.score += inc;
      } else {
        scores.set(row.id, { row, score: inc });
      }
    }
  }
  return scores;
}

/** Retrieval híbrido. Es la entrada principal del RAG. */
export async function retrieve(
  question: string,
  opts: RetrieveOptions = {}
): Promise<RetrievedChunk[]> {
  const limit = opts.limit ?? 6;
  const candidates = opts.candidates ?? 20;

  const embedding = await embedOne(question);

  const [vec, txt] = await Promise.all([
    vectorSearch(embedding, opts.modelId, candidates),
    textSearch(question, opts.modelId, candidates).catch((err) => {
      // El full-text no debe tumbar la respuesta: degradar a vector solo.
      console.warn('[retrieve] full-text falló, sigo con vector:', err.message);
      return [] as RankedRow[];
    }),
  ]);

  const fused = fuse([vec, txt]);

  return [...fused.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .filter((x) => (opts.minScore ? x.score >= opts.minScore : true))
    .map(({ row, score }) => ({
      id: row.id,
      content: row.content,
      page: row.page,
      docTitle: row.doc_title,
      docId: row.doc_id,
      modelSlug: row.model_slug,
      score,
    }));
}

/**
 * Contexto listo para el prompt, con las citas explícitas.
 * El bot debe poder decir "manual pág. 47" y que sea verdad.
 */
export function formatContext(chunks: RetrievedChunk[]): string {
  if (!chunks.length) return '';
  return chunks
    .map((c, i) => {
      const cite = c.page ? `${c.docTitle}, pág. ${c.page}` : c.docTitle;
      return `[${i + 1}] (${cite})\n${c.content}`;
    })
    .join('\n\n---\n\n');
}
