// ============================================================
// autoelectrico.uy — /modelos/[slug]
// Ficha individual. Server component con JSON-LD para SEO.
// ============================================================

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import * as models from '@/lib/db/models';
import type { Model } from '@/lib/db/types';
import {
  modelMetadata,
  vehicleJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
} from '@/lib/seo/model';
import ModelSheet from '@/components/ModelSheet';
import Nav from '@/components/Nav';

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

const NUMERIC_FIELDS = [
  'price_usd', 'battery_kwh', 'battery_usable_kwh', 'range_wltp_km',
  'range_real_km', 'range_real_n', 'consumption_kwh_100', 'charge_ac_kw',
  'charge_dc_kw', 'charge_10_80_min', 'power_hp', 'power_kw', 'torque_nm',
  'accel_0_100_s', 'top_speed_kmh', 'seats', 'trunk_l', 'frunk_l',
  'weight_kg', 'length_mm', 'imesi_pct',
];

/** pg devuelve numeric como string y Date como objeto: normalizar. */
function serialize(m: Model) {
  const out: Record<string, unknown> = { ...m } as Record<string, unknown>;
  for (const f of NUMERIC_FIELDS) {
    if (out[f] != null) out[f] = Number(out[f]);
  }
  for (const [k, v] of Object.entries(out)) {
    if (v instanceof Date) out[k] = v.toISOString();
  }
  return out;
}

export async function generateStaticParams() {
  try {
    const all = await models.listModels(null, { limit: 100 });
    return all.map((m) => ({ slug: m.slug! }));
  } catch {
    // Sin DB durante el build: se generan on-demand
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = await models.getModelBySlug(null, slug);
  if (!m) return { title: 'Modelo no encontrado' };
  return modelMetadata(m);
}

export default async function ModelPage({ params }: Props) {
  const { slug } = await params;
  const model = await models.getModelBySlug(null, slug);

  if (!model) notFound();

  const ld = [
    vehicleJsonLd(model),
    breadcrumbJsonLd(model),
    faqJsonLd(model),
  ].filter(Boolean);

  return (
    <>
      {ld.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
      <Nav />
      <ModelSheet model={serialize(model)} />
    </>
  );
}
