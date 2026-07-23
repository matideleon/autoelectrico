'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';

/* ============================================================
   autoelectrico.uy — Comparador (v2)

   El problema real de este componente: cuando un modelo tiene
   autonomía real medida y el otro no, el ojo lee el hueco como
   "peor". Es una comparación injusta y sería mentir por omisión
   de diseño.

   Solución: los datos solo se comparan entre sí cuando son del
   MISMO tipo de fuente. Real contra real. WLTP contra WLTP.
   Si uno de los dos no tiene el dato, la fila no declara ganador.

   v2: buscador único (marca o modelo, un solo campo) en vez de
   dos selects en cascada. Hasta 5 modelos. El precio vuelve a
   la tabla, pero con la misma regla que en /ahorro: se muestra
   solo si está verificado con fuente — si no, dice "consultar",
   nunca un número inventado.
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

const MAX_MODELS = 5;

const fmt = (n) => (n == null ? null : new Intl.NumberFormat('es-UY').format(n));

const ROWS = [
  { key: 'price_usd', label: 'Precio', unit: 'USD', better: 'lower', source: 'quoted' },
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

function Cell({ row, m, isWinner, incomparable, styles }) {
  const v = m[row.key];
  const isPrice = row.key === 'price_usd';

  if (v == null) {
    return (
      <td style={styles.td}>
        <span style={styles.missing}>{isPrice ? 'consultar' : 'sin medir'}</span>
      </td>
    );
  }
  const display = typeof v === 'number' ? fmt(v) : v;
  const isLab = row.source === 'lab';
  const isQuoted = row.source === 'quoted';
  return (
    <td style={{ ...styles.td, background: isWinner ? 'rgba(61,220,151,0.07)' : 'transparent' }}>
      <span style={{ ...styles.value, color: isLab ? C.lab : C.text, fontSize: typeof v === 'string' ? 12 : 17 }}>
        {isPrice && <em style={styles.unit}>USD </em>}
        {display}
        {row.unit && typeof v === 'number' && !isPrice && <em style={styles.unit}> {row.unit}</em>}
      </span>
      {isWinner && <span style={styles.mark} aria-label="mejor valor">▲</span>}
      {incomparable && <span style={styles.incomp} title="No se puede comparar: falta el dato en otro modelo">·</span>}
      {isQuoted && v != null && <span style={styles.tagQuoted}>con fuente citada</span>}
    </td>
  );
}

export default function Comparador({ models: dbModels }) {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const handler = () => setTimeout(() => setWidth(window.innerWidth), 0);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const isMobile = width < 600;
  const styles = isMobile ? mobileStyles : baseStyles;

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

  const [picked, setPicked] = useState([]);
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !MODELS_LIVE.length) return;
    const params = new URLSearchParams(window.location.search);
    const ids = params.get('ids');
    if (!ids) return;
    const slugs = ids.split(',').filter((s) => MODELS_LIVE.some((m) => m.slug === s));
    if (slugs.length) setPicked(slugs.slice(0, MAX_MODELS));
  }, [MODELS_LIVE]);

  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setFocused(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return MODELS_LIVE
      .filter((m) => !picked.includes(m.slug))
      .filter((m) => `${m.brand} ${m.model} ${m.variant ?? ''}`.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, MODELS_LIVE, picked]);

  const addModel = (slug) => {
    setPicked((p) => {
      if (p.includes(slug) || p.length >= MAX_MODELS) return p;
      return [...p, slug];
    });
    setQuery('');
  };

  const removeModel = (slug) => setPicked((p) => p.filter((s) => s !== slug));
  const clearAll = () => setPicked([]);

  const list = MODELS_LIVE.filter((m) => picked.includes(m.slug));

  const [shareLabel, setShareLabel] = useState('Compartir');
  const share = async () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.search = picked.length ? `?ids=${picked.join(',')}` : '';
    window.history.replaceState(null, '', url.toString());
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Comparativa de eléctricos', url: url.toString() });
      } else {
        await navigator.clipboard.writeText(url.toString());
        setShareLabel('¡Copiado!');
        setTimeout(() => setShareLabel('Compartir'), 1800);
      }
    } catch {
      // el usuario canceló el share nativo, no hacer nada
    }
  };

  return (
    <div style={styles.root}>
      <style>{CSS}</style>
      <div style={styles.wrap}>
        <header style={styles.head}>
          <div style={styles.eyebrow}>Comparador</div>
          <h1 style={styles.h1}>Poné los números lado a lado</h1>
          <p style={styles.lede}>
            Hasta {MAX_MODELS} modelos. Cuando falta un dato lo decimos:
            comparar contra un hueco sería hacerle perder a quien todavía no
            midió. El precio aparece solo cuando está verificado con fuente.
          </p>

          <div style={styles.badges}>
            <span style={styles.badge}>Hasta {MAX_MODELS} modelos</span>
            <span style={styles.badge}>Datos citados con fuente</span>
            <span style={styles.badge}>Compartí tu comparativa</span>
          </div>
        </header>

        <div style={styles.searchBox} ref={boxRef}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder={
              picked.length >= MAX_MODELS
                ? `Ya elegiste ${MAX_MODELS} modelos — sacá uno para agregar otro`
                : 'Buscá por marca o modelo (ej: BYD, EX5, Model 3)'
            }
            disabled={picked.length >= MAX_MODELS}
            style={{ ...styles.searchInput, opacity: picked.length >= MAX_MODELS ? 0.5 : 1 }}
          />
          {focused && results.length > 0 && (
            <div style={styles.searchResults}>
              {results.map((m) => (
                <button
                  key={m.slug}
                  onClick={() => addModel(m.slug)}
                  style={styles.searchResultItem}
                  className="search-result-item"
                >
                  <span style={styles.searchResultBrand}>{m.brand}</span>{' '}
                  {m.model}{m.variant ? ` ${m.variant}` : ''}
                </button>
              ))}
            </div>
          )}
          {focused && query.trim() && results.length === 0 && (
            <div style={styles.searchResults}>
              <div style={styles.searchNoResults}>Sin resultados para "{query}"</div>
            </div>
          )}
        </div>

        <div style={styles.countRow}>
          <span style={styles.countText}>{picked.length} de {MAX_MODELS} seleccionados</span>
          <div style={styles.countActions}>
            {picked.length > 0 && (
              <button onClick={share} style={styles.actionLink} className="action-link">
                {shareLabel}
              </button>
            )}
            {picked.length > 0 && (
              <button onClick={clearAll} style={styles.actionLink} className="action-link">
                Limpiar todo
              </button>
            )}
          </div>
        </div>

        {picked.length > 0 && (
          <div style={styles.chips}>
            {picked.map((slug) => {
              const m = MODELS_LIVE.find((x) => x.slug === slug);
              if (!m) return null;
              return (
                <button
                  key={slug}
                  onClick={() => removeModel(slug)}
                  style={styles.chip}
                  className="chip-btn"
                >
                  {m.brand} {m.model}
                  <span style={styles.chipX}> ×</span>
                </button>
              );
            })}
          </div>
        )}

        {list.length > 0 && (
          <div style={styles.scroll}>
            <table style={styles.table}>
              <caption style={styles.caption}>
                Comparación de {list.length} modelos eléctricos disponibles en Uruguay
              </caption>
              <thead>
                <tr>
                  <th style={{ ...styles.th, ...styles.thFirst }} scope="col">
                    <span style={styles.srOnly}>Dato</span>
                  </th>
                  {list.map((m) => (
                    <th key={m.slug} style={styles.th} scope="col">
                      <div style={styles.thBrand}>{m.brand}</div>
                      <div style={styles.thModel}>{m.model}</div>
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
                      <th scope="row" style={styles.rowLabel}>
                        {row.label}
                        {row.source === 'lab' && (<span style={styles.tagLab}>laboratorio</span>)}
                        {row.source === 'measured' && (<span style={styles.tagReal}>medido acá</span>)}
                      </th>
                      {list.map((m, i) => (
                        <Cell key={m.slug} row={row} m={m} isWinner={w === i} styles={styles}
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
          <div style={styles.empty}>
            <p style={styles.emptyText}>Buscá y agregá hasta {MAX_MODELS} modelos para comparar.</p>
          </div>
        )}

        {list.length > 0 && (
          <div style={styles.legend}>
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

const baseStyles = {
  root: { background: C.bg, minHeight: '100vh', padding: '32px 20px 80px', fontFamily: sans, color: C.text },
  wrap: { maxWidth: 900, margin: '0 auto' },
  head: { marginBottom: 24 },
  eyebrow: { fontFamily: mono, fontSize: 11, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 },
  h1: { fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 12px', lineHeight: 1.1 },
  lede: { fontSize: 14, color: C.dim, lineHeight: 1.6, margin: '0 0 18px', maxWidth: '58ch' },
  badges: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  badge: {
    fontFamily: mono, fontSize: 10.5, color: C.dim, background: C.surface,
    border: `1px solid ${C.line}`, borderRadius: 20, padding: '6px 13px',
    letterSpacing: '0.02em',
  },
  searchBox: { position: 'relative', marginBottom: 12 },
  searchInput: {
    width: '100%', fontFamily: mono, fontSize: 14, padding: '13px 16px',
    background: C.surface, color: C.text, border: `1px solid ${C.line}`,
    borderRadius: 5, outline: 'none', boxSizing: 'border-box',
  },
  searchResults: {
    position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 20,
    background: C.surface, border: `1px solid ${C.line}`, borderRadius: 5,
    overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  },
  searchResultItem: {
    display: 'block', width: '100%', textAlign: 'left', fontFamily: sans,
    fontSize: 14, color: C.text, background: 'transparent', border: 'none',
    borderBottom: `1px solid ${C.line}`, padding: '11px 16px', cursor: 'pointer',
  },
  searchResultBrand: { fontFamily: mono, fontSize: 11, color: C.dim },
  searchNoResults: { fontFamily: mono, fontSize: 12, color: C.faint, padding: '14px 16px' },
  countRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 },
  countText: { fontFamily: mono, fontSize: 11.5, color: C.dim },
  countActions: { display: 'flex', gap: 16 },
  actionLink: {
    fontFamily: mono, fontSize: 11.5, color: C.real, background: 'transparent',
    border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline',
    textUnderlineOffset: 3,
  },
  chips: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 },
  chip: {
    fontFamily: mono,
    fontSize: 12,
    padding: '7px 12px',
    background: 'rgba(61,220,151,0.08)',
    color: C.real,
    border: `1px solid ${C.real}`,
    borderRadius: 2,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    transition: 'all 140ms ease',
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
  tagQuoted: { display: 'block', fontSize: 9, color: C.dim, marginTop: 3, letterSpacing: '0.02em', fontFamily: mono, whiteSpace: 'normal' },
  legend: { display: 'flex', gap: 20, flexWrap: 'wrap', fontFamily: mono, fontSize: 11, color: C.faint, paddingTop: 16, borderTop: `1px solid ${C.line}` },
};

const mobileStyles = {
  root: { background: C.bg, minHeight: '100vh', padding: '16px 10px 40px', fontFamily: sans, color: C.text },
  wrap: { maxWidth: '100%', margin: '0 auto' },
  head: { marginBottom: 18 },
  eyebrow: { fontFamily: mono, fontSize: 10, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 },
  h1: { fontSize: 'clamp(22px, 6vw, 30px)', fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 10px', lineHeight: 1.1 },
  lede: { fontSize: 13, color: C.dim, lineHeight: 1.6, margin: '0 0 14px', maxWidth: '48ch' },
  badges: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  badge: {
    fontFamily: mono, fontSize: 9.5, color: C.dim, background: C.surface,
    border: `1px solid ${C.line}`, borderRadius: 20, padding: '5px 11px',
  },
  searchBox: { position: 'relative', marginBottom: 10 },
  searchInput: {
    width: '100%', fontFamily: mono, fontSize: 13, padding: '11px 13px',
    background: C.surface, color: C.text, border: `1px solid ${C.line}`,
    borderRadius: 4, outline: 'none', boxSizing: 'border-box',
  },
  searchResults: {
    position: 'absolute', top: 'calc(100% + 5px)', left: 0, right: 0, zIndex: 20,
    background: C.surface, border: `1px solid ${C.line}`, borderRadius: 4,
    overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  },
  searchResultItem: {
    display: 'block', width: '100%', textAlign: 'left', fontFamily: sans,
    fontSize: 13, color: C.text, background: 'transparent', border: 'none',
    borderBottom: `1px solid ${C.line}`, padding: '10px 13px', cursor: 'pointer',
  },
  searchResultBrand: { fontFamily: mono, fontSize: 10, color: C.dim },
  searchNoResults: { fontFamily: mono, fontSize: 11, color: C.faint, padding: '12px 13px' },
  countRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 6 },
  countText: { fontFamily: mono, fontSize: 10.5, color: C.dim },
  countActions: { display: 'flex', gap: 12 },
  actionLink: {
    fontFamily: mono, fontSize: 10.5, color: C.real, background: 'transparent',
    border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline',
    textUnderlineOffset: 3,
  },
  chips: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 },
  chip: {
    fontFamily: mono,
    fontSize: 11,
    padding: '6px 10px',
    background: 'rgba(61,220,151,0.08)',
    color: C.real,
    border: `1px solid ${C.real}`,
    borderRadius: 2,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    transition: 'all 120ms ease',
  },
  chipX: { color: C.faint, fontSize: 12 },
  empty: { background: C.surface, border: `1px solid ${C.line}`, borderRadius: 4, padding: '20px 10px', textAlign: 'center', marginBottom: 20 },
  emptyText: { color: C.dim, fontSize: 13, margin: 0 },
  scroll: { overflowX: 'auto', marginBottom: 16 },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 300 },
  caption: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' },
  srOnly: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' },
  th: { textAlign: 'left', padding: '0 8px 8px', borderBottom: `1px solid ${C.line}`, verticalAlign: 'bottom' },
  thFirst: { width: '30%', minWidth: 100 },
  thBrand: { fontFamily: mono, fontSize: 10, color: C.faint, letterSpacing: '0.06em' },
  thModel: { fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 1 },
  rowLabel: { fontFamily: mono, fontSize: 10, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', fontWeight: 400, padding: '8px 8px', borderBottom: `1px solid ${C.line}`, verticalAlign: 'middle' },
  td: { padding: '8px 8px', borderBottom: `1px solid ${C.line}`, verticalAlign: 'middle', whiteSpace: 'nowrap' },
  value: { fontFamily: mono, fontWeight: 500, letterSpacing: '-0.01em' },
  unit: { fontSize: 10, color: C.dim, fontStyle: 'normal' },
  missing: { fontFamily: mono, fontSize: 11, color: C.gap, fontStyle: 'italic' },
  mark: { color: C.real, fontSize: 7, marginLeft: 5, verticalAlign: 'middle' },
  incomp: { color: C.faint, fontSize: 12, marginLeft: 5, cursor: 'help' },
  tagLab: { display: 'block', fontSize: 8, color: C.lab, marginTop: 2, letterSpacing: '0.04em', textTransform: 'none' },
  tagReal: { display: 'block', fontSize: 9, color: C.real, marginTop: 2, letterSpacing: '0.04em', textTransform: 'none' },
  tagQuoted: { display: 'block', fontSize: 8, color: C.dim, marginTop: 2, letterSpacing: '0.02em', fontFamily: mono, whiteSpace: 'normal' },
  legend: { display: 'flex', gap: 16, flexWrap: 'wrap', fontFamily: mono, fontSize: 10, color: C.faint, paddingTop: 12, borderTop: `1px solid ${C.line}` },
};

const CSS = `
  * { box-sizing: border-box; }
  input:focus { border-color: ${C.real} !important; }
  .chip-btn:hover { background: rgba(61,220,151,0.15) !important; }
  .search-result-item:hover { background: ${C.line}; }
  .search-result-item:last-child { border-bottom: none; }
  .action-link:hover { opacity: 0.75; }
  .row:hover th, .row:hover td { background: ${C.surface}; }
  button:focus-visible, input:focus-visible { outline: 2px solid ${C.real}; outline-offset: 2px; }
  em { font-style: normal; }
  @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
`;
