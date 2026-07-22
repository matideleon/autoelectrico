'use client';

import React, { useEffect, useState, useRef } from 'react';

/* ============================================================
   HeroInstrument — el elemento de firma del branding.

   No es un medidor circular decorativo genérico. Es un arco con
   DOS segmentos: sólido hasta la autonomía real medida, rayado
   hasta donde llega el número que declara el fabricante. Visualiza
   literalmente la tesis del sitio: "esto promete la fábrica, esto
   rinde de verdad" — con un dato real (BYD Dolphin, verificado en
   la base), nunca un número inventado para el marketing.

   Geometría calculada con trigonometría real (ver nota abajo),
   no aproximada a ojo.
   ============================================================ */

const C = {
  track: '#1F232A',
  real: '#3DDC97',
  lab: '#B8734E',   // cobre: acento de marca, nunca de dato funcional
  text: '#E6E8EB',
  dim: '#8A9099',
  faint: '#565C66',
};

// Ejemplo real, no inventado: BYD Dolphin, verificado en la base.
const EXAMPLE = { brand: 'BYD', model: 'Dolphin', wltp: 340, real: 287, n: 14 };
const MAX_SCALE = 450;
const START_ANGLE = 145;
const END_ANGLE = -145;

function polar(cx, cy, r, angleDeg) {
  const a = (angleDeg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function arcPath(cx, cy, r, startDeg, endDeg) {
  const [x1, y1] = polar(cx, cy, r, startDeg);
  const [x2, y2] = polar(cx, cy, r, endDeg);
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

function angleFor(value) {
  const frac = value / MAX_SCALE;
  return START_ANGLE + frac * (END_ANGLE - START_ANGLE);
}

export default function HeroInstrument() {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Un solo momento orquestado al aparecer, no animación suelta.
          requestAnimationFrame(() => setRevealed(true));
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const cx = 200, cy = 200, r = 160;
  const aReal = angleFor(EXAMPLE.real);
  const aWltp = angleFor(EXAMPLE.wltp);

  const trackPath = arcPath(cx, cy, r, START_ANGLE, END_ANGLE);
  const realPath = arcPath(cx, cy, r, START_ANGLE, aReal);
  const gapPath = arcPath(cx, cy, r, aReal, aWltp);

  // Longitud real del arco REAL, para animar con stroke-dashoffset
  // en vez de un scaleX que deformaría el trazo circular.
  const totalSweep = START_ANGLE - END_ANGLE; // grados
  const circumference = 2 * Math.PI * r;
  const realFrac = (START_ANGLE - aReal) / totalSweep;
  const realLen = circumference * realFrac;

  const [needleX, needleY] = polar(cx, cy, r - 4, aReal);

  return (
    <div ref={ref} style={S.wrap} role="img" aria-label={
      `Instrumento: ${EXAMPLE.brand} ${EXAMPLE.model}, autonomía real de ${EXAMPLE.real} kilómetros medida sobre ${EXAMPLE.n} mediciones, frente a ${EXAMPLE.wltp} kilómetros declarados por el fabricante en laboratorio`
    }>
      <style>{CSS}</style>
      <svg viewBox="0 0 400 340" style={S.svg}>
        {/* Track completo, tenue */}
        <path d={trackPath} fill="none" stroke={C.track} strokeWidth="14" strokeLinecap="round" />

        {/* Segmento GAP: rayado, lo que declara la fábrica de más */}
        <path
          d={gapPath}
          fill="none"
          stroke={C.lab}
          strokeWidth="14"
          strokeLinecap="butt"
          strokeDasharray="3 7"
          opacity={revealed ? 0.85 : 0}
          style={{ transition: 'opacity 900ms ease 600ms' }}
        />

        {/* Segmento REAL: sólido, lo que mide de verdad */}
        <path
          d={realPath}
          fill="none"
          stroke={C.real}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={revealed ? circumference - realLen : circumference}
          style={{ transition: 'stroke-dashoffset 1400ms cubic-bezier(0.16, 1, 0.3, 1) 200ms' }}
        />

        {/* Marca de fin del segmento real */}
        <circle
          cx={needleX}
          cy={needleY}
          r={revealed ? 7 : 0}
          fill={C.real}
          style={{ transition: 'r 400ms ease 1400ms' }}
        />

        {/* Lectura central */}
        <text x="200" y="188" textAnchor="middle" style={S.bigNum} className="instrument-num">
          {EXAMPLE.real}
        </text>
        <text x="200" y="214" textAnchor="middle" style={S.bigUnit}>
          km reales
        </text>
        <text x="200" y="250" textAnchor="middle" style={S.wltpLabel}>
          fábrica declara {EXAMPLE.wltp} km
        </text>
      </svg>

      <div style={S.caption}>
        <span style={{ color: C.real }}>●</span> {EXAMPLE.brand} {EXAMPLE.model}, medido por{' '}
        {EXAMPLE.n} personas en Uruguay
        <span style={S.captionSep}>·</span>
        <span style={{ color: C.lab }}>◆</span> lo que promete el laboratorio
      </div>
    </div>
  );
}

const S = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 360,
    margin: '0 auto',
  },
  svg: {
    width: '100%',
    height: 'auto',
    overflow: 'visible',
  },
  bigNum: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 56,
    fontWeight: 500,
    fill: '#E6E8EB',
    letterSpacing: '-0.02em',
  },
  bigUnit: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 13,
    fill: '#8A9099',
    letterSpacing: '0.04em',
  },
  wltpLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    fill: '#B8734E',
    letterSpacing: '0.02em',
  },
  caption: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    color: '#8A9099',
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 1.7,
  },
  captionSep: {
    margin: '0 8px',
    color: '#565C66',
  },
};

const CSS = `
@media (prefers-reduced-motion: reduce) {
  .instrument-num, path, circle { transition: none !important; }
}
`;
