// ============================================================
// autoelectrico.uy — /blog/byd-supera-tesla-bateria-estado-solido
//
// Adaptado del newsletter "Voltaje" (edición Nº 1) que pasó el
// usuario. Se suprimió la sección completa de IMESI Uruguay
// 2027: ya está documentada con las mismas cifras exactas
// (0% hasta USD 19.000, 5% hasta 27.000, 9% más allá) en
// /blog/tesla-uruguay — queda solo una mención corta con link,
// en vez de repetir la tabla y el desarrollo completo.
//
// Fuentes: Electrek, Bloomberg, ElectricCarsReport (BYD vs
// Tesla Q2 2026); Electrek (estándar batería estado sólido China).
// ============================================================

import type { Metadata } from 'next';
import Nav from '@/components/Nav';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autoelectrico.uy';

export const metadata: Metadata = {
  title: 'BYD le saca distancia a Tesla en el mundo, y la batería de estado sólido se acerca',
  description:
    'El segundo trimestre de 2026 confirmó a BYD como líder global de eléctricos, con una brecha de casi 77.000 autos sobre Tesla. Además, China prepara su primer estándar técnico para baterías de estado sólido.',
  alternates: { canonical: `${SITE}/blog/byd-supera-tesla-bateria-estado-solido` },
  openGraph: {
    title: 'BYD le saca distancia a Tesla en el mundo, y la batería de estado sólido se acerca',
    description:
      'BYD vendió 557.090 eléctricos contra 480.126 de Tesla en el Q2 2026. Y la carga en 5 minutos empieza a dejar de ser una promesa de laboratorio.',
    url: `${SITE}/blog/byd-supera-tesla-bateria-estado-solido`,
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
  headline: 'BYD le saca distancia a Tesla en el mundo, y la batería de estado sólido se acerca',
  description:
    'Ventas globales de eléctricos Q2 2026: BYD supera a Tesla por casi 77.000 unidades. Además, avances reales en baterías de estado sólido.',
  datePublished: '2026-07-26',
  dateModified: '2026-07-26',
  author: { '@type': 'Organization', name: 'autoelectrico.uy' },
  publisher: { '@type': 'Organization', name: 'autoelectrico.uy' },
  mainEntityOfPage: `${SITE}/blog/byd-supera-tesla-bateria-estado-solido`,
};

export default function VoltajeArticle() {
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
            <div style={S.eyebrow}>Panorama · El mundo</div>
            <h1 style={S.h1}>
              BYD le saca distancia a Tesla, y la batería de estado sólido
              se acerca a la vidriera
            </h1>
            <p style={S.dek}>
              El segundo trimestre de 2026 confirmó lo que venía
              insinuándose: BYD volvió a superar a Tesla como el mayor
              vendedor mundial de eléctricos, y esta vez con una brecha
              difícil de discutir.
            </p>
            <div style={S.meta}>26 de julio de 2026 · 4 min de lectura</div>
          </header>

          {/* ===== BYD vs Tesla ===== */}
          <section style={S.section}>
            <h2 style={S.h2}>El trono global cambió de manos</h2>
            <p style={S.p}>
              Entre abril y junio, BYD entregó <strong>557.090</strong>{' '}
              unidades 100% eléctricas frente a las <strong>480.126</strong>{' '}
              de Tesla — una diferencia de casi 77.000 autos, alrededor de
              un 16%.
            </p>
            <div style={S.pull}>
              La clave no está en China, sino afuera: las exportaciones de
              BYD crecieron 70,7% hasta 792.256 unidades, mientras sus
              ventas domésticas cayeron casi 40%.
            </div>
            <p style={S.p}>
              El dato de fondo es geográfico. BYD ya superó a Tesla en
              Europa durante varios meses consecutivos —incluidos los dos
              mayores mercados del continente— justo cuando las
              matriculaciones de Tesla siguen cayendo en la región. Para
              todo 2026, los analistas de EV Volumes proyectan un mercado
              global de <strong>22,7 millones</strong> de eléctricos, apenas
              por encima de 2025.
            </p>
            <p style={S.p}>
              El sorpasso no es solo una anécdota de ranking: marca el
              pasaje de una industria que competía por innovación de nicho
              a otra que compite por escala, precio y logística de
              exportación. Para mercados como el uruguayo, que importan
              toda su flota, eso se traduce en más modelos, más
              competencia y, al menos por ahora, precios a la baja.
            </p>

            <div style={S.statsGrid}>
              <div className="lg" style={S.statCard}>
                <div style={S.statNum}>557k</div>
                <div style={S.statLabel}>eléctricos vendidos por BYD en el Q2</div>
              </div>
              <div className="lg" style={S.statCard}>
                <div style={S.statNum}>22,7M</div>
                <div style={S.statLabel}>EV proyectados en el mundo para 2026</div>
              </div>
              <div className="lg" style={S.statCard}>
                <div style={{ ...S.statNum, color: C.lab }}>29%</div>
                <div style={S.statLabel}>de las ventas totales en Uruguay ya son eléctricos</div>
              </div>
            </div>
          </section>

          {/* ===== IMESI Uruguay: recortado, ya publicado ===== */}
          <section style={{ ...S.section, ...S.noteSection }}>
            <p style={S.noteText}>
              Ese 29% de penetración eléctrica en Uruguay tiene una
              consecuencia fiscal que ya cubrimos en detalle: el gobierno
              confirmó que el IMESI empieza a aplicarse a los eléctricos
              desde el 1º de enero de 2027, exonerando a los modelos más
              accesibles. Los números completos, la tabla por franjas y el
              contexto de ventas están en{' '}
              <a href="/blog/tesla-uruguay" style={S.noteLink}>
                el artículo que ya publicamos sobre esto
              </a>.
            </p>
          </section>

          {/* ===== Batería de estado sólido ===== */}
          <section style={S.section}>
            <h2 style={S.h2}>La carga en 5 minutos se acerca a la vidriera</h2>
            <p style={S.p}>
              2026 puede ser recordado como el año en que la{' '}
              <strong>batería de estado sólido</strong> dejó el laboratorio.
              China prepara para julio de 2026 su primer estándar técnico
              para este tipo de celdas, un paso clave para ordenar la
              terminología y habilitar la producción a escala.
            </p>
            <p style={S.p}>
              Los avances ya son concretos: Greater Bay Technology
              presentó celdas con densidades de energía de{' '}
              <strong>260 a 500 Wh/kg</strong> —casi el doble de los packs
              actuales— y carga estable a 2-3C. Donut Lab, por su parte,
              asegura haber logrado una unidad capaz de llegar al 100% en
              cinco minutos. El consenso de la industria ubica la ventana
              de comercialización piloto en 2026-2027, con adopción masiva
              recién hacia 2030.
            </p>
            <p style={S.p}>
              Para quien maneja un eléctrico hoy, la traducción es simple:
              más autonomía, cargas más rápidas y menos degradación con el
              tiempo. Para Uruguay, un horizonte donde el "miedo a
              quedarse sin batería" en un viaje largo empiece a dejar de
              ser un argumento en contra.
            </p>
          </section>

          {/* ===== En breve ===== */}
          <section style={S.section}>
            <h2 style={S.h2}>En breve</h2>
            <div style={S.bitesWrap}>
              <div style={S.bite}>
                <span style={S.biteDot} />
                <div>
                  <div style={S.biteTitle}>Europa se vuelca a las marcas chinas</div>
                  <p style={S.biteText}>
                    BYD encadena meses superando a Tesla en los dos
                    mercados europeos más grandes — un giro impensado hace
                    apenas dos años.
                  </p>
                </div>
              </div>
              <div style={S.bite}>
                <span style={S.biteDot} />
                <div>
                  <div style={S.biteTitle}>Sodio y carga de 1 MW en el radar</div>
                  <p style={S.biteText}>
                    Baterías de ion-sodio y cargadores de altísima potencia
                    asoman como la próxima frontera después del estado
                    sólido.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div style={S.ctaRow}>
            <a href="/modelos" style={S.ctaBtn}>Ver los eléctricos disponibles en Uruguay</a>
            <a href="/comparar" style={S.ctaBtnGhost}>Comparar modelos</a>
          </div>

          <footer style={S.sources}>
            <div style={S.sourcesTitle}>Fuentes</div>
            <ul style={S.sourcesList}>
              <li>Electrek — BYD set to crush Tesla again in Q2 EV sales</li>
              <li>Bloomberg — BYD Set to Overtake Tesla Again on Electric Vehicle Sales</li>
              <li>ElectricCarsReport — BYD Overtakes Tesla Again in Q2 2026</li>
              <li>Electrek — A solid-state EV battery standard will be released in China in 2026</li>
            </ul>
            <p style={S.disclaimer}>
              Las cifras de ventas globales y de tecnología de baterías
              son de fuentes internacionales, no de datos propios de
              autoelectrico.uy. Para el IMESI y el mercado uruguayo
              específicamente, ver la nota citada arriba.
            </p>
          </footer>
        </div>
      </article>
    </>
  );
}

const S: Record<string, React.CSSProperties> = {
  root: { background: C.bg, minHeight: '100vh', color: C.text, fontFamily: sans, padding: '20px 20px 80px' },
  wrap: { maxWidth: 720, margin: '0 auto' },
  header: { marginBottom: 32, paddingTop: 20 },
  eyebrow: { fontFamily: mono, fontSize: 11, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 },
  h1: { fontSize: 'clamp(26px, 5.5vw, 38px)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2, margin: '0 0 16px' },
  dek: { fontSize: 16, color: C.dim, lineHeight: 1.6, margin: '0 0 14px', maxWidth: '60ch' },
  meta: { fontFamily: mono, fontSize: 11, color: C.faint },
  section: { marginTop: 32, paddingTop: 28, borderTop: `1px solid ${C.line}` },
  h2: { fontSize: 21, fontWeight: 600, letterSpacing: '-0.01em', margin: '0 0 16px' },
  p: { fontSize: 15, lineHeight: 1.7, color: C.text, margin: '0 0 14px' },
  pull: {
    borderLeft: `3px solid ${C.real}`, background: 'rgba(61,220,151,0.06)',
    padding: '14px 18px', borderRadius: '0 6px 6px 0', fontSize: 14.5,
    color: C.text, margin: '18px 0', lineHeight: 1.6,
  },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 20 },
  statCard: { padding: '18px 14px', border: `1px solid ${C.line}`, borderRadius: 8, textAlign: 'center' },
  statNum: { fontFamily: mono, fontSize: 24, fontWeight: 600, color: C.real, letterSpacing: '-0.01em' },
  statLabel: { fontSize: 11, color: C.dim, marginTop: 6, lineHeight: 1.4 },
  noteSection: {
    background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8,
    padding: '18px 22px', marginTop: 28, paddingTop: 18, borderTop: `1px solid ${C.line}`,
  },
  noteText: { fontSize: 14, color: C.dim, lineHeight: 1.65, margin: 0 },
  noteLink: { color: C.real, textDecoration: 'underline', textUnderlineOffset: 2 },
  bitesWrap: { display: 'flex', flexDirection: 'column', gap: 0 },
  bite: { display: 'flex', gap: 14, padding: '14px 0', borderTop: `1px solid ${C.line}` },
  biteDot: { flexShrink: 0, width: 8, height: 8, borderRadius: '50%', background: C.real, marginTop: 6 },
  biteTitle: { fontSize: 14.5, fontWeight: 600, marginBottom: 4 },
  biteText: { fontSize: 13.5, color: C.dim, lineHeight: 1.6, margin: 0 },
  ctaRow: { display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 36 },
  ctaBtn: { fontFamily: mono, fontSize: 13, padding: '12px 18px', background: C.real, color: C.bg, borderRadius: 3, textDecoration: 'none', fontWeight: 500 },
  ctaBtnGhost: { fontFamily: mono, fontSize: 13, padding: '12px 18px', background: 'transparent', color: C.real, border: `1px solid ${C.real}`, borderRadius: 3, textDecoration: 'none', fontWeight: 500 },
  sources: { marginTop: 36, paddingTop: 24, borderTop: `1px solid ${C.line}` },
  sourcesTitle: { fontFamily: mono, fontSize: 11, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 },
  sourcesList: { fontFamily: mono, fontSize: 11, color: C.faint, lineHeight: 1.9, margin: '0 0 16px', paddingLeft: 18 },
  disclaimer: { fontSize: 12, color: C.faint, margin: 0 },
};
