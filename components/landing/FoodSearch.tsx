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

// ── Parser (igual que en el buscador interno) ──────────────────────────────
function parseSecciones(texto: string) {
  const secciones: Record<string, string> = {}
  const lines = texto.split('\n')
  let titulo = ''
  let buf: string[] = []

  const flush = () => { if (titulo) secciones[titulo] = buf.join('\n').trim() }

  for (const line of lines) {
    const m = line.match(/^\*\*(.+?)\*\*:?\s*(.*)$/)
    if (m) {
      flush()
      titulo = m[1].trim()
      buf = m[2] ? [m[2]] : []
    } else {
      buf.push(line)
    }
  }
  flush()
  return secciones
}

function getSafetyInfo(texto: string) {
  if (texto.includes('✅')) return { color: '#15803d', bg: '#DCFCE7', border: '#86efac', label: '✅ Seguro para esta edad' }
  if (texto.includes('❌')) return { color: '#dc2626', bg: '#FEE2E2', border: '#fca5a5', label: '❌ No recomendado aún' }
  return { color: '#D97706', bg: '#FEF3C7', border: '#fcd34d', label: '⚠️ Con precauciones' }
}

function BulletList({ texto }: { texto: string }) {
  const items = texto.split('\n').filter(l => l.trim().startsWith('•') || l.trim().startsWith('-'))
  if (!items.length) return <p style={{ margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{texto}</p>
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, i) => {
        const raw = item.replace(/^[•\-]\s*/, '')
        const parts = raw.match(/^\*\*(.+?)\*\*(.*)$/)
        return (
          <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 14, color: '#374151', lineHeight: 1.5 }}>
            <span style={{ color: '#0d9488', marginTop: 2, flexShrink: 0 }}>•</span>
            <span>{parts ? <><strong style={{ color: '#1f2937' }}>{parts[1]}</strong>{parts[2]}</> : raw}</span>
          </li>
        )
      })}
    </ul>
  )
}

function RecipeSteps({ texto }: { texto: string }) {
  const lines = texto.split('\n').filter(l => l.trim())
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {lines.map((line, i) => {
        const text = line.replace(/^[1-9]️⃣\s*|^\d+\.\s*/, '')
        return (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: '#f8fafc', borderRadius: 10, padding: '10px 14px' }}>
            <span style={{ background: '#0d9488', color: 'white', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
            <p style={{ margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.5 }}>{text}</p>
          </div>
        )
      })}
    </div>
  )
}

function NutrientPills({ texto }: { texto: string }) {
  const colors = ['#FEF3C7|#D97706', '#DBEAFE|#1d4ed8', '#F3E8FF|#7C3AED', '#DCFCE7|#15803d', '#FCE7F3|#be185d']
  const items = texto.split('\n').filter(l => l.trim().startsWith('•') || l.trim().startsWith('-'))
  if (!items.length) return <p style={{ margin: 0, fontSize: 14, color: '#374151' }}>{texto}</p>
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, i) => {
        const raw = item.replace(/^[•\-]\s*/, '')
        const [bg, text] = colors[i % colors.length].split('|')
        const parts = raw.match(/^\*\*(.+?)\*\*(.*)$/)
        return (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ background: bg, color: text, borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
              ✨ {parts ? parts[1] : raw.split(' ')[0]}
            </span>
            {parts && <span style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5, paddingTop: 2 }}>{parts[2]}</span>}
          </div>
        )
      })}
    </div>
  )
}

const foodSearchStyles = `
  @media (max-width: 640px) {
    .np-search-card { padding: 18px !important; border-radius: 20px !important; }
    .np-prep-grid { grid-template-columns: 1fr !important; }
    .np-hero-title { font-size: 22px !important; }
    .np-hero-badge { font-size: 11px !important; }
    .np-search-row { flex-direction: column !important; }
    .np-search-row input, .np-search-row select, .np-search-row button { width: 100% !important; border-radius: 14px !important; box-sizing: border-box; }
  }
`

function RespuestaCard({ texto, edadUsada, alimentoBuscado }: { texto: string; edadUsada: number; alimentoBuscado: string }) {
  const sec = parseSecciones(texto)
  const seguroKey = Object.keys(sec).find(k => k.toLowerCase().includes('seguro') || k.toLowerCase().includes('es seguro'))
  const edadKey = Object.keys(sec).find(k => k.toLowerCase().includes('edad m'))
  const prepKey = Object.keys(sec).find(k => k.toLowerCase().includes('preparar') || k.toLowerCase().includes('cómo'))
  const nutriKey = Object.keys(sec).find(k => k.toLowerCase().includes('nutriente'))
  const recetaKey = Object.keys(sec).find(k => k.toLowerCase().includes('receta'))
  const importanteKey = Object.keys(sec).find(k => k.toLowerCase().includes('importante'))

  const seguroTexto = seguroKey ? sec[seguroKey] : ''
  const safety = getSafetyInfo(seguroTexto)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#0f766e,#0d9488,#14b8a6)', borderRadius: 20, padding: '24px 24px 20px', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -20, top: -20, fontSize: 100, opacity: 0.1 }}>🍽️</div>
        <p style={{ margin: '0 0 8px', fontSize: 13, opacity: 0.8, fontWeight: 500 }}>Resultado para</p>
        <h2 style={{ margin: '0 0 12px', fontFamily: "'Fredoka',sans-serif", fontSize: 28, fontWeight: 700, textTransform: 'capitalize' }}>{alimentoBuscado}</h2>
        <span style={{ background: safety.bg, color: safety.color, borderRadius: 20, fontSize: 12, fontWeight: 700, padding: '4px 12px', border: `1px solid ${safety.border}` }}>
          {safety.label} · {edadUsada} meses
        </span>
      </div>

      {/* Seguridad */}
      {seguroTexto && (
        <div style={{ background: safety.bg, border: `1px solid ${safety.border}`, borderRadius: 16, padding: '16px 20px' }}>
          <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: safety.color, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            ¿Es seguro para {edadUsada} meses?
          </p>
          <p style={{ margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.6 }}>
            {seguroTexto.replace(/✅|⚠️|❌/g, '').replace(/\*\*/g, '').trim()}
          </p>
        </div>
      )}

      {/* Edad + Preparación */}
      <div className="np-prep-grid" style={{ display: 'grid', gridTemplateColumns: edadKey && prepKey ? '1fr 2fr' : '1fr', gap: 12 }}>
        {edadKey && (
          <div style={{ background: 'white', borderRadius: 16, padding: '16px 20px', border: '1px solid #e5e7eb' }}>
            <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5 }}>🕐 Edad mínima</p>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#1f2937' }}>{sec[edadKey].replace(/\*\*/g, '').trim()}</p>
          </div>
        )}
        {prepKey && (
          <div style={{ background: 'white', borderRadius: 16, padding: '16px 20px', border: '1px solid #e5e7eb' }}>
            <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5 }}>🍴 Cómo preparar</p>
            <BulletList texto={sec[prepKey]} />
          </div>
        )}
      </div>

      {/* Nutrientes */}
      {nutriKey && (
        <div style={{ background: 'white', borderRadius: 16, padding: '16px 20px', border: '1px solid #e5e7eb' }}>
          <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5 }}>✨ Nutrientes clave</p>
          <NutrientPills texto={sec[nutriKey]} />
        </div>
      )}

      {/* Receta */}
      {recetaKey && (
        <div style={{ background: 'white', borderRadius: 16, padding: '16px 20px', border: '1px solid #e5e7eb' }}>
          <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5 }}>🍳 Receta rápida</p>
          <RecipeSteps texto={sec[recetaKey]} />
        </div>
      )}

      {/* Importante */}
      {importanteKey && (
        <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 16, padding: '16px 20px' }}>
          <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: 0.5 }}>🌿 Tip de Liliana</p>
          <p style={{ margin: 0, fontSize: 14, color: '#92400E', lineHeight: 1.6 }}>
            {sec[importanteKey].replace(/🔴|🟡|🟢/g, '').replace(/\*\*/g, '').trim()}
          </p>
        </div>
      )}

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg,#0f766e,#0d9488)', borderRadius: 16, padding: '22px 24px', textAlign: 'center', color: 'white' }}>
        <p style={{ margin: '0 0 4px', fontFamily: "'Fredoka',sans-serif", fontSize: 18, fontWeight: 700 }}>
          Esto es solo una muestra 🤖
        </p>
        <p style={{ margin: '0 0 8px', fontSize: 13, opacity: 0.9, lineHeight: 1.5 }}>
          Con tu acceso tienes: IA ilimitada · menú semanal · lista de compras · plan de alérgenos · texturas · sustitutos · ideas de cumpleaños · bitácora del bebé · 10 guías PDF
        </p>
        <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700 }}>
          Todo por solo $299 MXN — pago único, acceso de por vida
        </p>
        <a
          href="/api/checkout"
          style={{ background: '#F4A340', color: 'white', padding: '12px 32px', borderRadius: 50, fontFamily: "'Fredoka',sans-serif", fontSize: 16, fontWeight: 700, textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 16px rgba(0,0,0,.2)' }}
        >
          🛒 Quiero la plataforma completa →
        </a>
      </div>
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────
export default function FoodSearch() {
  const [food, setFood] = useState('')
  const [alimentoBuscado, setAlimentoBuscado] = useState('')
  const [age, setAge] = useState(6)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [edadUsada, setEdadUsada] = useState(6)
  const [error, setError] = useState<string | null>(null)

  async function buscar(foodOverride?: string) {
    const alimento = foodOverride ?? food
    if (!alimento.trim()) return

    setLoading(true)
    setResult(null)
    setError(null)
    if (foodOverride) setFood(foodOverride)

    try {
      const res = await fetch('/api/buscar-publico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alimento, edad: age }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data.respuesta)
      setEdadUsada(data.edad)
      setAlimentoBuscado(alimento.trim())
    } catch {
      setError('No se pudo obtener la respuesta. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <style>{foodSearchStyles}</style>
      {/* Search card */}
      <div className="np-search-card" style={{
        background: 'white', borderRadius: 28, padding: 28,
        boxShadow: '0 12px 50px rgba(0,0,0,.1)', maxWidth: 720,
        margin: '0 auto 16px', border: '2px solid transparent',
      }}>
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 18, fontWeight: 600, color: '#1f2937', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          🔍 ¿Qué alimento quieres consultar?
        </div>

        <div className="np-search-row" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
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
            onChange={e => setAge(Number(e.target.value))}
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
              background: loading || !food.trim() ? '#d1d5db' : 'linear-gradient(135deg,#F4A340,#E8821A)',
              color: 'white', border: 'none', borderRadius: 50,
              fontFamily: "'Fredoka', sans-serif", fontSize: 17,
              fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? '⏳ Consultando...' : '🔍 Consultar'}
          </button>
        </div>

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
              }}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div style={{ maxWidth: 720, margin: '0 auto 16px', background: 'white', borderRadius: 28, padding: 28, boxShadow: '0 8px 30px rgba(0,0,0,.1)' }}>
          <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 14 }}>🤖</div>
          <p style={{ textAlign: 'center', color: '#0d9488', fontWeight: 600, margin: '0 0 20px' }}>Consultando a NutriPeques IA...</p>
          {[80, 60, 90, 70, 50].map((w, i) => (
            <div key={i} style={{ height: 14, borderRadius: 8, background: '#f3f4f6', marginBottom: 10, width: `${w}%` }} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ maxWidth: 720, margin: '0 auto 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 20, padding: 24, color: '#DC2626', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {/* Resultado */}
      {result && !loading && (
        <div style={{ maxWidth: 720, margin: '0 auto 16px' }}>
          <RespuestaCard texto={result} edadUsada={edadUsada} alimentoBuscado={alimentoBuscado} />
        </div>
      )}
    </div>
  )
}
