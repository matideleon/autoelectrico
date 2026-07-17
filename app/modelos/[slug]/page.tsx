// ============================================================
// evuy — /modelos/[slug]
//
// Server Component. Estático con revalidación: las fichas casi
// no cambian y el SEO premia la velocidad. Cuando actualizás un
// precio, el worker revalida la ruta.
// ============================================================

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import * as models from '@/lib/db/models';
import {
  modelMetadata,
  vehicleJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
} from '@/lib/seo/model';
import ModelSheet from '@/components/ModelSheet';

export const revalidate = 3600; // 1h

interface Props {
  params: Promise<{ slug: string }>;
}

/** Pre-genera todas las fichas publicadas en el build. */
export async function generateStaticParams() {
  const all = await models.listModels(null, { limit: 100 });
  return all.map((m) => ({ slug: m.slug! }));
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
      <ModelSheet model={model} />
    </>
  );
}
