'use client';

import React, { useState } from 'react';

/* ============================================================
   evuy — Landing de captura

   Único trabajo: mails reales en la tabla `subscribers`.
   Meta del Día 4: 20.

   Tesis: no prometemos "la mejor información". Mostramos el
   hueco. El hero ES la tabla vacía de autonomías reales — el
   dato que nadie en Uruguay tiene todavía.

   Eso hace doble trabajo: capta el mail y capta el dato.

   La tercera pregunta (¿cuándo pensás comprar?) es lo que
   después se vende. No se saltea por simplificar el form.
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

/* Estado real del catálogo hoy. Los null son verdad. */
const CATALOG = [
  { slug: 'byd-dolphin-2026', brand: 'BYD', model: 'Dolphin', wltp: 340, real: 287, n: 14 },
  { slug: 'byd-yuan-plus-2026', brand: 'BYD', model: 'Yuan Plus', wltp: 430, real: 371, n: 9 },
  { slug: 'geely-ex5-2026', brand: 'Geely', model: 'EX5', wltp: 430, real: null, n: null },
  { slug: 'geely-geometry-c-2026', brand: 'Geely', model: 'Geometry C', wltp: 400, real: null, n: null },
  { slug: 'renault-kwid-e-tech-2026', brand: 'Renault', model: 'Kwid E-Tech', wltp: 298, real: null, n: null },
];

const TIMEFRAMES = [
  { v: 'lt_3m', label: 'En menos de 3 meses' },
  { v: '3_6m', label: 'Entre 3 y 6 meses' },
  { v: '6_12m', label: 'Entre 6 y 12 meses' },
  { v: 'browsing', label: 'Todavía estoy mirando' },
];

/* Escala compartida con la ficha (lib/ui/constants). Si difieren,
   el mismo auto se ve distinto según la página. */
const SCALE = 600;

function RangeRow({ m, selected, onToggle }) {
  const wPct = (m.wltp / SCALE) * 100;
  const rPct = m.real ? (m.real / SCALE) * 100 : 0;

  return (
    <button
      type="button"
      onClick={() => onToggle(m.slug)}
      className="row"
      aria-pressed={selected}
      style={{
        ...S.row,
        borderColor: selected ? C.real : 'transparent',
        background: selected ? 'rgba(61,220,151,0.05)' : 'transparent',
      }}
    >
      <div style={S.rowHead}>
        <span style={S.rowName}>
          <em style={S.rowBrand}>{m.brand}</em> {m.model}
        </span>
        <span style={{ ...S.rowVal, color: m.real ? C.real : C.gap }}>
          {m.real ? (
            <>
              {m.real} <em style={S.km}>km reales</em>
            </>
          ) : (
            <em style={S.pending}>sin medir</em>
          )}
        </span>
      </div>

      <div
        style={S.track}
        role="img"
        aria-label={
          m.real
            ? `${m.brand} ${m.model}: ${m.real} kilómetros reales sobre ${m.n} mediciones, ${m.wltp} declarados por fábrica`
            : `${m.brand} ${m.model}: ${m.wltp} kilómetros declarados por fábrica, autonomía real sin medir`
        }
      >
        {/* WLTP: siempre, en trazo hueco */}
        <div style={{ ...S.wltp, width: `${wPct}%` }} />
        {/* Real: sólido, solo si existe */}
        {m.real && <div style={{ ...S.real, width: `${rPct}%` }} />}
      </div>

      <div style={S.rowFoot}>
        <span style={{ color: C.lab }}>{m.wltp} km de fábrica</span>
        {m.real ? (
          <span style={{ color: C.faint }}>
            {m.n} medicion{m.n === 1 ? '' : 'es'} de usuarios
          </span>
        ) : (
          <span style={{ color: C.faint }}>nadie lo midió todavía</span>
        )}
      </div>
    </button>
  );
}

export default function Landing() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [interest, setInterest] = useState([]);
  const [timeframe, setTimeframe] = useState('');
  const [hp, setHp] = useState(''); // honeypot: los bots lo llenan
  const [state, setState] = useState('idle'); // idle | sending | done | error
  const [error, setError] = useState('');

  const measured = CATALOG.filter((m) => m.real).length;

  const toggle = (slug) =>
    setInterest((p) =>
      p.includes(slug) ? p.filter((s) => s !== slug) : [...p, slug]
    );

  const submit = async () => {
    setError('');

    const clean = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)) {
      setError('Ese mail no parece válido. Revisalo.');
      return;
    }

    setState('sending');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: clean,
          name: name.trim() || undefined,
          model_interest: interest,
          timeframe: timeframe || undefined,
          source: 'landing',
          website: hp, // honeypot: vacío en humanos
        }),
      });
      if (!res.ok) throw new Error('fallo');
      setState('done');
    } catch {
      setState('error');
      setError('No pudimos guardar tu mail. Probá de nuevo en un momento.');
    }
  };

  if (state === 'done') {
    return (
      <div style={S.root}>
        <style>{CSS}</style>
        <div style={{ ...S.wrap, paddingTop: 100 }}>
          <div style={S.doneMark}>✓</div>
          <h1 style={S.doneTitle}>Te mandamos un mail</h1>
          <p style={S.doneText}>
            Confirmá desde ahí y quedás adentro. Si no llega en unos minutos,
            mirá en spam — todavía somos nuevos para los filtros.
          </p>
          <p style={S.doneAsk}>
            Mientras tanto, una pregunta:{' '}
            <strong style={{ color: C.text }}>
              ¿qué querés saber de los eléctricos que hoy no encontrás en
              ningún lado?
            </strong>{' '}
            Respondé ese mail y lo leo yo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={S.root}>
      <style>{CSS}</style>

      <div style={S.wrap}>
        {/* Hero */}
        <header style={S.hero}>
          <div style={S.eyebrow}>Uruguay · autos eléctricos</div>
          <h1 style={S.h1}>
            La autonomía que dice la marca
            <br />
            <span style={S.h1Accent}>no es la que vas a tener.</span>
          </h1>
          <p style={S.lede}>
            Los números de fábrica salen de un laboratorio. Nosotros publicamos
            los dos: el declarado y el real, medido por gente que maneja el auto
            acá. Cuando no tenemos el dato, lo decimos.
          </p>
        </header>

        {/* Signature: la tabla del hueco */}
        <section style={S.board} aria-labelledby="board-title">
          <div style={S.boardHead}>
            <h2 id="board-title" style={S.boardTitle}>
              Estado de las mediciones
            </h2>
            <span style={S.boardCount}>
              {measured} de {CATALOG.length} modelos medidos
            </span>
          </div>

          <div style={S.rows}>
            {CATALOG.map((m) => (
              <RangeRow
                key={m.slug}
                m={m}
                selected={interest.includes(m.slug)}
                onToggle={toggle}
              />
            ))}
          </div>

          <p style={S.boardNote}>
            Tocá los que te interesen. Te avisamos cuando tengamos su medición
            real o cambie el precio.
          </p>
        </section>

        {/* Captura */}
        <section style={S.form} aria-labelledby="form-title">
          <h2 id="form-title" style={S.formTitle}>
            Enterate cuando midamos
          </h2>

          <div style={S.fields}>
            <label style={S.label}>
              <span style={S.labelText}>Tu mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="vos@ejemplo.com"
                className="in"
                style={S.input}
                autoComplete="email"
              />
            </label>

            <label style={S.label}>
              <span style={S.labelText}>
                Tu nombre <em style={S.opt}>opcional</em>
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="Cómo te llamamos"
                className="in"
                style={S.input}
                autoComplete="name"
              />
            </label>
          </div>

          {/* La tercera pregunta. La que se vende. */}
          <fieldset style={S.fieldset}>
            <legend style={S.legend}>¿Cuándo pensás comprar?</legend>
            <div style={S.chips}>
              {TIMEFRAMES.map((t) => {
                const on = timeframe === t.v;
                return (
                  <button
                    key={t.v}
                    type="button"
                    onClick={() => setTimeframe(on ? '' : t.v)}
                    className="chip"
                    aria-pressed={on}
                    style={{
                      ...S.chip,
                      borderColor: on ? C.real : C.line,
                      color: on ? C.real : C.dim,
                      background: on ? 'rgba(61,220,151,0.06)' : 'transparent',
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Honeypot. Fuera de pantalla, no display:none:
              algunos bots detectan el display y lo saltean. */}
          <div style={S.hp} aria-hidden="true">
            <label>
              No llenes esto
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
              />
            </label>
          </div>

          {error && (
            <div style={S.error} role="alert">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={submit}
            disabled={state === 'sending'}
            className="submit"
            style={{
              ...S.submit,
              opacity: state === 'sending' ? 0.5 : 1,
              cursor: state === 'sending' ? 'wait' : 'pointer',
            }}
          >
            {state === 'sending' ? 'Guardando...' : 'Quiero enterarme'}
          </button>

          <p style={S.privacy}>
            Un mail cada dos semanas. Te podés dar de baja de una. No vendemos
            tu dirección.
          </p>
        </section>

        {/* Aporte de datos */}
        <section style={S.contribute}>
          <div>
            <div style={S.contribTitle}>¿Ya tenés un eléctrico?</div>
            <p style={S.contribText}>
              Tu autonomía real vale más que cualquier ficha de fábrica.
              Contanos cuánto te rinde y sumamos el dato con tu nombre como
              fuente.
            </p>
          </div>
          <button type="button" className="ghost" style={S.ghost}>
            Aportar mi medición
          </button>
        </section>

        <footer style={S.foot}>
          <span>autoelectrico.uy · Punta del Este, Uruguay</span>
          <span style={{ color: C.faint }}>
            Datos con fuente citable o no se publican.
          </span>
        </footer>
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
    padding: '40px 20px 60px',
    fontFamily: sans,
    color: C.text,
  },
  wrap: { maxWidth: 640, margin: '0 auto' },

  hero: { marginBottom: 40 },
  eyebrow: {
    fontFamily: mono,
    fontSize: 11,
    color: C.dim,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    marginBottom: 18,
  },
  h1: {
    fontSize: 'clamp(28px, 6.5vw, 42px)',
    fontWeight: 600,
    letterSpacing: '-0.025em',
    lineHeight: 1.12,
    margin: '0 0 18px',
  },
  h1Accent: { color: C.real },
  lede: {
    fontSize: 15,
    color: C.dim,
    lineHeight: 1.65,
    margin: 0,
    maxWidth: '52ch',
  },

  board: {
    border: `1px solid ${C.line}`,
    borderRadius: 3,
    padding: '20px 18px 16px',
    marginBottom: 32,
    background: C.surface,
  },
  boardHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 18,
    gap: 12,
    flexWrap: 'wrap',
  },
  boardTitle: {
    fontFamily: mono,
    fontSize: 11,
    fontWeight: 400,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: C.dim,
    margin: 0,
  },
  boardCount: { fontFamily: mono, fontSize: 11, color: C.lab },
  rows: { display: 'flex', flexDirection: 'column', gap: 2 },
  row: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '11px 10px',
    border: '1px solid',
    borderRadius: 2,
    cursor: 'pointer',
    font: 'inherit',
    transition: 'all 140ms ease',
  },
  rowHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 7,
    gap: 10,
  },
  rowName: { fontSize: 14, fontWeight: 500 },
  rowBrand: { color: C.faint, fontStyle: 'normal', fontWeight: 400 },
  rowVal: { fontFamily: mono, fontSize: 15, fontWeight: 500 },
  km: { fontSize: 10, color: C.dim, fontStyle: 'normal' },
  pending: { fontSize: 12, fontStyle: 'italic' },
  track: {
    height: 7,
    background: '#0E1013',
    borderRadius: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  wltp: {
    position: 'absolute',
    inset: 0,
    height: '100%',
    border: `1px dashed ${C.lab}`,
    borderRadius: 1,
    opacity: 0.55,
  },
  real: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    background: C.real,
    borderRadius: 1,
  },
  rowFoot: {
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: mono,
    fontSize: 10,
    marginTop: 6,
    gap: 10,
  },
  boardNote: {
    fontFamily: mono,
    fontSize: 11,
    color: C.faint,
    lineHeight: 1.5,
    margin: '16px 0 0',
    paddingTop: 14,
    borderTop: `1px solid ${C.line}`,
  },

  form: { marginBottom: 32 },
  formTitle: {
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: '-0.01em',
    margin: '0 0 18px',
  },
  fields: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 12,
    marginBottom: 20,
  },
  label: { display: 'block' },
  labelText: {
    display: 'block',
    fontFamily: mono,
    fontSize: 10,
    color: C.dim,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 7,
  },
  opt: { color: C.faint, fontStyle: 'normal', textTransform: 'none' },
  input: {
    width: '100%',
    fontFamily: sans,
    fontSize: 15,
    padding: '11px 13px',
    background: C.bg,
    color: C.text,
    border: `1px solid ${C.line}`,
    borderRadius: 2,
    outline: 'none',
    transition: 'border-color 140ms ease',
  },
  fieldset: { border: 0, padding: 0, margin: '0 0 20px' },
  legend: {
    fontFamily: mono,
    fontSize: 10,
    color: C.dim,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    padding: 0,
    marginBottom: 10,
  },
  chips: { display: 'flex', gap: 7, flexWrap: 'wrap' },
  chip: {
    fontFamily: mono,
    fontSize: 11,
    padding: '8px 12px',
    border: '1px solid',
    borderRadius: 2,
    cursor: 'pointer',
    transition: 'all 140ms ease',
  },
  hp: {
    position: 'absolute',
    left: '-9999px',
    width: 1,
    height: 1,
    overflow: 'hidden',
  },
  error: {
    fontFamily: mono,
    fontSize: 12,
    color: C.lab,
    padding: '10px 12px',
    border: `1px solid ${C.lab}`,
    borderRadius: 2,
    marginBottom: 14,
  },
  submit: {
    width: '100%',
    fontFamily: mono,
    fontSize: 13,
    fontWeight: 500,
    padding: '14px',
    background: C.real,
    color: C.bg,
    border: 'none',
    borderRadius: 2,
    letterSpacing: '0.03em',
    transition: 'opacity 140ms ease',
  },
  privacy: {
    fontFamily: mono,
    fontSize: 10,
    color: C.faint,
    textAlign: 'center',
    margin: '12px 0 0',
    lineHeight: 1.6,
  },

  contribute: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 18,
    padding: '18px',
    border: `1px solid ${C.line}`,
    borderRadius: 3,
    marginBottom: 28,
    flexWrap: 'wrap',
  },
  contribTitle: { fontSize: 14, fontWeight: 600, marginBottom: 5 },
  contribText: {
    fontSize: 13,
    color: C.dim,
    lineHeight: 1.55,
    margin: 0,
    maxWidth: '42ch',
  },
  ghost: {
    fontFamily: mono,
    fontSize: 11,
    padding: '10px 16px',
    background: 'transparent',
    color: C.real,
    border: `1px solid ${C.real}`,
    borderRadius: 2,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 140ms ease',
  },

  foot: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 14,
    flexWrap: 'wrap',
    fontFamily: mono,
    fontSize: 10,
    color: C.dim,
    paddingTop: 18,
    borderTop: `1px solid ${C.line}`,
  },

  doneMark: {
    fontFamily: mono,
    fontSize: 32,
    color: C.real,
    marginBottom: 20,
  },
  doneTitle: {
    fontSize: 28,
    fontWeight: 600,
    letterSpacing: '-0.02em',
    margin: '0 0 14px',
  },
  doneText: {
    fontSize: 15,
    color: C.dim,
    lineHeight: 1.65,
    margin: '0 0 28px',
    maxWidth: '46ch',
  },
  doneAsk: {
    fontSize: 14,
    color: C.dim,
    lineHeight: 1.7,
    margin: 0,
    paddingTop: 22,
    borderTop: `1px solid ${C.line}`,
    maxWidth: '46ch',
  },
};

const CSS = `
* { box-sizing: border-box; }
.in::placeholder { color: ${C.gap}; }
.in:focus { border-color: ${C.real} !important; }
.row:hover { border-color: ${C.line} !important; }
.chip:hover { border-color: ${C.dim} !important; }
.ghost:hover { background: ${C.real} !important; color: ${C.bg} !important; }
.submit:hover:not(:disabled) { filter: brightness(1.08); }
button:focus-visible, input:focus-visible { outline: 2px solid ${C.real}; outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
`;
