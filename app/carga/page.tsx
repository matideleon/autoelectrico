// ============================================================
// autoelectrico.uy — /carga
//
// Cómo cargás tu eléctrico: en casa vs. en la calle.
// Esta primera versión desarrolla a fondo la carga domiciliaria.
// La carga pública queda con una sección placeholder a propósito
// (el usuario pidió priorizar hogar primero).
//
// Fuentes principales: jorge-electricidad.net (guía técnica 2026,
// muy detallada y bien fechada), goevchargers.com.uy (wallbox GO,
// requisitos de instalación), electricista.uy (costos, normativa
// UNIT 1234-2020), portal UTE movilidad eléctrica.
// ============================================================

import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import NewsletterSignup from '@/components/NewsletterSignup';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autoelectrico.uy';

export const metadata: Metadata = {
  title: 'Cómo cargar tu auto eléctrico en Uruguay',
  description:
    'Guía completa de carga domiciliaria: qué potencia necesitás, qué exige UTE, qué diferencial instalar y cuánto cuesta un wallbox en Uruguay.',
  alternates: { canonical: `${SITE}/carga` },
  openGraph: {
    title: 'Cómo cargar tu auto eléctrico en Uruguay',
    description:
      'Todo lo que exige UTE para instalar un cargador en casa: potencia, diferencial, puesta a tierra y costos reales.',
    url: `${SITE}/carga`,
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
  copper: '#B8734E',
};

const mono = "'IBM Plex Mono', ui-monospace, Menlo, monospace";
const sans = "'IBM Plex Sans', -apple-system, sans-serif";

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cómo cargar tu auto eléctrico en Uruguay',
  description:
    'Guía de carga domiciliaria para autos eléctricos en Uruguay: potencia, normativa UTE, diferencial y costos.',
  datePublished: '2026-07-23',
  dateModified: '2026-07-23',
  author: { '@type': 'Organization', name: 'autoelectrico.uy' },
  publisher: { '@type': 'Organization', name: 'autoelectrico.uy' },
  mainEntityOfPage: `${SITE}/carga`,
};

export default function CargaPage() {
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
            <div style={S.eyebrow}>Guía · Carga</div>
            <h1 style={S.h1}>Cómo cargás tu eléctrico</h1>
            <p style={S.dek}>
              Hay dos mundos: cargar en casa, todas las noches, sin pensarlo —
              y cargar en la calle, cuando estás de viaje o no tenés garage.
              Empezamos por el de casa, que es donde vas a cargar el 90% del
              tiempo.
            </p>
          </header>

          {/* Selector de las dos secciones */}
          <div style={S.tabs}>
            <div style={S.tabActive}>En casa</div>
            <div style={S.tabDisabled}>En la calle · próximamente</div>
          </div>

          {/* ============ SECCIÓN: EN CASA ============ */}

          <section style={S.section}>
            <h2 style={S.h2}>Lo primero: enchufe común o wallbox</h2>
            <p style={S.p}>
              Técnicamente podés cargar desde cualquier toma de 230V con el
              cable que trae el auto — es lo que se llama carga en modo 2, y
              anda, pero es lenta: entre 6 y 10 km de autonomía por hora,
              según el auto. Para cargar de un día para el otro alcanza. Para
              recuperar el auto rápido entre viajes, no.
            </p>
            <p style={S.p}>
              El <strong>wallbox</strong> es un cargador de pared fijo,
              instalado por un electricista, que entrega bastante más
              potencia (7 kW es lo típico en instalación monofásica) y
              agrega protecciones que un enchufe común no tiene. Es la
              diferencia entre cargar toda la noche despacio, o hacerlo en
              2-3 horas.
            </p>

            <div style={S.compareGrid}>
              <div style={S.compareCard}>
                <div style={S.compareTitle}>Toma común (230V, modo 2)</div>
                <div style={S.compareRow}><span>Potencia</span><span>~2,3 kW</span></div>
                <div style={S.compareRow}><span>Velocidad</span><span>6-10 km/hora</span></div>
                <div style={S.compareRow}><span>Instalación</span><span>Ninguna, ya existe</span></div>
                <div style={S.compareRow}><span>Costo</span><span>$0</span></div>
              </div>
              <div style={{ ...S.compareCard, border: `1px solid ${C.real}` }}>
                <div style={{ ...S.compareTitle, color: C.real }}>Wallbox 7 kW</div>
                <div style={S.compareRow}><span>Potencia</span><span>7 kW</span></div>
                <div style={S.compareRow}><span>Velocidad</span><span>~35-40 km/hora</span></div>
                <div style={S.compareRow}><span>Instalación</span><span>Electricista habilitado</span></div>
                <div style={S.compareRow}><span>Costo instalación</span><span>~$20.000-30.000 UYU*</span></div>
              </div>
            </div>
            <p style={S.caption}>
              *Estimado para una distancia de unos 15 metros desde el
              tablero, según electricista.uy. Varía según tu instalación.
              No incluye el precio del wallbox en sí.
            </p>
          </section>

          <section style={S.section}>
            <h2 style={S.h2}>El primer cuello de botella: tu potencia contratada</h2>
            <p style={S.p}>
              Antes de pensar en el wallbox, hay una pregunta que define todo
              lo demás: <strong>¿cuánta potencia tenés contratada con UTE
              hoy?</strong> Un cargador de auto consume de forma continua
              durante horas — no es como prender una plancha un rato. Según
              dónde estés parado, el trámite es simple o se complica bastante.
            </p>

            <div style={S.scenarioCard}>
              <div style={S.scenarioNum}>1</div>
              <div>
                <div style={S.scenarioTitle}>Tenés monofásico por debajo de 7 kW</div>
                <p style={S.scenarioText}>
                  Es el caso más común y el más simple. Podés pedir el
                  aumento hasta el tope monofásico (7 kW) llamando a UTE al{' '}
                  <strong>1930</strong>. Si tu instalación interna está en
                  condiciones, muchas veces el trámite lo hacés vos mismo,
                  sin necesitar una firma instaladora — solo pagás la mano de
                  obra del cableado dedicado.
                </p>
              </div>
            </div>

            <div style={S.scenarioCard}>
              <div style={S.scenarioNum}>2</div>
              <div>
                <div style={S.scenarioTitle}>Ya estás en el tope monofásico y necesitás más</div>
                <p style={S.scenarioText}>
                  UTE no permite instalar puntos de carga monofásicos por
                  encima de 7,4 kW — para pedir más potencia hay que pasar a
                  suministro <strong>trifásico</strong>. Este cambio ya no lo
                  gestionás vos: necesita una firma instaladora y un técnico
                  autorizado que firme la DAR (Declaración de Asunción de
                  Responsabilidad) ante UTE, y probablemente haya que
                  modificar el cableado desde el medidor hasta tu tablero.
                </p>
              </div>
            </div>

            <div style={S.scenarioCard}>
              <div style={S.scenarioNum}>3</div>
              <div>
                <div style={S.scenarioTitle}>Ya tenés trifásico</div>
                <p style={S.scenarioText}>
                  El escenario más cómodo. Normalmente alcanza con instalar
                  la línea dedicada del cargador y hacer un balanceo de
                  cargas entre las tres fases — sin tener que tocar la
                  categoría de tu suministro.
                </p>
              </div>
            </div>

            <div style={S.tip}>
              <strong>Una alternativa que poca gente conoce:</strong> podés
              pedirle a UTE un <strong>segundo medidor</strong>, independiente
              del de tu casa, exclusivo para el auto. No tocás la instalación
              ni la tarifa de tu vivienda, y a cambio podés acceder a tarifas
              horarias pensadas para movilidad eléctrica sin que interfieran
              con el consumo normal de tu casa.
            </div>
          </section>

          <section style={S.section}>
            <h2 style={S.h2}>El diferencial: acá es donde más se equivocan</h2>
            <p style={S.p}>
              El auto convierte la corriente alterna de tu casa en corriente
              continua para guardarla en la batería. Si en ese proceso hay
              una fuga, un diferencial común (Tipo AC, el que ya tenés en el
              tablero) puede "cegarse" y no saltar — justo cuando más
              necesitás que salte.
            </p>
            <div style={S.diffGrid}>
              <div style={S.diffCard}>
                <div style={S.diffLabel}>Tipo AC</div>
                <div style={S.diffDesc}>El que ya tenés en casa. No sirve para el circuito del auto.</div>
              </div>
              <div style={S.diffCard}>
                <div style={S.diffLabel}>Tipo A</div>
                <div style={S.diffDesc}>
                  Sirve <em>solo si</em> tu wallbox ya trae un sensor interno
                  RDC-DD (detecta fugas en continua desde 6 mA). Revisá la
                  ficha del cargador antes de comprar el diferencial.
                </div>
              </div>
              <div style={{ ...S.diffCard, border: `1px solid ${C.real}` }}>
                <div style={{ ...S.diffLabel, color: C.real }}>Tipo B</div>
                <div style={S.diffDesc}>
                  La opción segura si el cargador <em>no</em> tiene ese
                  sensor: cubre AC, continua pulsante y continua pura. Es más
                  cara, pero no depende de que el equipo tenga la protección
                  incluida.
                </div>
              </div>
            </div>
            <p style={S.p}>
              Además del diferencial, la línea del cargador tiene que ser{' '}
              <strong>exclusiva</strong> (nada más se puede colgar de ese
              circuito), con su propia llave térmica, y con una puesta a
              tierra en condiciones — sin una jabalina de tierra que funcione
              bien, ningún diferencial protege del todo.
            </p>
          </section>

          <section style={S.section}>
            <h2 style={S.h2}>Lo que exige la instalación, en una lista</h2>
            <ul style={S.checklist}>
              <li><strong>Electricista habilitado.</strong> No es opcional ni es para ahorrar: una instalación mal hecha puede dañar el auto o el cargador, además del riesgo eléctrico.</li>
              <li><strong>Línea dedicada</strong> desde el tablero principal, sin empalmes, sin compartir con otros enchufes.</li>
              <li><strong>Diferencial correcto</strong> (Tipo A con sensor RDC-DD, o Tipo B) — ver arriba.</li>
              <li><strong>Puesta a tierra con jabalina</strong> en buen estado — el cargador la monitorea de forma continua.</li>
              <li><strong>Protección IPX4 o superior</strong> si el cargador queda expuesto a la intemperie (una cochera abierta, no un garage cerrado).</li>
              <li><strong>Conector Tipo 2</strong>, el estándar en Uruguay para carga en corriente alterna, según la norma UNIT 1234-2020.</li>
              <li><strong>Sin alargues ni adaptadores.</strong> La conexión tiene que ser con el cable fijo diseñado para el cargador.</li>
            </ul>
          </section>

          <section style={{ ...S.section, ...S.highlightSection }}>
            <div style={S.eyebrowSmall}>Antes de pedir presupuesto</div>
            <h2 style={S.h2}>El "punto de medida" puede encarecer todo</h2>
            <p style={S.p}>
              Un detalle que se pasa por alto: cada vez que pedís un aumento
              de potencia o un cambio a trifásico, UTE manda a inspeccionar
              el nicho o gabinete donde está tu medidor. Si es viejo, no
              homologado, o comparte padrón con otra vivienda sin
              centralización adecuada, <strong>la inspección lo rechaza</strong> hasta
              que se regularice — y eso puede sumar desde 200 hasta más de
              1.000 dólares al proyecto, según el estado del pilar.
            </p>
            <p style={S.p}>
              Vale la pena preguntarle al electricista que te presupueste el
              wallbox que revise también el estado del punto de medida antes
              de cerrar el número — para no llevarte la sorpresa después.
            </p>
          </section>

          <section style={S.section}>
            <h2 style={S.h2}>Wallbox: qué hay disponible en Uruguay</h2>
            <p style={S.p}>
              Hay más de un distribuidor local vendiendo e instalando
              wallbox. Como referencia de lo que existe hoy en el mercado
              uruguayo:
            </p>
            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Modelo</th>
                    <th style={S.th}>Potencia</th>
                    <th style={S.th}>Uso típico</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={S.td}>GO E31</td>
                    <td style={{ ...S.td, ...S.tdMono }}>7 kW</td>
                    <td style={S.td}>Hogar, monofásico</td>
                  </tr>
                  <tr>
                    <td style={S.td}>GO E33</td>
                    <td style={{ ...S.td, ...S.tdMono }}>22 kW</td>
                    <td style={S.td}>Comercio, trifásico</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={S.caption}>
              Referencia de mercado, no un listado completo ni una
              recomendación de marca. Consultá precio y disponibilidad
              directo con el instalador — cambian seguido.
            </p>
          </section>

          {/* ============ SECCIÓN: EN LA CALLE (stub) ============ */}

          <section style={{ ...S.section, ...S.stubSection }}>
            <div style={S.stubBadge}>Próximamente</div>
            <h2 style={S.h2}>Carga pública</h2>
            <p style={S.p}>
              Estamos armando el mapa y la guía de cargadores públicos en
              Uruguay — corredores de ruta, carga rápida DC, y cómo
              funcionan las apps de cada red. Si mientras tanto necesitás
              cargar en la calle, UTE tiene su propia red en expansión a
              través del portal de Movilidad Eléctrica.
            </p>
          </section>

          <div style={S.ctaRow}>
            <a href="/ahorro" style={S.ctaBtn}>Calculá cuánto ahorrás cargando en casa</a>
            <a href="/comparar" style={S.ctaBtnGhost}>Comparar velocidad de carga entre modelos</a>
          </div>

          <NewsletterSignup />

          <footer style={S.sources}>
            <div style={S.sourcesTitle}>Fuentes</div>
            <ul style={S.sourcesList}>
              <li>jorge-electricidad.net — guía técnica de instalación 2026, escenarios de UTE, diferenciales</li>
              <li>goevchargers.com.uy — requisitos de wallbox GO, puesta a tierra</li>
              <li>electricista.uy — costos de instalación, norma UNIT 1234-2020</li>
              <li>portal.ute.com.uy — Movilidad Eléctrica, trámites y tarifas</li>
            </ul>
            <p style={S.disclaimer}>
              Esta guía es informativa. Los requisitos y costos pueden
              cambiar — antes de instalar, confirmá siempre con un
              electricista habilitado y con UTE directamente para tu caso
              particular.
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
  eyebrowSmall: { fontFamily: mono, fontSize: 10, color: C.lab, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 },
  h1: { fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 0 16px' },
  dek: { fontSize: 16, color: C.dim, lineHeight: 1.6, margin: 0, maxWidth: '62ch' },
  tabs: { display: 'flex', gap: 10, marginBottom: 8, marginTop: 24, borderBottom: `1px solid ${C.line}`, paddingBottom: 0 },
  tabActive: {
    fontFamily: mono, fontSize: 13, color: C.real, padding: '10px 4px',
    borderBottom: `2px solid ${C.real}`, fontWeight: 600,
  },
  tabDisabled: {
    fontFamily: mono, fontSize: 13, color: C.faint, padding: '10px 4px',
  },
  section: { marginTop: 32, paddingTop: 28, borderTop: `1px solid ${C.line}` },
  highlightSection: { background: C.surface, border: `1px solid ${C.line}`, borderRadius: 6, padding: '24px 24px 20px', borderTop: `1px solid ${C.line}` },
  stubSection: { background: 'rgba(232,163,61,0.05)', border: `1px dashed ${C.lab}`, borderRadius: 6, padding: '24px', borderTop: `1px dashed ${C.lab}` },
  stubBadge: {
    display: 'inline-block', fontFamily: mono, fontSize: 10, color: C.lab,
    border: `1px solid ${C.lab}`, borderRadius: 20, padding: '4px 12px',
    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12,
  },
  h2: { fontSize: 21, fontWeight: 600, letterSpacing: '-0.01em', margin: '0 0 16px' },
  p: { fontSize: 15, lineHeight: 1.7, color: C.text, margin: '0 0 14px' },
  caption: { fontFamily: mono, fontSize: 11, color: C.faint, lineHeight: 1.6, margin: '0 0 8px' },
  compareGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 10 },
  compareCard: { background: C.surface, border: `1px solid ${C.line}`, borderRadius: 6, padding: '18px' },
  compareTitle: { fontSize: 14, fontWeight: 600, marginBottom: 12 },
  compareRow: { display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: C.dim, padding: '6px 0', borderTop: `1px solid ${C.line}`, fontFamily: mono },
  scenarioCard: { display: 'flex', gap: 16, marginBottom: 18, alignItems: 'flex-start' },
  scenarioNum: {
    flexShrink: 0, width: 30, height: 30, borderRadius: '50%', background: C.surface,
    border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: mono, fontSize: 13, color: C.real, fontWeight: 600,
  },
  scenarioTitle: { fontSize: 15, fontWeight: 600, marginBottom: 6 },
  scenarioText: { fontSize: 14, lineHeight: 1.65, color: C.dim, margin: 0 },
  tip: {
    background: 'rgba(61,220,151,0.06)', border: `1px solid ${C.real}`, borderRadius: 6,
    padding: '16px 18px', fontSize: 13.5, lineHeight: 1.6, color: C.text, marginTop: 8,
  },
  diffGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 18 },
  diffCard: { background: C.surface, border: `1px solid ${C.line}`, borderRadius: 6, padding: '16px' },
  diffLabel: { fontFamily: mono, fontSize: 14, fontWeight: 600, marginBottom: 8 },
  diffDesc: { fontSize: 12.5, color: C.dim, lineHeight: 1.6 },
  checklist: { fontSize: 14.5, lineHeight: 1.9, color: C.text, paddingLeft: 20, margin: 0 },
  tableWrap: { overflowX: 'auto', marginBottom: 10 },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 420 },
  th: { textAlign: 'left', fontFamily: mono, fontSize: 10, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '8px 10px', borderBottom: `1px solid ${C.line}` },
  td: { padding: '10px 10px', fontSize: 13, borderBottom: `1px solid ${C.line}` },
  tdMono: { fontFamily: mono },
  ctaRow: { display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 32 },
  ctaBtn: { fontFamily: mono, fontSize: 13, padding: '12px 18px', background: C.real, color: C.bg, borderRadius: 3, textDecoration: 'none', fontWeight: 500 },
  ctaBtnGhost: { fontFamily: mono, fontSize: 13, padding: '12px 18px', background: 'transparent', color: C.real, border: `1px solid ${C.real}`, borderRadius: 3, textDecoration: 'none', fontWeight: 500 },
  sources: { marginTop: 36, paddingTop: 24, borderTop: `1px solid ${C.line}` },
  sourcesTitle: { fontFamily: mono, fontSize: 11, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 },
  sourcesList: { fontFamily: mono, fontSize: 11, color: C.faint, lineHeight: 1.9, margin: '0 0 16px', paddingLeft: 18 },
  disclaimer: { fontSize: 12, color: C.faint, margin: 0 },
};
