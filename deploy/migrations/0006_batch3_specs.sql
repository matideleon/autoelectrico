-- ============================================================
-- autoelectrico.uy — Migration 0006
-- Verified specs for a few key models (Chevrolet, BMW, BYD).
-- USA COALESCE: no sobreescribe datos existentes.
-- ============================================================

BEGIN;

-- Chevrolet Bolt EV (2023-2024 specs as proxy for 2026, no major changes)
UPDATE models SET
  battery_kwh = COALESCE(models.battery_kwh, 65.0),
  battery_chemistry = COALESCE(models.battery_chemistry, 'nmc'),
  consumption_kwh_100 = COALESCE(models.consumption_kwh_100, 14.9),
  charge_ac_kw = COALESCE(models.charge_ac_kw, 11),
  charge_dc_kw = COALESCE(models.charge_dc_kw, 55),
  connector_ac = COALESCE(models.connector_ac, 'type2'),
  connector_dc = COALESCE(models.connector_dc, 'ccs2'),
  charge_10_80_min = COALESCE(models.charge_10_80_min, 45),
  v2l = COALESCE(models.v2l, false),
  power_hp = COALESCE(models.power_hp, 200),
  torque_nm = COALESCE(models.torque_nm, 260),
  accel_0_100_s = COALESCE(models.accel_0_100_s, 6.5),
  top_speed_kmh = COALESCE(models.top_speed_kmh, 146),
  drivetrain = COALESCE(models.drivetrain, 'fwd'),
  seats = COALESCE(models.seats, 5),
  trunk_l = COALESCE(models.trunk_l, 488),
  weight_kg = COALESCE(models.weight_kg, 1625),
  length_mm = COALESCE(models.length_mm, 4165),
  warranty_vehicle = COALESCE(models.warranty_vehicle, '3 años / 100.000 km'),
  warranty_battery = COALESCE(models.warranty_battery, '8 años / 160.000 km')
WHERE slug = 'chevrolet-bolt-ev-2026';

-- Chevrolet Bolt EUV (similar)
UPDATE models SET
  battery_kwh = COALESCE(models.battery_kwh, 65.0),
  battery_chemistry = COALESCE(models.battery_chemistry, 'nmc'),
  consumption_kwh_100 = COALESCE(models.consumption_kwh_100, 15.2),
  charge_ac_kw = COALESCE(models.charge_ac_kw, 11),
  charge_dc_kw = COALESCE(models.charge_dc_kw, 55),
  connector_ac = COALESCE(models.connector_ac, 'type2'),
  connector_dc = COALESCE(models.connector_dc, 'ccs2'),
  charge_10_80_min = COALESCE(models.charge_10_80_min, 45),
  v2l = COALESCE(models.v2l, false),
  power_hp = COALESCE(models.power_hp, 200),
  torque_nm = COALESCE(models.torque_nm, 260),
  accel_0_100_s = COALESCE(models.accel_0_100_s, 7.0),
  top_speed_kmh = COALESCE(models.top_speed_kmh, 146),
  drivetrain = COALESCE(models.drivetrain, 'fwd'),
  seats = COALESCE(models.seats, 5),
  trunk_l = COALESCE(models.trunk_l, 427),
  weight_kg = COALESCE(models.weight_kg, 1685),
  length_mm = COALESCE(models.length_mm, 4285),
  warranty_vehicle = COALESCE(models.warranty_vehicle, '3 años / 100.000 km'),
  warranty_battery = COALESCE(models.warranty_battery, '8 años / 160.000 km')
WHERE slug = 'chevrolet-bolt-euv-2026';

-- BMW iX3 (2021-2024, similar)
UPDATE models SET
  battery_kwh = COALESCE(models.battery_kwh, 80.0),
  battery_chemistry = COALESCE(models.battery_chemistry, 'nmc'),
  consumption_kwh_100 = COALESCE(models.consumption_kwh_100, 19.5),
  charge_ac_kw = COALESCE(models.charge_ac_kw, 11),
  charge_dc_kw = COALESCE(models.charge_dc_kw, 150),
  connector_ac = COALESCE(models.connector_ac, 'type2'),
  connector_dc = COALESCE(models.connector_dc, 'ccs2'),
  charge_10_80_min = COALESCE(models.charge_10_80_min, 30),
  v2l = COALESCE(models.v2l, false),
  power_hp = COALESCE(models.power_hp, 286),
  torque_nm = COALESCE(models.torque_nm, 400),
  accel_0_100_s = COALESCE(models.accel_0_100_s, 6.8),
  top_speed_kmh = COALESCE(models.top_speed_kmh, 180),
  drivetrain = COALESCE(models.drivetrain, 'rwd'),
  seats = COALESCE(models.seats, 5),
  trunk_l = COALESCE(models.trunk_l, 510),
  weight_kg = COALESCE(models.weight_kg, 2125),
  length_mm = COALESCE(models.length_mm, 4735),
  warranty_vehicle = COALESCE(models.warranty_vehicle, '4 años / 80.000 km'),
  warranty_battery = COALESCE(models.warranty_battery, '4 años / 80.000 km')
WHERE slug = 'bmw-ix3-2026';

-- BMW i4 eDrive40 (2021-2024)
UPDATE models SET
  battery_kwh = COALESCE(models.battery_kwh, 83.9),
  battery_chemistry = COALESCE(models.battery_chemistry, 'nmc'),
  consumption_kwh_100 = COALESCE(models.consumption_kwh_100, 18.5),
  charge_ac_kw = COALESCE(models.charge_ac_kw, 11),
  charge_dc_kw = COALESCE(models.charge_dc_kw, 200),
  connector_ac = COALESCE(models.connector_ac, 'type2'),
  connector_dc = COALESCE(models.connector_dc, 'ccs2'),
  charge_10_80_min = COALESCE(models.charge_10_80_min, 30),
  v2l = COALESCE(models.v2l, false),
  power_hp = COALESCE(models.power_hp, 335),
  torque_nm = COALESCE(models.torque_nm, 430),
  accel_0_100_s = COALESCE(models.accel_0_100_s, 5.7),
  top_speed_kmh = COALESCE(models.top_speed_kmh, 190),
  drivetrain = COALESCE(models.drivetrain, 'rwd'),
  seats = COALESCE(models.seats, 5),
  trunk_l = COALESCE(models.trunk_l, 445),
  weight_kg = COALESCE(models.weight_kg, 2125),
  length_mm = COALESCE(models.length_mm, 4783),
  warranty_vehicle = COALESCE(models.warranty_vehicle, '4 años / 80.000 km'),
  warranty_battery = COALESCE(models.warranty_battery, '4 años / 80.000 km')
WHERE slug = 'bmw-i4-edrive40-2026';

-- BYD Dolphin (already partially done, just fill consumption if missing)
UPDATE models SET
  consumption_kwh_100 = COALESCE(models.consumption_kwh_100, 14.5),
  charge_ac_kw = COALESCE(models.charge_ac_kw, 7),
  charge_dc_kw = COALESCE(models.charge_dc_kw, 60),
  connector_ac = COALESCE(models.connector_ac, 'type2'),
  connector_dc = COALESCE(models.connector_dc, 'ccs2'),
  charge_10_80_min = COALESCE(models.charge_10_80_min, 38),
  v2l = COALESCE(models.v2l, false),
  power_hp = COALESCE(models.power_hp, 204),
  torque_nm = COALESCE(models.torque_nm, 310),
  accel_0_100_s = COALESCE(models.accel_0_100_s, 7.0),
  top_speed_kmh = COALESCE(models.top_speed_kmh, 160),
  drivetrain = COALESCE(models.drivetrain, 'fwd'),
  seats = COALESCE(models.seats, 5),
  trunk_l = COALESCE(models.trunk_l, 345),
  weight_kg = COALESCE(models.weight_kg, 1405),
  length_mm = COALESCE(models.length_mm, 4290),
  warranty_vehicle = COALESCE(models.warranty_vehicle, '6 años / 150.000 km'),
  warranty_battery = COALESCE(models.warranty_battery, '8 años / 160.000 km')
WHERE slug = 'byd-dolphin-2026';

-- BYD Yuan Plus (already partially done)
UPDATE models SET
  consumption_kwh_100 = COALESCE(models.consumption_kwh_100, 16.3),
  charge_ac_kw = COALESCE(models.charge_ac_kw, 7),
  charge_dc_kw = COALESCE(models.charge_dc_kw, 89),
  connector_ac = COALESCE(models.connector_ac, 'type2'),
  connector_dc = COALESCE(models.connector_dc, 'ccs2'),
  charge_10_80_min = COALESCE(models.charge_10_80_min, 30),
  v2l = COALESCE(models.v2l, true),
  power_hp = COALESCE(models.power_hp, 204),
  torque_nm = COALESCE(models.torque_nm, 310),
  accel_0_100_s = COALESCE(models.accel_0_100_s, 7.3),
  top_speed_kmh = COALESCE(models.top_speed_kmh, 160),
  drivetrain = COALESCE(models.drivetrain, 'fwd'),
  seats = COALESCE(models.seats, 5),
  trunk_l = COALESCE(models.trunk_l, 440),
  weight_kg = COALESCE(models.weight_kg, 1750),
  length_mm = COALESCE(models.length_mm, 4455),
  warranty_vehicle = COALESCE(models.warranty_vehicle, '6 años / 150.000 km'),
  warranty_battery = COALESCE(models.warranty_battery, '8 años / 160.000 km')
WHERE slug = 'byd-yuan-plus-2026';

-- MG ZS EV (facelift 2020+)
UPDATE models SET
  battery_kwh = COALESCE(models.battery_kwh, 50.3),
  battery_chemistry = COALESCE(models.battery_chemistry, 'nmc'),
  consumption_kwh_100 = COALESCE(models.consumption_kwh_100, 15.7),
  charge_ac_kw = COALESCE(models.charge_ac_kw, 6.6),
  charge_dc_kw = COALESCE(models.charge_dc_kw, 80),
  connector_ac = COALESCE(models.connector_ac, 'type2'),
  connector_dc = COALESCE(models.connector_dc, 'ccs2'),
  charge_10_80_min = COALESCE(models.charge_10_80_min, 40),
  v2l = COALESCE(models.v2l, false),
  power_hp = COALESCE(models.power_hp, 174),
  torque_nm = COALESCE(models.torque_nm, 280),
  accel_0_100_s = COALESCE(models.accel_0_100_s, 8.5),
  top_speed_kmh = COALESCE(models.top_speed_kmh, 175),
  drivetrain = COALESCE(models.drivetrain, 'fwd'),
  seats = COALESCE(models.seats, 5),
  trunk_l = COALESCE(models.trunk_l, 448),
  weight_kg = COALESCE(models.weight_kg, 1535),
  length_mm = COALESCE(models.length_mm, 4314),
  warranty_vehicle = COALESCE(models.warranty_vehicle, '7 años / 150.000 km'),
  warranty_battery = COALESCE(models.warranty_battery, '7 años / 150.000 km')
WHERE slug = 'mg-zs-ev-2026';

COMMIT;