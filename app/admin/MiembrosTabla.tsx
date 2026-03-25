'use client'

import { useState } from 'react'
import AccionesUsuario from './AccionesUsuario'

type Hijo = { id: string; nombre: string; fecha_nacimiento: string }

type Miembro = {
  id: string
  email: string
  nombre: string | null
  created_at: string
  monto_pago: number | null
  acceso_activo: boolean | null
}

type MiembroExtra = {
  isBanned: boolean
  nuncaEntro: boolean
  lastLogin: string | null
  hijos: Hijo[]
  busquedas: number
  bitacora: number
  menus: number
  cumpleanos: number
  sustitutos: number
  descargas: number
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

function StatRow({ icon, label, value, bg, color }: { icon: string; label: string; value: number; bg: string; color: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
      <span style={{ fontSize: 14, color: '#374151' }}>{icon} {label}</span>
      <Badge bg={bg} color={color}>{value}</Badge>
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
        style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}
      >
        {/* Header */}
        <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#CCFBF1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
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
            style={{ background: '#f3f4f6', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 18, color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ×
          </button>
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
          <div style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 14px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, color: '#374151' }}>💳 Pago</span>
            {m.monto_pago != null ? (
              <Badge bg="#DCFCE7" color="#15803d">
                {(m.monto_pago / 100).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })}
              </Badge>
            ) : (
              <Badge bg="#F3F4F6" color="#6b7280">Manual</Badge>
            )}
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

          {/* Uso de herramientas */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 600, color: '#374151' }}>Actividad</p>
            <StatRow icon="🔍" label="Búsquedas IA" value={extra.busquedas} bg="#FEF3C7" color="#D97706" />
            <StatRow icon="📓" label="Bitácora del bebé" value={extra.bitacora} bg="#CCFBF1" color="#0d9488" />
            <StatRow icon="📅" label="Menús generados" value={extra.menus} bg="#DBEAFE" color="#1d4ed8" />
            <StatRow icon="🎂" label="Ideas de cumpleaños" value={extra.cumpleanos} bg="#FEE2E2" color="#dc2626" />
            <StatRow icon="🔄" label="Sustitutos buscados" value={extra.sustitutos} bg="#F3E8FF" color="#7C3AED" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
              <span style={{ fontSize: 14, color: '#374151' }}>📥 PDFs descargados</span>
              <Badge bg="#DBEAFE" color="#1d4ed8">{extra.descargas}</Badge>
            </div>
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
              const ex = extras[m.id] ?? { isBanned: false, nuncaEntro: true, lastLogin: null, hijos: [], busquedas: 0, bitacora: 0, menus: 0, cumpleanos: 0, sustitutos: 0, descargas: 0 }
              const totalUso = ex.busquedas + ex.bitacora + ex.menus + ex.cumpleanos + ex.sustitutos + ex.descargas
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
                      {ex.busquedas > 0 && <span title="Búsquedas IA" style={{ background: '#FEF3C7', color: '#D97706', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 8 }}>🔍{ex.busquedas}</span>}
                      {ex.menus > 0 && <span title="Menús" style={{ background: '#DBEAFE', color: '#1d4ed8', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 8 }}>📅{ex.menus}</span>}
                      {ex.bitacora > 0 && <span title="Bitácora" style={{ background: '#CCFBF1', color: '#0d9488', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 8 }}>📓{ex.bitacora}</span>}
                      {ex.cumpleanos > 0 && <span title="Cumpleaños" style={{ background: '#FEE2E2', color: '#dc2626', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 8 }}>🎂{ex.cumpleanos}</span>}
                      {ex.sustitutos > 0 && <span title="Sustitutos" style={{ background: '#F3E8FF', color: '#7C3AED', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 8 }}>🔄{ex.sustitutos}</span>}
                      {ex.descargas > 0 && <span title="PDFs" style={{ background: '#DBEAFE', color: '#1d4ed8', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 8 }}>📥{ex.descargas}</span>}
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
          extra={extras[selected.id] ?? { isBanned: false, nuncaEntro: true, lastLogin: null, hijos: [], busquedas: 0, bitacora: 0, menus: 0, cumpleanos: 0, sustitutos: 0, descargas: 0 }}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
