// ============================================================
// autoelectrico.uy — /blog/captiva-omoda-bajan-precio-imesi
//
// Secuela de /blog/efecto-tesla-byd. Dos bajas nuevas (Chevrolet
// Captiva EV y Omoda E5) que llevan la cuenta a nueve versiones
// en dieciocho días.
//
// Ángulo propio, y lo que separa esta nota de la cobertura del
// resto: el "efecto Tesla" es solo la mitad de la explicación.
// La otra es el IMESI que arranca el 1/1/2027 y que le pone
// fecha de vencimiento a la ventana de compra.
//
// Segundo aporte propio: la Captiva comunica 415 km NEDC, pero
// en WLTP declara 318. Noventa y siete kilómetros de diferencia
// según el ciclo, y es lo que decide si queda cuarta o última
// del pelotón. En la tabla va el WLTP, que es el único
// comparable contra los otros cuatro.
//
// Copyright: todo parafraseado. Sin citas textuales.
//
// Fuentes: Autoblog Uruguay (lanzamiento Omoda E5 restyling
// 03/06/2026, lanzamiento Captiva EV 10/10/2025, decreto IMESI
// 01/07/2026), LARED21 y Ámbito (lista BYD "Modelo 2027" y
// declaraciones de ACAU), Mauricio Plastina y Gabriel Lander
// (reporte de los ajustes del 03/08/2026), Silca (ficha oficial
// Captiva EV).
// ============================================================

import type { Metadata } from 'next';
import Nav from '@/components/Nav';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autoelectrico.uy';

export const metadata: Metadata = {
  title: 'Bajaron la Captiva EV y el Omoda E5: van nueve versiones en dieciocho días',
  description:
    'Chevrolet Captiva EV a USD 31.990 y Omoda E5 desde 25.990. Cinco eléctricos quedan al mismo precio exacto. Y el IMESI que arranca en enero de 2027 explica la otra mitad.',
  alternates: { canonical: `${SITE}/blog/captiva-omoda-bajan-precio-imesi` },
  openGraph: {
    title: 'Bajaron la Captiva EV y el Omoda E5: van nueve versiones en dieciocho días',
    description:
      'Nueve bajas de precio en dieciocho días. Tesla es solo la mitad de la explicación: la otra tiene fecha de vencimiento el 31 de diciembre.',
    url: `${SITE}/blog/captiva-omoda-bajan-precio-imesi`,
    type: 'article',
    locale: 'es_UY',
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
  lab: '#C58259',
};

const mono = "'IBM Plex Mono', ui-monospace, Menlo, monospace";
const sans = "'IBM Plex Sans', -apple-system, sans-serif";

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Bajaron la Captiva EV y el Omoda E5: van nueve versiones en dieciocho días',
  description:
    'Análisis de las bajas de precio de Chevrolet Captiva EV y Omoda E5 en Uruguay, el pelotón de modelos a USD 31.990, y el nuevo IMESI a eléctricos que rige desde enero de 2027.',
  datePublished: '2026-08-04',
  dateModified: '2026-08-04',
  author: { '@type': 'Organization', name: 'autoelectrico.uy' },
  publisher: { '@type': 'Organization', name: 'autoelectrico.uy' },
  mainEntityOfPage: `${SITE}/blog/captiva-omoda-bajan-precio-imesi`,
};

export default function CaptivaOmodaImesiArticle() {
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
            <div style={S.eyebrow}>Análisis · Precios</div>
            <h1 style={S.h1}>
              Bajaron la Captiva EV y el Omoda E5: van nueve versiones en
              dieciocho días
            </h1>
            <p style={S.dek}>
              Chevrolet dejó la Captiva EV en USD 31.990 y Omoda ajustó dos
              versiones del E5. Sumadas a las seis de BYD, son nueve bajas
              desde que Tesla abrió venta. Pero Tesla es solo la mitad de la
              explicación: la otra tiene fecha de vencimiento el 31 de
              diciembre.
            </p>
            <div style={S.meta}>4 de agosto de 2026 · 7 min de lectura</div>
          </header>

          {/* Las bajas, con números */}
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
                    <td style={S.td}>Chevrolet Captiva EV</td>
                    <td style={{ ...S.td, ...S.tdMono }}>USD 33.990</td>
                    <td style={{ ...S.td, ...S.tdMono, color: C.real }}>USD 31.990</td>
                    <td style={{ ...S.td, ...S.tdMono }}>−5,9%</td>
                  </tr>
                  <tr>
                    <td style={S.td}>Omoda E5 Comfort SR (51 kWh)</td>
                    <td style={{ ...S.td, ...S.tdMono }}>USD 26.990</td>
                    <td style={{ ...S.td, ...S.tdMono, color: C.real }}>USD 25.990</td>
                    <td style={{ ...S.td, ...S.tdMono }}>−3,7%</td>
                  </tr>
                  <tr>
                    <td style={S.td}>Omoda E5 Luxury SR (51 kWh)</td>
                    <td style={{ ...S.td, ...S.tdMono }}>USD 28.990</td>
                    <td style={{ ...S.td, ...S.tdMono, color: C.real }}>USD 27.990</td>
                    <td style={{ ...S.td, ...S.tdMono }}>−3,4%</td>
                  </tr>
                  <tr>
                    <td style={S.td}>Omoda E5 Luxury (59 kWh)</td>
                    <td style={{ ...S.td, ...S.tdMono }}>USD 31.990</td>
                    <td style={{ ...S.td, ...S.tdMono }}>USD 31.990</td>
                    <td style={{ ...S.td, ...S.tdMono, color: C.faint }}>sin cambio</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={S.caption}>
              Los precios &quot;antes&quot; son los de la lista oficial de
              lanzamiento: la Captiva EV salió en octubre de 2025 a USD 33.990
              y el E5 restyling se presentó el 3 de junio de 2026 con la
              escalera 26.990 / 28.990 / 31.990.
            </p>
            <p style={S.p}>
              Dos detalles. En la Captiva, los avisos muestran las variantes{' '}
              <strong>EV</strong> y <strong>EV Premier</strong> las dos a
              31.990 — no bajó solo la de entrada. Y en el Omoda, la batería
              grande quedó donde estaba: bajaron las dos versiones de 51 kWh y
              no tocaron la de 59.
            </p>
            <p style={S.p}>
              Un tercero que conviene marcar, porque cambia quién bajó el
              precio: al 4 de agosto,{' '}
              <strong>
                la página oficial de Chevrolet Uruguay seguía publicando USD
                33.990
              </strong>
              , con la leyenda de precio válido del 1 al 31 de agosto. Los
              31.990 aparecen en los avisos de concesionaria. Puede ser que la
              web esté desactualizada, o que sea una baja de mostrador que
              todavía no llegó a la lista de marca. Con lo que hay, no podemos
              distinguir entre las dos. Nosotros fichamos el precio que el
              comprador consigue hoy, pero si vas a negociar, andá sabiendo que
              el número oficial publicado es el otro.
            </p>
            <div style={S.pull}>
              Eso no es un ajuste general de lista. Es cirugía sobre la parte
              baja de la gama, que es justo donde el mercado se está
              apretando.
            </div>
          </section>

          {/* El pelotón */}
          <section style={S.section}>
            <h2 style={S.h2}>El pelotón de los 31.990</h2>
            <p style={S.p}>
              Con esta baja, la Captiva EV no aterriza en un lugar vacío. Cae
              exactamente encima de otros cuatro modelos que ya estaban en ese
              número.
            </p>
            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Modelo</th>
                    <th style={S.th}>Batería</th>
                    <th style={S.th}>Autonomía de fábrica</th>
                    <th style={S.th}>Medida acá</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={S.td}>GAC Aion V Max</td>
                    <td style={{ ...S.td, ...S.tdMono, color: C.faint }}>—</td>
                    <td style={{ ...S.td, ...S.tdMono }}>510 km WLTP</td>
                    <td style={{ ...S.td, ...S.tdMono, color: C.faint }}>sin medir</td>
                  </tr>
                  <tr>
                    <td style={S.td}>Omoda E5 Luxury</td>
                    <td style={{ ...S.td, ...S.tdMono }}>59 kWh</td>
                    <td style={{ ...S.td, ...S.tdMono }}>450 km WLTP</td>
                    <td style={{ ...S.td, ...S.tdMono, color: C.faint }}>sin medir</td>
                  </tr>
                  <tr>
                    <td style={S.td}>BYD Yuan Plus</td>
                    <td style={{ ...S.td, ...S.tdMono }}>60,5 kWh</td>
                    <td style={{ ...S.td, ...S.tdMono }}>430 km WLTP</td>
                    <td style={{ ...S.td, ...S.tdMono, color: C.real }}>371 km · 9 med.</td>
                  </tr>
                  <tr>
                    <td style={S.td}>Jaecoo 5 EV Luxury</td>
                    <td style={{ ...S.td, ...S.tdMono, color: C.faint }}>—</td>
                    <td style={{ ...S.td, ...S.tdMono }}>400 km WLTP</td>
                    <td style={{ ...S.td, ...S.tdMono, color: C.faint }}>sin medir</td>
                  </tr>
                  <tr>
                    <td style={S.td}>Chevrolet Captiva EV</td>
                    <td style={{ ...S.td, ...S.tdMono }}>60 kWh</td>
                    <td style={{ ...S.td, ...S.tdMono, color: C.lab }}>318 km WLTP</td>
                    <td style={{ ...S.td, ...S.tdMono, color: C.faint }}>sin medir</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={S.caption}>
              Los cinco cuestan exactamente USD 31.990. Entre el primero y el
              último de la tabla hay 192 km de diferencia.
            </p>

            <h3 style={S.h3}>El folleto de la Captiva dice 415 km, no 318</h3>
            <p style={S.p}>
              Y los dos números son ciertos. Chevrolet comunica{' '}
              <strong>415 km en ciclo NEDC</strong>. En ciclo WLTP, el mismo
              auto declara <strong>318 km</strong>. Noventa y siete kilómetros
              de diferencia, sin tocar el auto — solo cambiando el protocolo
              con el que se mide.
            </p>
            <p style={S.p}>
              Los dos números están en la web de Chevrolet Uruguay, pero no con
              el mismo volumen. Los 415 aparecen en el encabezado, en la
              sección de rendimiento y en la descripción del modelo. Los 318
              están una sola vez, en una nota al pie debajo de una foto.
            </p>
            <p style={S.p}>
              El NEDC es un ciclo de laboratorio viejo y benévolo, reemplazado
              en Europa justamente por optimista. Nadie miente publicando un
              NEDC: se elige, entre dos cifras igual de homologadas, cuál va en
              el titular y cuál en el asterisco. Y no es un detalle técnico
              menor. En esta tabla decide si la Captiva es cuarta o última.
            </p>
            <div style={S.pull}>
              Con el número que aparece en la publicidad, la Captiva queda a
              mitad de tabla. Con el que se puede comparar contra el resto,
              queda 82 km por debajo del anteúltimo.
            </div>
            <p style={S.p}>
              Por eso en la tabla de arriba pusimos 318 y no 415. Es el único
              número que se puede leer en la misma columna que los otros
              cuatro.
            </p>

            <h3 style={S.h3}>Y la única autonomía real de la tabla</h3>
            <p style={S.p}>
              De los cinco, el Yuan Plus es el único con autonomía medida en
              Uruguay: 371 km contra 430 declarados, un 14% menos, con nueve
              mediciones de usuarios. Nadie midió los otros cuatro. El número
              de fábrica sale de un laboratorio; el que importa sale de la ruta
              a Punta del Este.
            </p>
            <div style={S.ctaRow}>
              <a
                href="/comparar?ids=chevrolet-captiva-ev-2026,omoda-e5-luxury-2026,byd-yuan-plus-2026,gac-aion-v-max-2026"
                style={S.ctaBtn}
              >
                Comparar el pelotón de los 31.990
              </a>
            </div>
          </section>

          {/* La cuenta completa */}
          <section style={S.section}>
            <h2 style={S.h2}>No son dos bajas sueltas</h2>
            <p style={S.p}>
              Tesla abrió venta oficial el viernes 17 de julio, con Model 3 y
              Model Y desde USD 32.990 y unas 200 unidades señadas el primer
              día. Desde entonces:
            </p>
            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Marca</th>
                    <th style={S.th}>Versiones</th>
                    <th style={S.th}>Rango de la baja</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={S.td}>BYD · 22 de julio</td>
                    <td style={{ ...S.td, ...S.tdMono }}>6</td>
                    <td style={{ ...S.td, ...S.tdMono }}>USD 1.000 a 5.000</td>
                  </tr>
                  <tr>
                    <td style={S.td}>Omoda · 3 de agosto</td>
                    <td style={{ ...S.td, ...S.tdMono }}>2</td>
                    <td style={{ ...S.td, ...S.tdMono }}>USD 1.000</td>
                  </tr>
                  <tr>
                    <td style={S.td}>Chevrolet · 3 de agosto</td>
                    <td style={{ ...S.td, ...S.tdMono }}>1</td>
                    <td style={{ ...S.td, ...S.tdMono }}>USD 2.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={S.caption}>
              Las seis de BYD son Seagull GL, Seagull GS, Seagull Surf, Yuan
              Pro EV GSX, Yuan Plus Luxury y Song Plus EV, según la lista que
              la marca llamó —sin ironía— &quot;Modelo 2027&quot;.
            </p>
            <p style={S.p}>
              Nueve versiones, tres marcas, dieciocho días. Todas hacia abajo,
              ninguna hacia arriba, y todas concentradas entre los USD 18.990 y
              los 41.990 — el rango donde Tesla puso sus dos modelos de
              entrada.
            </p>
            <p style={S.p}>
              El fenómeno no es solo uruguayo: en Colombia la llegada de Tesla
              disparó rebajas en más de treinta modelos eléctricos e híbridos
              durante 2026. La industria regional ya le puso nombre.
            </p>
            <p style={S.p}>
              Desde ACAU, su gerente Ignacio Paz evitó opinar sobre estrategias
              comerciales de marcas puntuales, aunque reconoció que mayor
              competencia puede mover los precios y acelerar el mercado. Es la
              respuesta prudente, y es la correcta: nadie de adentro va a decir
              que bajó por Tesla.
            </p>
          </section>

          {/* El IMESI — el aporte propio */}
          <section style={{ ...S.section, ...S.highlightSection }}>
            <div style={S.eyebrowSmall}>Lo que casi no se está contando</div>
            <h2 style={S.h2}>La otra mitad de la historia tiene fecha</h2>
            <p style={S.p}>
              El 30 de junio el Poder Ejecutivo firmó un decreto que{' '}
              <strong>termina con la exoneración total de IMESI para los
              autos eléctricos</strong>. Rige desde el 1º de enero de 2027 y
              funciona por franjas, según el valor de importación del vehículo.
            </p>
            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Valor de importación (CIF)</th>
                    <th style={S.th}>IMESI desde 2027</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={S.td}>Hasta USD 19.000</td>
                    <td style={{ ...S.td, ...S.tdMono, color: C.real }}>0% — mantiene la exoneración</td>
                  </tr>
                  <tr>
                    <td style={S.td}>USD 19.001 a 27.000</td>
                    <td style={{ ...S.td, ...S.tdMono, color: C.lab }}>5%</td>
                  </tr>
                  <tr>
                    <td style={S.td}>Más de USD 27.001</td>
                    <td style={{ ...S.td, ...S.tdMono, color: C.lab }}>9%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={S.caption}>
              Firmado por el presidente Yamandú Orsi con los ministros Gabriel
              Oddone (Economía) y Fernanda Cardona (Industria). Alcanza a la
              &quot;Categoría F&quot; —transporte de pasajeros— y deja afuera a
              los utilitarios.
            </p>
            <p style={S.p}>
              Ojo con un punto que se confunde seguido:{' '}
              <strong>el impuesto se calcula sobre el valor de importación, no
              sobre el precio de vidriera</strong>. Un auto que se vende a USD
              31.990 en el salón tiene un CIF bastante más bajo, porque en el
              precio final ya están el IVA, el flete, el margen del importador
              y el del concesionario. Los valores CIF no se publican, así que
              nadie puede decirte hoy con precisión cuánto va a subir cada
              modelo en enero. Lo que sí se puede decir es la dirección: para
              arriba.
            </p>
            <p style={S.p}>
              Y eso explica el resto del cuadro. Un importador que baja el
              precio en agosto no está reduciendo el impuesto que va a pagar en
              2027 — ese se calcula en aduana, no en la vidriera. Lo que está
              haciendo es mover stock antes de que se cierre la ventana. Con el
              puerto de Montevideo saturado de eléctricos y cinco meses por
              delante, liquidar hoy a precio agresivo es mejor negocio que
              quedarse con la unidad del otro lado del 31 de diciembre.
            </p>
            <div style={S.statsGrid}>
              <div style={S.statCard}>
                <div style={S.statNum}>9</div>
                <div style={S.statLabel}>versiones bajaron de precio en 18 días</div>
              </div>
              <div style={S.statCard}>
                <div style={S.statNum}>31 dic</div>
                <div style={S.statLabel}>último día del régimen sin IMESI</div>
              </div>
            </div>
          </section>

          {/* Lo práctico */}
          <section style={S.section}>
            <h2 style={S.h2}>Qué significa esto si estás comprando</h2>

            <h3 style={S.h3}>Hay una ventana de cinco meses</h3>
            <p style={S.p}>
              Todo lo que compres y empadrones antes del 31 de diciembre de
              2026 entra bajo el régimen actual. Desde el 1º de enero, los
              modelos que superen el umbral de importación pasan a tributar.
              Las consultoras del sector ya anticipan un aluvión de compras
              adelantadas antes de fin de año.
            </p>

            <h3 style={S.h3}>Es probable que sigan bajando, pero no infinitamente</h3>
            <p style={S.p}>
              Nueve versiones en dieciocho días es un mercado en movimiento, no
              un mercado que terminó de acomodarse. Si podés esperar dos o tres
              semanas, esperá. Si lo que te gusta ya bajó y hay stock, tampoco
              tiene sentido jugar a adivinar el piso.
            </p>

            <h3 style={S.h3}>Compará garantías, no solo precios</h3>
            <p style={S.p}>
              En el pelotón de los 31.990, Omoda ofrece 5 años o 150.000 km de
              vehículo y 8 años o 150.000 km de batería. Chevrolet, 3 años o
              100.000 km de vehículo y 8 años o 160.000 km de batería. En un
              auto que vas a tener seis o siete años, esa diferencia es plata
              real.
            </p>

            <h3 style={S.h3}>Preguntá siempre en qué ciclo está medida la autonomía</h3>
            <p style={S.p}>
              Si el vendedor te tira un número, preguntale si es WLTP o NEDC.
              En la Captiva la diferencia entre los dos es del 30%. Es la
              pregunta más barata que podés hacer y la que más te cambia la
              expectativa de lo que el auto rinde de verdad. Si te dicen que no
              saben, pedí la ficha de homologación.
            </p>

            <h3 style={S.h3}>La patente también baja</h3>
            <p style={S.p}>
              Los 2.000 dólares menos de la Captiva son unos USD 49 menos por
              año de patente (3% sobre el valor sin IVA). No define una compra,
              pero es plata que vuelve.
            </p>
          </section>

          <section style={{ ...S.section, ...S.noteSection }}>
            <div style={S.eyebrowSmall}>Lo que todavía no sabemos</div>
            <p style={S.noteText}>
              Si estas bajas son respuesta a Tesla, adelanto de stock antes del
              IMESI, o las dos cosas a la vez. Son explicaciones compatibles y
              ninguna excluye a la otra. Tampoco sabemos cuánto va a subir cada
              modelo en enero, porque los valores CIF no se publican. Lo que sí
              es un hecho verificable: en dieciocho días, nueve versiones de
              tres marcas bajaron de precio, y hoy hay cinco eléctricos por
              debajo del Tesla Model 3 más barato — cuatro de ellos con 400 km
              WLTP o más. Hace tres semanas no había ninguno.
            </p>
          </section>

          <div style={S.ctaRow}>
            <a href="/modelos" style={S.ctaBtn}>Ver los eléctricos disponibles</a>
            <a href="/noticias" style={S.ctaBtnGhost}>Más noticias</a>
          </div>

          <footer style={S.sources}>
            <div style={S.sourcesTitle}>Fuentes</div>
            <ul style={S.sourcesList}>
              <li>Autoblog Uruguay — lanzamiento Omoda E5 restyling (03/06/2026): versiones, baterías, WLTP y NEDC, precios de lista</li>
              <li>Chevrolet Uruguay — página oficial de la Captiva EV, consultada el 04/08/2026: las dos autonomías (415 NEDC y 318 WLTP), ficha técnica y precio de lista vigente en agosto</li>
              <li>Autoblog Uruguay — lanzamiento Chevrolet Captiva EV (10/10/2025): ficha técnica, precio y garantías de lanzamiento</li>
              <li>Autoblog Uruguay — decreto de IMESI a eléctricos (01/07/2026): franjas y fecha de vigencia</li>
              <li>LARED21 — lista BYD &quot;Modelo 2027&quot; completa, seis versiones (22/07/2026)</li>
              <li>Ámbito — declaraciones de ACAU sobre la competencia de precios (23/07/2026)</li>
              <li>Mauricio Plastina y Gabriel Lander — reporte de los ajustes de Chevrolet y Omoda (03/08/2026)</li>
              <li>Silca, concesionario oficial Chevrolet — ficha y garantías de la Captiva EV</li>
              <li>Precios anteriores y autonomías reales medidas: base de autoelectrico.uy</li>
            </ul>
            <p style={S.disclaimer}>
              Los precios varían por versión, color y promoción vigente, y en
              este mercado se mueven semana a semana. Confirmá siempre con el
              importador antes de decidir una compra. Este artículo describe
              una coincidencia temporal entre varios ajustes de precio y un
              cambio impositivo; no afirma una relación de causa que no
              podemos verificar.
            </p>
          </footer>
        </div>
      </article>
      </main>
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
    fontSize: 11,
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
  noteSection: {
    background: C.surface,
    border: `1px solid ${C.line}`,
    borderRadius: 8,
    padding: '20px 22px',
    marginTop: 28,
    borderTop: `1px solid ${C.line}`,
  },
  noteText: { fontSize: 14, color: C.dim, lineHeight: 1.65, margin: 0 },
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
  pull: {
    borderLeft: `3px solid ${C.real}`,
    background: 'rgba(61,220,151,0.06)',
    padding: '14px 18px',
    borderRadius: '0 6px 6px 0',
    fontSize: 14.5,
    color: C.text,
    margin: '18px 0',
    lineHeight: 1.6,
  },
  tableWrap: { overflowX: 'auto', marginBottom: 10 },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 420 },
  th: {
    textAlign: 'left',
    fontFamily: mono,
    fontSize: 11,
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
    marginTop: 18,
  },
  statCard: {
    padding: '18px 16px',
    background: C.bg,
    border: `1px solid ${C.line}`,
    borderRadius: 8,
    textAlign: 'center',
  },
  statNum: {
    fontFamily: mono,
    fontSize: 26,
    fontWeight: 600,
    color: C.real,
    letterSpacing: '-0.01em',
  },
  statLabel: { fontSize: 11.5, color: C.dim, marginTop: 6, lineHeight: 1.4 },
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
