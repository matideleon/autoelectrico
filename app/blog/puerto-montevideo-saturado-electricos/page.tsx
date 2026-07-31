// ============================================================
// autoelectrico.uy — /blog/puerto-montevideo-saturado-electricos
//
// La saturación del puerto por la llegada masiva de eléctricos
// chinos. Ángulo propio: qué significa para el mercado local, y
// el dato que reencuadra todo (la mayoría van a Paraguay, no se
// quedan acá).
//
// Copyright: todo parafraseado. Dos citas cortas (bajo 15
// palabras) de fuentes distintas, con atribución.
//
// Fuentes: Subrayado (declaraciones de Ageitos, Centro de
// Navegación), Teledoce (declaraciones de Genta, ANP),
// Prensa Latina (contexto hidrovía), Motorsports (cifras de
// mercado 2025 y primer semestre 2026).
// ============================================================

import type { Metadata } from 'next';
import Nav from '@/components/Nav';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autoelectrico.uy';

export const metadata: Metadata = {
  title: 'El puerto de Montevideo se saturó de autos eléctricos',
  description:
    'Hubo autos estacionados debajo de un viaducto por falta de espacio. La ANP acondiciona dos hectáreas ganadas al mar para 2.000 vehículos más. Qué hay detrás del cuello de botella.',
  alternates: { canonical: `${SITE}/blog/puerto-montevideo-saturado-electricos` },
  openGraph: {
    title: 'El puerto de Montevideo se saturó de autos eléctricos',
    description:
      'El boom de los eléctricos llegó a un límite físico: el puerto no tiene dónde ponerlos. Y la mayoría ni siquiera se quedan en Uruguay.',
    url: `${SITE}/blog/puerto-montevideo-saturado-electricos`,
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
  headline: 'El puerto de Montevideo se saturó de autos eléctricos',
  description:
    'La llegada masiva de vehículos eléctricos desde China saturó los espacios del puerto de Montevideo. Qué lo causó y qué se está haciendo.',
  datePublished: '2026-07-26',
  dateModified: '2026-07-26',
  author: { '@type': 'Organization', name: 'autoelectrico.uy' },
  publisher: { '@type': 'Organization', name: 'autoelectrico.uy' },
  mainEntityOfPage: `${SITE}/blog/puerto-montevideo-saturado-electricos`,
};

export default function PuertoArticle() {
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
            <div style={S.eyebrow}>Noticias · Uruguay</div>
            <h1 style={S.h1}>
              El puerto de Montevideo se saturó de autos eléctricos
            </h1>
            <p style={S.dek}>
              Hubo vehículos estacionados debajo de un viaducto porque no
              había dónde ponerlos. El boom de los eléctricos chocó con un
              límite que no es fiscal ni comercial: es de metros cuadrados.
            </p>
            <div style={S.meta}>26 de julio de 2026 · 4 min de lectura</div>
          </header>

          <section style={S.section}>
            <h2 style={S.h2}>Autos abajo del viaducto</h2>
            <p style={S.p}>
              La imagen resume el problema mejor que cualquier cifra: días
              atrás, por falta de lugar, hubo autos eléctricos estacionados
              debajo del viaducto del puerto. No es una postal habitual de
              una terminal que se supone tiene todo asignado y permisado.
            </p>
            <p style={S.p}>
              Mónica Ageitos, presidenta del Centro de Navegación —la cámara
              empresarial de la actividad marítimo-portuaria— lo dijo sin
              vueltas ante la prensa:{' '}
              <em>"La operativa de autos se ha saturado"</em>. Los espacios
              habilitados quedaron sobrepasados, y la propia cámara pidió una
              solución que no sea un parche.
            </p>
          </section>

          <section style={S.section}>
            <h2 style={S.h2}>Dos causas que se sumaron al mismo tiempo</h2>
            <p style={S.p}>
              No fue una sola cosa. Por un lado, julio trajo un volumen de
              autos en tránsito más alto de lo normal. Por el otro, la
              Administración Nacional de Puertos (ANP) había reasignado a
              otros usos algunos espacios que antes se destinaban justamente
              a vehículos importados.
            </p>
            <div style={S.pull}>
              Cuando el flujo sube y el espacio disponible baja al mismo
              tiempo, el resultado es predecible. Lo llamativo es la
              velocidad con que pasó.
            </div>
          </section>

          <section style={S.section}>
            <h2 style={S.h2}>El dato que reencuadra todo: no se quedan acá</h2>
            <p style={S.p}>
              Acá viene lo que cambia la lectura de la noticia. Buena parte
              de esos autos <strong>no vienen a venderse en Uruguay</strong>.
              Están en tránsito hacia Paraguay, que al no tener costa
              marítima se abastece por la hidrovía Paraná-Paraguay, que
              desemboca en el Río de la Plata.
            </p>
            <p style={S.p}>
              El presidente de la ANP, Pablo Genta, describió la mezcla: hay
              vehículos con destino al mercado interno, otros que llegan para
              ensamblaje, y <em>"una buena parte que van en tránsito a
              Paraguay"</em>.
            </p>
            <p style={S.p}>
              O sea: el puerto de Montevideo no está congestionado solo por
              el apetito uruguayo de eléctricos. Está funcionando como puerta
              de entrada regional, y eso multiplica el volumen que tiene que
              procesar.
            </p>
          </section>

          <section style={S.section}>
            <h2 style={S.h2}>La respuesta: dos hectáreas ganadas al mar</h2>
            <p style={S.p}>
              La ANP ya está acondicionando un área de unas dos hectáreas en
              la zona norte, sobre terrenos ganados al mar, que hay que
              nivelar. Según Genta, ahí entrarían unos{' '}
              <strong>2.000 autos</strong>. Además hay conversaciones abiertas
              con la terminal especializada para encontrar algo más
              permanente.
            </p>
            <div style={S.statsGrid}>
              <div style={S.statCard}>
                <div style={S.statNum}>2 ha</div>
                <div style={S.statLabel}>en acondicionamiento, zona norte</div>
              </div>
              <div style={S.statCard}>
                <div style={S.statNum}>2.000</div>
                <div style={S.statLabel}>autos que entrarían ahí</div>
              </div>
            </div>
          </section>

          <section style={S.section}>
            <h2 style={S.h2}>El contexto de mercado que explica el volumen</h2>
            <p style={S.p}>
              Los números del mercado uruguayo ayudan a dimensionar por qué
              esto está pasando ahora y no hace dos años. En 2025, sobre un
              mercado total de casi 70.000 unidades, los eléctricos se
              llevaron cerca del 21% —unas 14.000 entregas— y los híbridos
              otro 9%.
            </p>
            <p style={S.p}>
              En el primer semestre de 2026 ya se comercializaron 12.500
              eléctricos puros y 5.000 híbridos. A ese ritmo, el año va
              camino a otro récord, y eso sin contar el volumen que solo pasa
              por acá rumbo a Paraguay.
            </p>
          </section>

          <section style={{ ...S.section, ...S.noteSection }}>
            <div style={S.eyebrowSmall}>Lo que no sabemos todavía</div>
            <p style={S.noteText}>
              Ninguna de las fuentes consultadas confirma que esto se traduzca
              en demoras de entrega para quien ya compró un auto en Uruguay.
              Puede pasar, o puede resolverse sin que el comprador lo note —
              no vamos a afirmar algo que todavía no está reportado. Si
              tenés una entrega pendiente y notás retrasos, escribinos y lo
              seguimos.
            </p>
          </section>

          <div style={S.ctaRow}>
            <a href="/modelos" style={S.ctaBtn}>Ver los eléctricos disponibles</a>
            <a href="/noticias" style={S.ctaBtnGhost}>Más noticias</a>
          </div>

          <footer style={S.sources}>
            <div style={S.sourcesTitle}>Fuentes</div>
            <ul style={S.sourcesList}>
              <li>Subrayado — declaraciones de Mónica Ageitos, Centro de Navegación</li>
              <li>Teledoce — declaraciones de Pablo Genta, presidente de la ANP</li>
              <li>Prensa Latina — contexto de la hidrovía y el tránsito a Paraguay</li>
              <li>Motorsports Uruguay — cifras del mercado 2025 y primer semestre 2026</li>
            </ul>
            <p style={S.disclaimer}>
              Las cifras de mercado son de terceros, no de mediciones propias
              de autoelectrico.uy.
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
  eyebrowSmall: { fontFamily: mono, fontSize: 10, color: C.lab, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 },
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
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 18 },
  statCard: { padding: '18px 16px', background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, textAlign: 'center' },
  statNum: { fontFamily: mono, fontSize: 26, fontWeight: 600, color: C.real, letterSpacing: '-0.01em' },
  statLabel: { fontSize: 11.5, color: C.dim, marginTop: 6, lineHeight: 1.4 },
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
