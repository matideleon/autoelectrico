// ============================================================
// evuy — Motor del chatbot
//
// Flujo: pregunta → retrieval → contexto → Claude → verificación
// de citas → captura de lead.
//
// No es un agente: no decide herramientas ni itera. Es un pipeline
// determinístico, y tiene que serlo. Cuando el activo es la
// credibilidad del dato, la agencia es un pasivo.
// ============================================================

import Anthropic from '@anthropic-ai/sdk';
import { retrieve, type RetrievedChunk } from './retrieve';
import {
  SYSTEM_BASE,
  SYSTEM_ADVISOR,
  buildContext,
  looksLikeBuyingIntent,
  extractBudget,
} from './prompts';
import { cacheKey, getCached, setCached } from './cache';
import * as models from '../db/models';
import { consultarPorIntencion } from './query';
import type { Model } from '../db/types';

const MODEL_ID = 'claude-sonnet-4-6';
const MAX_TOKENS = 1024;

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (!_client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('Falta ANTHROPIC_API_KEY');
    _client = new Anthropic({ apiKey });
  }
  return _client;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Citation {
  label: string;      // "[1]"
  docTitle: string;
  page: number | null;
}

export interface ChatRequest {
  question: string;
  history?: ChatMessage[];
  modelSlug?: string;    // acota a un modelo (ficha individual)
  sessionId: string;
}

export interface ChatResponse {
  answer: string;
  citations: Citation[];
  modelsShown: string[];
  budgetDetected: number | null;
  shouldCaptureLead: boolean;
  cached: boolean;
  /** El modelo citó fuentes inexistentes: revisar antes de confiar. */
  suspect?: boolean;
  usage?: { input: number; output: number };
}

/**
 * Verifica que las citas del texto existan de verdad.
 *
 * Una cita inventada ([7] cuando solo hay 6 chunks) es señal roja:
 * si el modelo inventó la referencia, es probable que también haya
 * inventado el dato. Se remueve la cita, se limpia el espaciado y
 * se marca la respuesta como sospechosa para que el caller decida.
 */
function verifyCitations(
  answer: string,
  chunks: RetrievedChunk[]
): { clean: string; citations: Citation[]; hallucinatedRefs: number } {
  const used = new Set<number>();
  let hallucinated = 0;

  const cleaned = answer.replace(/\s*\[(\d+)\]/g, (match, n) => {
    const idx = parseInt(n, 10);
    if (idx >= 1 && idx <= chunks.length) {
      used.add(idx);
      return ` [${idx}]`;
    }
    hallucinated++;
    console.warn(`[chat] cita inválida [${n}] — el modelo pudo inventar el dato`);
    return '';
  });

  const citations: Citation[] = [...used]
    .sort((a, b) => a - b)
    .map((i) => ({
      label: `[${i}]`,
      docTitle: chunks[i - 1].docTitle,
      page: chunks[i - 1].page,
    }));

  const clean = cleaned
    .replace(/\s+([.,;:!?])/g, '$1')   // " ." → "."
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

  return { clean, citations, hallucinatedRefs: hallucinated };
}

/**
 * Señal de intención de compra. Es el momento de pedir el contacto:
 * ni antes (molesta) ni después (se fue).
 */
function detectLeadMoment(question: string, history: ChatMessage[]): boolean {
  const t = question.toLowerCase();
  if (/\b(test drive|prueba de manejo|probarlo|verlo|donde lo compro|concesionari)\b/.test(t)) {
    return true;
  }
  if (looksLikeBuyingIntent(question)) return true;
  // Tres o más turnos sobre modelos concretos ya es interés real
  return history.filter((m) => m.role === 'user').length >= 3;
}

export async function chat(req: ChatRequest): Promise<ChatResponse> {
  const { question, history = [], modelSlug } = req;

  if (!question.trim()) throw new Error('Pregunta vacía');
  if (question.length > 2000) throw new Error('Pregunta demasiado larga');

  // El presupuesto puede haber quedado en un mensaje anterior: si la
  // persona dijo "tengo 35 mil" y después responde "ciudad", ese
  // segundo mensaje no tiene número — sin esto, el contexto queda
  // vacío y el bot dice que no tiene datos cuando en realidad sí.
  const budget =
    extractBudget(question) ??
    history
      .filter((m) => m.role === 'user')
      .slice(-6)
      .reverse()
      .map((m) => extractBudget(m.content))
      .find((b) => b != null) ??
    null;
  const advisorMode = looksLikeBuyingIntent(question) || budget !== null;

  // Cache: solo preguntas sin historial. Con contexto previo, la
  // respuesta depende de él y una entrada cacheada mentiría.
  const canCache = history.length === 0 && !advisorMode;
  const key = cacheKey(question, modelSlug);

  if (canCache) {
    const hit = await getCached(key);
    if (hit) {
      return {
        answer: hit.answer,
        citations: hit.citations.map((c) => ({
          label: c.label,
          docTitle: c.docTitle,
          page: c.page,
        })),
        modelsShown: hit.modelsShown,
        budgetDetected: null,
        shouldCaptureLead: false,
        cached: true,
      };
    }
  }

  // ---- Retrieval ----
  let targetModel: Model | null = null;
  if (modelSlug) {
    targetModel = await models.getModelBySlug(null, modelSlug);
  }

  const chunks = await retrieve(question, {
    modelId: targetModel?.id,
    limit: 6,
  });

  // ---- Fichas de modelos ----
  let modelCards: Partial<Model>[] = [];
  let resumenConsulta: string | null = null;
  if (targetModel) {
    modelCards = [targetModel];
  } else if (budget) {
    modelCards = await models.recommendByBudget(budget, { limit: 4 });
  } else {
    // Enrutador de intención: entiende superlativos ("el más barato"),
    // filtros ("SUV hasta 40 mil"), agregados ("cuántas marcas hay")
    // y comparaciones, además de la búsqueda por nombre de siempre.
    const r = await consultarPorIntencion(question);
    modelCards = r.modelos;
    if (r.resumen) resumenConsulta = r.resumen;
  }

  const context = buildContext({ chunks, models: modelCards })
    + (resumenConsulta ? `\n\n=== RESULTADO DE LA CONSULTA A LA BASE ===\n${resumenConsulta}` : '');

  // ---- Generación ----
  const messages: Anthropic.MessageParam[] = [
    ...history.map((m) => ({ role: m.role, content: m.content })),
    {
      role: 'user' as const,
      content: `${context}\n\n=== PREGUNTA ===\n${question}`,
    },
  ];

  const res = await client().messages.create({
    model: MODEL_ID,
    max_tokens: MAX_TOKENS,
    system: advisorMode ? SYSTEM_ADVISOR : SYSTEM_BASE,
    messages,
  });

  const raw = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();

  const { clean, citations, hallucinatedRefs } = verifyCitations(raw, chunks);
  const modelsShown = modelCards.map((m) => m.slug!).filter(Boolean);

  // Una respuesta con citas inventadas no se cachea: sería
  // servir el mismo error mil veces durante 24 horas.
  if (canCache && citations.length > 0 && hallucinatedRefs === 0) {
    await setCached(key, { answer: clean, citations, modelsShown });
  }

  return {
    answer: clean,
    citations,
    modelsShown,
    budgetDetected: budget,
    shouldCaptureLead: detectLeadMoment(question, history),
    cached: false,
    suspect: hallucinatedRefs > 0,
    usage: { input: res.usage.input_tokens, output: res.usage.output_tokens },
  };
}
