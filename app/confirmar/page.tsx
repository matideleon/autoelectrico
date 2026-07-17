// ============================================================
// evuy — /confirmar?token=...
//
// Cierra el double opt-in. Server Component: el token se valida
// del lado del servidor, nunca en el cliente.
// ============================================================

import type { Metadata } from 'next';
import { confirmSubscription } from '@/lib/db/subscribers';

export const metadata: Metadata = {
  title: 'Confirmar suscripción · evuy',
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ token?: string }>;
}

const C = {
  bg: '#141619',
  line: '#2A2E35',
  text: '#E6E8EB',
  dim: '#8A9099',
  faint: '#565C66',
  real: '#3DDC97',
  lab: '#E8A33D',
};

export default async function ConfirmPage({ searchParams }: Props) {
  const { token } = await searchParams;

  const sub = token ? await confirmSubscription(token) : null;
  const ok = Boolean(sub);

  return (
    <main style={S.root}>
      <div style={S.wrap}>
        <div style={{ ...S.mark, color: ok ? C.real : C.lab }}>
          {ok ? '✓' : '·'}
        </div>

        <h1 style={S.title}>{ok ? 'Listo, estás adentro' : 'Ese link no anda'}</h1>

        {ok ? (
          <>
            <p style={S.text}>
              Te vamos a escribir cada dos semanas con precios que cambiaron,
              mediciones nuevas y usados que valen la pena. Nada más.
            </p>
            <p style={S.ask}>
              Si te llegó el mail de confirmación, respondelo contando qué
              querés saber de los eléctricos que hoy no encontrás. Eso define
              qué medimos primero.
            </p>
          </>
        ) : (
          <p style={S.text}>
            El link puede haber vencido, o ya lo usaste antes. Si ya
            confirmaste, estás adentro igual. Si no, suscribite de nuevo desde
            la página principal.
          </p>
        )}

        <a href="/" style={S.link}>
          ← Volver
        </a>
      </div>
    </main>
  );
}

const mono = "ui-monospace, Menlo, monospace";

const S: Record<string, React.CSSProperties> = {
  root: {
    background: C.bg,
    minHeight: '100vh',
    padding: '100px 20px',
    fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
    color: C.text,
  },
  wrap: { maxWidth: 460, margin: '0 auto' },
  mark: { fontFamily: mono, fontSize: 32, marginBottom: 20 },
  title: {
    fontSize: 28,
    fontWeight: 600,
    letterSpacing: '-0.02em',
    margin: '0 0 14px',
  },
  text: { fontSize: 15, color: C.dim, lineHeight: 1.65, margin: '0 0 24px' },
  ask: {
    fontSize: 14,
    color: C.dim,
    lineHeight: 1.7,
    margin: '0 0 32px',
    paddingTop: 22,
    borderTop: `1px solid ${C.line}`,
  },
  link: {
    fontFamily: mono,
    fontSize: 12,
    color: C.real,
    textDecoration: 'none',
  },
};
