/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone: genera un server.js autocontenido que corre sin
  // node_modules. Es lo que el Dockerfile copia al contenedor.
  output: 'standalone',

  // Las imágenes de listings y manuales vienen de MinIO (CDN).
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.CDN_DOMAIN ?? 'cdn.autoelectrico.uy',
      },
    ],
  },

  // El worker comparte lib/ con la app: no debe compilarse con Next.
  serverExternalPackages: ['bullmq', 'ioredis', 'pdfjs-dist', '@aws-sdk/client-s3'],

  async headers() {
    const isProduction = process.env.NODE_ENV === 'production';

    return [
      {
        source: '/(.*)',
        headers: [
          // Seguridad básica
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

          // Mientras no esté listo para producción: no indexar.
          // Cuando esté listo: sacar esta línea y dejar que las
          // páginas controlen su robots individualmente.
          ...(isProduction
            ? []
            : [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]),
        ],
      },
      {
        // El chat es la única API que necesita CORS: el widget
        // embebido en concesionarios va a vivir en otro dominio.
        source: '/api/chat',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autoelectrico.uy' },
          { key: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
};

export default nextConfig;
