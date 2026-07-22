-- ============================================================
-- autoelectrico.uy — Migration 0003
-- Completa specs de modelos con datos verificados.
-- REGLA: dato sin fuente confiable = NULL. Nunca estimado.
-- Fuentes: EV-Database.org, Wikipedia, fichas oficiales.
-- ============================================================

BEGIN;

-- ============================================================
-- Kia EV3 Standard Range (fuente: EV-Database, Kia EV3 MY25-26)
-- ============================================================
UPDATE models SET
  battery_kwh = 55.0,
  battery_chemistry = 'nmc',
  consumption_kwh_100 = 16.9,
  charge_ac_kw = 11,
  charge_dc_kw = 80,
  connector_ac = 'type2',
  connector_dc = 'ccs2',
  charge_10_80_min = 30,
  v2l = true,
  power_hp = 204,
  torque_nm = 283,
  accel_0_100_s = 7.5,
  top_speed_kmh = 170,
  drivetrain = 'fwd',
  seats = 5,
  trunk_l = 485,
  weight_kg = 1800,
  length_mm = 4300,
  warranty_vehicle = '7 años / 150.000 km',
  warranty_battery = '8 años / 160.000 km'
WHERE slug = 'kia-ev3-standard-range-2026';

-- ============================================================
-- Kia EV3 Long Range (fuente: EV-Database, Kia EV3 MY25-26)
-- ============================================================
UPDATE models SET
  battery_kwh = 78.0,
  battery_chemistry = 'nmc',
  consumption_kwh_100 = 17.1,
  charge_ac_kw = 11,
  charge_dc_kw = 105,
  connector_ac = 'type2',
  connector_dc = 'ccs2',
  charge_10_80_min = 31,
  v2l = true,
  power_hp = 204,
  torque_nm = 283,
  accel_0_100_s = 7.7,
  top_speed_kmh = 170,
  drivetrain = 'fwd',
  seats = 5,
  trunk_l = 485,
  weight_kg = 1885,
  length_mm = 4300,
  warranty_vehicle = '7 años / 150.000 km',
  warranty_battery = '8 años / 160.000 km'
WHERE slug = 'kia-ev3-long-range-2026';

-- ============================================================
-- BYD Seal RWD (fuente: EV-Database, BYD SEAL 82.5 kWh RWD Design MY26)
-- ============================================================
UPDATE models SET
  battery_kwh = 82.5,
  battery_chemistry = 'lfp',
  consumption_kwh_100 = 17.2,
  charge_ac_kw = 11,
  charge_dc_kw = 100,
  connector_ac = 'type2',
  connector_dc = 'ccs2',
  charge_10_80_min = 32,
  v2l = true,
  power_hp = 272,
  torque_nm = 360,
  accel_0_100_s = 5.9,
  top_speed_kmh = 180,
  drivetrain = 'rwd',
  seats = 5,
  trunk_l = 557,
  weight_kg = 2130,
  length_mm = 4800,
  warranty_vehicle = '6 años / 150.000 km',
  warranty_battery = '8 años / 160.000 km'
WHERE slug = 'byd-seal-2026';

-- ============================================================
-- BYD Seal 4WD (fuente: EV-Database, BYD SEAL AWD Excellence)
-- ============================================================
UPDATE models SET
  battery_kwh = 82.5,
  battery_chemistry = 'lfp',
  consumption_kwh_100 = 18.5,
  charge_ac_kw = 11,
  charge_dc_kw = 100,
  connector_ac = 'type2',
  connector_dc = 'ccs2',
  charge_10_80_min = 32,
  v2l = true,
  power_hp = 530,
  torque_nm = 670,
  accel_0_100_s = 3.8,
  top_speed_kmh = 180,
  drivetrain = 'awd',
  seats = 5,
  trunk_l = 453,
  weight_kg = 2260,
  length_mm = 4800,
  warranty_vehicle = '6 años / 150.000 km',
  warranty_battery = '8 años / 160.000 km'
WHERE slug = 'byd-seal-4wd-2026';

-- ============================================================
-- Fiat 600e (fuente: EV-Database, Fiat 600e)
-- ============================================================
UPDATE models SET
  battery_kwh = 50.8,
  battery_chemistry = 'nmc',
  consumption_kwh_100 = 16.4,
  charge_ac_kw = 11,
  charge_dc_kw = 79,
  connector_ac = 'type2',
  connector_dc = 'ccs2',
  charge_10_80_min = 35,
  v2l = false,
  power_hp = 156,
  torque_nm = 260,
  accel_0_100_s = 9.0,
  top_speed_kmh = 150,
  drivetrain = 'fwd',
  seats = 5,
  trunk_l = 360,
  weight_kg = 1595,
  length_mm = 4171,
  warranty_vehicle = '2 años / 100.000 km',
  warranty_battery = '8 años / 160.000 km'
WHERE slug = 'fiat-600e-2026';

-- ============================================================
-- BYD Dolphin — ya tenía datos parciales. Completamos los que faltan.
-- (fuente: BYD Uruguay, Wikipedia, EV-Database)
-- ============================================================
UPDATE models SET
  battery_chemistry = 'lfp',
  charge_ac_kw = 7,
  connector_ac = 'type2',
  connector_dc = 'ccs2',
  torque_nm = 310,
  top_speed_kmh = 160,
  drivetrain = 'fwd',
  weight_kg = 1405,
  length_mm = 4290,
  warranty_vehicle = '6 años / 150.000 km',
  importer = 'SADAR'
WHERE slug = 'byd-dolphin-2026';

-- ============================================================
-- BYD Yuan Plus (Atto 3) — completamos los que faltan.
-- (fuente: BYD Uruguay, Wikipedia, EV-Database)
-- ============================================================
UPDATE models SET
  battery_chemistry = 'lfp',
  charge_ac_kw = 7,
  connector_ac = 'type2',
  connector_dc = 'ccs2',
  torque_nm = 310,
  top_speed_kmh = 160,
  drivetrain = 'fwd',
  v2l = true,
  weight_kg = 1750,
  length_mm = 4455,
  warranty_vehicle = '6 años / 150.000 km',
  importer = 'SADAR'
WHERE slug = 'byd-yuan-plus-2026';

-- ============================================================
-- Geely EX5 — ya tenía datos casi completos. Completamos huecos.
-- (fuente: Geely Uruguay / Grupo Fiancar)
-- ============================================================
UPDATE models SET
  connector_ac = 'type2',
  connector_dc = 'ccs2',
  charge_10_80_min = 30,
  top_speed_kmh = 175,
  trunk_l = 461,
  warranty_vehicle = '5 años / 150.000 km',
  warranty_battery = '8 años / 150.000 km'
WHERE slug = 'geely-ex5-2026';

COMMIT;

-- ============================================================
-- Verificación post-migración:
-- SELECT slug, brand, model, consumption_kwh_100, battery_kwh, power_hp
-- FROM models WHERE status = 'draft'
-- ORDER BY brand, model;
-- ============================================================