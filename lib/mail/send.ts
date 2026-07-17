// ============================================================
// evuy — Mails transaccionales
//
// El de bienvenida hace una sola cosa además de confirmar:
// preguntar qué querés saber que hoy no encontrás. Las respuestas
// son el roadmap del producto, gratis y de gente real.
// ============================================================

import { SITE } from '../seo/model';

const FROM = process.env.MAIL_FROM ?? 'autoelectrico.uy <hola@autoelectrico.uy>';

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

async function send({ to, subject, html, text, replyTo }: SendArgs): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('Falta RESEND_API_KEY');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      subject,
      html,
      text,
      reply_to: replyTo ?? process.env.MAIL_REPLY_TO,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend ${res.status}: ${body.slice(0, 200)}`);
  }
}

/**
 * Mail de confirmación (double opt-in).
 * Diseño: texto plano estilizado. Los mails con imágenes y
 * columnas caen en promociones; este tiene que llegar al inbox.
 */
export async function sendConfirmation(args: {
  to: string;
  name?: string;
  token: string;
}): Promise<void> {
  const url = `${SITE}/confirmar?token=${args.token}`;
  const hi = args.name ? `Hola ${args.name},` : 'Hola,';

  const text = `${hi}

Confirmá tu suscripción a autoelectrico.uy acá:
${url}

Después, si tenés un segundo: ¿qué querés saber de los autos eléctricos que hoy no encontrás en ningún lado?

Respondé este mail y lo leo yo.

—
autoelectrico.uy · Punta del Este
Si no te suscribiste, ignorá este mail.`;

  const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>Confirmá tu suscripción</title></head>
<body style="margin:0;padding:32px 16px;background:#141619;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;width:100%;">
    <tr><td>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#E6E8EB;">${hi}</p>
      <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#8A9099;">
        Tocá el botón para confirmar y quedás adentro.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
        <tr><td style="background:#3DDC97;border-radius:2px;">
          <a href="${url}" style="display:inline-block;padding:13px 24px;font-family:ui-monospace,Menlo,monospace;font-size:13px;font-weight:500;color:#141619;text-decoration:none;letter-spacing:0.03em;">
            Confirmar suscripción
          </a>
        </td></tr>
      </table>
      <div style="padding-top:24px;border-top:1px solid #2A2E35;">
        <p style="margin:0 0 8px;font-size:14px;line-height:1.7;color:#8A9099;">
          Y ya que estás, una pregunta:
        </p>
        <p style="margin:0 0 8px;font-size:15px;line-height:1.7;color:#E6E8EB;font-weight:600;">
          ¿Qué querés saber de los eléctricos que hoy no encontrás en ningún lado?
        </p>
        <p style="margin:0;font-size:14px;line-height:1.7;color:#8A9099;">
          Respondé este mail. Lo leo yo, no un sistema.
        </p>
      </div>
      <p style="margin:32px 0 0;padding-top:20px;border-top:1px solid #2A2E35;font-family:ui-monospace,Menlo,monospace;font-size:11px;line-height:1.6;color:#565C66;">
        autoelectrico.uy · Punta del Este, Uruguay<br>
        Si no te suscribiste, ignorá este mail y no pasa nada.<br>
        <span style="color:#4A505A;">Si el botón no anda: ${url}</span>
      </p>
    </td></tr>
  </table>
</body></html>`;

  await send({
    to: args.to,
    subject: 'Confirmá tu suscripción a autoelectrico.uy',
    html,
    text,
  });
}
