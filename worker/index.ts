// ============================================================
// evuy — Worker
//
// Servicio aparte en EasyPanel. Mismo repo, otro comando:
//   node --experimental-strip-types worker/index.ts
//
// Nunca compartas proceso con Next: un manual de 400 páginas
// bloquea el event loop y se te cae el sitio.
// ============================================================

import { Worker, Queue, type ConnectionOptions } from 'bullmq';
import { ingestDocument, type IngestJobData } from './ingest.ts';
import { pool } from '../lib/db/client.ts';

const connection: ConnectionOptions = {
  url: process.env.REDIS_URL ?? 'redis://redis:6379',
};

export const QUEUES = {
  ingest: 'ingest',
  images: 'images',
  newsletter: 'newsletter',
  prices: 'prices',
} as const;

// ---------- Productores ----------

export const ingestQueue = new Queue<IngestJobData>(QUEUES.ingest, {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5_000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 },   // los fallos se conservan para debuggear
  },
});

export async function enqueueIngest(docId: string, force = false) {
  return ingestQueue.add('ingest-doc', { docId, force }, { jobId: `doc:${docId}` });
}

// ---------- Consumidores ----------

const ingestWorker = new Worker<IngestJobData>(
  QUEUES.ingest,
  async (job) => {
    console.log(`[worker] ingest ${job.id} (intento ${job.attemptsMade + 1})`);
    return ingestDocument(job.data);
  },
  {
    connection,
    // Concurrencia 2: el cuello de botella es la API de embeddings,
    // no la CPU. Más de esto solo te come rate limit.
    concurrency: 2,
    limiter: { max: 10, duration: 60_000 },
  }
);

ingestWorker.on('completed', (job, result) => {
  console.log(`[worker] ✓ ${job.id}:`, result);
});

ingestWorker.on('failed', (job, err) => {
  console.error(`[worker] ✗ ${job?.id}:`, err.message);
});

// ---------- Apagado limpio ----------
// Sin esto, un deploy en EasyPanel mata jobs a la mitad.

async function shutdown(signal: string) {
  console.log(`[worker] ${signal} recibido, cerrando...`);
  await ingestWorker.close();
  await ingestQueue.close();
  await pool.end();
  process.exit(0);
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

console.log('[worker] escuchando colas:', Object.values(QUEUES).join(', '));
