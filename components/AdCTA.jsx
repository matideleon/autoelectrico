'use client';

import React from 'react';

/* ============================================================
   AdCTA — llamado a publicidad, al pie de cada página.

   Se monta una sola vez en layout.tsx.

   Decisiones de diseño:
   - Titular en Instrument Serif: la fuente ya la carga el sitio
     pero no se usaba en ningún lado. Rompe la monotonía del
     IBM Plex sin sumar peso de carga.
   - Rayo decorativo enorme al fondo, muy tenue: da textura sin
     competir con el texto.
   - El texto reconoce que la publicidad puede ser molesta, en vez
     de fingir que no. Es el mismo tono del resto del sitio.

   WhatsApp en formato internacional: 598 + número sin el 0.
   ============================================================ */

const C = {
  bg: '#141619',
  surface: '#1B1E23',
  line: '#2A2E35',
  text: '#E6E8EB',
  dim: '#8A9099',
  faint: '#565C66',
  real: '#3DDC97',
};
const mono = "'IBM Plex Mono', ui-monospace, Menlo, monospace";
const sans = "'IBM Plex Sans', -apple-system, sans-serif";
const serif = "'Instrument Serif', Georgia, serif";

const WHATSAPP_NUMBER = '59895904714';
const WHATSAPP_MSG = encodeURIComponent('Hola, quiero anunciar en autoelectrico.uy');
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

function IconWhatsapp() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.19 0 4.25.85 5.8 2.4a8.18 8.18 0 0 1 2.4 5.81c0 4.53-3.68 8.21-8.2 8.21a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.15 8.15 0 0 1-1.26-4.37c0-4.52 3.68-8.2 8.23-8.2Zm-4.42 4.7c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.03s.87 2.36 1 2.52c.12.16 1.68 2.68 4.14 3.66 2.05.82 2.46.66 2.91.62.45-.04 1.44-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42h-.4Z"/>
    </svg>
  );
}

export default function AdCTA() {
  return (
    <section style={S.wrap} aria-label="Publicidad en autoelectrico.uy">
      <style>{CSS}</style>

      {/* Rayo decorativo de fondo */}
      <svg style={S.bolt} viewBox="0 0 100 140" aria-hidden="true">
        <path
          d="M62 2 18 78h30l-12 60 46-82H52L62 2Z"
          fill="none"
          stroke={C.real}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>

      <div style={S.inner}>
        <div style={S.left}>
          <div style={S.eyebrow}>Publicidad</div>
          <h2 style={S.title}>
            Este sitio anda con electricidad.
            <br />
            <span style={S.titleAccent}>Y con publicidad.</span>
          </h2>
          <p style={S.text}>
            Mantener las fichas al día, verificar cada precio con su fuente y
            pagar el servidor cuesta plata. Si tenés algo que ofrecerle a la
            comunidad EV de Uruguay, hablemos.
          </p>
          <p style={S.promise}>
            Sin pop-ups. Sin banners que te persigan por la pantalla. Sin
            autoplay con sonido. Prometido.
          </p>
        </div>

        <div style={S.right}>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={S.btn}
            className="adcta-btn"
          >
            <IconWhatsapp />
            Hablemos por WhatsApp
          </a>
          <div style={S.phone}>095 904 714</div>
        </div>
      </div>
    </section>
  );
}

const S = {
  wrap: {
    position: 'relative',
    overflow: 'hidden',
    background: `
      radial-gradient(40rem 20rem at 15% 0%, rgba(61,220,151,0.07), transparent 65%),
      radial-gradient(35rem 18rem at 85% 100%, rgba(124,158,255,0.05), transparent 65%),
      ${C.surface}
    `,
    borderTop: `1px solid ${C.line}`,
    padding: '44px 20px 40px',
    marginTop: 40,
  },
  bolt: {
    position: 'absolute',
    right: '4%',
    top: '50%',
    transform: 'translateY(-50%)',
    height: 190,
    opacity: 0.05,
    pointerEvents: 'none',
  },
  inner: {
    position: 'relative',
    maxWidth: 860,
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 28,
  },
  left: { flex: '1 1 340px' },
  eyebrow: {
    fontFamily: mono,
    fontSize: 10.5,
    color: C.real,
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    marginBottom: 12,
  },
  title: {
    fontFamily: serif,
    fontSize: 'clamp(26px, 4.5vw, 36px)',
    fontWeight: 400,
    lineHeight: 1.15,
    letterSpacing: '-0.01em',
    color: C.text,
    margin: '0 0 14px',
  },
  titleAccent: { color: C.real, fontStyle: 'italic' },
  text: {
    fontFamily: sans,
    fontSize: 14.5,
    color: C.dim,
    lineHeight: 1.65,
    margin: '0 0 12px',
    maxWidth: '48ch',
  },
  promise: {
    fontFamily: mono,
    fontSize: 11.5,
    color: C.faint,
    lineHeight: 1.7,
    margin: 0,
    maxWidth: '46ch',
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
    flexShrink: 0,
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    fontFamily: mono,
    fontSize: 13.5,
    fontWeight: 500,
    padding: '13px 22px',
    background: '#25D366',
    color: '#0B0F0D',
    borderRadius: 8,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 20px rgba(37,211,102,0.18)',
    transition: 'transform 140ms ease, box-shadow 140ms ease',
  },
  phone: {
    fontFamily: mono,
    fontSize: 12,
    color: C.faint,
    letterSpacing: '0.04em',
    paddingLeft: 2,
  },
};

const CSS = `
.adcta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(37,211,102,0.28);
}
@media (prefers-reduced-motion: reduce) {
  .adcta-btn { transition: none !important; }
  .adcta-btn:hover { transform: none !important; }
}
`;
