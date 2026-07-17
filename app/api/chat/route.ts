// ============================================================
// evuy — POST /api/chat
//
// Rate limit por IP, chat, persistencia de conversación y
// captura de lead cuando aparece intención de compra.
// ============================================================

import { NextResponse, type NextRequest } from 'next/server';
import { chat, type ChatMessage } from '@/lib/rag/chat';
import { redis } from '@/lib/rag/cache';
import { query } from '@/lib/db/client';
import * as leads from '@/lib/db/leads';

export const runtime = 'nodejs';
export const maxDuration = 60;

const RATE_LIMIT = 20;          // mensajes
const RATE_WINDOW = 60 * 60;    // por hora

interface ChatBody {
  question: string;
  sessionId: string;
  modelSlug?: string;
  history?: ChatMessage[];
  lead?: {
    name?: string;
    email?: string;
    phone?: string;
    timeframe?: 'lt_3m' | '3_6m' | '6_12m' | 'browsing';
    wantsTestDrive?: boolean;
  };
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get('cf-connecting-ip') ??      // Cloudflare va adelante
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    'unknown'
  );
}

/** Rate limit. Si Redis se cae, se deja pasar: mejor eso que cortar el chat. */
async function checkRate(ip: string): Promise<{ ok: boolean; remaining: number }> {
  try {
    const key = `rl:chat:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, RATE_WINDOW);
    return { ok: count <= RATE_LIMIT, remaining: Math.max(0, RATE_LIMIT - count) };
  } catch {
    return { ok: true, remaining: RATE_LIMIT };
  }
}

export async function POST(req: NextRequest) {
  let body: ChatBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const { question, sessionId, modelSlug, history = [], lead } = body;

  if (!question?.trim()) {
    return NextResponse.json({ error: 'Falta la pregunta' }, { status: 400 });
  }
  if (!sessionId) {
    return NextResponse.json({ error: 'Falta sessionId' }, { status: 400 });
  }
  if (question.length > 2000) {
    return NextResponse.json({ error: 'Pregunta demasiado larga' }, { status: 400 });
  }

  const ip = clientIp(req);
  const rate = await checkRate(ip);
  if (!rate.ok) {
    return NextResponse.json(
      { error: 'Demasiadas consultas. Probá de nuevo en un rato.' },
      { status: 429, headers: { 'Retry-After': String(RATE_WINDOW) } }
    );
  }

  try {
    // El historial se recorta: 8 turnos alcanzan y evitan que el
    // costo por consulta crezca sin techo.
    const trimmed = history.slice(-8);

    const res = await chat({ question, history: trimmed, modelSlug, sessionId });

    // ---- Lead ----
    let leadId: string | null = null;
    if (lead && (lead.email || lead.phone)) {
      const created = await leads.createLead({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        timeframe: lead.timeframe,
        budget_usd: res.budgetDetected ?? undefined,
        wants_test_drive: lead.wantsTestDrive ?? false,
        message: question,
        source: 'chatbot',
      });
      leadId = created.id;
      console.log(`[chat] lead capturado ${leadId} (${lead.timeframe ?? 'sin timeframe'})`);
    }

    // ---- Persistencia ----
    const messages = [
      ...trimmed,
      { role: 'user' as const, content: question },
      { role: 'assistant' as const, content: res.answer },
    ];

    await query(
      `INSERT INTO conversations (session_id, messages, budget_usd, lead_id)
       VALUES ($1, $2::jsonb, $3, $4)
       ON CONFLICT (session_id) DO UPDATE SET
         messages   = EXCLUDED.messages,
         budget_usd = COALESCE(EXCLUDED.budget_usd, conversations.budget_usd),
         lead_id    = COALESCE(EXCLUDED.lead_id, conversations.lead_id)`,
      [sessionId, JSON.stringify(messages), res.budgetDetected, leadId]
    ).catch((err) => {
      // Si falla el guardado, la respuesta igual sale: el usuario
      // no tiene por qué pagar un error de logging.
      console.error('[chat] no se pudo persistir la conversación:', err.message);
    });

    return NextResponse.json(
      {
        answer: res.answer,
        citations: res.citations,
        modelsShown: res.modelsShown,
        shouldCaptureLead: res.shouldCaptureLead,
        budgetDetected: res.budgetDetected,
        cached: res.cached,
        leadId,
      },
      { headers: { 'X-RateLimit-Remaining': String(rate.remaining) } }
    );
  } catch (err) {
    console.error('[chat] error:', err);
    return NextResponse.json(
      { error: 'No pude procesar la consulta. Probá de nuevo.' },
      { status: 500 }
    );
  }
}
