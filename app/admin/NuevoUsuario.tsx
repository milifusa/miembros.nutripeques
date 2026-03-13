'use client'

import { useState } from 'react'

export default function NuevoUsuario() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [form, setForm] = useState({ email: '', nombre: '', password: '' })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)
    try {
      const res = await fetch('/api/admin/crear-usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error desconocido')
      setMsg({ ok: true, text: `✅ Usuario creado: ${data.email}` })
      setForm({ email: '', nombre: '', password: '' })
      setTimeout(() => { setOpen(false); setMsg(null); location.reload() }, 2000)
    } catch (err: unknown) {
      setMsg({ ok: false, text: `❌ ${err instanceof Error ? err.message : 'Error'}` })
    } finally {
      setLoading(false)
    }
  }

  const input: React.CSSProperties = {
    width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb',
    borderRadius: 12, fontSize: 15, fontFamily: "'Outfit',sans-serif",
    outline: 'none', boxSizing: 'border-box', background: '#f9fafb',
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: 'linear-gradient(135deg,#F4A340,#E8821A)', color: 'white',
          border: 'none', padding: '12px 24px', borderRadius: 12,
          fontFamily: "'Fredoka',sans-serif", fontSize: 16, fontWeight: 600,
          cursor: 'pointer', boxShadow: '0 4px 16px rgba(232,130,26,.3)',
        }}
      >
        + Nuevo miembro
      </button>

      {open && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
        }}>
          <div style={{
            background: 'white', borderRadius: 20, padding: 32,
            width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 22, margin: 0, color: '#1f2937' }}>
                Crear miembro manual
              </h2>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#6b7280' }}>×</button>
            </div>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Email *</label>
                <input style={input} type="email" required value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="mama@ejemplo.com" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Nombre</label>
                <input style={input} type="text" value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                  placeholder="María García" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                  Contraseña temporal *
                </label>
                <input style={input} type="text" required value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Mínimo 8 caracteres" minLength={8} />
              </div>
              {msg && (
                <div style={{
                  padding: '12px 16px', borderRadius: 10, fontSize: 14,
                  background: msg.ok ? '#DCFCE7' : '#FEE2E2',
                  color: msg.ok ? '#166534' : '#991B1B',
                }}>
                  {msg.text}
                </div>
              )}
              <button
                type="submit" disabled={loading}
                style={{
                  background: loading ? '#ccc' : 'linear-gradient(135deg,#F4A340,#E8821A)',
                  color: 'white', border: 'none', padding: '14px', borderRadius: 12,
                  fontFamily: "'Fredoka',sans-serif", fontSize: 17, fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4,
                }}
              >
                {loading ? 'Creando...' : 'Crear miembro'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
