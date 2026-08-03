// Nav — barra de navegación compartida
// Usada por páginas de blog, noticias y contenido estático.

import Link from 'next/link';

export default function Nav() {
  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        borderBottom: '1px solid #2a2d33',
        background: '#141619',
      }}
    >
      <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: 18, fontWeight: 500 }}>
        autoelectrico.<span style={{ color: '#00d084' }}>uy</span>
      </Link>
      <div style={{ display: 'flex', gap: 30 }}>
        <Link href="/modelos" style={{ color: '#aaa', textDecoration: 'none', fontSize: 14 }}>
          Modelos
        </Link>
        <Link href="/noticias" style={{ color: '#aaa', textDecoration: 'none', fontSize: 14 }}>
          Noticias
        </Link>
        <Link href="/comparar" style={{ color: '#aaa', textDecoration: 'none', fontSize: 14 }}>
          Comparar
        </Link>
        <Link href="/ahorro" style={{ color: '#aaa', textDecoration: 'none', fontSize: 14 }}>
          Ahorro
        </Link>
      </div>
    </nav>
  );
}