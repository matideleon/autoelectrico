'use client';

import React, { useState, useEffect, useMemo } from 'react';

/* ============================================================
   Simulador de carga pública — 6 operadores

   Datos recopilados por el equipo de autoelectrico.uy a partir de
   las tarifas publicadas por cada operador (UTE, DISA, Mobility,
   DMC, eOne, Evergo), julio 2026. No son de un único sitio externo
   — se citan así, como dato propio del sitio, igual que hacemos
   con la autonomía "medida acá".

   Lógica: elegís vehículo (autocompleta batería) y un rango de
   carga (SOC), calculamos los kWh reales, y mostramos el costo en
   TODOS los operadores/franjas, ordenado de más barato a más caro
   — para ese kWh específico, no un ranking fijo (la bajada de
   bandera pesa distinto según cuánto cargues).
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

/* Las 17 tarifas reales, recopiladas por autoelectrico.uy, jul 2026 */
const TARIFAS = [
  { operador: 'UTE', tipo: 'AC (lentos)', banda: 'Sin bandas', kwh: 10.40, base: 54.80 },
  { operador: 'DISA', tipo: '—', banda: '00:00–07:00', kwh: 10.00, base: 120.00 },
  { operador: 'UTE', tipo: 'CC (rápidos)', banda: 'Sin bandas', kwh: 11.80, base: 132.90 },
  { operador: 'DISA', tipo: '—', banda: 'Resto del día', kwh: 12.00, base: 120.00 },
  { operador: 'Mobility', tipo: 'CCS2', banda: 'Resto del día', kwh: 12.50, base: 130.00 },
  { operador: 'UTE', tipo: 'CC predios privados', banda: 'Sin bandas', kwh: 11.80, base: 199.40 },
  { operador: 'DMC', tipo: '—', banda: '17:00–24:00', kwh: 15.00, base: 0 },
  { operador: 'DMC', tipo: '—', banda: '06:00–17:00', kwh: 16.00, base: 0 },
  { operador: 'DISA', tipo: '—', banda: '18:00–22:00', kwh: 16.00, base: 120.00 },
  { operador: 'DMC', tipo: '—', banda: '00:00–06:00', kwh: 18.00, base: 0 },
  { operador: 'eOne', tipo: 'CCS2/GB-T', banda: 'Resto del día', kwh: 18.30, base: 0 },
  { operador: 'Evergo', tipo: '—', banda: 'Sin bandas (dinámica)', kwh: 19.52, base: 122.00 },
  { operador: 'Mobility', tipo: 'GB/T', banda: '00:00–07:00', kwh: 21.60, base: 130.00 },
  { operador: 'eOne', tipo: 'CCS2/GB-T', banda: '18:00–23:00', kwh: 23.85, base: 0 },
  { operador: 'Mobility', tipo: 'CCS2', banda: '18:00–22:00', kwh: 25.60, base: 130.00 },
  { operador: 'Mobility', tipo: 'GB/T', banda: 'Resto del día', kwh: 26.40, base: 130.00 },
  { operador: 'Mobility', tipo: 'GB/T', banda: '18:00–22:00', kwh: 30.00, base: 130.00 },
];

export default function CargaPublicaSimulator() {
  const [models, setModels] = useState([]);
  const [modelsError, setModelsError] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedSlug, setSelectedSlug] = useState('');

  const [batteryKwh, setBatteryKwh] = useState(60);
  const [socFrom, setSocFrom] = useState(20);
  const [socTo, setSocTo] = useState(80);
  const [tipoCambio, setTipoCambio] = useState(40.5);
  const [selectedTarifa, setSelectedTarifa] = useState(''); // índice en TARIFAS, '' = sin elegir

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

  const socRange = Math.max(socTo - socFrom, 0);
  const kwh = (batteryKwh * socRange) / 100;

  const ranking = useMemo(() => {
    return TARIFAS
      .map((t) => ({ ...t, costo: t.base + kwh * t.kwh }))
      .sort((a, b) => a.costo - b.costo);
  }, [kwh]);

  const masBarato = ranking[0];
  const masCaro = ranking[ranking.length - 1];

  // Si el usuario eligió un operador puntual, calculamos su costo y
  // cuánto se paga de más (o de menos) contra el más barato del país.
  const elegido = useMemo(() => {
    if (selectedTarifa === '') return null;
    const t = TARIFAS[Number(selectedTarifa)];
    if (!t) return null;
    const costo = t.base + kwh * t.kwh;
    const posicion = ranking.findIndex(
      (r) => r.operador === t.operador && r.tipo === t.tipo && r.banda === t.banda
    );
    return { ...t, costo, posicion: posicion + 1, diferencia: costo - masBarato.costo };
  }, [selectedTarifa, kwh, ranking, masBarato]);

  const selectStyle = S.input;

  return (
    <div style={S.card}>
      <div style={S.head}>
        <div style={S.title}>Simulador de carga pública</div>
        <div style={S.subtitle}>6 operadores — UTE, DISA, Mobility, DMC, eOne, Evergo</div>
      </div>

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

      <div style={S.field}>
        <label style={S.label}>Elegí dónde vas a cargar (opcional)</label>
        <select
          value={selectedTarifa}
          onChange={(e) => setSelectedTarifa(e.target.value)}
          style={selectStyle}
        >
          <option value="">Comparar todos los operadores…</option>
          {TARIFAS.map((t, i) => (
            <option key={i} value={i}>
              {t.operador}
              {t.tipo !== '—' ? ` · ${t.tipo}` : ''}
              {t.banda !== 'Sin bandas' ? ` · ${t.banda}` : ''}
            </option>
          ))}
        </select>
      </div>

      <div style={S.fieldsGrid}>
        <div style={S.field}>
          <label style={S.label}>Batería del auto</label>
          <div style={S.inputWrap}>
            <input type="number" value={batteryKwh} onChange={(e) => setBatteryKwh(Number(e.target.value) || 0)} style={S.input} />
            <span style={S.unit}>kWh</span>
          </div>
        </div>
        <div style={S.field}>
          <label style={S.label}>Desde (SOC actual)</label>
          <div style={S.inputWrap}>
            <input type="number" min="0" max="100" value={socFrom} onChange={(e) => setSocFrom(Math.min(Number(e.target.value) || 0, 100))} style={S.input} />
            <span style={S.unit}>%</span>
          </div>
        </div>
        <div style={S.field}>
          <label style={S.label}>Hasta (objetivo)</label>
          <div style={S.inputWrap}>
            <input type="number" min="0" max="100" value={socTo} onChange={(e) => setSocTo(Math.min(Number(e.target.value) || 0, 100))} style={S.input} />
            <span style={S.unit}>%</span>
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
      <div style={S.socNote}>
        Vas a cargar <strong style={{ color: C.real }}>{kwh.toFixed(1)} kWh</strong> ({socFrom}% → {socTo}% de {batteryKwh} kWh)
      </div>

      {kwh > 0 && (
        <>
          {elegido ? (
            <div style={S.bestCard}>
              <div style={S.bestLabel}>Tu carga en {elegido.operador}</div>
              <div style={S.bestValue}>
                {elegido.operador} <span style={S.bestSub}>{elegido.tipo !== '—' ? elegido.tipo : ''} {elegido.banda}</span>
              </div>
              <div style={S.bestCosto}>
                ${fmt(elegido.costo)} <span style={S.resultUsd}>· USD {(elegido.costo / tipoCambio).toFixed(1)}</span>
              </div>
              <div style={S.elegidoNota}>
                Puesto {elegido.posicion} de {ranking.length} en precio.{' '}
                {elegido.diferencia === 0 ? (
                  <span style={{ color: C.real }}>Es la opción más barata para esta carga.</span>
                ) : (
                  <>
                    Pagás <strong style={{ color: C.lab }}>${fmt(elegido.diferencia)} más</strong>{' '}
                    que en {masBarato.operador}
                    {masBarato.tipo !== '—' ? ` ${masBarato.tipo}` : ''}
                    {masBarato.banda !== 'Sin bandas' ? ` (${masBarato.banda})` : ''}.
                  </>
                )}
              </div>
            </div>
          ) : (
            <div style={S.bestCard}>
              <div style={S.bestLabel}>Más barato para esta carga</div>
              <div style={S.bestValue}>
                {masBarato.operador} <span style={S.bestSub}>{masBarato.tipo !== '—' ? masBarato.tipo : ''} {masBarato.banda}</span>
              </div>
              <div style={S.bestCosto}>
                ${fmt(masBarato.costo)} <span style={S.resultUsd}>· USD {(masBarato.costo / tipoCambio).toFixed(1)}</span>
              </div>
            </div>
          )}

          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Operador</th>
                  <th style={S.th}>Tipo / conector</th>
                  <th style={S.th}>Banda</th>
                  <th style={S.th}>$/kWh</th>
                  <th style={S.th}>Bajada</th>
                  <th style={S.th}>Costo total</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((t, i) => {
                  const esElegido = elegido
                    && t.operador === elegido.operador
                    && t.tipo === elegido.tipo
                    && t.banda === elegido.banda;
                  return (
                  <tr key={i} style={esElegido ? S.rowPicked : (i === 0 ? S.rowBest : undefined)}>
                    <td style={{ ...S.td, ...(i === 0 ? { color: C.real, fontWeight: 600 } : {}) }}>{t.operador}</td>
                    <td style={S.td}>{t.tipo}</td>
                    <td style={S.td}>{t.banda}</td>
                    <td style={{ ...S.td, ...S.tdMono }}>${t.kwh.toFixed(2)}</td>
                    <td style={{ ...S.td, ...S.tdMono }}>${fmt(t.base)}</td>
                    <td style={{ ...S.td, ...S.tdMono, ...(i === 0 ? { color: C.real, fontWeight: 600 } : {}) }}>${fmt(t.costo)}</td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p style={S.rangeNote}>
            Para esta carga, la diferencia entre la opción más barata (
            {masBarato.operador}) y la más cara ({masCaro.operador}) es de{' '}
            <strong style={{ color: C.text }}>${fmt(masCaro.costo - masBarato.costo)}</strong>.
          </p>
        </>
      )}

      <p style={S.note}>
        Tarifas recopiladas por autoelectrico.uy a partir de lo publicado por
        cada operador, julio 2026. UTE suma además un cargo por minuto si el
        auto queda conectado sin cargar (no incluido acá). Las tarifas se
        revisan seguido — confirmá el precio vigente en la app de cada
        operador antes de un viaje largo.
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
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
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
  bestCard: {
    background: C.bg, border: `1px solid ${C.real}`, borderRadius: 6,
    padding: '16px 18px', marginBottom: 16,
  },
  bestLabel: { fontFamily: mono, fontSize: 10.5, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 },
  bestValue: { fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 6 },
  bestSub: { fontSize: 12.5, color: C.dim, fontWeight: 400, fontFamily: mono },
  bestCosto: { fontFamily: mono, fontSize: 24, fontWeight: 600, color: C.real },
  resultUsd: { fontSize: 13, color: C.dim, fontWeight: 400 },
  tableWrap: { overflowX: 'auto', marginBottom: 10 },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 520 },
  th: { textAlign: 'left', fontFamily: mono, fontSize: 10, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '8px 10px', borderBottom: `1px solid ${C.line}`, whiteSpace: 'nowrap' },
  td: { padding: '9px 10px', fontSize: 12.5, borderBottom: `1px solid ${C.line}`, whiteSpace: 'nowrap' },
  tdMono: { fontFamily: mono },
  rowBest: { background: 'rgba(61,220,151,0.06)' },
  rowPicked: { background: 'rgba(232,163,61,0.10)', outline: `1px solid ${C.lab}` },
  elegidoNota: { fontSize: 12.5, color: C.dim, marginTop: 10, lineHeight: 1.6 },
  rangeNote: { fontSize: 12.5, color: C.dim, margin: '0 0 14px', lineHeight: 1.6 },
  note: { fontSize: 12, color: C.faint, lineHeight: 1.6, margin: 0 },
};
