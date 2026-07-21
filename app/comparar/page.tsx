// ============================================================
// autoelectrico.uy — /comparar
// Comparador conectado al catálogo real.
// ============================================================

import type { Metadata } from 'next';
import { query } from '@/lib/db/client';
import Comparador from '@/components/Comparador';
import Nav from '@/components/Nav';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Comparar autos eléctricos',
  description:
    'Compará hasta 3 autos eléctricos a la venta en Uruguay: precio, autonomía real, tiempos de carga y ficha técnica lado a lado.',
};

export default async function CompararPage() {
  // El comparador necesita la ficha completa, no el resumen del listado
  const rows = await query(
    `SELECT slug, brand, model, variant, price_usd, price_updated_at,
            battery_kwh, range_wltp_km, range_real_km, range_real_n,
            consumption_kwh_100, charge_ac_kw, charge_dc_kw, charge_10_80_min,
            power_hp, accel_0_100_s, seats, trunk_l, warranty_battery
     FROM models
     WHERE status = 'published'
     ORDER BY price_usd ASC NULLS LAST`
  );

  const serialized = rows.map((m) => {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(m)) {
      out[k] = v instanceof Date ? v.toISOString() : v;
    }
    return out;
  });

  return (
    <>
      <Nav />
      <Comparador models={serialized} />
    </>
  );
}
