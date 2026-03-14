'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PerfilForm({ nombre, email }: { nombre: string | null; email: string }) {
  const router = useRouter()
  const [nombreVal, setNombreVal] = useState(nombre ?? '')
  const [guardando, setGuardando] = useState(false)
  const [exito, setExito] = useState(false)
  const [error, setError] = useState('')

  async function guardar(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setGuardando(true)
    setError('')
    setExito(false)

    const res = await fetch('/api/perfil', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombreVal }),
    })
    const data = await res.json()
    setGuardando(false)

    if (!res.ok) { setError(data.error ?? 'Error al guardar'); return }
    setExito(true)
    router.refresh()
    setTimeout(() => setExito(false), 3000)
  }

  return (
    <form onSubmit={guardar}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>Email</label>
        <p style={{ margin: 0, fontSize: 15, color: '#1f2937', padding: '10px 0' }}>{email}</p>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Tu nombre</label>
        <input
          type="text" placeholder="Ej. María García" value={nombreVal} required
          onChange={e => setNombreVal(e.target.value)}
          style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb', fontSize: 15, fontFamily: "'Outfit',sans-serif", outline: 'none', boxSizing: 'border-box' }}
        />
      </div>
      {error && <p style={{ color: '#DC2626', fontSize: 13, marginBottom: 12 }}>⚠️ {error}</p>}
      {exito && <p style={{ color: '#0d9488', fontSize: 13, marginBottom: 12 }}>✅ Guardado</p>}
      <button
        type="submit" disabled={guardando}
        style={{ background: guardando ? '#d1d5db' : 'linear-gradient(135deg,#F4A340,#E8821A)', color: 'white', border: 'none', borderRadius: 50, padding: '11px 28px', fontSize: 15, fontWeight: 700, cursor: guardando ? 'not-allowed' : 'pointer', fontFamily: "'Fredoka',sans-serif" }}
      >
        {guardando ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  )
}
