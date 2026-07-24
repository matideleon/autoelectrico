// ============================================================
// autoelectrico.uy — portada
//
// Server component a propósito: las secciones nuevas
// (destacados y estado del catálogo) leen datos REALES de la
// base. Nada de números escritos a mano que se desactualicen.
// ============================================================

import Nav from '@/components/Nav';
import NewsFeed from '@/components/NewsFeed';
import HomeSections from '@/components/HomeSections';
import { query } from '@/lib/db/client';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Modelos con precio verificado, los más accesibles primero.
  const destacados = await query(
    `SELECT slug, brand, model, variant, price_usd, battery_kwh,
            range_wltp_km, range_real_km
     FROM models
     WHERE status = 'published' AND price_usd IS NOT NULL
     ORDER BY price_usd ASC
     LIMIT 8`
  );

  // Total real de publicados, para el link "ver los N modelos".
  const statsRows = await query(
    `SELECT COUNT(*) AS total FROM models WHERE status = 'published'`
  );

  const serialize = (rows: Record<string, unknown>[]) =>
    rows.map((r) => {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(r)) {
        out[k] = v instanceof Date ? v.toISOString() : v;
      }
      return out;
    });

  return (
    <>
      <Nav />
      <NewsFeed />
      {/* HomeSections es .jsx sin tipos: TS infiere never[] de sus
          valores por defecto, así que casteamos acá. */}
      <HomeSections
        destacados={serialize(destacados) as never}
        stats={(serialize(statsRows)[0] ?? {}) as never}
      />
    </>
  );
}
