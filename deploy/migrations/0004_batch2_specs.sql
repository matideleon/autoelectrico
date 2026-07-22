-- ============================================================
-- autoelectrico.uy — Migration 0004
-- Segunda tanda de specs verificadas de EV-Database.
-- USA COALESCE: no sobreescribe datos existentes.
-- ============================================================

BEGIN;

-- ============================================================
-- Kia EV5 88.1 2WD ≈ EV-Database Kia EV5 81.4 kWh (MY26)
-- La DB tiene 88.1 kWh (bruto); EV-DB reporta 78 kWh usable.
-- Solo llenamos campos NULL, respetando el valor de batería existente.
-- ============================================================
UPDATE models SET
  consumption_kwh_100 = COALESCE(models.consumption_kwh_100, 19.0),
  charge_ac_kw = COALESCE(models.charge_ac_kw, 11),
  charge_dc_kw = COALESCE(models.charge_dc_kw, 115),
  connector_ac = COALESCE(models.connector_ac, 'type2'),
  connector_dc = COALESCE(models.connector_dc, 'ccs2'),
  charge_10_80_min = COALESCE(models.charge_10_80_min, 32),
  v2l = COALESCE(models.v2l, true),
  power_hp = COALESCE(models.power_hp, 218),
  torque_nm = COALESCE(models.torque_nm, 255),
  accel_0_100_s = COALESCE(models.accel_0_100_s, 8.4),
  top_speed_kmh = COALESCE(models.top_speed_kmh, 175),
  drivetrain = COALESCE(models.drivetrain, 'fwd'),
  seats = COALESCE(models.seats, 5),
  trunk_l = COALESCE(models.trunk_l, 610),
  weight_kg = COALESCE(models.weight_kg, 2069),
  length_mm = COALESCE(models.length_mm, 4615),
  battery_chemistry = COALESCE(models.battery_chemistry, 'nmc'),
  warranty_vehicle = COALESCE(models.warranty_vehicle, '7 años / 150.000 km'),
  warranty_battery = COALESCE(models.warranty_battery, '8 años / 160.000 km')
WHERE slug = 'kia-ev5-88-1-2wd-2026';

-- ============================================================
-- Kia EV5 88.1 4WD ≈ EV-Database Kia EV5 81.4 kWh GT (MY26)
-- ============================================================
UPDATE models SET
  consumption_kwh_100 = COALESCE(models.consumption_kwh_100, 20.3),
  charge_ac_kw = COALESCE(models.charge_ac_kw, 11),
  charge_dc_kw = COALESCE(models.charge_dc_kw, 115),
  connector_ac = COALESCE(models.connector_ac, 'type2'),
  connector_dc = COALESCE(models.connector_dc, 'ccs2'),
  charge_10_80_min = COALESCE(models.charge_10_80_min, 32),
  v2l = COALESCE(models.v2l, true),
  power_hp = COALESCE(models.power_hp, 306),
  torque_nm = COALESCE(models.torque_nm, 700),
  accel_0_100_s = COALESCE(models.accel_0_100_s, 6.2),
  top_speed_kmh = COALESCE(models.top_speed_kmh, 185),
  drivetrain = COALESCE(models.drivetrain, 'awd'),
  seats = COALESCE(models.seats, 5),
  trunk_l = COALESCE(models.trunk_l, 610),
  weight_kg = COALESCE(models.weight_kg, 2205),
  length_mm = COALESCE(models.length_mm, 4615),
  battery_chemistry = COALESCE(models.battery_chemistry, 'nmc'),
  warranty_vehicle = COALESCE(models.warranty_vehicle, '7 años / 150.000 km'),
  warranty_battery = COALESCE(models.warranty_battery, '8 años / 160.000 km')
WHERE slug = 'kia-ev5-88-1-4wd-2026';

-- ============================================================
-- Jeep Avenger Summit (fuente: EV-Database)
-- ============================================================
UPDATE models SET
  battery_kwh = COALESCE(models.battery_kwh, 50.8),
  battery_chemistry = COALESCE(models.battery_chemistry, 'nmc'),
  consumption_kwh_100 = COALESCE(models.consumption_kwh_100, 16.4),
  charge_ac_kw = COALESCE(models.charge_ac_kw, 11),
  charge_dc_kw = COALESCE(models.charge_dc_kw, 79),
  connector_ac = COALESCE(models.connector_ac, 'type2'),
  connector_dc = COALESCE(models.connector_dc, 'ccs2'),
  charge_10_80_min = COALESCE(models.charge_10_80_min, 24),
  v2l = COALESCE(models.v2l, false),
  power_hp = COALESCE(models.power_hp, 156),
  torque_nm = COALESCE(models.torque_nm, 260),
  accel_0_100_s = COALESCE(models.accel_0_100_s, 9.0),
  top_speed_kmh = COALESCE(models.top_speed_kmh, 150),
  drivetrain = COALESCE(models.drivetrain, 'fwd'),
  seats = COALESCE(models.seats, 5),
  trunk_l = COALESCE(models.trunk_l, 355),
  weight_kg = COALESCE(models.weight_kg, 1595),
  length_mm = COALESCE(models.length_mm, 4084),
  warranty_vehicle = COALESCE(models.warranty_vehicle, '2 años / 100.000 km'),
  warranty_battery = COALESCE(models.warranty_battery, '8 años / 160.000 km')
WHERE slug = 'jeep-avenger-summit-2026';

-- ============================================================
-- Mini Aceman SE Favoured (fuente: EV-Database)
-- ============================================================
UPDATE models SET
  battery_kwh = COALESCE(models.battery_kwh, 49.2),
  battery_chemistry = COALESCE(models.battery_chemistry, 'nmc'),
  consumption_kwh_100 = COALESCE(models.consumption_kwh_100, 17.0),
  charge_ac_kw = COALESCE(models.charge_ac_kw, 11),
  charge_dc_kw = COALESCE(models.charge_dc_kw, 75),
  connector_ac = COALESCE(models.connector_ac, 'type2'),
  connector_dc = COALESCE(models.connector_dc, 'ccs2'),
  charge_10_80_min = COALESCE(models.charge_10_80_min, 28),
  v2l = COALESCE(models.v2l, false),
  power_hp = COALESCE(models.power_hp, 218),
  torque_nm = COALESCE(models.torque_nm, 330),
  accel_0_100_s = COALESCE(models.accel_0_100_s, 7.1),
  top_speed_kmh = COALESCE(models.top_speed_kmh, 170),
  drivetrain = COALESCE(models.drivetrain, 'fwd'),
  seats = COALESCE(models.seats, 5),
  trunk_l = COALESCE(models.trunk_l, 300),
  weight_kg = COALESCE(models.weight_kg, 1785),
  length_mm = COALESCE(models.length_mm, 4079),
  warranty_vehicle = COALESCE(models.warranty_vehicle, '3 años / 100.000 km'),
  warranty_battery = COALESCE(models.warranty_battery, '8 años / 160.000 km')
WHERE slug = 'mini-aceman-se-favoured-2026';

COMMIT;