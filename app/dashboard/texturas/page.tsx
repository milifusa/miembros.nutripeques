import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import LogoutButton from '@/components/ui/LogoutButton'
import AccesoBloqueado from '@/components/ui/AccesoBloqueado'

type Etapa = {
  num: number
  mesesMin: number
  mesesMax: number | null
  titulo: string
  textura: string
  consistencia: string
  ejemplos: string[]
  tip: string
}

const ETAPAS: Etapa[] = [
  {
    num: 1,
    mesesMin: 4,
    mesesMax: 6,
    titulo: 'Inicio - Purés muy suaves',
    textura: 'Completamente homogénea, sin grumos',
    consistencia: 'Semilíquida, cae de la cuchara',
    ejemplos: ['Puré de camote', 'Puré de manzana', 'Puré de zanahoria'],
    tip: 'Diluir con leche materna/fórmula para consistencia ideal',
  },
  {
    num: 2,
    mesesMin: 7,
    mesesMax: 9,
    titulo: 'Exploración - Purés con textura',
    textura: 'Pequeños grumos, aplastable con lengua',
    consistencia: 'Más espesa, se mantiene en la cuchara',
    ejemplos: ['Puré de lentejas', 'Banana aplastada', 'Papilla de avena'],
    tip: 'Puedes empezar con finger foods muy blandos',
  },
  {
    num: 3,
    mesesMin: 10,
    mesesMax: 12,
    titulo: 'Trozos blandos - Finger foods',
    textura: 'Trozos pequeños (1 cm), muy blandos',
    consistencia: 'Se deshacen con presión de los dedos',
    ejemplos: ['Pasta cocida', 'Verduras muy cocidas', 'Trozos de fruta madura'],
    tip: 'Tamaño ideal: como una uva cortada en 4',
  },
  {
    num: 4,
    mesesMin: 12,
    mesesMax: null,
    titulo: 'Comida familiar adaptada',
    textura: 'Comida normal cortada en trozos manejables',
    consistencia: 'Variada, similar a la familia',
    ejemplos: ['Todo lo que come la familia', 'Sin sal excesiva'],
    tip: 'Evita alimentos duros, redondos o pegajosos',
  },
]

function getEtapaActual(meses: number): number {
  if (meses >= 12) return 4
  if (meses >= 10) return 3
  if (meses >= 7) return 2
  return 1
}

function calcularMeses(fechaNacimiento: string): number {
  const hoy = new Date()
  const nac = new Date(fechaNacimiento)
  const diff = hoy.getFullYear() * 12 + hoy.getMonth() - (nac.getFullYear() * 12 + nac.getMonth())
  return Math.max(0, diff)
}

export default async function TexturasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: usuarioData } = await supabase.from('usuarios').select('productos_activos').eq('id', user.id).maybeSingle()
  const productosActivos: string[] = (usuarioData as { productos_activos: string[] } | null)?.productos_activos ?? []
  if (!productosActivos.includes('metodo_nutripeques')) {
    return <AccesoBloqueado />
  }

  const { data: usuarioRaw } = await supabase
    .from('usuarios')
    .select('nombre')
    .eq('id', user.id)
    .maybeSingle()

  const usuario = usuarioRaw as { nombre: string | null } | null
  const nombre = usuario?.nombre?.split(' ')[0] ?? user.email?.split('@')[0] ?? 'mamá'

  const cookieStore = await cookies()
  const hijoActivoId = cookieStore.get('hijo_activo_id')?.value ?? null

  let nombreBebe: string | null = null
  let edadMeses: number | null = null

  if (hijoActivoId) {
    const { data: hijoRaw } = await supabase
      .from('hijos')
      .select('nombre, fecha_nacimiento')
      .eq('id', hijoActivoId)
      .eq('usuario_id', user.id)
      .maybeSingle()

    const hijo = hijoRaw as { nombre: string; fecha_nacimiento: string } | null
    if (hijo) {
      nombreBebe = hijo.nombre
      edadMeses = calcularMeses(hijo.fecha_nacimiento)
    }
  } else {
    // Try first child
    const { data: hijoRaw } = await supabase
      .from('hijos')
      .select('nombre, fecha_nacimiento')
      .eq('usuario_id', user.id)
      .limit(1)
      .maybeSingle()

    const hijo = hijoRaw as { nombre: string; fecha_nacimiento: string } | null
    if (hijo) {
      nombreBebe = hijo.nombre
      edadMeses = calcularMeses(hijo.fecha_nacimiento)
    }
  }

  const etapaActual = edadMeses !== null ? getEtapaActual(edadMeses) : null

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Fredoka:wght@400;500;600&display=swap" rel="stylesheet" />

      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Outfit',sans-serif" }}>

        <header className="np-dash-header" style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.png" alt="NutriPeques" style={{ height: 52, objectFit: 'contain' }} />
            <span className="np-dash-header-title" style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 18, fontWeight: 600, color: '#1f2937' }}>Método NutriPeques</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/dashboard" style={{ color: '#6b7280', fontSize: 14, textDecoration: 'none' }}>← Dashboard</Link>
            <LogoutButton />
          </div>
        </header>

        <main className="np-dash-main" style={{ maxWidth: 760, margin: '0 auto', padding: '32px 20px' }}>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 30, margin: '0 0 6px', color: '#1f2937' }}>
              📊 Texturas y etapas
            </h1>
            <p style={{ color: '#6b7280', margin: 0, fontSize: 15 }}>
              Hola, {nombre} — guía de progresión de texturas para {nombreBebe ?? 'tu bebé'}
              {edadMeses !== null && (
                <span style={{ marginLeft: 8, background: '#FFF7ED', color: '#C2410C', fontSize: 13, fontWeight: 600, padding: '2px 10px', borderRadius: 20 }}>
                  {edadMeses} {edadMeses === 1 ? 'mes' : 'meses'}
                </span>
              )}
            </p>
          </div>

          {/* Sin perfil */}
          {!nombreBebe && (
            <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 16, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 24 }}>⚠️</span>
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: '#92400E', fontSize: 14 }}>Agrega el perfil de tu bebé para ver tu etapa actual</p>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#78350F' }}>
                  <Link href="/dashboard/perfil" style={{ color: '#E8821A', fontWeight: 700 }}>Ir al perfil →</Link>
                </p>
              </div>
            </div>
          )}

          {/* Etapas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
            {ETAPAS.map(etapa => {
              const esActual = etapaActual === etapa.num
              return (
                <div
                  key={etapa.num}
                  style={{
                    background: esActual ? '#FFF7ED' : 'white',
                    borderRadius: 20,
                    border: esActual ? '2px solid #F4A340' : '1px solid #e5e7eb',
                    borderLeft: esActual ? '5px solid #E8821A' : '5px solid #e5e7eb',
                    padding: '20px 24px',
                    boxShadow: esActual ? '0 4px 20px rgba(244,163,64,0.15)' : '0 1px 4px rgba(0,0,0,0.05)',
                    transition: 'all .2s',
                  }}
                >
                  {/* Header etapa */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: 12,
                        background: esActual ? 'linear-gradient(135deg,#F4A340,#E8821A)' : '#f3f4f6',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, fontWeight: 700, color: esActual ? 'white' : '#9ca3af',
                        fontFamily: "'Fredoka',sans-serif", flexShrink: 0,
                      }}>
                        {etapa.num}
                      </div>
                      <div>
                        <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 18, fontWeight: 600, color: '#1f2937', margin: 0 }}>
                          {etapa.titulo}
                        </p>
                        <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0' }}>
                          {etapa.mesesMax ? `${etapa.mesesMin}–${etapa.mesesMax} meses` : `${etapa.mesesMin}+ meses`}
                        </p>
                      </div>
                    </div>
                    {esActual && nombreBebe && (
                      <span style={{
                        background: 'linear-gradient(135deg,#F4A340,#E8821A)',
                        color: 'white', fontSize: 12, fontWeight: 700,
                        padding: '5px 14px', borderRadius: 20, whiteSpace: 'nowrap',
                      }}>
                        ← Etapa actual de {nombreBebe}
                      </span>
                    )}
                  </div>

                  {/* Detalle */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginBottom: 14 }}>
                    <div style={{ background: esActual ? 'rgba(255,255,255,0.7)' : '#f8fafc', borderRadius: 12, padding: '12px 16px' }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 4px' }}>Textura</p>
                      <p style={{ fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.5 }}>{etapa.textura}</p>
                    </div>
                    <div style={{ background: esActual ? 'rgba(255,255,255,0.7)' : '#f8fafc', borderRadius: 12, padding: '12px 16px' }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 4px' }}>Consistencia</p>
                      <p style={{ fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.5 }}>{etapa.consistencia}</p>
                    </div>
                  </div>

                  {/* Ejemplos */}
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 8px' }}>Ejemplos</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {etapa.ejemplos.map(ej => (
                        <span key={ej} style={{
                          background: esActual ? 'white' : '#f3f4f6',
                          border: esActual ? '1px solid #FED7AA' : '1px solid #e5e7eb',
                          color: esActual ? '#92400E' : '#4b5563',
                          fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 20,
                        }}>
                          {ej}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tip */}
                  <div style={{
                    background: esActual ? 'rgba(255,255,255,0.8)' : '#f8fafc',
                    borderRadius: 10, padding: '10px 14px',
                    borderLeft: '3px solid #0d9488',
                  }}>
                    <p style={{ fontSize: 13, color: '#0f766e', margin: 0, lineHeight: 1.5 }}>
                      <strong>💡 Tip:</strong> {etapa.tip}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Señales de preparación */}
          <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e5e7eb', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 20, color: '#1f2937', margin: '0 0 16px' }}>
              🔍 Señales de preparación
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
              {/* Listo */}
              <div style={{ background: '#F0FDF4', borderRadius: 16, padding: '16px 18px', border: '1px solid #86EFAC' }}>
                <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 15, fontWeight: 600, color: '#15803d', margin: '0 0 12px' }}>
                  ✅ Está listo si...
                </p>
                <ul style={{ margin: 0, padding: '0 0 0 4px', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    'Puede sentarse con apoyo',
                    'Muestra interés en la comida',
                    'Ha perdido el reflejo de extrusión',
                    'Abre la boca cuando ve comida',
                  ].map(item => (
                    <li key={item} style={{ fontSize: 13, color: '#166534', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ color: '#22c55e', flexShrink: 0, marginTop: 1 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Espera */}
              <div style={{ background: '#FEFCE8', borderRadius: 16, padding: '16px 18px', border: '1px solid #FEF08A' }}>
                <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 15, fontWeight: 600, color: '#A16207', margin: '0 0 12px' }}>
                  ⏳ Espera si...
                </p>
                <ul style={{ margin: 0, padding: '0 0 0 4px', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    'No puede sostener la cabeza',
                    'Empuja todo con la lengua',
                    'No muestra interés en la comida',
                    'Tiene menos de 4 meses',
                  ].map(item => (
                    <li key={item} style={{ fontSize: 13, color: '#92400E', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ color: '#eab308', flexShrink: 0, marginTop: 1 }}>⏳</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </main>
      </div>
    </>
  )
}
