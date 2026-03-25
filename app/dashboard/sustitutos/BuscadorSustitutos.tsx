'use client'

import { useState } from 'react'

type Sustituto = {
  nombre: string
  emoji: string
  razon: string
  proporcion: string
  nota: string
  disponibilidad: string
}

type ResultadoSustitutos = {
  ingrediente_original: string
  sustitutos: Sustituto[]
  consejo_general: string
}

function SustitutoCard({ sustituto, index }: { sustituto: Sustituto; index: number }) {
  const medalColors = ['#F4A340', '#9ca3af', '#CD7F32']
  const medal = index < 3 ? medalColors[index] : null

  return (
    <div style={{
      background: 'white', borderRadius: 16,
      border: '1px solid #e5e7eb',
      padding: '20px',
      boxShadow: '0 1px 4px rgba(0,0,0,.04)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Medal indicator for top 3 */}
      {medal && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          width: 28, height: 28, borderRadius: '50%',
          background: medal, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: 'white',
        }}>
          {index + 1}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 36 }}>{sustituto.emoji}</span>
        <h3 style={{
          margin: 0, fontFamily: "'Fredoka',sans-serif",
          fontSize: 20, fontWeight: 600, color: '#1f2937',
        }}>{sustituto.nombre}</h3>
      </div>

      {/* Razon */}
      <p style={{ margin: '0 0 14px', fontSize: 14, color: '#374151', lineHeight: 1.6 }}>
        {sustituto.razon}
      </p>

      {/* Proporcion badge */}
      <div style={{ marginBottom: 10 }}>
        <span style={{
          background: '#FFF7ED', color: '#E8821A',
          borderRadius: 20, padding: '5px 14px',
          fontSize: 12, fontWeight: 600,
          border: '1px solid #FED7AA',
        }}>
          📏 {sustituto.proporcion}
        </span>
      </div>

      {/* Nota */}
      {sustituto.nota && (
        <p style={{
          margin: '0 0 12px', fontSize: 12, color: '#6b7280',
          lineHeight: 1.5, fontStyle: 'italic',
        }}>
          💡 {sustituto.nota}
        </p>
      )}

      {/* Disponibilidad badge */}
      <div>
        <span style={{
          background: '#F0FDF4', color: '#16a34a',
          borderRadius: 20, padding: '4px 12px',
          fontSize: 11, fontWeight: 600,
          border: '1px solid #BBF7D0',
        }}>
          🏪 {sustituto.disponibilidad}
        </span>
      </div>
    </div>
  )
}

export default function BuscadorSustitutos({ edadMeses }: { edadMeses: number }) {
  const [ingrediente, setIngrediente] = useState('')
  const [contexto, setContexto] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [resultado, setResultado] = useState<ResultadoSustitutos | null>(null)
  const [error, setError] = useState('')

  async function buscarSustitutos(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!ingrediente.trim()) return
    setBuscando(true)
    setError('')
    setResultado(null)

    try {
      const res = await fetch('/api/sustitutos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingrediente: ingrediente.trim(),
          edadMeses,
          contexto: contexto.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Error buscando sustitutos')
        return
      }
      setResultado(data as ResultadoSustitutos)
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setBuscando(false)
    }
  }

  const sugerencias = ['Espinaca', 'Huevo', 'Leche', 'Harina de trigo', 'Mantequilla', 'Plátano']

  return (
    <div>
      {/* Age info */}
      <div style={{
        background: '#F0FDFA', border: '1px solid #99F6E4',
        borderRadius: 14, padding: '12px 18px', marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 20 }}>👶</span>
        <p style={{ margin: 0, fontSize: 14, color: '#0f766e' }}>
          Sustitutos seguros y adaptados para un bebé de <strong>{edadMeses} meses</strong>
        </p>
      </div>

      {/* Form card */}
      <div style={{
        background: 'white', borderRadius: 20,
        border: '1px solid #e5e7eb', padding: '28px',
        marginBottom: 32, boxShadow: '0 1px 6px rgba(0,0,0,.05)',
      }}>
        <form onSubmit={buscarSustitutos}>
          {/* Ingrediente input */}
          <div style={{ marginBottom: 18 }}>
            <label style={{
              display: 'block', fontSize: 14, fontWeight: 600,
              color: '#374151', marginBottom: 8,
            }}>
              ¿Qué ingrediente necesitas sustituir?
            </label>
            <input
              type="text"
              placeholder="Ej: espinaca, huevo, leche..."
              value={ingrediente}
              onChange={e => setIngrediente(e.target.value)}
              disabled={buscando}
              style={{
                width: '100%', padding: '13px 18px', borderRadius: 12,
                border: '2px solid #e5e7eb', fontSize: 15,
                fontFamily: "'Outfit',sans-serif", outline: 'none',
                background: buscando ? '#f9fafb' : 'white',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Contexto textarea */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block', fontSize: 14, fontWeight: 600,
              color: '#374151', marginBottom: 8,
            }}>
              ¿Para qué receta? <span style={{ fontWeight: 400, color: '#9ca3af' }}>(opcional)</span>
            </label>
            <textarea
              placeholder="Ej: para hacer panqueques, para una sopa de verduras..."
              value={contexto}
              onChange={e => setContexto(e.target.value)}
              disabled={buscando}
              rows={3}
              style={{
                width: '100%', padding: '13px 18px', borderRadius: 12,
                border: '2px solid #e5e7eb', fontSize: 14,
                fontFamily: "'Outfit',sans-serif", outline: 'none', resize: 'vertical',
                background: buscando ? '#f9fafb' : 'white',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={buscando || !ingrediente.trim()}
            style={{
              background: buscando || !ingrediente.trim()
                ? '#d1d5db'
                : 'linear-gradient(135deg, #0D9488, #0F766E)',
              color: 'white', border: 'none', borderRadius: 50,
              padding: '13px 28px', fontSize: 15, fontWeight: 700,
              cursor: buscando || !ingrediente.trim() ? 'not-allowed' : 'pointer',
              fontFamily: "'Fredoka',sans-serif",
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            {buscando ? (
              <>
                <span style={{
                  width: 16, height: 16, border: '2px solid rgba(255,255,255,.3)',
                  borderTopColor: 'white', borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.8s linear infinite',
                }} />
                Buscando...
              </>
            ) : (
              '🔄 Buscar sustitutos'
            )}
          </button>

          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </form>

        {/* Sugerencias */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>Populares:</span>
          {sugerencias.map(s => (
            <button
              key={s}
              onClick={() => setIngrediente(s)}
              style={{
                background: '#f3f4f6', border: 'none', borderRadius: 20,
                padding: '6px 14px', fontSize: 13, color: '#374151',
                cursor: 'pointer', fontFamily: "'Outfit',sans-serif",
              }}
            >
              {s}
            </button>
          ))}
        </div>
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
          {/* Consejo general */}
          <div style={{
            background: '#F0FDFA', border: '1px solid #99F6E4',
            borderRadius: 16, padding: '18px 22px', marginBottom: 28,
            display: 'flex', gap: 12, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>👩‍⚕️</span>
            <div>
              <p style={{
                margin: '0 0 4px', fontSize: 12, fontWeight: 700,
                color: '#0f766e', textTransform: 'uppercase', letterSpacing: 0.5,
              }}>
                Consejo de la nutricionista
              </p>
              <p style={{ margin: 0, fontSize: 14, color: '#0f766e', lineHeight: 1.6 }}>
                {resultado.consejo_general}
              </p>
            </div>
          </div>

          {/* Result header */}
          <h2 style={{
            fontFamily: "'Fredoka',sans-serif",
            fontSize: 22, fontWeight: 600, color: '#1f2937',
            margin: '0 0 6px',
          }}>
            🔄 Sustitutos para {resultado.ingrediente_original}
          </h2>
          <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 20px' }}>
            Ordenados de mejor a peor opción para {edadMeses} meses
          </p>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 14,
          }}>
            {resultado.sustitutos.map((s, i) => (
              <SustitutoCard key={i} sustituto={s} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
