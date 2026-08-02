'use client';

import React, { useMemo, useState } from 'react';
import CarSilhouette from './CarSilhouette';

/* ============================================================
   autoelectrico.uy — Grid de modelos

   Recibe los modelos de la DB por props (server component los
   trae). Cada tarjeta muestra lo esencial: precio, autonomía
   real vs WLTP, y el estado del dato.

   Con ~180 modelos publicados el listado plano era una página de
   13.000 px de scroll: encontrar un modelo puntual era imposible.
   Ahora hay buscador, filtros (marca, carrocería, precio,
   autonomía) y orden — todo del lado del cliente, porque los
   datos ya vienen completos en el mismo request.
   ============================================================ */

const C = {
  bg: '#141619',
  surface: '#1B1E23',
  line: '#2A2E35',
  text: '#E6E8EB',
  dim: '#9AA1AC',
  faint: '#828993',
  real: '#3DDC97',
  lab: '#E8A33D',
  gap: '#838A94',
};

const mono = "'IBM Plex Mono', ui-monospace, Menlo, monospace";
const sans = "'IBM Plex Sans', -apple-system, sans-serif";

const fmt = (n) => (n == null ? null : new Intl.NumberFormat('es-UY').format(Number(n)));
const num = (v) => (v == null || v === '' ? null : Number(v));

const BODY_LABELS = {
  suv: 'SUV',
  sedan: 'Sedán',
  hatchback: 'Hatchback',
  pickup: 'Pickup',
  van: 'Van',
  coupe: 'Coupé',
  wagon: 'Familiar',
};

const bodyLabel = (b) => BODY_LABELS[b] ?? b ?? '—';

/* Tramos de precio pensados para el mercado uruguayo: el salto
   real está en los 30k (donde termina el urbano chico) y en los
   50k (donde arranca el premium importado). */
const PRICE_BUCKETS = [
  { v: '', label: 'Cualquier precio' },
  { v: '0-25000', label: 'Hasta USD 25.000' },
  { v: '25000-35000', label: 'USD 25.000 – 35.000' },
  { v: '35000-50000', label: 'USD 35.000 – 50.000' },
  { v: '50000-', label: 'Más de USD 50.000' },
];

const RANGE_BUCKETS = [
  { v: '', label: 'Cualquier autonomía' },
  { v: '250', label: 'Desde 250 km' },
  { v: '350', label: 'Desde 350 km' },
  { v: '450', label: 'Desde 450 km' },
];

const SORTS = [
  { v: 'price-asc', label: 'Precio: menor a mayor' },
  { v: 'price-desc', label: 'Precio: mayor a menor' },
  { v: 'range-desc', label: 'Más autonomía' },
  { v: 'brand-asc', label: 'Marca (A–Z)' },
];

const norm = (s) =>
  (s ?? '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

/* ---------- Tarjeta ---------- */

function ModelCard({ m }) {
  const real = num(m.range_real_km);
  const wltp = num(m.range_wltp_km);

  return (
    <a
      href={`/modelos/${m.slug}`}
      className="model-card lg"
      style={S.card}
      aria-label={`Ficha de ${m.brand} ${m.model}${m.variant ? ` ${m.variant}` : ''}`}
    >
      <div style={S.cardMedia} aria-hidden="true">
        <CarSilhouette body={m.body} heroImage={m.hero_image} size={78} color={C.gap} />
      </div>

      <div style={S.cardHead}>
        <div>
          <div style={S.brand}>{m.brand}</div>
          <div style={S.model}>
            {m.model}
            {m.variant ? ` ${m.variant}` : ''}
          </div>
        </div>
        <div style={S.body}>{bodyLabel(m.body)}</div>
      </div>

      <div style={S.price}>
        {m.price_usd != null ? (
          <>
            <em style={S.currency}>USD </em>
            {fmt(m.price_usd)}
          </>
        ) : (
          <span style={S.noPrice}>consultá el precio</span>
        )}
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

/* ---------- Grid + filtros ---------- */

export default function ModelGrid({ models = [] }) {
  const [q, setQ] = useState('');
  const [brand, setBrand] = useState('');
  const [body, setBody] = useState('');
  const [price, setPrice] = useState('');
  const [range, setRange] = useState('');
  const [sort, setSort] = useState('price-asc');

  const brands = useMemo(
    () => [...new Set(models.map((m) => m.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es')),
    [models]
  );

  const bodies = useMemo(
    () => [...new Set(models.map((m) => m.body).filter(Boolean))].sort(),
    [models]
  );

  const filtered = useMemo(() => {
    const needle = norm(q).trim();
    const [pMin, pMax] = price ? price.split('-').map((x) => (x === '' ? null : Number(x))) : [null, null];
    const rMin = range ? Number(range) : null;

    const out = models.filter((m) => {
      if (brand && m.brand !== brand) return false;
      if (body && m.body !== body) return false;

      if (pMin != null || pMax != null) {
        const p = num(m.price_usd);
        // Sin precio publicado no se puede afirmar que entre en el
        // tramo: se oculta en lugar de mentir por omisión.
        if (p == null) return false;
        if (pMin != null && p < pMin) return false;
        if (pMax != null && p > pMax) return false;
      }

      if (rMin != null) {
        const r = num(m.range_real_km) ?? num(m.range_wltp_km);
        if (r == null || r < rMin) return false;
      }

      if (needle) {
        const hay = norm(`${m.brand} ${m.model} ${m.variant ?? ''} ${bodyLabel(m.body)}`);
        if (!needle.split(/\s+/).every((t) => hay.includes(t))) return false;
      }

      return true;
    });

    const byNum = (v) => (v == null ? Infinity : Number(v));
    out.sort((a, b) => {
      switch (sort) {
        case 'price-desc':
          return (num(b.price_usd) ?? -Infinity) - (num(a.price_usd) ?? -Infinity);
        case 'range-desc': {
          const ra = num(a.range_real_km) ?? num(a.range_wltp_km) ?? -Infinity;
          const rb = num(b.range_real_km) ?? num(b.range_wltp_km) ?? -Infinity;
          return rb - ra;
        }
        case 'brand-asc':
          return (
            `${a.brand}`.localeCompare(`${b.brand}`, 'es') ||
            `${a.model}`.localeCompare(`${b.model}`, 'es')
          );
        default:
          return byNum(a.price_usd) - byNum(b.price_usd);
      }
    });

    return out;
  }, [models, q, brand, body, price, range, sort]);

  const active = Boolean(q || brand || body || price || range);

  const clear = () => {
    setQ('');
    setBrand('');
    setBody('');
    setPrice('');
    setRange('');
  };

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

        <section className="lg filters" style={S.filters} aria-label="Filtros del catálogo">
          <div style={S.searchRow}>
            <label htmlFor="cat-q" style={S.srOnly}>
              Buscar modelo
            </label>
            <span style={S.searchIcon} aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
            <input
              id="cat-q"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por marca o modelo — ej. Dolphin, BYD, SUV"
              style={S.search}
              className="cat-input"
            />
          </div>

          <div className="filter-grid" style={S.filterGrid}>
            <Field label="Marca" id="f-brand">
              <select id="f-brand" value={brand} onChange={(e) => setBrand(e.target.value)} style={S.select} className="cat-input">
                <option value="">Todas las marcas</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </Field>

            <Field label="Carrocería" id="f-body">
              <select id="f-body" value={body} onChange={(e) => setBody(e.target.value)} style={S.select} className="cat-input">
                <option value="">Todas</option>
                {bodies.map((b) => (
                  <option key={b} value={b}>{bodyLabel(b)}</option>
                ))}
              </select>
            </Field>

            <Field label="Precio" id="f-price">
              <select id="f-price" value={price} onChange={(e) => setPrice(e.target.value)} style={S.select} className="cat-input">
                {PRICE_BUCKETS.map((b) => (
                  <option key={b.v} value={b.v}>{b.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Autonomía" id="f-range">
              <select id="f-range" value={range} onChange={(e) => setRange(e.target.value)} style={S.select} className="cat-input">
                {RANGE_BUCKETS.map((b) => (
                  <option key={b.v} value={b.v}>{b.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Ordenar por" id="f-sort">
              <select id="f-sort" value={sort} onChange={(e) => setSort(e.target.value)} style={S.select} className="cat-input">
                {SORTS.map((s) => (
                  <option key={s.v} value={s.v}>{s.label}</option>
                ))}
              </select>
            </Field>
          </div>

          <div style={S.resultRow}>
            <p style={S.count} role="status" aria-live="polite">
              <strong style={S.countNum}>{filtered.length}</strong>{' '}
              {filtered.length === 1 ? 'modelo' : 'modelos'}
              {active ? ` de ${models.length}` : ' publicados'}
            </p>
            {active ? (
              <button type="button" onClick={clear} style={S.clear} className="cat-clear">
                Limpiar filtros
              </button>
            ) : null}
          </div>
        </section>

        {models.length === 0 ? (
          <div style={S.empty}>No hay modelos publicados todavía.</div>
        ) : filtered.length === 0 ? (
          <div style={S.empty}>
            <div style={S.emptyTitle}>Ningún modelo coincide con esos filtros</div>
            <p style={S.emptyText}>
              Probá con un rango de precio más amplio o quitá la marca.
            </p>
            <button type="button" onClick={clear} style={S.clear} className="cat-clear">
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div style={S.grid}>
            {filtered.map((m) => (
              <ModelCard key={m.slug} m={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, id, children }) {
  return (
    <div style={S.field}>
      <label htmlFor={id} style={S.fieldLabel}>
        {label}
      </label>
      {children}
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
  head: { marginBottom: 24 },
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

  /* --- filtros --- */
  filters: {
    background: C.surface,
    border: `1px solid ${C.line}`,
    borderRadius: 6,
    padding: 16,
    marginBottom: 20,
  },
  searchRow: { position: 'relative', marginBottom: 12 },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    color: C.dim,
    display: 'flex',
    pointerEvents: 'none',
  },
  search: {
    width: '100%',
    boxSizing: 'border-box',
    minHeight: 46,
    padding: '11px 12px 11px 36px',
    background: C.bg,
    border: `1px solid ${C.line}`,
    borderRadius: 5,
    color: C.text,
    fontFamily: sans,
    fontSize: 14,
    outline: 'none',
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 10,
  },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  fieldLabel: {
    fontFamily: mono,
    fontSize: 11,
    color: C.dim,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  select: {
    width: '100%',
    boxSizing: 'border-box',
    minHeight: 44,
    padding: '10px 12px',
    background: C.bg,
    border: `1px solid ${C.line}`,
    borderRadius: 5,
    color: C.text,
    fontFamily: sans,
    fontSize: 13.5,
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239AA1AC' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
  },
  resultRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTop: `1px solid ${C.line}`,
  },
  count: {
    margin: 0,
    fontFamily: mono,
    fontSize: 12,
    color: C.dim,
  },
  countNum: { color: C.text, fontWeight: 500 },
  clear: {
    minHeight: 40,
    padding: '9px 14px',
    background: 'transparent',
    border: `1px solid ${C.line}`,
    borderRadius: 5,
    color: C.dim,
    fontFamily: mono,
    fontSize: 12,
    cursor: 'pointer',
    transition: 'border-color 140ms ease, color 140ms ease',
  },

  /* --- grid --- */
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
  cardMedia: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 76,
    marginBottom: 6,
    overflow: 'hidden',
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
    color: C.dim,
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
    fontSize: 11,
    color: C.dim,
    padding: '3px 8px',
    border: `1px solid ${C.line}`,
    borderRadius: 2,
    whiteSpace: 'nowrap',
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
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  rangeVal: {
    fontFamily: mono,
    fontSize: 13,
    fontWeight: 500,
  },
  unit: { fontSize: 11, color: C.dim, fontStyle: 'normal' },
  n: { fontSize: 11.5, color: C.faint, fontStyle: 'normal' },
  pending: { fontSize: 11.5, fontStyle: 'italic' },
  cardFoot: {
    display: 'flex',
    alignItems: 'center',
    minHeight: 24,
    fontFamily: mono,
    fontSize: 12,
    color: C.real,
  },

  /* --- estados --- */
  empty: {
    padding: '48px 24px',
    textAlign: 'center',
    color: C.dim,
    fontFamily: mono,
    fontSize: 13,
    background: C.surface,
    border: `1px dashed ${C.line}`,
    borderRadius: 6,
  },
  emptyTitle: {
    fontFamily: sans,
    fontSize: 16,
    fontWeight: 600,
    color: C.text,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: sans,
    fontSize: 13.5,
    color: C.dim,
    margin: '0 0 18px',
  },

  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    whiteSpace: 'nowrap',
    border: 0,
  },
};

const CSS = `
.model-card:hover { border-color: ${C.real} !important; transform: translateY(-2px); }
.cat-input:focus { border-color: ${C.real} !important; }
.cat-input::placeholder { color: ${C.faint}; }
.cat-clear:hover { border-color: ${C.real} !important; color: ${C.real} !important; }
.filters select option { background: ${C.surface}; color: ${C.text}; }
@media (max-width: 520px) {
  .filter-grid { grid-template-columns: 1fr 1fr !important; }
}
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
`;
