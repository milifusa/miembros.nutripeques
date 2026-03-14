import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/ui/LogoutButton'
import PerfilForm from './PerfilForm'
import HijosManager from './HijosManager'

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: usuarioRaw } = await supabase
    .from('usuarios')
    .select('nombre')
    .eq('id', user.id)
    .maybeSingle()

  const nombre = (usuarioRaw as { nombre: string | null } | null)?.nombre ?? null

  const { data: hijosRaw } = await supabase
    .from('hijos')
    .select('id, nombre, fecha_nacimiento')
    .eq('usuario_id', user.id)
    .order('created_at', { ascending: true })

  const hijos = (hijosRaw ?? []) as { id: string; nombre: string; fecha_nacimiento: string }[]

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

        <main className="np-dash-main" style={{ maxWidth: 620, margin: '0 auto', padding: '32px 20px' }}>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 30, margin: '0 0 6px', color: '#1f2937' }}>
              👤 Mi perfil
            </h1>
            <p style={{ color: '#6b7280', margin: 0, fontSize: 15 }}>
              Gestiona tu cuenta y los perfiles de tus hijos
            </p>
          </div>

          {/* Tu cuenta */}
          <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 1px 6px rgba(0,0,0,.06)', padding: '24px', marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', letterSpacing: 1, textTransform: 'uppercase', margin: '0 0 16px' }}>
              Tu cuenta
            </p>
            <PerfilForm nombre={nombre} email={user.email!} />
          </div>

          {/* Hijos */}
          <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 1px 6px rgba(0,0,0,.06)', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', letterSpacing: 1, textTransform: 'uppercase', margin: 0 }}>
                Mis hijos
              </p>
              {hijos.length > 0 && (
                <span style={{ background: '#CCFBF1', color: '#0d9488', fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>
                  {hijos.length} {hijos.length === 1 ? 'perfil' : 'perfiles'}
                </span>
              )}
            </div>
            <HijosManager hijosIniciales={hijos} />
          </div>

        </main>
      </div>
    </>
  )
}
