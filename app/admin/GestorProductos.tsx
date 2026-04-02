'use client'

import { useState } from 'react'
import { PRODUCTOS, ProductoId } from '@/lib/productos'

const PRODUCTO_LISTA = Object.values(PRODUCTOS)

const COLORES: Record<ProductoId, { bg: string; color: string; border: string }> = {
  metodo_nutripeques: { bg: '#FFF7ED', color: '#E8821A', border: '#FED7AA' },
  guia_ac:            { bg: '#F0FDFA', color: '#0d9488', border: '#99F6E4' },
  menu_anemia:        { bg: '#FFF1F2', color: '#e11d48', border: '#fecdd3' },
  recetario_50:       { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
}

export default function GestorProductos({
  usuarioId,
  productosActivos: inicial,
}: {
  usuarioId: string
  productosActivos: string[]
}) {
  const [productos, setProductos] = useState<string[]>(inicial)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  async function toggle(productoId: ProductoId) {
    const nuevo = productos.includes(productoId)
      ? productos.filter(p => p !== productoId)
      : [...productos, productoId]

    setLoading(true)
    setSaved(false)
    const res = await fetch('/api/admin/productos-usuario', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_id: usuarioId, productos_activos: nuevo }),
    })
    if (res.ok) {
      setProductos(nuevo)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setLoading(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#374151' }}>📦 Productos activos</p>
        {saved && (
          <span style={{ fontSize: 12, color: '#15803d', fontWeight: 600, background: '#DCFCE7', padding: '2px 8px', borderRadius: 8 }}>
            ✓ Guardado
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {PRODUCTO_LISTA.map(p => {
          const activo = productos.includes(p.id)
          const col = COLORES[p.id as ProductoId]
          return (
            <button
              key={p.id}
              onClick={() => toggle(p.id as ProductoId)}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 12,
                border: `2px solid ${activo ? col.border : '#e5e7eb'}`,
                background: activo ? col.bg : '#f9fafb',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all .15s',
                fontFamily: "'Outfit',sans-serif",
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>{p.emoji}</span>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: activo ? col.color : '#6b7280' }}>
                    {p.nombre}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: '#9ca3af' }}>
                    {(p.precio / 100).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })} MXN
                  </p>
                </div>
              </div>
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                background: activo ? col.color : '#e5e7eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {activo && <span style={{ color: 'white', fontSize: 12, fontWeight: 700, lineHeight: 1 }}>✓</span>}
              </div>
            </button>
          )
        })}
      </div>

      <p style={{ margin: '8px 0 0', fontSize: 11, color: '#9ca3af' }}>
        Haz clic para activar o desactivar un producto. El cambio se guarda al instante.
      </p>
    </div>
  )
}
