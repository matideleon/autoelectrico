-- ============================================================
-- evuy — Migración 0010
-- Correcciones de precio y specs, agosto 2026
--
-- Origen: investigación para /blog/captiva-omoda-bajan-precio-imesi
--
--   1. Columna nueva range_nedc_km (el problema del ciclo)
--   2. Cinco precios desactualizados + price_history
--   3. Omoda E5: la ficha mezclaba el modelo viejo con el restyling
--   4. Chevrolet Captiva EV: ficha completa desde fuente oficial
--   5. Ficha nueva: Omoda E5 Luxury Standard Range
--
-- Fuentes:
--   - Autoblog UY, lanzamiento Omoda E5 restyling (03/06/2026)
--   - Autoblog UY, lanzamiento Chevrolet Captiva EV (10/10/2025)
--   - Silca, ficha oficial Captiva EV
--   - LARED21 / Ámbito, lista BYD "Modelo 2027" (22/07/2026)
--   - Avisos de concesionarias verificadas (03/08/2026)
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1. El problema del ciclo de homologación
--
-- range_wltp_km está bien nombrada, pero se le estaban cargando
-- números NEDC. La Captiva es el caso testigo: declara 415 km
-- NEDC y en la base figuraban 408 "WLTP", que no aparecen en
-- ninguna fuente. Los ciclos no son comparables — el propio
-- Omoda E5 declara 422 NEDC y 350 WLTP para la misma batería.
--
-- Con las dos columnas separadas, la ficha puede mostrar WLTP
-- si existe, y si no, NEDC con su badge. Y el comparador puede
-- negarse a cruzar ciclos distintos.
-- ------------------------------------------------------------

ALTER TABLE models ADD COLUMN IF NOT EXISTS range_nedc_km integer;

COMMENT ON COLUMN models.range_nedc_km IS
  'Autonomía declarada en ciclo NEDC. NO comparable con range_wltp_km: el NEDC infla en el entorno del 20%.';


-- ------------------------------------------------------------
-- 2. Precios
--
-- price_updated_at lo setea solo el trigger touch_price_date,
-- así que no se toca acá.
-- ------------------------------------------------------------

-- Chevrolet Captiva EV: 33.990 → 31.990
--
-- OJO: chevrolet.com.uy seguía publicando 33.990 al 04/08/2026,
-- con la leyenda "precio válido desde 01/08/2026 hasta 31/08/2026".
-- Los 31.990 salen de avisos de concesionaria oficial. O sea que
-- por ahora es precio de mostrador, no lista de marca actualizada.
-- Se ficha el que el comprador consigue, y la fuente lo aclara.
UPDATE models SET
  price_usd    = 31990,
  price_source = 'Avisos de concesionaria oficial (Silca), ago 2026 — la lista de chevrolet.com.uy seguía en USD 33.990 al 04/08'
WHERE slug = 'chevrolet-captiva-ev-2026';

-- Omoda E5 Comfort: 26.990 → 25.990
UPDATE models SET
  price_usd    = 25990,
  price_source = 'Avisos de concesionaria verificada, Montevideo, ago 2026'
WHERE slug = 'omoda-e5-comfort-2026';

-- BYD Seagull GL: 19.990 → 18.990 (lista "Modelo 2027", 22/07/2026)
-- Estas tres venían del 22 de julio y quedaron sin actualizar
-- cuando se publicó la nota de efecto-tesla-byd.
UPDATE models SET
  price_usd    = 18990,
  price_source = 'BYD Uruguay, lista "Modelo 2027", jul 2026'
WHERE slug = 'byd-seagull-300-2026';

-- BYD Seagull GS: 21.990 → 20.990
UPDATE models SET
  price_usd    = 20990,
  price_source = 'BYD Uruguay, lista "Modelo 2027", jul 2026'
WHERE slug = 'byd-seagull-400-2026';

-- BYD Seagull Surf: 23.990 → 22.990
UPDATE models SET
  price_usd    = 22990,
  price_source = 'BYD Uruguay, lista "Modelo 2027", jul 2026'
WHERE slug = 'byd-seagull-surf-2026';

-- Historial
INSERT INTO price_history (model_id, price_usd, source, recorded_at)
SELECT m.id, v.price, v.src, v.fecha
FROM (VALUES
  ('chevrolet-captiva-ev-2026', 31990::numeric, 'Avisos de concesionaria oficial (Silca)',  '2026-08-03'::timestamptz),
  ('omoda-e5-comfort-2026',     25990::numeric, 'Avisos de concesionaria verificada',       '2026-08-03'::timestamptz),
  ('byd-seagull-300-2026',      18990::numeric, 'BYD Uruguay, lista "Modelo 2027"',         '2026-07-22'::timestamptz),
  ('byd-seagull-400-2026',      20990::numeric, 'BYD Uruguay, lista "Modelo 2027"',         '2026-07-22'::timestamptz),
  ('byd-seagull-surf-2026',     22990::numeric, 'BYD Uruguay, lista "Modelo 2027"',         '2026-07-22'::timestamptz)
) AS v(slug, price, src, fecha)
JOIN models m ON m.slug = v.slug;


-- ------------------------------------------------------------
-- 3. Ficha nueva — Omoda E5 Luxury Standard Range (51 kWh)
--
-- La gama del restyling tiene tres escalones y en la base solo
-- estaban dos. Va antes del bloque de specs comunes para que
-- las herede.
-- ------------------------------------------------------------

INSERT INTO models (
  slug, brand, model, variant, year_from, body, status,
  price_usd, price_source,
  battery_kwh, range_wltp_km, range_nedc_km,
  importer, available_uy
) VALUES (
  'omoda-e5-luxury-sr-2026', 'Omoda', 'E5', 'Luxury Standard Range', 2026, 'suv', 'published',
  27990, 'Avisos de concesionaria verificada, Montevideo, ago 2026',
  51, 350, 422,
  'Santa Rosa', true
)
ON CONFLICT (slug) DO NOTHING;


-- ------------------------------------------------------------
-- 4. Omoda E5 — specs comunes al restyling (MY2027)
--
-- El E5 se actualizó el 3/6/2026. Lo que estaba mal:
--   · torque 340 Nm → son 288 (los 340 son del modelo anterior)
--   · batería Luxury 61 kWh → son 59
--   · WLTP del Comfort 450 km → son 350 (los 450 son de la de 59)
--
-- Acá se pisa el valor viejo a propósito: no es completar
-- huecos, es corregir datos del modelo que ya no se vende.
-- ------------------------------------------------------------

UPDATE models SET
  body              = 'suv',
  power_hp          = 201,
  power_kw          = 150,
  torque_nm         = 288,
  accel_0_100_s     = 7.6,
  top_speed_kmh     = 172,
  drivetrain        = 'fwd',
  battery_chemistry = 'lfp',
  charge_ac_kw      = 9.9,
  charge_dc_kw      = 110,
  connector_ac      = 'type2',
  connector_dc      = 'ccs2',
  seats             = 5,
  trunk_l           = 370,
  frunk_l           = 19,
  weight_kg         = 1785,
  length_mm         = 4545,
  warranty_vehicle  = '5 años / 150.000 km',
  warranty_battery  = '8 años / 150.000 km',
  specs_json = models.specs_json || jsonb_build_object(
    'trunk_max_l',        1075,
    'width_mm',           1830,
    'height_mm',          1588,
    'wheelbase_mm',       2630,
    'ground_clearance_mm', 150,
    'tyres',              '215/60 R17',
    'motor_code',         'TZ210XS129',
    'charge_dc_range',    '20 → 80% en 28 min',
    'charge_ac_range',    '20 → 80% en 5 h 54 min',
    'specs_source',       'Autoblog Uruguay, lanzamiento Omoda E5 restyling, 03/06/2026'
  )
WHERE slug IN (
  'omoda-e5-comfort-2026',
  'omoda-e5-luxury-2026',
  'omoda-e5-luxury-sr-2026'
);

-- 4a) Comfort Standard Range — batería chica
UPDATE models SET
  battery_kwh   = 51,
  range_wltp_km = 350,
  range_nedc_km = 422
WHERE slug = 'omoda-e5-comfort-2026';

-- 4b) Luxury — batería grande. Estaba fichada como 61 kWh.
UPDATE models SET
  battery_kwh   = 59,
  range_wltp_km = 450,
  range_nedc_km = 505
WHERE slug = 'omoda-e5-luxury-2026';


-- ------------------------------------------------------------
-- 5. Chevrolet Captiva EV
--
-- Es el Wuling Starlight S, plataforma Tianyu D de GM-SAIC,
-- fabricado en Liuzhou. Una sola versión al lanzamiento (Premier).
--
-- Los 408 km que había fichados como WLTP no tenían fuente.
-- Los valores correctos son 318 km WLTP y 415 km NEDC: 97 km de
-- diferencia en el mismo auto, y el que la marca comunica es el
-- más alto. Es el mejor ejemplo del catálogo de por qué las dos
-- columnas tienen que estar separadas.
-- ------------------------------------------------------------

UPDATE models SET
  body                = 'suv',
  range_wltp_km       = 318,
  range_nedc_km       = 415,
  consumption_kwh_100 = 14.0,
  accel_0_100_s       = 8.9,   -- chevrolet.com.uy dice 8,9; Autoblog decía 9,9. Manda la marca.
  top_speed_kmh       = 170,
  charge_ac_kw        = 6.6,
  charge_dc_kw        = 100,
  connector_ac        = 'type2',
  connector_dc        = 'ccs2',
  battery_chemistry   = 'lfp',
  seats               = 5,
  trunk_l             = 532,
  weight_kg           = 1780,
  length_mm           = 4745,
  warranty_vehicle    = '3 años / 100.000 km',
  warranty_battery    = '8 años / 160.000 km',
  specs_json = models.specs_json || jsonb_build_object(
    'trunk_max_l',        1690,   -- chevrolet.com.uy; Autoblog decía 1.768
    'width_mm',           1890,
    'height_mm',          1680,
    'wheelbase_mm',       2800,
    'ground_clearance_mm', 180,
    'tyres',              '235/55 R18',
    'motor_code',         'TZ210XS2F0',
    'motor_tipo',         'Permanent Magnet, Bar Wound',
    'plataforma_bateria', 'MAGIC Battery',
    'platform',           'Tianyu D (GM-SAIC)',
    'origen',             'Liuzhou, China — gemelo del Wuling Starlight S',
    'charge_dc_range',    '30 → 80% en 20 min',
    'charge_ac_range',    '20 → 100% en 10 h',
    'specs_source',       'chevrolet.com.uy/vehiculos-electricos/captiva-ev (ago 2026) + Autoblog UY + Silca'
  )
WHERE slug = 'chevrolet-captiva-ev-2026';


-- ------------------------------------------------------------
-- 6. Verificación — leer la salida antes de confirmar
-- ------------------------------------------------------------

SELECT slug, brand, model, variant, price_usd,
       battery_kwh, range_wltp_km, range_nedc_km, torque_nm
FROM models
WHERE slug IN (
  'chevrolet-captiva-ev-2026',
  'omoda-e5-comfort-2026',
  'omoda-e5-luxury-sr-2026',
  'omoda-e5-luxury-2026',
  'byd-seagull-300-2026',
  'byd-seagull-400-2026',
  'byd-seagull-surf-2026'
)
ORDER BY brand, price_usd;

-- Esperado:
--   byd-seagull-300-2026        18990   ·  —   ·  —   ·  —
--   byd-seagull-400-2026        20990   ·  —   ·  —   ·  —
--   byd-seagull-surf-2026       22990   ·  —   ·  —   ·  —
--   chevrolet-captiva-ev-2026   31990   ·  60  ·  318 WLTP  · 415 NEDC
--   omoda-e5-comfort-2026       25990   ·  51  ·  350 WLTP  · 422 NEDC · 288 Nm
--   omoda-e5-luxury-sr-2026     27990   ·  51  ·  350 WLTP  · 422 NEDC · 288 Nm
--   omoda-e5-luxury-2026        31990   ·  59  ·  450 WLTP  · 505 NEDC · 288 Nm

COMMIT;

-- ============================================================
-- PENDIENTES que no resuelve esta migración
--
-- 1. charge_10_80_min no sirve como está. Ningún fabricante
--    declara 10→80: Chevrolet publica 30→80 y Omoda 20→80.
--    Por eso los rangos reales quedaron en specs_json y la
--    columna sin tocar. Vale renombrarla a charge_dc_min con
--    un charge_dc_range de texto al lado.
--
-- 2. Falta cargar range_nedc_km en el resto del catálogo. La
--    Captiva mostró que la brecha entre ciclos puede ser del 30%
--    (415 NEDC vs 318 WLTP), así que cualquier otra ficha cargada
--    desde material de marketing chino puede tener el mismo
--    problema: un NEDC sentado en la columna WLTP. Vale auditar
--    las que declaran autonomías sospechosamente altas para su
--    batería.
--
-- 3. Verificar con GM si se sumó una versión de acceso a la
--    Captiva: los avisos de agosto muestran "EV" y "EV Premier"
--    las dos a 31.990, y al lanzamiento había una sola.
--
-- 4. La columna imesi_pct existe desde 0001 y está sin usar.
--    Con el decreto del 30/06/2026 (5% entre USD 19.001 y
--    27.000 de CIF, 9% arriba de eso, desde el 1/1/2027) recién
--    ahora tiene sentido poblarla — aunque los valores CIF no
--    son públicos, así que habría que estimarlos o pedirlos.
-- ============================================================
