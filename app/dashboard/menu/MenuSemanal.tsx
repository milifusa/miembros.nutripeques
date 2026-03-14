'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const BotonDescargarPDF = dynamic(() => import('./BotonDescargarPDF'), { ssr: false })

export type Comida = {
  nombre: string
  descripcion: string
  emoji: string
  alergenos?: string[]
}

export type DiaMenu = {
  dia: string
  desayuno: Comida
  comida: Comida
  merienda: Comida
  cena: Comida
}

export type MenuContenido = {
  rango: string
  descripcion: string
  dias: DiaMenu[]
}

const TIEMPOS: { key: keyof DiaMenu; label: string; emoji: string; color: string; bg: string }[] = [
  { key: 'desayuno', label: 'Desayuno', emoji: '🌅', color: '#D97706', bg: '#FEF3C7' },
  { key: 'comida',   label: 'Comida',   emoji: '☀️',  color: '#0d9488', bg: '#CCFBF1' },
  { key: 'merienda', label: 'Merienda', emoji: '🍎',  color: '#7C3AED', bg: '#EDE9FE' },
  { key: 'cena',     label: 'Cena',     emoji: '🌙',  color: '#1d4ed8', bg: '#DBEAFE' },
]

// ─── Estado vacío: pantalla para generar ─────────────────────────────────────
function PantallaGenerar({ nombreBebe, tienePerfil, onGenerado }: {
  nombreBebe: string | null
  tienePerfil: boolean
  onGenerado: (contenido: MenuContenido, fecha: string) => void
}) {
  const router = useRouter()
  const [generando, setGenerando] = useState(false)
  const [error, setError] = useState('')

  async function generar() {
    setGenerando(true)
    setError('')
    try {
      const res = await fetch('/api/generar-menu', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Error al generar el menú')
        setGenerando(false)
        return
      }
      onGenerado(data.contenido, new Date().toISOString())
      router.refresh()
    } catch {
      setError('Error de conexión')
      setGenerando(false)
    }
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🤖</div>
      <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 24, color: '#1f2937', margin: '0 0 10px' }}>
        Genera tu menú semanal con IA
      </h2>
      <p style={{ color: '#6b7280', fontSize: 15, margin: '0 0 28px', lineHeight: 1.6, maxWidth: 420, marginInline: 'auto' }}>
        Claude creará un menú de 7 días adaptado a la etapa de{' '}
        <strong>{nombreBebe ?? 'tu bebé'}</strong>, con recetas apropiadas, variadas y nutritivas.
      </p>

      {!tienePerfil && (
        <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 14, padding: '14px 20px', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
          <p style={{ margin: 0, fontSize: 13, color: '#92400E' }}>
            ⚠️ Configura primero la edad del bebé en{' '}
            <a href="/dashboard/perfil" style={{ color: '#E8821A', fontWeight: 700 }}>tu perfil</a>{' '}
            para un menú 100% personalizado.
          </p>
        </div>
      )}

      {error && (
        <p style={{ color: '#DC2626', fontSize: 14, marginBottom: 16 }}>⚠️ {error}</p>
      )}

      <button
        onClick={generar}
        disabled={generando}
        style={{
          background: generando ? '#d1d5db' : 'linear-gradient(135deg,#F4A340,#E8821A)',
          color: 'white', border: 'none', borderRadius: 50,
          padding: '16px 40px', fontSize: 17, fontWeight: 700,
          fontFamily: "'Fredoka',sans-serif", cursor: generando ? 'not-allowed' : 'pointer',
          transition: 'opacity .15s',
        }}
      >
        {generando ? '✨ Generando menú...' : '✨ Generar mi menú con IA'}
      </button>

      {generando && (
        <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 14 }}>
          Esto puede tomar unos segundos...
        </p>
      )}
    </div>
  )
}

function getRangoSemana(): string {
  const hoy = new Date()
  const dia = hoy.getDay()
  const diffLunes = dia === 0 ? -6 : 1 - dia
  const lunes = new Date(hoy)
  lunes.setDate(hoy.getDate() + diffLunes)
  const domingo = new Date(lunes)
  domingo.setDate(lunes.getDate() + 6)
  const fmt = (d: Date) => d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
  return `lun ${fmt(lunes)} – dom ${fmt(domingo)}`
}

// ─── Menú generado ────────────────────────────────────────────────────────────
function MenuGenerado({ contenido, nombreBebe, generadoEn }: {
  contenido: MenuContenido
  nombreBebe: string | null
  generadoEn: string
}) {
  const [diaActivo, setDiaActivo] = useState(0)

  const dia = contenido.dias[diaActivo]

  const fechaGenerado = new Date(generadoEn).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  return (
    <div style={{ fontFamily: "'Outfit',sans-serif" }}>
      {/* Header del menú */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ background: '#FEF3C7', color: '#D97706', fontSize: 13, fontWeight: 700, padding: '5px 14px', borderRadius: 20 }}>
            {contenido.rango}
          </span>
          {nombreBebe && (
            <span style={{ color: '#6b7280', fontSize: 14 }}>
              Para <strong style={{ color: '#1f2937' }}>{nombreBebe}</strong>
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ color: '#9ca3af', fontSize: 12 }}>Generado el {fechaGenerado}</span>
          <span style={{ background: '#F0FDF4', color: '#15803d', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20 }}>
            ✓ Válido {getRangoSemana()}
          </span>
          <BotonDescargarPDF contenido={contenido} nombreBebe={nombreBebe} rangoSemana={getRangoSemana()} />
        </div>
      </div>

      <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 24px', lineHeight: 1.6 }}>{contenido.descripcion}</p>

      {/* Tabs días */}
      <div style={{ overflowX: 'auto', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 8, minWidth: 'max-content' }}>
          {contenido.dias.map((d, i) => (
            <button
              key={d.dia}
              onClick={() => setDiaActivo(i)}
              className="np-menu-tab"
              style={{
                padding: '8px 18px', borderRadius: 50, border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 600, fontFamily: "'Outfit',sans-serif",
                background: diaActivo === i ? 'linear-gradient(135deg,#F4A340,#E8821A)' : '#f3f4f6',
                color: diaActivo === i ? 'white' : '#374151',
                transition: 'all .15s', whiteSpace: 'nowrap',
              }}
            >
              {d.dia}
            </button>
          ))}
        </div>
      </div>

      {/* Grid tiempos */}
      <div className="np-menu-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 16 }}>
        {TIEMPOS.map(t => {
          const comida = dia[t.key] as Comida
          return (
            <div
              key={t.key}
              style={{
                background: 'white', borderRadius: 20, padding: '20px',
                border: `2px solid ${t.bg}`, boxShadow: '0 1px 6px rgba(0,0,0,.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div style={{ background: t.bg, borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  {t.emoji}
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: t.color, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {t.label}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 30, lineHeight: 1, flexShrink: 0 }}>{comida.emoji}</span>
                <div>
                  <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 16, fontWeight: 600, color: '#1f2937', margin: '0 0 4px' }}>
                    {comida.nombre}
                  </p>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
                    {comida.descripcion}
                  </p>
                  {comida.alergenos && comida.alergenos.length > 0 && (
                    <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {comida.alergenos.map(a => (
                        <span key={a} style={{ background: '#FEF9C3', color: '#A16207', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>
                          ⚠️ {a}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Nota */}
      <div style={{ background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: 16, padding: '16px 20px', marginTop: 24 }}>
        <p style={{ margin: 0, fontSize: 13, color: '#0f766e', lineHeight: 1.6 }}>
          <strong>💡 Recuerda:</strong> Este menú es una guía orientativa generada con IA. Siempre adapta las porciones al apetito de tu bebé. La leche materna o fórmula sigue siendo su alimento principal hasta los 12 meses.
        </p>
      </div>
    </div>
  )
}

// ─── Export principal ─────────────────────────────────────────────────────────
export default function MenuSemanalUI({
  contenido,
  nombreBebe,
  generadoEn,
  tienePerfil,
  esMenuActual,
}: {
  contenido: MenuContenido | null
  nombreBebe: string | null
  generadoEn: string | null
  tienePerfil: boolean
  esMenuActual: boolean
}) {
  const [menuLocal, setMenuLocal] = useState<MenuContenido | null>(null)
  const [fechaLocal, setFechaLocal] = useState<string | null>(null)
  const [regenerando, setRegenerando] = useState(false)
  const router = useRouter()

  const menuActual = menuLocal ?? contenido
  const fechaActual = fechaLocal ?? generadoEn

  async function regenerar() {
    setRegenerando(true)
    try {
      const res = await fetch('/api/generar-menu', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setMenuLocal(data.contenido)
        setFechaLocal(new Date().toISOString())
        router.refresh()
      }
    } finally {
      setRegenerando(false)
    }
  }

  if (!menuActual || !fechaActual) {
    return (
      <PantallaGenerar
        nombreBebe={nombreBebe}
        tienePerfil={tienePerfil}
        onGenerado={(c, f) => { setMenuLocal(c); setFechaLocal(f) }}
      />
    )
  }

  return (
    <div>
      {!esMenuActual && !menuLocal && (
        <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 14, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ margin: 0, fontSize: 14, color: '#92400E' }}>
            📅 Este menú es de una semana anterior. ¿Quieres generar uno nuevo para esta semana?
          </p>
          <button
            onClick={regenerar}
            disabled={regenerando}
            style={{ background: '#F4A340', color: 'white', border: 'none', borderRadius: 50, padding: '8px 20px', fontSize: 14, fontWeight: 700, cursor: regenerando ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
          >
            {regenerando ? '✨ Generando...' : '✨ Generar para esta semana'}
          </button>
        </div>
      )}
      <MenuGenerado contenido={menuActual} nombreBebe={nombreBebe} generadoEn={fechaActual} />
    </div>
  )
}
