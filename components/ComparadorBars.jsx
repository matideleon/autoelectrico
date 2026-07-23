'use client';

import React from 'react';

/* ============================================================
   ComparadorBars — "Valores principales"

   Una barra por auto, por cada métrica clave. El largo de la
   barra es el valor real (no normalizado como el radar) — así
   un BMW caro tiene una barra de precio larga y un auto barato
   la tiene corta, y la estrella marca cuál gana según la regla
   de esa métrica (más barato, más autonomía, etc.), no según el
   largo de la barra.

   Reusa la misma winnerOf() de la tabla: ni inventa una segunda
   noción de "quién gana" que se pueda desincronizar con la tabla.
   Si a algún auto le falta el dato, no se declara ganador para
   esa métrica — mismo criterio de siempre.
   ============================================================ */

const fmt = (n) => new Intl.NumberFormat('es-UY').format(n);

function rangeOf(m) {
  return m.range_real_km ?? m.range_wltp_km ?? null;
}

const METRICS = [
  { key: 'price_usd', label: 'Precio', unit: 'USD', better: 'lower', prefix: 'USD ' },
  { key: 'range_km', label: 'Autonomía', unit: 'km', better: 'higher', suffix: ' km' },
  { key: 'battery_kwh', label: 'Batería', unit: 'kWh', better: 'higher', suffix: ' kWh' },
  { key: 'power_hp', label: 'Potencia', unit: 'HP', better: 'higher', suffix: ' HP' },
  { key: 'trunk_l', label: 'Baúl', unit: 'L', better: 'higher', suffix: ' L' },
];

/* La misma winnerOf que usa la tabla del comparador: solo declara
   ganador si TODOS tienen el dato. Se pasa por prop para no
   duplicar la lógica en dos archivos. */
export default function ComparadorBars({ list, winnerOf }) {
  if (list.length === 0) return null;

  // Vista interna con range_km ya resuelto (real si existe, si no WLTP)
  const withRange = list.map((m) => ({ ...m, range_km: rangeOf(m) }));

  const visibleMetrics = METRICS.filter((metric) =>
    withRange.some((m) => m[metric.key] != null)
  );

  if (visibleMetrics.length === 0) return null;

  return (
    <div style={S.card}>
      <div style={S.headRow}>
        <div style={S.title}>Valores principales</div>
        <div style={S.note}>La estrella indica el mejor resultado</div>
      </div>

      <div style={S.metricsWrap}>
        {visibleMetrics.map((metric) => {
          const winnerIdx = winnerOf(metric, withRange);
          const values = withRange
            .map((m) => m[metric.key])
            .filter((v) => v != null);
          const max = values.length ? Math.max(...values) : 1;

          return (
            <div key={metric.key} style={S.metricCard}>
              <div style={S.metricHead}>
                <span style={S.metricLabel}>{metric.label}</span>
                <span style={S.metricUnit}>{metric.unit}</span>
              </div>

              {withRange.map((m, i) => {
                const raw = m[metric.key];
                const hasData = raw != null;
                const pct = hasData ? Math.max((raw / max) * 100, 3) : 0;
                const isWinner = winnerIdx === i;

                return (
                  <div key={m.slug} style={S.row}>
                    <div style={S.rowHead}>
                      <span style={S.rowLabel}>{m.brand} {m.model}</span>
                      <span style={S.rowValue}>
                        {hasData ? (
                          <>
                            {metric.prefix}{fmt(raw)}{metric.suffix}
                            {isWinner && <span style={S.star}> ★</span>}
                          </>
                        ) : (
                          <span style={S.noData}>sin dato</span>
                        )}
                      </span>
                    </div>
                    <div style={S.track}>
                      {hasData ? (
                        <div
                          style={{
                            ...S.fill,
                            width: `${pct}%`,
                            background: isWinner ? '#3DDC97' : '#4A8A73',
                          }}
                        />
                      ) : (
                        <div style={S.trackEmpty} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const S = {
  card: {
    background: '#1B1E23',
    border: '1px solid #2A2E35',
    borderRadius: 8,
    padding: '22px 20px',
    fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
    height: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
  },
  headRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    flexWrap: 'wrap', gap: 8, marginBottom: 18,
  },
  title: { fontSize: 16, fontWeight: 600, color: '#E6E8EB' },
  note: { fontSize: 11.5, color: '#8A9099', fontFamily: "'IBM Plex Mono', monospace" },
  metricsWrap: { display: 'flex', flexDirection: 'column', gap: 22 },
  metricCard: {
    background: '#141619', border: '1px solid #2A2E35', borderRadius: 6, padding: '16px 18px',
  },
  metricHead: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14,
  },
  metricLabel: { fontSize: 15, fontWeight: 600, color: '#E6E8EB' },
  metricUnit: { fontSize: 11, color: '#8A9099', fontFamily: "'IBM Plex Mono', monospace" },
  row: { marginBottom: 14 },
  rowHead: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
    marginBottom: 6, gap: 8, flexWrap: 'wrap',
  },
  rowLabel: { fontSize: 13, color: '#8A9099' },
  rowValue: { fontSize: 14, fontWeight: 600, color: '#E6E8EB', fontFamily: "'IBM Plex Mono', monospace", whiteSpace: 'nowrap' },
  star: { color: '#3DDC97' },
  noData: { fontSize: 11.5, color: '#565C66', fontStyle: 'italic', fontWeight: 400, fontFamily: "'IBM Plex Sans', sans-serif" },
  track: { height: 7, background: '#2A2E35', borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4, transition: 'width 300ms ease' },
  trackEmpty: {
    height: '100%', width: '6%', borderRadius: 4,
    border: '1px dashed #4A505A', boxSizing: 'border-box',
  },
};
