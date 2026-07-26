// ============================================================
// autoelectrico.uy — /noticias
//
// Listado completo de artículos publicados. Usa la misma
// fuente de datos que NewsFeed.jsx (portada) — /lib/articles.js
// — para que nunca queden desincronizados.
// ============================================================

import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import { ARTICLES } from '@/lib/articles';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autoelectrico.uy';

export const metadata: Metadata = {
  title: 'Noticias',
  description: 'Todos los artículos publicados en autoelectrico.uy sobre movilidad eléctrica en Uruguay y el mundo.',
  alternates: { canonical: `${SITE}/noticias` },
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-UY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function NoticiasPage() {
  return (
    <>
      <Nav />
      <main style={S.root}>
        <div style={S.wrap}>
          <header style={S.header}>
            <div style={S.eyebrow}>Noticias</div>
            <h1 style={S.h1}>Todo lo que publicamos</h1>
            <p style={S.dek}>
              Análisis, novedades del mercado y del mundo — {ARTICLES.length} artículos por ahora.
            </p>
          </header>

          <div style={S.list}>
            {ARTICLES.map((a) => (
              <a key={a.slug} href={`/blog/${a.slug}`} className="noticia-card" style={S.card}>
                <div style={S.cardCategory}>{a.category}</div>
                <h2 style={S.cardTitle}>{a.title}</h2>
                <p style={S.cardDek}>{a.dek}</p>
                <div style={S.cardFoot}>
                  <span style={S.cardDate}>{formatDate(a.date)}</span>
                  <span style={S.cardRead}>Leer →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>
      <style dangerouslySetInnerHTML={{ __html: `
        .noticia-card:hover { border-color: ${C.real} !important; transform: translateY(-2px); }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
      ` }} />
    </>
  );
}

const S: Record<string, React.CSSProperties> = {
  root: { background: C.bg, minHeight: '100vh', color: C.text, fontFamily: sans, padding: '20px 20px 80px' },
  wrap: { maxWidth: 760, margin: '0 auto' },
  header: { marginBottom: 32, paddingTop: 20 },
  eyebrow: { fontFamily: mono, fontSize: 11, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 },
  h1: { fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 0 12px' },
  dek: { fontSize: 15, color: C.dim, lineHeight: 1.6, margin: 0 },
  list: { display: 'flex', flexDirection: 'column', gap: 14 },
  card: {
    display: 'block', background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8,
    padding: '22px 24px', textDecoration: 'none', color: C.text,
    transition: 'border-color 150ms ease, transform 150ms ease',
  },
  cardCategory: { fontFamily: mono, fontSize: 10, color: C.lab, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 },
  cardTitle: { fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.3, margin: '0 0 10px' },
  cardDek: { fontSize: 14, color: C.dim, lineHeight: 1.6, margin: '0 0 16px' },
  cardFoot: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: mono, fontSize: 11 },
  cardDate: { color: C.faint },
  cardRead: { color: C.real },
};
