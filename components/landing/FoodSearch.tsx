'use client'

import { useState } from 'react'

const CHIPS = [
  { emoji: '🥑', label: 'Aguacate', food: 'aguacate' },
  { emoji: '🥚', label: 'Huevo', food: 'huevo' },
  { emoji: '🍌', label: 'Plátano', food: 'plátano' },
  { emoji: '🥦', label: 'Brócoli', food: 'brócoli' },
  { emoji: '🍗', label: 'Pollo', food: 'pollo' },
  { emoji: '🐟', label: 'Salmón', food: 'salmón' },
]

function formatRespuesta(texto: string) {
  // Convierte **texto** en <strong> y \n en <br>
  return texto
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />')
}

export default function FoodSearch() {
  const [food, setFood] = useState('')
  const [age, setAge] = useState('6')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function buscar(foodOverride?: string) {
    const alimento = foodOverride ?? food
    if (!alimento.trim()) return

    setLoading(true)
    setResult(null)
    setError(null)
    if (foodOverride) setFood(foodOverride)

    try {
      const res = await fetch('/api/buscar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alimento, edad: age }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data.respuesta)
    } catch {
      setError('No se pudo obtener la respuesta. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Search card */}
      <div style={{
        background: 'white', borderRadius: 28, padding: 28,
        boxShadow: '0 12px 50px rgba(0,0,0,.1)', maxWidth: 720,
        margin: '0 auto 16px', border: '2px solid transparent',
      }}>
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 18, fontWeight: 600, color: '#1f2937', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          🔍 ¿Qué alimento quieres consultar?
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
          <input
            type="text"
            value={food}
            onChange={e => setFood(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && buscar()}
            placeholder="Ej: aguacate, brócoli, pollo, mango..."
            style={{
              flex: 1, minWidth: 180, padding: '14px 20px',
              border: '2px solid #e5e7eb', borderRadius: 50,
              fontFamily: "'Outfit', sans-serif", fontSize: 16,
              outline: 'none', background: '#f9fafb', color: '#1f2937',
            }}
            onFocus={e => { e.target.style.borderColor = '#F4A340'; e.target.style.background = 'white' }}
            onBlur={e => { e.target.style.borderColor = '#e5e7eb' }}
          />
          <select
            value={age}
            onChange={e => setAge(e.target.value)}
            style={{
              padding: '14px 18px', border: '2px solid #e5e7eb',
              borderRadius: 50, fontFamily: "'Outfit', sans-serif",
              fontSize: 15, outline: 'none', background: '#f9fafb',
              color: '#1f2937', cursor: 'pointer',
            }}
          >
            {[6,7,8,9,10,11,12,18,24].map(m => (
              <option key={m} value={m}>{m === 24 ? '2 años' : `${m} meses`}</option>
            ))}
          </select>
          <button
            onClick={() => buscar()}
            disabled={loading || !food.trim()}
            style={{
              padding: '14px 28px',
              background: loading ? '#ccc' : 'linear-gradient(135deg,#F4A340,#E8821A)',
              color: 'white', border: 'none', borderRadius: 50,
              fontFamily: "'Fredoka', sans-serif", fontSize: 17,
              fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(232,130,26,.35)',
              display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
              transition: 'all .2s',
            }}
          >
            {loading ? '⏳ Consultando...' : '🔍 Consultar'}
          </button>
        </div>

        {/* Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>Populares:</span>
          {CHIPS.map(c => (
            <button
              key={c.food}
              onClick={() => buscar(c.food)}
              style={{
                background: '#CCFBF1', color: '#0d9488', border: 'none',
                padding: '6px 14px', borderRadius: 20, fontSize: 13,
                fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
                transition: 'all .15s',
              }}
              onMouseOver={e => { (e.target as HTMLElement).style.background = '#0d9488'; (e.target as HTMLElement).style.color = 'white' }}
              onMouseOut={e => { (e.target as HTMLElement).style.background = '#CCFBF1'; (e.target as HTMLElement).style.color = '#0d9488' }}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      {(result || error) && (
        <div style={{ maxWidth: 720, margin: '0 auto 16px' }}>
          {error ? (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 20, padding: 24, color: '#DC2626', textAlign: 'center' }}>
              {error}
            </div>
          ) : (
            <div style={{
              background: 'white', borderRadius: 28, padding: 28,
              boxShadow: '0 8px 30px rgba(0,0,0,.1)',
              border: '2px solid #CCFBF1',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 24 }}>🥗</span>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 18, fontWeight: 600, color: '#0d9488' }}>
                  {food} · {age === '24' ? '2 años' : `${age} meses`}
                </span>
              </div>
              <div
                style={{ fontSize: 15, lineHeight: 1.8, color: '#374151' }}
                dangerouslySetInnerHTML={{ __html: formatRespuesta(result!) }}
              />
              <div style={{ marginTop: 20, padding: '14px 20px', background: '#FFF7ED', borderRadius: 16, fontSize: 14, color: '#92400E' }}>
                💡 <strong>¿Quieres respuestas más detalladas, historial y sin límites?</strong>{' '}
                <a href="https://hotm.io/x7hSCoK" target="_blank" rel="noreferrer" style={{ color: '#E8821A', fontWeight: 700 }}>
                  Únete al Método NutriPeques →
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div style={{ maxWidth: 720, margin: '0 auto 16px', background: 'white', borderRadius: 28, padding: 28, boxShadow: '0 8px 30px rgba(0,0,0,.1)' }}>
          {[80, 60, 90, 70, 50].map((w, i) => (
            <div key={i} style={{ height: 16, borderRadius: 8, background: '#f3f4f6', marginBottom: 12, width: `${w}%`, animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      )}
    </div>
  )
}
