import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import LogoutButton from '@/components/ui/LogoutButton'
import SeccionCards from './SeccionCards'
import SelectorHijo from './SelectorHijo'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: usuarioRaw }, { data: hijosRaw }] = await Promise.all([
    supabase
      .from('usuarios')
      .select('nombre')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('hijos')
      .select('id, nombre, fecha_nacimiento')
      .eq('usuario_id', user.id)
      .order('created_at', { ascending: true }),
  ])

  const usuario = usuarioRaw as { nombre: string | null } | null
  const hijos = (hijosRaw ?? []) as { id: string; nombre: string; fecha_nacimiento: string }[]

  const nombre = usuario?.nombre?.split(' ')[0] ?? user.email?.split('@')[0] ?? 'mamá'
  const cookieStore = await cookies()
  const hijoActivoId = cookieStore.get('hijo_activo_id')?.value ?? null
  const hijoActivo = hijos.find(h => h.id === hijoActivoId) ?? hijos[0] ?? null

  // Calcular edad del hijo activo
  function calcularMeses(fecha: string): number {
    const nac = new Date(fecha)
    const hoy = new Date()
    let m = (hoy.getFullYear() - nac.getFullYear()) * 12 + (hoy.getMonth() - nac.getMonth())
    if (hoy.getDate() < nac.getDate()) m--
    return Math.max(0, m)
  }

  const mesesActivo = hijoActivo ? calcularMeses(hijoActivo.fecha_nacimiento) : null

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Fredoka:wght@400;500;600&display=swap" rel="stylesheet" />

      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Outfit',sans-serif" }}>

        {/* Header */}
        <header className="np-dash-header" style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.png" alt="NutriPeques" style={{ height: 52, objectFit: 'contain' }} />
            <span className="np-dash-header-title" style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 18, fontWeight: 600, color: '#1f2937' }}>Método NutriPeques</span>
          </div>
          <div className="np-dash-header-actions" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <a href="/dashboard/perfil" style={{ color: '#6b7280', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>👤 Perfil</a>
            <LogoutButton />
          </div>
        </header>

        <main className="np-dash-main" style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px' }}>

          {/* Saludo */}
          <div className="np-dash-hero" style={{ background: 'linear-gradient(135deg,#F4A340,#E8821A)', borderRadius: 24, padding: '28px 32px', marginBottom: 20, color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -20, top: -20, fontSize: 100, opacity: .12, lineHeight: 1 }}>🥕</div>
            <p style={{ fontSize: 13, fontWeight: 700, opacity: .85, letterSpacing: 1, marginBottom: 6 }}>ÁREA EXCLUSIVA DE MIEMBROS</p>
            <h1 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 30, fontWeight: 600, margin: '0 0 6px' }}>
              ¡Hola, {nombre}! 👋
            </h1>
            {hijoActivo && mesesActivo !== null ? (
              <p style={{ margin: 0, opacity: .9, fontSize: 15 }}>
                {hijoActivo.nombre} tiene <strong>{mesesActivo} meses</strong> — contenido adaptado para esta etapa 🌿
              </p>
            ) : (
              <p style={{ margin: 0, opacity: .9, fontSize: 15 }}>
                Bienvenida al Método NutriPeques.{' '}
                <a href="/dashboard/perfil" style={{ color: 'white', fontWeight: 700, textDecoration: 'underline' }}>
                  Agrega el perfil de tu bebé →
                </a>
              </p>
            )}
          </div>

          {/* Selector de hijo (si hay más de uno o al menos uno) */}
          {hijos.length > 0 && (
            <SelectorHijo hijos={hijos} hijoActivoId={hijoActivo?.id ?? null} />
          )}

          {/* Secciones */}
          <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>Tu contenido</p>
          <SeccionCards />

          {/* Banner */}
          <div className="np-dash-banner" style={{ background: 'linear-gradient(135deg,#0D9488,#0F766E)', borderRadius: 20, padding: '22px 26px', color: 'white', display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ fontSize: 44, flexShrink: 0 }}>🎉</div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, opacity: .75, letterSpacing: 1, margin: '0 0 4px' }}>NOVEDAD</p>
              <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 18, fontWeight: 600, margin: '0 0 4px' }}>Bienvenida al Método NutriPeques</p>
              <p style={{ fontSize: 14, opacity: .9, margin: 0 }}>Explora el menú semanal y el buscador IA — búsquedas ilimitadas 🌿</p>
            </div>
          </div>

        </main>
      </div>
    </>
  )
}
