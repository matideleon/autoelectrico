// ============================================================
// autoelectrico.uy — GET /api/models
//
// Lista liviana para selectores del lado del cliente (el
// simulador de ahorro, por ejemplo). Solo modelos publicados,
// solo los campos que hacen falta para autocompletar.
// ============================================================

import { NextResponse } from 'next/server';
import { query } from '@/lib/db/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ModelRow {
  slug: string;
  brand: string;
  model: string;
  variant: string | null;
  battery_kwh: string | null;
  consumption_kwh_100: string | null;
  range_wltp_km: number | null;
  range_real_km: number | null;
  price_usd: string | null;
}

export async function GET() {
  try {
    const rows = await query<ModelRow>(
      `SELECT slug, brand, model, variant, battery_kwh,
              consumption_kwh_100, range_wltp_km, range_real_km, price_usd
       FROM models
       WHERE status = 'published'
       ORDER BY brand, model, variant`
    );

    // pg devuelve numeric como string: normalizar a number para el cliente.
    const data = rows.map((r) => ({
      slug: r.slug,
      brand: r.brand,
      model: r.model,
      variant: r.variant,
      batteryKwh: r.battery_kwh != null ? Number(r.battery_kwh) : null,
      consumptionKwh100: r.consumption_kwh_100 != null ? Number(r.consumption_kwh_100) : null,
      rangeWltpKm: r.range_wltp_km,
      rangeRealKm: r.range_real_km,
      priceUsd: r.price_usd != null ? Number(r.price_usd) : null,
    }));

    return NextResponse.json(
      { models: data },
      { headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' } }
    );
  } catch (err) {
    console.error('[api/models] error:', err);
    return NextResponse.json({ models: [] }, { status: 200 });
  }
}
