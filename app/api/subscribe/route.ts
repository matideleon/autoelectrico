// ============================================================
// evuy — POST /api/subscribe
//
// El endpoint más importante de la semana 1. Si esto falla,
// no hay audiencia y no hay negocio.
//
// Blindado contra: mails inválidos, bots, dobles submit,
// caída de Resend.
// ============================================================

import { NextResponse, type NextRequest } from 'next/server';
import * as subscribers from '@/lib/db/subscribers';
import { sendConfirmation } from '@/lib/mail/send';
import { redis } from '@/lib/rag/cache';
import type { BuyerTimeframe } from '@/lib/db/types';

export const runtime = 'nodejs';

const VALID_TIMEFRAMES: BuyerTimeframe[] = ['lt_3m', '3_6m', '6_12m', 'browsing'];
const RATE_LIMIT = 5;
const RATE_WINDOW = 60 * 60;

interface Body {
  email?: string;
  name?: string;
  model_interest?: string[];
  timeframe?: string;
  source?: string;
  /** Honeypot: los bots lo llenan, las personas no lo ven. */
  website?: string;
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    'unknown'
  );
}

async function checkRate(ip: string): Promise<boolean> {
  try {
    const key = `rl:sub:${ip}`;
    const n = await redis.incr(key);
    if (n === 1) await redis.expire(key, RATE_WINDOW);
    return n <= RATE_LIMIT;
  } catch {
    return true; // Redis caído no puede costarte una suscripción
  }
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Formato inválido' }, { status: 400 });
  }

  // Honeypot: se responde 200 para que el bot crea que funcionó.
  if (body.website) {
    console.log('[subscribe] honeypot activado');
    return NextResponse.json({ ok: true });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) {
    return NextResponse.json({ error: 'Revisá el mail' }, { status: 400 });
  }
  if (email.length > 254) {
    return NextResponse.json({ error: 'Mail demasiado largo' }, { status: 400 });
  }

  if (!(await checkRate(clientIp(req)))) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Probá más tarde.' },
      { status: 429 }
    );
  }

  const timeframe =
    body.timeframe && VALID_TIMEFRAMES.includes(body.timeframe as BuyerTimeframe)
      ? (body.timeframe as BuyerTimeframe)
      : undefined;

  try {
    const { subscriber, token, alreadyConfirmed } = await subscribers.subscribe({
      email,
      name: body.name?.trim().slice(0, 100),
      model_interest: Array.isArray(body.model_interest)
        ? body.model_interest.slice(0, 20)
        : [],
      timeframe,
      source: body.source?.slice(0, 40) ?? 'landing',
    });

    // Ya confirmado: no se re-manda mail, pero se responde ok.
    // Decir "ya estás suscrito" filtra quién está en la lista.
    if (alreadyConfirmed) {
      console.log(`[subscribe] ${email} ya confirmado`);
      return NextResponse.json({ ok: true });
    }

    try {
      await sendConfirmation({ to: email, name: subscriber.name ?? undefined, token });
    } catch (err) {
      // El mail quedó guardado: eso es lo que importa. El envío
      // se puede reintentar; el dato no se pierde.
      console.error('[subscribe] falló el envío, mail guardado igual:', err);
      return NextResponse.json(
        { ok: true, warning: 'guardado, mail demorado' },
        { status: 202 }
      );
    }

    console.log(`[subscribe] ✓ ${email} (${timeframe ?? 'sin timeframe'})`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[subscribe] error:', err);
    return NextResponse.json(
      { error: 'No pudimos guardarlo. Probá de nuevo.' },
      { status: 500 }
    );
  }
}
