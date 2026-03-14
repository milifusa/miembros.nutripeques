'use client'

import { useState } from 'react'

export default function AccionesUsuario({ usuarioId, isBanned }: {
  usuarioId: string
  isBanned: boolean
}) {
  const [banned, setBanned] = useState(isBanned)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    const msg = banned
      ? '¿Activar acceso? Podrá volver a iniciar sesión.'
      : '¿Desactivar acceso? No podrá iniciar sesión hasta que lo reactives.'
    if (!confirm(msg)) return
    setLoading(true)
    const res = await fetch('/api/admin/toggle-acceso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_id: usuarioId, activar: banned }),
    })
    if (res.ok) setBanned(v => !v)
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      style={{
        background: banned ? '#DCFCE7' : '#FEE2E2',
        color: banned ? '#15803d' : '#dc2626',
        border: `1px solid ${banned ? '#bbf7d0' : '#fecaca'}`,
        padding: '5px 12px',
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 600,
        cursor: loading ? 'not-allowed' : 'pointer',
        fontFamily: "'Outfit',sans-serif",
        opacity: loading ? 0.6 : 1,
        whiteSpace: 'nowrap',
      }}
    >
      {loading ? '...' : banned ? '✓ Activar' : '⊘ Desactivar'}
    </button>
  )
}
