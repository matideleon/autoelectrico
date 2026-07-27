-- ============================================================
-- autoelectrico.uy — Migration 0009
-- Powertrain: abrir el catálogo a los que se enchufan.
--
-- Hasta acá todo modelo era eléctrico puro y no hacía falta
-- decirlo. Para sumar híbridos hay que poder nombrarlos, y
-- distinguir los cuatro casos, porque son productos distintos:
--
--   bev   eléctrico puro
--   phev  híbrido enchufable
--   erev  eléctrico con generador a nafta a bordo
--   hev   híbrido común, NO enchufa
--   mhev  micro-híbrido 48V (un combustión con marketing)
--
-- El enum los admite a los cinco para poder clasificar sin
-- mentir. Qué se publica es decisión editorial, no del schema.
--
-- Los 155 modelos existentes quedan en 'bev': es lo que son.
-- ============================================================

BEGIN;

CREATE TYPE powertrain AS ENUM ('bev', 'phev', 'erev', 'hev', 'mhev');

ALTER TABLE models
  ADD COLUMN powertrain powertrain NOT NULL DEFAULT 'bev';

-- ------------------------------------------------------------
-- Campos del lado nafta.
-- Un BEV no los tiene y no debe tenerlos: la restricción de
-- abajo lo hace imposible en vez de confiar en la disciplina.
-- ------------------------------------------------------------
ALTER TABLE models
  ADD COLUMN range_ev_wltp_km integer,     -- autonomía SOLO eléctrica del enchufable
  ADD COLUMN fuel_l_100       numeric(4,1),-- consumo combinado, L/100km
  ADD COLUMN fuel_tank_l      smallint,
  ADD COLUMN range_total_km   integer;     -- eléctrico + nafta, un tanque

COMMENT ON COLUMN models.range_ev_wltp_km IS
  'Autonomía en modo eléctrico de un enchufable. En un BEV este dato ya es range_wltp_km: no se duplica.';
COMMENT ON COLUMN models.fuel_l_100 IS
  'Consumo declarado de fábrica. El real, cuando lo midamos, va aparte como range_real_km.';

-- ------------------------------------------------------------
-- Coherencia. Mismo criterio que price_needs_source: el schema
-- impide el dato imposible, no lo corrige después.
-- ------------------------------------------------------------
ALTER TABLE models
  ADD CONSTRAINT bev_has_no_fuel CHECK (
    powertrain <> 'bev'
    OR (fuel_l_100 IS NULL AND fuel_tank_l IS NULL AND range_total_km IS NULL)
  ),
  ADD CONSTRAINT ev_range_only_for_plugin_hybrids CHECK (
    range_ev_wltp_km IS NULL OR powertrain IN ('phev', 'erev')
  );

-- Filtro por tipo en /modelos: solo interesa sobre lo publicado.
CREATE INDEX idx_models_powertrain ON models(powertrain)
  WHERE status = 'published';

COMMIT;

-- ============================================================
-- Verificación (correr después del COMMIT)
--
--   SELECT powertrain, count(*) FROM models GROUP BY powertrain;
--   -- esperado: bev | 155  (y nada más)
--
--   \d models
--   -- esperado: columna powertrain NOT NULL DEFAULT 'bev'
--                + 4 columnas nullable nuevas
--                + 2 CHECK nuevos
-- ============================================================
