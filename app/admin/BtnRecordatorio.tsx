'use client'

import { useState } from 'react'

export default function BtnRecordatorio({ totalCombo }: { totalCombo: number }) {
  const [estado, setEstado] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [resultado, setResultado] = useState('')

  async function enviar() {
    if (!confirm(`¿Enviar correo de recordatorio a las ${totalCombo} usuarias con el combo $299?`)) return
    setEstado('loading')
    try {
      const res = await fetch('/api/admin/enviar-recordatorio', { method: 'POST' })
      const json = await res.json()
      if (res.ok) {
        setResultado(`✅ Enviados: ${json.enviados} / ${json.total}${json.errores?.length ? ` · Errores: ${json.errores.join(', ')}` : ''}`)
        setEstado('done')
      } else {
        setResultado('❌ Error: ' + (json.error ?? 'desconocido'))
        setEstado('error')
      }
    } catch (e) {
      setResultado('❌ ' + (e as Error).message)
      setEstado('error')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
      <button
        onClick={enviar}
        disabled={estado === 'loading'}
        style={{
          background: estado === 'done' ? '#15803d' : '#E8821A',
          color: 'white', border: 'none', fontWeight: 600, fontSize: 14,
          padding: '9px 18px', borderRadius: 12, cursor: estado === 'loading' ? 'not-allowed' : 'pointer',
          opacity: estado === 'loading' ? 0.7 : 1, display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: 'inherit',
        }}
      >
        {estado === 'loading' ? '⏳ Enviando...' : estado === 'done' ? '✅ Enviado' : '📧 Recordatorio $299'}
      </button>
      {resultado && (
        <p style={{ margin: 0, fontSize: 12, color: estado === 'done' ? '#15803d' : '#dc2626', fontWeight: 600 }}>
          {resultado}
        </p>
      )}
    </div>
  )
}
