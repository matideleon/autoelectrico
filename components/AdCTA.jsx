'use client';

import React from 'react';

/* ============================================================
   AdCTA — llamado a publicidad, al pie de cada página.
   Se monta una sola vez en layout.tsx.

   Compacto a propósito: es un pie de página, no una sección
   protagonista. Tipografía IBM Plex como todo el resto del sitio.
   ============================================================ */

const C = {
  surface: '#1B1E23',
  line: '#2A2E35',
  text: '#E6E8EB',
  dim: '#8A9099',
  faint: '#565C66',
  real: '#3DDC97',
};
const mono = "'IBM Plex Mono', ui-monospace, Menlo, monospace";
const sans = "'IBM Plex Sans', -apple-system, sans-serif";

const WHATSAPP_NUMBER = '59895904714';
const WHATSAPP_MSG = encodeURIComponent('Hola, quiero anunciar en autoelectrico.uy');
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

function IconWhatsapp() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.19 0 4.25.85 5.8 2.4a8.18 8.18 0 0 1 2.4 5.81c0 4.53-3.68 8.21-8.2 8.21a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.15 8.15 0 0 1-1.26-4.37c0-4.52 3.68-8.2 8.23-8.2Zm-4.42 4.7c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.03s.87 2.36 1 2.52c.12.16 1.68 2.68 4.14 3.66 2.05.82 2.46.66 2.91.62.45-.04 1.44-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42h-.4Z"/>
    </svg>
  );
}

export default function AdCTA() {
  return (
    <section style={S.wrap} aria-label="Publicidad en autoelectrico.uy">
      <style>{CSS}</style>
      <div style={S.inner}>
        <div style={S.left}>
          <div style={S.title}>
            Este sitio anda con electricidad.{' '}
            <span style={S.titleAccent}>Y con publicidad.</span>
          </div>
          <p style={S.text}>
            Mantener las fichas al día y verificar cada precio cuesta plata.
            Si tenés algo para ofrecerle a la comunidad EV, hablemos —{' '}
            <span style={S.promise}>sin pop-ups ni banners que te persigan, prometido.</span>
          </p>
        </div>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={S.btn}
          className="adcta-btn"
        >
          <IconWhatsapp />
          095 904 714
        </a>
      </div>
    </section>
  );
}

const S = {
  wrap: {
    background: C.surface,
    borderTop: `1px solid ${C.line}`,
    padding: '20px 20px',
    marginTop: 32,
  },
  inner: {
    maxWidth: 860,
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  left: { flex: '1 1 340px' },
  title: {
    fontFamily: sans,
    fontSize: 14,
    fontWeight: 600,
    color: C.text,
    lineHeight: 1.4,
    marginBottom: 5,
  },
  titleAccent: { color: C.real },
  text: {
    fontFamily: sans,
    fontSize: 12.5,
    color: C.dim,
    lineHeight: 1.55,
    margin: 0,
    maxWidth: '62ch',
  },
  promise: { color: C.faint },
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
    fontFamily: mono,
    fontSize: 12.5,
    fontWeight: 500,
    padding: '9px 16px',
    background: 'transparent',
    color: '#25D366',
    border: '1px solid #25D366',
    borderRadius: 6,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: 'background 140ms ease, color 140ms ease',
  },
};

const CSS = `
.adcta-btn:hover { background: #25D366 !important; color: #0B0F0D !important; }
@media (prefers-reduced-motion: reduce) { .adcta-btn { transition: none !important; } }
`;
