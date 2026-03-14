import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/ui/LogoutButton'
import RecursosManager from './RecursosManager'

export default async function AdminRecursosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  if (user.email !== 'nutripequespro@gmail.com') redirect('/dashboard')

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Fredoka:wght@400;500;600&display=swap" rel="stylesheet" />

      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Outfit',sans-serif" }}>
        <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 32px', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.png" alt="NutriPeques" style={{ height: 52, objectFit: 'contain' }} />
            <span style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 18, fontWeight: 600, color: '#1f2937' }}>Método NutriPeques</span>
            <span style={{ background: '#FEF3C7', color: '#D97706', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>ADMIN</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a href="/admin" style={{ color: '#6b7280', fontSize: 14, textDecoration: 'none' }}>← Panel admin</a>
            <LogoutButton />
          </div>
        </header>

        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 30, margin: '0 0 4px', color: '#1f2937' }}>
              📚 Gestor de recursos PDF
            </h1>
            <p style={{ color: '#6b7280', margin: 0, fontSize: 15 }}>
              Crea categorías con icono y agrega PDFs con imagen, título y descripción.
            </p>
          </div>

          <RecursosManager />
        </main>
      </div>
    </>
  )
}
