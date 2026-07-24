import type { Metadata } from 'next';
import ChatWidget from '@/components/ChatWidget';

export const metadata: Metadata = {
  title: {
    default: 'autoelectrico.uy — Autos eléctricos en Uruguay con datos reales',
    template: '%s | autoelectrico.uy',
  },
  description:
    'Precio, autonomía real medida por usuarios, tiempos de carga y ficha técnica de cada auto eléctrico a la venta en Uruguay.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autoelectrico.uy'),
  openGraph: {
    siteName: 'autoelectrico.uy',
    locale: 'es_UY',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: `
          /* ===== Liquid glass, global ===== */

          .lg-bg {
            position: fixed;
            inset: 0;
            z-index: -1;
            pointer-events: none;
            background:
              radial-gradient(60rem 40rem at 15% 0%, rgba(61,220,151,0.07), transparent 60%),
              radial-gradient(50rem 35rem at 85% 20%, rgba(124,158,255,0.05), transparent 60%),
              radial-gradient(45rem 40rem at 50% 100%, rgba(184,115,78,0.05), transparent 60%),
              #141619;
          }

          /* Aplicar a cualquier tarjeta/panel que quiera el efecto */
          .lg {
            background: rgba(27, 30, 35, 0.55) !important;
            backdrop-filter: blur(18px) saturate(140%);
            -webkit-backdrop-filter: blur(18px) saturate(140%);
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
            box-shadow:
              0 8px 32px rgba(0, 0, 0, 0.28),
              inset 0 1px 0 rgba(255, 255, 255, 0.06);
          }

          /* Variante más sutil, para elementos chicos o superpuestos */
          .lg-soft {
            background: rgba(27, 30, 35, 0.40) !important;
            backdrop-filter: blur(12px) saturate(130%);
            -webkit-backdrop-filter: blur(12px) saturate(130%);
            border: 1px solid rgba(255, 255, 255, 0.06) !important;
          }

          /* Barra superior fija (nav) */
          .lg-bar {
            background: rgba(20, 22, 25, 0.65) !important;
            backdrop-filter: blur(20px) saturate(150%);
            -webkit-backdrop-filter: blur(20px) saturate(150%);
            border-bottom: 1px solid rgba(255, 255, 255, 0.07) !important;
          }

          /* Navegadores sin soporte: se queda el color sólido de
             siempre, sin transparencia rara. */
          @supports not (backdrop-filter: blur(1px)) {
            .lg, .lg-soft { background: #1B1E23 !important; }
            .lg-bar { background: #141619 !important; }
          }

          @media (prefers-reduced-motion: reduce) {
            .lg, .lg-soft, .lg-bar { transition: none !important; }
          }
        ` }} />
      </head>
      <body style={{ margin: 0, background: '#141619' }}>
        {/* Fondo con gradiente: sin algo con textura detrás, el
            backdrop-filter del vidrio no se nota — el gris plano
            queda igual que sin efecto. Es fijo y sin pointer-events
            para que no interfiera con el scroll ni los clics. */}
        <div aria-hidden="true" className="lg-bg" />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
