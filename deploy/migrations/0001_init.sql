-- ============================================================
-- evuy — Migración 0001 (init)
-- Postgres 16 + pgvector
-- Moneda base: USD
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- Extensiones
-- ------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "vector";     -- embeddings
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- búsqueda fuzzy
CREATE EXTENSION IF NOT EXISTS "unaccent";   -- "geely" ~ "Géely"

-- ------------------------------------------------------------
-- Helper: updated_at automático
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Búsqueda sin acentos, inmutable (necesario para índices)
CREATE OR REPLACE FUNCTION immutable_unaccent(text)
RETURNS text AS $$
  SELECT unaccent('unaccent', $1)
$$ LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT SET search_path = public, pg_catalog;

-- ------------------------------------------------------------
-- Enums
-- ------------------------------------------------------------
CREATE TYPE user_role      AS ENUM ('buyer','seller','dealer','creator','admin');
CREATE TYPE drivetrain     AS ENUM ('fwd','rwd','awd');
CREATE TYPE connector_type AS ENUM ('type1','type2','ccs1','ccs2','chademo','gbt','tesla');
CREATE TYPE body_type      AS ENUM ('hatchback','sedan','suv','pickup','van','coupe','wagon');
CREATE TYPE battery_chem   AS ENUM ('lfp','nmc','nca','other');
CREATE TYPE model_status   AS ENUM ('draft','published','discontinued');
CREATE TYPE listing_status AS ENUM ('draft','pending','published','sold','rejected','expired');
CREATE TYPE doc_type       AS ENUM ('manual','spec_sheet','warranty','service','brochure','other');
CREATE TYPE content_type   AS ENUM ('review','test_drive','road_trip','comparison','tutorial','news');
CREATE TYPE lead_status    AS ENUM ('new','contacted','qualified','test_drive','won','lost');
CREATE TYPE buyer_timeframe AS ENUM ('lt_3m','3_6m','6_12m','browsing');
CREATE TYPE sub_status     AS ENUM ('pending','confirmed','unsubscribed','bounced');
CREATE TYPE charge_speed   AS ENUM ('ac_slow','ac_fast','dc_fast','dc_ultra');

-- ============================================================
-- USERS  (compatible con Auth.js / @auth/pg-adapter)
-- ============================================================
CREATE TABLE users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text,
  email         text UNIQUE NOT NULL,
  "emailVerified" timestamptz,
  image         text,
  role          user_role NOT NULL DEFAULT 'buyer',
  phone         text,
  location      text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Tablas requeridas por Auth.js
CREATE TABLE accounts (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId"            uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type                text NOT NULL,
  provider            text NOT NULL,
  "providerAccountId" text NOT NULL,
  refresh_token       text,
  access_token        text,
  expires_at          bigint,
  token_type          text,
  scope               text,
  id_token            text,
  session_state       text,
  UNIQUE (provider, "providerAccountId")
);

CREATE TABLE sessions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "sessionToken" text UNIQUE NOT NULL,
  "userId"       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires        timestamptz NOT NULL
);

CREATE TABLE verification_token (
  identifier text NOT NULL,
  token      text NOT NULL,
  expires    timestamptz NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- ============================================================
-- MODELS  — catálogo canónico. El activo del negocio.
-- Tier 1 tipado (filtrable) + specs_json (Tier 2)
-- ============================================================
CREATE TABLE models (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                text UNIQUE NOT NULL,          -- geely-ex5-2026
  brand               text NOT NULL,
  model               text NOT NULL,
  variant             text,                          -- "Max", "Pro", "Long Range"
  year_from           smallint NOT NULL,
  year_to             smallint,
  body                body_type,
  status              model_status NOT NULL DEFAULT 'draft',

  -- Precio (USD base)
  price_usd           numeric(10,2),
  price_source        text,                          -- innegociable si hay precio
  price_updated_at    timestamptz,

  -- Batería y autonomía
  battery_kwh         numeric(5,2),
  battery_usable_kwh  numeric(5,2),
  battery_chemistry   battery_chem,
  range_wltp_km       integer,                       -- ficha oficial
  range_real_km       integer,                       -- medido. NUNCA estimado.
  range_real_source   text,
  range_real_n        smallint,                      -- tamaño de muestra
  consumption_kwh_100 numeric(4,1),

  -- Carga
  charge_ac_kw        numeric(4,1),
  charge_dc_kw        numeric(5,1),
  connector_ac        connector_type,
  connector_dc        connector_type,
  charge_10_80_min    smallint,
  v2l                 boolean,                       -- vehicle-to-load

  -- Performance
  power_hp            smallint,
  power_kw            smallint,
  torque_nm           smallint,
  accel_0_100_s       numeric(3,1),
  top_speed_kmh       smallint,
  drivetrain          drivetrain,

  -- Dimensiones / práctica
  seats               smallint,
  trunk_l             smallint,
  frunk_l             smallint,
  weight_kg           smallint,
  length_mm           smallint,

  -- Comercial Uruguay
  importer            text,
  warranty_vehicle    text,
  warranty_battery    text,
  imesi_pct           numeric(4,2),
  available_uy        boolean NOT NULL DEFAULT true,

  -- Contenido / SEO
  summary             text,
  seo_title           text,
  seo_description     text,
  hero_image          text,
  gallery             text[],

  -- Tier 2: problemas conocidos, OTA, accesorios, etc.
  specs_json          jsonb NOT NULL DEFAULT '{}'::jsonb,

  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT price_needs_source CHECK (price_usd IS NULL OR price_source IS NOT NULL),
  CONSTRAINT real_range_needs_source CHECK (range_real_km IS NULL OR range_real_source IS NOT NULL),
  CONSTRAINT sane_years CHECK (year_to IS NULL OR year_to >= year_from)
);
CREATE TRIGGER trg_models_updated BEFORE UPDATE ON models
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_models_status   ON models(status) WHERE status = 'published';
CREATE INDEX idx_models_brand    ON models(brand);
CREATE INDEX idx_models_price    ON models(price_usd) WHERE status = 'published';
CREATE INDEX idx_models_range    ON models(range_real_km NULLS LAST);
CREATE INDEX idx_models_search   ON models USING gin (immutable_unaccent(brand || ' ' || model) gin_trgm_ops);
CREATE INDEX idx_models_specs    ON models USING gin (specs_json);

-- Trigger: si cambia el precio, se actualiza price_updated_at solo
CREATE OR REPLACE FUNCTION touch_price_date()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.price_usd IS DISTINCT FROM OLD.price_usd THEN
    NEW.price_updated_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_models_price BEFORE UPDATE ON models
  FOR EACH ROW EXECUTE FUNCTION touch_price_date();

-- Historial de precios → gráficos + alertas de baja
CREATE TABLE price_history (
  id         bigserial PRIMARY KEY,
  model_id   uuid NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  price_usd  numeric(10,2) NOT NULL,
  source     text,
  recorded_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_price_history_model ON price_history(model_id, recorded_at DESC);

-- ============================================================
-- DOCS + RAG
-- ============================================================
CREATE TABLE model_docs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id   uuid REFERENCES models(id) ON DELETE CASCADE,
  title      text NOT NULL,
  type       doc_type NOT NULL DEFAULT 'manual',
  lang       text NOT NULL DEFAULT 'es',
  file_key   text NOT NULL,          -- key en MinIO (bucket privado)
  source     text,
  pages      smallint,
  ingested_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_model_docs_model ON model_docs(model_id);

CREATE TABLE doc_chunks (
  id         bigserial PRIMARY KEY,
  doc_id     uuid NOT NULL REFERENCES model_docs(id) ON DELETE CASCADE,
  model_id   uuid REFERENCES models(id) ON DELETE CASCADE,
  content    text NOT NULL,
  page       smallint,
  chunk_idx  integer NOT NULL,
  tokens     smallint,
  embedding  vector(1536),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_chunks_doc   ON doc_chunks(doc_id);
CREATE INDEX idx_chunks_model ON doc_chunks(model_id);
CREATE INDEX idx_chunks_fts   ON doc_chunks USING gin (to_tsvector('spanish', content));
-- ivfflat: crear DESPUÉS de tener ~1000 filas. lists ≈ filas/1000
CREATE INDEX idx_chunks_embedding ON doc_chunks
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================================
-- CREATORS  — resuelve el cold start de contenido
-- ============================================================
CREATE TABLE creators (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  slug              text UNIQUE NOT NULL,
  name              text NOT NULL,
  avatar            text,
  bio               text,
  socials_json      jsonb NOT NULL DEFAULT '{}'::jsonb,  -- {youtube, instagram, tiktok}
  specialty         text[],                              -- {'byd','viajes','cargadores'}
  verified          boolean NOT NULL DEFAULT false,
  revenue_share_pct numeric(4,2) DEFAULT 0,
  featured          boolean NOT NULL DEFAULT false,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_creators_updated BEFORE UPDATE ON creators
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE creator_content (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id   uuid NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  model_id     uuid REFERENCES models(id) ON DELETE SET NULL,
  type         content_type NOT NULL DEFAULT 'review',
  title        text NOT NULL,
  url          text NOT NULL,
  embed_html   text,
  thumbnail    text,
  excerpt      text,          -- alimenta el RAG
  published_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_creator_content_creator ON creator_content(creator_id);
CREATE INDEX idx_creator_content_model   ON creator_content(model_id);

CREATE TABLE creator_stats (
  creator_id       uuid NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  period           date NOT NULL,        -- primer día del mes
  views            integer NOT NULL DEFAULT 0,
  clicks           integer NOT NULL DEFAULT 0,
  leads_generated  integer NOT NULL DEFAULT 0,
  revenue_share_usd numeric(10,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (creator_id, period)
);

-- ============================================================
-- LISTINGS  — usados
-- ============================================================
CREATE TABLE listings (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id           uuid NOT NULL REFERENCES models(id) ON DELETE RESTRICT,
  user_id            uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status             listing_status NOT NULL DEFAULT 'draft',

  year               smallint NOT NULL,
  km                 integer NOT NULL,
  price_usd          numeric(10,2) NOT NULL,
  price_original_uyu numeric(12,2),        -- si se publicó en pesos
  fx_rate            numeric(8,4),         -- cotización usada al convertir

  soh_pct            smallint,             -- state of health declarado
  soh_verified       boolean NOT NULL DEFAULT false,
  color              text,
  location           text,
  department         text,                 -- Maldonado, Montevideo...
  description        text,
  photos             text[] NOT NULL DEFAULT '{}',
  contact_phone      text,

  views              integer NOT NULL DEFAULT 0,
  featured_until     timestamptz,
  published_at       timestamptz,
  expires_at         timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT sane_km    CHECK (km >= 0 AND km < 1000000),
  CONSTRAINT sane_price CHECK (price_usd > 0),
  CONSTRAINT sane_soh   CHECK (soh_pct IS NULL OR (soh_pct BETWEEN 0 AND 100))
);
CREATE TRIGGER trg_listings_updated BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_listings_pub    ON listings(status, published_at DESC) WHERE status = 'published';
CREATE INDEX idx_listings_model  ON listings(model_id) WHERE status = 'published';
CREATE INDEX idx_listings_price  ON listings(price_usd) WHERE status = 'published';
CREATE INDEX idx_listings_user   ON listings(user_id);

-- ============================================================
-- LEADS  — el producto que se vende
-- ============================================================
CREATE TABLE leads (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id     uuid REFERENCES models(id) ON DELETE SET NULL,
  listing_id   uuid REFERENCES listings(id) ON DELETE SET NULL,
  creator_id   uuid REFERENCES creators(id) ON DELETE SET NULL,  -- atribución
  user_id      uuid REFERENCES users(id) ON DELETE SET NULL,

  name         text,
  email        text,
  phone        text,
  budget_usd   numeric(10,2),
  timeframe    buyer_timeframe,
  message      text,
  wants_test_drive boolean NOT NULL DEFAULT false,

  source       text,          -- 'chatbot' | 'listing' | 'calculator' | 'newsletter'
  utm_json     jsonb DEFAULT '{}'::jsonb,
  status       lead_status NOT NULL DEFAULT 'new',
  sold_to      text,          -- concesionario al que se entregó
  sold_price_usd numeric(8,2),
  notes        text,

  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT has_contact CHECK (email IS NOT NULL OR phone IS NOT NULL)
);
CREATE TRIGGER trg_leads_updated BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_leads_status ON leads(status, created_at DESC);
CREATE INDEX idx_leads_model  ON leads(model_id);
CREATE INDEX idx_leads_hot    ON leads(created_at DESC) WHERE timeframe = 'lt_3m';

-- ============================================================
-- CHATBOT
-- ============================================================
CREATE TABLE conversations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- UNIQUE: el chat hace upsert por sesión. Sin esto, cada
  -- mensaje crearía una fila nueva y se perdería el hilo.
  session_id  text UNIQUE NOT NULL,
  user_id     uuid REFERENCES users(id) ON DELETE SET NULL,
  lead_id     uuid REFERENCES leads(id) ON DELETE SET NULL,
  messages    jsonb NOT NULL DEFAULT '[]'::jsonb,
  budget_usd  numeric(10,2),      -- capturado del flujo "tengo USD X"
  models_shown uuid[],
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_conversations_updated BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
-- No hace falta índice en session_id: el UNIQUE ya crea uno.

-- ============================================================
-- NEWSLETTER
-- ============================================================
CREATE TABLE subscribers (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email          text UNIQUE NOT NULL,
  name           text,
  status         sub_status NOT NULL DEFAULT 'pending',
  model_interest uuid[] NOT NULL DEFAULT '{}',
  timeframe      buyer_timeframe,      -- lo que se vende
  source         text,
  confirm_token  text UNIQUE,
  confirmed_at   timestamptz,
  unsubscribed_at timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_subs_status ON subscribers(status) WHERE status = 'confirmed';
CREATE INDEX idx_subs_hot    ON subscribers(timeframe) WHERE timeframe = 'lt_3m';

CREATE TABLE campaigns (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject     text NOT NULL,
  preview     text,
  content_html text,
  content_md  text,
  status      text NOT NULL DEFAULT 'draft',
  sent_at     timestamptz,
  recipients  integer NOT NULL DEFAULT 0,
  opens       integer NOT NULL DEFAULT 0,
  clicks      integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE subscriber_events (
  id            bigserial PRIMARY KEY,
  subscriber_id uuid NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  campaign_id   uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  event         text NOT NULL,       -- sent|open|click|bounce|complaint
  url           text,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_sub_events ON subscriber_events(subscriber_id, created_at DESC);

-- ============================================================
-- CHARGE POINTS
-- ============================================================
CREATE TABLE charge_points (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  operator   text,                -- UTE, privado
  lat        numeric(9,6) NOT NULL,
  lng        numeric(9,6) NOT NULL,
  address    text,
  department text,
  speed      charge_speed NOT NULL,
  power_kw   numeric(5,1),
  connectors connector_type[] NOT NULL DEFAULT '{}',
  n_points   smallint DEFAULT 1,
  free       boolean,
  notes      text,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_charge_updated BEFORE UPDATE ON charge_points
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE INDEX idx_charge_geo ON charge_points(lat, lng);

-- ============================================================
-- Función de retrieval (RAG híbrido: vector + full-text)
-- ============================================================
CREATE OR REPLACE FUNCTION match_chunks(
  query_embedding vector(1536),
  filter_model_id uuid DEFAULT NULL,
  match_count int DEFAULT 6
)
RETURNS TABLE (
  id bigint,
  content text,
  page smallint,
  doc_title text,
  model_slug text,
  similarity float
) AS $$
  SELECT
    c.id,
    c.content,
    c.page,
    d.title,
    m.slug,
    1 - (c.embedding <=> query_embedding) AS similarity
  FROM doc_chunks c
  JOIN model_docs d ON d.id = c.doc_id
  LEFT JOIN models m ON m.id = c.model_id
  WHERE (filter_model_id IS NULL OR c.model_id = filter_model_id)
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
$$ LANGUAGE sql STABLE;

COMMIT;
