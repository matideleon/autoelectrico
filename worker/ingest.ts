// ============================================================
// evuy — Job de ingesta de manuales
//
// PDF en MinIO → parse → chunk → embeddings → doc_chunks
//
// Corre en el worker, NUNCA en el request de Next: un manual de
// 400 páginas son minutos de proceso y te tumba el server.
//
// Idempotente: re-ingestar un doc borra sus chunks y rehace todo.
// ============================================================

import { transaction, query } from '../lib/db/client.ts';
import { chunkPages, type RawPage } from '../lib/rag/chunker.ts';
import { embedBatch, toVectorLiteral } from '../lib/rag/embeddings.ts';

export interface IngestJobData {
  docId: string;
  /** Fuerza re-ingesta aunque ya tenga chunks. */
  force?: boolean;
}

export interface IngestResult {
  docId: string;
  pages: number;
  chunks: number;
  tokensEmbedded: number;
  skipped: boolean;
}

interface DocRow {
  id: string;
  model_id: string | null;
  title: string;
  file_key: string;
  ingested_at: Date | null;
}

/**
 * Extrae texto por página. Usa pdfjs-dist (no pdf-parse: éste
 * pierde el número de página, y sin página no hay cita posible).
 */
async function extractPages(buffer: Buffer): Promise<RawPage[]> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

  const doc = await pdfjs.getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
    isEvalSupported: false,
  }).promise;

  const pages: RawPage[] = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();

    // pdfjs devuelve items sueltos: se reconstruyen las líneas por
    // coordenada Y, si no el texto sale como una sopa de palabras.
    const lines = new Map<number, string[]>();
    for (const item of content.items as Array<{ str: string; transform: number[] }>) {
      if (!item.str?.trim()) continue;
      const y = Math.round(item.transform[5]);
      const arr = lines.get(y) ?? [];
      arr.push(item.str);
      lines.set(y, arr);
    }

    const text = [...lines.entries()]
      .sort((a, b) => b[0] - a[0])          // arriba → abajo
      .map(([, parts]) => parts.join(' ').trim())
      .filter(Boolean)
      .join('\n');

    pages.push({ page: i, text });
    page.cleanup();
  }

  await doc.destroy();
  return pages;
}

/** Descarga el PDF desde MinIO. */
async function fetchFromStorage(fileKey: string): Promise<Buffer> {
  const { S3Client, GetObjectCommand } = await import('@aws-sdk/client-s3');

  const s3 = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET_KEY!,
    },
    forcePathStyle: true,   // obligatorio con MinIO
  });

  const res = await s3.send(
    new GetObjectCommand({ Bucket: 'manuals', Key: fileKey })
  );
  const bytes = await res.Body!.transformToByteArray();
  return Buffer.from(bytes);
}

export async function ingestDocument(data: IngestJobData): Promise<IngestResult> {
  const { docId, force = false } = data;

  const [doc] = await query<DocRow>(
    `SELECT id, model_id, title, file_key, ingested_at FROM model_docs WHERE id = $1`,
    [docId]
  );
  if (!doc) throw new Error(`Documento ${docId} no existe`);

  if (doc.ingested_at && !force) {
    console.log(`[ingest] ${doc.title} ya ingestado, salteando`);
    return { docId, pages: 0, chunks: 0, tokensEmbedded: 0, skipped: true };
  }

  console.log(`[ingest] descargando ${doc.file_key}`);
  const buffer = await fetchFromStorage(doc.file_key);

  console.log(`[ingest] parseando PDF (${(buffer.length / 1e6).toFixed(1)} MB)`);
  const pages = await extractPages(buffer);

  const withText = pages.filter((p) => p.text.trim().length > 0);
  if (!withText.length) {
    throw new Error(
      `${doc.title}: cero texto extraído. ¿Es un PDF escaneado? Necesita OCR.`
    );
  }
  if (withText.length < pages.length * 0.5) {
    console.warn(
      `[ingest] atención: solo ${withText.length}/${pages.length} páginas con texto`
    );
  }

  console.log(`[ingest] chunkeando ${pages.length} páginas`);
  const chunks = chunkPages(pages);
  if (!chunks.length) throw new Error(`${doc.title}: no se generaron chunks`);

  console.log(`[ingest] ${chunks.length} chunks → embeddings`);
  const embeddings = await embedBatch(chunks.map((c) => c.content));

  if (embeddings.length !== chunks.length) {
    throw new Error(`Embeddings desalineados: ${embeddings.length} vs ${chunks.length}`);
  }

  // Transacción: o entra todo, o no entra nada. Un doc a medio
  // ingestar produce respuestas con huecos silenciosos.
  await transaction(async (client) => {
    await client.query(`DELETE FROM doc_chunks WHERE doc_id = $1`, [docId]);

    const BATCH = 200;
    for (let i = 0; i < chunks.length; i += BATCH) {
      const slice = chunks.slice(i, i + BATCH);
      const values: unknown[] = [];
      const rows: string[] = [];

      slice.forEach((c, j) => {
        const base = j * 7;
        rows.push(
          `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}::vector)`
        );
        values.push(
          docId,
          doc.model_id,
          c.content,
          c.page,
          c.chunkIdx,
          c.tokens,
          toVectorLiteral(embeddings[i + j])
        );
      });

      await client.query(
        `INSERT INTO doc_chunks (doc_id, model_id, content, page, chunk_idx, tokens, embedding)
         VALUES ${rows.join(', ')}`,
        values
      );
    }

    await client.query(
      `UPDATE model_docs SET ingested_at = now(), pages = $2 WHERE id = $1`,
      [docId, pages.length]
    );
  });

  const tokensEmbedded = chunks.reduce((s, c) => s + c.tokens, 0);
  console.log(
    `[ingest] ✓ ${doc.title}: ${chunks.length} chunks, ~${tokensEmbedded} tokens ` +
    `(~USD ${((tokensEmbedded / 1e6) * 0.02).toFixed(4)})`
  );

  return {
    docId,
    pages: pages.length,
    chunks: chunks.length,
    tokensEmbedded,
    skipped: false,
  };
}
