-- ============================================================
-- evuy — Seed 0002
-- Geely EX5. Ficha canónica de referencia.
-- REGLA: dato sin fuente = NULL. Nunca estimado.
-- ============================================================

BEGIN;

INSERT INTO models (
  slug, brand, model, variant, year_from, body, status,
  price_usd, price_source, price_updated_at,
  battery_kwh, battery_usable_kwh, battery_chemistry,
  range_wltp_km, range_real_km, range_real_source, range_real_n,
  consumption_kwh_100,
  charge_ac_kw, charge_dc_kw, connector_ac, connector_dc, charge_10_80_min, v2l,
  power_hp, power_kw, torque_nm, accel_0_100_s, top_speed_kmh, drivetrain,
  seats, trunk_l, weight_kg, length_mm,
  importer, warranty_vehicle, warranty_battery, available_uy,
  summary, seo_title, seo_description,
  specs_json
) VALUES (
  'geely-ex5-2026',
  'Geely',
  'EX5',
  NULL,
  2025,
  'suv',
  'draft',                    -- publicar recién con todos los Tier 1 verificados

  -- PRECIO: completar con cotización real del importador
  NULL,
  NULL,
  NULL,

  -- BATERÍA
  60.22,                      -- verificar contra ficha oficial UY
  NULL,
  'lfp',

  -- AUTONOMÍA
  430,                        -- WLTP declarado — confirmar en ficha oficial
  NULL,                       -- ← acá va el dato de la comunidad Geely
  NULL,
  NULL,
  NULL,

  -- CARGA
  11.0,
  100.0,
  'type2',
  'ccs2',
  NULL,
  true,                       -- V2L confirmado

  -- PERFORMANCE
  218, 160, 320, 6.9, 175, 'fwd',

  -- DIMENSIONES
  5, 410, NULL, 4615,

  -- COMERCIAL UY
  NULL,                       -- importador oficial
  NULL,
  NULL,
  true,

  'SUV eléctrico compacto de Geely con batería LFP Aegis Short Blade, carga DC de 100 kW y función V2L.',
  'Geely EX5 Uruguay: precio, autonomía real y ficha técnica',
  'Todo sobre el Geely EX5 en Uruguay: precio actualizado, autonomía real medida por usuarios, tiempos de carga, garantía y opiniones.',

  jsonb_build_object(
    'known_issues', '[]'::jsonb,
    'ota_updates',  '[]'::jsonb,
    'accessories',  '[]'::jsonb,
    'community',     jsonb_build_object('uy_owners_group', true),
    'data_gaps',     jsonb_build_array(
      'price_usd', 'importer', 'range_real_km',
      'charge_10_80_min', 'warranty_vehicle', 'warranty_battery'
    )
  )
);

-- Los otros 4 de la semana 1 (esqueletos a completar Día 3)
INSERT INTO models (slug, brand, model, year_from, body, status, specs_json) VALUES
  ('geely-geometry-c-2026', 'Geely',  'Geometry C',   2023, 'suv',       'draft', '{}'),
  ('byd-dolphin-2026',      'BYD',    'Dolphin',      2023, 'hatchback', 'draft', '{}'),
  ('byd-yuan-plus-2026',    'BYD',    'Yuan Plus',    2023, 'suv',       'draft', '{}'),
  ('renault-kwid-e-tech-2026','Renault','Kwid E-Tech',2023, 'hatchback', 'draft', '{}');

COMMIT;

-- ============================================================
-- Verificación
-- ============================================================
-- SELECT slug, brand, model, status,
--        (specs_json->'data_gaps') AS faltantes
-- FROM models ORDER BY brand;
