// ============================================================
// autoelectrico.uy — /blog/tesla-impacto-mercado-uruguay
//
// Segundo artículo long-tail. Ángulo distinto al de precios/IMESI:
// qué mueve la llegada de Tesla en la estructura del mercado —
// modelo de venta directa, tensión con ACAU, el boom de EVs que
// ya venía antes de que Tesla llegara.
//
// Copyright: todo parafraseado. Un solo quote textual corto
// (Musk, 4 palabras) con atribución clara.
// ============================================================

import type { Metadata } from 'next';
import Nav from '@/components/Nav';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autoelectrico.uy';

export const metadata: Metadata = {
  title: 'El impacto real de Tesla en el mercado eléctrico uruguayo',
  description:
    '200 señas en 24 horas, un modelo de venta que rompe cien años de importadores, y una ACAU que no está del todo contenta. Qué mueve Tesla en el mercado uruguayo, más allá del precio.',
  alternates: { canonical: `${SITE}/blog/tesla-impacto-mercado-uruguay` },
  openGraph: {
    title: 'El impacto real de Tesla en el mercado eléctrico uruguayo',
    description:
      'Uruguay ya tenía el boom de eléctricos antes de Tesla. Qué cambia ahora con la venta directa, y por qué no todos los actores del mercado están contentos.',
    url: `${SITE}/blog/tesla-impacto-mercado-uruguay`,
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
  headline: 'El impacto real de Tesla en el mercado eléctrico uruguayo',
  description:
    'Qué mueve la llegada de Tesla en la estructura del mercado automotor uruguayo: venta directa, tensión con ACAU, y el boom de eléctricos que ya venía antes.',
  datePublished: '2026-07-22',
  dateModified: '2026-07-22',
  author: { '@type': 'Organization', name: 'autoelectrico.uy' },
  publisher: { '@type': 'Organization', name: 'autoelectrico.uy' },
  mainEntityOfPage: `${SITE}/blog/tesla-impacto-mercado-uruguay`,
};

export default function TeslaImpactoArticle() {
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
            <div style={S.eyebrow}>Análisis · Mercado</div>
            <h1 style={S.h1}>
              El impacto real de Tesla en el mercado eléctrico uruguayo
            </h1>
            <p style={S.dek}>
              200 personas dejaron seña en las primeras 24 horas. Pero el
              dato más grande no es la demanda — es que Tesla rompe un
              esquema de venta que el resto de las marcas usa hace cien
              años. Y no todos los actores del mercado están contentos.
            </p>
            <div style={S.meta}>22 de julio de 2026 · 7 min de lectura</div>
          </header>

          {/* La demanda */}
          <section style={S.section}>
            <h2 style={S.h2}>La demanda no esperó</h2>
            <p style={S.p}>
              Apenas se abrió el configurador, más de 200 personas ya
              habían dejado una seña formal en menos de 24 horas —no
              consultas, no interés declarado: plata puesta. La cifra
              todavía no dice cuántas de esas reservas van a convertirse en
              entregas reales, pero marca algo que el mercado venía
              intuyendo hace rato: había demanda contenida esperando a que
              Tesla operara acá de forma oficial.
            </p>
          </section>

          {/* El contexto: el boom ya existía */}
          <section style={S.section}>
            <h2 style={S.h2}>Tesla no llegó a un mercado vacío</h2>
            <p style={S.p}>
              Esto es lo que más se pierde en la euforia: el boom de
              eléctricos en Uruguay no lo inventó Tesla. Según datos de
              ACAU citados por Infobae, los eléctricos ya representaban
              cerca del <strong>20% del mercado automotor en 2025</strong>,
              y para abril de 2026 esa participación había trepado al{' '}
              <strong>29%</strong>. La flota total de eléctricos ronda hoy
              las 30.000 unidades, concentrada sobre todo en Montevideo,
              Canelones y Maldonado.
            </p>
            <p style={S.p}>
              Uruguay además genera cerca del 98% de su electricidad con
              fuentes renovables — eólica y solar principalmente —, algo
              que pesa en la decisión de cualquier marca que apueste a la
              movilidad eléctrica como negocio de largo plazo, no solo
              como producto.
            </p>
          </section>

          {/* La estructura que rompe */}
          <section style={{ ...S.section, ...S.highlightSection }}>
            <div style={S.eyebrowSmall}>El cambio de fondo</div>
            <h2 style={S.h2}>Cien años de importadores, roto en una semana</h2>
            <p style={S.p}>
              Todas las marcas que hoy se venden en Uruguay —BYD a través
              de Ayax, Geely a través de Fiancar, y así con cada una—
              operan mediante importadores locales que actúan de
              intermediarios entre la fábrica y quien compra. Tesla vino a
              cambiar exactamente eso: entra como filial propia, vende
              100% online desde su configurador, sin concesionario de por
              medio. Según una editorial de Autoblog Uruguay, hace un
              siglo que ninguna marca de autos se instalaba en el país de
              esta forma.
            </p>
            <p style={S.p}>
              El country manager de Tesla para la región confirmó que el
              desembarco no se limita a vender autos: la marca trae además
              taller de servicio propio, centro de entrega, centro de
              repuestos, y acceso a su red global de más de 80.000
              supercargadores. Es el mismo paquete que Tesla instala en
              cada mercado nuevo donde entra de forma directa.
            </p>
          </section>

          {/* La tensión con ACAU */}
          <section style={S.section}>
            <h2 style={S.h2}>No todos están contentos</h2>
            <p style={S.p}>
              Una semana antes del anuncio de Tesla, el gobierno había
              resuelto empezar a cobrar IMESI a los autos eléctricos de
              mayor valor desde 2027 (le dedicamos{' '}
              <a href="/blog/tesla-uruguay" style={S.link}>
                un artículo aparte
              </a>{' '}
              a ese tema). La Asociación del Comercio Automotor del
              Uruguay (ACAU), que nuclea a las automotoras tradicionales
              del país, rechazó esa decisión.
            </p>
            <p style={S.p}>
              Elon Musk había adelantado la llegada con un posteo tan
              directo como cabía esperar: <em>“Tesla, ahora en
              Uruguay”</em>. La ministra de Industria, Energía y Minería,
              Fernanda Cardona, lo tomó como una validación de la política
              de movilidad eléctrica que el país viene sosteniendo desde
              hace años.
            </p>
            <p style={S.p}>
              Dos lecturas conviven al mismo tiempo: el gobierno celebra
              el desembarco como un espaldarazo a su estrategia, mientras
              el sector que representa a los importadores tradicionales
              cuestiona un impuesto nuevo que —según el propio esquema
              que publicamos— probablemente golpee primero a los eléctricos
              de gama alta, justo el segmento donde Tesla entra a competir.
            </p>
          </section>

          {/* Por qué Uruguay primero */}
          <section style={S.section}>
            <h2 style={S.h2}>¿Por qué Uruguay antes que Argentina?</h2>
            <p style={S.p}>
              El mercado automotor uruguayo es chico —un 12% menor que el
              argentino en unidades vendidas—, una escala que normalmente
              no justificaría que una multinacional abra filial propia
              solo para este país. La lectura de Infobae es que Uruguay
              funciona como puerta de entrada estratégica a Argentina: si
              el esquema de venta 100% digital, sin concesionarios,
              funciona acá, Tesla tiene un caso de prueba de bajo riesgo
              antes de escalarlo a un mercado mucho más grande.
            </p>
            <p style={S.p}>
              La estructura impositiva uruguaya ayuda a esa apuesta.
              Según cifras citadas por Infobae, un auto a combustión de
              baja cilindrada puede llegar a pagar hasta 46% entre
              impuestos internos y de importación combinados —bastante
              más que el 35% que se paga en Argentina o Brasil—, mientras
              que los eléctricos pagan solo la mitad de la patente. Esa
              diferencia es la que, hasta ahora, hizo que un eléctrico
              importado resultara más competitivo que uno a combustión
              equivalente.
            </p>
          </section>

          {/* Qué significa para el resto del mercado */}
          <section style={S.section}>
            <h2 style={S.h2}>¿Qué pasa con el resto de las marcas?</h2>
            <p style={S.p}>
              Es pronto para decir si esto presiona los precios de BYD,
              Geely o MG a la baja. Cuando entra un jugador grande a un
              mercado, la competencia suele empujar a los que ya estaban
              a mover precio, sumar tecnología o mejorar el servicio para
              no perder participación. Pero eso todavía no pasó, y
              cualquiera que te diga con certeza cómo va a reaccionar cada
              marca en los próximos meses está especulando tanto como
              nosotros.
            </p>
            <p style={S.p}>
              Lo que sí podés hacer ya: seguir esos precios en tiempo real
              en nuestro <a href="/comparar" style={S.link}>comparador</a>,
              donde vas a ver a Tesla al lado de cada alternativa que ya
              está en el mercado, sin filtro ni relato de por medio.
            </p>
            <div style={S.ctaRow}>
              <a href="/comparar" style={S.ctaBtn}>
                Ver Tesla vs. el resto del catálogo
              </a>
              <a href="/modelos" style={S.ctaBtnGhost}>
                Explorar todo el catálogo
              </a>
            </div>
          </section>

          <footer style={S.sources}>
            <div style={S.sourcesTitle}>Fuentes</div>
            <ul style={S.sourcesList}>
              <li>Ámbito — impacto de la llegada de Tesla en el mercado eléctrico</li>
              <li>Autoblog Uruguay — editorial sobre el cambio de modelo de venta</li>
              <li>La República — reacción de ACAU al decreto de IMESI</li>
              <li>El Observador — entrevista al country manager de Tesla para la región</li>
              <li>Infobae — cifras de mercado (ACAU) y comparación fiscal con Argentina</li>
              <li>Cadena del Mar / Montevideo Portal — datos de reservas en las primeras 24 horas</li>
              <li>Reporte Asia — matriz energética y contexto regional</li>
            </ul>
            <p style={S.disclaimer}>
              Los números de mercado citados corresponden a fuentes
              públicas de julio de 2026 y pueden actualizarse a medida que
              avance el proceso de entregas.
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
  p: {
    fontSize: 15,
    lineHeight: 1.7,
    color: C.text,
    margin: '0 0 14px',
  },
  link: { color: C.real, textDecoration: 'none' },
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
  sources: { paddingTop: 24, borderTop: `1px solid ${C.line}` },
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
