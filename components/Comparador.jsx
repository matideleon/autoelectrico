'use client';

import React, { useState, useMemo } from 'react';

/* ============================================================
   evuy — Comparador

   El problema real de este componente: cuando un modelo tiene
   autonomía real medida y el otro no, el ojo lee el hueco como
   "peor". Es una comparación injusta y sería mentir por omisión
   de diseño.

   Solución: los datos solo se comparan entre sí cuando son del
   MISMO tipo de fuente. Real contra real. WLTP contra WLTP.
   Si uno de los dos no tiene el dato, la fila no declara ganador.

   Selector: primero marca, después modelo. Hasta 3.
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

const fmt = (n) => (n == null ? null : new Intl.NumberFormat('es-UY').format(n));

/* Filas de comparación. `better` define qué dirección gana.
   `source` marca de dónde viene el dato: eso decide si se puede
   comparar o no. */
const ROWS = [
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
 * Devuelve null si no se puede comparar honestamente.
 */
function winnerOf(row, list) {
  if (row.better === 'none') return null;
  const vals = list.map((m) => m[row.key]);
  if (vals.some((v) => v == null)) return null;
  if (typeof vals[0] !== 'number') return null;
  const uniq = new Set(vals);
  if (uniq.size === 1) return null;
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
    <td style={{ ...S.td, background: isWinner ? 'rgba(61,220,151,0.07)' : 'transparent' }}>
      <span style={{ ...S.value, color: isLab ? C.lab : C.text, fontSize: typeof v === 'string' ? 12 : 17 }}>
        {display}
        {row.unit && typeof v === 'number' && <em style={S.unit}> {row.unit}</em>}
      </span>
      {isWinner && <span style={S.mark} aria-label="mejor valor">▲</span>}
      {incomparable && <span style={S.incomp} title="No se puede comparar: falta el dato en otro modelo">·</span>}
    </td>
  );
}

export default function Comparador({ models: dbModels }) {
  const MODELS_LIVE = useMemo(() => {
    if (!dbModels?.length) return [];
    return dbModels.map((m) => {
      const out = { ...m };
      const numFields = ['price_usd','battery_kwh','range_wltp_km','range_real_km','range_real_n','consumption_kwh_100','charge_ac_kw','charge_dc_kw','charge_10_80_min','power_hp','accel_0_100_s','seats','trunk_l'];
      for (const k of numFields) {
        if (out[k] != null) out[k] = Number(out[k]);
      }
      return out;
    });
  }, [dbModels]);

  // Marcas únicas ordenadas
  const brands = useMemo(() => {
    const set = new Set(MODELS_LIVE.map((m) => m.brand).filter(Boolean));
    return [...set].sort();
  }, [MODELS_LIVE]);

  const [selectedBrand, setSelectedBrand] = useState('');
  const [picked, setPicked] = useState([]);

  // Modelos de la marca seleccionada
  const brandModels = useMemo(() => {
    if (!selectedBrand) return [];
    return MODELS_LIVE.filter((m) => m.brand === selectedBrand);
  }, [MODELS_LIVE, selectedBrand]);

  const addModel = (slug) => {
    setPicked((p) => {
      if (p.includes(slug)) return p;
      if (p.length >= 3) return p;
      return [...p, slug];
    });
  };

  const removeModel = (slug) => {
    setPicked((p) => p.filter((s) => s !== slug));
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
            contra un hueco sería hacerle perder a quien todavía no midió. El
            precio no se muestra acá — varía por versión y promoción,
            consultalo directo con el importador.
          </p>
        </header>

        {/* Selector por marca → modelo */}
        <div style={S.selectorWrap}>
          {/* Marca */}
          <div style={S.selectGroup}>
            <label style={S.selectLabel}>Marca</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              style={S.select}
            >
              <option value="">Elegí una marca</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Modelo */}
          <div style={S.selectGroup}>
            <label style={S.selectLabel}>Modelo</label>
            <select
              value=""
              onChange={(e) => { if (e.target.value) addModel(e.target.value); }}
              disabled={!selectedBrand}
              style={{ ...S.select, opacity: selectedBrand ? 1 : 0.4 }}
            >
              <option value="">{selectedBrand ? 'Elegí modelo' : 'Elegí marca primero'}</option>
              {brandModels.map((m) => (
                <option key={m.slug} value={m.slug} disabled={picked.includes(m.slug)}>
                  {m.model}{m.variant ? ` ${m.variant}` : ''}{picked.includes(m.slug) ? ' (ya agregado)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chips de modelos seleccionados */}
        {picked.length > 0 && (
          <div style={S.chips}>
            {picked.map((slug) => {
              const m = MODELS_LIVE.find((x) => x.slug === slug);
              if (!m) return null;
              return (
                <button
                  key={slug}
                  onClick={() => removeModel(slug)}
                  style={S.chip}
                  className="chip-btn"
                >
                  {m.brand} {m.model}
                  <span style={S.chipX}> ×</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Tabla */}
        {list.length > 0 && (
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
                  if (!someHas) return null;
                  return (
                    <tr key={row.key} className="row">
                      <th scope="row" style={S.rowLabel}>
                        {row.label}
                        {row.source === 'lab' && (<span style={S.tagLab}>laboratorio</span>)}
                        {row.source === 'measured' && (<span style={S.tagReal}>medido acá</span>)}
                      </th>
                      {list.map((m, i) => (
                        <Cell key={m.slug} row={row} m={m} isWinner={w === i}
                          incomparable={hasGap && row.better !== 'none' && m[row.key] != null}
                        />
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {list.length === 0 && (
          <div style={S.empty}>
            <p style={S.emptyText}>Elegí una marca y hasta tres modelos para comparar.</p>
          </div>
        )}

        {list.length > 0 && (
          <div style={S.legend}>
            <span><em style={{ color: C.real }}>▲</em> mejor valor de la fila</span>
            <span><em style={{ color: C.faint }}>·</em> sin comparar: falta el dato en otro modelo</span>
            <span><em style={{ color: C.lab }}>■</em> cifra de fábrica, medida en laboratorio</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================ */

const mono = "'IBM Plex Mono', ui-monospace, Menlo, monospace";
const sans = "'IBM Plex Sans', -apple-system, sans-serif";

const S = {
  root: { background: C.bg, minHeight: '100vh', padding: '32px 20px 80px', fontFamily: sans, color: C.text },
  wrap: { maxWidth: 860, margin: '0 auto' },
  head: { marginBottom: 26 },
  eyebrow: { fontFamily: mono, fontSize: 11, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 },
  h1: { fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 12px', lineHeight: 1.1 },
  lede: { fontSize: 14, color: C.dim, lineHeight: 1.6, margin: 0, maxWidth: '56ch' },

  selectorWrap: { display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' },
  selectGroup: { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 200 },
  selectLabel: { fontFamily: mono, fontSize: 10, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.08em' },
  select: {
    fontFamily: mono, fontSize: 13, padding: '9px 11px',
    background: C.surface, color: C.text, border: `1px solid ${C.line}`,
    borderRadius: 3, outline: 'none', cursor: 'pointer',
  },

  chips: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 },
  chip: {
    fontFamily: mono, fontSize: 12, padding: '7px 12px',
    background: 'rgba(61,220,151,0.08)', color: C.real,
    border: `1px solid ${C.real}`, borderRadius: 2, cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 4, transition: 'all 140ms ease',
  },
  chipX: { color: C.faint, fontSize: 14 },

  empty: { background: C.surface, border: `1px solid ${C.line}`, borderRadius: 4, padding: '40px 20px', textAlign: 'center', marginBottom: 26 },
  emptyText: { color: C.dim, fontSize: 14, margin: 0 },

  scroll: { overflowX: 'auto', marginBottom: 20 },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 520 },
  caption: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' },
  srOnly: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' },
  th: { textAlign: 'left', padding: '0 14px 14px', borderBottom: `1px solid ${C.line}`, verticalAlign: 'bottom' },
  thFirst: { width: '30%', minWidth: 130 },
  thBrand: { fontFamily: mono, fontSize: 11, color: C.faint, letterSpacing: '0.06em' },
  thModel: { fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 2 },
  rowLabel: { fontFamily: mono, fontSize: 11, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', fontWeight: 400, padding: '13px 14px', borderBottom: `1px solid ${C.line}`, verticalAlign: 'middle' },
  td: { padding: '13px 14px', borderBottom: `1px solid ${C.line}`, verticalAlign: 'middle', whiteSpace: 'nowrap' },
  value: { fontFamily: mono, fontWeight: 500, letterSpacing: '-0.01em' },
  unit: { fontSize: 11, color: C.dim, fontStyle: 'normal' },
  missing: { fontFamily: mono, fontSize: 12, color: C.gap, fontStyle: 'italic' },
  mark: { color: C.real, fontSize: 8, marginLeft: 7, verticalAlign: 'middle' },
  incomp: { color: C.faint, fontSize: 14, marginLeft: 7, cursor: 'help' },
  tagLab: { display: 'block', fontSize: 9, color: C.lab, marginTop: 3, letterSpacing: '0.04em', textTransform: 'none' },
  tagReal: { display: 'block', fontSize: 9, color: C.real, marginTop: 3, letterSpacing: '0.04em', textTransform: 'none' },
  legend: { display: 'flex', gap: 20, flexWrap: 'wrap', fontFamily: mono, fontSize: 11, color: C.faint, paddingTop: 16, borderTop: `1px solid ${C.line}` },
};

const CSS = `
  * { box-sizing: border-box; }
  select:focus { border-color: ${C.real} !important; }
  .chip-btn:hover { background: rgba(61,220,151,0.15) !important; }
  .row:hover th, .row:hover td { background: ${C.surface}; }
  button:focus-visible { outline: 2px solid ${C.real}; outline-offset: 2px; }
  em { font-style: normal; }
  @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
`;
