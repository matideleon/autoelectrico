// ============================================================
// evuy — Tipos del dominio
// Espejo de 0001_init.sql. Si cambia el SQL, cambia acá.
// ============================================================

export type UserRole = 'buyer' | 'seller' | 'dealer' | 'creator' | 'admin';
export type Drivetrain = 'fwd' | 'rwd' | 'awd';
export type ConnectorType = 'type1' | 'type2' | 'ccs1' | 'ccs2' | 'chademo' | 'gbt' | 'tesla';
export type BodyType = 'hatchback' | 'sedan' | 'suv' | 'pickup' | 'van' | 'coupe' | 'wagon';
export type BatteryChem = 'lfp' | 'nmc' | 'nca' | 'other';
export type ModelStatus = 'draft' | 'published' | 'discontinued';
export type ListingStatus = 'draft' | 'pending' | 'published' | 'sold' | 'rejected' | 'expired';
export type DocType = 'manual' | 'spec_sheet' | 'warranty' | 'service' | 'brochure' | 'other';
export type ContentType = 'review' | 'test_drive' | 'road_trip' | 'comparison' | 'tutorial' | 'news';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'test_drive' | 'won' | 'lost';
export type BuyerTimeframe = 'lt_3m' | '3_6m' | '6_12m' | 'browsing';
export type SubStatus = 'pending' | 'confirmed' | 'unsubscribed' | 'bounced';
export type ChargeSpeed = 'ac_slow' | 'ac_fast' | 'dc_fast' | 'dc_ultra';

/** Usuario autenticado. `null` = visitante anónimo. */
export interface Actor {
  id: string;
  role: UserRole;
  email: string;
}

export interface Model {
  id: string;
  slug: string;
  brand: string;
  model: string;
  variant: string | null;
  year_from: number;
  year_to: number | null;
  body: BodyType | null;
  status: ModelStatus;

  price_usd: number | null;
  price_source: string | null;
  price_updated_at: Date | null;

  battery_kwh: number | null;
  battery_usable_kwh: number | null;
  battery_chemistry: BatteryChem | null;
  range_wltp_km: number | null;
  range_real_km: number | null;
  range_real_source: string | null;
  range_real_n: number | null;
  consumption_kwh_100: number | null;

  charge_ac_kw: number | null;
  charge_dc_kw: number | null;
  connector_ac: ConnectorType | null;
  connector_dc: ConnectorType | null;
  charge_10_80_min: number | null;
  v2l: boolean | null;

  power_hp: number | null;
  power_kw: number | null;
  torque_nm: number | null;
  accel_0_100_s: number | null;
  top_speed_kmh: number | null;
  drivetrain: Drivetrain | null;

  seats: number | null;
  trunk_l: number | null;
  frunk_l: number | null;
  weight_kg: number | null;
  length_mm: number | null;

  importer: string | null;
  warranty_vehicle: string | null;
  warranty_battery: string | null;
  imesi_pct: number | null;
  available_uy: boolean;

  summary: string | null;
  seo_title: string | null;
  seo_description: string | null;
  hero_image: string | null;
  gallery: string[] | null;

  specs_json: ModelSpecs;

  created_at: Date;
  updated_at: Date;
}

export interface ModelSpecs {
  known_issues?: Array<{ title: string; description: string; source: string }>;
  ota_updates?: Array<{ version: string; date: string; notes: string }>;
  accessories?: Array<{ name: string; url?: string }>;
  community?: Record<string, unknown>;
  /** Campos Tier 1 todavía sin dato. Bloquean la publicación. */
  data_gaps?: string[];
  [key: string]: unknown;
}

export interface Listing {
  id: string;
  model_id: string;
  user_id: string;
  status: ListingStatus;
  year: number;
  km: number;
  price_usd: number;
  price_original_uyu: number | null;
  fx_rate: number | null;
  soh_pct: number | null;
  soh_verified: boolean;
  color: string | null;
  location: string | null;
  department: string | null;
  description: string | null;
  photos: string[];
  contact_phone: string | null;
  views: number;
  featured_until: Date | null;
  published_at: Date | null;
  expires_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

/** Listing + datos del modelo, para las vistas de catálogo. */
export interface ListingWithModel extends Listing {
  model_slug: string;
  brand: string;
  model_name: string;
  range_real_km: number | null;
  battery_kwh: number | null;
}

export interface Creator {
  id: string;
  user_id: string | null;
  slug: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  socials_json: Record<string, string>;
  specialty: string[];
  verified: boolean;
  revenue_share_pct: number;
  featured: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreatorContent {
  id: string;
  creator_id: string;
  model_id: string | null;
  type: ContentType;
  title: string;
  url: string;
  embed_html: string | null;
  thumbnail: string | null;
  excerpt: string | null;
  published_at: Date | null;
  created_at: Date;
}

export interface Lead {
  id: string;
  model_id: string | null;
  listing_id: string | null;
  creator_id: string | null;
  user_id: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  budget_usd: number | null;
  timeframe: BuyerTimeframe | null;
  message: string | null;
  wants_test_drive: boolean;
  source: string | null;
  utm_json: Record<string, string>;
  status: LeadStatus;
  sold_to: string | null;
  sold_price_usd: number | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  status: SubStatus;
  model_interest: string[];
  timeframe: BuyerTimeframe | null;
  source: string | null;
  confirm_token: string | null;
  confirmed_at: Date | null;
  unsubscribed_at: Date | null;
  created_at: Date;
}

export interface ChargePoint {
  id: string;
  name: string;
  operator: string | null;
  lat: number;
  lng: number;
  address: string | null;
  department: string | null;
  speed: ChargeSpeed;
  power_kw: number | null;
  connectors: ConnectorType[];
  n_points: number | null;
  free: boolean | null;
  notes: string | null;
  verified_at: Date | null;
}

export interface ChunkMatch {
  id: number;
  content: string;
  page: number | null;
  doc_title: string;
  model_slug: string | null;
  similarity: number;
}

// ---------- Filtros ----------

export interface ModelFilters {
  brand?: string;
  body?: BodyType;
  priceMax?: number;
  priceMin?: number;
  rangeMin?: number;
  connectorDc?: ConnectorType;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ListingFilters {
  modelId?: string;
  modelSlug?: string;
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  kmMax?: number;
  department?: string;
  limit?: number;
  offset?: number;
}

/** Campos Tier 1 obligatorios para pasar un modelo a `published`. */
export const TIER1_REQUIRED: (keyof Model)[] = [
  'price_usd',
  'battery_kwh',
  'range_wltp_km',
  'charge_ac_kw',
  'charge_dc_kw',
  'connector_dc',
  'power_hp',
  'seats',
  'importer',
  'warranty_battery',
  'summary',
];
