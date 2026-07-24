'use client';

import React, { useState, useEffect, useMemo } from 'react';

/* ============================================================
   Simulador de carga pública — UTE

   UTE es, hoy, la única red con tarifa pública verificable en
   Uruguay. Buscamos específicamente otros operadores (Zunder,
   Enel X, Powerdot, Electromaps) y ninguno opera acá — son redes
   europeas. Electromaps es una app que lista puntos, no un
   operador con tarifa propia en Uruguay. Las estaciones ANCAP del
   interior usan cargadores de UTE, no una tarifa propia. Por eso
   este simulador es de un solo operador, no un comparador — lo
   decimos explícito en vez de simular una competencia que no
   existe todavía.

   Lógica del simulador: elegís tu vehículo (autocompleta la
   batería real de nuestro catálogo) y un rango de carga (SOC,
   ej. 20% → 80%) en vez de tipear kWh sueltos — así el número
   sale de datos reales del auto, no de una estimación a ojo.

   Estructura de precio real (resolución UTE, enero 2026):
     cargo base ("bajada de bandera") + kWh cargados × precio/kWh
   Distinto para corriente alterna (AC) y continua (DC). Hay
   además un cargo por tiempo conectado sin cargar después de 20
   minutos, que no simulamos: no hay un monto público confirmado.

   Los precios son editables a propósito: UTE avisó que iba a
   seguir ajustando durante 2026.
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
};
const mono = "'IBM Plex Mono', ui-monospace, Menlo, monospace";
const sans = "'IBM Plex Sans', -apple-system, sans-serif";

const fmt = (n) => new Intl.NumberFormat('es-UY', { maximumFractionDigits: 0 }).format(n);

const TARIFAS = {
  ac: { base: 54.8, kwh: 10.4, label: 'Corriente alterna · carga lenta' },
  dc: { base: 132.9, kwh: 11.8, label: 'Corriente continua · carga rápida' },
};

export default function CargaPublicaSimulator() {
  const [models, setModels] = useState([]);
  const [modelsError, setModelsError] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedSlug, setSelectedSlug] = useState('');

  const [batteryKwh, setBatteryKwh] = useState(60);
  const [socFrom, setSocFrom] = useState(20);
  const [socTo, setSocTo] = useState(80);
  const [tipo, setTipo] = useState('dc');
  const [baseFee, setBaseFee] = useState(TARIFAS.dc.base);
  const [kwhPrice, setKwhPrice] = useState(TARIFAS.dc.kwh);
  const [tipoCambio, setTipoCambio] = useState(40.5);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/models')
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setModels(data.models ?? []); })
      .catch(() => { if (!cancelled) setModelsError(true); });
    return () => { cancelled = true; };
  }, []);

  const brands = useMemo(() => [...new Set(models.map((m) => m.brand))].sort(), [models]);
  const modelsForBrand = useMemo(
    () => models.filter((m) => m.brand === selectedBrand),
    [models, selectedBrand]
  );
  const selectedModel = useMemo(
    () => models.find((m) => m.slug === selectedSlug) ?? null,
    [models, selectedSlug]
  );

  useEffect(() => {
    if (selectedModel?.batteryKwh != null) setBatteryKwh(selectedModel.batteryKwh);
  }, [selectedModel]);

  const cambiarTipo = (t) => {
    setTipo(t);
    setBaseFee(TARIFAS[t].base);
    setKwhPrice(TARIFAS[t].kwh);
  };

  const socRange = Math.max(socTo - socFrom, 0);
  const kwh = (batteryKwh * socRange) / 100;
  const totalPesos = baseFee + kwh * kwhPrice;
  const totalUsd = totalPesos / tipoCambio;
  const costoPorKwh = kwh > 0 ? totalPesos / kwh : 0;

  const selectStyle = S.input;

  return (
    <div style={S.card}>
      <div style={S.head}>
        <div style={S.title}>Simulador de carga pública</div>
        <div style={S.subtitle}>Red de UTE — el único operador con tarifa pública verificable en Uruguay hoy</div>
      </div>

      {/* Selector de vehículo */}
      <div style={S.field}>
        <label style={S.label}>Elegí tu vehículo (opcional)</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <select
            value={selectedBrand}
            onChange={(e) => { setSelectedBrand(e.target.value); setSelectedSlug(''); }}
            style={selectStyle}
          >
            <option value="">Marca…</option>
            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <select
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            disabled={!selectedBrand}
            style={{ ...selectStyle, opacity: selectedBrand ? 1 : 0.5 }}
          >
            <option value="">{selectedBrand ? 'Modelo…' : 'Elegí marca primero'}</option>
            {modelsForBrand.map((m) => (
              <option key={m.slug} value={m.slug}>{m.model}{m.variant ? ` ${m.variant}` : ''}</option>
            ))}
          </select>
        </div>
        {modelsError && <div style={S.errorNote}>No pudimos cargar el catálogo — completá la batería a mano abajo.</div>}
      </div>

      {/* Batería + SOC */}
      <div style={S.fieldsGrid}>
        <div style={S.field}>
          <label style={S.label}>Batería del auto</label>
          <div style={S.inputWrap}>
            <input
              type="number"
              value={batteryKwh}
              onChange={(e) => setBatteryKwh(Number(e.target.value) || 0)}
              style={S.input}
            />
            <span style={S.unit}>kWh</span>
          </div>
        </div>
        <div style={S.field}>
          <label style={S.label}>Desde (SOC actual)</label>
          <div style={S.inputWrap}>
            <input
              type="number" min="0" max="100"
              value={socFrom}
              onChange={(e) => setSocFrom(Math.min(Number(e.target.value) || 0, 100))}
              style={S.input}
            />
            <span style={S.unit}>%</span>
          </div>
        </div>
        <div style={S.field}>
          <label style={S.label}>Hasta (objetivo)</label>
          <div style={S.inputWrap}>
            <input
              type="number" min="0" max="100"
              value={socTo}
              onChange={(e) => setSocTo(Math.min(Number(e.target.value) || 0, 100))}
              style={S.input}
            />
            <span style={S.unit}>%</span>
          </div>
        </div>
      </div>
      <div style={S.socNote}>
        Vas a cargar <strong style={{ color: C.real }}>{kwh.toFixed(1)} kWh</strong> ({socFrom}% → {socTo}% de {batteryKwh} kWh)
      </div>

      <div style={S.toggleRow}>
        {['ac', 'dc'].map((t) => (
          <button
            key={t}
            onClick={() => cambiarTipo(t)}
            style={{ ...S.toggleBtn, ...(tipo === t ? S.toggleBtnActive : {}) }}
          >
            {TARIFAS[t].label}
          </button>
        ))}
      </div>

      <div style={S.fieldsGrid}>
        <div style={S.field}>
          <label style={S.label}>Cargo base ("bajada de bandera")</label>
          <div style={S.inputWrap}>
            <input type="number" step="0.1" value={baseFee} onChange={(e) => setBaseFee(Number(e.target.value) || 0)} style={S.input} />
            <span style={S.unit}>$</span>
          </div>
        </div>
        <div style={S.field}>
          <label style={S.label}>Precio por kWh</label>
          <div style={S.inputWrap}>
            <input type="number" step="0.1" value={kwhPrice} onChange={(e) => setKwhPrice(Number(e.target.value) || 0)} style={S.input} />
            <span style={S.unit}>$/kWh</span>
          </div>
        </div>
        <div style={S.field}>
          <label style={S.label}>Tipo de cambio</label>
          <div style={S.inputWrap}>
            <input type="number" step="0.1" value={tipoCambio} onChange={(e) => setTipoCambio(Number(e.target.value) || 1)} style={S.input} />
            <span style={S.unit}>$/USD</span>
          </div>
        </div>
      </div>

      <div style={S.resultCard}>
        <div style={S.resultLabel}>Costo total de esta carga</div>
        <div style={S.resultValue}>
          ${fmt(totalPesos)} <span style={S.resultUsd}>· USD {totalUsd.toFixed(1)}</span>
        </div>
        <div style={S.resultBreakdown}>
          ${fmt(baseFee)} de base + {kwh.toFixed(1)} kWh × ${kwhPrice} = ${fmt(totalPesos)}
          {' '}(${costoPorKwh.toFixed(1)}/kWh efectivo)
        </div>
      </div>

      <p style={S.note}>
        Después de 20 minutos conectado sin estar cargando, UTE suma un cargo
        extra por tiempo — no lo simulamos porque no encontramos un monto
        público confirmado. Precios de la resolución de enero 2026; UTE ya
        avisó que iba a seguir ajustando durante el año, así que cambiá los
        números de arriba si tenés uno más actual.
      </p>
    </div>
  );
}

const S = {
  card: {
    background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8,
    padding: '22px 20px', marginTop: 20, fontFamily: sans, color: C.text,
  },
  head: { marginBottom: 18 },
  title: { fontSize: 16, fontWeight: 600 },
  subtitle: { fontSize: 12, color: C.dim, marginTop: 3, fontFamily: mono },
  field: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 },
  fieldsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 12, marginBottom: 8,
  },
  label: { fontFamily: mono, fontSize: 10.5, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.04em' },
  inputWrap: { position: 'relative' },
  input: {
    width: '100%', fontFamily: mono, fontSize: 14, padding: '10px 12px',
    background: C.bg, color: C.text, border: `1px solid ${C.line}`,
    borderRadius: 4, outline: 'none', boxSizing: 'border-box', cursor: 'pointer',
  },
  unit: {
    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
    fontSize: 11, color: C.dim, fontFamily: mono, pointerEvents: 'none',
  },
  errorNote: { fontSize: 11.5, color: C.lab, marginTop: 6, fontFamily: mono },
  socNote: { fontSize: 13, color: C.dim, marginBottom: 18, fontFamily: sans },
  toggleRow: { display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' },
  toggleBtn: {
    fontFamily: mono, fontSize: 12.5, padding: '9px 14px',
    background: 'transparent', color: C.dim, border: `1px solid ${C.line}`,
    borderRadius: 20, cursor: 'pointer',
  },
  toggleBtnActive: { background: C.real, color: C.bg, borderColor: C.real, fontWeight: 600 },
  resultCard: {
    background: C.bg, border: `1px solid ${C.real}`, borderRadius: 6,
    padding: '18px 20px', marginBottom: 14,
  },
  resultLabel: { fontFamily: mono, fontSize: 10.5, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 },
  resultValue: { fontFamily: mono, fontSize: 28, fontWeight: 600, color: C.real },
  resultUsd: { fontSize: 14, color: C.dim, fontWeight: 400 },
  resultBreakdown: { fontFamily: mono, fontSize: 11.5, color: C.faint, marginTop: 8 },
  note: { fontSize: 12, color: C.faint, lineHeight: 1.6, margin: 0 },
};
