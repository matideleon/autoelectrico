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
              En Uruguay hay seis operadores con tarifa propia y publicada:
              UTE, DISA, Mobility, DMC, eOne y Evergo. Cada uno cobra
              distinto según franja horaria, tipo de conector, y si tiene o
              no un cargo fijo por conectarte ("bajada de bandera"). El
              operador más barato para tu carga no es siempre el mismo — a
              veces depende de cuántos kWh necesitás.
            </p>
            <p style={S.p}>
              UTE opera más de 400 puntos de carga en los 19 departamentos,
              incluyendo varias estaciones ANCAP del interior — esos
              cargadores en estaciones de servicio también son de UTE, no
              de ANCAP. Además suma un cargo por minuto si el auto queda
              conectado sin cargar más de 20 minutos.
            </p>
          </section>

          <CargaPublicaSimulator />

          <section style={S.section}>
            <h2 style={S.h2}>Cómo cobra cada operador</h2>
            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Operador</th>
                    <th style={S.th}>Modelo</th>
                    <th style={S.th}>Bandas</th>
                    <th style={S.th}>Bajada</th>
                    <th style={S.th}>Rasgo distintivo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={S.td}><strong>UTE</strong></td>
                    <td style={S.td}>Bajada + kWh + penalización por minuto ocioso</td>
                    <td style={S.td}>No</td>
                    <td style={S.td}>Sí</td>
                    <td style={S.td}>Bajada alta en CC ($132,90) y predios privados ($199,40); penaliza el auto conectado sin cargar</td>
                  </tr>
                  <tr>
                    <td style={S.td}><strong>DISA</strong></td>
                    <td style={S.td}>Bajada + kWh con descuento nocturno</td>
                    <td style={S.td}>3</td>
                    <td style={S.td}>Sí ($120)</td>
                    <td style={S.td}>Única red no estatal que baja de $10/kWh en la madrugada</td>
                  </tr>
                  <tr>
                    <td style={S.td}><strong>Mobility</strong></td>
                    <td style={S.td}>Bajada + kWh diferenciado por conector</td>
                    <td style={S.td}>2–3</td>
                    <td style={S.td}>Sí ($130)</td>
                    <td style={S.td}>El conector GB/T cuesta hasta un 111% más que el CCS2</td>
                  </tr>
                  <tr>
                    <td style={S.td}><strong>DMC</strong></td>
                    <td style={S.td}>Solo kWh, banda invertida</td>
                    <td style={S.td}>3</td>
                    <td style={S.td}>No</td>
                    <td style={S.td}>Su hora más cara es la madrugada, no la tarde: desincentiva el estacionamiento nocturno</td>
                  </tr>
                  <tr>
                    <td style={S.td}><strong>eOne</strong></td>
                    <td style={S.td}>Solo kWh, pico vespertino</td>
                    <td style={S.td}>2</td>
                    <td style={S.td}>No</td>
                    <td style={S.td}>Sin bajada de bandera; conviene únicamente en cargas muy pequeñas</td>
                  </tr>
                  <tr>
                    <td style={S.td}><strong>Evergo</strong></td>
                    <td style={S.td}>Bajada + tarifa dinámica según potencia</td>
                    <td style={S.td}>No</td>
                    <td style={S.td}>Sí ($122)</td>
                    <td style={S.td}>El precio se ajusta a los kW que el vehículo realmente acepta</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section style={S.section}>
            <h2 style={S.h2}>Guía rápida de elección</h2>
            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Situación</th>
                    <th style={S.th}>Recomendado</th>
                    <th style={S.th}>Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={S.td}>Carga larga, con tiempo disponible</td>
                    <td style={{ ...S.td, color: C.real, fontWeight: 600 }}>UTE AC</td>
                    <td style={S.td}>El menor costo total del país</td>
                  </tr>
                  <tr>
                    <td style={S.td}>Ruta, se necesita volumen rápido</td>
                    <td style={{ ...S.td, color: C.real, fontWeight: 600 }}>UTE CC</td>
                    <td style={S.td}>Mejor relación $/kWh entre los cargadores rápidos</td>
                  </tr>
                  <tr>
                    <td style={S.td}>Carga nocturna fuera de casa</td>
                    <td style={{ ...S.td, color: C.real, fontWeight: 600 }}>DISA (00–07)</td>
                    <td style={S.td}>$10/kWh, por debajo incluso de UTE CC</td>
                  </tr>
                  <tr>
                    <td style={S.td}>Recarga pequeña, menos de 10 kWh</td>
                    <td style={{ ...S.td, color: C.real, fontWeight: 600 }}>DMC o eOne</td>
                    <td style={S.td}>Sin bajada de bandera</td>
                  </tr>
                  <tr>
                    <td style={S.td}>Entre las 18:00 y las 22:00</td>
                    <td style={{ ...S.td, color: C.real, fontWeight: 600 }}>UTE (cualquiera)</td>
                    <td style={S.td}>Todos los operadores privados aplican tarifa pico</td>
                  </tr>
                  <tr>
                    <td style={S.td}>Vehículo con conector GB/T</td>
                    <td style={{ ...S.td, color: C.lab, fontWeight: 600 }}>Evitar Mobility en hora pico</td>
                    <td style={S.td}>$30/kWh es el techo del mercado</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section style={S.section}>
            <h2 style={S.h2}>El factor que la tabla no muestra: la potencia</h2>
            <p style={S.p}>
              UTE AC gana todas las comparaciones de precio, pero es carga
              lenta. Esos mismos 65 kWh a 7 kW demandan cerca de{' '}
              <strong>9 horas</strong>; en un cargador de 180 kW se resuelven
              en unos <strong>25 minutos</strong>.
            </p>
            <p style={S.p}>
              La diferencia de precio frente a un operador rápido como eOne
              equivale a pagar alrededor de <strong>$54 por cada hora
              ahorrada</strong>. Ese es el verdadero criterio de decisión: no
              cuál es el más barato por kWh, sino cuánto vale tu tiempo en
              esa situación puntual.
            </p>
          </section>

          <section style={S.section}>
            <h2 style={S.h2}>Casa vs. calle: la diferencia real</h2>
            <p style={S.p}>
              Cargar en casa de madrugada (Plan Movilidad UTE, ~$2,80/kWh)
              cuesta aproximadamente una <strong>cuarta parte</strong> que la
              opción pública más barata, y hasta <strong>once veces
              menos</strong> que la más cara del cuadro de arriba. La carga
              pública sirve para viajes largos o cuando no tenés dónde
              cargar en casa, no como reemplazo de la carga domiciliaria de
              todos los días.
            </p>
          </section>

          <div style={S.ctaRow}>
            <a href="/carga/hogar" style={S.ctaBtn}>Ver la guía de carga en casa</a>
            <a href="/comparar" style={S.ctaBtnGhost}>Comparar velocidad de carga entre modelos</a>
          </div>

          <footer style={S.sources}>
            <div style={S.sourcesTitle}>Fuentes</div>
            <ul style={S.sourcesList}>
              <li>Tarifas de los 6 operadores (UTE, DISA, Mobility, DMC, eOne, Evergo): recopiladas por el equipo de autoelectrico.uy a partir de lo publicado por cada uno, jul 2026</li>
              <li>portal.ute.com.uy — Movilidad Eléctrica, estructura de precios y cargo por tiempo ocioso</li>
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
  tableWrap: { overflowX: 'auto', marginBottom: 10 },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 560 },
  th: { textAlign: 'left', fontFamily: mono, fontSize: 10, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '8px 10px', borderBottom: `1px solid ${C.line}` },
  td: { padding: '10px 10px', fontSize: 12.5, borderBottom: `1px solid ${C.line}`, lineHeight: 1.5 },
  ctaRow: { display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 32 },
  ctaBtn: { fontFamily: mono, fontSize: 13, padding: '12px 18px', background: C.real, color: C.bg, borderRadius: 3, textDecoration: 'none', fontWeight: 500 },
  ctaBtnGhost: { fontFamily: mono, fontSize: 13, padding: '12px 18px', background: 'transparent', color: C.real, border: `1px solid ${C.real}`, borderRadius: 3, textDecoration: 'none', fontWeight: 500 },
  sources: { marginTop: 36, paddingTop: 24, borderTop: `1px solid ${C.line}` },
  sourcesTitle: { fontFamily: mono, fontSize: 11, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 },
  sourcesList: { fontFamily: mono, fontSize: 11, color: C.faint, lineHeight: 1.9, margin: '0 0 16px', paddingLeft: 18 },
  disclaimer: { fontSize: 12, color: C.faint, margin: 0 },
};
