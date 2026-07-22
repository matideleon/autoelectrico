'use client';

import React from 'react';

/* ============================================================
   autoelectrico.uy — Grid de modelos

   Recibe los modelos de la DB por props (server component los
   trae). Cada tarjeta muestra lo esencial: precio, autonomía
   real vs WLTP, y el estado del dato.
   ============================================================ */

const C = {
  bg: '#141619',
  surface: '#1B1E23',
  line: '#2A2E35',
  text: '#E6E8EB',
  dim: '#8A9099',
  faint: '#565C66',
  real: '#3DDC97',
  lab: '#E8A33D',
  gap: '#4A505A',
};

const mono = "'IBM Plex Mono', ui-monospace, Menlo, monospace";
const sans = "'IBM Plex Sans', -apple-system, sans-serif";

const fmt = (n) => (n == null ? null : new Intl.NumberFormat('es-UY').format(Number(n)));

function ModelCard({ m }) {
  const real = m.range_real_km != null ? Number(m.range_real_km) : null;
  const wltp = m.range_wltp_km != null ? Number(m.range_wltp_km) : null;

  return (
    <a href={`/modelos/${m.slug}`} className="model-card" style={S.card}>
      <div style={S.cardHead}>
        <div>
          <div style={S.brand}>{m.brand}</div>
          <div style={S.model}>
            {m.model}
            {m.variant ? ` ${m.variant}` : ''}
          </div>
        </div>
        <div style={S.body}>{m.body === 'suv' ? 'SUV' : m.body === 'hatchback' ? 'Hatchback' : m.body}</div>
      </div>

      <div style={S.price}>
        <span style={S.noPrice}>consultá el precio</span>
      </div>

      <div style={S.ranges}>
        <div style={S.rangeRow}>
          <span style={{ ...S.rangeLabel, color: real ? C.real : C.gap }}>
            Autonomía real
          </span>
          <span style={{ ...S.rangeVal, color: real ? C.real : C.gap }}>
            {real ? (
              <>
                {fmt(real)} <em style={S.unit}>km</em>
                {m.range_real_n ? <em style={S.n}> · {m.range_real_n} mediciones</em> : null}
              </>
            ) : (
              <em style={S.pending}>sin medir</em>
            )}
          </span>
        </div>
        <div style={S.rangeRow}>
          <span style={{ ...S.rangeLabel, color: C.lab }}>WLTP fábrica</span>
          <span style={{ ...S.rangeVal, color: C.lab }}>
            {wltp ? <>{fmt(wltp)} <em style={S.unit}>km</em></> : '—'}
          </span>
        </div>
      </div>

      <div style={S.cardFoot}>Ver ficha completa →</div>
    </a>
  );
}

export default function ModelGrid({ models = [] }) {
  return (
    <div style={S.root}>
      <style>{CSS}</style>
      <div style={S.wrap}>
        <header style={S.head}>
          <div style={S.eyebrow}>Catálogo</div>
          <h1 style={S.h1}>Los eléctricos que se venden en Uruguay</h1>
          <p style={S.lede}>
            Cada ficha muestra el dato de fábrica y el real medido acá. Cuando
            no lo tenemos, lo decimos.
          </p>
        </header>

        {models.length === 0 ? (
          <div style={S.empty}>No hay modelos publicados todavía.</div>
        ) : (
          <div style={S.grid}>
            {models.map((m) => (
              <ModelCard key={m.slug} m={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  root: {
    background: C.bg,
    minHeight: '100vh',
    padding: '40px 20px 80px',
    fontFamily: sans,
    color: C.text,
  },
  wrap: { maxWidth: 860, margin: '0 auto' },
  head: { marginBottom: 32 },
  eyebrow: {
    fontFamily: mono,
    fontSize: 11,
    color: C.dim,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    marginBottom: 12,
  },
  h1: {
    fontSize: 'clamp(26px, 5.5vw, 38px)',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    margin: '0 0 12px',
    lineHeight: 1.15,
  },
  lede: {
    fontSize: 14,
    color: C.dim,
    lineHeight: 1.6,
    margin: 0,
    maxWidth: '54ch',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 14,
  },
  card: {
    display: 'block',
    padding: '18px',
    background: C.surface,
    border: `1px solid ${C.line}`,
    borderRadius: 4,
    textDecoration: 'none',
    color: C.text,
    transition: 'border-color 150ms ease, transform 150ms ease',
  },
  cardHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  brand: {
    fontFamily: mono,
    fontSize: 11,
    color: C.faint,
    letterSpacing: '0.06em',
  },
  model: {
    fontSize: 19,
    fontWeight: 600,
    letterSpacing: '-0.01em',
    marginTop: 2,
  },
  body: {
    fontFamily: mono,
    fontSize: 10,
    color: C.dim,
    padding: '3px 8px',
    border: `1px solid ${C.line}`,
    borderRadius: 2,
  },
  price: {
    fontFamily: mono,
    fontSize: 22,
    fontWeight: 500,
    marginBottom: 16,
    letterSpacing: '-0.01em',
  },
  currency: { fontSize: 12, color: C.dim, fontStyle: 'normal' },
  noPrice: {
    fontSize: 13,
    fontStyle: 'italic',
    color: C.gap,
    fontWeight: 400,
  },
  ranges: {
    display: 'flex',
    flexDirection: 'column',
    gap: 7,
    paddingTop: 14,
    borderTop: `1px solid ${C.line}`,
    marginBottom: 14,
  },
  rangeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 10,
  },
  rangeLabel: {
    fontFamily: mono,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  rangeVal: {
    fontFamily: mono,
    fontSize: 13,
    fontWeight: 500,
  },
  unit: { fontSize: 10, color: C.dim, fontStyle: 'normal' },
  n: { fontSize: 9, color: C.faint, fontStyle: 'normal' },
  pending: { fontSize: 11, fontStyle: 'italic' },
  cardFoot: {
    fontFamily: mono,
    fontSize: 11,
    color: C.real,
  },
  empty: {
    padding: '40px',
    textAlign: 'center',
    color: C.faint,
    fontFamily: mono,
    fontSize: 13,
  },
};

const CSS = `
.model-card:hover { border-color: ${C.real} !important; transform: translateY(-2px); }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
`;
