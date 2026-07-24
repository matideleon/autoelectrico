'use client';

import React from 'react';

/* ============================================================
   HomeSections — lo que va debajo de los artículos en la portada.

   Tres bloques:
   1. Modelos destacados (los más accesibles CON precio verificado)
   2. Las herramientas del sitio
   3. Estado real del catálogo — los números salen de contar la
      base, no están escritos a mano. Si mañana cargamos 20
      modelos más, el número cambia solo.
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
  copper: '#B8734E',
};
const mono = "'IBM Plex Mono', ui-monospace, Menlo, monospace";
const sans = "'IBM Plex Sans', -apple-system, sans-serif";

const fmt = (n) => (n == null ? null : new Intl.NumberFormat('es-UY').format(Number(n)));

const HERRAMIENTAS = [
  {
    href: '/comparar',
    titulo: 'Comparador',
    desc: 'Hasta 4 modelos lado a lado, con radar de perfil y barras por métrica. Cuando falta un dato, lo decimos en vez de disimularlo.',
    cta: 'Comparar modelos',
  },
  {
    href: '/ahorro',
    titulo: 'Simulador de ahorro',
    desc: 'Cuánto ahorrás por mes contra un auto a combustión, con precios reales de nafta y tarifas de UTE. Y en cuánto tiempo se amortiza.',
    cta: 'Calcular mi ahorro',
  },
  {
    href: '/carga',
    titulo: 'Guías de carga',
    desc: 'En casa: qué potencia necesitás, qué exige UTE y los pasos de la instalación. En la calle: los 6 operadores del país comparados por tarifa.',
    cta: 'Ver las guías',
  },
];

function ModeloCard({ m }) {
  const real = m.range_real_km != null ? Number(m.range_real_km) : null;
  const wltp = m.range_wltp_km != null ? Number(m.range_wltp_km) : null;

  return (
    <a href={`/modelos/${m.slug}`} className="home-model-card lg" style={S.modelCard}>
      <div style={S.modelBrand}>{m.brand}</div>
      <div style={S.modelName}>
        {m.model}{m.variant ? ` ${m.variant}` : ''}
      </div>
      <div style={S.modelPrice}>
        <em style={S.currency}>USD </em>{fmt(m.price_usd)}
      </div>
      <div style={S.modelSpecs}>
        {m.battery_kwh != null && <span>{fmt(m.battery_kwh)} kWh</span>}
        {real != null ? (
          <span style={{ color: C.real }}>{fmt(real)} km reales</span>
        ) : wltp != null ? (
          <span style={{ color: C.lab }}>{fmt(wltp)} km WLTP</span>
        ) : null}
      </div>
    </a>
  );
}

export default function HomeSections({ destacados = [], stats = {} }) {
  const total = Number(stats.total ?? 0);

  return (
    <div style={S.root}>
      <style>{CSS}</style>
      <div style={S.wrap}>

        {/* ===== Destacados ===== */}
        {destacados.length > 0 && (
          <section style={S.section}>
            <div style={S.sectionHead}>
              <div>
                <h2 style={S.h2}>Los más accesibles</h2>
                <p style={S.sectionNote}>
                  Con precio verificado y fuente citada. Ordenados de menor a mayor.
                </p>
              </div>
              <a href="/modelos" style={S.sectionLink}>Ver los {total} modelos →</a>
            </div>
            <div style={S.modelsGrid}>
              {destacados.map((m) => <ModeloCard key={m.slug} m={m} />)}
            </div>
          </section>
        )}

        {/* ===== Herramientas ===== */}
        <section style={S.section}>
          <div style={S.sectionHead}>
            <div>
              <h2 style={S.h2}>Herramientas</h2>
              <p style={S.sectionNote}>
                Para decidir con números propios, no con folletos.
              </p>
            </div>
          </div>
          <div style={S.toolsGrid}>
            {HERRAMIENTAS.map((t) => (
              <a key={t.href} href={t.href} className="home-tool-card lg" style={S.toolCard}>
                <div style={S.toolTitle}>{t.titulo}</div>
                <p style={S.toolDesc}>{t.desc}</p>
                <div style={S.toolCta}>{t.cta} →</div>
              </a>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

const S = {
  root: { background: 'transparent', padding: '0 20px 80px', fontFamily: sans, color: C.text },
  wrap: { maxWidth: 860, margin: '0 auto' },
  section: { marginTop: 48 },
  sectionHead: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
    gap: 16, flexWrap: 'wrap', marginBottom: 18,
  },
  h2: { fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', margin: '0 0 6px' },
  sectionNote: { fontSize: 13.5, color: C.dim, lineHeight: 1.6, margin: 0, maxWidth: '56ch' },
  sectionLink: { fontFamily: mono, fontSize: 12.5, color: C.real, textDecoration: 'none', whiteSpace: 'nowrap' },

  modelsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
    gap: 12, alignItems: 'stretch',
  },
  modelCard: {
    display: 'flex', flexDirection: 'column', padding: '16px', background: C.surface,
    border: `1px solid ${C.line}`, borderRadius: 6, textDecoration: 'none',
    color: C.text, transition: 'border-color 150ms ease, transform 150ms ease',
    height: '100%', boxSizing: 'border-box',
  },
  modelBrand: { fontFamily: mono, fontSize: 10, color: C.faint, letterSpacing: '0.06em' },
  modelName: { fontSize: 15, fontWeight: 600, marginTop: 2, marginBottom: 10, lineHeight: 1.3 },
  modelPrice: { fontFamily: mono, fontSize: 18, fontWeight: 500, marginBottom: 8, marginTop: 'auto' },
  currency: { fontSize: 11, color: C.dim, fontStyle: 'normal' },
  modelSpecs: {
    display: 'flex', gap: 10, flexWrap: 'wrap',
    fontFamily: mono, fontSize: 10.5, color: C.dim,
    paddingTop: 8, borderTop: `1px solid ${C.line}`,
  },

  toolsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 14, alignItems: 'stretch',
  },
  toolCard: {
    display: 'flex', flexDirection: 'column', padding: '20px', background: C.surface,
    border: `1px solid ${C.line}`, borderRadius: 6, textDecoration: 'none',
    color: C.text, transition: 'border-color 150ms ease, transform 150ms ease',
    height: '100%', boxSizing: 'border-box',
  },
  toolTitle: { fontSize: 17, fontWeight: 600, marginBottom: 8 },
  toolDesc: { fontSize: 13.5, color: C.dim, lineHeight: 1.6, margin: '0 0 14px' },
  toolCta: { fontFamily: mono, fontSize: 12, color: C.real, marginTop: 'auto' },
};

const CSS = `
.home-model-card:hover, .home-tool-card:hover {
  border-color: ${C.real} !important;
  transform: translateY(-2px);
}
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
`;
