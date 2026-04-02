import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import LogoutButton from '@/components/ui/LogoutButton'
import BuscadorSustitutos from './BuscadorSustitutos'
import AccesoBloqueado from '@/components/ui/AccesoBloqueado'

export default async function SustitutosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminDb = createAdminClient()
  const { data: usuarioData } = await (adminDb as any).from('usuarios').select('productos_activos').eq('id', user.id).maybeSingle()
  const productosActivos: string[] = (usuarioData as { productos_activos: string[] } | null)?.productos_activos ?? []
  if (!productosActivos.includes('metodo_nutripeques')) {
    return <AccesoBloqueado />
  }

  const cookieStore = await cookies()
  const hijoActivoId = cookieStore.get('hijo_activo_id')?.value ?? null

  const { data: hijoRaw } = await supabase
    .from('hijos')
    .select('id, nombre, fecha_nacimiento, pais')
    .eq('usuario_id', user.id)
    .eq(hijoActivoId ? 'id' : 'usuario_id', hijoActivoId ?? user.id)
    .limit(1)
    .maybeSingle()

  const hijo = hijoRaw as { id: string; nombre: string; fecha_nacimiento: string; pais: string | null } | null

  let edadMeses = 12
  let nombreBebe = 'tu bebé'

  if (hijo) {
    nombreBebe = hijo.nombre
    const nac = new Date(hijo.fecha_nacimiento)
    const hoy = new Date()
    let m = (hoy.getFullYear() - nac.getFullYear()) * 12 + (hoy.getMonth() - nac.getMonth())
    if (hoy.getDate() < nac.getDate()) m--
    edadMeses = Math.max(0, m)
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Fredoka:wght@400;500;600&display=swap" rel="stylesheet" />

      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Outfit',sans-serif" }}>

        {/* Header */}
        <header style={{
          background: 'white', borderBottom: '1px solid #e5e7eb',
          padding: '0 24px', height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.png" alt="NutriPeques" style={{ height: 52, objectFit: 'contain' }} />
            <span style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 18, fontWeight: 600, color: '#1f2937' }}>
              Método NutriPeques
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/dashboard" style={{ color: '#6b7280', fontSize: 14, textDecoration: 'none' }}>
              ← Dashboard
            </Link>
            <LogoutButton />
          </div>
        </header>

        {/* Main */}
        <main style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px' }}>

          {/* Page title */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{
              fontFamily: "'Fredoka',sans-serif",
              fontSize: 30, margin: '0 0 6px', color: '#1f2937',
            }}>
              🔄 Sustitutos de ingredientes
            </h1>
            <p style={{ color: '#6b7280', margin: 0, fontSize: 15 }}>
              Hola — encuentra alternativas seguras y nutritivas para {nombreBebe} cuando te falte un ingrediente
            </p>
          </div>

          {/* No hijo warning */}
          {!hijo && (
            <div style={{
              background: '#FFF7ED', border: '1px solid #FED7AA',
              borderRadius: 16, padding: '18px 22px', marginBottom: 28,
            }}>
              <p style={{ margin: 0, color: '#92400E', fontSize: 14 }}>
                ⚠️ No encontramos un bebé registrado.{' '}
                <Link href="/dashboard/perfil" style={{ color: '#E8821A', fontWeight: 700, textDecoration: 'none' }}>
                  Configura el perfil →
                </Link>
              </p>
            </div>
          )}

          <BuscadorSustitutos edadMeses={edadMeses} />

        </main>
      </div>
    </>
  )
}
