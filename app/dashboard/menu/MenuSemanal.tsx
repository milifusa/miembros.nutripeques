'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const BotonDescargarPDF = dynamic(() => import('./BotonDescargarPDF'), { ssr: false })

export type Comida = {
  nombre: string
  descripcion: string
  emoji: string
  tiempo_preparacion?: number
  tiempo_coccion?: number
  porciones?: string
  ingredientes?: string[]
  preparacion?: string[]
  nutricion?: Record<string, string>
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

type RecetaGuardada = {
  id: string
  nombre: string
  emoji: string | null
  descripcion: string | null
  tiempo_preparacion: number | null
  tiempo_coccion: number | null
  porciones: string | null
  ingredientes: string[] | null
  preparacion: string[] | null
  nutricion: Record<string, string> | null
  alergenos: string[] | null
  created_at: string
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
        <strong>{nombreBebe ?? 'tu bebé'}</strong>, con recetas completas, ingredientes, pasos y valores nutricionales.
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

// ─── Tarjeta de comida expandible ────────────────────────────────────────────
function ComidaCard({
  comida,
  tiempoConfig,
  hijoId,
  savedIds,
  onSave,
}: {
  comida: Comida
  tiempoConfig: typeof TIEMPOS[number]
  hijoId: string | null
  savedIds: Set<string>
  onSave: (receta: RecetaGuardada) => void
}) {
  const [expandida, setExpandida] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const estaGuardada = savedIds.has(comida.nombre)

  async function guardar(e: React.MouseEvent) {
    e.stopPropagation()
    if (estaGuardada || guardando) return
    setGuardando(true)
    try {
      const res = await fetch('/api/recetas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hijo_id: hijoId,
          nombre: comida.nombre,
          emoji: comida.emoji,
          descripcion: comida.descripcion,
          tiempo_preparacion: comida.tiempo_preparacion ?? null,
          tiempo_coccion: comida.tiempo_coccion ?? null,
          porciones: comida.porciones ?? null,
          ingredientes: comida.ingredientes ?? null,
          preparacion: comida.preparacion ?? null,
          nutricion: comida.nutricion ?? null,
          alergenos: comida.alergenos ?? null,
        }),
      })
      const data = await res.json()
      if (res.ok && data.receta) {
        onSave(data.receta as RecetaGuardada)
      }
    } finally {
      setGuardando(false)
    }
  }

  const tieneDetalle = !!(
    comida.ingredientes?.length ||
    comida.preparacion?.length ||
    comida.nutricion
  )

  return (
    <div
      style={{
        background: 'white', borderRadius: 20, border: `2px solid ${tiempoConfig.bg}`,
        boxShadow: '0 1px 6px rgba(0,0,0,.05)', overflow: 'hidden',
        transition: 'box-shadow .15s',
      }}
    >
      {/* Header del tiempo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px 10px', borderBottom: `1px solid ${tiempoConfig.bg}` }}>
        <div style={{ background: tiempoConfig.bg, borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
          {tiempoConfig.emoji}
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: tiempoConfig.color, textTransform: 'uppercase', letterSpacing: 0.5, flex: 1 }}>
          {tiempoConfig.label}
        </span>
        {/* Botón guardar */}
        <button
          onClick={guardar}
          disabled={estaGuardada || guardando}
          style={{
            background: estaGuardada ? '#F0FDF4' : '#FFF7ED',
            color: estaGuardada ? '#15803d' : '#E8821A',
            border: `1px solid ${estaGuardada ? '#86EFAC' : '#FED7AA'}`,
            borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 700,
            cursor: estaGuardada ? 'default' : guardando ? 'wait' : 'pointer',
            whiteSpace: 'nowrap', transition: 'all .15s',
          }}
        >
          {estaGuardada ? '✓ Guardada' : guardando ? '...' : '♡ Guardar'}
        </button>
      </div>

      {/* Cuerpo */}
      <div style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
          <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{comida.emoji}</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 16, fontWeight: 600, color: '#1f2937', margin: '0 0 3px' }}>
              {comida.nombre}
            </p>
            <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
              {comida.descripcion}
            </p>
          </div>
        </div>

        {/* Badges de tiempo y porciones */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {comida.tiempo_preparacion != null && (
            <span style={{ background: '#F1F5F9', color: '#475569', fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 10 }}>
              ⏱ {comida.tiempo_preparacion} min prep
            </span>
          )}
          {comida.tiempo_coccion != null && comida.tiempo_coccion > 0 && (
            <span style={{ background: '#FFF7ED', color: '#C2410C', fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 10 }}>
              🔥 {comida.tiempo_coccion} min cocción
            </span>
          )}
          {comida.porciones && (
            <span style={{ background: '#F0FDF4', color: '#166534', fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 10 }}>
              🍽 {comida.porciones}
            </span>
          )}
        </div>

        {/* Alérgenos */}
        {comida.alergenos && comida.alergenos.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
            {comida.alergenos.map(a => (
              <span key={a} style={{ background: '#FEF9C3', color: '#A16207', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>
                ⚠️ {a}
              </span>
            ))}
          </div>
        )}

        {/* Toggle expandir */}
        {tieneDetalle && (
          <button
            onClick={() => setExpandida(!expandida)}
            style={{
              background: 'none', border: 'none', padding: 0,
              fontSize: 12, fontWeight: 600, color: tiempoConfig.color,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            {expandida ? '▲ Ocultar receta' : '▼ Ver receta completa'}
          </button>
        )}

        {/* Detalle expandido */}
        {expandida && (
          <div style={{ marginTop: 16, borderTop: '1px solid #f3f4f6', paddingTop: 16 }}>

            {comida.ingredientes && comida.ingredientes.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 14, fontWeight: 600, color: '#374151', margin: '0 0 8px' }}>
                  Ingredientes
                </p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {comida.ingredientes.map((ing, i) => (
                    <li key={i} style={{ fontSize: 13, color: '#4b5563', padding: '3px 0', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                      <span style={{ color: tiempoConfig.color, fontWeight: 700, flexShrink: 0 }}>•</span>
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {comida.preparacion && comida.preparacion.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 14, fontWeight: 600, color: '#374151', margin: '0 0 8px' }}>
                  Preparación
                </p>
                <ol style={{ margin: 0, padding: '0 0 0 20px' }}>
                  {comida.preparacion.map((paso, i) => (
                    <li key={i} style={{ fontSize: 13, color: '#4b5563', padding: '3px 0', lineHeight: 1.5 }}>
                      {paso}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {comida.nutricion && Object.keys(comida.nutricion).length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 14, fontWeight: 600, color: '#374151', margin: '0 0 8px' }}>
                  Información nutricional
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 6 }}>
                  {Object.entries(comida.nutricion).map(([k, v]) => (
                    <div key={k} style={{ background: '#f8fafc', borderRadius: 10, padding: '6px 10px', textAlign: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1f2937' }}>{v}</div>
                      <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'capitalize', marginTop: 1 }}>{k}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}

// ─── Menú generado ────────────────────────────────────────────────────────────
function MenuGenerado({
  contenido,
  nombreBebe,
  generadoEn,
  hijoId,
  savedIds,
  onSave,
}: {
  contenido: MenuContenido
  nombreBebe: string | null
  generadoEn: string
  hijoId: string | null
  savedIds: Set<string>
  onSave: (receta: RecetaGuardada) => void
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
      <div className="np-menu-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
        {TIEMPOS.map(t => {
          const comida = dia[t.key] as Comida
          return (
            <ComidaCard
              key={t.key}
              comida={comida}
              tiempoConfig={t}
              hijoId={hijoId}
              savedIds={savedIds}
              onSave={onSave}
            />
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

// ─── Tarjeta de receta guardada ───────────────────────────────────────────────
function RecetaGuardadaCard({
  receta,
  onEliminar,
}: {
  receta: RecetaGuardada
  onEliminar: (id: string) => void
}) {
  const [expandida, setExpandida] = useState(false)
  const [eliminando, setEliminando] = useState(false)

  const tieneDetalle = !!(
    receta.ingredientes?.length ||
    receta.preparacion?.length ||
    receta.nutricion
  )

  async function eliminar(e: React.MouseEvent) {
    e.stopPropagation()
    if (eliminando) return
    setEliminando(true)
    try {
      await fetch(`/api/recetas?id=${receta.id}`, { method: 'DELETE' })
      onEliminar(receta.id)
    } finally {
      setEliminando(false)
    }
  }

  return (
    <div style={{
      background: 'white', borderRadius: 18, border: '2px solid #F3F4F6',
      boxShadow: '0 1px 4px rgba(0,0,0,.04)', overflow: 'hidden',
    }}>
      <div style={{ padding: '14px 16px' }}>
        {/* Fila nombre + eliminar */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>{receta.emoji ?? '🍽'}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 15, fontWeight: 600, color: '#1f2937', margin: '0 0 3px', lineHeight: 1.3 }}>
              {receta.nombre}
            </p>
            {receta.descripcion && (
              <p style={{ fontSize: 12, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
                {receta.descripcion}
              </p>
            )}
          </div>
          <button
            onClick={eliminar}
            disabled={eliminando}
            style={{
              background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA',
              borderRadius: 16, padding: '4px 10px', fontSize: 11, fontWeight: 700,
              cursor: eliminando ? 'wait' : 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            {eliminando ? '...' : '🗑 Eliminar'}
          </button>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
          {receta.tiempo_preparacion != null && (
            <span style={{ background: '#F1F5F9', color: '#475569', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>
              ⏱ {receta.tiempo_preparacion} min prep
            </span>
          )}
          {receta.tiempo_coccion != null && receta.tiempo_coccion > 0 && (
            <span style={{ background: '#FFF7ED', color: '#C2410C', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>
              🔥 {receta.tiempo_coccion} min cocción
            </span>
          )}
          {receta.porciones && (
            <span style={{ background: '#F0FDF4', color: '#166534', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>
              🍽 {receta.porciones}
            </span>
          )}
        </div>

        {/* Alérgenos */}
        {receta.alergenos && receta.alergenos.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
            {receta.alergenos.map(a => (
              <span key={a} style={{ background: '#FEF9C3', color: '#A16207', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>
                ⚠️ {a}
              </span>
            ))}
          </div>
        )}

        {tieneDetalle && (
          <button
            onClick={() => setExpandida(!expandida)}
            style={{
              background: 'none', border: 'none', padding: 0,
              fontSize: 12, fontWeight: 600, color: '#0d9488',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            {expandida ? '▲ Ocultar receta' : '▼ Ver receta completa'}
          </button>
        )}

        {expandida && (
          <div style={{ marginTop: 14, borderTop: '1px solid #f3f4f6', paddingTop: 14 }}>
            {receta.ingredientes && receta.ingredientes.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 6px' }}>
                  Ingredientes
                </p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {receta.ingredientes.map((ing, i) => (
                    <li key={i} style={{ fontSize: 12, color: '#4b5563', padding: '2px 0', display: 'flex', gap: 6 }}>
                      <span style={{ color: '#0d9488', fontWeight: 700 }}>•</span>{ing}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {receta.preparacion && receta.preparacion.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 6px' }}>
                  Preparación
                </p>
                <ol style={{ margin: 0, padding: '0 0 0 18px' }}>
                  {receta.preparacion.map((paso, i) => (
                    <li key={i} style={{ fontSize: 12, color: '#4b5563', padding: '2px 0', lineHeight: 1.5 }}>
                      {paso}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {receta.nutricion && Object.keys(receta.nutricion).length > 0 && (
              <div>
                <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 6px' }}>
                  Información nutricional
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 5 }}>
                  {Object.entries(receta.nutricion).map(([k, v]) => (
                    <div key={k} style={{ background: '#f8fafc', borderRadius: 8, padding: '5px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#1f2937' }}>{v}</div>
                      <div style={{ fontSize: 9, color: '#9ca3af', textTransform: 'capitalize', marginTop: 1 }}>{k}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Sección de recetas guardadas ─────────────────────────────────────────────
function SeccionRecetasGuardadas({
  recetas,
  onEliminar,
}: {
  recetas: RecetaGuardada[]
  onEliminar: (id: string) => void
}) {
  return (
    <div style={{ marginTop: 40 }}>
      <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 22 }}>📖</span>
          <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 22, color: '#1f2937', margin: 0 }}>
            Mis recetas guardadas
          </h2>
          <span style={{ background: '#F0FDFA', color: '#0d9488', fontSize: 13, fontWeight: 700, padding: '3px 12px', borderRadius: 20 }}>
            {recetas.length}
          </span>
        </div>

        {recetas.length === 0 ? (
          <div style={{ background: '#f8fafc', borderRadius: 16, padding: '28px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🤍</div>
            <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 16, color: '#374151', margin: '0 0 6px' }}>
              Aún no tienes recetas guardadas
            </p>
            <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>
              Toca el botón ♡ Guardar en cualquier receta del menú para añadirla aquí.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {recetas.map(r => (
              <RecetaGuardadaCard key={r.id} receta={r} onEliminar={onEliminar} />
            ))}
          </div>
        )}
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
  hijoId,
  recetasIniciales,
}: {
  contenido: MenuContenido | null
  nombreBebe: string | null
  generadoEn: string | null
  tienePerfil: boolean
  esMenuActual: boolean
  hijoId: string | null
  recetasIniciales: RecetaGuardada[]
}) {
  const [menuLocal, setMenuLocal] = useState<MenuContenido | null>(null)
  const [fechaLocal, setFechaLocal] = useState<string | null>(null)
  const [regenerando, setRegenerando] = useState(false)
  const [recetas, setRecetas] = useState<RecetaGuardada[]>(recetasIniciales)
  const router = useRouter()

  const menuActual = menuLocal ?? contenido
  const fechaActual = fechaLocal ?? generadoEn

  // Set de nombres de recetas guardadas para lookup rápido O(1)
  const savedIds = new Set(recetas.map(r => r.nombre))

  function handleSave(receta: RecetaGuardada) {
    setRecetas(prev => [receta, ...prev])
  }

  function handleEliminar(id: string) {
    setRecetas(prev => prev.filter(r => r.id !== id))
  }

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
      <>
        <PantallaGenerar
          nombreBebe={nombreBebe}
          tienePerfil={tienePerfil}
          onGenerado={(c, f) => { setMenuLocal(c); setFechaLocal(f) }}
        />
        <SeccionRecetasGuardadas recetas={recetas} onEliminar={handleEliminar} />
      </>
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
      <MenuGenerado
        contenido={menuActual}
        nombreBebe={nombreBebe}
        generadoEn={fechaActual}
        hijoId={hijoId}
        savedIds={savedIds}
        onSave={handleSave}
      />
      <SeccionRecetasGuardadas recetas={recetas} onEliminar={handleEliminar} />
    </div>
  )
}
