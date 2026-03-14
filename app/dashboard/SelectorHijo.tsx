'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Hijo = { id: string; nombre: string; fecha_nacimiento: string }

function calcularMeses(fecha: string): number {
  const nac = new Date(fecha)
  const hoy = new Date()
  let m = (hoy.getFullYear() - nac.getFullYear()) * 12 + (hoy.getMonth() - nac.getMonth())
  if (hoy.getDate() < nac.getDate()) m--
  return Math.max(0, m)
}

export default function SelectorHijo({
  hijos,
  hijoActivoId,
}: {
  hijos: Hijo[]
  hijoActivoId: string | null
}) {
  const router = useRouter()
  const [cambiando, setCambiando] = useState(false)
  const [abierto, setAbierto] = useState(false)

  if (hijos.length === 0) return null

  const activo = hijos.find(h => h.id === hijoActivoId) ?? hijos[0]
  const meses = calcularMeses(activo.fecha_nacimiento)
  const edadTexto = meses < 12
    ? `${meses} meses`
    : `${Math.floor(meses / 12)} año${Math.floor(meses/12) > 1 ? 's' : ''}${meses % 12 > 0 ? ` y ${meses % 12} meses` : ''}`

  async function seleccionar(id: string) {
    setCambiando(true)
    setAbierto(false)
    try {
      const res = await fetch('/api/seleccionar-hijo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hijo_id: id }),
      })
      const d = await res.json()
      console.log('[selector] respuesta completa:', JSON.stringify(d))
    } catch (e) {
      console.error('[selector] fetch error:', e)
    }
    setCambiando(false)
    router.refresh()
  }

  return (
    <div style={{ position: 'relative', marginBottom: 20 }}>
      <button
        onClick={() => setAbierto(v => !v)}
        disabled={cambiando}
        style={{
          background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 50,
          padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 10,
          cursor: cambiando ? 'not-allowed' : 'pointer', fontFamily: "'Outfit',sans-serif",
          boxShadow: '0 1px 4px rgba(0,0,0,.06)',
        }}
      >
        <span style={{ fontSize: 20 }}>👶</span>
        <div style={{ textAlign: 'left' }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1f2937' }}>
            {cambiando ? 'Cambiando...' : activo.nombre}
          </p>
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>{edadTexto}</p>
        </div>
        {hijos.length > 1 && (
          <span style={{ color: '#9ca3af', fontSize: 12, marginLeft: 4 }}>
            {abierto ? '▲' : '▼'}
          </span>
        )}
      </button>

      {abierto && hijos.length > 1 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: 6,
          background: 'white', borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,.12)',
          border: '1px solid #f3f4f6', zIndex: 50, minWidth: 220, overflow: 'hidden',
        }}>
          {hijos.map(h => {
            const m = calcularMeses(h.fecha_nacimiento)
            const et = m < 12 ? `${m} meses` : `${Math.floor(m/12)} año${Math.floor(m/12)>1?'s':''}${m%12>0?` y ${m%12} meses`:''}`
            return (
              <button
                key={h.id}
                onClick={() => seleccionar(h.id)}
                style={{
                  width: '100%', padding: '12px 16px', background: h.id === hijoActivoId ? '#F0FDFA' : 'white',
                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                  fontFamily: "'Outfit',sans-serif", borderBottom: '1px solid #f9fafb',
                }}
              >
                <span style={{ fontSize: 18 }}>👶</span>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: h.id === hijoActivoId ? '#0d9488' : '#1f2937' }}>{h.nombre}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>{et}</p>
                </div>
                {h.id === hijoActivoId && <span style={{ marginLeft: 'auto', color: '#0d9488', fontSize: 14 }}>✓</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
