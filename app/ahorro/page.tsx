'use client';

import { useState } from 'react';

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
  const [precioElectrico, setPrecioElectrico] = useState(32900);
  const [tipoCambio, setTipoCambio] = useState(40.5);

  // Calculations
  const costoPorKmCombustion = (precioNafta * consumoCombustion) / 100;
  const costoPorKmElectrico = (precioKwh * consumoElectrico) / 100;
  const ahorroMensual = (costoPorKmCombustion - costoPorKmElectrico) * kilometrosPorMes;
  const ahorroAnual = ahorroMensual * 12;
  const precioElectricoUSD = precioElectrico / tipoCambio;
  const amortizacionMeses = ahorroMensual > 0 ? precioElectrico / ahorroMensual : null;
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

  return (
    <div style={{
      minHeight: '100vh',
      background: '#141619',
      color: '#fff',
      fontFamily: 'IBM Plex Sans, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        borderBottom: '1px solid #2a2d33'
      }}>
        <a href="/" style={{
          color: '#fff',
          textDecoration: 'none',
          fontSize: '18px',
          fontWeight: '500'
        }}>
          autoelectrico.<span style={{ color: '#00d084' }}>uy</span>
        </a>
        <div style={{ display: 'flex', gap: '30px' }}>
          <a href="/modelos" style={{ color: '#aaa', textDecoration: 'none' }}>Modelos</a>
          <a href="/comparar" style={{ color: '#aaa', textDecoration: 'none' }}>Comparar</a>
          <a href="/ahorro" style={{ color: '#fff', textDecoration: 'none' }}>Ahorro</a>
        </div>
      </nav>

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
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
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
                  L/100km
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
                style={{
                  width: '100%',
                  background: '#141619',
                  border: '1px solid #2a2d33',
                  borderRadius: '4px',
                  padding: '12px',
                  color: '#fff',
                  fontSize: '16px',
                  fontFamily: 'IBM Plex Sans, sans-serif',
                  cursor: 'pointer'
                }}
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
                  value={precioElectrico}
                  onChange={(e) => setPrecioElectrico(Number(e.target.value))}
                  style={{
                    width: '100%',
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
                {amortizacionAnios != null ? 'años' : 'sin ahorro mensual'}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#666',
                lineHeight: '1.4'
              }}>
                precio del eléctrico: ${precioElectrico.toLocaleString()} · ${Math.round(precioElectricoUSD).toLocaleString()} USD
              </div>
            </div>
          </div>

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
        Precio de nafta: ANCAP/URSEA, julio 2026. Tarifa UTE: horario barato del Plan Inteligente (doble o triple horario) con IVA incluido. Ajustá los valores si tenés otra tarifa o el precio cambió.
      </footer>
    </div>
  );
}