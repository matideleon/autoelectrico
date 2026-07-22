'use client';

import React from 'react';

/* ============================================================
   SavingsChart — ahorro acumulado en el tiempo.

   Una línea: cuánto acumulás de ahorro mes a mes. Si hay precio
   cargado, una línea de referencia horizontal marca lo que cuesta
   el auto, y el cruce ES la amortización — la misma cifra que ya
   muestra el número de arriba, ahora visual.

   Geometría verificada con render real antes de shippear (no a
   ojo): el rango de meses se extiende hasta cubrir el cruce real,
   con un tope de 15 años más allá del cual se prefiere texto
   ("más de 15 años") antes que un gráfico con el cruce cortado.
   ============================================================ */

const C = {
  bg: '#141619',
  surface: '#1B1E23',
  line: '#2a2d33',
  text: '#E6E8EB',
  dim: '#8A9099',
  faint: '#565C66',
  real: '#00d084',
  lab: '#E8A33D',
};

const W = 500;
const H = 260;
const PAD_L = 55;
const PAD_R = 16;
const PAD_T = 16;
const PAD_B = 34;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;
const MAX_MONTHS_SHOWN = 180; // 15 años: tope razonable de la vista

function fmtMiles(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return Math.round(n).toString();
}

export default function SavingsChart({ monthlySavings, priceUYU, amortizacionMeses }) {
  if (!(monthlySavings > 0)) {
    return (
      <div style={S.card}>
        <div style={S.title}>AHORRO ACUMULADO EN EL TIEMPO</div>
        <div style={S.empty}>
          Con estos números no hay ahorro mensual positivo: no hay una
          curva creciente para mostrar todavía.
        </div>
      </div>
    );
  }

  const hasPrice = priceUYU > 0;
  const tooFar = hasPrice && amortizacionMeses > MAX_MONTHS_SHOWN;

  let months;
  if (hasPrice && !tooFar) {
    months = Math.min(Math.max(24, amortizacionMeses * 1.25), MAX_MONTHS_SHOWN);
  } else if (tooFar) {
    months = MAX_MONTHS_SHOWN;
  } else {
    months = 60;
  }

  const finalSavings = monthlySavings * months;
  const maxY = (tooFar ? finalSavings : Math.max(finalSavings, hasPrice ? priceUYU : 0)) * 1.08;

  const xFor = (m) => PAD_L + (m / months) * PLOT_W;
  const yFor = (v) => PAD_T + PLOT_H - (v / maxY) * PLOT_H;

  const lineEnd = [xFor(months), yFor(finalSavings)];
  const showCrossover = hasPrice && !tooFar;
  const refY = showCrossover ? yFor(priceUYU) : null;
  const crossX = showCrossover ? xFor(amortizacionMeses) : null;

  // Marcas del eje X: 4 puntos repartidos, en años si el rango es
  // grande, en meses si es corto — lo que se lea mejor.
  const useYears = months > 30;
  const tickCount = 4;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => (months / tickCount) * i);

  const yearsToShow = amortizacionMeses != null ? amortizacionMeses / 12 : null;

  return (
    <div style={S.card}>
      <div style={S.title}>AHORRO ACUMULADO EN EL TIEMPO</div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={S.svg}
        role="img"
        aria-label={
          showCrossover
            ? `Ahorro acumulado a lo largo del tiempo, cruza el precio del auto a los ${yearsToShow.toFixed(1)} años`
            : 'Ahorro acumulado a lo largo del tiempo'
        }
      >
        {/* Grilla horizontal sutil */}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={PAD_L}
            x2={W - PAD_R}
            y1={PAD_T + PLOT_H * (1 - f)}
            y2={PAD_T + PLOT_H * (1 - f)}
            stroke={C.line}
            strokeWidth="1"
          />
        ))}

        {/* Eje X: meses/años */}
        {ticks.map((m, i) => (
          <text
            key={i}
            x={xFor(m)}
            y={H - 10}
            textAnchor={i === 0 ? 'start' : i === tickCount ? 'end' : 'middle'}
            fontSize="10"
            fontFamily="IBM Plex Mono, monospace"
            fill={C.dim}
          >
            {useYears ? `${(m / 12).toFixed(0)}a` : `${Math.round(m)}m`}
          </text>
        ))}

        {/* Línea de referencia: precio del auto */}
        {showCrossover && (
          <>
            <line
              x1={PAD_L}
              x2={W - PAD_R}
              y1={refY}
              y2={refY}
              stroke={C.lab}
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text x={PAD_L} y={refY - 6} fontSize="10" fontFamily="IBM Plex Mono, monospace" fill={C.lab}>
              precio del auto
            </text>
          </>
        )}

        {/* Línea de ahorro acumulado */}
        <line
          x1={xFor(0)}
          y1={yFor(0)}
          x2={lineEnd[0]}
          y2={lineEnd[1]}
          stroke={C.real}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Cruce: la amortización, visualizada */}
        {showCrossover && (
          <>
            <line
              x1={crossX}
              x2={crossX}
              y1={refY}
              y2={H - PAD_B}
              stroke={C.real}
              strokeWidth="1"
              strokeDasharray="2 3"
              opacity="0.6"
            />
            <circle cx={crossX} cy={refY} r="5" fill={C.real} />
            <text
              x={Math.min(crossX + 8, W - PAD_R - 60)}
              y={refY - 8}
              fontSize="11"
              fontFamily="IBM Plex Mono, monospace"
              fontWeight="500"
              fill={C.real}
            >
              {yearsToShow.toFixed(1)} años
            </text>
          </>
        )}

        {/* Etiqueta del eje Y (máximo) */}
        <text x={PAD_L - 6} y={PAD_T + 4} textAnchor="end" fontSize="10" fontFamily="IBM Plex Mono, monospace" fill={C.dim}>
          ${fmtMiles(maxY)}
        </text>
        <text x={PAD_L - 6} y={PAD_T + PLOT_H} textAnchor="end" fontSize="10" fontFamily="IBM Plex Mono, monospace" fill={C.dim}>
          $0
        </text>
      </svg>

      {tooFar && (
        <div style={S.note}>
          Con estos números la amortización supera los 15 años — fuera de
          lo que tiene sentido graficar. Revisá el precio o el uso mensual.
        </div>
      )}
      {!hasPrice && (
        <div style={S.note}>
          Ingresá el precio del auto arriba para ver dónde se cruza con tu
          ahorro acumulado.
        </div>
      )}
    </div>
  );
}

const S = {
  card: {
    background: C.surface,
    border: `1px solid ${C.line}`,
    borderRadius: '8px',
    padding: '20px',
  },
  title: {
    fontSize: '12px',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '14px',
    textAlign: 'center',
  },
  svg: { width: '100%', height: 'auto', display: 'block' },
  empty: {
    fontSize: '13px',
    color: C.dim,
    lineHeight: 1.6,
    textAlign: 'center',
    padding: '20px 10px',
  },
  note: {
    fontSize: '11px',
    color: C.dim,
    lineHeight: 1.6,
    marginTop: '12px',
    textAlign: 'center',
  },
};
