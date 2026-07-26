'use client';

import React, { useState } from 'react';

/* ============================================================
   CarSilhouette — imagen real del auto si existe, silueta SVG
   por tipo de carrocería si no.

   Prioridad: hero_image (URL real del fabricante) > silueta SVG
   por body type > silueta genérica (sedan).

   Si la imagen real falla al cargar (URL rota, servidor caído),
   cae automáticamente a la silueta — así nunca queda un hueco
   blanco roto.
   ============================================================ */

const PATHS = {
  suv: 'M10,32 L14,32 L16,28 L22,22 L28,18 L38,16 L58,16 L72,18 L78,22 L82,28 L86,32 L90,32 M20,32 a6,6 0 1,1 12,0 a6,6 0 1,1 -12,0 M68,32 a6,6 0 1,1 12,0 a6,6 0 1,1 -12,0',
  sedan: 'M8,34 L14,34 L18,30 L24,22 L32,18 L44,16 L56,16 L68,18 L76,22 L80,28 L84,30 L88,34 L92,34 M20,34 a6,6 0 1,1 12,0 a6,6 0 1,1 -12,0 M68,34 a6,6 0 1,1 12,0 a6,6 0 1,1 -12,0',
  hatchback: 'M10,32 L16,32 L18,28 L24,22 L30,18 L40,16 L60,16 L68,16 L76,20 L82,28 L86,32 L90,32 M22,32 a6,6 0 1,1 12,0 a6,6 0 1,1 -12,0 M68,32 a6,6 0 1,1 12,0 a6,6 0 1,1 -12,0',
  pickup: 'M6,32 L12,32 L16,28 L22,22 L28,18 L36,16 L48,16 L52,18 L54,24 L78,24 L82,28 L86,32 L92,32 M18,32 a6,6 0 1,1 12,0 a6,6 0 1,1 -12,0 M72,32 a6,6 0 1,1 12,0 a6,6 0 1,1 -12,0',
  van: 'M8,34 L14,34 L18,30 L20,18 L24,14 L70,14 L78,16 L82,22 L86,30 L90,34 L94,34 M20,34 a6,6 0 1,1 12,0 a6,6 0 1,1 -12,0 M72,34 a6,6 0 1,1 12,0 a6,6 0 1,1 -12,0',
  coupe: 'M10,34 L16,34 L20,30 L28,20 L38,16 L52,15 L62,16 L72,20 L80,28 L84,30 L88,34 L92,34 M22,34 a6,6 0 1,1 12,0 a6,6 0 1,1 -12,0 M70,34 a6,6 0 1,1 12,0 a6,6 0 1,1 -12,0',
  wagon: 'M8,34 L14,34 L18,30 L24,22 L32,18 L42,16 L62,16 L72,16 L78,20 L82,28 L86,30 L90,34 L94,34 M20,34 a6,6 0 1,1 12,0 a6,6 0 1,1 -12,0 M72,34 a6,6 0 1,1 12,0 a6,6 0 1,1 -12,0',
};

const DEFAULT_BODY = 'sedan';

function Silhouette({ body, size, color }) {
  const type = body && PATHS[body] ? body : DEFAULT_BODY;
  return (
    <svg
      viewBox="0 0 100 44"
      width={size}
      height={size * 0.44}
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', margin: '0 auto 6px' }}
      aria-label={`Silueta de ${type}`}
    >
      <path d={PATHS[type]} />
    </svg>
  );
}

export default function CarSilhouette({ body, heroImage, size = 64, color = '#565C66' }) {
  const [imgError, setImgError] = useState(false);

  if (heroImage && !imgError) {
    return (
      <img
        src={heroImage}
        alt=""
        onError={() => setImgError(true)}
        style={{
          display: 'block',
          margin: '0 auto 6px',
          width: size * 1.4,
          height: size * 0.7,
          objectFit: 'contain',
        }}
      />
    );
  }

  return <Silhouette body={body} size={size} color={color} />;
}
