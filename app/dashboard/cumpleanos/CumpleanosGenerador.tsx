'use client'

import { useState } from 'react'

type Pastel = {
  nombre: string
  emoji: string
  descripcion: string
  tiempo_preparacion: number
  tiempo_coccion: number
  porciones: string
  ingredientes: string[]
  preparacion: string[]
  nota_salud: string
}

type Aperitivo = {
  nombre: string
  emoji: string
  descripcion: string
  tiempo_preparacion: number
  ingredientes: string[]
  para_edad: string
}

type ResultadoCumpleanos = {
  pasteles: Pastel[]
  aperitivos: Aperitivo[]
}

function calcularEdadCumple(edadActualMeses: number): number {
  // Find how many months until the next birthday (12-month mark)
  const mesesEnElAno = edadActualMeses % 12
  const mesesHastaCumple = mesesEnElAno === 0 ? 12 : (12 - mesesEnElAno)
  return edadActualMeses + mesesHastaCumple
}

function PastelCard({ pastel }: { pastel: Pastel }) {
  const [expandido, setExpandido] = useState(false)

  return (
    <div style={{
      background: 'white',
      borderRadius: 20,
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,.05)',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #FFF7ED, #FEF3C7)',
        padding: '20px 24px',
        borderBottom: '1px solid #e5e7eb',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 36 }}>{pastel.emoji}</span>
          <div>
            <h3 style={{
              margin: 0,
              fontFamily: "'Fredoka',sans-serif",
              fontSize: 20,
              fontWeight: 600,
              color: '#1f2937',
            }}>{pastel.nombre}</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>{pastel.porciones}</p>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.5 }}>{pastel.descripcion}</p>

        {/* Time badges */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          <span style={{
            background: '#FEF3C7', color: '#D97706',
            borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600,
          }}>
            ⏱ Prep: {pastel.tiempo_preparacion} min
          </span>
          {pastel.tiempo_coccion > 0 && (
            <span style={{
              background: '#FEE2E2', color: '#DC2626',
              borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600,
            }}>
              🔥 Cocción: {pastel.tiempo_coccion} min
            </span>
          )}
        </div>
      </div>

      {/* Nota salud */}
      <div style={{ padding: '12px 24px', background: '#F0FDFA', borderBottom: '1px solid #e5e7eb' }}>
        <p style={{ margin: 0, fontSize: 13, color: '#0f766e' }}>
          <strong>✅ Por qué es saludable:</strong> {pastel.nota_salud}
        </p>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setExpandido(!expandido)}
        style={{
          width: '100%', padding: '14px 24px',
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, color: '#E8821A',
        }}
      >
        <span>{expandido ? 'Ocultar receta' : 'Ver receta completa'}</span>
        <span style={{ transform: expandido ? 'rotate(180deg)' : 'rotate(0)', display: 'inline-block', transition: 'transform .2s' }}>▼</span>
      </button>

      {/* Expandible */}
      {expandido && (
        <div style={{ padding: '0 24px 24px', borderTop: '1px solid #f3f4f6' }}>
          {/* Ingredientes */}
          <div style={{ marginBottom: 20 }}>
            <p style={{
              margin: '16px 0 10px',
              fontSize: 12, fontWeight: 700, color: '#9ca3af',
              textTransform: 'uppercase', letterSpacing: 0.5,
            }}>🛒 Ingredientes</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {pastel.ingredientes.map((ing, i) => (
                <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 14, color: '#374151' }}>
                  <span style={{ color: '#F4A340', flexShrink: 0, marginTop: 1 }}>•</span>
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Preparación */}
          <div>
            <p style={{
              margin: '0 0 10px',
              fontSize: 12, fontWeight: 700, color: '#9ca3af',
              textTransform: 'uppercase', letterSpacing: 0.5,
            }}>👩‍🍳 Preparación</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pastel.preparacion.map((paso, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  background: '#f8fafc', borderRadius: 10, padding: '10px 14px',
                }}>
                  <span style={{
                    background: '#E8821A', color: 'white', borderRadius: '50%',
                    width: 22, height: 22, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>{i + 1}</span>
                  <p style={{ margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.5 }}>{paso}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AperitivoCard({ aperitivo }: { aperitivo: Aperitivo }) {
  const [expandido, setExpandido] = useState(false)

  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,.04)',
    }}>
      <div style={{ padding: '16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>{aperitivo.emoji}</span>
          <h4 style={{
            margin: 0, fontFamily: "'Fredoka',sans-serif",
            fontSize: 16, fontWeight: 600, color: '#1f2937',
          }}>{aperitivo.nombre}</h4>
        </div>
        <p style={{ margin: '0 0 10px', fontSize: 13, color: '#6b7280', lineHeight: 1.4 }}>
          {aperitivo.descripcion}
        </p>

        {/* Badges */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          <span style={{
            background: '#FEF3C7', color: '#D97706',
            borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600,
          }}>⏱ {aperitivo.tiempo_preparacion} min</span>
          <span style={{
            background: '#F0FDFA', color: '#0d9488',
            borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600,
          }}>{aperitivo.para_edad}</span>
        </div>

        {/* Toggle ingredientes */}
        <button
          onClick={() => setExpandido(!expandido)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            fontSize: 12, fontWeight: 600, color: '#E8821A',
            fontFamily: "'Outfit',sans-serif", display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          {expandido ? 'Ocultar ingredientes ▲' : 'Ver ingredientes ▼'}
        </button>

        {expandido && (
          <ul style={{ margin: '10px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {aperitivo.ingredientes.map((ing, i) => (
              <li key={i} style={{ display: 'flex', gap: 6, fontSize: 12, color: '#374151' }}>
                <span style={{ color: '#F4A340', flexShrink: 0 }}>•</span>
                <span>{ing}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default function CumpleanosGenerador({
  nombreBebe,
  edadActualMeses,
  pais,
}: {
  nombreBebe: string
  edadActualMeses: number
  pais: string
}) {
  const edadCumple = calcularEdadCumple(edadActualMeses)
  const [numInvitados, setNumInvitados] = useState(10)
  const [generando, setGenerando] = useState(false)
  const [resultado, setResultado] = useState<ResultadoCumpleanos | null>(null)
  const [error, setError] = useState('')

  async function generarIdeas() {
    setGenerando(true)
    setError('')
    setResultado(null)

    try {
      const res = await fetch('/api/cumpleanos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ edadCumple, nombreBebe, numInvitados, pais }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Error generando ideas')
        return
      }
      setResultado(data as ResultadoCumpleanos)
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setGenerando(false)
    }
  }

  return (
    <div>
      {/* Loading overlay */}
      {generando && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: 'white', borderRadius: 24, padding: '48px 40px',
            textAlign: 'center', maxWidth: 360, width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,.3)',
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎂</div>
            <h3 style={{
              margin: '0 0 8px', fontFamily: "'Fredoka',sans-serif",
              fontSize: 22, color: '#1f2937',
            }}>Preparando ideas</h3>
            <p style={{ margin: '0 0 20px', color: '#6b7280', fontSize: 14 }}>
              Creando recetas especiales para el cumpleaños de {nombreBebe}...
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: '#F4A340',
                  animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
            <style>{`
              @keyframes bounce {
                0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
                40% { transform: scale(1); opacity: 1; }
              }
            `}</style>
          </div>
        </div>
      )}

      {/* Form card */}
      <div style={{
        background: 'white', borderRadius: 20,
        border: '1px solid #e5e7eb', padding: '28px',
        marginBottom: 32, boxShadow: '0 1px 6px rgba(0,0,0,.05)',
      }}>
        {/* Age info badge */}
        <div style={{
          background: '#FFF7ED', border: '1px solid #FED7AA',
          borderRadius: 14, padding: '14px 18px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 22 }}>🎉</span>
          <div>
            <p style={{ margin: 0, fontSize: 14, color: '#92400E', fontWeight: 600 }}>
              {nombreBebe} cumplirá {edadCumple} meses en su próximo cumpleaños
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#B45309' }}>
              Las recetas estarán adaptadas para esa edad
            </p>
          </div>
        </div>

        {/* Number of guests */}
        <div style={{ marginBottom: 24 }}>
          <label style={{
            display: 'block', fontSize: 14, fontWeight: 600,
            color: '#374151', marginBottom: 8,
          }}>
            👥 ¿Cuántos invitados esperan?
          </label>
          <input
            type="number"
            min={1}
            max={200}
            value={numInvitados}
            onChange={e => setNumInvitados(Number(e.target.value))}
            style={{
              width: '100%', maxWidth: 200,
              padding: '12px 16px', borderRadius: 12,
              border: '2px solid #e5e7eb', fontSize: 16,
              fontFamily: "'Outfit',sans-serif", outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Generate button */}
        <button
          onClick={generarIdeas}
          disabled={generando}
          style={{
            background: generando
              ? '#d1d5db'
              : 'linear-gradient(135deg, #F4A340, #E8821A)',
            color: 'white', border: 'none', borderRadius: 50,
            padding: '14px 32px', fontSize: 16, fontWeight: 700,
            cursor: generando ? 'not-allowed' : 'pointer',
            fontFamily: "'Fredoka',sans-serif",
          }}
        >
          ✨ Generar ideas de cumpleaños
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: '#FEF2F2', border: '1px solid #FECACA',
          borderRadius: 14, padding: '14px 18px', marginBottom: 24,
        }}>
          <p style={{ margin: 0, color: '#DC2626', fontSize: 14 }}>⚠️ {error}</p>
        </div>
      )}

      {/* Results */}
      {resultado && (
        <div>
          {/* Pasteles */}
          <div style={{ marginBottom: 40 }}>
            <h2 style={{
              fontFamily: "'Fredoka',sans-serif",
              fontSize: 24, fontWeight: 600, color: '#1f2937',
              margin: '0 0 6px',
            }}>
              🎂 Opciones de pastel
            </h2>
            <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 20px' }}>
              3 recetas de pastel saludable para celebrar
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {resultado.pasteles.map((pastel, i) => (
                <PastelCard key={i} pastel={pastel} />
              ))}
            </div>
          </div>

          {/* Aperitivos */}
          <div>
            <h2 style={{
              fontFamily: "'Fredoka',sans-serif",
              fontSize: 24, fontWeight: 600, color: '#1f2937',
              margin: '0 0 6px',
            }}>
              🥕 Aperitivos saludables
            </h2>
            <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 20px' }}>
              15 ideas de bocadillos nutritivos para los invitados
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 12,
            }}>
              {resultado.aperitivos.map((aperitivo, i) => (
                <AperitivoCard key={i} aperitivo={aperitivo} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
