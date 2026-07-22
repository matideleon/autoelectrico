// ============================================================
// autoelectrico.uy — /blog/tesla-uruguay
//
// Primer artículo long-tail del plan de contenido (semana 11).
// Página estática: no depende de la DB en build time, así que
// no hace falta 'force-dynamic'.
//
// Copyright: todo parafraseado, sin citas textuales de más de
// 15 palabras, una fuente no se cita dos veces con comillas.
// ============================================================

import type { Metadata } from 'next';
import Nav from '@/components/Nav';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autoelectrico.uy';

export const metadata: Metadata = {
  title: 'Tesla en Uruguay: precios, autonomía y el IMESI que se viene en 2027',
  description:
    'Tesla ya vende Model 3 y Model Y en Uruguay. Precios reales, autonomía, y qué cambia con el nuevo IMESI a los eléctricos desde enero de 2027 — y a cuáles modelos afecta.',
  alternates: { canonical: `${SITE}/blog/tesla-uruguay` },
  openGraph: {
    title: 'Tesla en Uruguay: precios, autonomía y el IMESI que se viene',
    description:
      'Model 3 y Model Y ya se configuran en tesla.com/uy. Qué cuestan, cuánto rinden, y por qué comprar antes de 2027 puede ahorrarte hasta 9% de impuesto.',
    url: `${SITE}/blog/tesla-uruguay`,
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
  lab: '#B8734E',
};

const mono = "'IBM Plex Mono', ui-monospace, Menlo, monospace";
const sans = "'IBM Plex Sans', -apple-system, sans-serif";

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Tesla en Uruguay: precios, autonomía y el IMESI que se viene en 2027',
  description:
    'Tesla ya vende Model 3 y Model Y en Uruguay. Precios, autonomía y el impacto del nuevo IMESI a los eléctricos desde 2027.',
  datePublished: '2026-07-22',
  dateModified: '2026-07-22',
  author: { '@type': 'Organization', name: 'autoelectrico.uy' },
  publisher: { '@type': 'Organization', name: 'autoelectrico.uy' },
  mainEntityOfPage: `${SITE}/blog/tesla-uruguay`,
};

export default function TeslaUruguayArticle() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <article style={S.root}>
        <div style={S.wrap}>
          {/* Header */}
          <header style={S.header}>
            <div style={S.eyebrow}>Noticias · Uruguay</div>
            <h1 style={S.h1}>
              Tesla ya vende en Uruguay: precios, autonomía y el IMESI que se
              viene en 2027
            </h1>
            <p style={S.dek}>
              Model 3 y Model Y se configuran online desde ya, sin
              concesionarios. Te contamos qué cuesta cada versión, cuánto
              rinde de verdad según la ficha, y por qué la fecha en que
              compres puede cambiarte el precio final más que cualquier
              descuento.
            </p>
            <div style={S.meta}>22 de julio de 2026 · 8 min de lectura</div>
          </header>

          {/* Intro */}
          <section style={S.section}>
            <p style={S.p}>
              Tesla confirmó su llegada oficial a Uruguay a principios de
              julio, con un lanzamiento que contó con la presencia del
              presidente Yamandú Orsi. El país se convierte así en el
              tercero de Sudamérica —después de Chile y Colombia— donde la
              marca vende de forma directa, sin concesionarios ni
              intermediarios: todo el proceso de compra es online, desde el
              configurador hasta la seña inicial.
            </p>
            <p style={S.p}>
              Arranca con dos modelos: el <strong>Model 3</strong> (sedán) y
              el <strong>Model Y</strong> (SUV). Cada uno en varias
              versiones, con precios y autonomías bien distintas entre sí.
            </p>
          </section>

          {/* Tabla Model 3 */}
          <section style={S.section}>
            <h2 style={S.h2}>Model 3 — tres versiones</h2>
            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Versión</th>
                    <th style={S.th}>Precio</th>
                    <th style={S.th}>Autonomía WLTP</th>
                    <th style={S.th}>0-100 km/h</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={S.td}>Rear-Wheel Drive</td>
                    <td style={{ ...S.td, ...S.tdMono }}>USD 32.990</td>
                    <td style={{ ...S.td, ...S.tdMono }}>534 km</td>
                    <td style={{ ...S.td, ...S.tdMono }}>6,2 s</td>
                  </tr>
                  <tr>
                    <td style={S.td}>Long Range Rear-Wheel Drive</td>
                    <td style={{ ...S.td, ...S.tdMono }}>USD 37.990</td>
                    <td style={{ ...S.td, ...S.tdMono }}>750 km</td>
                    <td style={{ ...S.td, ...S.tdMono }}>—</td>
                  </tr>
                  <tr>
                    <td style={S.td}>Performance All-Wheel Drive</td>
                    <td style={{ ...S.td, ...S.tdMono }}>USD 49.990</td>
                    <td style={{ ...S.td, ...S.tdMono }}>571 km</td>
                    <td style={{ ...S.td, ...S.tdMono }}>—</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={S.caption}>
              Precios y autonomía WLTP publicados en tesla.com/uy, julio
              2026. Fuente citable en la{' '}
              <a href="/modelos/tesla-model-3-rear-wheel-drive-2026" style={S.link}>
                ficha del Model 3
              </a>{' '}
              de este sitio.
            </p>
          </section>

          {/* Tabla Model Y */}
          <section style={S.section}>
            <h2 style={S.h2}>Model Y — dos versiones</h2>
            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Versión</th>
                    <th style={S.th}>Precio</th>
                    <th style={S.th}>Autonomía WLTP</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={S.td}>Rear-Wheel Drive</td>
                    <td style={{ ...S.td, ...S.tdMono }}>USD 36.490</td>
                    <td style={{ ...S.td, ...S.tdMono }}>446 km</td>
                  </tr>
                  <tr>
                    <td style={S.td}>Long Range Rear-Wheel Drive</td>
                    <td style={{ ...S.td, ...S.tdMono }}>USD 41.490</td>
                    <td style={{ ...S.td, ...S.tdMono }}>609 km</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={S.caption}>
              Algunas coberturas locales mencionan una tercera versión
              (Long Range All-Wheel Drive) homologada ante URSEA pero sin
              precio público todavía. Vale confirmar directo en
              tesla.com/uy antes de decidir.
            </p>
          </section>

          {/* Comparación internacional */}
          <section style={S.section}>
            <h2 style={S.h2}>¿Cómo se compara con otros países?</h2>
            <p style={S.p}>
              El dato que más repitió la prensa esta semana: el Model 3 de
              entrada sale más barato en Uruguay que en Estados Unidos,
              donde en mayo rondaba los USD 38.630. Uruguay queda por
              debajo de la mayoría de los mercados donde Tesla vende de
              forma oficial — algo poco habitual para un país tan chico.
            </p>
          </section>

          {/* Llegada */}
          <section style={S.section}>
            <h2 style={S.h2}>¿Cuándo llegan?</h2>
            <p style={S.p}>
              Acá conviene ser cautos. Parte de la prensa uruguaya estima
              las primeras entregas para octubre o noviembre de 2026, pero
              Tesla todavía no confirmó oficialmente una fecha de inicio de
              entregas ni plazos por versión. Si ya reservaste, el canal
              más confiable para el estado real de tu pedido es el propio
              configurador de Tesla, no la prensa.
            </p>
          </section>

          {/* IMESI — la sección que más importa */}
          <section style={{ ...S.section, ...S.highlightSection }}>
            <div style={S.eyebrowSmall}>Lo que más preguntan</div>
            <h2 style={S.h2}>El IMESI que cambia todo desde 2027</h2>
            <p style={S.p}>
              Este es el dato que puede valer más que cualquier descuento.
              El Poder Ejecutivo firmó un decreto que empieza a cobrar
              Impuesto Específico Interno (IMESI) a los autos eléctricos
              según su <strong>valor de importación</strong> (el precio en
              aduana, no el precio de venta al público, que suele ser
              mayor). Así queda el esquema desde el{' '}
              <strong>1° de enero de 2027</strong>:
            </p>

            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Valor de importación</th>
                    <th style={S.th}>IMESI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={S.td}>Hasta USD 19.000</td>
                    <td style={{ ...S.td, ...S.tdMono, color: C.real }}>0% — exento</td>
                  </tr>
                  <tr>
                    <td style={S.td}>USD 19.001 a 27.000</td>
                    <td style={{ ...S.td, ...S.tdMono, color: C.lab }}>5%</td>
                  </tr>
                  <tr>
                    <td style={S.td}>Más de USD 27.000</td>
                    <td style={{ ...S.td, ...S.tdMono, color: C.lab }}>9%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p style={S.p}>
              Según cobertura de prensa local, <strong>los Tesla en sus
              versiones Model 3 y Model Y quedarían en el tramo más alto,
              del 9%</strong> — junto con eléctricos de alta gama de
              Mercedes-Benz, BMW y Audi, y modelos como el BYD Seal. En el
              otro extremo, el gobierno sostuvo que cerca del{' '}
              <strong>75% de los eléctricos que hoy se venden en Uruguay
              seguirían totalmente exentos</strong>, porque su valor de
              importación no supera los USD 19.000 — ahí entran la mayoría
              de los modelos de entrada que ya tenemos cargados en el{' '}
              <a href="/modelos" style={S.link}>catálogo</a>, como el BYD
              Dolphin base.
            </p>

            <p style={S.p}>
              Ejemplos concretos que mencionó la prensa en el tramo medio
              (5%): la versión más potente del BYD Dolphin Plus, el BYD
              Yuan Plus y el Geely Geometry C, todos alrededor de los USD
              39.000 de venta al público.
            </p>

            <div style={S.calloutBox}>
              <div style={S.calloutTitle}>El dato accionable</div>
              <p style={{ ...S.p, margin: 0 }}>
                El IMESI nuevo recién rige desde el 1° de enero de 2027. Todo
                lo que se importe o registre antes de esa fecha entra bajo
                la exoneración total que existe hoy, sin importar el valor
                del auto. Si estás por comprar un Tesla —o cualquier
                eléctrico de gama alta— hacerlo antes de fin de 2026 puede
                significar la diferencia entre pagar 0% o 9% de un impuesto
                sobre el valor de importación.
              </p>
            </div>

            <p style={{ ...S.p, ...S.small }}>
              Ojo con un matiz importante: el tramo se calcula sobre el{' '}
              <strong>valor de importación</strong>, no sobre el precio que
              ves publicado al público. Son números distintos, y la
              diferencia puede mover un auto de un tramo a otro. Confirmá
              el valor real con el importador antes de sacar cuentas
              propias.
            </p>
          </section>

          {/* A quién le conviene */}
          <section style={S.section}>
            <h2 style={S.h2}>¿Tesla te conviene a vos?</h2>
            <p style={S.p}>
              Ningún Tesla hoy en Uruguay baja de los USD 32.990. Si tu
              presupuesto es menor, o tu uso es mayormente urbano y no
              necesitás 500+ km de autonomía, el catálogo tiene opciones
              bastante más accesibles —BYD Dolphin, Geely EX5— que además
              quedan exentas de IMESI incluso después de 2027.
            </p>
            <p style={S.p}>
              Si tu uso es de ruta larga y frecuente, la autonomía del
              Model 3 Long Range (750 km declarados) o del Model Y Long
              Range (609 km) sí hace una diferencia real frente a la
              mayoría del resto del mercado.
            </p>
            <div style={S.ctaRow}>
              <a href="/comparar" style={S.ctaBtn}>
                Compará Tesla contra otros modelos
              </a>
              <a href="/ahorro" style={S.ctaBtnGhost}>
                Calculá tu ahorro real
              </a>
            </div>
          </section>

          {/* Fuentes */}
          <footer style={S.sources}>
            <div style={S.sourcesTitle}>Fuentes</div>
            <ul style={S.sourcesList}>
              <li>LARED21 — cobertura de precios y versiones de Tesla en Uruguay, jul. 2026</li>
              <li>AIRBAG / Montevideo Portal — comparación internacional de precios y patente</li>
              <li>El Observador — anuncio oficial y esquema de IMESI 2027</li>
              <li>Autoblog Uruguay — texto del decreto de IMESI a eléctricos</li>
              <li>Infobae — cobertura del lanzamiento oficial</li>
              <li>tesla.com/uy — precios y especificaciones directas del fabricante</li>
            </ul>
            <p style={S.disclaimer}>
              Los precios y plazos de entrega pueden cambiar. Confirmá
              siempre en tesla.com/uy antes de decidir una compra.
            </p>
          </footer>
        </div>
      </article>
    </>
  );
}

const S: Record<string, React.CSSProperties> = {
  root: {
    background: C.bg,
    minHeight: '100vh',
    color: C.text,
    fontFamily: sans,
    padding: '20px 20px 80px',
  },
  wrap: { maxWidth: 720, margin: '0 auto' },
  header: { marginBottom: 36, paddingTop: 20 },
  eyebrow: {
    fontFamily: mono,
    fontSize: 11,
    color: C.dim,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    marginBottom: 14,
  },
  eyebrowSmall: {
    fontFamily: mono,
    fontSize: 10,
    color: C.lab,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: 10,
  },
  h1: {
    fontSize: 'clamp(28px, 6vw, 40px)',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    lineHeight: 1.15,
    margin: '0 0 16px',
  },
  dek: {
    fontSize: 16,
    color: C.dim,
    lineHeight: 1.6,
    margin: '0 0 14px',
    maxWidth: '62ch',
  },
  meta: {
    fontFamily: mono,
    fontSize: 11,
    color: C.faint,
  },
  section: {
    marginBottom: 36,
    paddingTop: 28,
    borderTop: `1px solid ${C.line}`,
  },
  highlightSection: {
    background: C.surface,
    border: `1px solid ${C.line}`,
    borderRadius: 6,
    padding: '24px 24px 20px',
    borderTop: `1px solid ${C.line}`,
  },
  h2: {
    fontSize: 21,
    fontWeight: 600,
    letterSpacing: '-0.01em',
    margin: '0 0 16px',
  },
  p: {
    fontSize: 15,
    lineHeight: 1.7,
    color: C.text,
    margin: '0 0 14px',
  },
  small: {
    fontSize: 13,
    color: C.dim,
  },
  tableWrap: { overflowX: 'auto', marginBottom: 10 },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 420 },
  th: {
    textAlign: 'left',
    fontFamily: mono,
    fontSize: 10,
    color: C.dim,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    padding: '8px 10px',
    borderBottom: `1px solid ${C.line}`,
  },
  td: {
    padding: '10px 10px',
    fontSize: 13,
    borderBottom: `1px solid ${C.line}`,
  },
  tdMono: { fontFamily: mono },
  caption: {
    fontFamily: mono,
    fontSize: 11,
    color: C.faint,
    lineHeight: 1.6,
    margin: 0,
  },
  link: { color: C.real, textDecoration: 'none' },
  calloutBox: {
    background: 'rgba(184,115,78,0.1)',
    border: `1px solid ${C.lab}`,
    borderRadius: 4,
    padding: '16px 18px',
    margin: '18px 0',
  },
  calloutTitle: {
    fontFamily: mono,
    fontSize: 11,
    color: C.lab,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 8,
  },
  ctaRow: { display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 },
  ctaBtn: {
    fontFamily: mono,
    fontSize: 13,
    padding: '12px 18px',
    background: C.real,
    color: C.bg,
    borderRadius: 3,
    textDecoration: 'none',
    fontWeight: 500,
  },
  ctaBtnGhost: {
    fontFamily: mono,
    fontSize: 13,
    padding: '12px 18px',
    background: 'transparent',
    color: C.real,
    border: `1px solid ${C.real}`,
    borderRadius: 3,
    textDecoration: 'none',
    fontWeight: 500,
  },
  sources: {
    paddingTop: 24,
    borderTop: `1px solid ${C.line}`,
  },
  sourcesTitle: {
    fontFamily: mono,
    fontSize: 11,
    color: C.dim,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: 10,
  },
  sourcesList: {
    fontFamily: mono,
    fontSize: 11,
    color: C.faint,
    lineHeight: 1.9,
    margin: '0 0 16px',
    paddingLeft: 18,
  },
  disclaimer: {
    fontSize: 12,
    color: C.faint,
    margin: 0,
  },
};
