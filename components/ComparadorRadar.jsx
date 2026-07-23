'use client';

import React, { useMemo } from 'react';

/* ============================================================
   ComparadorRadar — perfil de 5 ejes: Batería, Baúl, Autonomía,
   Precio, Potencia.

   Regla clave, la misma que rige toda la tabla del comparador:
   un dato faltante NUNCA hace ver peor a un modelo. Si a un auto
   le falta el precio o el baúl, ese vértice se dibuja en el punto
   neutral (50) con un marcador hueco distinto — no en cero, que
   sería castigarlo por no tener el dato, no por ser peor auto.

   Normalización: cada eje se calcula sobre TODO el catálogo
   (no solo los modelos elegidos), para que la escala no salte
   cada vez que se agrega o saca un auto de la comparación.
   Precio se invierte: más barato = más alto en el gráfico,
   aclarado en el subtítulo para que no se lea al revés.
   ============================================================ */

const AXES = [
  { key: 'price_usd', label: 'Precio', invert: true },
  { key: 'battery_kwh', label: 'Batería', invert: false },
  { key: 'range_km', label: 'Autonomía', invert: false },
  { key: 'power_hp', label: 'Potencia', invert: false },
  { key: 'trunk_l', label: 'Baúl', invert: false },
];
// Orden visual en el pentágono (arriba, horario): Batería, Baúl, Autonomía, Precio, Potencia
const AXIS_ORDER = ['battery_kwh', 'trunk_l', 'range_km', 'price_usd', 'power_hp'];

const COLORS = ['#3DDC97', '#E8A33D', '#7C9EFF', '#FF6B9D', '#B8734E'];

const W = 400, H = 400;
const CX = 200, CY = 210;
const R_MAX = 150;
const N = 5;

function angleFor(i) {
  return -90 + i * (360 / N);
}

function polar(r, angleDeg) {
  const a = (angleDeg * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

/** Autonomía preferida: real medida si existe, si no WLTP. */
function rangeOf(m) {
  return m.range_real_km ?? m.range_wltp_km ?? null;
}

export default function ComparadorRadar({ list, allModels }) {
  const axisMeta = useMemo(() => {
    const getVal = (m, key) => (key === 'range_km' ? rangeOf(m) : m[key]);
    return AXES.map((axis) => {
      const vals = allModels.map((m) => getVal(m, axis.key)).filter((v) => v != null);
      const lo = vals.length ? Math.min(...vals) : 0;
      const hi = vals.length ? Math.max(...vals) : 1;
      return { ...axis, lo, hi, hasSpread: hi > lo };
    });
  }, [allModels]);

  const axisByKey = useMemo(() => {
    const m = {};
    axisMeta.forEach((a) => { m[a.key] = a; });
    return m;
  }, [axisMeta]);

  if (list.length === 0) {
    return (
      <div style={S.card}>
        <div style={S.headRow}>
          <div>
            <div style={S.title}>Perfil comparativo</div>
            <div style={S.subtitle}>Valores normalizados sobre todo el catálogo</div>
          </div>
          <div style={S.note}>En precio, más alto significa más accesible</div>
        </div>
        <div style={S.empty}>Agregá vehículos para ver el perfil comparativo.</div>
      </div>
    );
  }

  // Para cada modelo: { value01 por eje, hasData por eje }
  const seriesPerModel = list.map((m) => {
    const getVal = (key) => (key === 'range_km' ? rangeOf(m) : m[key]);
    return AXIS_ORDER.map((key) => {
      const axis = axisByKey[key];
      const raw = getVal(key);
      if (raw == null || !axis.hasSpread) {
        return { key, value01: 0.5, hasData: false };
      }
      let frac = (raw - axis.lo) / (axis.hi - axis.lo);
      if (axis.invert) frac = 1 - frac;
      return { key, value01: frac, hasData: true };
    });
  });

  const gridRings = [0.25, 0.5, 0.75, 1];

  return (
    <div style={S.card}>
      <div style={S.headRow}>
        <div>
          <div style={S.title}>Perfil comparativo</div>
          <div style={S.subtitle}>Valores normalizados sobre todo el catálogo</div>
        </div>
        <div style={S.note}>En precio, más alto significa más accesible</div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={S.svg} role="img" aria-label="Radar comparativo de precio, batería, autonomía, potencia y baúl">
        {/* Anillos de la grilla */}
        {gridRings.map((f) => {
          const pts = AXIS_ORDER.map((_, i) => polar(R_MAX * f, angleFor(i)));
          const d = pts.map((p) => p.join(',')).join(' ');
          return <polygon key={f} points={d} fill="none" stroke="#2A2E35" strokeWidth="1" />;
        })}

        {/* Ejes */}
        {AXIS_ORDER.map((key, i) => {
          const [x, y] = polar(R_MAX, angleFor(i));
          return <line key={key} x1={CX} y1={CY} x2={x} y2={y} stroke="#2A2E35" strokeWidth="1" />;
        })}

        {/* Etiquetas de los anillos (25/50/75/100) */}
        {gridRings.map((f) => (
          <text key={f} x={CX + 4} y={CY - R_MAX * f + 3} fontSize="9" fontFamily="IBM Plex Mono, monospace" fill="#565C66">
            {Math.round(f * 100)}
          </text>
        ))}

        {/* Un polígono por modelo */}
        {seriesPerModel.map((series, mi) => {
          const color = COLORS[mi % COLORS.length];
          const pts = series.map((s, i) => polar(R_MAX * s.value01, angleFor(i)));
          const d = pts.map((p) => p.join(',')).join(' ');
          return (
            <g key={mi}>
              <polygon points={d} fill={color} fillOpacity="0.12" stroke={color} strokeWidth="2" />
              {series.map((s, i) => {
                const [x, y] = pts[i];
                return s.hasData ? (
                  <circle key={i} cx={x} cy={y} r="3.5" fill={color} />
                ) : (
                  <circle key={i} cx={x} cy={y} r="4" fill={S.cardBg} stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
                );
              })}
            </g>
          );
        })}

        {/* Etiquetas de los ejes */}
        {AXIS_ORDER.map((key, i) => {
          const axis = axisByKey[key];
          const [x, y] = polar(R_MAX + 26, angleFor(i));
          const anchor = Math.abs(Math.cos((angleFor(i) * Math.PI) / 180)) < 0.2
            ? 'middle'
            : Math.cos((angleFor(i) * Math.PI) / 180) > 0 ? 'start' : 'end';
          return (
            <text key={key} x={x} y={y} textAnchor={anchor} dominantBaseline="middle" fontSize="13" fontWeight="600" fontFamily="IBM Plex Sans, sans-serif" fill="#E6E8EB">
              {axis.label}
            </text>
          );
        })}
      </svg>

      {/* Leyenda */}
      <div style={S.legend}>
        {list.map((m, i) => (
          <span key={m.slug} style={S.legendItem}>
            <span style={{ ...S.legendDot, background: COLORS[i % COLORS.length] }} />
            {m.brand} {m.model}
          </span>
        ))}
      </div>

      {/* Aviso de datos faltantes, si aplica */}
      {seriesPerModel.some((s) => s.some((v) => !v.hasData)) && (
        <div style={S.gapNote}>
          <span style={S.gapMarker}>○</span> marcador hueco: sin dato verificado
          todavía para ese eje — no se penaliza, se muestra en el punto neutral.
        </div>
      )}
    </div>
  );
}

const S = {
  cardBg: '#1B1E23',
  card: {
    background: '#1B1E23',
    border: '1px solid #2A2E35',
    borderRadius: 8,
    padding: '22px 20px',
    marginTop: 20,
  },
  headRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  title: { fontSize: 16, fontWeight: 600, color: '#E6E8EB', fontFamily: "'IBM Plex Sans', sans-serif" },
  subtitle: { fontSize: 12, color: '#8A9099', marginTop: 2, fontFamily: "'IBM Plex Sans', sans-serif" },
  note: { fontSize: 11, color: '#8A9099', fontFamily: "'IBM Plex Mono', monospace", textAlign: 'right' },
  svg: { width: '100%', height: 'auto', maxWidth: 440, display: 'block', margin: '10px auto 0' },
  empty: { fontSize: 13, color: '#565C66', textAlign: 'center', padding: '30px 10px', fontFamily: "'IBM Plex Sans', sans-serif" },
  legend: { display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 12 },
  legendItem: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 12, color: '#E6E8EB', fontFamily: "'IBM Plex Sans', sans-serif",
  },
  legendDot: { width: 9, height: 9, borderRadius: '50%', display: 'inline-block' },
  gapNote: {
    fontSize: 10.5, color: '#565C66', textAlign: 'center', marginTop: 12,
    fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.5,
  },
  gapMarker: { color: '#8A9099' },
};
