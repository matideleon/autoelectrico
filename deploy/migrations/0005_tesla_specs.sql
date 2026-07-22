-- ============================================================
-- autoelectrico.uy — Migration 0005
-- Tesla + marcas premium. EV-Database, datos verificados.
-- USA COALESCE: no sobreescribe.
-- ============================================================

BEGIN;

-- Tesla Model 3 RWD (Highland, MY26) — EV-Database
UPDATE models SET
  battery_kwh = COALESCE(models.battery_kwh, 60.0),
  battery_chemistry = COALESCE(models.battery_chemistry, 'nmc'),
  consumption_kwh_100 = COALESCE(models.consumption_kwh_100, 13.3),
  charge_ac_kw = COALESCE(models.charge_ac_kw, 11),
  charge_dc_kw = COALESCE(models.charge_dc_kw, 110),
  connector_ac = COALESCE(models.connector_ac, 'type2'),
  connector_dc = COALESCE(models.connector_dc, 'ccs2'),
  charge_10_80_min = COALESCE(models.charge_10_80_min, 25),
  v2l = COALESCE(models.v2l, false),
  power_hp = COALESCE(models.power_hp, 283),
  accel_0_100_s = COALESCE(models.accel_0_100_s, 6.2),
  top_speed_kmh = COALESCE(models.top_speed_kmh, 201),
  drivetrain = COALESCE(models.drivetrain, 'rwd'),
  seats = COALESCE(models.seats, 5),
  trunk_l = COALESCE(models.trunk_l, 682),
  weight_kg = COALESCE(models.weight_kg, 1847),
  length_mm = COALESCE(models.length_mm, 4720),
  warranty_vehicle = COALESCE(models.warranty_vehicle, '4 años / 80.000 km'),
  warranty_battery = COALESCE(models.warranty_battery, '8 años / 160.000 km')
WHERE slug LIKE 'tesla-model-3%';

-- Tesla Model Y RWD (Juniper, MY26) — EV-Database
UPDATE models SET
  battery_kwh = COALESCE(models.battery_kwh, 60.0),
  battery_chemistry = COALESCE(models.battery_chemistry, 'nmc'),
  consumption_kwh_100 = COALESCE(models.consumption_kwh_100, 15.8),
  charge_ac_kw = COALESCE(models.charge_ac_kw, 11),
  charge_dc_kw = COALESCE(models.charge_dc_kw, 110),
  connector_ac = COALESCE(models.connector_ac, 'type2'),
  connector_dc = COALESCE(models.connector_dc, 'ccs2'),
  charge_10_80_min = COALESCE(models.charge_10_80_min, 25),
  v2l = COALESCE(models.v2l, false),
  power_hp = COALESCE(models.power_hp, 283),
  accel_0_100_s = COALESCE(models.accel_0_100_s, 7.2),
  top_speed_kmh = COALESCE(models.top_speed_kmh, 217),
  drivetrain = COALESCE(models.drivetrain, 'rwd'),
  seats = COALESCE(models.seats, 5),
  trunk_l = COALESCE(models.trunk_l, 952),
  weight_kg = COALESCE(models.weight_kg, 1981),
  length_mm = COALESCE(models.length_mm, 4751),
  warranty_vehicle = COALESCE(models.warranty_vehicle, '4 años / 80.000 km'),
  warranty_battery = COALESCE(models.warranty_battery, '8 años / 160.000 km')
WHERE slug LIKE 'tesla-model-y' AND slug NOT LIKE '%awd%' AND slug NOT LIKE '%4wd%' AND slug NOT LIKE '%long%' AND slug NOT LIKE '%performance%';

-- Tesla Model Y AWD/Long Range (Juniper) — EV-Database
UPDATE models SET
  battery_kwh = COALESCE(models.battery_kwh, 75.0),
  battery_chemistry = COALESCE(models.battery_chemistry, 'nmc'),
  consumption_kwh_100 = COALESCE(models.consumption_kwh_100, 16.5),
  charge_ac_kw = COALESCE(models.charge_ac_kw, 11),
  charge_dc_kw = COALESCE(models.charge_dc_kw, 124),
  connector_ac = COALESCE(models.connector_ac, 'type2'),
  connector_dc = COALESCE(models.connector_dc, 'ccs2'),
  charge_10_80_min = COALESCE(models.charge_10_80_min, 27),
  v2l = COALESCE(models.v2l, false),
  power_hp = COALESCE(models.power_hp, 384),
  accel_0_100_s = COALESCE(models.accel_0_100_s, 4.8),
  top_speed_kmh = COALESCE(models.top_speed_kmh, 217),
  drivetrain = COALESCE(models.drivetrain, 'awd'),
  seats = COALESCE(models.seats, 5),
  trunk_l = COALESCE(models.trunk_l, 971),
  weight_kg = COALESCE(models.weight_kg, 2072),
  length_mm = COALESCE(models.length_mm, 4751),
  warranty_vehicle = COALESCE(models.warranty_vehicle, '4 años / 80.000 km'),
  warranty_battery = COALESCE(models.warranty_battery, '8 años / 160.000 km')
WHERE slug LIKE 'tesla-model-y' AND (slug LIKE '%awd%' OR slug LIKE '%4wd%' OR slug LIKE '%long%' OR slug LIKE '%performance%');

COMMIT;