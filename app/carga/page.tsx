// ============================================================
// autoelectrico.uy — /carga
//
// Índice simple: dos caminos, hogar y pública, cada uno en su
// propia página para que no se lea todo apilado en una sola.
// ============================================================

import type { Metadata } from 'next';
import Nav from '@/components/Nav';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autoelectrico.uy';

export const metadata: Metadata = {
  title: 'Cómo cargar tu auto eléctrico en Uruguay',
  description:
    'Guía de carga domiciliaria y carga pública para autos eléctricos en Uruguay: potencia, normativa UTE, diferencial, costos y tarifas.',
  alternates: { canonical: `${SITE}/carga` },
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

export default function CargaIndexPage() {
  return (
    <>
      <Nav />
      <main style={S.root}>
        <div style={S.wrap}>
          <header style={S.header}>
            <div style={S.eyebrow}>Guía · Carga</div>
            <h1 style={S.h1}>Cómo cargás tu eléctrico</h1>
            <p style={S.dek}>
              Hay dos mundos: cargar en casa, todas las noches, sin pensarlo
              — y cargar en la calle, cuando estás de viaje o no tenés
              garage. Elegí el que te sirve ahora.
            </p>
          </header>

          <div style={S.cardsGrid}>
            <a href="/carga/hogar" style={S.card} className="carga-card">
              <div style={S.cardEyebrow}>El 90% del tiempo</div>
              <div style={S.cardTitle}>Carga en casa</div>
              <p style={S.cardText}>
                Qué potencia necesitás, qué exige UTE, qué diferencial
                instalar, materiales y pasos del trabajo, y cuánto cuesta un
                wallbox en Uruguay.
              </p>
              <div style={S.cardCta}>Ver la guía →</div>
            </a>

            <a href="/carga/publica" style={S.card} className="carga-card">
              <div style={S.cardEyebrow}>Viajes y emergencias</div>
              <div style={S.cardTitle}>Carga pública</div>
              <p style={S.cardText}>
                Cómo funciona la red de UTE, la estructura real de precios,
                y un simulador para calcular cuánto te cuesta cargar según
                tu auto y cuánta batería necesitás.
              </p>
              <div style={S.cardCta}>Ver la guía →</div>
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

const S: Record<string, React.CSSProperties> = {
  root: { background: C.bg, minHeight: '100vh', color: C.text, fontFamily: sans, padding: '20px 20px 80px' },
  wrap: { maxWidth: 760, margin: '0 auto' },
  header: { marginBottom: 36, paddingTop: 20 },
  eyebrow: { fontFamily: mono, fontSize: 11, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 },
  h1: { fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 0 16px' },
  dek: { fontSize: 16, color: C.dim, lineHeight: 1.6, margin: 0, maxWidth: '62ch' },
  cardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 },
  card: {
    display: 'block', background: C.surface, border: `1px solid ${C.line}`,
    borderRadius: 8, padding: '26px 24px', textDecoration: 'none', color: C.text,
    transition: 'border-color 150ms ease, transform 150ms ease',
  },
  cardEyebrow: { fontFamily: mono, fontSize: 10.5, color: C.lab, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 },
  cardTitle: { fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 10 },
  cardText: { fontSize: 14, color: C.dim, lineHeight: 1.6, margin: '0 0 18px' },
  cardCta: { fontFamily: mono, fontSize: 12.5, color: C.real, fontWeight: 500 },
};
