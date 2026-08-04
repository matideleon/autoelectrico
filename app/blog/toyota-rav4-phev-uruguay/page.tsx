// ============================================================
// autoelectrico.uy — /blog/toyota-rav4-phev-uruguay
//
// Reescritura de la nota "la-semana-electrica-26jul-1ago".
// Antes era un resumen de cuatro lanzamientos, tres de ellos
// globales (VW ID.Cross, Denza Z, Mercedes GLA). Se sacaron:
// la nota ahora habla solo del auto que se puede comprar en
// Uruguay hoy — el Toyota RAV4 PHEV por Ayax.
//
// Ángulo propio: no alcanza con decir "es caro". El dato es que
// el bZ4X de la propia Toyota sale U$S 35.000 menos y es 100%
// eléctrico con 525 km. La competencia más dura del RAV4 PHEV
// está en el mismo salón de ventas.
//
// Aclaración editorial: es un PHEV, no un BEV. Se marca
// explícitamente arriba de todo para no ensuciar la promesa del
// sitio (catálogo = eléctricos).
//
// Regla de color respetada: ámbar = dato declarado por fábrica
// (WLTP, laboratorio). Verde = dato verificable en Uruguay
// (precio de lista del importador). Gris = no lo sabemos.
//
// Precios de la comparativa: catálogo propio, verificados al
// 4 de agosto de 2026.
//
// Copyright: todo parafraseado, sin citas textuales.
// Fuentes: Ayax / Toyota Uruguay, Autoblog Uruguay, catálogo
// autoelectrico.uy.
// ============================================================

import type { Metadata } from 'next';
import Nav from '@/components/Nav';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autoelectrico.uy';
const SLUG = 'toyota-rav4-phev-uruguay';

const TITLE = 'Toyota RAV4 PHEV: U$S 84.990 por 142 km eléctricos';
const DESC =
  'Ayax trajo a Uruguay el primer híbrido enchufable de Toyota. No es un auto eléctrico: son 142 km de batería por U$S 84.990. El bZ4X de la propia marca cuesta 35.000 dólares menos y declara 525 km.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${SITE}/blog/${SLUG}` },
  openGraph: {
    title: TITLE,
    description:
      'El primer enchufable de Toyota en Uruguay entra por arriba de casi todos los SUV 100% eléctricos que ya se venden acá. Los números, sin folleto.',
    url: `${SITE}/blog/${SLUG}`,
    type: 'article',
    locale: 'es_UY',
  },
  twitter: {
    card: 'summary',
    title: TITLE,
    description:
      'El primer enchufable de Toyota en Uruguay entra por arriba de casi todos los SUV 100% eléctricos que ya se venden acá.',
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
  headline: TITLE,
  description: DESC,
  datePublished: '2026-08-01',
  dateModified: '2026-08-04',
  author: { '@type': 'Organization', name: 'autoelectrico.uy' },
  publisher: { '@type': 'Organization', name: 'autoelectrico.uy' },
  mainEntityOfPage: `${SITE}/blog/${SLUG}`,
};

// Precio de lista y autonomía WLTP declarada. Catálogo propio,
// verificado al 4 de agosto de 2026. Ordenado de menor a mayor.
const RIVALES: { modelo: string; precio: string; km: string; tipo: string; slug: string | null }[] = [
  { modelo: 'Toyota bZ4X Limited 2WD', precio: '49.990', km: '525', tipo: 'BEV', slug: 'toyota-bz4x-limited-2wd-2026' },
  { modelo: 'Toyota bZ4X 4WD-i', precio: '52.990', km: '480', tipo: 'BEV', slug: 'toyota-bz4x-4wd-i-2026' },
  { modelo: 'BYD Sealion 7', precio: '55.990', km: '456', tipo: 'BEV', slug: 'byd-sealion-7-2026' },
  { modelo: 'Kia EV5 88.1 2WD', precio: '60.990', km: '555', tipo: 'BEV', slug: 'kia-ev5-88-1-2wd-2026' },
  { modelo: 'Chevrolet Equinox EV', precio: '65.990', km: '488', tipo: 'BEV', slug: 'chevrolet-equinox-ev-2026' },
  { modelo: 'Xpeng G9 Performance AWD', precio: '71.990', km: '520', tipo: 'BEV', slug: 'xpeng-g9-performance-awd-2026' },
  { modelo: 'Chevrolet Blazer EV RS', precio: '74.990', km: '520', tipo: 'BEV', slug: 'chevrolet-blazer-ev-rs-2026' },
  { modelo: 'BYD Tang', precio: '80.990', km: '530', tipo: 'BEV', slug: 'byd-tang-2026' },
  { modelo: 'Toyota RAV4 PHEV Limited', precio: '84.990', km: '142', tipo: 'PHEV', slug: null },
];

export default function Rav4PhevArticle() {
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
              <div style={S.eyebrow}>Análisis · Lanzamiento local</div>
              <h1 style={S.h1}>
                Toyota RAV4 PHEV: U$S 84.990 por 142 km eléctricos
              </h1>
              <p style={S.dek}>
                Ayax empezó a vender el primer híbrido enchufable de Toyota en
                Uruguay. No es un auto eléctrico, y el propio bZ4X de la marca
                cuesta 35.000 dólares menos con 525 km de autonomía. Los
                números, y para quién cierra igual.
              </p>
              <div style={S.meta}>
                1 de agosto de 2026 · actualizado el 4 de agosto · 6 min de lectura
              </div>
            </header>

            {/* ---------- Aclaración PHEV vs BEV ---------- */}
            <section style={S.disclaimerBox}>
              <div style={S.eyebrowSmall}>Antes que nada: esto es un PHEV, no un eléctrico</div>
              <p style={S.noteText}>
                El RAV4 enchufable tiene motor naftero y tanque de combustible.
                Los 142 km son lo que hace con la batería sola; después arranca
                el térmico. Lo cubrimos porque se enchufa y se carga en casa,
                pero no entra al catálogo de{' '}
                <a href="/modelos" style={S.inlineLink}>modelos eléctricos</a>{' '}
                y no compite en igualdad de condiciones con los autos que sí lo
                son.
              </p>
            </section>

            {/* ---------- Qué llegó ---------- */}
            <section style={S.section}>
              <div style={S.kicker}>31 de julio · Ayax</div>
              <h2 style={S.h2}>Qué llegó exactamente</h2>
              <p style={S.p}>
                Ayax comenzó a comercializar el RAV4 híbrido enchufable, el
                primer PHEV de Toyota en el mercado uruguayo. Viene en una única
                versión Limited, importada desde Japón. Con eso Toyota deja de
                mirar la electrificación enchufable desde afuera — al menos en
                esta categoría.
              </p>
              <p style={S.p}>
                El dato que manda para el uso real son los{' '}
                <strong>142 km de autonomía eléctrica declarada</strong>. Si tu
                recorrido diario queda por debajo de esa cifra y podés cargar en
                casa, el motor naftero pasa a funcionar como seguro para viajes
                en vez de ser el protagonista. Si no lo enchufás, es un híbrido
                común cargando 22,7 kWh de batería muerta.
              </p>

              <div style={S.statsGrid3}>
                <div style={S.statCard}>
                  <div style={{ ...S.statNum, color: C.lab }}>142 km</div>
                  <div style={S.statLabel}>autonomía eléctrica (WLTP)</div>
                </div>
                <div style={S.statCard}>
                  <div style={{ ...S.statNum, color: C.real }}>84.990</div>
                  <div style={S.statLabel}>dólares, precio de lista Ayax</div>
                </div>
                <div style={S.statCard}>
                  <div style={{ ...S.statNum, color: C.text }}>22,7</div>
                  <div style={S.statLabel}>kWh de batería</div>
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
                      <td style={S.tdLabel}>Baúl</td>
                      <td style={S.td}>
                        446 L
                        <span style={S.tdNote}>contra 514 L del RAV4 HEV</span>
                      </td>
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
            </section>

            {/* ---------- El precio en contexto ---------- */}
            <section style={S.section}>
              <div style={S.kicker}>El precio, en contexto</div>
              <h2 style={S.h2}>
                Entra por arriba de casi todos los SUV eléctricos que ya se
                venden acá
              </h2>
              <p style={S.p}>
                U$S 84.990 no lo pone a competir con SUV medianos: lo pone
                arriba de casi todo el segmento eléctrico disponible en
                Uruguay. Esta es la foto de lo que hay hoy en catálogo con
                precio publicado, ordenado de menor a mayor.
              </p>

              <div style={S.tableWrap}>
                <table style={S.table}>
                  <thead>
                    <tr style={S.tr}>
                      <th style={{ ...S.th, textAlign: 'left' }}>Modelo</th>
                      <th style={S.th}>Precio</th>
                      <th style={S.th}>Autonomía</th>
                      <th style={S.th}>Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RIVALES.map((r, i) => {
                      const esRav = r.tipo === 'PHEV';
                      const last = i === RIVALES.length - 1;
                      const rowStyle = {
                        ...S.tr,
                        ...(last ? { borderBottom: 'none' } : null),
                        ...(esRav ? { background: 'rgba(232,163,61,0.08)' } : null),
                      };
                      return (
                        <tr key={r.modelo} style={rowStyle}>
                          <td
                            style={{
                              ...S.tdLabel,
                              width: 'auto',
                              color: esRav ? C.text : C.dim,
                              fontWeight: esRav ? 600 : 400,
                            }}
                          >
                            {r.slug ? (
                              <a href={`/modelos/${r.slug}`} style={S.rowLink}>
                                {r.modelo}
                              </a>
                            ) : (
                              r.modelo
                            )}
                          </td>
                          <td style={{ ...S.tdNum, color: esRav ? C.lab : C.text }}>
                            {r.precio}
                          </td>
                          <td style={{ ...S.tdNum, color: esRav ? C.lab : C.dim }}>
                            {r.km} km
                          </td>
                          <td
                            style={{
                              ...S.tdNum,
                              fontSize: 11,
                              letterSpacing: '0.08em',
                              color: esRav ? C.lab : C.faint,
                            }}
                          >
                            {r.tipo}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p style={S.legend}>
                Precios de lista verificados en catálogo propio al 4 de agosto
                de 2026. Autonomías WLTP declaradas por fábrica, no medidas por
                nosotros.
              </p>
            </section>

            {/* ---------- Toyota contra Toyota ---------- */}
            <section style={S.section}>
              <div style={S.kicker}>El dato incómodo</div>
              <h2 style={S.h2}>
                Toyota contra Toyota: el bZ4X sale 35.000 dólares menos
              </h2>
              <p style={S.p}>
                No hace falta ir a buscar una marca china para encontrarle el
                problema de precio. En el mismo salón, el bZ4X Limited 2WD
                —100% eléctrico, mismo respaldo de posventa, misma red— cuesta
                U$S 49.990 y declara 525 km de autonomía. Son exactamente
                35.000 dólares de diferencia por casi cuatro veces menos
                kilómetros a batería.
              </p>
              <p style={S.p}>
                Y la cobertura tampoco ayuda al enchufable. El RAV4 PHEV viene
                con 3 años o 100.000 km de garantía de vehículo; el bZ4X, misma
                marca y mismo importador, se cubre por{' '}
                <strong>10 años o 200.000 km</strong>, batería incluida. Es más
                del triple de respaldo por 35.000 dólares menos.
              </p>

              <div style={S.statsGrid}>
                <div style={S.statCard}>
                  <div style={{ ...S.statNum, color: C.lab }}>≈ 599</div>
                  <div style={S.statLabel}>
                    dólares por km de autonomía eléctrica — RAV4 PHEV
                  </div>
                </div>
                <div style={S.statCard}>
                  <div style={{ ...S.statNum, color: C.real }}>≈ 95</div>
                  <div style={S.statLabel}>
                    dólares por km de autonomía — bZ4X Limited 2WD
                  </div>
                </div>
              </div>

              <p style={S.p}>
                Es una división grosera y a propósito: nadie compra kilómetros
                sueltos. Pero sirve para nombrar lo que se está pagando. Los
                35.000 dólares de diferencia no compran autonomía eléctrica —
                compran el tanque de nafta, la tracción E-Four y la posibilidad
                de no pensar nunca en dónde cargar.
              </p>

              <div style={S.pull}>
                Quien elija el RAV4 PHEV no va a estar comprando el kilómetro
                más barato. Va a estar comprando la red de servicio de Toyota,
                el valor de reventa de la marca y la tranquilidad de no depender
                de un cargador. Es una apuesta razonable. Pero es una apuesta, y
                conviene hacerla sabiendo el precio.
              </div>
            </section>

            {/* ---------- Balance ---------- */}
            <section style={S.section}>
              <div style={S.kicker}>Balance</div>
              <h2 style={S.h2}>Lo bueno y lo mejorable</h2>
              <div style={S.verdictGrid}>
                <div style={{ ...S.verdictCard, borderTopColor: C.real }}>
                  <div style={{ ...S.verdictTitle, color: C.real }}>Lo bueno</div>
                  <ul style={S.verdictList}>
                    <li>Autonomía eléctrica generosa para un PHEV: 142 km cubren la semana urbana de mucha gente.</li>
                    <li>Toyota Safety Sense de serie.</li>
                    <li>Techo panorámico, instrumental de 12,3" y pantalla de 12,9".</li>
                    <li>Red de posventa Toyota ya instalada en todo el país.</li>
                    <li>Cero ansiedad de autonomía: si la batería se termina, seguís andando.</li>
                  </ul>
                </div>
                <div style={{ ...S.verdictCard, borderTopColor: C.lab }}>
                  <div style={{ ...S.verdictTitle, color: C.lab }}>Lo mejorable</div>
                  <ul style={S.verdictList}>
                    <li>Precio de marca premium en una marca generalista.</li>
                    <li>El bZ4X de la propia Toyota sale U$S 35.000 menos y es 100% eléctrico.</li>
                    <li>Garantía de 3 años / 100.000 km: el bZ4X, misma marca y mismo importador, da 10 años / 200.000 km.</li>
                    <li>Baúl más chico que el HEV: 446 L contra 514 L.</li>
                    <li>Carga rápida limitada a 50 kW.</li>
                    <li>Auxilio temporario, no rueda de tamaño completo.</li>
                    <li>Si no lo enchufás nunca, cargás 22,7 kWh de peso muerto.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* ---------- Para quién ---------- */}
            <section style={S.section}>
              <div style={S.kicker}>La decisión</div>
              <h2 style={S.h2}>Para quién cierra y para quién no</h2>
              <p style={S.p}>
                <strong>Cierra</strong> si hacés menos de 140 km por día, tenés
                dónde enchufarlo en casa y además viajás seguido al interior o a
                Brasil, donde la red de carga rápida todavía es un problema. En
                ese perfil el RAV4 PHEV hace casi todo el uso a electricidad y
                te saca la carga mental de planificar el resto.
              </p>
              <p style={S.p}>
                <strong>No cierra</strong> si tu uso es exclusivamente urbano y
                metropolitano. Ahí estás pagando un motor a nafta, un tanque y
                una caja que casi nunca vas a usar. Con ese presupuesto hay SUV
                100% eléctricos con más de 450 km de autonomía —incluido uno de
                la propia Toyota— por entre 20.000 y 35.000 dólares menos.
              </p>
              <p style={S.p}>
                Tampoco cierra si no tenés instalación de carga domiciliaria. Un
                PHEV sin enchufe es la peor versión de los dos mundos: consumo
                de híbrido con el peso y el precio de la batería.{' '}
                <a href="/carga/hogar" style={S.inlineLink}>
                  Acá está lo que exige UTE para instalarla
                </a>
                .
              </p>
            </section>

            {/* ---------- Lo que no sabemos ---------- */}
            <section style={{ ...S.section, ...S.noteSection }}>
              <div style={S.eyebrowSmall}>Lo que no sabemos todavía</div>
              <p style={S.noteText}>
                Las cifras de esta nota son declaraciones de fábrica en ciclo
                WLTP: laboratorio, no ruta uruguaya. No tenemos ninguna medición
                propia del RAV4 PHEV — ni consumo real en ciudad, ni autonomía
                eléctrica efectiva en ruta, ni tiempos de carga verificados con
                cargadores locales. Tampoco está claro cómo va a tratar a los
                PHEV el esquema impositivo que se discute para 2027. Si tenés un
                RAV4 PHEV y querés compartir consumos reales, escribinos — es
                exactamente el tipo de dato que este sitio existe para publicar.
              </p>
            </section>

            <div style={S.ctaRow}>
              <a href="/modelos" style={S.ctaBtn}>
                Ver los eléctricos disponibles
              </a>
              <a href="/comparar" style={S.ctaBtnGhost}>
                Comparar modelos
              </a>
              <a href="/ahorro" style={S.ctaBtnGhost}>
                Calcular mi ahorro
              </a>
              <a href="/noticias" style={S.ctaBtnGhost}>
                Más noticias
              </a>
            </div>

            <footer style={S.sources}>
              <div style={S.sourcesTitle}>Fuentes</div>
              <ul style={S.sourcesList}>
                <li>Ayax / Toyota Uruguay — ficha, precio de lista y garantía del RAV4 PHEV</li>
                <li>Autoblog Uruguay — cobertura del lanzamiento local</li>
                <li>autoelectrico.uy — catálogo de modelos, precios verificados al 4 de agosto de 2026</li>
              </ul>
              <p style={S.disclaimer}>
                Las especificaciones son las declaradas por el fabricante y el
                importador. autoelectrico.uy no midió este vehículo. Imágenes y
                datos técnicos: gentileza de la marca.
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

  // Caja de aclaración PHEV, arriba de todo
  disclaimerBox: {
    marginTop: 32,
    background: 'rgba(232,163,61,0.06)',
    border: `1px solid ${C.line}`,
    borderLeft: `3px solid ${C.lab}`,
    borderRadius: '0 8px 8px 0',
    padding: '18px 20px',
  },

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

  // Tablas
  tableWrap: { border: `1px solid ${C.line}`, borderRadius: 8, overflow: 'hidden', background: C.surface, margin: '18px 0 10px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  tr: { borderBottom: `1px solid ${C.line}` },
  th: { padding: '11px 14px', fontFamily: mono, fontSize: 10, fontWeight: 400, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'right' },
  tdLabel: { padding: '11px 14px', color: C.dim, fontSize: 13, width: '46%', verticalAlign: 'top' },
  td: { padding: '11px 14px', color: C.text, fontFamily: mono, fontSize: 13, verticalAlign: 'top' },
  tdNum: { padding: '11px 14px', fontFamily: mono, fontSize: 13, textAlign: 'right', verticalAlign: 'top', whiteSpace: 'nowrap' },
  tdNote: { display: 'block', fontFamily: sans, fontSize: 11.5, color: C.faint, marginTop: 3, fontWeight: 400 },

  rowLink: { color: 'inherit', textDecoration: 'none', borderBottom: `1px solid ${C.line}` },
  inlineLink: { color: C.real, textDecoration: 'none', borderBottom: `1px solid rgba(61,220,151,0.4)` },

  legend: { fontFamily: mono, fontSize: 10.5, color: C.faint, margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap', lineHeight: 1.6 },
  dot: { display: 'inline-block', width: 7, height: 7, borderRadius: '50%', marginRight: 2 },

  verdictGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 12, marginTop: 20 },
  verdictCard: { background: C.surface, border: `1px solid ${C.line}`, borderTop: '2px solid', borderRadius: 8, padding: '16px 18px' },
  verdictTitle: { fontFamily: mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 },
  verdictList: { margin: 0, paddingLeft: 16, fontSize: 13.5, lineHeight: 1.7, color: C.dim },

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
