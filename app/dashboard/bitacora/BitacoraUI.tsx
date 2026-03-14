'use client'

import { useState } from 'react'

type Entrada = {
  id: string
  alimento: string
  fecha_introduccion: string
  reaccion: 'ninguna' | 'leve' | 'moderada'
  aceptacion: number
  notas: string | null
  created_at: string
}

const REACCIONES = {
  ninguna:  { label: 'Sin reacción', emoji: '✅', color: '#0d9488', bg: '#CCFBF1' },
  leve:     { label: 'Reacción leve', emoji: '⚠️', color: '#D97706', bg: '#FEF3C7' },
  moderada: { label: 'Reacción moderada', emoji: '🚨', color: '#DC2626', bg: '#FEE2E2' },
}

const ESTRELLAS = [1, 2, 3, 4, 5]

function Estrellas({ valor, onChange }: { valor: number; onChange?: (v: number) => void }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {ESTRELLAS.map(n => (
        <span
          key={n}
          onClick={() => onChange?.(n)}
          style={{ fontSize: 22, cursor: onChange ? 'pointer' : 'default', opacity: n <= valor ? 1 : 0.25 }}
        >
          ⭐
        </span>
      ))}
    </div>
  )
}

export default function BitacoraUI({
  entradasIniciales,
  nombreBebe,
}: {
  entradasIniciales: Entrada[]
  nombreBebe: string | null
}) {
  const [entradas, setEntradas] = useState<Entrada[]>(entradasIniciales)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    alimento: '',
    fecha_introduccion: new Date().toISOString().split('T')[0],
    reaccion: 'ninguna' as Entrada['reaccion'],
    aceptacion: 4,
    notas: '',
  })

  async function agregar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setGuardando(true)
    setError('')
    const res = await fetch('/api/bitacora', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setGuardando(false)
    if (!res.ok) { setError(data.error ?? 'Error al guardar'); return }
    setEntradas(prev => [data.entrada, ...prev])
    setForm({ alimento: '', fecha_introduccion: new Date().toISOString().split('T')[0], reaccion: 'ninguna', aceptacion: 4, notas: '' })
    setMostrarForm(false)
  }

  async function eliminar(id: string) {
    await fetch(`/api/bitacora?id=${id}`, { method: 'DELETE' })
    setEntradas(prev => prev.filter(e => e.id !== id))
  }

  // Stats
  const sinReaccion = entradas.filter(e => e.reaccion === 'ninguna').length
  const conReaccion = entradas.filter(e => e.reaccion !== 'ninguna').length
  const promAcep = entradas.length > 0 ? (entradas.reduce((s, e) => s + e.aceptacion, 0) / entradas.length).toFixed(1) : '-'

  return (
    <div>
      {/* Stats */}
      {entradas.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Alimentos', value: entradas.length, icon: '🥗', bg: '#F0FDFA', text: '#0d9488' },
            { label: 'Sin reacción', value: sinReaccion, icon: '✅', bg: '#F0FDF4', text: '#16a34a' },
            { label: 'Con reacción', value: conReaccion, icon: '⚠️', bg: '#FEF3C7', text: '#D97706' },
            { label: 'Aceptación avg', value: `${promAcep}⭐`, icon: '📊', bg: '#EDE9FE', text: '#7C3AED' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 14, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.text, fontFamily: "'Fredoka',sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Botón agregar */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setMostrarForm(v => !v)}
          style={{
            background: mostrarForm ? '#f3f4f6' : 'linear-gradient(135deg,#F4A340,#E8821A)',
            color: mostrarForm ? '#374151' : 'white', border: 'none', borderRadius: 50,
            padding: '11px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            fontFamily: "'Fredoka',sans-serif",
          }}
        >
          {mostrarForm ? '✕ Cancelar' : '+ Registrar alimento'}
        </button>
      </div>

      {/* Formulario */}
      {mostrarForm && (
        <form onSubmit={agregar} style={{ background: '#f8fafc', borderRadius: 20, padding: '24px', marginBottom: 24, border: '2px solid #e5e7eb' }}>
          <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 17, fontWeight: 600, color: '#1f2937', margin: '0 0 20px' }}>
            Nuevo alimento para {nombreBebe ?? 'tu bebé'}
          </p>

          <div className="np-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Alimento *</label>
              <input
                type="text" placeholder="Ej. Aguacate" required
                value={form.alimento}
                onChange={e => setForm(f => ({ ...f, alimento: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb', fontSize: 14, fontFamily: "'Outfit',sans-serif", outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Fecha de introducción *</label>
              <input
                type="date" required
                value={form.fecha_introduccion}
                max={new Date().toISOString().split('T')[0]}
                onChange={e => setForm(f => ({ ...f, fecha_introduccion: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb', fontSize: 14, fontFamily: "'Outfit',sans-serif", outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Reacción</label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {(Object.entries(REACCIONES) as [Entrada['reaccion'], typeof REACCIONES.ninguna][]).map(([key, r]) => (
                <button
                  key={key} type="button"
                  onClick={() => setForm(f => ({ ...f, reaccion: key }))}
                  style={{
                    padding: '8px 16px', borderRadius: 20, border: '2px solid',
                    borderColor: form.reaccion === key ? r.color : '#e5e7eb',
                    background: form.reaccion === key ? r.bg : 'white',
                    color: form.reaccion === key ? r.color : '#6b7280',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  {r.emoji} {r.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Nivel de aceptación</label>
            <Estrellas valor={form.aceptacion} onChange={v => setForm(f => ({ ...f, aceptacion: v }))} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Notas (opcional)</label>
            <textarea
              placeholder="Observaciones, texturas usadas, mezclas..."
              value={form.notas}
              onChange={e => setForm(f => ({ ...f, notas: e.target.value }))}
              rows={2}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb', fontSize: 14, fontFamily: "'Outfit',sans-serif", outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>

          {error && <p style={{ color: '#DC2626', fontSize: 13, marginBottom: 12 }}>⚠️ {error}</p>}

          <button
            type="submit" disabled={guardando}
            style={{
              background: guardando ? '#d1d5db' : 'linear-gradient(135deg,#0D9488,#0F766E)',
              color: 'white', border: 'none', borderRadius: 50, padding: '12px 28px',
              fontSize: 15, fontWeight: 700, cursor: guardando ? 'not-allowed' : 'pointer',
              fontFamily: "'Fredoka',sans-serif",
            }}
          >
            {guardando ? 'Guardando...' : 'Guardar registro'}
          </button>
        </form>
      )}

      {/* Lista */}
      {entradas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📓</div>
          <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 20, color: '#1f2937', margin: '0 0 8px' }}>Aún no hay registros</p>
          <p style={{ color: '#9ca3af', fontSize: 14, margin: 0 }}>
            Empieza registrando el primer alimento de {nombreBebe ?? 'tu bebé'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {entradas.map(e => {
            const r = REACCIONES[e.reaccion]
            return (
              <div key={e.id} style={{ background: 'white', borderRadius: 16, padding: '16px 20px', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ background: r.bg, borderRadius: 10, width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  {r.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 16, fontWeight: 600, color: '#1f2937', margin: '0 0 2px' }}>{e.alimento}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, color: '#6b7280' }}>
                      {new Date(e.fecha_introduccion + 'T12:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span style={{ fontSize: 12, color: r.color, fontWeight: 600 }}>{r.label}</span>
                    <Estrellas valor={e.aceptacion} />
                  </div>
                  {e.notas && <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>{e.notas}</p>}
                </div>
                <button
                  onClick={() => eliminar(e.id)}
                  style={{ background: 'none', border: 'none', color: '#d1d5db', fontSize: 18, cursor: 'pointer', padding: '4px', flexShrink: 0 }}
                  title="Eliminar"
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
