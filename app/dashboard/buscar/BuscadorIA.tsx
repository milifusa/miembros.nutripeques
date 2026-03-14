'use client'

import { useState } from 'react'

type Busqueda = {
  id: string
  consulta: string
  respuesta: string
  created_at: string
}

// ── Parser ─────────────────────────────────────────────────────────────────
function parseSecciones(texto: string) {
  const secciones: Record<string, string> = {}
  const lines = texto.split('\n')
  let titulo = ''
  let buf: string[] = []

  const flush = () => {
    if (titulo) secciones[titulo] = buf.join('\n').trim()
  }

  for (const line of lines) {
    // **Título:** inline content  o  **Título**
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

function getSafetyInfo(texto: string): { color: string; bg: string; border: string; label: string } {
  if (texto.includes('✅')) return { color: '#15803d', bg: '#DCFCE7', border: '#86efac', label: '✅ Seguro para esta edad' }
  if (texto.includes('❌')) return { color: '#dc2626', bg: '#FEE2E2', border: '#fca5a5', label: '❌ No recomendado aún' }
  return { color: '#D97706', bg: '#FEF3C7', border: '#fcd34d', label: '⚠️ Con precauciones' }
}

function BulletList({ texto }: { texto: string }) {
  const items = texto.split('\n').filter(l => l.trim().startsWith('•') || l.trim().startsWith('-'))
  if (!items.length) {
    return <p style={{ margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{texto}</p>
  }
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, i) => {
        const raw = item.replace(/^[•\-]\s*/, '')
        // bold key: rest
        const parts = raw.match(/^\*\*(.+?)\*\*(.*)$/)
        return (
          <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 14, color: '#374151', lineHeight: 1.5 }}>
            <span style={{ color: '#0d9488', marginTop: 2, flexShrink: 0 }}>•</span>
            <span>
              {parts ? (
                <><strong style={{ color: '#1f2937' }}>{parts[1]}</strong>{parts[2]}</>
              ) : raw}
            </span>
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
        // Remove step emoji (1️⃣ 2️⃣ 3️⃣) or number prefix
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

function RespuestaCard({ texto, edadUsada, alimentoBuscado }: { texto: string; edadUsada: number | null; alimentoBuscado: string }) {
  const sec = parseSecciones(texto)

  const seguroKey = Object.keys(sec).find(k => k.toLowerCase().includes('seguro') || k.toLowerCase().includes('es seguro'))
  const edadKey = Object.keys(sec).find(k => k.toLowerCase().includes('edad m'))
  const prepKey = Object.keys(sec).find(k => k.toLowerCase().includes('preparar') || k.toLowerCase().includes('c\u00f3mo'))
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
        <h2 className="np-buscador-result-title" style={{ margin: '0 0 12px', fontFamily: "'Fredoka',sans-serif", fontSize: 28, fontWeight: 700, textTransform: 'capitalize' }}>
          {alimentoBuscado}
        </h2>
        {edadUsada && (
          <span style={{ background: safety.bg, color: safety.color, borderRadius: 20, fontSize: 12, fontWeight: 700, padding: '4px 12px', border: `1px solid ${safety.border}` }}>
            {safety.label} · {edadUsada} meses
          </span>
        )}
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

      {/* Edad mínima + Cómo preparar — row */}
      <div className="np-dash-prep-grid" style={{ display: 'grid', gridTemplateColumns: edadKey && prepKey ? '1fr 2fr' : '1fr', gap: 12 }}>
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
    </div>
  )
}

// ── Component principal ────────────────────────────────────────────────────
export default function BuscadorIA({
  edadBebe,
  nombreBebe,
  historialInicial,
}: {
  edadBebe: number | null
  nombreBebe: string | null
  historialInicial: Busqueda[]
}) {
  const [alimento, setAlimento] = useState('')
  const [alimentoBuscado, setAlimentoBuscado] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [respuesta, setRespuesta] = useState('')
  const [edadUsada, setEdadUsada] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [historial, setHistorial] = useState<Busqueda[]>(historialInicial)
  const [verHistorial, setVerHistorial] = useState(false)
  const [expandido, setExpandido] = useState<string | null>(null)

  async function buscar(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!alimento.trim()) return
    setBuscando(true)
    setError('')
    setRespuesta('')

    try {
      const res = await fetch('/api/buscar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alimento }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }

      setRespuesta(data.respuesta)
      setEdadUsada(data.edad)
      setAlimentoBuscado(alimento.trim())
      setHistorial(prev => [{
        id: Date.now().toString(),
        consulta: alimento.trim(),
        respuesta: data.respuesta,
        created_at: new Date().toISOString(),
      }, ...prev].slice(0, 20))
      setAlimento('')
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setBuscando(false)
    }
  }

  const sugerencias = ['🥑 Aguacate', '🥚 Huevo', '🍌 Plátano', '🥦 Brócoli', '🍗 Pollo', '🐟 Salmón']

  return (
    <div>
      {/* Info edad */}
      {edadBebe ? (
        <div style={{ background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: 14, padding: '12px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>👶</span>
          <p style={{ margin: 0, fontSize: 14, color: '#0f766e' }}>
            Respuestas adaptadas para <strong>{nombreBebe ?? 'tu bebé'}</strong> de <strong>{edadBebe} meses</strong>.{' '}
            <a href="/dashboard/perfil" style={{ color: '#0d9488', fontWeight: 600, textDecoration: 'none' }}>Cambiar →</a>
          </p>
        </div>
      ) : (
        <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 14, padding: '12px 18px', marginBottom: 20 }}>
          <p style={{ margin: 0, fontSize: 14, color: '#92400E' }}>
            ⚠️ No tenemos la edad de tu bebé.{' '}
            <a href="/dashboard/perfil" style={{ color: '#E8821A', fontWeight: 700, textDecoration: 'none' }}>Configura el perfil →</a>
            {' '}para respuestas personalizadas.
          </p>
        </div>
      )}

      {/* Buscador */}
      <form onSubmit={buscar} className="np-buscador-form" style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Escribe un alimento... ej: aguacate, huevo, fresa"
          value={alimento}
          onChange={e => setAlimento(e.target.value)}
          disabled={buscando}
          style={{
            flex: 1, padding: '13px 18px', borderRadius: 50,
            border: '2px solid #e5e7eb', fontSize: 15, fontFamily: "'Outfit',sans-serif",
            outline: 'none', background: buscando ? '#f9fafb' : 'white',
          }}
        />
        <button
          type="submit"
          disabled={buscando || !alimento.trim()}
          style={{
            background: buscando || !alimento.trim() ? '#d1d5db' : 'linear-gradient(135deg,#0D9488,#0F766E)',
            color: 'white', border: 'none', borderRadius: 50, padding: '13px 24px',
            fontSize: 15, fontWeight: 700, cursor: buscando ? 'not-allowed' : 'pointer',
            fontFamily: "'Fredoka',sans-serif", whiteSpace: 'nowrap',
          }}
        >
          {buscando ? '⏳ Consultando...' : '🔍 Consultar'}
        </button>
      </form>

      {/* Sugerencias */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
        <span style={{ fontSize: 13, color: '#9ca3af', alignSelf: 'center' }}>Populares:</span>
        {sugerencias.map(s => (
          <button
            key={s}
            onClick={() => setAlimento(s.replace(/^.+ /, ''))}
            style={{
              background: '#f3f4f6', border: 'none', borderRadius: 20, padding: '6px 14px',
              fontSize: 13, color: '#374151', cursor: 'pointer', fontFamily: "'Outfit',sans-serif",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Cargando */}
      {buscando && (
        <div style={{ background: 'white', borderRadius: 20, padding: '40px', textAlign: 'center', border: '1px solid #f3f4f6' }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>🤖</div>
          <p style={{ color: '#0d9488', fontSize: 15, margin: 0, fontWeight: 600 }}>Consultando a NutriPeques IA...</p>
          <p style={{ color: '#9ca3af', fontSize: 13, margin: '6px 0 0' }}>Preparando la mejor respuesta para tu bebé</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 14, padding: '14px 18px' }}>
          <p style={{ margin: 0, color: '#DC2626', fontSize: 14 }}>⚠️ {error}</p>
        </div>
      )}

      {/* Respuesta */}
      {respuesta && !buscando && (
        <div style={{ marginBottom: 28 }}>
          <RespuestaCard texto={respuesta} edadUsada={edadUsada} alimentoBuscado={alimentoBuscado} />
        </div>
      )}

      {/* Historial */}
      {historial.length > 0 && (
        <div>
          <button
            onClick={() => setVerHistorial(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: '#6b7280', padding: 0, marginBottom: 12, fontFamily: "'Outfit',sans-serif" }}
          >
            <span style={{ transform: verHistorial ? 'rotate(90deg)' : 'rotate(0)', display: 'inline-block', transition: 'transform .2s' }}>▶</span>
            Historial de búsquedas ({historial.length})
          </button>

          {verHistorial && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {historial.map(b => (
                <div key={b.id} style={{ background: 'white', borderRadius: 14, border: '1px solid #f3f4f6', overflow: 'hidden' }}>
                  <button
                    onClick={() => setExpandido(expandido === b.id ? null : b.id)}
                    style={{
                      width: '100%', padding: '14px 18px', background: 'none', border: 'none',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      fontFamily: "'Outfit',sans-serif", textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 18 }}>🔍</span>
                      <span style={{ fontWeight: 600, color: '#1f2937', fontSize: 14, textTransform: 'capitalize' }}>{b.consulta}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 12, color: '#9ca3af' }}>
                        {new Date(b.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                      </span>
                      <span style={{ color: '#9ca3af', fontSize: 12 }}>{expandido === b.id ? '▲' : '▼'}</span>
                    </div>
                  </button>
                  {expandido === b.id && (
                    <div style={{ padding: '0 18px 18px', borderTop: '1px solid #f9fafb' }}>
                      <RespuestaCard texto={b.respuesta} edadUsada={null} alimentoBuscado={b.consulta} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
