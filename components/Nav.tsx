// Nav — barra de navegación compartida
// Estilo: sticky con glass effect, mono, links con borde.
// Empata con la nav de /comparar y /ahorro.

import Link from 'next/link';

const C = {
  bg: '#141619',
  surface: '#1B1E23',
  line: '#2A2E35',
  text: '#E6E8EB',
  dim: '#8A9099',
  real: '#3DDC97',
};

const mono = "'IBM Plex Mono', ui-monospace, Menlo, monospace";

const linkStyle = (isActive: boolean): React.CSSProperties => ({
  fontSize: 13,
  fontWeight: 500,
  color: isActive ? C.text : C.dim,
  textDecoration: 'none',
  letterSpacing: '0.03em',
  padding: '6px 12px',
  borderRadius: 3,
  border: `1px solid ${isActive ? C.real : C.line}`,
});

export default function Nav() {
  return (
    <nav
      style={{
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
      }}
    >
      <Link
        href="/"
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: C.text,
          textDecoration: 'none',
          letterSpacing: '0.02em',
        }}
      >
        autoelectrico<span style={{ color: C.real }}>.uy</span>
      </Link>
      <div style={{ display: 'flex', gap: 26, alignItems: 'center' }}>
        <Link href="/modelos" style={linkStyle(false)}>
          Modelos
        </Link>
        <Link href="/noticias" style={linkStyle(true)}>
          Noticias
        </Link>
        <Link href="/comparar" style={linkStyle(false)}>
          Comparar
        </Link>
        <Link href="/ahorro" style={linkStyle(false)}>
          Ahorro
        </Link>
      </div>
    </nav>
  );
}