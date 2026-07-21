'use client';


import React, { useState, useMemo } from 'react';

/* ============================================================
   autoelectrico.uy — Simulador de ahorro

   La herramienta que hace que la gente vuelva y comparta.
   Compara costo por km de un eléctrico vs uno a combustión con
   los precios reales de Uruguay (ANCAP, UTE), y calcula el
   payback contra la diferencia de precio de compra.

   Los defaults tienen fuente y fecha, visibles y editables.
   Nunca se ocultan detrás de un cálculo "mágico".
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

/* Defaults con fuente. Julio 2026. Editables por el usuario:
   estos son puntos de partida, no verdades absolutas. */
const DEFAULTS = {
  kmMensuales: 1200,
  precioNafta: 88.67,          // ANCAP/URSEA, Nafta Súper, jul 2026
  consumoNafta: 8,             // L/100km, auto compacto típico
  precioKwh: 10.31,            // UTE Tarifa Residencial Simple, tramo 101-600 kWh + IVA, abr 2026
  consumoEv: 15.6,             // kWh/100km, BYD Dolphin medido
  precioEvUsd: 32900,
  precioCombustionUsd: 24000,
  tipoCambio: 40.5,
};

const fmt = (n, d = 0) =>
  new Intl.NumberFormat('es-UY', { maximumFractionDigits: d, minimumFractionDigits: d }).format(n);

function Field({ label, value, onChange, unit, source, step = 1 }) {
  return (
    <div style={S.field}>
      <label style={S.fieldLabel}>
        {label}
        {source && <span style={S.source}> · {source}</span>}
      </label>
      <div style={S.fieldInputWrap}>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          step={step}
          style={S.fieldInput}
          className="sim-input"
        />
        {unit && <span style={S.fieldUnit}>{unit}</span>}
      </div>
    </div>
  );
}

export default function SavingsCalculator() {
  const [km, setKm] = useState(DEFAULTS.kmMensuales);
  const [precioNafta, setPrecioNafta] = useState(DEFAULTS.precioNafta);
  const [consumoNafta, setConsumoNafta] = useState(DEFAULTS.consumoNafta);
  const [precioKwh, setPrecioKwh] = useState(DEFAULTS.precioKwh);
  const [consumoEv, setConsumoEv] = useState(DEFAULTS.consumoEv);
  const [precioEvUsd, setPrecioEvUsd] = useState(DEFAULTS.precioEvUsd);
  const [precioCombUsd, setPrecioCombUsd] = useState(DEFAULTS.precioCombustionUsd);
  const [tipoCambio, setTipoCambio] = useState(DEFAULTS.tipoCambio);

  const calc = useMemo(() => {
    const costoNaftaKm = (precioNafta * consumoNafta) / 100;
    const costoEvKm = (precioKwh * consumoEv) / 100;
    const ahorroKm = costoNaftaKm - costoEvKm;
    const ahorroMensual = ahorroKm * km;
    const ahorroAnual = ahorroMensual * 12;

    const diferenciaPrecioUyu = (precioEvUsd - precioCombUsd) * tipoCambio;
    const paybackMeses = ahorroMensual > 0 ? diferenciaPrecioUyu / ahorroMensual : null;

    return {
      costoNaftaKm,
      costoEvKm,
      ahorroKm,
      ahorroMensual,
      ahorroAnual,
      diferenciaPrecioUyu,
      paybackMeses,
    };
  }, [km, precioNafta, consumoNafta, precioKwh, consumoEv, precioEvUsd, precioCombUsd, tipoCambio]);

  const shareText = `Calculé mi ahorro pasándome a un eléctrico en autoelectrico.uy: ${
    calc.ahorroMensual > 0
      ? `ahorraría ${fmt(calc.ahorroMensual)} $/mes en combustible`
      : 'lo calculé con mis propios números'
  }. Probalo vos:`;

  const shareUrl = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' https://autoelectrico.uy/ahorro')}`;
    window.open(url, '_blank', 'noopener');
  };

  return (
    <div style={S.root}>
      <style>{CSS}</style>
      <div style={S.wrap}>
        <header style={S.head}>
          <div style={S.eyebrow}>Simulador</div>
          <h1 style={S.h1}>¿Cuánto ahorrás pasándote a un eléctrico?</h1>
          <p style={S.lede}>
            Con los precios reales de nafta y UTE. Cambiá cualquier número por
            el tuyo — estos son puntos de partida, no verdades absolutas.
          </p>
        </header>

        <div style={S.grid} className="sim-grid">
          {/* Inputs */}
          <section style={S.panel}>
            <h2 style={S.panelTitle}>Tu uso</h2>
            <Field
              label="Kilómetros por mes"
              value={km}
              onChange={setKm}
              unit="km"
              step={100}
            />

            <h2 style={{ ...S.panelTitle, marginTop: 24 }}>Auto a combustión</h2>
            <Field
              label="Precio de la nafta"
              value={precioNafta}
              onChange={setPrecioNafta}
              unit="$/L"
              source="ANCAP, jul 2026"
              step={0.1}
            />
            <Field
              label="Consumo"
              value={consumoNafta}
              onChange={setConsumoNafta}
              unit="L/100km"
              step={0.5}
            />
            <Field
              label="Precio de compra"
              value={precioCombUsd}
              onChange={setPrecioCombUsd}
              unit="USD"
              step={500}
            />

            <h2 style={{ ...S.panelTitle, marginTop: 24 }}>Auto eléctrico</h2>
            <Field
              label="Precio del kWh"
              value={precioKwh}
              onChange={setPrecioKwh}
              unit="$/kWh"
              source="UTE, tramo 101-600 kWh + IVA"
              step={0.1}
            />
            <Field
              label="Consumo"
              value={consumoEv}
              onChange={setConsumoEv}
              unit="kWh/100km"
              step={0.5}
            />
            <Field
              label="Precio de compra"
              value={precioEvUsd}
              onChange={setPrecioEvUsd}
              unit="USD"
              step={500}
            />

            <h2 style={{ ...S.panelTitle, marginTop: 24 }}>Cambio</h2>
            <Field
              label="Tipo de cambio"
              value={tipoCambio}
              onChange={setTipoCambio}
              unit="$/USD"
              step={0.1}
            />
          </section>

          {/* Resultado */}
          <section style={S.result}>
            <div style={S.resultCard}>
              <div style={S.resultLabel}>Costo por km</div>
              <div style={S.compareRow}>
                <div>
                  <div style={{ ...S.compareVal, color: C.lab }}>
                    ${fmt(calc.costoNaftaKm, 2)}
                  </div>
                  <div style={S.compareTag}>combustión</div>
                </div>
                <div style={S.vs}>vs</div>
                <div>
                  <div style={{ ...S.compareVal, color: C.real }}>
                    ${fmt(calc.costoEvKm, 2)}
                  </div>
                  <div style={S.compareTag}>eléctrico</div>
                </div>
              </div>
            </div>

            <div
              style={{
                ...S.resultCard,
                borderColor: calc.ahorroMensual > 0 ? C.real : C.lab,
              }}
            >
              <div style={S.resultLabel}>Ahorro con el eléctrico</div>
              <div
                style={{
                  ...S.bigNumber,
                  color: calc.ahorroMensual > 0 ? C.real : C.lab,
                }}
              >
                {calc.ahorroMensual > 0 ? '' : '−'}${fmt(Math.abs(calc.ahorroMensual))}
                <span style={S.bigUnit}> /mes</span>
              </div>
              <div style={S.subNumber}>
                {calc.ahorroMensual > 0 ? '' : '−'}${fmt(Math.abs(calc.ahorroAnual))} al año
              </div>
              {calc.ahorroMensual <= 0 && (
                <div style={S.warning}>
                  Con estos números, el combustión sale más barato en
                  combustible. Revisá tu consumo real de nafta.
                </div>
              )}
            </div>

            <div style={S.resultCard}>
              <div style={S.resultLabel}>Recuperás la diferencia de precio en</div>
              {calc.paybackMeses != null && calc.diferenciaPrecioUyu > 0 ? (
                <>
                  <div style={S.bigNumber}>
                    {calc.paybackMeses < 1
                      ? 'ya'
                      : fmt(calc.paybackMeses / 12, 1)}
                    {calc.paybackMeses >= 1 && <span style={S.bigUnit}> años</span>}
                  </div>
                  <div style={S.subNumber}>
                    diferencia de compra: ${fmt(calc.diferenciaPrecioUyu)} · $
                    {fmt(precioEvUsd - precioCombUsd)} USD
                  </div>
                </>
              ) : calc.diferenciaPrecioUyu <= 0 ? (
                <div style={S.subNumber}>
                  El eléctrico no cuesta más que el de combustión con estos
                  precios: el ahorro empieza el día uno.
                </div>
              ) : (
                <div style={S.subNumber}>
                  Con estos números no se recupera: el combustible del
                  eléctrico no sale más barato acá.
                </div>
              )}
            </div>

            <button onClick={shareUrl} className="sim-share" style={S.shareBtn}>
              Compartir por WhatsApp
            </button>
          </section>
        </div>

        <footer style={S.foot}>
          Precio de nafta: ANCAP/URSEA, julio 2026. Tarifa UTE: Tarifa
          Residencial Simple, tramo 101-600 kWh, abril 2026, con IVA. Ajustá
          los valores si tenés otra tarifa o el precio cambió.
        </footer>
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
  wrap: { maxWidth: 780, margin: '0 auto' },
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
    fontSize: 'clamp(26px, 5.5vw, 36px)',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    margin: '0 0 12px',
    lineHeight: 1.2,
  },
  lede: {
    fontSize: 14,
    color: C.dim,
    lineHeight: 1.6,
    margin: 0,
    maxWidth: '56ch',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
    gap: 20,
  },
  panel: {
    background: C.surface,
    border: `1px solid ${C.line}`,
    borderRadius: 4,
    padding: '20px',
  },
  panelTitle: {
    fontFamily: mono,
    fontSize: 11,
    fontWeight: 500,
    color: C.dim,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    margin: '0 0 14px',
    paddingBottom: 10,
    borderBottom: `1px solid ${C.line}`,
  },
  field: { marginBottom: 14 },
  fieldLabel: {
    display: 'block',
    fontSize: 12,
    color: C.text,
    marginBottom: 6,
  },
  source: {
    fontFamily: mono,
    fontSize: 10,
    color: C.faint,
  },
  fieldInputWrap: { position: 'relative' },
  fieldInput: {
    width: '100%',
    fontFamily: mono,
    fontSize: 15,
    padding: '9px 50px 9px 11px',
    background: C.bg,
    color: C.text,
    border: `1px solid ${C.line}`,
    borderRadius: 3,
    outline: 'none',
    boxSizing: 'border-box',
  },
  fieldUnit: {
    position: 'absolute',
    right: 11,
    top: '50%',
    transform: 'translateY(-50%)',
    fontFamily: mono,
    fontSize: 11,
    color: C.faint,
    pointerEvents: 'none',
  },
  result: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  resultCard: {
    background: C.surface,
    border: `1px solid ${C.line}`,
    borderRadius: 4,
    padding: '18px 20px',
  },
  resultLabel: {
    fontFamily: mono,
    fontSize: 10,
    color: C.dim,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 12,
  },
  compareRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  compareVal: {
    fontFamily: mono,
    fontSize: 22,
    fontWeight: 500,
    textAlign: 'center',
  },
  compareTag: {
    fontFamily: mono,
    fontSize: 10,
    color: C.faint,
    textAlign: 'center',
    marginTop: 4,
  },
  vs: {
    fontFamily: mono,
    fontSize: 11,
    color: C.faint,
  },
  bigNumber: {
    fontFamily: mono,
    fontSize: 32,
    fontWeight: 600,
    letterSpacing: '-0.02em',
  },
  bigUnit: {
    fontSize: 14,
    color: C.dim,
    fontWeight: 400,
  },
  subNumber: {
    fontFamily: mono,
    fontSize: 12,
    color: C.faint,
    marginTop: 6,
  },
  warning: {
    fontSize: 12,
    color: C.lab,
    marginTop: 10,
    lineHeight: 1.5,
  },
  shareBtn: {
    fontFamily: mono,
    fontSize: 13,
    fontWeight: 500,
    padding: '13px',
    background: C.real,
    color: C.bg,
    border: 'none',
    borderRadius: 3,
    cursor: 'pointer',
    transition: 'opacity 150ms ease',
  },
  foot: {
    marginTop: 28,
    paddingTop: 18,
    borderTop: `1px solid ${C.line}`,
    fontFamily: mono,
    fontSize: 11,
    color: C.faint,
    lineHeight: 1.6,
  },
};

const CSS = `
.sim-input:focus { border-color: ${C.real} !important; }
.sim-share:hover { filter: brightness(1.08); }
@media (max-width: 640px) {
  .sim-grid { grid-template-columns: 1fr !important; }
}
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
`;
