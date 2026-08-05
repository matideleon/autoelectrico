// ============================================================
// autoelectrico.uy — /noticias — Listado completo de artículos
//
// Empata con NewsFeed (la portada), que muestra el mismo
// contenido: misma tarjeta, misma jerarquía, mismo formato de
// fecha. Antes eran dos lenguajes visuales distintos para los
// mismos artículos — filas planas acá, tarjetas en la home.
//
// Tokens de marca: lib/theme.js. La paleta local que tenía esta
// página se había apartado del resto del sitio y dos de sus
// colores no pasaban WCAG AA.
//
// Fuente única de datos: lib/articles.js
// Orden: más reciente primero.
// ============================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import { ARTICLES } from '@/lib/articles';
import { C, mono, sans, formatArticleDate } from '@/lib/theme';
import Nav from '@/components/Nav';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autoelectrico.uy';

export const metadata: Metadata = {
  title: 'Noticias',
  description: 'Artículos, análisis y resúmenes sobre autos eléctricos en Uruguay y el mundo.',
  alternates: { canonical: `${SITE}/noticias` },
  openGraph: {
    title: 'Noticias | autoelectrico.uy',
    description: 'Artículos, análisis y resúmenes sobre autos eléctricos en Uruguay y el mundo.',
    url: `${SITE}/noticias`,
    type: 'website',
    locale: 'es_UY',
  },
};

// El listado completo es una colección: dárselo tipado a Google
// permite que muestre el archivo como tal y no como página suelta.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Noticias — autoelectrico.uy',
  description: 'Artículos, análisis y resúmenes sobre autos eléctricos en Uruguay y el mundo.',
  url: `${SITE}/noticias`,
  hasPart: ARTICLES.map((a: { slug: string; title: string; dek: string; date: string }) => ({
    '@type': 'NewsArticle',
    headline: a.title,
    description: a.dek,
    datePublished: a.date,
    url: `${SITE}/blog/${a.slug}`,
  })),
};

export default function NoticiasPage() {
  const [featured, ...rest] = ARTICLES;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={S.root}>
        <Nav />
        <main id="contenido" className="page-main" style={S.main}>
          <style>{CSS}</style>

          <header style={S.header}>
            <div style={S.eyebrow}>Noticias</div>
            <h1 style={S.h1}>
              Lo que pasa con los eléctricos,
              <br />
              <span style={S.h1Accent}>contado con los números.</span>
            </h1>
            <p style={S.lede}>
              Lanzamientos, movimientos de precio y análisis de mercado en
              Uruguay y el mundo. Cada cifra citada tiene su fuente al pie.
            </p>
            <div style={S.count}>
              {ARTICLES.length} {ARTICLES.length === 1 ? 'artículo' : 'artículos'}
            </div>
          </header>

          {/* La más reciente arriba y a lo ancho: es la que la mayoría
              viene a leer, y repite el patrón de la portada. */}
          <div style={S.grid}>
            {featured && <ArticleCard article={featured} featured />}
            {rest.length > 0 && (
              <div style={S.restGrid}>
                {rest.map((a: Article) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

interface Article {
  slug: string;
  category: string;
  title: string;
  dek: string;
  date: string;
}

function ArticleCard({ article, featured }: { article: Article; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="news-card"
      style={{ ...S.card, ...(featured ? S.cardFeatured : {}) }}
    >
      <div style={S.cardCategory}>{article.category}</div>
      <h2 style={{ ...S.cardTitle, fontSize: featured ? 26 : 18 }}>{article.title}</h2>
      <p style={S.cardDek}>{article.dek}</p>
      <div style={S.cardFoot}>
        <span style={S.cardDate}>
          <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
        </span>
        <span style={S.cardRead} data-read>
          Leer →
        </span>
      </div>
    </Link>
  );
}

const S: Record<string, React.CSSProperties> = {
  root: { minHeight: '100vh', background: C.bg, color: C.text, fontFamily: sans },
  main: { maxWidth: 860, margin: '0 auto', padding: '40px 20px 80px' },

  header: { marginBottom: 32 },
  eyebrow: {
    fontFamily: mono,
    fontSize: 11,
    color: C.dim,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    margin: '0 0 14px',
  },
  h1: {
    fontSize: 'clamp(26px, 5.5vw, 38px)',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    lineHeight: 1.15,
    margin: '0 0 16px',
  },
  h1Accent: { color: C.real },
  lede: {
    fontSize: 15,
    color: C.dim,
    lineHeight: 1.65,
    margin: '0 0 16px',
    maxWidth: '58ch',
  },
  count: {
    fontFamily: mono,
    fontSize: 11,
    color: C.faint,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    paddingTop: 14,
    borderTop: `1px solid ${C.line}`,
  },

  grid: { display: 'flex', flexDirection: 'column', gap: 14 },
  restGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 14,
  },
  card: {
    display: 'block',
    background: C.surface,
    border: `1px solid ${C.line}`,
    borderRadius: 6,
    padding: '20px 22px',
    textDecoration: 'none',
    color: C.text,
    transition: 'border-color 150ms ease, transform 150ms ease',
  },
  cardFeatured: {
    padding: '28px 26px',
    background: `linear-gradient(135deg, ${C.surface} 0%, #20242b 100%)`,
  },
  cardCategory: {
    fontFamily: mono,
    fontSize: 11,
    color: C.lab,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 10,
  },
  cardTitle: {
    fontWeight: 600,
    letterSpacing: '-0.01em',
    lineHeight: 1.25,
    margin: '0 0 10px',
  },
  cardDek: {
    fontSize: 14,
    color: C.dim,
    lineHeight: 1.6,
    margin: '0 0 16px',
  },
  cardFoot: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    minHeight: 32,
    fontFamily: mono,
    fontSize: 12,
  },
  cardDate: { color: C.faint },
  cardRead: {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: 30,
    padding: '6px 12px',
    color: C.real,
    border: '1px solid rgba(61,220,151,0.35)',
    borderRadius: 4,
    whiteSpace: 'nowrap',
  },
};

const CSS = `
.news-card:hover { border-color: ${C.real} !important; transform: translateY(-2px); }
.news-card:hover [data-read] { background: rgba(61,220,151,0.10); }
.news-card:focus-visible { outline: 2px solid ${C.real}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
`;
