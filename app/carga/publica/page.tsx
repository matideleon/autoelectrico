// ============================================================
// autoelectrico.uy — /carga/publica
//
// Guía de carga pública en Uruguay + simulador de costo por
// operador (hoy, solo UTE tiene tarifa pública verificable).
// ============================================================

import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import CargaPublicaSimulator from '@/components/CargaPublicaSimulator';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autoelectrico.uy';

export const metadata: Metadata = {
  title: 'Carga pública: tarifas de UTE y simulador de costo',
  description:
    'Cómo funciona la red pública de carga en Uruguay, la estructura real de precios de UTE, y un simulador para calcular cuánto cuesta cargar tu auto.',
  alternates: { canonical: `${SITE}/carga/publica` },
  openGraph: {
    title: 'Carga pública: tarifas de UTE y simulador de costo',
    description:
      'La estructura real de precios de la red pública de UTE, y un simulador para calcular el costo de tu carga.',
    url: `${SITE}/carga/publica`,
    type: 'article',
    locale: 'es_UY',
  },
};

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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Carga pública: tarifas de UTE y simulador de costo',
  description:
    'Guía de carga pública para autos eléctricos en Uruguay: red de UTE, estructura de precios y simulador de costo.',
  datePublished: '2026-07-23',
  dateModified: '2026-07-23',
  author: { '@type': 'Organization', name: 'autoelectrico.uy' },
  publisher: { '@type': 'Organization', name: 'autoelectrico.uy' },
  mainEntityOfPage: `${SITE}/carga/publica`,
};

export default function CargaPublicaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main style={S.root}>
        <div style={S.wrap}>
          <header style={S.header}>
            <div style={S.eyebrow}>Guía · Carga pública</div>
            <h1 style={S.h1}>Carga pública</h1>
            <p style={S.dek}>
              Para viajes largos o cuando no tenés dónde cargar en casa. Acá
              te explicamos cómo funciona la red y cuánto te va a costar.
            </p>
            <a href="/carga/hogar" style={S.siblingLink}>¿Buscabas la carga en casa? →</a>
          </header>

          <section style={S.section}>
            <h2 style={S.h2}>Carga pública</h2>
            <p style={S.p}>
              UTE opera más de 400 puntos de carga en los 19 departamentos,
              incluyendo varias estaciones ANCAP del interior — esos
              cargadores en estaciones de servicio también son de UTE, no
              de ANCAP. Buscamos específicamente si había otros operadores
              (Zunder, Enel X, Powerdot, Electromaps) y ninguno opera en
              Uruguay — son redes europeas, o apps que listan puntos sin
              tarifa propia acá. Por eso este simulador es de un solo
              operador, no un comparador.
            </p>
            <p style={S.p}>
              La estructura de precio tiene tres partes: un cargo fijo por
              conectarte (distinto en carga lenta y rápida), el precio por
              cada kWh que cargás, y un cargo extra si dejás el auto
              conectado más de 20 minutos sin que esté cargando.
            </p>
          </section>

          <CargaPublicaSimulator />

          <section style={S.section}>
            <h2 style={S.h2}>Casa vs. calle: la diferencia real</h2>
            <p style={S.p}>
              Según los propios números de UTE, recorrer 100 km cargando en
              tu casa con tarifa nocturna cuesta unos $37. Hacer esos mismos
              100 km en la red pública cuesta unos $195 — hasta 5 veces más.
              La carga pública sirve para viajes largos o cuando no tenés
              dónde cargar en casa, no como reemplazo de la carga
              domiciliaria de todos los días.
            </p>
          </section>

          <div style={S.ctaRow}>
            <a href="/carga/hogar" style={S.ctaBtn}>Ver la guía de carga en casa</a>
            <a href="/comparar" style={S.ctaBtnGhost}>Comparar velocidad de carga entre modelos</a>
          </div>

          <footer style={S.sources}>
            <div style={S.sourcesTitle}>Fuentes</div>
            <ul style={S.sourcesList}>
              <li>portal.ute.com.uy — Movilidad Eléctrica, tarifas y estructura de precios</li>
              <li>montevideo.com.uy / elobservador.com.uy — resolución de tarifas UTE, enero 2026</li>
              <li>uruguayelectrico.com — cobertura de la red, puntos de carga</li>
            </ul>
            <p style={S.disclaimer}>
              Esta guía es informativa. UTE ya avisó que va a seguir
              ajustando las tarifas durante 2026 — confirmá siempre el
              precio vigente antes de un viaje largo.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}

const S: Record<string, React.CSSProperties> = {
  root: { background: C.bg, minHeight: '100vh', color: C.text, fontFamily: sans, padding: '20px 20px 80px' },
  wrap: { maxWidth: 760, margin: '0 auto' },
  header: { marginBottom: 24, paddingTop: 20 },
  eyebrow: { fontFamily: mono, fontSize: 11, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 },
  h1: { fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 0 16px' },
  dek: { fontSize: 16, color: C.dim, lineHeight: 1.6, margin: '0 0 14px', maxWidth: '62ch' },
  siblingLink: { fontFamily: mono, fontSize: 12.5, color: C.real, textDecoration: 'none' },
  section: { marginTop: 32, paddingTop: 28, borderTop: `1px solid ${C.line}` },
  h2: { fontSize: 21, fontWeight: 600, letterSpacing: '-0.01em', margin: '0 0 16px' },
  p: { fontSize: 15, lineHeight: 1.7, color: C.text, margin: '0 0 14px' },
  ctaRow: { display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 32 },
  ctaBtn: { fontFamily: mono, fontSize: 13, padding: '12px 18px', background: C.real, color: C.bg, borderRadius: 3, textDecoration: 'none', fontWeight: 500 },
  ctaBtnGhost: { fontFamily: mono, fontSize: 13, padding: '12px 18px', background: 'transparent', color: C.real, border: `1px solid ${C.real}`, borderRadius: 3, textDecoration: 'none', fontWeight: 500 },
  sources: { marginTop: 36, paddingTop: 24, borderTop: `1px solid ${C.line}` },
  sourcesTitle: { fontFamily: mono, fontSize: 11, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 },
  sourcesList: { fontFamily: mono, fontSize: 11, color: C.faint, lineHeight: 1.9, margin: '0 0 16px', paddingLeft: 18 },
  disclaimer: { fontSize: 12, color: C.faint, margin: 0 },
};
