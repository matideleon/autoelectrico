// ============================================================
// evuy — SEO
//
// Las fichas son el activo: el 80% de los compradores de EV en
// Uruguay tienen que pasar por acá antes de gastar USD 40.000.
// Eso se gana en Google, y Google necesita datos estructurados.
//
// Regla que atraviesa todo el archivo: un campo sin dato se OMITE
// del JSON-LD. Nunca se estima para "completar" el markup. Un dato
// inventado en schema.org es una mentira firmada.
// ============================================================

import type { Metadata } from 'next';
import type { Model } from '../db/types';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autoelectrico.uy';
const SITE_NAME = 'autoelectrico.uy';

export function modelTitle(m: Partial<Model>): string {
  if (m.seo_title) return m.seo_title;
  return `${m.brand} ${m.model} en Uruguay: precio, autonomía real y ficha técnica`;
}

export function modelDescription(m: Partial<Model>): string {
  if (m.seo_description) return m.seo_description;

  const bits: string[] = [`${m.brand} ${m.model} en Uruguay.`];

  if (m.price_usd) bits.push(`Precio desde USD ${m.price_usd.toLocaleString('es-UY')}.`);

  // La autonomía real es el gancho: nadie más la publica.
  if (m.range_real_km) {
    bits.push(`Autonomía real medida: ${m.range_real_km} km.`);
  } else if (m.range_wltp_km) {
    bits.push(`Autonomía WLTP: ${m.range_wltp_km} km.`);
  }

  if (m.battery_kwh) bits.push(`Batería de ${m.battery_kwh} kWh.`);
  bits.push('Ficha técnica, tiempos de carga y garantía.');

  return bits.join(' ').slice(0, 158);
}

export function modelMetadata(m: Partial<Model>): Metadata {
  const title = modelTitle(m);
  const description = modelDescription(m);
  const url = `${SITE}/modelos/${m.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'es_UY',
      type: 'website',
      images: m.hero_image ? [{ url: m.hero_image, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      // Las fichas en borrador no se indexan: media ficha
      // posicionada es peor que ninguna.
      index: m.status === 'published',
      follow: true,
    },
  };
}

/**
 * JSON-LD tipo Vehicle. Cada campo se omite si el dato no existe.
 * Google penaliza el markup inconsistente con el contenido visible,
 * y nosotros no inventamos ni para él.
 */
export function vehicleJsonLd(m: Partial<Model>): Record<string, unknown> {
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${m.brand} ${m.model}${m.variant ? ' ' + m.variant : ''}`,
    brand: { '@type': 'Brand', name: m.brand },
    model: m.model,
    vehicleConfiguration: m.variant ?? undefined,
    bodyType: m.body ?? undefined,
    fuelType: 'Electric',
    url: `${SITE}/modelos/${m.slug}`,
  };

  if (m.summary) ld.description = m.summary;
  if (m.hero_image) ld.image = m.hero_image;
  if (m.year_from) ld.productionDate = String(m.year_from);
  if (m.seats) ld.seatingCapacity = m.seats;
  if (m.drivetrain) ld.driveWheelConfiguration = m.drivetrain.toUpperCase();

  // Precio: solo si existe Y tiene fuente. Sin fuente no se publica.
  if (m.price_usd != null && m.price_source) {
    ld.offers = {
      '@type': 'Offer',
      price: m.price_usd,
      priceCurrency: 'USD',
      availability: m.available_uy
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      areaServed: { '@type': 'Country', name: 'Uruguay' },
      seller: m.importer ? { '@type': 'Organization', name: m.importer } : undefined,
      priceValidUntil: m.price_updated_at
        ? new Date(
            new Date(m.price_updated_at).getTime() + 90 * 864e5
          ).toISOString().slice(0, 10)
        : undefined,
    };
  }

  if (m.battery_kwh) {
    ld.batteryCapacity = {
      '@type': 'QuantitativeValue',
      value: m.battery_kwh,
      unitCode: 'KWH',
    };
  }

  // Rango: se declara el REAL si existe; si no, el WLTP.
  // Nunca ambos como si fueran lo mismo.
  const range = m.range_real_km ?? m.range_wltp_km;
  if (range) {
    ld.vehicleRange = {
      '@type': 'QuantitativeValue',
      value: range,
      unitCode: 'KMT',
      description: m.range_real_km
        ? `Autonomía real medida por usuarios en Uruguay${m.range_real_n ? ` (${m.range_real_n} mediciones)` : ''}`
        : 'Autonomía WLTP declarada por el fabricante (medición de laboratorio)',
    };
  }

  if (m.power_hp) {
    ld.vehicleEngine = {
      '@type': 'EngineSpecification',
      engineType: 'Electric motor',
      enginePower: { '@type': 'QuantitativeValue', value: m.power_hp, unitCode: 'BHP' },
      torque: m.torque_nm
        ? { '@type': 'QuantitativeValue', value: m.torque_nm, unitCode: 'NU' }
        : undefined,
    };
  }

  if (m.accel_0_100_s) {
    ld.accelerationTime = {
      '@type': 'QuantitativeValue',
      value: m.accel_0_100_s,
      unitCode: 'SEC',
    };
  }

  if (m.consumption_kwh_100) {
    ld.fuelConsumption = {
      '@type': 'QuantitativeValue',
      value: m.consumption_kwh_100,
      unitText: 'kWh/100km',
    };
  }

  if (m.trunk_l) {
    ld.cargoVolume = { '@type': 'QuantitativeValue', value: m.trunk_l, unitCode: 'LTR' };
  }

  return stripUndefined(ld);
}

/**
 * FAQPage con las preguntas que la gente busca de verdad.
 * Solo se generan las que tenemos datos para responder: una FAQ
 * con respuesta vacía es spam de markup.
 */
export function faqJsonLd(m: Partial<Model>): Record<string, unknown> | null {
  const qa: Array<{ q: string; a: string }> = [];

  if (m.price_usd && m.price_source) {
    const when = m.price_updated_at
      ? new Date(m.price_updated_at).toLocaleDateString('es-UY')
      : null;
    qa.push({
      q: `¿Cuánto sale el ${m.brand} ${m.model} en Uruguay?`,
      a: `El ${m.brand} ${m.model} arranca en USD ${m.price_usd.toLocaleString('es-UY')}${
        m.importer ? ` según ${m.importer}` : ''
      }${when ? `, precio actualizado el ${when}` : ''}. Los precios varían según versión y equipamiento.`,
    });
  }

  if (m.range_real_km) {
    qa.push({
      q: `¿Cuál es la autonomía real del ${m.brand} ${m.model}?`,
      a: `La autonomía real medida por usuarios en Uruguay es de ${m.range_real_km} km${
        m.range_real_n ? `, sobre ${m.range_real_n} mediciones` : ''
      }${
        m.range_wltp_km
          ? `. El fabricante declara ${m.range_wltp_km} km bajo ciclo WLTP, que es una medición de laboratorio y suele ser superior al uso real`
          : ''
      }.`,
    });
  } else if (m.range_wltp_km) {
    qa.push({
      q: `¿Cuál es la autonomía del ${m.brand} ${m.model}?`,
      a: `El fabricante declara ${m.range_wltp_km} km bajo ciclo WLTP, una medición de laboratorio. Todavía no tenemos mediciones reales de usuarios en Uruguay: en uso cotidiano la cifra suele ser menor.`,
    });
  }

  if (m.charge_dc_kw && m.charge_10_80_min) {
    qa.push({
      q: `¿Cuánto tarda en cargar el ${m.brand} ${m.model}?`,
      a: `En un cargador rápido de corriente continua carga del 10% al 80% en ${m.charge_10_80_min} minutos, con una potencia máxima de ${m.charge_dc_kw} kW${
        m.connector_dc ? ` y conector ${m.connector_dc}` : ''
      }.${
        m.charge_ac_kw
          ? ` En casa, con corriente alterna, admite hasta ${m.charge_ac_kw} kW.`
          : ''
      }`,
    });
  }

  if (m.warranty_battery) {
    qa.push({
      q: `¿Qué garantía tiene la batería del ${m.brand} ${m.model}?`,
      a: `La garantía de batería es de ${m.warranty_battery}${
        m.warranty_vehicle ? `. La garantía general del vehículo es de ${m.warranty_vehicle}` : ''
      }.`,
    });
  }

  if (!qa.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qa.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export function breadcrumbJsonLd(m: Partial<Model>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Modelos', item: `${SITE}/modelos` },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${m.brand} ${m.model}`,
        item: `${SITE}/modelos/${m.slug}`,
      },
    ],
  };
}

/** schema.org ignora las claves undefined, pero ensucian el HTML. */
function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (typeof v === 'object' && !Array.isArray(v)) {
      const nested = stripUndefined(v as Record<string, unknown>);
      if (Object.keys(nested).length) out[k] = nested;
      continue;
    }
    out[k] = v;
  }
  return out;
}

export { SITE, SITE_NAME };
