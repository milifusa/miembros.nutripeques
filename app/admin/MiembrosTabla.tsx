'use client'

import { useState } from 'react'
import AccionesUsuario from './AccionesUsuario'
import GestorProductos from './GestorProductos'

type Hijo = { id: string; nombre: string; fecha_nacimiento: string }
type BusquedaItem = { consulta: string; created_at: string }
type BitacoraItem = { alimento: string; reaccion: string; aceptacion: number; fecha_introduccion: string }
type MenuItem = { semana: string; created_at: string }
type CumpleanosItem = { mes: string; edad_meses: number; pais: string | null; created_at: string }
type SustitutoItem = { ingrediente: string; edad_meses: number; created_at: string }
type DescargaItem = { recurso_titulo: string; created_at: string }

const PRODUCTO_LABELS: Record<string, { emoji: string; label: string; bg: string; color: string }> = {
  metodo_nutripeques: { emoji: '🌟', label: 'Completo', bg: '#FFF7ED', color: '#E8821A' },
  guia_ac:            { emoji: '🥣', label: 'Guía AC',  bg: '#F0FDFA', color: '#0d9488' },
  menu_anemia:        { emoji: '🩸', label: 'Anemia',   bg: '#FFF1F2', color: '#e11d48' },
  recetario_50:       { emoji: '🍳', label: 'Recetas',  bg: '#FEF3C7', color: '#D97706' },
}

type Miembro = {
  id: string
  email: string
  nombre: string | null
  created_at: string
  monto_pago: number | null
  acceso_activo: boolean | null
  productos_activos: string[]
}

export type MiembroExtra = {
  isBanned: boolean
  nuncaEntro: boolean
  lastLogin: string | null
  hijos: Hijo[]
  busquedas: BusquedaItem[]
  bitacora: BitacoraItem[]
  menus: MenuItem[]
  cumpleanos: CumpleanosItem[]
  sustitutos: SustitutoItem[]
  descargas: DescargaItem[]
}

function calcEdad(fechaNac: string) {
  const fn = new Date(fechaNac + 'T12:00:00')
  const hoy = new Date()
  const meses = (hoy.getFullYear() - fn.getFullYear()) * 12 + (hoy.getMonth() - fn.getMonth())
  return meses < 24 ? `${meses} meses` : `${Math.floor(meses / 12)} años`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
}

function Badge({ bg, color, children }: { bg: string; color: string; children: React.ReactNode }) {
  return (
    <span style={{ background: bg, color, fontWeight: 700, fontSize: 12, padding: '3px 10px', borderRadius: 10 }}>
      {children}
    </span>
  )
}

const REACCION_COLORS: Record<string, { bg: string; color: string }> = {
  ninguna: { bg: '#DCFCE7', color: '#15803d' },
  leve: { bg: '#FEF3C7', color: '#D97706' },
  moderada: { bg: '#FEE2E2', color: '#dc2626' },
}

function ActivitySection({
  icon, label, count, bg, color, children,
}: {
  icon: string; label: string; count: number; bg: string; color: string; children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  if (count === 0) return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
      <span style={{ fontSize: 14, color: '#374151' }}>{icon} {label}</span>
      <Badge bg="#f3f4f6" color="#9ca3af">0</Badge>
    </div>
  )
  return (
    <div style={{ borderBottom: '1px solid #f3f4f6' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <span style={{ fontSize: 14, color: '#374151', fontFamily: 'inherit' }}>{icon} {label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge bg={bg} color={color}>{count}</Badge>
          <span style={{ color: '#9ca3af', fontSize: 14 }}>{open ? '▲' : '▼'}</span>
        </div>
      </button>
      {open && (
        <div style={{ paddingBottom: 10 }}>
          {children}
        </div>
      )}
    </div>
  )
}

function MiembroModal({ m, extra, onClose }: { m: Miembro; extra: MiembroExtra; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}
      >
        {/* Header */}
        <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#CCFBF1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#0d9488', fontSize: 18 }}>
                {m.nombre ? m.nombre[0].toUpperCase() : '?'}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 17, color: '#1f2937', fontFamily: "'Fredoka',sans-serif" }}>
                  {m.nombre ?? 'Sin nombre'}
                </p>
                <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>{m.email}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              <Badge bg={extra.isBanned ? '#FEE2E2' : '#DCFCE7'} color={extra.isBanned ? '#dc2626' : '#15803d'}>
                {extra.isBanned ? '⊘ Bloqueado' : '✓ Activo'}
              </Badge>
              {extra.nuncaEntro && !extra.isBanned && (
                <Badge bg="#FEF3C7" color="#D97706">⏳ Sin acceder</Badge>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: '#f3f4f6', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 18, color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >×</button>
        </div>

        <div style={{ padding: '16px 24px' }}>
          {/* Fechas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 14px' }}>
              <p style={{ margin: '0 0 2px', fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>Registro</p>
              <p style={{ margin: 0, fontSize: 14, color: '#1f2937', fontWeight: 600 }}>{fmtDate(m.created_at)}</p>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 14px' }}>
              <p style={{ margin: '0 0 2px', fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>Último acceso</p>
              <p style={{ margin: 0, fontSize: 14, color: extra.lastLogin ? '#1f2937' : '#d1d5db', fontWeight: 600 }}>
                {extra.lastLogin ? fmtDate(extra.lastLogin) : 'Nunca'}
              </p>
            </div>
          </div>

          {/* Pago */}
          <div style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, color: '#374151' }}>💳 Pago</span>
            {m.monto_pago != null ? (
              <Badge bg="#DCFCE7" color="#15803d">
                {(m.monto_pago / 100).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })}
              </Badge>
            ) : (
              <Badge bg="#F3F4F6" color="#6b7280">Manual</Badge>
            )}
          </div>

          {/* Productos */}
          <div style={{ marginBottom: 20 }}>
            <GestorProductos usuarioId={m.id} productosActivos={m.productos_activos} />
          </div>

          {/* Hijos */}
          {extra.hijos.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 600, color: '#374151' }}>👶 Hijos</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {extra.hijos.map(h => (
                  <div key={h.id} style={{ background: '#F3E8FF', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#7C3AED', fontWeight: 700, fontSize: 14 }}>{h.nombre}</span>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: 12, color: '#9333ea' }}>{calcEdad(h.fecha_nacimiento)}</p>
                      <p style={{ margin: 0, fontSize: 11, color: '#a78bfa' }}>{fmtDate(h.fecha_nacimiento)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actividad */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 600, color: '#374151' }}>Actividad</p>

            <ActivitySection icon="🔍" label="Búsquedas IA" count={extra.busquedas.length} bg="#FEF3C7" color="#D97706">
              {extra.busquedas.map((b, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '6px 10px', background: i % 2 === 0 ? '#fffbeb' : 'white', borderRadius: 8, marginBottom: 2, gap: 8 }}>
                  <span style={{ fontSize: 13, color: '#374151', flex: 1 }}>{b.consulta}</span>
                  <span style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap' }}>{fmtDate(b.created_at)}</span>
                </div>
              ))}
            </ActivitySection>

            <ActivitySection icon="📓" label="Bitácora del bebé" count={extra.bitacora.length} bg="#CCFBF1" color="#0d9488">
              {extra.bitacora.map((b, i) => {
                const rc = REACCION_COLORS[b.reaccion] ?? REACCION_COLORS.ninguna
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: i % 2 === 0 ? '#f0fdfa' : 'white', borderRadius: 8, marginBottom: 2, gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{b.alimento}</span>
                      <span style={{ marginLeft: 8, fontSize: 11, background: rc.bg, color: rc.color, padding: '1px 6px', borderRadius: 6, fontWeight: 600 }}>{b.reaccion}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12, color: '#6b7280' }}>{'★'.repeat(b.aceptacion)}{'☆'.repeat(5 - b.aceptacion)}</span>
                      <span style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap' }}>{fmtDate(b.fecha_introduccion)}</span>
                    </div>
                  </div>
                )
              })}
            </ActivitySection>

            <ActivitySection icon="📅" label="Menús generados" count={extra.menus.length} bg="#DBEAFE" color="#1d4ed8">
              {extra.menus.map((mn, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: i % 2 === 0 ? '#eff6ff' : 'white', borderRadius: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 13, color: '#374151' }}>Semana del {fmtDate(mn.semana)}</span>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>{fmtDate(mn.created_at)}</span>
                </div>
              ))}
            </ActivitySection>

            <ActivitySection icon="🎂" label="Ideas de cumpleaños" count={extra.cumpleanos.length} bg="#FEE2E2" color="#dc2626">
              {extra.cumpleanos.map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: i % 2 === 0 ? '#fff1f2' : 'white', borderRadius: 8, marginBottom: 2, gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{c.edad_meses} meses</span>
                    {c.pais && <span style={{ marginLeft: 8, fontSize: 12, color: '#6b7280' }}>📍{c.pais}</span>}
                  </div>
                  <span style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap' }}>{c.mes}</span>
                </div>
              ))}
            </ActivitySection>

            <ActivitySection icon="🔄" label="Sustitutos buscados" count={extra.sustitutos.length} bg="#F3E8FF" color="#7C3AED">
              {extra.sustitutos.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: i % 2 === 0 ? '#faf5ff' : 'white', borderRadius: 8, marginBottom: 2, gap: 8 }}>
                  <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{s.ingrediente}</span>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, background: '#F3E8FF', color: '#7C3AED', padding: '1px 6px', borderRadius: 6, fontWeight: 600 }}>{s.edad_meses}m</span>
                    <span style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap' }}>{fmtDate(s.created_at)}</span>
                  </div>
                </div>
              ))}
            </ActivitySection>

            <ActivitySection icon="📥" label="PDFs descargados" count={extra.descargas.length} bg="#DBEAFE" color="#1d4ed8">
              {extra.descargas.map((d, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: i % 2 === 0 ? '#eff6ff' : 'white', borderRadius: 8, marginBottom: 2, gap: 8 }}>
                  <span style={{ fontSize: 13, color: '#374151', flex: 1 }}>{d.recurso_titulo}</span>
                  <span style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap' }}>{fmtDate(d.created_at)}</span>
                </div>
              ))}
            </ActivitySection>
          </div>

          {/* Acciones */}
          <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 16 }}>
            <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 600, color: '#374151' }}>Acciones</p>
            <AccionesUsuario usuarioId={m.id} isBanned={extra.isBanned} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MiembrosTabla({
  miembros,
  extras,
}: {
  miembros: Miembro[]
  extras: Record<string, MiembroExtra>
}) {
  const [selected, setSelected] = useState<Miembro | null>(null)

  return (
    <>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Miembro', 'Registro', 'Uso', 'Estado', ''].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', fontSize: 13, whiteSpace: 'nowrap', borderBottom: '1px solid #f3f4f6' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {miembros.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#9ca3af' }}>
                  Aún no hay miembros registrados
                </td>
              </tr>
            )}
            {miembros.map((m, i) => {
              const ex = extras[m.id] ?? { isBanned: false, nuncaEntro: true, lastLogin: null, hijos: [], busquedas: [], bitacora: [], menus: [], cumpleanos: [], sustitutos: [], descargas: [] }
              const totalUso = ex.busquedas.length + ex.bitacora.length + ex.menus.length + ex.cumpleanos.length + ex.sustitutos.length + ex.descargas.length
              return (
                <tr
                  key={m.id}
                  onClick={() => setSelected(m)}
                  style={{
                    borderBottom: '1px solid #f9fafb',
                    background: ex.isBanned ? '#fff5f5' : i % 2 === 0 ? 'white' : '#fafafa',
                    cursor: 'pointer',
                    transition: 'background .12s',
                  }}
                  onMouseOver={e => { (e.currentTarget as HTMLTableRowElement).style.background = '#f0fdfa' }}
                  onMouseOut={e => { (e.currentTarget as HTMLTableRowElement).style.background = ex.isBanned ? '#fff5f5' : i % 2 === 0 ? 'white' : '#fafafa' }}
                >
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#CCFBF1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#0d9488', fontSize: 15, flexShrink: 0 }}>
                        {m.nombre ? m.nombre[0].toUpperCase() : '?'}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, color: '#1f2937', fontSize: 14 }}>{m.nombre ?? <span style={{ color: '#9ca3af' }}>Sin nombre</span>}</p>
                        <p style={{ margin: 0, fontSize: 12, color: '#6b7280', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px', color: '#6b7280', fontSize: 13, whiteSpace: 'nowrap' }}>
                    {new Date(m.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                    {ex.hijos.length > 0 && (
                      <div style={{ marginTop: 2, fontSize: 11, color: '#9ca3af' }}>
                        {ex.hijos.map(h => h.nombre).join(', ')}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {ex.busquedas.length > 0 && <span title="Búsquedas IA" style={{ background: '#FEF3C7', color: '#D97706', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 8 }}>🔍{ex.busquedas.length}</span>}
                      {ex.menus.length > 0 && <span title="Menús" style={{ background: '#DBEAFE', color: '#1d4ed8', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 8 }}>📅{ex.menus.length}</span>}
                      {ex.bitacora.length > 0 && <span title="Bitácora" style={{ background: '#CCFBF1', color: '#0d9488', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 8 }}>📓{ex.bitacora.length}</span>}
                      {ex.cumpleanos.length > 0 && <span title="Cumpleaños" style={{ background: '#FEE2E2', color: '#dc2626', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 8 }}>🎂{ex.cumpleanos.length}</span>}
                      {ex.sustitutos.length > 0 && <span title="Sustitutos" style={{ background: '#F3E8FF', color: '#7C3AED', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 8 }}>🔄{ex.sustitutos.length}</span>}
                      {ex.descargas.length > 0 && <span title="PDFs" style={{ background: '#DBEAFE', color: '#1d4ed8', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 8 }}>📥{ex.descargas.length}</span>}
                      {totalUso === 0 && <span style={{ color: '#d1d5db', fontSize: 12 }}>Sin actividad</span>}
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <Badge bg={ex.isBanned ? '#FEE2E2' : '#DCFCE7'} color={ex.isBanned ? '#dc2626' : '#15803d'}>
                      {ex.isBanned ? '⊘ Bloqueado' : '✓ Activo'}
                    </Badge>
                    {ex.nuncaEntro && !ex.isBanned && (
                      <div style={{ marginTop: 4 }}>
                        <Badge bg="#FEF3C7" color="#D97706">⏳ Sin acceder</Badge>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
                      {m.productos_activos.length === 0 && (
                        <span style={{ fontSize: 11, color: '#d1d5db' }}>Sin producto</span>
                      )}
                      {m.productos_activos.map(pid => {
                        const p = PRODUCTO_LABELS[pid]
                        if (!p) return null
                        return (
                          <span key={pid} style={{ background: p.bg, color: p.color, fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 8 }}>
                            {p.emoji} {p.label}
                          </span>
                        )
                      })}
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ color: '#9ca3af', fontSize: 18 }}>›</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {selected && (
        <MiembroModal
          m={selected}
          extra={extras[selected.id] ?? { isBanned: false, nuncaEntro: true, lastLogin: null, hijos: [], busquedas: [], bitacora: [], menus: [], cumpleanos: [], sustitutos: [], descargas: [] }}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
