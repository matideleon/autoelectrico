// ============================================================
// autoelectrico.uy — /noticias — Listado completo de artículos
//
// Estilo empata con /comparar y /ahorro.
// Fuente única: lib/articles.js
// Orden: más reciente primero.
// ============================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import { ARTICLES } from '@/lib/articles';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'Noticias',
  description: 'Artículos, análisis y resúmenes sobre autos eléctricos en Uruguay y el mundo.',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autoelectrico.uy'}/noticias` },
  openGraph: {
    title: 'Noticias | autoelectrico.uy',
    description: 'Artículos, análisis y resúmenes sobre autos eléctricos en Uruguay y el mundo.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autoelectrico.uy'}/noticias`,
    type: 'website',
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
  gap: '#4A505A',
};
const mono = "'IBM Plex Mono', ui-monospace, Menlo, monospace";
const sans = "'IBM Plex Sans', -apple-system, sans-serif";

export default function NoticiasPage() {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: sans }}>
      <Nav />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 80px' }}>
        <header style={{ marginBottom: 32 }}>
          <p style={{
            fontFamily: mono,
            fontSize: 11,
            color: C.dim,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: 12,
            margin: '0 0 12px 0',
          }}>
            NOTICIAS
          </p>
          <h1 style={{
            fontSize: 'clamp(28px, 6vw, 40px)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            margin: '0 0 12px',
            lineHeight: 1.1,
          }}>
            Artículos
          </h1>
          <p style={{
            fontSize: 14,
            color: C.dim,
            lineHeight: 1.6,
            margin: 0,
            maxWidth: '56ch',
          }}>
            Lanzamientos, análisis de mercado y resúmenes semanales sobre movilidad eléctrica en Uruguay y el mundo.
          </p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {ARTICLES.map((a) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="noticia-link"
              style={{
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
                padding: '18px 16px',
                borderBottom: `1px solid ${C.line}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: mono, fontSize: 10.5, color: C.faint }}>
                  {a.date}
                </span>
                <span style={{
                  fontFamily: mono,
                  fontSize: 10,
                  color: C.lab,
                  border: `1px solid ${C.lab}`,
                  borderRadius: 3,
                  padding: '2px 6px',
                  letterSpacing: '0.04em',
                }}>
                  {a.category}
                </span>
              </div>
              <h2 style={{
                fontSize: 16,
                fontWeight: 600,
                margin: '0 0 6px',
                lineHeight: 1.3,
              }}>
                {a.title}
              </h2>
              <p style={{
                fontSize: 14,
                color: C.dim,
                lineHeight: 1.5,
                margin: 0,
              }}>
                {a.dek}
              </p>
            </Link>
          ))}
        </div>
      </main>
      <style>{`.noticia-link:hover { background: ${C.surface}; }`}</style>
    </div>
  );
}