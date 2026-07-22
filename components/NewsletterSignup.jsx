'use client';

import React, { useState } from 'react';

/* ============================================================
   NewsletterSignup

   Separado de Landing.jsx a propósito: la portada nueva no
   necesita el tablero de autonomías por modelo, solo mail +
   la pregunta de timing de compra (lo que se vende como lead).
   ============================================================ */

const C = {
  bg: '#141619',
  surface: '#1B1E23',
  line: '#2A2E35',
  text: '#E6E8EB',
  dim: '#8A9099',
  faint: '#565C66',
  real: '#3DDC97',
  lab: '#B8734E',
  gap: '#4A505A',
};

const mono = "'IBM Plex Mono', ui-monospace, Menlo, monospace";
const sans = "'IBM Plex Sans', -apple-system, sans-serif";

const TIMEFRAMES = [
  { v: 'lt_3m', label: 'En menos de 3 meses' },
  { v: '3_6m', label: 'Entre 3 y 6 meses' },
  { v: '6_12m', label: 'Entre 6 y 12 meses' },
  { v: 'browsing', label: 'Todavía estoy mirando' },
];

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [hp, setHp] = useState(''); // honeypot: los bots lo llenan
  const [state, setState] = useState('idle'); // idle | sending | done | error
  const [error, setError] = useState('');

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
          timeframe: timeframe || undefined,
          source: 'home',
          website: hp,
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
      <section style={S.root}>
        <style>{CSS}</style>
        <div style={S.wrap}>
          <div style={S.doneMark}>✓</div>
          <div style={S.doneTitle}>Te mandamos un mail</div>
          <p style={S.doneText}>
            Confirmá desde ahí y quedás adentro. Si no llega en unos minutos,
            mirá en spam.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section style={S.root} aria-labelledby="newsletter-title">
      <style>{CSS}</style>
      <div style={S.wrap}>
        <h2 id="newsletter-title" style={S.title}>
          Enterate cuando midamos autonomías reales
        </h2>
        <p style={S.lede}>
          Un mail cada dos semanas con precios que cambiaron y mediciones
          nuevas. Nada más.
        </p>

        <div style={S.fields}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="vos@ejemplo.com"
            className="nl-in"
            style={S.input}
            autoComplete="email"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Tu nombre (opcional)"
            className="nl-in"
            style={S.input}
            autoComplete="name"
          />
        </div>

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
                  className="nl-chip"
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

        {/* Honeypot fuera de pantalla, no display:none */}
        <div style={S.hp} aria-hidden="true">
          <label>
            No llenes esto
            <input type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
          </label>
        </div>

        {error && <div style={S.error} role="alert">{error}</div>}

        <button
          type="button"
          onClick={submit}
          disabled={state === 'sending'}
          className="nl-submit"
          style={{ ...S.submit, opacity: state === 'sending' ? 0.5 : 1 }}
        >
          {state === 'sending' ? 'Guardando...' : 'Quiero enterarme'}
        </button>

        <p style={S.privacy}>No vendemos tu dirección. Baja en un clic.</p>
      </div>
    </section>
  );
}

const S = {
  root: {
    background: C.bg,
    padding: '20px 20px 60px',
    fontFamily: sans,
    color: C.text,
  },
  wrap: {
    maxWidth: 520,
    margin: '0 auto',
    background: C.surface,
    border: `1px solid ${C.line}`,
    borderRadius: 6,
    padding: '28px 26px',
  },
  title: { fontSize: 19, fontWeight: 600, margin: '0 0 8px', letterSpacing: '-0.01em' },
  lede: { fontSize: 13, color: C.dim, lineHeight: 1.6, margin: '0 0 20px' },
  fields: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 16 },
  input: {
    width: '100%',
    fontFamily: sans,
    fontSize: 14,
    padding: '10px 12px',
    background: C.bg,
    color: C.text,
    border: `1px solid ${C.line}`,
    borderRadius: 3,
    outline: 'none',
    boxSizing: 'border-box',
  },
  fieldset: { border: 0, padding: 0, margin: '0 0 18px' },
  legend: {
    fontFamily: mono,
    fontSize: 10,
    color: C.dim,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    padding: 0,
    marginBottom: 9,
  },
  chips: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  chip: {
    fontFamily: mono,
    fontSize: 11,
    padding: '7px 11px',
    border: '1px solid',
    borderRadius: 2,
    cursor: 'pointer',
    transition: 'all 140ms ease',
  },
  hp: { position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' },
  error: {
    fontFamily: mono,
    fontSize: 12,
    color: C.lab,
    padding: '9px 11px',
    border: `1px solid ${C.lab}`,
    borderRadius: 2,
    marginBottom: 12,
  },
  submit: {
    width: '100%',
    fontFamily: mono,
    fontSize: 13,
    fontWeight: 500,
    padding: '13px',
    background: C.real,
    color: C.bg,
    border: 'none',
    borderRadius: 3,
    cursor: 'pointer',
    transition: 'opacity 140ms ease',
  },
  privacy: {
    fontFamily: mono,
    fontSize: 10,
    color: C.faint,
    textAlign: 'center',
    margin: '10px 0 0',
  },
  doneMark: { fontFamily: mono, fontSize: 26, color: C.real, marginBottom: 10 },
  doneTitle: { fontSize: 18, fontWeight: 600, marginBottom: 8 },
  doneText: { fontSize: 13, color: C.dim, lineHeight: 1.6, margin: 0 },
};

const CSS = `
.nl-in::placeholder { color: ${C.gap}; }
.nl-in:focus { border-color: ${C.real} !important; }
.nl-chip:hover { border-color: ${C.dim} !important; }
.nl-submit:hover:not(:disabled) { filter: brightness(1.08); }
button:focus-visible, input:focus-visible { outline: 2px solid ${C.real}; outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
`;
