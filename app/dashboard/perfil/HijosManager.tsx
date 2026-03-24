'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Hijo = { id: string; nombre: string; fecha_nacimiento: string; pais: string | null }

const PAISES_HISPANOHABLANTES = [
  'México', 'España', 'Colombia', 'Argentina', 'Venezuela', 'Perú', 'Chile',
  'Ecuador', 'Guatemala', 'Cuba', 'Bolivia', 'República Dominicana', 'Honduras',
  'Paraguay', 'El Salvador', 'Nicaragua', 'Costa Rica', 'Panamá', 'Uruguay',
  'Puerto Rico', 'Guinea Ecuatorial', 'Estados Unidos',
]

function calcularEdad(fecha: string): string {
  const nac = new Date(fecha)
  const hoy = new Date()
  let meses = (hoy.getFullYear() - nac.getFullYear()) * 12 + (hoy.getMonth() - nac.getMonth())
  if (hoy.getDate() < nac.getDate()) meses--
  meses = Math.max(0, meses)
  if (meses < 12) return `${meses} ${meses === 1 ? 'mes' : 'meses'}`
  const años = Math.floor(meses / 12)
  const resto = meses % 12
  if (resto === 0) return `${años} ${años === 1 ? 'año' : 'años'}`
  return `${años} ${años === 1 ? 'año' : 'años'} y ${resto} ${resto === 1 ? 'mes' : 'meses'}`
}

function HijoForm({
  inicial,
  onGuardar,
  onCancelar,
}: {
  inicial?: Hijo
  onGuardar: (datos: { nombre: string; fecha_nacimiento: string; pais: string | null }) => Promise<void>
  onCancelar: () => void
}) {
  const hoy = new Date().toISOString().split('T')[0]
  const hace4años = new Date()
  hace4años.setFullYear(hace4años.getFullYear() - 4)
  const minFecha = hace4años.toISOString().split('T')[0]

  const [nombre, setNombre] = useState(inicial?.nombre ?? '')
  const [fecha, setFecha] = useState(inicial?.fecha_nacimiento ?? '')
  const [pais, setPais] = useState(inicial?.pais ?? 'México')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  // Calcular edad en tiempo real
  function edadPreview() {
    if (!fecha) return null
    const nac = new Date(fecha)
    if (isNaN(nac.getTime())) return null
    const hoyD = new Date()
    let m = (hoyD.getFullYear() - nac.getFullYear()) * 12 + (hoyD.getMonth() - nac.getMonth())
    if (hoyD.getDate() < nac.getDate()) m--
    return Math.max(0, m)
  }
  const meses = edadPreview()

  async function submit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setGuardando(true)
    setError('')
    try {
      await onGuardar({ nombre, fecha_nacimiento: fecha, pais })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    }
    setGuardando(false)
  }

  return (
    <form onSubmit={submit} style={{ background: '#f8fafc', borderRadius: 16, padding: '20px', border: '2px solid #e5e7eb', marginTop: 12 }}>
      <div className="np-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Nombre del bebé *</label>
          <input
            type="text" placeholder="Ej. Sofía" required value={nombre}
            onChange={e => setNombre(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 14, fontFamily: "'Outfit',sans-serif", outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Fecha de nacimiento *</label>
          <input
            type="date" required value={fecha} min={minFecha} max={hoy}
            onChange={e => setFecha(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 14, fontFamily: "'Outfit',sans-serif", outline: 'none', boxSizing: 'border-box' }}
          />
          {meses !== null && (
            <span style={{ fontSize: 12, color: '#0d9488', fontWeight: 600, marginTop: 4, display: 'block' }}>
              🎂 {meses < 12 ? `${meses} meses` : `${Math.floor(meses/12)} año${Math.floor(meses/12)>1?'s':''} y ${meses%12} meses`}
            </span>
          )}
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 }}>País *</label>
        <select
          required value={pais}
          onChange={e => setPais(e.target.value)}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 14, fontFamily: "'Outfit',sans-serif", outline: 'none', background: 'white', color: '#1f2937' }}
        >
          {PAISES_HISPANOHABLANTES.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
      {error && <p style={{ color: '#DC2626', fontSize: 13, margin: '0 0 12px' }}>⚠️ {error}</p>}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          type="submit" disabled={guardando}
          style={{ background: guardando ? '#d1d5db' : 'linear-gradient(135deg,#0D9488,#0F766E)', color: 'white', border: 'none', borderRadius: 50, padding: '10px 22px', fontSize: 14, fontWeight: 700, cursor: guardando ? 'not-allowed' : 'pointer', fontFamily: "'Fredoka',sans-serif" }}
        >
          {guardando ? 'Guardando...' : inicial ? 'Actualizar' : 'Agregar hijo'}
        </button>
        <button
          type="button" onClick={onCancelar}
          style={{ background: 'none', border: '1.5px solid #e5e7eb', borderRadius: 50, padding: '10px 20px', fontSize: 14, color: '#6b7280', cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default function HijosManager({ hijosIniciales }: { hijosIniciales: Hijo[] }) {
  const router = useRouter()
  const [hijos, setHijos] = useState<Hijo[]>(hijosIniciales)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [eliminando, setEliminando] = useState<string | null>(null)

  async function agregar(datos: { nombre: string; fecha_nacimiento: string; pais: string | null }) {
    const res = await fetch('/api/hijos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    setHijos(prev => [...prev, data.hijo])
    setMostrarForm(false)
    router.refresh()
  }

  async function actualizar(id: string, datos: { nombre: string; fecha_nacimiento: string; pais: string | null }) {
    const res = await fetch(`/api/hijos?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    setHijos(prev => prev.map(h => h.id === id ? data.hijo : h))
    setEditandoId(null)
    router.refresh()
  }

  async function eliminar(id: string) {
    if (!confirm('¿Eliminar este perfil? También se borrarán su menú y bitácora.')) return
    setEliminando(id)
    await fetch(`/api/hijos?id=${id}`, { method: 'DELETE' })
    setHijos(prev => prev.filter(h => h.id !== id))
    setEliminando(null)
    router.refresh()
  }

  return (
    <div>
      {/* Lista de hijos */}
      {hijos.length === 0 && !mostrarForm && (
        <div style={{ textAlign: 'center', padding: '24px', background: '#f8fafc', borderRadius: 16, border: '2px dashed #e5e7eb', marginBottom: 16 }}>
          <p style={{ fontSize: 32, marginBottom: 8 }}>👶</p>
          <p style={{ color: '#9ca3af', fontSize: 14, margin: 0 }}>Aún no has agregado ningún hijo</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {hijos.map(h => (
          <div key={h.id}>
            {editandoId === h.id ? (
              <HijoForm
                inicial={h}
                onGuardar={datos => actualizar(h.id, datos)}
                onCancelar={() => setEditandoId(null)}
              />
            ) : (
              <div style={{ background: 'white', borderRadius: 14, border: '1px solid #f3f4f6', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ background: '#FFF0F6', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    👶
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 16, fontWeight: 600, color: '#1f2937', margin: 0 }}>{h.nombre}</p>
                    <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                      {new Date(h.fecha_nacimiento + 'T12:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })} · {calcularEdad(h.fecha_nacimiento)}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setEditandoId(h.id)}
                    style={{ background: '#f3f4f6', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, color: '#374151', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminar(h.id)}
                    disabled={eliminando === h.id}
                    style={{ background: 'none', border: '1px solid #fecaca', borderRadius: 8, padding: '6px 12px', fontSize: 13, color: '#ef4444', cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}
                  >
                    {eliminando === h.id ? '...' : '✕'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Botón / Form agregar */}
      {mostrarForm ? (
        <HijoForm onGuardar={agregar} onCancelar={() => setMostrarForm(false)} />
      ) : (
        <button
          onClick={() => setMostrarForm(true)}
          style={{ background: 'none', border: '2px dashed #0d9488', borderRadius: 14, padding: '12px 20px', fontSize: 14, fontWeight: 600, color: '#0d9488', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", width: '100%' }}
        >
          + Agregar hijo
        </button>
      )}
    </div>
  )
}
