'use client';

import React, { useState } from 'react';

/* ============================================================
   autoelectrico.uy — Navegación

   Header fijo, mínimo. Tres destinos: modelos, comparador, home.
   ============================================================ */

const C = {
  bg: '#141619',
  surface: '#1B1E23',
  line: '#2A2E35',
  text: '#E6E8EB',
  dim: '#8A9099',
  real: '#3DDC97',
};

const mono = "'IBM Plex Mono', ui-monospace, Menlo, monospace";

export default function Nav() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/modelos', label: 'Modelos' },
    { href: '/comparar', label: 'Comparar' },
    { href: '/ahorro', label: 'Ahorro' },
  ];

  return (
    <>
      <style>{`
        .nav-link { transition: color 140ms ease; }
        .nav-link:hover { color: ${C.bg} !important; background: ${C.real} !important; border-color: ${C.real} !important; }
        .nav-burger { display: none; }
        @media (max-width: 560px) {
          .nav-links-desktop { display: none !important; }
          .nav-burger { display: block !important; }
        }
      `}</style>

      <nav style={S.nav}>
        <a href="/" style={S.logoLink}>
          <img
            src="/logo-icon.png"
            alt="autoelectrico.uy"
            style={S.logoImg}
            width={32}
            height={25}
          />
          <span style={S.logoText}>
            autoelectrico<span style={{ color: C.real }}>.uy</span>
          </span>
        </a>

        <div className="nav-links-desktop" style={S.links}>
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav-link" style={S.link}>
              {l.label}
            </a>
          ))}
        </div>

        <button
          className="nav-burger"
          style={S.burger}
          onClick={() => setOpen(!open)}
          aria-label="Menú"
          aria-expanded={open}
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>

      {open && (
        <div style={S.mobileMenu}>
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav-link" style={S.mobileLink}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

const S = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 20px',
    background: 'rgba(20,22,25,0.92)',
    backdropFilter: 'blur(8px)',
    borderBottom: `1px solid ${C.line}`,
    fontFamily: mono,
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    textDecoration: 'none',
  },
  logoImg: {
    display: 'block',
  },
  logoText: {
    fontSize: 14,
    fontWeight: 500,
    color: C.text,
    letterSpacing: '0.02em',
  },
  links: { display: 'flex', gap: 26, alignItems: 'center' },
  link: {
    fontSize: 13,
    fontWeight: 500,
    color: C.text,
    textDecoration: 'none',
    letterSpacing: '0.03em',
    padding: '6px 12px',
    borderRadius: 3,
    border: `1px solid ${C.line}`,
  },
  burger: {
    background: 'none',
    border: 'none',
    color: C.text,
    fontSize: 18,
    cursor: 'pointer',
    padding: '4px 8px',
  },
  mobileMenu: {
    position: 'sticky',
    top: 53,
    zIndex: 99,
    background: C.surface,
    borderBottom: `1px solid ${C.line}`,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: mono,
  },
  mobileLink: {
    padding: '14px 20px',
    fontSize: 13,
    color: C.dim,
    textDecoration: 'none',
    borderBottom: `1px solid ${C.line}`,
  },
};
