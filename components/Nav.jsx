'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';

/* ============================================================
   autoelectrico.uy — Navegación

   Rediseño con ícono arriba de la etiqueta, en una barra tipo
   píldora — el ítem activo se resalta con fondo redondeado y
   color de acento, detectado con usePathname (no adivinado por
   estado local, así funciona bien con navegación directa por URL).

   Los íconos son SVG propios, trazo simple, sin depender de
   ninguna librería de íconos externa.
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

/* ---------- Íconos ---------- */

function IconHome({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H9v-5.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V20h2.5a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

function IconCar({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16v-3.2a2 2 0 0 1 .3-1.05l1.9-3.1A2 2 0 0 1 7.9 7.6h8.2a2 2 0 0 1 1.7 1.05l1.9 3.1a2 2 0 0 1 .3 1.05V16" />
      <path d="M3.5 16h17v2a1 1 0 0 1-1 1H16a1 1 0 0 1-1-1v-1H9v1a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1v-2Z" />
      <circle cx="7.5" cy="16" r="1.4" />
      <circle cx="16.5" cy="16" r="1.4" />
    </svg>
  );
}

function IconCompare({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="6" width="8" height="4.5" rx="2.25" />
      <circle cx="7.75" cy="8.25" r="1.1" fill={color} stroke="none" />
      <rect x="12.5" y="13.5" width="8" height="4.5" rx="2.25" />
      <circle cx="16.75" cy="15.75" r="1.1" fill={color} stroke="none" />
    </svg>
  );
}

function IconSavings({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5v9M14.5 9.7c0-1-1-1.7-2.5-1.7s-2.5.8-2.5 1.8c0 2.4 5 1.1 5 3.5 0 1-1 1.8-2.5 1.8s-2.5-.7-2.5-1.7" />
    </svg>
  );
}

function IconCharge({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 3 4.5 13.5H11L10 21l8.5-10.5H12L13 3Z" />
    </svg>
  );
}

function IconNews({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 5.5h12a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18V5.5Z" />
      <path d="M18 8.5h1a1 1 0 0 1 1 1V17a2 2 0 0 1-2 2" />
      <path d="M7 9h6M7 12.2h6M7 15.4h3.5" />
    </svg>
  );
}

const NAV_ITEMS = [
  { href: '/', label: 'Inicio', Icon: IconHome, exact: true },
  { href: '/noticias', label: 'Noticias', Icon: IconNews },
  { href: '/modelos', label: 'Modelos', Icon: IconCar },
  { href: '/comparar', label: 'Comparar', Icon: IconCompare },
  { href: '/ahorro', label: 'Ahorro', Icon: IconSavings },
  { href: '/carga', label: 'Carga', Icon: IconCharge },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? '/';

  const isActive = (item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <>
      <style>{`
        .nav-item { transition: background 140ms ease, color 140ms ease; }
        .nav-item:hover:not(.nav-item-active) { background: ${C.line} !important; }
        .nav-burger { display: none; }
        @media (max-width: 640px) {
          .nav-items-desktop { display: none !important; }
          .nav-burger { display: flex !important; }
        }
      `}</style>

      <nav className="lg-bar" style={S.nav}>
        <a href="/" style={S.logoLink}>
          <img
            src="/logo-icon.png"
            alt="autoelectrico.uy"
            style={S.logoImg}
            width={28}
            height={22}
          />
          <span style={S.logoText}>
            autoelectrico<span style={{ color: C.real }}>.uy</span>
          </span>
        </a>

        <div className="nav-items-desktop" style={S.pill}>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            return (
              <a
                key={item.href}
                href={item.href}
                className={`nav-item${active ? ' nav-item-active' : ''}`}
                style={{
                  ...S.item,
                  ...(active ? S.itemActive : {}),
                }}
              >
                <item.Icon color={active ? C.real : C.dim} />
                <span style={{ color: active ? C.real : C.dim }}>{item.label}</span>
              </a>
            );
          })}
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
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            return (
              <a
                key={item.href}
                href={item.href}
                style={{ ...S.mobileLink, color: active ? C.real : C.dim }}
              >
                <item.Icon color={active ? C.real : C.dim} />
                {item.label}
              </a>
            );
          })}
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
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    gap: 12,
    padding: '10px 20px',
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
  logoImg: { display: 'block' },
  logoText: {
    fontSize: 14,
    fontWeight: 500,
    color: C.text,
    letterSpacing: '0.02em',
  },
  pill: {
    display: 'flex',
    gap: 2,
    alignItems: 'center',
    background: C.surface,
    border: `1px solid ${C.line}`,
    borderRadius: 16,
    padding: 5,
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
    padding: '8px 14px',
    borderRadius: 12,
    textDecoration: 'none',
    fontSize: 10.5,
    fontWeight: 600,
    letterSpacing: '0.01em',
  },
  itemActive: {
    background: 'rgba(61,220,151,0.10)',
  },
  burger: {
    justifySelf: 'end',
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
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 20px',
    fontSize: 13,
    textDecoration: 'none',
    borderBottom: `1px solid ${C.line}`,
  },
};
