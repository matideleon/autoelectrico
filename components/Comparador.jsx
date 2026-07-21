'use client';

import React, { useState } from 'react';

/* ============================================================
   evuy — Comparador

   El problema real de este componente: cuando un modelo tiene
   autonomía real medida y el otro no, el ojo lee el hueco como
   "peor". Es una comparación injusta y sería mentir por omisión
   de diseño.

   Solución: los datos solo se comparan entre sí cuando son del
   MISMO tipo de fuente. Real contra real. WLTP contra WLTP.
   Si uno de los dos no tiene el dato, la fila no declara ganador.
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

const MODELS = [
  {
    slug: 'byd-dolphin-2026',
    brand: 'BYD',
    model: 'Dolphin',
    price_usd: 32900,
    price_updated_at: '2026-07-02',
    battery_kwh: 44.9,
    range_wltp_km: 340,
    range_real_km: 287,
    range_real_n: 14,
    consumption_kwh_100: 15.6,
    charge_ac_kw: 7,
    charge_dc_kw: 60,
    charge_10_80_min: 38,
    power_hp: 204,
    accel_0_100_s: 7.0,
    seats: 5,
    trunk_l: 345,
    warranty_battery: '8 años / 160.000 km',
  },
  {
    slug: 'geely-ex5-2026',
    brand: 'Geely',
    model: 'EX5',
    price_usd: null,
    price_updated_at: null,
    battery_kwh: 60.22,
    range_wltp_km: 430,
    range_real_km: null,
    range_real_n: null,
    consumption_kwh_100: null,
    charge_ac_kw: 11,
    charge_dc_kw: 100,
    charge_10_80_min: null,
    power_hp: 218,
    accel_0_100_s: 6.9,
    seats: 5,
    trunk_l: 410,
    warranty_battery: null,
  },
  {
    slug: 'byd-yuan-plus-2026',
    brand: 'BYD',
    model: 'Yuan Plus',
    price_usd: 41500,
    price_updated_at: '2026-06-28',
    battery_kwh: 60.48,
    range_wltp_km: 430,
    range_real_km: 371,
    range_real_n: 9,
    consumption_kwh_100: 16.3,
    charge_ac_kw: 7,
    charge_dc_kw: 89,
    charge_10_80_min: 30,
    power_hp: 204,
    accel_0_100_s: 7.3,
    seats: 5,
    trunk_l: 440,
    warranty_battery: '8 años / 160.000 km',
  },
];

const fmt = (n) => (n == null ? null : new Intl.NumberFormat('es-UY').format(n));

/* Filas de comparación. `better` define qué dirección gana.
   `source` marca de dónde viene el dato: eso decide si se puede
   comparar o no. */
const ROWS = [
  { key: 'price_usd', label: 'Precio', unit: 'USD', better: 'lower', source: 'quoted', prefix: true },
  { key: 'range_real_km', label: 'Autonomía real', unit: 'km', better: 'higher', source: 'measured' },
  { key: 'range_wltp_km', label: 'Autonomía WLTP', unit: 'km', better: 'higher', source: 'lab' },
  { key: 'battery_kwh', label: 'Batería', unit: 'kWh', better: 'higher', source: 'spec' },
  { key: 'consumption_kwh_100', label: 'Consumo', unit: 'kWh/100km', better: 'lower', source: 'measured' },
  { key: 'charge_dc_kw', label: 'Carga DC', unit: 'kW', better: 'higher', source: 'spec' },
  { key: 'charge_10_80_min', label: '10 → 80 %', unit: 'min', better: 'lower', source: 'spec' },
  { key: 'charge_ac_kw', label: 'Carga AC', unit: 'kW', better: 'higher', source: 'spec' },
  { key: 'power_hp', label: 'Potencia', unit: 'HP', better: 'higher', source: 'spec' },
  { key: 'accel_0_100_s', label: '0 → 100 km/h', unit: 's', better: 'lower', source: 'spec' },
  { key: 'trunk_l', label: 'Baúl', unit: 'L', better: 'higher', source: 'spec' },
  { key: 'seats', label: 'Plazas', unit: '', better: 'none', source: 'spec' },
  { key: 'warranty_battery', label: 'Garantía batería', unit: '', better: 'none', source: 'spec' },
];

/**
 * Decide el ganador de una fila.
 * Devuelve null si no se puede comparar honestamente:
 * - si algún modelo no tiene el dato
 * - si todos empatan
 * Comparar contra un hueco sería declarar perdedor a quien
 * simplemente no midió todavía.
 */
function winnerOf(row, list) {
  if (row.better === 'none') return null;

  const vals = list.map((m) => m[row.key]);
  if (vals.some((v) => v == null)) return null;      // dato incompleto → sin ganador
  if (typeof vals[0] !== 'number') return null;

  const uniq = new Set(vals);
  if (uniq.size === 1) return null;                   // empate

  const best = row.better === 'lower' ? Math.min(...vals) : Math.max(...vals);
  return list.findIndex((m) => m[row.key] === best);
}

function Cell({ row, m, isWinner, incomparable }) {
  const v = m[row.key];

  if (v == null) {
    return (
      <td style={S.td}>
        <span style={S.missing}>sin medir</span>
      </td>
    );
  }

  const display = typeof v === 'number' ? fmt(v) : v;
  const isLab = row.source === 'lab';

  return (
    <td
      style={{
        ...S.td,
        background: isWinner ? 'rgba(61,220,151,0.07)' : 'transparent',
      }}
    >
      <span
        style={{
          ...S.value,
          color: isLab ? C.lab : C.text,
          fontSize: typeof v === 'string' ? 12 : 17,
        }}
      >
        {row.prefix && <em style={S.pre}>USD </em>}
        {display}
        {row.unit && typeof v === 'number' && <em style={S.unit}> {row.unit}</em>}
      </span>
      {isWinner && <span style={S.mark} aria-label="mejor valor">▲</span>}
      {incomparable && <span style={S.incomp} title="No se puede comparar: falta el dato en otro modelo">·</span>}
    </td>
  );
}

export default function Comparador({ models: dbModels }) {
  /* Con datos de la DB los usa; sin ellos, el demo. pg manda
     numeric como string: se normaliza a number acá. */
  const MODELS_LIVE = (dbModels?.length ? dbModels : MODELS).map((m) => {
    const out = { ...m };
    for (const k of ['price_usd','battery_kwh','range_wltp_km','range_real_km','range_real_n','consumption_kwh_100','charge_ac_kw','charge_dc_kw','charge_10_80_min','power_hp','accel_0_100_s','seats','trunk_l']) {
      if (out[k] != null) out[k] = Number(out[k]);
    }
    return out;
  });

  const defaults = MODELS_LIVE.slice(0, 2).map((m) => m.slug);
  const [picked, setPicked] = useState(defaults);

  const toggle = (slug) => {
    setPicked((p) =>
      p.includes(slug)
        ? p.length > 1 ? p.filter((s) => s !== slug) : p
        : p.length < 3 ? [...p, slug] : p
    );
  };

  const list = MODELS_LIVE.filter((m) => picked.includes(m.slug));

  return (
    <div style={S.root}>
      <style>{CSS}</style>

      <div style={S.wrap}>
        <header style={S.head}>
          <div style={S.eyebrow}>Comparador</div>
          <h1 style={S.h1}>Poné los números lado a lado</h1>
          <p style={S.lede}>
            Hasta tres modelos. Cuando falta un dato lo decimos: comparar
            contra un hueco sería hacerle perder a quien todavía no midió.
          </p>
        </header>

        {/* Selector */}
        <div style={S.picker} role="group" aria-label="Elegir modelos">
          {MODELS_LIVE.map((m) => {
            const on = picked.includes(m.slug);
            return (
              <button
                key={m.slug}
                onClick={() => toggle(m.slug)}
                className="pick"
                aria-pressed={on}
                style={{
                  ...S.pickBtn,
                  borderColor: on ? C.real : C.line,
                  color: on ? C.real : C.dim,
                  background: on ? 'rgba(61,220,151,0.06)' : 'transparent',
                }}
              >
                <span style={S.pickBrand}>{m.brand}</span> {m.model}
              </button>
            );
          })}
        </div>

        {/* Tabla */}
        <div style={S.scroll}>
          <table style={S.table}>
            <caption style={S.caption}>
              Comparación de {list.length} modelos eléctricos disponibles en Uruguay
            </caption>
            <thead>
              <tr>
                <th style={{ ...S.th, ...S.thFirst }} scope="col">
                  <span style={S.srOnly}>Dato</span>
                </th>
                {list.map((m) => (
                  <th key={m.slug} style={S.th} scope="col">
                    <div style={S.thBrand}>{m.brand}</div>
                    <div style={S.thModel}>{m.model}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => {
                const w = winnerOf(row, list);
                const hasGap = list.some((m) => m[row.key] == null);
                const someHas = list.some((m) => m[row.key] != null);
                if (!someHas) return null; // fila que nadie tiene: no se muestra

                return (
                  <tr key={row.key} className="row">
                    <th scope="row" style={S.rowLabel}>
                      {row.label}
                      {row.source === 'lab' && (
                        <span style={S.tagLab}>laboratorio</span>
                      )}
                      {row.source === 'measured' && (
                        <span style={S.tagReal}>medido acá</span>
                      )}
                    </th>
                    {list.map((m, i) => (
                      <Cell
                        key={m.slug}
                        row={row}
                        m={m}
                        isWinner={w === i}
                        incomparable={hasGap && row.better !== 'none' && m[row.key] != null}
                      />
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={S.legend}>
          <span>
            <em style={{ color: C.real }}>▲</em> mejor valor de la fila
          </span>
          <span>
            <em style={{ color: C.faint }}>·</em> sin comparar: falta el dato en
            otro modelo
          </span>
          <span>
            <em style={{ color: C.lab }}>■</em> cifra de fábrica, medida en
            laboratorio
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================ */

const mono = "'IBM Plex Mono', ui-monospace, Menlo, monospace";
const sans = "'IBM Plex Sans', -apple-system, sans-serif";

const S = {
  root: {
    background: C.bg,
    minHeight: '100vh',
    padding: '32px 20px 80px',
    fontFamily: sans,
    color: C.text,
  },
  wrap: { maxWidth: 860, margin: '0 auto' },
  head: { marginBottom: 26 },
  eyebrow: {
    fontFamily: mono,
    fontSize: 11,
    color: C.dim,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    marginBottom: 12,
  },
  h1: {
    fontSize: 'clamp(28px, 6vw, 40px)',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    margin: '0 0 12px',
    lineHeight: 1.1,
  },
  lede: {
    fontSize: 14,
    color: C.dim,
    lineHeight: 1.6,
    margin: 0,
    maxWidth: '56ch',
  },
  picker: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 26,
  },
  pickBtn: {
    fontFamily: mono,
    fontSize: 12,
    padding: '9px 14px',
    border: '1px solid',
    borderRadius: 2,
    cursor: 'pointer',
    transition: 'all 140ms ease',
  },
  pickBrand: { color: C.faint },
  scroll: { overflowX: 'auto', marginBottom: 20 },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: 520,
  },
  caption: {
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
  },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
  },
  th: {
    textAlign: 'left',
    padding: '0 14px 14px',
    borderBottom: `1px solid ${C.line}`,
    verticalAlign: 'bottom',
  },
  thFirst: { width: '30%', minWidth: 130 },
  thBrand: { fontFamily: mono, fontSize: 11, color: C.faint, letterSpacing: '0.06em' },
  thModel: { fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 2 },
  rowLabel: {
    fontFamily: mono,
    fontSize: 11,
    color: C.dim,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    textAlign: 'left',
    fontWeight: 400,
    padding: '13px 14px',
    borderBottom: `1px solid ${C.line}`,
    verticalAlign: 'middle',
  },
  td: {
    padding: '13px 14px',
    borderBottom: `1px solid ${C.line}`,
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
  },
  value: {
    fontFamily: mono,
    fontWeight: 500,
    letterSpacing: '-0.01em',
  },
  pre: { fontSize: 11, color: C.dim, fontStyle: 'normal' },
  unit: { fontSize: 11, color: C.dim, fontStyle: 'normal' },
  missing: {
    fontFamily: mono,
    fontSize: 12,
    color: C.gap,
    fontStyle: 'italic',
  },
  mark: { color: C.real, fontSize: 8, marginLeft: 7, verticalAlign: 'middle' },
  incomp: { color: C.faint, fontSize: 14, marginLeft: 7, cursor: 'help' },
  tagLab: {
    display: 'block',
    fontSize: 9,
    color: C.lab,
    marginTop: 3,
    letterSpacing: '0.04em',
    textTransform: 'none',
  },
  tagReal: {
    display: 'block',
    fontSize: 9,
    color: C.real,
    marginTop: 3,
    letterSpacing: '0.04em',
    textTransform: 'none',
  },
  legend: {
    display: 'flex',
    gap: 20,
    flexWrap: 'wrap',
    fontFamily: mono,
    fontSize: 11,
    color: C.faint,
    paddingTop: 16,
    borderTop: `1px solid ${C.line}`,
  },
};

const CSS = `
* { box-sizing: border-box; }
.pick:hover { border-color: ${C.dim} !important; }
.row:hover th, .row:hover td { background: ${C.surface}; }
button:focus-visible { outline: 2px solid ${C.real}; outline-offset: 2px; }
em { font-style: normal; }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
`;
