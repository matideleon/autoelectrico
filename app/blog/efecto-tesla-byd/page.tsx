// ============================================================
// autoelectrico.uy — /blog/efecto-tesla-byd
//
// Tercer artículo. Pregunta abierta, no afirmación: ¿la baja de
// precios de BYD esta semana tiene que ver con la llegada de
// Tesla? Se muestra la coincidencia de timing y la comparación
// real de segmento, sin asegurar causalidad que no podemos probar.
//
// Copyright: todo parafraseado. Un quote corto (BYD, bajo 15
// palabras) con atribución clara.
// ============================================================

import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import NewsletterSignup from '@/components/NewsletterSignup';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autoelectrico.uy';

export const metadata: Metadata = {
  title: '¿Efecto Tesla? BYD bajó precio a tres modelos justo esta semana',
  description:
    'Yuan Pro GSX, Yuan Plus y Song Plus EV bajaron de precio la misma semana que Tesla empezó a vender en Uruguay. Coincidencia o respuesta — comparamos los números.',
  alternates: { canonical: `${SITE}/blog/efecto-tesla-byd` },
  openGraph: {
    title: '¿Efecto Tesla? BYD bajó precio a tres modelos justo esta semana',
    description:
      'Dos de las tres bajas dejan a BYD a menos de mil dólares de una versión específica de Tesla. Timing, números y la pregunta que no podemos responder con certeza.',
    url: `${SITE}/blog/efecto-tesla-byd`,
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
  headline: '¿Efecto Tesla? BYD bajó precio a tres modelos justo esta semana',
  description:
    'Comparación de precios y specs entre las bajas recientes de BYD y las versiones de Tesla en el mismo segmento, en el contexto de la llegada de Tesla a Uruguay.',
  datePublished: '2026-07-23',
  dateModified: '2026-07-23',
  author: { '@type': 'Organization', name: 'autoelectrico.uy' },
  publisher: { '@type': 'Organization', name: 'autoelectrico.uy' },
  mainEntityOfPage: `${SITE}/blog/efecto-tesla-byd`,
};

export default function EfectoTeslaArticle() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <article style={S.root}>
        <div style={S.wrap}>
          <header style={S.header}>
            <div style={S.eyebrow}>Análisis · Precios</div>
            <h1 style={S.h1}>
              ¿Efecto Tesla? BYD bajó precio a tres modelos justo esta semana
            </h1>
            <p style={S.dek}>
              Yuan Pro GSX, Yuan Plus y Song Plus EV cuestan hoy entre 1.000 y
              5.000 dólares menos que hace unos días. Pasó la misma semana en
              que Tesla empezó a vender de forma oficial en Uruguay. No
              podemos probar que una cosa causó la otra — pero el timing y los
              números invitan a preguntarlo.
            </p>
            <div style={S.meta}>23 de julio de 2026 · 6 min de lectura</div>
          </header>

          {/* La baja, con números */}
          <section style={S.section}>
            <h2 style={S.h2}>Lo que bajó, con precio anterior y actual</h2>
            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Modelo</th>
                    <th style={S.th}>Antes</th>
                    <th style={S.th}>Ahora</th>
                    <th style={S.th}>Baja</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={S.td}>BYD Yuan Pro GSX</td>
                    <td style={{ ...S.td, ...S.tdMono }}>USD 30.990</td>
                    <td style={{ ...S.td, ...S.tdMono, color: C.real }}>USD 29.990</td>
                    <td style={{ ...S.td, ...S.tdMono }}>−3,2%</td>
                  </tr>
                  <tr>
                    <td style={S.td}>BYD Yuan Plus Luxury</td>
                    <td style={{ ...S.td, ...S.tdMono }}>USD 36.990</td>
                    <td style={{ ...S.td, ...S.tdMono, color: C.real }}>USD 31.990</td>
                    <td style={{ ...S.td, ...S.tdMono }}>−13,5%</td>
                  </tr>
                  <tr>
                    <td style={S.td}>BYD Song Plus EV</td>
                    <td style={{ ...S.td, ...S.tdMono }}>USD 46.990</td>
                    <td style={{ ...S.td, ...S.tdMono, color: C.real }}>USD 41.990</td>
                    <td style={{ ...S.td, ...S.tdMono }}>−10,6%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={S.caption}>
              Precios confirmados directamente por el importador, julio 2026.
            </p>
          </section>

          {/* El contexto: qué pasó esta semana */}
          <section style={S.section}>
            <h2 style={S.h2}>La misma semana que Tesla llegó</h2>
            <p style={S.p}>
              Tesla se presentó oficialmente en Uruguay el viernes 17 de
              julio, con un acto que contó con la presencia del presidente
              Yamandú Orsi. Según Infobae, vendió alrededor de 200 unidades en
              el primer día. Apenas unos días después, estas tres bajas de
              BYD quedaron reflejadas en el precio oficial del importador.
            </p>
            <p style={S.p}>
              El Observador ya había planteado la pregunta de fondo en un
              título directo: cómo entra Tesla a competir con los diez autos
              más vendidos de Uruguay. Y ahí aparece un dato que conecta todo:
              según cifras de ACAU, el BYD Yuan Pro es —con 2.022 unidades en
              el último semestre— el auto eléctrico más vendido del país. El
              BYD Seagull viene segundo. Son, literalmente, los modelos que
              más le importan a BYD proteger.
            </p>
          </section>

          {/* La reacción cordial de BYD */}
          <section style={{ ...S.section, ...S.highlightSection }}>
            <div style={S.eyebrowSmall}>Un detalle de tono</div>
            <h2 style={S.h2}>BYD no reaccionó con pánico — le dio la bienvenida</h2>
            <p style={S.p}>
              Antes de cualquier baja de precio, BYD publicó una pieza
              publicitaria saludando la llegada de Tesla al país:{' '}
              <em>"Antes de que la movilidad eléctrica fuera una
              realidad, hubo que construir confianza"</em>. Es un gesto de
              marca segura de su posición, no de una empresa acorralada — lo
              cual hace más interesante la pregunta: ¿la baja de precio fue
              una respuesta directa, o simplemente coincidió con un ajuste que
              ya estaba en agenda?
            </p>
            <p style={S.p}>
              No tenemos forma de confirmar la intención interna de BYD. Lo
              que sí podemos mostrar es dónde quedan los números, unos al
              lado de los otros.
            </p>
          </section>

          {/* Comparación de segmento real */}
          <section style={S.section}>
            <h2 style={S.h2}>Dónde el segmento realmente se cruza</h2>
            <p style={S.p}>
              De las tres bajas, dos dejan a BYD a metros de una versión
              específica de Tesla — no en la misma categoría en términos
              generales, sino a menos de mil dólares de diferencia con un
              modelo puntual.
            </p>

            <h3 style={S.h3}>BYD Yuan Plus Luxury vs. Tesla Model 3 RWD</h3>
            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}></th>
                    <th style={S.th}>BYD Yuan Plus Luxury</th>
                    <th style={S.th}>Tesla Model 3 RWD</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={S.td}>Precio</td>
                    <td style={{ ...S.td, ...S.tdMono, color: C.real }}>USD 31.990</td>
                    <td style={{ ...S.td, ...S.tdMono }}>USD 32.990</td>
                  </tr>
                  <tr>
                    <td style={S.td}>Batería</td>
                    <td style={{ ...S.td, ...S.tdMono }}>60,48 kWh</td>
                    <td style={{ ...S.td, ...S.tdMono }}>63 kWh</td>
                  </tr>
                  <tr>
                    <td style={S.td}>Autonomía WLTP</td>
                    <td style={{ ...S.td, ...S.tdMono }}>420 km</td>
                    <td style={{ ...S.td, ...S.tdMono, color: C.lab }}>534 km</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={S.caption}>
              A prácticamente el mismo precio, el Model 3 declara 114 km más
              de autonomía WLTP. Ojo: ninguno de los dos tiene autonomía real
              medida en Uruguay todavía — el WLTP es el número de fábrica,
              no lo que rinde el auto en la calle.
            </p>

            <h3 style={S.h3}>BYD Song Plus EV vs. Tesla Model Y Long Range RWD</h3>
            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}></th>
                    <th style={S.th}>BYD Song Plus EV</th>
                    <th style={S.th}>Tesla Model Y Long Range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={S.td}>Precio</td>
                    <td style={{ ...S.td, ...S.tdMono, color: C.real }}>USD 41.990</td>
                    <td style={{ ...S.td, ...S.tdMono }}>USD 41.490</td>
                  </tr>
                  <tr>
                    <td style={S.td}>Batería</td>
                    <td style={{ ...S.td, ...S.tdMono }}>71,8 kWh</td>
                    <td style={{ ...S.td, ...S.tdMono }}>85 kWh</td>
                  </tr>
                  <tr>
                    <td style={S.td}>Autonomía WLTP</td>
                    <td style={{ ...S.td, ...S.tdMono }}>404 km</td>
                    <td style={{ ...S.td, ...S.tdMono, color: C.lab }}>609 km</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={S.caption}>
              Acá el Tesla queda apenas 500 dólares por encima, con 205 km más
              de autonomía declarada — y en este caso el Model Y es, además,
              el auto más vendido del planeta, según remarca la propia
              cobertura del lanzamiento.
            </p>
          </section>

          {/* La pregunta abierta */}
          <section style={S.section}>
            <h2 style={S.h2}>Entonces, ¿fue por Tesla?</h2>
            <p style={S.p}>
              Con lo que tenemos, no lo podemos afirmar. El timing es
              llamativo: las tres bajas quedaron confirmadas la misma semana
              del desembarco de Tesla, y golpean justo a los dos modelos más
              vendidos de BYD en el país. Pero los precios en este mercado
              también se mueven por tipo de cambio, stock, y ciclos de
              promoción que no tienen nada que ver con la competencia. Ambas
              explicaciones son compatibles con lo que vemos.
            </p>
            <p style={S.p}>
              Lo que sí es un hecho, no una hipótesis: hoy, por primera vez,
              hay una versión de BYD y una de Tesla separadas por menos de
              mil dólares en dos segmentos distintos. Eso ya cambia la
              decisión de compra de alguien que estaba mirando cualquiera de
              los dos.
            </p>
            <div style={S.ctaRow}>
              <a href="/comparar?ids=byd-yuan-plus-2026,tesla-model-3-rear-wheel-drive-2026" style={S.ctaBtn}>
                Comparar Yuan Plus vs Model 3
              </a>
              <a href="/comparar?ids=byd-song-plus-ev-gs-2026,tesla-model-y-long-range-rear-wheel-drive-2026" style={S.ctaBtnGhost}>
                Comparar Song Plus vs Model Y
              </a>
            </div>
          </section>

          <NewsletterSignup />

          <footer style={S.sources}>
            <div style={S.sourcesTitle}>Fuentes</div>
            <ul style={S.sourcesList}>
              <li>Infobae — desembarco de Tesla y ventas del primer día</li>
              <li>El Observador — "Guerra de precios" y ranking ACAU de los 10 más vendidos</li>
              <li>Precio BYD: confirmado directamente por el importador, jul 2026</li>
              <li>Specs y precios Tesla: tesla.com/uy, jul 2026</li>
            </ul>
            <p style={S.disclaimer}>
              Este artículo plantea una pregunta a partir de una coincidencia
              de timing — no afirma una relación causal que no podemos
              verificar. Los precios pueden cambiar; confirmá siempre con el
              importador antes de decidir una compra.
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
  meta: { fontFamily: mono, fontSize: 11, color: C.faint },
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
  h3: {
    fontSize: 15,
    fontWeight: 600,
    color: C.dim,
    letterSpacing: '-0.005em',
    margin: '24px 0 12px',
  },
  p: {
    fontSize: 15,
    lineHeight: 1.7,
    color: C.text,
    margin: '0 0 14px',
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
    margin: '0 0 8px',
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
    marginTop: 36,
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
  disclaimer: { fontSize: 12, color: C.faint, margin: 0 },
};
