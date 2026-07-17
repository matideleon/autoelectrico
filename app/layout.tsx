import type { Metadata } from 'next';

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, background: '#141619' }}>{children}</body>
    </html>
  );
}
