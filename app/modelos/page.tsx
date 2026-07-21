// ============================================================
// autoelectrico.uy — /modelos
// Listado del catálogo. Server component: trae de la DB.
// ============================================================

import type { Metadata } from 'next';
import * as models from '@/lib/db/models';
import ModelGridRaw from '@/components/ModelGrid';
import Nav from '@/components/Nav';

const ModelGrid = ModelGridRaw as unknown as (props: { models: Record<string, unknown>[] }) => JSX.Element;

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Modelos eléctricos en Uruguay',
  description:
    'Todos los autos eléctricos a la venta en Uruguay con precio, autonomía real medida por usuarios y ficha técnica completa.',
};

/** pg devuelve numeric como string: normalizar antes de pasar al cliente. */
function serialize(m: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(m)) {
    if (v instanceof Date) out[k] = v.toISOString();
    else out[k] = v;
  }
  return out;
}

export default async function ModelosPage() {
  const list = await models.listModels(null, { limit: 50 });

  return (
    <>
      <Nav />
      <ModelGrid models={list.map(serialize)} />
    </>
  );
}
