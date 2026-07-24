'use client';

import { useState, useEffect, useMemo } from 'react';
import SavingsChart from '@/components/SavingsChart';
import Nav from '@/components/Nav';

interface ModelOption {
  slug: string;
  brand: string;
  model: string;
  variant: string | null;
  batteryKwh: number | null;
  consumptionKwh100: number | null;
  rangeWltpKm: number | null;
  rangeRealKm: number | null;
  priceUsd: number | null;
}

export default function AhorroPage() {
  // Input states
  const [kilometrosPorMes, setKilometrosPorMes] = useState(1200);
  const [precioNafta, setPrecioNafta] = useState(88.67);
  const [consumoCombustion, setConsumoCombustion] = useState(8);
  const TARIFAS_UTE = {
    doble: { label: 'Doble horario — horario barato', value: 4.771 * 1.22 },
    triple: { label: 'Triple horario — horario barato', value: 2.443 * 1.22 },
  };

  const [tarifaUte, setTarifaUte] = useState<'doble' | 'triple'>('doble');
  const [precioKwh, setPrecioKwh] = useState(TARIFAS_UTE.doble.value);
  const [consumoElectrico, setConsumoElectrico] = useState(15.6);
  const [precioElectrico, setPrecioElectrico] = useState(0);
  const [tipoCambio, setTipoCambio] = useState(40.5);

  // --- Selector de vehículo: datos reales de nuestra base ---
  const [models, setModels] = useState<ModelOption[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedSlug, setSelectedSlug] = useState('');
  const [modelsError, setModelsError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/models')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setModels(data.models ?? []);
      })
      .catch(() => {
        if (!cancelled) setModelsError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const brands = useMemo(
    () => [...new Set(models.map((m) => m.brand))].sort(),
    [models]
  );

  const modelsForBrand = useMemo(
    () => models.filter((m) => m.brand === selectedBrand),
    [models, selectedBrand]
  );

  const selectedModel = useMemo(
    () => models.find((m) => m.slug === selectedSlug) ?? null,
    [models, selectedSlug]
  );

  // Al elegir un modelo, autocompleta el consumo (dato técnico, sí lo
  // tenemos con fuente). El precio NUNCA se autocompleta: varía por
  // versión y promoción, y el sitio no muestra precios en ningún lado.
  // Al cambiar de modelo se vacía para que no quede el número del
  // auto anterior pegado, pareciendo el precio de este.
  useEffect(() => {
    if (!selectedModel) return;
    if (selectedModel.consumptionKwh100 != null) {
      setConsumoElectrico(selectedModel.consumptionKwh100);
    }
    // Si el modelo tiene precio real cargado, se autocompleta.
    // Si no, se vacía para no dejar pegado el precio del auto anterior.
    setPrecioElectrico(selectedModel.priceUsd ?? 0);
  }, [selectedModel]);

  // Calculations
  const costoPorKmCombustion = consumoCombustion > 0 ? precioNafta / consumoCombustion : 0;
  const costoPorKmElectrico = (precioKwh * consumoElectrico) / 100;
  const ahorroMensual = (costoPorKmCombustion - costoPorKmElectrico) * kilometrosPorMes;
  const ahorroAnual = ahorroMensual * 12;

  // El campo "precio de compra" está en USD (así lo dice la unidad
  // del input). El ahorro mensual está en pesos. Para la amortización
  // hay que convertir el precio a pesos ANTES de dividir — dividir
  // USD por UYU/mes daba un resultado sin sentido (meses en vez de
  // años). Este era un bug real: mezclaba monedas.
  const precioElectricoUYU = precioElectrico * tipoCambio;
  const amortizacionMeses =
    ahorroMensual > 0 && precioElectrico > 0 ? precioElectricoUYU / ahorroMensual : null;
  const amortizacionAnios = amortizacionMeses != null ? amortizacionMeses / 12 : null;

  const handleShare = () => {
    const mensaje = `🔌 ¿Cuánto ahorrás con un auto eléctrico?

📊 MI CÁLCULO:
• ${kilometrosPorMes} km/mes
• Nafta: $${precioNafta.toFixed(2)}/L
• Eléctrico: $${precioKwh.toFixed(2)}/kWh

💰 RESULTADO:
• Ahorro: $${Math.round(ahorroMensual).toLocaleString()}/mes
• Amortización: ${amortizacionAnios != null ? amortizacionAnios.toFixed(1) : 'N/A'} años

Calculá el tuyo en autoelectrico.uy/ahorro`;

    window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`);
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: '#141619',
    border: '1px solid #2a2d33',
    borderRadius: '4px',
    padding: '12px',
    color: '#fff',
    fontSize: '16px',
    fontFamily: 'IBM Plex Sans, sans-serif',
    cursor: 'pointer',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#141619',
      color: '#fff',
      fontFamily: 'IBM Plex Sans, sans-serif'
    }}>
      <style>{`
        @media (max-width: 860px) {
          .ahorro-main-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 420px) {
          .ahorro-vehicle-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <Nav />

      {/* Header */}
      <header style={{
        textAlign: 'center',
        padding: '60px 20px 40px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{
          fontSize: '12px',
          color: '#666',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '20px'
        }}>
          SIMULADOR
        </div>
        <h1 style={{
          fontSize: '36px',
          fontWeight: '400',
          margin: '0 0 20px 0',
          lineHeight: '1.2'
        }}>
          ¿Cuánto ahorrás pasándote a un eléctrico?
        </h1>
        <p style={{
          color: '#aaa',
          fontSize: '16px',
          lineHeight: '1.5',
          margin: 0
        }}>
          Con los precios reales de nafta y UTE. Cambiá cualquier número por el tuyo<br />
          — estos son puntos de partida, no verdades absolutas.
        </p>
      </header>

      {/* Main Content */}
      <div className="ahorro-main-grid" style={{
        display: 'grid',
        gridTemplateColumns: '3fr 2fr',
        gap: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px 60px'
      }}>

        {/* Left Panel - Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

          {/* TU USO */}
          <div style={{
            background: '#1B1E23',
            border: '1px solid #2a2d33',
            borderRadius: '8px',
            padding: '24px'
          }}>
            <h2 style={{
              fontSize: '12px',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: '0 0 20px 0',
              fontWeight: '500'
            }}>
              TU USO
            </h2>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                color: '#ccc',
                marginBottom: '8px'
              }}>
                Kilómetros por mes
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  value={kilometrosPorMes}
                  onChange={(e) => setKilometrosPorMes(Number(e.target.value))}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    background: '#141619',
                    border: '1px solid #2a2d33',
                    borderRadius: '4px',
                    padding: '12px 40px 12px 12px',
                    color: '#fff',
                    fontSize: '16px',
                    fontFamily: 'IBM Plex Mono, monospace'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666',
                  fontSize: '14px'
                }}>
                  km
                </span>
              </div>
            </div>
          </div>

          {/* AUTO A COMBUSTIÓN */}
          <div style={{
            background: '#1B1E23',
            border: '1px solid #2a2d33',
            borderRadius: '8px',
            padding: '24px'
          }}>
            <h2 style={{
              fontSize: '12px',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: '0 0 20px 0',
              fontWeight: '500'
            }}>
              AUTO A COMBUSTIÓN
            </h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                color: '#ccc',
                marginBottom: '4px'
              }}>
                Precio de la nafta
              </label>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                ANCAP · jul 2026
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  step="0.01"
                  value={precioNafta}
                  onChange={(e) => setPrecioNafta(Number(e.target.value))}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    background: '#141619',
                    border: '1px solid #2a2d33',
                    borderRadius: '4px',
                    padding: '12px 40px 12px 12px',
                    color: '#fff',
                    fontSize: '16px',
                    fontFamily: 'IBM Plex Mono, monospace'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666',
                  fontSize: '14px'
                }}>
                  $/L
                </span>
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                color: '#ccc',
                marginBottom: '8px'
              }}>
                Consumo
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  step="0.1"
                  value={consumoCombustion}
                  onChange={(e) => setConsumoCombustion(Number(e.target.value))}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    background: '#141619',
                    border: '1px solid #2a2d33',
                    borderRadius: '4px',
                    padding: '12px 80px 12px 12px',
                    color: '#fff',
                    fontSize: '16px',
                    fontFamily: 'IBM Plex Mono, monospace'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666',
                  fontSize: '14px'
                }}>
                  km/L
                </span>
              </div>
            </div>
          </div>

          {/* AUTO ELÉCTRICO */}
          <div style={{
            background: '#1B1E23',
            border: '1px solid #2a2d33',
            borderRadius: '8px',
            padding: '24px'
          }}>
            <h2 style={{
              fontSize: '12px',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: '0 0 20px 0',
              fontWeight: '500'
            }}>
              AUTO ELÉCTRICO
            </h2>

            {/* Selector de vehículo: datos reales de nuestro catálogo */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                color: '#ccc',
                marginBottom: '4px'
              }}>
                Elegí tu vehículo
              </label>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                Autocompleta consumo y precio. Podés editarlos después.
              </div>
              <div className="ahorro-vehicle-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '8px' }}>
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    setSelectedSlug('');
                  }}
                  style={selectStyle}
                >
                  <option value="">Marca…</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <select
                  value={selectedSlug}
                  onChange={(e) => setSelectedSlug(e.target.value)}
                  disabled={!selectedBrand}
                  style={{ ...selectStyle, opacity: selectedBrand ? 1 : 0.5 }}
                >
                  <option value="">
                    {selectedBrand ? 'Modelo…' : 'Elegí marca primero'}
                  </option>
                  {modelsForBrand.map((m) => (
                    <option key={m.slug} value={m.slug}>
                      {m.model}{m.variant ? ` ${m.variant}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              {selectedModel && (
                <div style={{
                  fontSize: '12px',
                  color: '#00d084',
                  background: 'rgba(0,208,132,0.08)',
                  border: '1px solid rgba(0,208,132,0.25)',
                  borderRadius: '4px',
                  padding: '10px 12px',
                  lineHeight: 1.5,
                }}>
                  {selectedModel.rangeRealKm != null ? (
                    <>Autonomía real: {selectedModel.rangeRealKm} km medidos</>
                  ) : selectedModel.rangeWltpKm != null ? (
                    <>Autonomía WLTP (fábrica): {selectedModel.rangeWltpKm} km — todavía sin medir acá</>
                  ) : (
                    <>Sin dato de autonomía todavía</>
                  )}
                  {selectedModel.batteryKwh != null && (
                    <> · Batería: {selectedModel.batteryKwh} kWh</>
                  )}
                  {selectedModel.consumptionKwh100 == null && (
                    <div style={{ color: '#E8A33D', marginTop: 6 }}>
                      Sin consumo verificado todavía: el campo de abajo
                      quedó en el valor anterior, completalo vos.
                    </div>
                  )}
                  {selectedModel.priceUsd == null && (
                    <div style={{ color: '#8A9099', marginTop: 6 }}>
                      No tenemos precio verificado para este modelo todavía:
                      ingresalo vos abajo para calcular la amortización.
                    </div>
                  )}
                </div>
              )}
              {modelsError && (
                <div style={{ fontSize: '12px', color: '#E8A33D' }}>
                  No pudimos cargar el catálogo. Completá los datos a mano abajo.
                </div>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                color: '#ccc',
                marginBottom: '4px'
              }}>
                Tarifa de UTE
              </label>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                Horario barato con IVA incluido
              </div>
              <select
                value={tarifaUte}
                onChange={(e) => {
                  const selected = e.target.value as 'doble' | 'triple';
                  setTarifaUte(selected);
                  setPrecioKwh(TARIFAS_UTE[selected].value);
                }}
                style={selectStyle}
              >
                <option value="doble">{TARIFAS_UTE.doble.label}</option>
                <option value="triple">{TARIFAS_UTE.triple.label}</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                color: '#ccc',
                marginBottom: '4px'
              }}>
                Precio del kWh resultante
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  step="0.01"
                  value={precioKwh.toFixed(3)}
                  readOnly
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    background: '#141619',
                    border: '1px solid #2a2d33',
                    borderRadius: '4px',
                    padding: '12px 60px 12px 12px',
                    color: '#888',
                    fontSize: '16px',
                    fontFamily: 'IBM Plex Mono, monospace'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666',
                  fontSize: '14px'
                }}>
                  $/kWh
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                color: '#ccc',
                marginBottom: '8px'
              }}>
                Consumo
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  step="0.1"
                  value={consumoElectrico}
                  onChange={(e) => setConsumoElectrico(Number(e.target.value))}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    background: '#141619',
                    border: '1px solid #2a2d33',
                    borderRadius: '4px',
                    padding: '12px 90px 12px 12px',
                    color: '#fff',
                    fontSize: '16px',
                    fontFamily: 'IBM Plex Mono, monospace'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666',
                  fontSize: '14px'
                }}>
                  kWh/100km
                </span>
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                color: '#ccc',
                marginBottom: '8px'
              }}>
                Precio de compra
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  value={precioElectrico === 0 ? '' : precioElectrico}
                  onChange={(e) => setPrecioElectrico(Number(e.target.value) || 0)}
                  placeholder="Ingresá el precio"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    background: '#141619',
                    border: '1px solid #2a2d33',
                    borderRadius: '4px',
                    padding: '12px 50px 12px 12px',
                    color: '#fff',
                    fontSize: '16px',
                    fontFamily: 'IBM Plex Mono, monospace'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666',
                  fontSize: '14px'
                }}>
                  USD
                </span>
              </div>
            </div>
          </div>

          {/* CAMBIO */}
          <div style={{
            background: '#1B1E23',
            border: '1px solid #2a2d33',
            borderRadius: '8px',
            padding: '24px'
          }}>
            <h2 style={{
              fontSize: '12px',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: '0 0 20px 0',
              fontWeight: '500'
            }}>
              CAMBIO
            </h2>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                color: '#ccc',
                marginBottom: '8px'
              }}>
                Tipo de cambio
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  step="0.1"
                  value={tipoCambio}
                  onChange={(e) => setTipoCambio(Number(e.target.value))}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    background: '#141619',
                    border: '1px solid #2a2d33',
                    borderRadius: '4px',
                    padding: '12px 60px 12px 12px',
                    color: '#fff',
                    fontSize: '16px',
                    fontFamily: 'IBM Plex Mono, monospace'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666',
                  fontSize: '14px'
                }}>
                  $/USD
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* COSTO POR KM */}
          <div style={{
            background: '#1B1E23',
            border: '1px solid #2a2d33',
            borderRadius: '8px',
            padding: '24px'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              COSTO POR KM
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '24px',
                  color: '#ff8c00',
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontWeight: '500'
                }}>
                  ${costoPorKmCombustion.toFixed(2)}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  marginTop: '4px'
                }}>
                  combustión
                </div>
              </div>
              <div style={{
                color: '#666',
                fontSize: '16px'
              }}>
                vs
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '24px',
                  color: '#00d084',
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontWeight: '500'
                }}>
                  ${costoPorKmElectrico.toFixed(2)}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  marginTop: '4px'
                }}>
                  eléctrico
                </div>
              </div>
            </div>
          </div>

          {/* AHORRO CON EL ELÉCTRICO */}
          <div style={{
            background: '#1B1E23',
            border: '2px solid #00d084',
            borderRadius: '8px',
            padding: '24px'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#00d084',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              AHORRO CON EL ELÉCTRICO
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '32px',
                color: '#00d084',
                fontFamily: 'IBM Plex Mono, monospace',
                fontWeight: '500',
                marginBottom: '4px'
              }}>
                ${Math.round(ahorroMensual).toLocaleString()}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#00d084',
                marginBottom: '8px'
              }}>
                /mes
              </div>
              <div style={{
                fontSize: '14px',
                color: '#666'
              }}>
                ${Math.round(ahorroAnual).toLocaleString()} al año
              </div>
            </div>
          </div>

          {/* AMORTIZÁS EL PRECIO DEL ELÉCTRICO EN */}
          <div style={{
            background: '#1B1E23',
            border: '1px solid #2a2d33',
            borderRadius: '8px',
            padding: '24px'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              AMORTIZÁS EL PRECIO DEL ELÉCTRICO EN
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '32px',
                color: ahorroMensual > 0 ? '#fff' : '#E8A33D',
                fontFamily: 'IBM Plex Mono, monospace',
                fontWeight: '500',
                marginBottom: '4px'
              }}>
                {amortizacionAnios != null
                  ? amortizacionAnios < 1
                    ? 'ya'
                    : amortizacionAnios.toFixed(1)
                  : '—'}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '16px'
              }}>
                {amortizacionAnios != null ? 'años' : precioElectrico <= 0 ? 'completá el precio arriba' : 'sin ahorro mensual'}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#666',
                lineHeight: '1.4'
              }}>
                precio del eléctrico: ${Math.round(precioElectricoUYU).toLocaleString()} · ${precioElectrico.toLocaleString()} USD
              </div>
            </div>
          </div>

          <SavingsChart
            monthlySavings={ahorroMensual}
            priceUYU={precioElectricoUYU}
            amortizacionMeses={amortizacionMeses}
          />

          {/* Share Button */}
          <button
            onClick={handleShare}
            style={{
              background: '#25D366',
              border: 'none',
              borderRadius: '8px',
              padding: '16px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => (e.target as HTMLButtonElement).style.background = '#1da851'}
            onMouseOut={(e) => (e.target as HTMLButtonElement).style.background = '#25D366'}
          >
            Compartir por WhatsApp
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #2a2d33',
        padding: '40px 20px',
        textAlign: 'center',
        color: '#666',
        fontSize: '14px',
        lineHeight: '1.5'
      }}>
        Precio de nafta: ANCAP/URSEA, julio 2026. Tarifa UTE: horario barato del Plan Inteligente (doble o triple horario) con IVA incluido. Autonomía y consumo eléctrico: catálogo de autoelectrico.uy. Ajustá los valores si tenés otra tarifa o el precio cambió.
      </footer>
    </div>
  );
}
