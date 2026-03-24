import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import LogoutButton from '@/components/ui/LogoutButton'
import MenuSemanalUI from './MenuSemanal'
import type { MenuContenido } from './MenuSemanal'

function getLunesDeEstaSemana(): string {
  const hoy = new Date()
  const dia = hoy.getDay()
  const diff = dia === 0 ? -6 : 1 - dia
  const lunes = new Date(hoy)
  lunes.setDate(hoy.getDate() + diff)
  return lunes.toISOString().split('T')[0]
}

export default async function MenuPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Obtener usuario + hijo activo
  const { data: usuarioRaw } = await supabase
    .from('usuarios')
    .select('nombre')
    .eq('id', user.id)
    .maybeSingle()

  const usuario = usuarioRaw as { nombre: string | null } | null
  const nombre = usuario?.nombre?.split(' ')[0] ?? user.email?.split('@')[0] ?? 'mamá'
  const cookieStore = await cookies()
  const hijoActivoId = cookieStore.get('hijo_activo_id')?.value ?? null

  // Obtener el hijo a mostrar: activo o el primero disponible
  let nombreBebe: string | null = null
  let tienePerfil = false
  let hijoId: string | null = hijoActivoId

  {
    const { data: hijoRaw, error: hijoError } = await supabase
      .from('hijos')
      .select('id, nombre')
      .eq('usuario_id', user.id)
      .eq(hijoActivoId ? 'id' : 'usuario_id', hijoActivoId ?? user.id)
      .limit(1)
      .maybeSingle()

    console.log('[menu] hijoRaw:', hijoRaw, '| hijoError:', hijoError)

    if (hijoRaw) {
      const hijo = hijoRaw as { id: string; nombre: string }
      hijoId = hijo.id
      nombreBebe = hijo.nombre
      tienePerfil = true
    }
  }

  // Buscar menú más reciente para ese hijo (sin requerir semana exacta)
  const semana = getLunesDeEstaSemana()
  console.log('[menu] semana calculada:', semana, '| hijoId final:', hijoId)
  let menuGuardado: { contenido: MenuContenido; created_at: string; semana: string } | null = null

  if (hijoId) {
    const result = await (supabase
      .from('menus_semanales') as ReturnType<typeof supabase.from>)
      .select('contenido, created_at, semana')
      .eq('usuario_id', user.id)
      .eq('hijo_id', hijoId)
      .order('semana', { ascending: false })
      .limit(1)
      .maybeSingle()

    const r = result as unknown as { data: { contenido: MenuContenido; created_at: string; semana: string } | null; error: unknown }
    console.log('[menu] menuGuardado data:', r.data ? `FOUND semana=${r.data.semana}` : 'NULL', '| error:', r.error)
    menuGuardado = r.data
  } else {
    console.log('[menu] hijoId es null, no se busca menú')
  }

  const tieneMenu = !!menuGuardado?.contenido
  const esMenuActual = menuGuardado ? (() => {
    const lunes = new Date(menuGuardado.semana + 'T12:00:00')
    const domingo = new Date(lunes)
    domingo.setDate(lunes.getDate() + 6)
    domingo.setHours(23, 59, 59, 999)
    const ahora = new Date()
    return ahora >= lunes && ahora <= domingo
  })() : false

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

        <main className="np-dash-main" style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>

          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 30, margin: '0 0 6px', color: '#1f2937' }}>
              📅 Menú semanal
            </h1>
            <p style={{ color: '#6b7280', margin: 0, fontSize: 15 }}>
              Hola, {nombre} — plan de comidas personalizado con IA para {nombreBebe ?? 'tu bebé'}
            </p>
          </div>

          {/* Aviso sin hijo configurado */}
          {!tienePerfil && (
            <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 16, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 24 }}>⚠️</span>
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: '#92400E', fontSize: 14 }}>Agrega el perfil de tu bebé primero</p>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#78350F' }}>
                  Necesitamos la fecha de nacimiento de tu bebé para generar el menú.{' '}
                  <Link href="/dashboard/perfil" style={{ color: '#E8821A', fontWeight: 700 }}>
                    Ir al perfil →
                  </Link>
                </p>
              </div>
            </div>
          )}

          {tieneMenu ? (
            <div style={{ background: 'white', borderRadius: 24, boxShadow: '0 1px 6px rgba(0,0,0,.06)', padding: '28px' }}>
              <MenuSemanalUI
                contenido={menuGuardado!.contenido}
                nombreBebe={nombreBebe}
                generadoEn={menuGuardado!.created_at}
                tienePerfil={tienePerfil}
                esMenuActual={esMenuActual}
              />
            </div>
          ) : (
            <div style={{ background: 'white', borderRadius: 24, boxShadow: '0 1px 6px rgba(0,0,0,.06)', padding: '48px 28px', textAlign: 'center' }}>
              <MenuSemanalUI
                contenido={null}
                nombreBebe={nombreBebe}
                generadoEn={null}
                tienePerfil={tienePerfil}
                esMenuActual={false}
              />
            </div>
          )}

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: '#9ca3af' }}>
              ¿Dudas sobre algún alimento?{' '}
              <Link href="/dashboard/buscar" style={{ color: '#0d9488', fontWeight: 600, textDecoration: 'none' }}>
                Consulta el Buscador IA →
              </Link>
            </p>
          </div>

        </main>
      </div>
    </>
  )
}
