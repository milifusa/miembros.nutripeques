import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import LogoutButton from '@/components/ui/LogoutButton'
import AccesoBloqueado from '@/components/ui/AccesoBloqueado'

type Alergeno = {
  nombre: string
  emoji: string
  mesesRecomendado: number
  formaSegura: (meses: number) => string
}

const ALERGENOS: Alergeno[] = [
  {
    nombre: 'Huevo (yema primero)',
    emoji: '🥚',
    mesesRecomendado: 6,
    formaSegura: (m) => m < 8 ? 'Yema bien cocida, aplastada en puré' : 'Huevo duro rallado o revuelto bien cocido',
  },
  {
    nombre: 'Cacahuate / maní',
    emoji: '🥜',
    mesesRecomendado: 6,
    formaSegura: (m) => m < 12 ? 'Pasta de cacahuate diluida en puré (sin trozos enteros)' : 'Mantequilla de cacahuate untada en pan',
  },
  {
    nombre: 'Leche de vaca (en recetas)',
    emoji: '🥛',
    mesesRecomendado: 6,
    formaSegura: (m) => m < 12 ? 'Mezclada en purés, papillas o recetas cocidas' : 'Como bebida a partir de los 12 meses',
  },
  {
    nombre: 'Pescado blanco',
    emoji: '🐟',
    mesesRecomendado: 6,
    formaSegura: (m) => m < 10 ? 'Merluza o bacalao cocido al vapor, en puré o aplastado' : 'En trozos pequeños sin espinas',
  },
  {
    nombre: 'Trigo / gluten',
    emoji: '🌾',
    mesesRecomendado: 6,
    formaSegura: (m) => m < 10 ? 'Pasta muy cocida aplastada, pan remojado' : 'Pan, pasta o tortillas en trozos blandos',
  },
  {
    nombre: 'Soya',
    emoji: '🫘',
    mesesRecomendado: 7,
    formaSegura: (m) => m < 10 ? 'Tofu suave aplastado o leche de soya en recetas' : 'Tofu en cubos blandos, edamame aplastado',
  },
  {
    nombre: 'Nueces y semillas',
    emoji: '🌰',
    mesesRecomendado: 8,
    formaSegura: (m) => m < 12 ? 'Molidas finamente o en pasta (nunca enteras)' : 'Pasta de almendra, tahini untado, finamente molidas',
  },
  {
    nombre: 'Mariscos',
    emoji: '🦐',
    mesesRecomendado: 12,
    formaSegura: (_m) => 'Camarón o calamar bien cocido, en trozos pequeños',
  },
]

function calcularMeses(fechaNacimiento: string): number {
  const hoy = new Date()
  const nac = new Date(fechaNacimiento)
  const diff = hoy.getFullYear() * 12 + hoy.getMonth() - (nac.getFullYear() * 12 + nac.getMonth())
  return Math.max(0, diff)
}

type EstadoAlergeno = 'puede' | 'proximo' | 'futuro'

function getEstado(mesesBebe: number, mesesRecomendado: number): EstadoAlergeno {
  if (mesesBebe >= mesesRecomendado) return 'puede'
  const diff = mesesRecomendado - mesesBebe
  if (diff <= 2) return 'proximo'
  return 'futuro'
}

export default async function AlergenosPage() {
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
              ⚠️ Plan de alérgenos
            </h1>
            <p style={{ color: '#6b7280', margin: 0, fontSize: 15 }}>
              Hola, {nombre} — calendario personalizado de introducción de alérgenos para {nombreBebe ?? 'tu bebé'}
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
                <p style={{ margin: 0, fontWeight: 600, color: '#92400E', fontSize: 14 }}>Agrega el perfil de tu bebé para ver el plan personalizado</p>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#78350F' }}>
                  <Link href="/dashboard/perfil" style={{ color: '#E8821A', fontWeight: 700 }}>Ir al perfil →</Link>
                </p>
              </div>
            </div>
          )}

          {/* Lista de alérgenos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
            {ALERGENOS.map((alergeno) => {
              const estado: EstadoAlergeno = edadMeses !== null
                ? getEstado(edadMeses, alergeno.mesesRecomendado)
                : 'futuro'

              const mesesFaltan = edadMeses !== null
                ? Math.max(0, alergeno.mesesRecomendado - edadMeses)
                : null

              const estadoConfig: Record<EstadoAlergeno, { bg: string; border: string; badgeBg: string; badgeColor: string; label: string }> = {
                puede: {
                  bg: 'white', border: '#86EFAC',
                  badgeBg: '#F0FDF4', badgeColor: '#15803d',
                  label: '✓ Puede probar',
                },
                proximo: {
                  bg: 'white', border: '#FEF08A',
                  badgeBg: '#FEFCE8', badgeColor: '#A16207',
                  label: `⏳ En ${mesesFaltan ?? '?'} ${mesesFaltan === 1 ? 'mes' : 'meses'}`,
                },
                futuro: {
                  bg: 'white', border: '#e5e7eb',
                  badgeBg: '#F3F4F6', badgeColor: '#6b7280',
                  label: `⏰ A los ${alergeno.mesesRecomendado} meses`,
                },
              }

              const config = estadoConfig[estado]

              return (
                <div
                  key={alergeno.nombre}
                  style={{
                    background: config.bg,
                    border: `1.5px solid ${config.border}`,
                    borderRadius: 18,
                    padding: '16px 20px',
                    boxShadow: estado === 'puede' ? '0 2px 8px rgba(134,239,172,0.3)' : '0 1px 4px rgba(0,0,0,0.04)',
                    display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                  }}
                >
                  {/* Emoji */}
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                    background: estado === 'puede' ? '#F0FDF4' : estado === 'proximo' ? '#FEFCE8' : '#f3f4f6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                  }}>
                    {alergeno.emoji}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                      <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 16, fontWeight: 600, color: '#1f2937', margin: 0 }}>
                        {alergeno.nombre}
                      </p>
                      <span style={{
                        background: config.badgeBg, color: config.badgeColor,
                        fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                        whiteSpace: 'nowrap',
                      }}>
                        {config.label}
                      </span>
                    </div>
                    {estado === 'puede' && edadMeses !== null && (
                      <p style={{ fontSize: 13, color: '#4b5563', margin: 0, lineHeight: 1.5 }}>
                        <span style={{ fontWeight: 600, color: '#0d9488' }}>Forma segura:</span>{' '}
                        {alergeno.formaSegura(edadMeses)}
                      </p>
                    )}
                    {estado !== 'puede' && (
                      <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>
                        Recomendado a partir de los {alergeno.mesesRecomendado} meses
                      </p>
                    )}
                  </div>

                  {/* Edad badge */}
                  <div style={{
                    background: '#f8fafc', borderRadius: 12, padding: '8px 14px',
                    textAlign: 'center', flexShrink: 0,
                  }}>
                    <p style={{ fontSize: 18, fontWeight: 700, color: '#374151', margin: 0, fontFamily: "'Fredoka',sans-serif" }}>
                      {alergeno.mesesRecomendado}m
                    </p>
                    <p style={{ fontSize: 10, color: '#9ca3af', margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>meses</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Notas importantes */}
          <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e5e7eb', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 20, color: '#1f2937', margin: '0 0 16px' }}>
              📋 Notas importantes
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: '1️⃣', text: 'Introduce un alérgeno a la vez, nunca varios el mismo día.' },
                { icon: '⏳', text: 'Espera 3–5 días entre cada alérgeno nuevo antes de introducir otro.' },
                { icon: '👀', text: 'Observa reacciones: urticaria, hinchazón, vómito o dificultad para respirar.' },
                { icon: '👨‍⚕️', text: 'Si hay historial familiar de alergias, consulta al pediatra antes.' },
                { icon: '✅', text: 'La introducción temprana (desde los 6 meses) REDUCE el riesgo de alergia, según estudios recientes.' },
              ].map(nota => (
                <div key={nota.icon} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 14px', background: '#f8fafc', borderRadius: 12 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{nota.icon}</span>
                  <p style={{ fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.6 }}>{nota.text}</p>
                </div>
              ))}
            </div>

            <div style={{ background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: 14, padding: '14px 18px', marginTop: 16 }}>
              <p style={{ fontSize: 13, color: '#0f766e', margin: 0, lineHeight: 1.6 }}>
                <strong>💡 Recuerda:</strong> Empieza con una pequeña cantidad (punta de cucharadita) y aumenta gradualmente en días sucesivos. La leche materna o fórmula sigue siendo el alimento principal hasta los 12 meses.
              </p>
            </div>
          </div>

        </main>
      </div>
    </>
  )
}
