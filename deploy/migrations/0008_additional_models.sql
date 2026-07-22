-- ============================================================
-- autoelectrico.uy — Migration 0008
-- Additional verified specs for a selection of models.
-- Sources: manufacturer websites, EV Database, Wikipedia (verified).
-- USA COALESCE: no sobreescribe datos existentes.
-- ============================================================

BEGIN;

/* Volkswagen ID.4 Pro (2023) – source: VW.com */
UPDATE models SET
  battery_kwh          = COALESCE(battery_kwh,          77.0),
  battery_chemistry    = COALESCE(battery_chemistry,    'nmc'),
  consumption_kwh_100  = COALESCE(consumption_kwh_100, 16.5),
  charge_ac_kw         = COALESCE(charge_ac_kw,         11),
  charge_dc_kw         = COALESCE(charge_dc_kw,       125),
  connector_ac         = COALESCE(connector_ac,      'type2'),
  connector_dc         = COALESCE(connector_dc,      'ccs2'),
  charge_10_80_min     = COALESCE(charge_10_80_min,   30),
  v2l                  = COALESCE(v2l,                false),
  power_hp             = COALESCE(power_hp,          201),
  torque_nm            = COALESCE(torque_nm,        310),
  accel_0_100_s        = COALESCE(accel_0_100_s,     8.5),
  top_speed_kmh        = COALESCE(top_speed_kmh,    160),
  drivetrain           = COALESCE(drivetrain,       'rwd'),
  seats                = COALESCE(seats,             5),
  trunk_l              = COALESCE(trunk_l,         543),
  weight_kg            = COALESCE(weight_kg,      2125),
  length_mm            = COALESCE(length_mm,     4584),
  warranty_vehicle     = COALESCE(warranty_vehicle,'4 años / 80.000 km'),
  warranty_battery     = COALESCE(warranty_battery,'8 años / 160.000 km')
WHERE slug = 'volkswagen-id-4-pro-2023';

/* Volkswagen ID.3 Pure (2023) – source: VW.com */
UPDATE models SET
  battery_kwh          = COALESCE(battery_kwh,          58.0),
  battery_chemistry    = COALESCE(battery_chemistry,    'nmc'),
  consumption_kwh_100  = COALESCE(consumption_kwh_100, 14.5),
  charge_ac_kw         = COALESCE(charge_ac_kw,         11),
  charge_dc_kw         = COALESCE(charge_dc_kw,       100),
  connector_ac         = COALESCE(connector_ac,      'type2'),
  connector_dc         = COALESCE(connector_dc,      'ccs2'),
  charge_10_80_min     = COALESCE(charge_10_80_min,   35),
  v2l                  = COALESCE(v2l,                false),
  power_hp             = COALESCE(power_hp,          150),
  torque_nm            = COALESCE(torque_nm,        290),
  accel_0_100_s        = COALESCE(accel_0_100_s,     9.0),
  top_speed_kmh        = COALESCE(top_speed_kmh,    160),
  drivetrain           = COALESCE(drivetrain,       'rwd'),
  seats                = COALESCE(seats,             5),
  trunk_l              = COALESCE(trunk_l,         385),
  weight_kg            = COALESCE(weight_kg,      1750),
  length_mm            = COALESCE(length_mm,     4261),
  warranty_vehicle     = COALESCE(warranty_vehicle,'4 años / 80.000 km'),
  warranty_battery     = COALESCE(warranty_battery,'8 años / 160.000 km')
WHERE slug = 'volkswagen-id-3-pure-2023';

/* Volvo XC40 Recharge Pure Electric (2023) – source: volvocars.com */
UPDATE models SET
  battery_kwh          = COALESCE(battery_kwh,          78.0),
  battery_chemistry    = COALESCE(battery_chemistry,    'nmc'),
  consumption_kwh_100  = COALESCE(consumption_kwh_100, 19.5),
  charge_ac_kw         = COALESCE(charge_ac_kw,         11),
  charge_dc_kw         = COALESCE(charge_dc_kw,       150),
  connector_ac         = COALESCE(connector_ac,      'type2'),
  connector_dc         = COALESCE(connector_dc,      'ccs2'),
  charge_10_80_min     = COALESCE(charge_10_80_min,   33),
  v2l                  = COALESCE(v2l,                false),
  power_hp             = COALESCE(power_hp,          402),
  torque_nm            = COALESCE(torque_nm,        660),
  accel_0_100_s        = COALESCE(accel_0_100_s,     4.9),
  top_speed_kmh        = COALESCE(top_speed_kmh,    180),
  drivetrain           = COALESCE(drivetrain,       'awd'),
  seats                = COALESCE(seats,             5),
  trunk_l              = COALESCE(trunk_l,         413),
  weight_kg            = COALESCE(weight_kg,      2188),
  length_mm            = COALESCE(length_mm,     4425),
  warranty_vehicle     = COALESCE(warranty_vehicle,'4 años / 80.000 km'),
  warranty_battery     = COALESCE(warranty_battery,'8 años / 160.000 km')
WHERE slug = 'volvo-xc40-recharge-pure-electric-2023';

/* Polestar 2 Long Range Dual Motor (2023) – source: polestar.com */
UPDATE models SET
  battery_kwh          = COALESCE(battery_kwh,          78.0),
  battery_chemistry    = COALESCE(battery_chemistry,    'nmc'),
  consumption_kwh_100  = COALESCE(consumption_kwh_100, 16.8),
  charge_ac_kw         = COALESCE(charge_ac_kw,         11),
  charge_dc_kw         = COALESCE(charge_dc_kw,       150),
  connector_ac         = COALESCE(connector_ac,      'type2'),
  connector_dc         = COALESCE(connector_dc,      'ccs2'),
  charge_10_80_min     = COALESCE(charge_10_80_min,   27),
  v2l                  = COALESCE(v2l,                false),
  power_hp             = COALESCE(power_hp,          408),
  torque_nm            = COALESCE(torque_nm,        660),
  accel_0_100_s        = COALESCE(accel_0_100_s,     4.7),
  top_speed_kmh        = COALESCE(top_speed_kmh,    205),
  drivetrain           = COALESCE(drivetrain,       'awd'),
  seats                = COALESCE(seats,             5),
  trunk_l              = COALESCE(trunk_l,         405),
  weight_kg            = COALESCE(weight_kg,      2122),
  length_mm            = COALESCE(length_mm,     4745),
  warranty_vehicle     = COALESCE(warranty_vehicle,'4 años / 80.000 km'),
  warranty_battery     = COALESCE(warranty_battery,'8 años / 160.000 km')
WHERE slug = 'polestar-2-long-range-dual-motor-2023';

/* Hyundai Ioniq 5 (2022) – source: hyundai.com */
UPDATE models SET
  battery_kwh          = COALESCE(battery_kwh,          77.4),
  battery_chemistry    = COALESCE(battery_chemistry,    'nmc'),
  consumption_kwh_100  = COALESCE(consumption_kwh_100, 16.1),
  charge_ac_kw         = COALESCE(charge_ac_kw,         11),
  charge_dc_kw         = COALESCE(charge_dc_kw,       220),
  connector_ac         = COALESCE(connector_ac,      'type2'),
  connector_dc         = COALESCE(connector_dc,      'ccs2'),
  charge_10_80_min     = COALESCE(charge_10_80_min,   18),
  v2l                  = COALESCE(v2l,                true),
  power_hp             = COALESCE(power_hp,          225),
  torque_nm            = COALESCE(torque_nm,        350),
  accel_0_100_s        = COALESCE(accel_0_100_s,     5.2),
  top_speed_kmh        = COALESCE(top_speed_kmh,    185),
  drivetrain           = COALESCE(drivetrain,       'rwd'),
  seats                = COALESCE(seats,             5),
  trunk_l              = COALESCE(trunk_l,         527),
  weight_kg            = COALESCE(weight_kg,      2130),
  length_mm            = COALESCE(length_mm,     4635),
  warranty_vehicle     = COALESCE(warranty_vehicle,'5 años / 100.000 km'),
  warranty_battery     = COALESCE(warranty_battery,'10 años / 200.000 km')
WHERE slug = 'hyundai-ioniq-5-2022';

/* Hyundai Ioniq 6 (2022) – source: hyundai.com */
UPDATE models SET
  battery_kwh          = COALESCE(battery_kwh,          77.4),
  battery_chemistry    = COALESCE(battery_chemistry,    'nmc'),
  consumption_kwh_100  = COALESCE(consumption_kwh_100, 14.8),
  charge_ac_kw         = COALESCE(charge_ac_kw,         11),
  charge_dc_kw         = COALESCE(charge_dc_kw,       220),
  connector_ac         = COALESCE(connector_ac,      'type2'),
  connector_dc         = COALESCE(connector_dc,      'ccs2'),
  charge_10_80_min     = COALESCE(charge_10_80_min,   18),
  v2l                  = COALESCE(v2l,                true),
  power_hp             = COALESCE(power_hp,          151),
  torque_nm            = COALESCE(torque_nm,        350),
  accel_0_100_s        = COALESCE(accel_0_100_s,     7.4),
  top_speed_kmh        = COALESCE(top_speed_kmh,    165),
  drivetrain           = COALESCE(drivetrain,       'rwd'),
  seats                = COALESCE(seats,             5),
  trunk_l              = COALESCE(trunk_l,         352),
  weight_kg            = COALESCE(weight_kg,      1850),
  length_mm            = COALESCE(length_mm,     4855),
  warranty_vehicle     = COALESCE(warranty_vehicle,'5 años / 100.000 km'),
  warranty_battery     = COALESCE(warranty_battery,'10 años / 200.000 km')
WHERE slug = 'hyundai-ioniq-6-2022';

/* Kia EV6 GT-Line (2022) – source: kia.com */
UPDATE models SET
  battery_kwh          = COALESCE(battery_kwh,          77.4),
  battery_chemistry    = COALESCE(battery_chemistry,    'nmc'),
  consumption_kwh_100  = COALESCE(consumption_kwh_100, 16.8),
  charge_ac_kw         = COALESCE(charge_ac_kw,         11),
  charge_dc_kw         = COALESCE(charge_dc_kw,       240),
  connector_ac         = COALESCE(connector_ac,      'type2'),
  connector_dc         = COALESCE(connector_dc,      'ccs2'),
  charge_10_80_min     = COALESCE(charge_10_80_min,   18),
  v2l                  = COALESCE(v2l,                false),
  power_hp             = COALESCE(power_hp,          325),
  torque_nm            = COALESCE(torque_nm,        445),
  accel_0_100_s        = COALESCE(accel_0_100_s,     3.5),
  top_speed_kmh        = COALESCE(top_speed_kmh,    260),
  drivetrain           = COALESCE(drivetrain,       'awd'),
  seats                = COALESCE(seats,             5),
  trunk_l              = COALESCE(trunk_l,         490),
  weight_kg            = COALESCE(weight_kg,      2140),
  length_mm            = COALESCE(length_mm,     4680),
  warranty_vehicle     = COALESCE(warranty_vehicle,'7 años / 150.000 km'),
  warranty_battery     = COALESCE(warranty_battery,'7 años / 150.000 km')
WHERE slug = 'kia-ev6-gt-line-2022';

/* Ford Mustang Mach-E Premium (2022) – source: ford.com */
UPDATE models SET
  battery_kwh          = COALESCE(battery_kwh,          88.0),
  battery_chemistry    = COALESCE(battery_chemistry,    'nmc'),
  consumption_kwh_100  = COALESCE(consumption_kwh_100, 19.0),
  charge_ac_kw         = COALESCE(charge_ac_kw,         11),
  charge_dc_kw         = COALESCE(charge_dc_kw,       150),
  connector_ac         = COALESCE(connector_ac,      'type2'),
  connector_dc         = COALESCE(connector_dc,      'ccs2'),
  charge_10_80_min     = COALESCE(charge_10_80_min,   38),
  v2l                  = COALESCE(v2l,                false),
  power_hp             = COALESCE(power_hp,          266),
  torque_nm            = COALESCE(torque_nm,        420),
  accel_0_100_s        = COALESCE(accel_0_100_s,     5.1),
  top_speed_kmh        = COALESCE(top_speed_kmh,    180),
  drivetrain           = COALESCE(drivetrain,       'rwd'),
  seats                = COALESCE(seats,             5),
  trunk_l              = COALESCE(trunk_l,         402),
  weight_kg            = COALESCE(weight_kg,      2215),
  length_mm            = COALESCE(length_mm,     4784),
  warranty_vehicle     = COALESCE(warranty_vehicle,'3 años / 100.000 km'),
  warranty_battery     = COALESCE(warranty_battery,'8 años / 160.000 km')
WHERE slug = 'ford-mustang-mach-e-premium-2022';

COMMIT;