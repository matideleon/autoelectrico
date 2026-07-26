'use client';

import React from 'react';
import { ARTICLES } from '@/lib/articles';

/* ============================================================
   NewsFeed — la portada del sitio.

   La lista de artículos vive en /lib/articles.js — este
   componente y /app/noticias/page.tsx importan de ahí, así no
   hay dos listas que se puedan desincronizar.
   ============================================================ */

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

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('es-UY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function ArticleCard({ article, featured }) {
  return (
    <a href={`/blog/${article.slug}`} className="news-card" style={{ ...S.card, ...(featured ? S.cardFeatured : {}) }}>
      <div style={S.cardCategory}>{article.category}</div>
      <h2 style={{ ...S.cardTitle, fontSize: featured ? 26 : 18 }}>{article.title}</h2>
      <p style={S.cardDek}>{article.dek}</p>
      <div style={S.cardFoot}>
        <span style={S.cardDate}>{formatDate(article.date)}</span>
        <span style={S.cardRead}>Leer →</span>
      </div>
    </a>
  );
}

export default function NewsFeed() {
  const [featured, ...rest] = ARTICLES;

  return (
    <section style={S.root} aria-labelledby="news-title">
      <style>{CSS}</style>
      <div style={S.wrap}>
        <div style={S.eyebrow}>autoelectrico.uy</div>
        <h1 id="news-title" style={S.h1}>
          Autos eléctricos en Uruguay,
          <br />
          <span style={S.h1Accent}>con datos reales.</span>
        </h1>

        <div style={S.grid}>
          {featured && <ArticleCard article={featured} featured />}
          {rest.length > 0 && (
            <div style={S.restGrid}>
              {rest.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          )}
        </div>

        <a href="/noticias" style={S.viewAllLink}>Ver todas las noticias →</a>
      </div>
    </section>
  );
}

const S = {
  root: {
    background: C.bg,
    padding: '32px 20px 20px',
    fontFamily: sans,
    color: C.text,
  },
  wrap: { maxWidth: 860, margin: '0 auto' },
  eyebrow: {
    fontFamily: mono,
    fontSize: 11,
    color: C.dim,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    marginBottom: 14,
  },
  h1: {
    fontSize: 'clamp(26px, 5.5vw, 38px)',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    lineHeight: 1.15,
    margin: '0 0 32px',
  },
  h1Accent: { color: C.real },
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
    fontSize: 10,
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
    fontFamily: mono,
    fontSize: 11,
  },
  cardDate: { color: C.faint },
  cardRead: { color: C.real },
  viewAllLink: {
    display: 'inline-block',
    marginTop: 20,
    fontFamily: mono,
    fontSize: 12.5,
    color: C.real,
    textDecoration: 'none',
  },
};

const CSS = `
.news-card:hover { border-color: ${C.real} !important; transform: translateY(-2px); }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
`;
