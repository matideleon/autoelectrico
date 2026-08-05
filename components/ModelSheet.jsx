'use client';

import React, { useState } from 'react';
import CarSilhouette from './CarSilhouette';
import {
  patenteAnualUyu,
  patenteAnualUsd,
  TASA_PATENTE_COMBUSTION,
  TIPO_CAMBIO,
  TIPO_CAMBIO_FECHA,
} from '@/lib/patente';

/* ============================================================
   evuy — Ficha de modelo

   Concepto: instrumento de medición, no folleto.
   El color codifica la confianza del dato:
     cian  = medido en Uruguay, con fuente
     ámbar = declarado por fábrica (laboratorio)
     gris  = no lo sabemos todavía

   El hueco visible ES el producto. Ningún concesionario te
   muestra lo que no sabe.
   ============================================================ */

const C = {
  bg: '#141619',
  surface: '#1B1E23',
  line: '#2A2E35',
  text: '#E6E8EB',
  dim: '#9AA1AC',
  faint: '#828993',
  real: '#3DDC97',   // medido
  lab: '#E8A33D',    // laboratorio
  gap: '#838A94',    // sin dato
};

/* Mismo número que el AdCTA global: una sola vía de contacto. */
const WHATSAPP_NUMBER = '59895904714';
const waHref = (msg) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

/* --- Datos de ejemplo: el EX5 tal como está hoy en la DB.
   Los null son reales, no placeholders. --- */
const EX5 = {
  slug: 'geely-ex5-2026',
  brand: 'Geely',
  model: 'EX5',
  year_from: 2025,
  body: 'SUV',
  status: 'draft',
  price_usd: null,
  price_source: null,
  price_updated_at: null,
  battery_kwh: 60.22,
  battery_chemistry: 'LFP',
  range_wltp_km: 430,
  range_real_km: null,
  range_real_source: null,
  range_real_n: null,
  consumption_kwh_100: null,
  charge_ac_kw: 11,
  charge_dc_kw: 100,
  connector_ac: 'Type 2',
  connector_dc: 'CCS2',
  charge_10_80_min: null,
  v2l: true,
  power_hp: 218,
  torque_nm: 320,
  accel_0_100_s: 6.9,
  drivetrain: 'FWD',
  seats: 5,
  trunk_l: 410,
  length_mm: 4615,
  importer: null,
  warranty_vehicle: null,
  warranty_battery: null,
  summary:
    'SUV eléctrico compacto con batería LFP Aegis Short Blade, carga DC de 100 kW y función V2L.',
};

/* Un modelo con datos completos, para contraste */
const DOLPHIN = {
  slug: 'byd-dolphin-2026',
  brand: 'BYD',
  model: 'Dolphin',
  year_from: 2023,
  body: 'Hatchback',
  status: 'published',
  price_usd: 32900,
  price_source: 'Importadora Ayax',
  price_updated_at: '2026-07-02',
  battery_kwh: 44.9,
  battery_chemistry: 'LFP',
  range_wltp_km: 340,
  range_real_km: 287,
  range_real_source: 'Comunidad EV Uruguay',
  range_real_n: 14,
  consumption_kwh_100: 15.6,
  charge_ac_kw: 7,
  charge_dc_kw: 60,
  connector_ac: 'Type 2',
  connector_dc: 'CCS2',
  charge_10_80_min: 38,
  v2l: true,
  power_hp: 204,
  torque_nm: 310,
  accel_0_100_s: 7.0,
  drivetrain: 'FWD',
  seats: 5,
  trunk_l: 345,
  length_mm: 4290,
  importer: 'Ayax',
  warranty_vehicle: '6 años / 150.000 km',
  warranty_battery: '8 años / 160.000 km',
  summary:
    'Hatchback eléctrico urbano con batería Blade LFP. El más vendido de su segmento en Uruguay.',
};

const fmt = (n) =>
  n == null ? null : new Intl.NumberFormat('es-UY').format(n);

/* Los enums vienen de Postgres en minúscula ('suv', 'lfp', 'fwd').
   Mostrarlos crudos se ve descuidado. */
const LABELS = {
  suv: 'SUV', hatchback: 'Hatchback', sedan: 'Sedán', pickup: 'Pickup',
  van: 'Van', coupe: 'Coupé', wagon: 'Wagon',
  lfp: 'LFP', nmc: 'NMC', nca: 'NCA', other: '—',
  fwd: 'FWD', rwd: 'RWD', awd: 'AWD',
  type1: 'Type 1', type2: 'Type 2', ccs1: 'CCS1', ccs2: 'CCS2',
  chademo: 'CHAdeMO', gbt: 'GB/T', tesla: 'Tesla',
};
const label = (v) => (v == null ? null : LABELS[v] ?? v);

/* ---------- Signature: comparador de autonomía ----------
   La barra de fábrica muestra WLTP cuando existe. Cuando la marca
   solo publica NEDC (Chevrolet con la Captiva EV, por ejemplo) se
   muestra ese, etiquetado como tal — nunca disfrazado de WLTP.
   El NEDC es un ciclo viejo y benévolo: para la misma batería de
   51 kWh, el Omoda E5 declara 422 km NEDC y 350 km WLTP.
   Por eso no se comparan entre sí y por eso no se calcula el
   delta contra la autonomía real cuando el dato es NEDC.        */
function RangeBars({ wltp, nedc, real, n, source, max = 500 }) {
  const esNedc = wltp == null && nedc != null;
  const lab = wltp ?? nedc ?? null;
  const ciclo = esNedc ? 'NEDC' : 'WLTP';

  const wPct = lab ? (lab / max) * 100 : 0;
  const rPct = real ? (real / max) * 100 : 0;
  // Solo se compara real contra WLTP. Contra NEDC el número
  // exagera la caída y sugiere una precisión que no tenemos.
  const delta = wltp && real ? Math.round(((real - wltp) / wltp) * 100) : null;

  return (
    <div style={{ marginTop: 4 }}>
      {/* Fábrica: WLTP, o NEDC si es lo único que publica la marca */}
      <div style={{ marginBottom: esNedc ? 10 : 22 }}>
        <div style={S.barHead}>
          <span style={{ ...S.barLabel, color: C.lab }}>
            {ciclo} · laboratorio
          </span>
          <span style={{ ...S.barValue, color: C.lab }}>
            {fmt(lab) ?? '—'} <em style={S.unit}>km</em>
          </span>
        </div>
        <div
          style={S.track}
          role="img"
          aria-label={
            lab
              ? `Autonomía ${ciclo} de laboratorio: ${lab} kilómetros`
              : 'Autonomía de fábrica sin dato'
          }
        >
          <div
            style={{
              ...S.fill,
              width: `${wPct}%`,
              border: `1px dashed ${C.lab}`,
              background: 'transparent',
            }}
          />
        </div>
      </div>

      {esNedc && (
        <div style={S.cicloNota}>
          El fabricante no publica WLTP para este modelo. El NEDC es un
          protocolo más viejo y optimista: no lo compares con los WLTP del
          resto del catálogo. De referencia, el Omoda E5 declara 422 km NEDC
          y 350 km WLTP con la misma batería.
        </div>
      )}

      {/* Real */}
      <div>
        <div style={S.barHead}>
          <span style={{ ...S.barLabel, color: real ? C.real : C.faint }}>
            Real · medida en Uruguay
          </span>
          <span style={{ ...S.barValue, color: real ? C.real : C.faint }}>
            {real ? (
              <>
                {fmt(real)} <em style={S.unit}>km</em>
              </>
            ) : (
              <em style={{ ...S.unit, fontStyle: 'normal' }}>sin medir</em>
            )}
          </span>
        </div>
        <div
          style={S.track}
          role="img"
          aria-label={
            real
              ? `Autonomía real medida en Uruguay: ${real} kilómetros, sobre ${n} mediciones`
              : 'Autonomía real: todavía sin medir en Uruguay'
          }
        >
          {real ? (
            <div style={{ ...S.fill, width: `${rPct}%`, background: C.real }} />
          ) : (
            <div style={S.emptyTrack}>
              <span style={S.emptyText}>
                todavía nadie la midió · ¿tenés el dato?
              </span>
            </div>
          )}
        </div>
        {real && delta != null && (
          <div style={S.barFoot}>
            <span>
              rinde {Math.abs(delta)}% {delta < 0 ? 'menos' : 'más'} que en
              laboratorio · {n} medicion{n === 1 ? '' : 'es'}
            </span>
            <span style={{ color: C.faint }}>{source}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Celda de dato ---------- */
function Spec({ label, value, unit, tone = 'real', note }) {
  const missing = value == null;
  const color = missing ? C.gap : tone === 'lab' ? C.lab : C.text;

  return (
    <div style={S.spec}>
      <div style={S.specLabel}>{label}</div>
      <div style={{ ...S.specValue, color }}>
        {missing ? (
          /* El hueco es información, pero tiene que leerse como una
             decisión editorial y no como una ficha rota. */
          <span style={S.missing} title="Todavía no lo pudimos verificar">
            <span style={S.missingMark} aria-hidden="true" />
            sin verificar
          </span>
        ) : (
          <>
            {typeof value === 'number' ? fmt(value) : value}
            {unit && <em style={S.unit}> {unit}</em>}
          </>
        )}
      </div>
      {note && !missing && <div style={S.specNote}>{note}</div>}
    </div>
  );
}

/* ---------- Patente ----------
   Sale del precio de venta, pero se muestra al cerrar Autonomía:
   ahí es donde el lector ya está pensando en costo de uso.
   Sin precio no hay patente: el hueco se muestra, no se rellena. */
function PatenteRow({ m }) {
  const uyu = patenteAnualUyu(m.price_usd);
  const usd = patenteAnualUsd(m.price_usd);
  if (uyu == null) return null;

  return (
    <div style={S.patente}>
      <div style={S.patenteTop}>
        <span style={S.patenteLabel}>Patente anual estimada</span>
        <span style={S.patenteValue}>
          ${fmt(Math.round(uyu))}
          <em style={S.patenteUsd}> · USD {fmt(Math.round(usd))}</em>
        </span>
      </div>
      <div style={S.patenteFoot}>
        3% sobre el valor sin IVA (USD {fmt(m.price_usd)} ÷ 1,22), a $
        {String(TIPO_CAMBIO).replace('.', ',')}/USD de {TIPO_CAMBIO_FECHA}. Un
        auto a combustión del mismo precio paga 5%: ${fmt(
          Math.round(patenteAnualUyu(m.price_usd, TASA_PATENTE_COMBUSTION))
        )}. Las tasas y los aforos los fija cada intendencia — esto es una
        estimación, no la boleta.
      </div>
    </div>
  );
}

/* ---------- Precio ---------- */
function PriceBlock({ m }) {
  const hasPrice = m.price_usd != null;
  return (
    <div style={{ ...S.price, borderColor: C.line }}>
      <div style={S.priceLabel}>Precio en Uruguay</div>
      {hasPrice ? (
        <>
          <div style={S.priceValue}>
            <em style={S.currency}>USD </em>
            {fmt(m.price_usd)}
          </div>
          <div style={S.priceFoot}>
            {m.importer ? `${m.importer} · ` : ''}
            {m.price_source ? `fuente: ${m.price_source}` : ''}
            {m.price_updated_at ? ` · actualizado ${new Date(m.price_updated_at).toLocaleDateString('es-UY')}` : ''}
            {' — varía por versión y promoción vigente.'}
          </div>
        </>
      ) : (
        <>
          <div style={{ ...S.priceValue, color: C.dim, fontSize: 22 }}>
            Consultá con el importador
          </div>
          <div style={S.priceFoot}>
            El precio varía por versión y promoción vigente. Preguntale al bot de
            acá abajo o contactá directo al concesionario.
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- Barra de completitud ---------- */
function Completeness({ m }) {
  // range_declarado: cuenta si hay WLTP o, en su defecto, NEDC.
  // Un modelo que solo publica NEDC no tiene un hueco de datos:
  // tiene el dato que existe.
  const m2 = { ...m, range_declarado: m.range_wltp_km ?? m.range_nedc_km };
  const fields = [
    'price_usd', 'battery_kwh', 'range_declarado', 'range_real_km',
    'charge_ac_kw', 'charge_dc_kw', 'charge_10_80_min', 'consumption_kwh_100',
    'power_hp', 'seats', 'importer', 'warranty_battery',
  ];
  const have = fields.filter((f) => m2[f] != null).length;
  const pct = Math.round((have / fields.length) * 100);

  return (
    <div style={S.compl}>
      <div style={S.complTop}>
        <span style={S.complLabel}>Datos verificados</span>
        <span style={{ ...S.complPct, color: pct === 100 ? C.real : C.lab }}>
          {have} de {fields.length}
        </span>
      </div>
      <div style={S.complNote}>
        {pct === 100
          ? 'Todos los campos de esta ficha tienen fuente citable.'
          : 'Los que faltan no los pudimos verificar todavía. Preferimos el hueco antes que el invento.'}
      </div>
    </div>
  );
}

export default function ModelSheet({ model }) {
  /* Sin prop, muestra el demo con los dos casos.
     Con prop, renderiza la ficha real desde la DB. */
  const [which, setWhich] = useState('ex5');
  const m = model ?? (which === 'ex5' ? EX5 : DOLPHIN);
  const isDemo = !model;

  /* Escala FIJA para todas las fichas. Si cada modelo escalara a su
     propio máximo, dos barras del mismo largo significarían autonomías
     distintas y comparar fichas engañaría al ojo. */
  const RANGE_SCALE = 600;

  return (
    <div style={S.root}>
      <style>{CSS}</style>

      {/* Selector de demo */}
      {isDemo && <div style={S.demo}>
        <span style={S.demoLabel}>ver ficha:</span>
        {[
          ['ex5', 'Geely EX5 · incompleta'],
          ['dolphin', 'BYD Dolphin · completa'],
        ].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setWhich(k)}
            className="demo-btn"
            style={{
              ...S.demoBtn,
              color: which === k ? C.bg : C.dim,
              background: which === k ? C.real : 'transparent',
              borderColor: which === k ? C.real : C.line,
            }}
          >
            {label}
          </button>
        ))}
      </div>}

      <article style={S.sheet}>
        {/* Retrato del modelo: foto del fabricante si la tenemos,
            silueta por carrocería si no. Una ficha de auto sin
            imagen se lee como una planilla. */}
        <div style={S.hero} aria-hidden="true">
          <CarSilhouette body={m.body} heroImage={m.hero_image} size={150} color={C.gap} />
        </div>

        {/* Encabezado */}
        <header style={S.head}>
          <div style={S.eyebrow}>
            <span>{label(m.body) ?? "—"}</span>
            <span style={S.dot}>·</span>
            <span>desde {m.year_from}</span>
            {m.status === 'draft' && (
              <>
                <span style={S.dot}>·</span>
                <span style={S.draft}>ficha en verificación</span>
              </>
            )}
          </div>
          <h1 style={S.h1}>
            <span style={S.brand}>{m.brand}</span> {m.model}
          </h1>
          <p style={S.summary}>{m.summary}</p>
        </header>

        <PriceBlock m={m} />

        {/* Signature */}
        <section style={S.section}>
          <h2 style={S.h2}>Autonomía</h2>
          <p style={S.sectionNote}>
            La cifra de fábrica se mide en laboratorio. La real la miden quienes
            manejan el auto acá.
          </p>
          <RangeBars
            wltp={m.range_wltp_km}
            nedc={m.range_nedc_km}
            real={m.range_real_km}
            n={m.range_real_n}
            source={m.range_real_source}
            max={RANGE_SCALE}
          />
          <PatenteRow m={m} />
        </section>

        {/* Carga */}
        <section style={S.section}>
          <h2 style={S.h2}>Carga</h2>
          <div style={S.grid}>
            <Spec label="Corriente alterna" value={m.charge_ac_kw} unit="kW" note={label(m.connector_ac)} />
            <Spec label="Corriente continua" value={m.charge_dc_kw} unit="kW" note={label(m.connector_dc)} />
            <Spec label="10 → 80 %" value={m.charge_10_80_min} unit="min" />
            <Spec label="Consumo" value={m.consumption_kwh_100} unit="kWh/100km" />
          </div>
        </section>

        {/* Batería y mecánica */}
        <section style={S.section}>
          <h2 style={S.h2}>Batería y mecánica</h2>
          <div style={S.grid}>
            <Spec label="Capacidad" value={m.battery_kwh} unit="kWh" note={label(m.battery_chemistry)} />
            <Spec label="Potencia" value={m.power_hp} unit="HP" />
            <Spec label="Torque" value={m.torque_nm} unit="Nm" />
            <Spec label="0 → 100 km/h" value={m.accel_0_100_s} unit="s" />
            <Spec label="Tracción" value={label(m.drivetrain)} />
            <Spec
              label="V2L"
              value={m.v2l == null ? null : m.v2l ? 'Sí' : 'No'}
              note="alimenta equipos"
            />
          </div>
        </section>

        {/* Práctica */}
        <section style={S.section}>
          <h2 style={S.h2}>Uso diario</h2>
          <div style={S.grid}>
            <Spec label="Plazas" value={m.seats} />
            <Spec label="Baúl" value={m.trunk_l} unit="L" />
            <Spec label="Largo" value={m.length_mm} unit="mm" />
            <Spec label="Importador" value={m.importer} />
            <Spec label="Garantía vehículo" value={m.warranty_vehicle} />
            <Spec label="Garantía batería" value={m.warranty_battery} />
          </div>
        </section>

        <Completeness m={m} />

        {/* Acciones: la ficha no tenía ninguna salida. Quien llega
            acá decidido a comprar se quedaba sin próximo paso. */}
        <section style={S.actions} aria-label="Qué hacer con este modelo">
          <a
            href={waHref(`Hola, quiero consultar por el ${m.brand} ${m.model}${m.variant ? ` ${m.variant}` : ''}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="sheet-btn sheet-btn-primary"
            style={{ ...S.btn, ...S.btnPrimary }}
          >
            Consultar por este modelo
          </a>
          <a
            href={`/comparar?a=${encodeURIComponent(m.slug ?? '')}`}
            className="sheet-btn"
            style={S.btn}
          >
            Comparar con otro
          </a>
          <a href="/ahorro" className="sheet-btn" style={S.btn}>
            Calcular el ahorro
          </a>
        </section>

        {/* CTA */}
        <footer style={S.cta}>
          <div>
            <div style={S.ctaTitle}>¿Tenés este auto?</div>
            <div style={S.ctaText}>
              Contanos tu autonomía real y la sumamos a la ficha, con tu nombre
              como fuente.
            </div>
          </div>
          <a
            href={waHref(`Hola, tengo un ${m.brand} ${m.model} y quiero aportar mi autonomía real`)}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn"
            style={S.ctaBtn}
          >
            Aportar un dato
          </a>
        </footer>
      </article>
    </div>
  );
}

/* ============================================================ */

const mono = "'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace";
const sans = "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const S = {
  root: {
    background: C.bg,
    minHeight: '100vh',
    padding: '32px 20px 80px',
    fontFamily: sans,
    color: C.text,
  },
  demo: {
    maxWidth: 720,
    margin: '0 auto 28px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  demoLabel: {
    fontFamily: mono,
    fontSize: 11,
    color: C.faint,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  demoBtn: {
    fontFamily: mono,
    fontSize: 11,
    padding: '6px 12px',
    border: '1px solid',
    borderRadius: 2,
    cursor: 'pointer',
    letterSpacing: '0.02em',
    transition: 'all 140ms ease',
  },
  sheet: { maxWidth: 720, margin: '0 auto' },
  head: { marginBottom: 28 },
  eyebrow: {
    fontFamily: mono,
    fontSize: 11,
    color: C.dim,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  dot: { color: C.faint },
  draft: { color: C.lab },
  h1: {
    fontSize: 'clamp(32px, 7vw, 46px)',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    lineHeight: 1.05,
    margin: '0 0 14px',
  },
  brand: { color: C.dim, fontWeight: 400 },
  summary: {
    fontSize: 15,
    lineHeight: 1.6,
    color: C.dim,
    margin: 0,
    maxWidth: '54ch',
  },
  price: {
    border: `1px solid ${C.line}`,
    borderRadius: 3,
    padding: '18px 20px',
    marginBottom: 36,
    background: C.surface,
  },
  priceLabel: {
    fontFamily: mono,
    fontSize: 11,
    color: C.dim,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: 8,
  },
  priceValue: {
    fontFamily: mono,
    fontSize: 34,
    fontWeight: 500,
    letterSpacing: '-0.02em',
    lineHeight: 1,
  },
  currency: { fontSize: 15, color: C.dim, fontStyle: 'normal', fontWeight: 400 },
  priceFoot: {
    fontFamily: mono,
    fontSize: 11,
    color: C.faint,
    marginTop: 10,
  },
  patente: {
    marginTop: 26,
    padding: '16px 18px',
    background: C.surface,
    border: `1px solid ${C.line}`,
    borderRadius: 3,
  },
  patenteTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 12,
    flexWrap: 'wrap',
  },
  patenteLabel: {
    fontFamily: mono,
    fontSize: 11,
    color: C.dim,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  patenteValue: {
    fontFamily: mono,
    fontSize: 20,
    fontWeight: 500,
    color: C.text,
    letterSpacing: '-0.01em',
  },
  patenteUsd: {
    fontSize: 12,
    color: C.dim,
    fontStyle: 'normal',
    fontWeight: 400,
  },
  patenteFoot: {
    fontFamily: mono,
    fontSize: 11,
    color: C.faint,
    marginTop: 8,
    lineHeight: 1.6,
  },
  section: {
    marginBottom: 38,
    paddingTop: 24,
    borderTop: `1px solid ${C.line}`,
  },
  h2: {
    fontSize: 13,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: C.text,
    margin: '0 0 6px',
  },
  sectionNote: {
    fontSize: 13,
    color: C.faint,
    margin: '0 0 20px',
    lineHeight: 1.5,
    maxWidth: '52ch',
  },
  barHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 7,
  },
  barLabel: {
    fontFamily: mono,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  barValue: {
    fontFamily: mono,
    fontSize: 22,
    fontWeight: 500,
    letterSpacing: '-0.01em',
  },
  unit: { fontSize: 12, color: C.dim, fontStyle: 'normal' },
  track: {
    height: 10,
    background: '#0E1013',
    borderRadius: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  fill: { height: '100%', borderRadius: 1, transition: 'width 500ms ease' },
  emptyTrack: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 10,
    background:
      `repeating-linear-gradient(-45deg, transparent, transparent 5px, ${C.line} 5px, ${C.line} 6px)`,
  },
  emptyText: {
    fontFamily: mono,
    fontSize: 11,
    color: C.faint,
    letterSpacing: '0.05em',
    background: C.bg,
    padding: '0 6px',
  },
  cicloNota: {
    fontFamily: mono,
    fontSize: 10.5,
    lineHeight: 1.6,
    color: C.faint,
    background: 'rgba(197,130,89,0.07)',
    borderLeft: `2px solid ${C.lab}`,
    padding: '9px 12px',
    borderRadius: '0 4px 4px 0',
    marginBottom: 22,
  },
  barFoot: {
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: mono,
    fontSize: 11,
    color: C.real,
    marginTop: 8,
    gap: 12,
    flexWrap: 'wrap',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1px',
    background: C.line,
    border: `1px solid ${C.line}`,
    borderRadius: 3,
    overflow: 'hidden',
  },
  spec: { background: C.bg, padding: '14px 16px' },
  specLabel: {
    fontFamily: mono,
    fontSize: 11,
    color: C.dim,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 6,
  },
  specValue: {
    fontFamily: mono,
    fontSize: 19,
    fontWeight: 500,
    letterSpacing: '-0.01em',
    lineHeight: 1.2,
  },
  missing: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    fontSize: 13,
    fontStyle: 'italic',
    fontWeight: 400,
    letterSpacing: 0,
  },
  missingMark: {
    display: 'inline-block',
    width: 18,
    height: 0,
    borderTop: `2px dotted ${C.gap}`,
    opacity: 0.9,
  },
  specNote: {
    fontFamily: mono,
    fontSize: 11,
    color: C.faint,
    marginTop: 5,
  },
  compl: {
    border: `1px solid ${C.line}`,
    borderRadius: 3,
    padding: '16px 18px',
    marginBottom: 32,
    background: C.surface,
  },
  complTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  complLabel: {
    fontFamily: mono,
    fontSize: 11,
    color: C.dim,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  complPct: { fontFamily: mono, fontSize: 13, fontWeight: 500 },
  complNote: {
    fontFamily: mono,
    fontSize: 11,
    color: C.faint,
    marginTop: 10,
    lineHeight: 1.5,
  },
  hero: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
    marginBottom: 8,
    padding: '18px 0',
    borderBottom: `1px solid ${C.line}`,
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    margin: '28px 0 24px',
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
    padding: '12px 20px',
    flex: '1 1 190px',
    fontFamily: mono,
    fontSize: 12.5,
    letterSpacing: '0.03em',
    textDecoration: 'none',
    background: 'transparent',
    color: C.text,
    border: `1px solid ${C.line}`,
    borderRadius: 4,
    cursor: 'pointer',
    transition: 'border-color 140ms ease, background 140ms ease, color 140ms ease',
  },
  btnPrimary: {
    background: C.real,
    color: C.bg,
    borderColor: C.real,
    fontWeight: 500,
  },
  cta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    padding: '20px',
    border: `1px solid ${C.line}`,
    borderRadius: 3,
    flexWrap: 'wrap',
  },
  ctaTitle: { fontSize: 15, fontWeight: 600, marginBottom: 4 },
  ctaText: {
    fontSize: 13,
    color: C.dim,
    lineHeight: 1.5,
    maxWidth: '40ch',
  },
  ctaBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    textDecoration: 'none',
    fontFamily: mono,
    fontSize: 12,
    padding: '11px 20px',
    background: 'transparent',
    color: C.real,
    border: `1px solid ${C.real}`,
    borderRadius: 2,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    letterSpacing: '0.04em',
    transition: 'all 140ms ease',
  },
};

const CSS = `

* { box-sizing: border-box; }

.cta-btn:hover { background: ${C.real} !important; color: ${C.bg} !important; }
.demo-btn:hover { border-color: ${C.dim} !important; }
.sheet-btn:hover { border-color: ${C.real} !important; color: ${C.real} !important; }
.sheet-btn-primary:hover { background: #35c586 !important; color: ${C.bg} !important; border-color: #35c586 !important; }

button:focus-visible {
  outline: 2px solid ${C.real};
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; }
}
`;
