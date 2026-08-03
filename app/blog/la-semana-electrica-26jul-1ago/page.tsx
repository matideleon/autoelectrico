// ============================================================
// autoelectrico.uy — /blog/la-semana-electrica-26jul-1ago
//
// Resumen semanal (26 jul – 1 ago 2026). Cuatro anuncios: tres
// globales (VW ID.Cross, Denza Z, Mercedes GLA) y uno local que
// es el que realmente mueve la aguja acá (Toyota RAV4 PHEV por
// Ayax).
//
// Ángulo propio: de los cuatro, uno solo se puede comprar en
// Uruguay hoy — y su precio lo pone en un territorio raro para
// una marca generalista.
//
// Regla de color respetada: ámbar = dato declarado por fábrica
// (WLTP, laboratorio). Cian = dato verificable en Uruguay
// (precio de lista del importador). Gris = no lo sabemos.
//
// Copyright: todo parafraseado, sin citas textuales.
// Fuentes: Autoblog Uruguay, comunicaciones oficiales de
// Volkswagen, Denza/BYD, Toyota-Ayax y Mercedes-Benz.
// ============================================================

import type { Metadata } from 'next';
import Nav from '@/components/Nav';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autoelectrico.uy';
const SLUG = 'la-semana-electrica-26jul-1ago';

export const metadata: Metadata = {
  title: 'La semana eléctrica: cuatro lanzamientos, uno que podés comprar acá',
  description:
    'Toyota trajo su primer híbrido enchufable a Uruguay a U$S 84.990. Afuera, Volkswagen mostró su SUV eléctrico más chico, Denza un deportivo de 1.604 cv y Mercedes un GLA que ya no tiene versión a nafta pura.',
  alternates: { canonical: `${SITE}/blog/${SLUG}` },
  openGraph: {
    title: 'La semana eléctrica: cuatro lanzamientos, uno que podés comprar acá',
    description:
      'El RAV4 PHEV llegó a Uruguay en territorio de precio Lexus. Y afuera, hasta los modelos de entrada se diseñan eléctricos desde cero.',
    url: `${SITE}/blog/${SLUG}`,
    type: 'article',
    locale: 'es_UY',
  },
  twitter: {
    card: 'summary',
    title: 'La semana eléctrica: cuatro lanzamientos, uno que podés comprar acá',
    description:
      'El RAV4 PHEV llegó a Uruguay en territorio de precio Lexus. Y afuera, hasta los modelos de entrada se diseñan eléctricos desde cero.',
  },
};

const C = {
  bg: '#141619',
  surface: '#1B1E23',
  line: '#2A2E35',
  text: '#E6E8EB',
  dim: '#9AA1AC',
  faint: '#828993',
  real: '#3DDC97',
  lab: '#E8A33D',
  gap: '#4A505A',
};
const mono = "'IBM Plex Mono', ui-monospace, Menlo, monospace";
const sans = "'IBM Plex Sans', -apple-system, sans-serif";

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'La semana eléctrica: cuatro lanzamientos, uno que podés comprar acá',
  description:
    'Resumen de los anuncios de movilidad eléctrica entre el 26 de julio y el 1 de agosto de 2026: Volkswagen ID.Cross, Denza Z, Toyota RAV4 PHEV en Uruguay y Mercedes-Benz GLA de tercera generación.',
  datePublished: '2026-08-01',
  dateModified: '2026-08-01',
  author: { '@type': 'Organization', name: 'autoelectrico.uy' },
  publisher: { '@type': 'Organization', name: 'autoelectrico.uy' },
  mainEntityOfPage: `${SITE}/blog/${SLUG}`,
};

export default function SemanaElectricaArticle() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main id="contenido" className="page-main">
        <article style={S.root}>
          <div style={S.wrap}>
            <header style={S.header}>
              <div style={S.eyebrow}>Resumen · La semana</div>
              <h1 style={S.h1}>
                La semana eléctrica: cuatro lanzamientos, uno que podés
                comprar acá
              </h1>
              <p style={S.dek}>
                Entre el 26 de julio y el 1 de agosto se presentaron un SUV
                urbano, un deportivo de 1.604 caballos y un Mercedes que ya
                no viene a nafta pura. Pero el único que hoy tiene precio en
                pesos —bueno, en dólares— es un Toyota.
              </p>
              <div style={S.meta}>1 de agosto de 2026 · 6 min de lectura</div>
            </header>

            {/* ---------- Índice / strip de la semana ---------- */}
            <section style={S.stripSection}>
              <div style={S.eyebrowSmall}>Los cuatro, de un vistazo</div>
              <ol style={S.strip}>
                <li style={S.stripItem}>
                  <span style={S.stripDate}>26 jul</span>
                  <span style={S.stripName}>Volkswagen ID.Cross</span>
                  <span style={S.tagGlobal}>Global</span>
                </li>
                <li style={S.stripItem}>
                  <span style={S.stripDate}>30 jul</span>
                  <span style={S.stripName}>Denza Z</span>
                  <span style={S.tagGlobal}>Global</span>
                </li>
                <li style={S.stripItem}>
                  <span style={S.stripDate}>31 jul</span>
                  <span style={S.stripName}>Toyota RAV4 PHEV</span>
                  <span style={S.tagLocal}>A la venta en Uruguay</span>
                </li>
                <li style={{ ...S.stripItem, borderBottom: 'none' }}>
                  <span style={S.stripDate}>1 ago</span>
                  <span style={S.stripName}>Mercedes-Benz GLA</span>
                  <span style={S.tagGlobal}>Global</span>
                </li>
              </ol>
            </section>

            {/* ---------- RAV4 PHEV ---------- */}
            <section style={S.section}>
              <div style={S.kicker}>31 de julio · Lanzamiento local</div>
              <h2 style={S.h2}>
                Toyota RAV4 PHEV: el primer enchufable japonés que se vende acá
              </h2>
              <p style={S.p}>
                Ayax empezó a comercializar el RAV4 híbrido enchufable, el
                primer PHEV de Toyota en el mercado uruguayo. Llega en una
                única versión Limited, importada desde Japón, y con eso
                Toyota deja de mirar la electrificación enchufable desde
                afuera.
              </p>
              <p style={S.p}>
                El dato que importa para el uso real: son{' '}
                <strong>142 km de autonomía eléctrica declarada</strong>. Si
                tu recorrido diario está por debajo de eso y cargás en casa,
                el motor naftero pasa a ser un seguro para viajes, no el
                protagonista.
              </p>

              <div style={S.statsGrid}>
                <div style={S.statCard}>
                  <div style={{ ...S.statNum, color: C.lab }}>142 km</div>
                  <div style={S.statLabel}>autonomía eléctrica (WLTP)</div>
                </div>
                <div style={S.statCard}>
                  <div style={{ ...S.statNum, color: C.real }}>84.990</div>
                  <div style={S.statLabel}>dólares, precio de lista Ayax</div>
                </div>
              </div>

              <div style={S.tableWrap}>
                <table style={S.table}>
                  <tbody>
                    <tr style={S.tr}>
                      <td style={S.tdLabel}>Potencia combinada</td>
                      <td style={S.td}>
                        329 cv
                        <span style={S.tdNote}>
                          189 térmico + 205 del. + 56 tras.
                        </span>
                      </td>
                    </tr>
                    <tr style={S.tr}>
                      <td style={S.tdLabel}>Batería</td>
                      <td style={S.td}>22,7 kWh</td>
                    </tr>
                    <tr style={S.tr}>
                      <td style={S.tdLabel}>Autonomía eléctrica</td>
                      <td style={{ ...S.td, color: C.lab }}>142 km (WLTP)</td>
                    </tr>
                    <tr style={S.tr}>
                      <td style={S.tdLabel}>0–100 km/h</td>
                      <td style={S.td}>5,7 s</td>
                    </tr>
                    <tr style={S.tr}>
                      <td style={S.tdLabel}>Tracción</td>
                      <td style={S.td}>E-Four AWD</td>
                    </tr>
                    <tr style={S.tr}>
                      <td style={S.tdLabel}>Recarga AC / DC</td>
                      <td style={S.td}>11 kW / 50 kW (CCS2)</td>
                    </tr>
                    <tr style={S.tr}>
                      <td style={S.tdLabel}>Precio</td>
                      <td style={{ ...S.td, color: C.real, fontWeight: 600 }}>
                        U$S 84.990
                      </td>
                    </tr>
                    <tr style={{ ...S.tr, borderBottom: 'none' }}>
                      <td style={S.tdLabel}>Garantía</td>
                      <td style={S.td}>
                        3 años / 100.000 km
                        <span style={S.tdNote}>
                          batería: 8 años / 160.000 km
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p style={S.legend}>
                <span style={{ ...S.dot, background: C.lab }} /> declarado por
                fábrica (laboratorio) &nbsp;·&nbsp;
                <span style={{ ...S.dot, background: C.real }} /> verificable
                en Uruguay
              </p>

              <div style={S.verdictGrid}>
                <div style={{ ...S.verdictCard, borderTopColor: C.real }}>
                  <div style={{ ...S.verdictTitle, color: C.real }}>
                    Lo bueno
                  </div>
                  <ul style={S.verdictList}>
                    <li>Autonomía eléctrica generosa para un PHEV.</li>
                    <li>Toyota Safety Sense de serie.</li>
                    <li>Techo panorámico, instrumental de 12,3" y pantalla de 12,9".</li>
                    <li>Red de posventa Toyota ya instalada en todo el país.</li>
                  </ul>
                </div>
                <div style={{ ...S.verdictCard, borderTopColor: C.lab }}>
                  <div style={{ ...S.verdictTitle, color: C.lab }}>
                    Lo mejorable
                  </div>
                  <ul style={S.verdictList}>
                    <li>Precio de marca premium en una marca generalista.</li>
                    <li>Baúl más chico que el HEV: 446 L contra 514 L.</li>
                    <li>Auxilio temporario, no rueda de tamaño completo.</li>
                    <li>Carga rápida limitada a 50 kW.</li>
                  </ul>
                </div>
              </div>

              <div style={S.pull}>
                U$S 84.990 lo deja arriba de varios SUV medianos 100%
                eléctricos que ya se venden en Uruguay. El que lo compre no
                va a estar comprando el kilómetro más barato: va a estar
                comprando la red de servicio de Toyota y la tranquilidad de
                no depender de un cargador.
              </div>
            </section>

            {/* ---------- ID.Cross ---------- */}
            <section style={S.section}>
              <div style={S.kicker}>26 de julio · Anuncio global</div>
              <h2 style={S.h2}>
                Volkswagen ID.Cross: el eléctrico más chico de la familia ID
              </h2>
              <p style={S.p}>
                Volkswagen presentó en Europa el ID.Cross, un SUV
                sub-compacto 100% eléctrico que funciona como la variante
                elevada del ID.Polo. Es el cuarto modelo sobre la plataforma
                MEB+, la evolución de la base que el grupo viene usando desde
                el ID.3.
              </p>
              <div style={S.specRow}>
                <div style={S.specChip}>
                  <span style={S.specChipLabel}>Potencia</span>
                  <span style={S.specChipValue}>85 – 155 kW</span>
                  <span style={S.specChipSub}>116 a 211 cv</span>
                </div>
                <div style={S.specChip}>
                  <span style={S.specChipLabel}>Baterías</span>
                  <span style={S.specChipValue}>37 y 52 kWh</span>
                  <span style={S.specChipSub}>dos configuraciones</span>
                </div>
                <div style={S.specChip}>
                  <span style={S.specChipLabel}>Llegada a Uruguay</span>
                  <span style={{ ...S.specChipValue, color: C.gap }}>
                    Sin fecha
                  </span>
                  <span style={S.specChipSub}>no confirmada</span>
                </div>
              </div>
              <p style={S.p}>
                Con este modelo Volkswagen completa su oferta eléctrica por
                abajo. Es el movimiento que más nos interesa mirar desde acá:
                el segmento de entrada es exactamente donde las marcas chinas
                dominan hoy el mercado uruguayo, y es donde una europea
                todavía no tiene una respuesta de precio.
              </p>
            </section>

            {/* ---------- Denza Z ---------- */}
            <section style={S.section}>
              <div style={S.kicker}>30 de julio · Anuncio global</div>
              <h2 style={S.h2}>Denza Z: BYD se manda con 1.604 caballos</h2>
              <p style={S.p}>
                Denza, la marca premium de BYD, mostró en el Goodwood Festival
                of Speed su primer superdeportivo eléctrico, en carrocerías
                coupé y roadster. Los números son de vidriera, no de
                compraventa.
              </p>
              <div style={S.statsGrid3}>
                <div style={S.statCard}>
                  <div style={{ ...S.statNum, color: C.lab }}>1.604</div>
                  <div style={S.statLabel}>caballos</div>
                </div>
                <div style={S.statCard}>
                  <div style={{ ...S.statNum, color: C.lab }}>1,96 s</div>
                  <div style={S.statLabel}>0 a 100 km/h</div>
                </div>
                <div style={S.statCard}>
                  <div style={{ ...S.statNum, color: C.lab }}>9 min</div>
                  <div style={S.statLabel}>de 10% a 97% de carga</div>
                </div>
              </div>
              <p style={S.p}>
                El auto en sí no le va a cambiar la vida a nadie en Uruguay.
                Lo que sí importa es el dato de carga: nueve minutos para
                pasar de 10% a 97% es la misma tecnología que, dos o tres
                generaciones más abajo, termina en un Dolphin o un Yuan. BYD
                usa los deportivos como escaparate de lo que después baja a
                los modelos de volumen.
              </p>
            </section>

            {/* ---------- Mercedes GLA ---------- */}
            <section style={S.section}>
              <div style={S.kicker}>1 de agosto · Anuncio global</div>
              <h2 style={S.h2}>
                Mercedes-Benz GLA: la tercera generación se despide de la nafta
                pura
              </h2>
              <p style={S.p}>
                Mercedes presentó el nuevo GLA sobre la plataforma MMA
                (Mercedes-Benz Modular Architecture). Ya no hay versiones
                puramente a combustión: la oferta es micro-híbrida o 100%
                eléctrica, con hasta 657 km declarados en ciclo WLTP para la
                variante eléctrica.
              </p>
              <div style={S.specRow}>
                <div style={S.specChip}>
                  <span style={S.specChipLabel}>Autonomía máxima</span>
                  <span style={{ ...S.specChipValue, color: C.lab }}>
                    657 km
                  </span>
                  <span style={S.specChipSub}>WLTP, declarada</span>
                </div>
                <div style={S.specChip}>
                  <span style={S.specChipLabel}>Motorizaciones</span>
                  <span style={S.specChipValue}>MHEV o BEV</span>
                  <span style={S.specChipSub}>sin combustión pura</span>
                </div>
                <div style={S.specChip}>
                  <span style={S.specChipLabel}>Llegada a Uruguay</span>
                  <span style={S.specChipValue}>2027</span>
                  <span style={S.specChipSub}>prevista</span>
                </div>
              </div>
              <p style={S.p}>
                El SUV de entrada de Mercedes nace eléctrico. Cuando la puerta
                de acceso a una marca premium deja de tener motor a nafta, la
                transición ya no es una línea de producto: es la marca entera
                moviéndose.
              </p>
            </section>

            {/* ---------- Lectura local ---------- */}
            <section style={S.section}>
              <h2 style={S.h2}>Qué significa esta semana para Uruguay</h2>
              <p style={S.p}>
                La llegada del RAV4 PHEV es una señal más clara de lo que
                parece. Hasta ahora, la electrificación enchufable en Uruguay
                venía casi exclusivamente de las marcas chinas por el lado del
                precio y de las premium alemanas por el lado del prestigio.
                Que una generalista japonesa traiga su primer PHEV significa
                que el segmento del medio también se está moviendo.
              </p>
              <p style={S.p}>
                La pregunta abierta es el precio. U$S 84.990 es territorio
                Lexus, en un mercado donde ya hay SUV medianos 100% eléctricos
                por bastante menos. Toyota está apostando a que hay
                compradores que quieren electrificación sin renunciar a la red
                de servicio y a la reventa de la marca. Es una apuesta
                razonable, pero es una apuesta.
              </p>
              <p style={S.p}>
                Del lado global, Volkswagen y Mercedes confirman lo mismo
                desde extremos opuestos de la tabla: el modelo de entrada y el
                de volumen ya se diseñan eléctricos desde cero. No es un
                experimento paralelo a la línea principal — es la línea
                principal.
              </p>
            </section>

            {/* ---------- Lo que no sabemos ---------- */}
            <section style={{ ...S.section, ...S.noteSection }}>
              <div style={S.eyebrowSmall}>Lo que no sabemos todavía</div>
              <p style={S.noteText}>
                Las autonomías de esta nota son cifras WLTP declaradas por
                cada fábrica: son de laboratorio, no de ruta uruguaya. Todavía
                no tenemos ninguna medición propia del RAV4 PHEV, ni consumo
                real en ciudad ni tiempos de carga verificados con cargadores
                locales. Tampoco hay fecha confirmada de llegada del ID.Cross,
                ni precio del GLA. Si tenés un RAV4 PHEV y querés compartir
                consumos reales, escribinos — es exactamente el tipo de dato
                que este sitio existe para publicar.
              </p>
            </section>

            <div style={S.ctaRow}>
              <a href="/modelos" style={S.ctaBtn}>
                Ver los eléctricos disponibles
              </a>
              <a href="/comparar" style={S.ctaBtnGhost}>
                Comparar modelos
              </a>
              <a href="/noticias" style={S.ctaBtnGhost}>
                Más noticias
              </a>
            </div>

            <footer style={S.sources}>
              <div style={S.sourcesTitle}>Fuentes</div>
              <ul style={S.sourcesList}>
                <li>Autoblog Uruguay — cobertura de los cuatro lanzamientos</li>
                <li>Ayax / Toyota Uruguay — ficha, precio y garantía del RAV4 PHEV</li>
                <li>Volkswagen AG — comunicado de presentación del ID.Cross</li>
                <li>Denza (BYD) — presentación en el Goodwood Festival of Speed</li>
                <li>Mercedes-Benz AG — comunicado del GLA de tercera generación</li>
              </ul>
              <p style={S.disclaimer}>
                Las especificaciones son las declaradas por cada fabricante o
                importador. autoelectrico.uy no midió ninguno de estos
                vehículos todavía. Imágenes y datos técnicos: gentileza de las
                marcas.
              </p>
            </footer>
          </div>
        </article>
      </main>
    </>
  );
}

const S: Record<string, React.CSSProperties> = {
  root: { background: C.bg, minHeight: '100vh', color: C.text, fontFamily: sans, padding: '20px 20px 80px' },
  wrap: { maxWidth: 720, margin: '0 auto' },

  header: { marginBottom: 32, paddingTop: 20 },
  eyebrow: { fontFamily: mono, fontSize: 11, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 },
  eyebrowSmall: { fontFamily: mono, fontSize: 11, color: C.lab, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 },
  kicker: { fontFamily: mono, fontSize: 11, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 },
  h1: { fontSize: 'clamp(26px, 5.5vw, 38px)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2, margin: '0 0 16px' },
  dek: { fontSize: 16, color: C.dim, lineHeight: 1.6, margin: '0 0 14px', maxWidth: '60ch' },
  meta: { fontFamily: mono, fontSize: 11, color: C.faint },

  section: { marginTop: 32, paddingTop: 28, borderTop: `1px solid ${C.line}` },
  h2: { fontSize: 21, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.3, margin: '0 0 16px' },
  p: { fontSize: 15, lineHeight: 1.7, color: C.text, margin: '0 0 14px' },

  // Strip índice
  stripSection: { marginTop: 32, paddingTop: 24, borderTop: `1px solid ${C.line}` },
  strip: { listStyle: 'none', margin: 0, padding: 0, border: `1px solid ${C.line}`, borderRadius: 8, background: C.surface, overflow: 'hidden' },
  stripItem: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '11px 14px', borderBottom: `1px solid ${C.line}` },
  stripDate: { fontFamily: mono, fontSize: 11, color: C.faint, minWidth: 46 },
  stripName: { fontSize: 14, fontWeight: 500, flex: 1, minWidth: 140 },
  tagGlobal: { fontFamily: mono, fontSize: 10, color: C.dim, border: `1px solid ${C.line}`, borderRadius: 3, padding: '3px 7px', letterSpacing: '0.04em', whiteSpace: 'nowrap' },
  tagLocal: { fontFamily: mono, fontSize: 10, color: C.real, border: `1px solid ${C.real}`, borderRadius: 3, padding: '3px 7px', letterSpacing: '0.04em', whiteSpace: 'nowrap' },

  pull: {
    borderLeft: `3px solid ${C.real}`, background: 'rgba(61,220,151,0.06)',
    padding: '14px 18px', borderRadius: '0 6px 6px 0', fontSize: 14.5,
    color: C.text, margin: '20px 0 0', lineHeight: 1.6,
  },

  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, margin: '18px 0' },
  statsGrid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, margin: '18px 0' },
  statCard: { padding: '18px 16px', background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, textAlign: 'center' },
  statNum: { fontFamily: mono, fontSize: 26, fontWeight: 600, letterSpacing: '-0.01em' },
  statLabel: { fontSize: 11.5, color: C.dim, marginTop: 6, lineHeight: 1.4 },

  // Tabla de ficha
  tableWrap: { border: `1px solid ${C.line}`, borderRadius: 8, overflow: 'hidden', background: C.surface, margin: '18px 0 10px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  tr: { borderBottom: `1px solid ${C.line}` },
  tdLabel: { padding: '11px 14px', color: C.dim, fontSize: 13, width: '46%', verticalAlign: 'top' },
  td: { padding: '11px 14px', color: C.text, fontFamily: mono, fontSize: 13, verticalAlign: 'top' },
  tdNote: { display: 'block', fontFamily: sans, fontSize: 11.5, color: C.faint, marginTop: 3, fontWeight: 400 },

  legend: { fontFamily: mono, fontSize: 10.5, color: C.faint, margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' },
  dot: { display: 'inline-block', width: 7, height: 7, borderRadius: '50%', marginRight: 2 },

  // Bueno / mejorable
  verdictGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 12, marginTop: 20 },
  verdictCard: { background: C.surface, border: `1px solid ${C.line}`, borderTop: '2px solid', borderRadius: 8, padding: '16px 18px' },
  verdictTitle: { fontFamily: mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 },
  verdictList: { margin: 0, paddingLeft: 16, fontSize: 13.5, lineHeight: 1.7, color: C.dim },

  // Chips de spec
  specRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, margin: '16px 0 18px' },
  specChip: { background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, padding: '13px 15px' },
  specChipLabel: { display: 'block', fontFamily: mono, fontSize: 10, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 },
  specChipValue: { display: 'block', fontFamily: mono, fontSize: 16, fontWeight: 600, color: C.text },
  specChipSub: { display: 'block', fontSize: 11, color: C.dim, marginTop: 3 },

  noteSection: {
    background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8,
    padding: '20px 22px', marginTop: 28, borderTop: `1px solid ${C.line}`,
  },
  noteText: { fontSize: 14, color: C.dim, lineHeight: 1.65, margin: 0 },

  ctaRow: { display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 36 },
  ctaBtn: { fontFamily: mono, fontSize: 13, padding: '12px 18px', background: C.real, color: C.bg, borderRadius: 3, textDecoration: 'none', fontWeight: 500 },
  ctaBtnGhost: { fontFamily: mono, fontSize: 13, padding: '12px 18px', background: 'transparent', color: C.real, border: `1px solid ${C.real}`, borderRadius: 3, textDecoration: 'none', fontWeight: 500 },

  sources: { marginTop: 36, paddingTop: 24, borderTop: `1px solid ${C.line}` },
  sourcesTitle: { fontFamily: mono, fontSize: 11, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 },
  sourcesList: { fontFamily: mono, fontSize: 11, color: C.faint, lineHeight: 1.9, margin: '0 0 16px', paddingLeft: 18 },
  disclaimer: { fontSize: 12, color: C.faint, margin: 0 },
};
