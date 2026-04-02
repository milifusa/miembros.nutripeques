import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import LogoutButton from '@/components/ui/LogoutButton'
import BuscadorIA from './BuscadorIA'
import AccesoBloqueado from '@/components/ui/AccesoBloqueado'

export default async function BuscarPage() {
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

  const { data: hijosRaw } = await supabase
    .from('hijos')
    .select('id, nombre, fecha_nacimiento')
    .eq('usuario_id', user.id)
    .order('created_at', { ascending: true })
  const hijos = (hijosRaw ?? []) as { id: string; nombre: string; fecha_nacimiento: string }[]
  const hijoSeleccionado = hijos.find(h => h.id === hijoActivoId) ?? hijos[0] ?? null

  let nombreBebe: string | null = null
  let edadBebe: number | null = null

  if (hijoSeleccionado) {
    nombreBebe = hijoSeleccionado.nombre
    const nac = new Date(hijoSeleccionado.fecha_nacimiento)
    const hoyD = new Date()
    let m = (hoyD.getFullYear() - nac.getFullYear()) * 12 + (hoyD.getMonth() - nac.getMonth())
    if (hoyD.getDate() < nac.getDate()) m--
    edadBebe = Math.max(0, m)
  }

  // Historial reciente (últimas 20 búsquedas)
  const { data: historialRaw } = await supabase
    .from('busquedas_ia')
    .select('id, consulta, respuesta, created_at')
    .eq('usuario_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  const historial = (historialRaw ?? []) as {
    id: string
    consulta: string
    respuesta: string
    created_at: string
  }[]

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/dashboard" style={{ color: '#6b7280', fontSize: 14, textDecoration: 'none' }}>← Dashboard</Link>
            <LogoutButton />
          </div>
        </header>

        <main className="np-dash-main" style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px' }}>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 30, margin: '0 0 6px', color: '#1f2937' }}>
              🔍 Buscador IA
            </h1>
            <p style={{ color: '#6b7280', margin: 0, fontSize: 15 }}>
              Hola, {nombre} — consulta cualquier alimento y recibe información adaptada para {nombreBebe ?? 'tu bebé'}
            </p>
          </div>

          <div style={{ background: 'white', borderRadius: 24, boxShadow: '0 1px 6px rgba(0,0,0,.06)', padding: '28px' }}>
            <BuscadorIA
              edadBebe={edadBebe}
              nombreBebe={nombreBebe}
              historialInicial={historial}
            />
          </div>

        </main>
      </div>
    </>
  )
}
