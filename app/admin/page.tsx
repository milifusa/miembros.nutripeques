import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Database } from '@/types/database'
import NuevoUsuario from './NuevoUsuario'
import LogoutButton from '@/components/ui/LogoutButton'

type Miembro = Database['public']['Tables']['usuarios']['Row']

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')
  if (user.email !== process.env.ADMIN_EMAIL) redirect('/dashboard')

  const admin = createAdminClient()

  // Stats y miembros en paralelo
  const [
    { data: miembros },
    { data: busquedasHoy },
    { data: miembrosEstaSemana },
  ] = await Promise.all([
    admin.from('usuarios').select('*').order('created_at', { ascending: false }) as unknown as Promise<{ data: Miembro[] | null }>,
    admin.from('busquedas_ia').select('id', { count: 'exact' })
      .gte('created_at', new Date(Date.now() - 86400000).toISOString()),
    admin.from('usuarios').select('id', { count: 'exact' })
      .gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
  ])

  const totalMiembros = miembros?.length ?? 0
  const totalBusquedasHoy = busquedasHoy?.length ?? 0
  const totalEstaSemana = miembrosEstaSemana?.length ?? 0

  const stats = [
    { label: 'Total miembros', value: totalMiembros, icon: '👥', color: '#CCFBF1', text: '#0d9488' },
    { label: 'Búsquedas IA hoy', value: totalBusquedasHoy, icon: '🔍', color: '#FEF3C7', text: '#D97706' },
    { label: 'Nuevos esta semana', value: totalEstaSemana, icon: '🆕', color: '#EDE9FE', text: '#7C3AED' },
  ]

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Fredoka:wght@400;500;600&display=swap" rel="stylesheet" />

      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Outfit',sans-serif" }}>
        {/* Header */}
        <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.png" alt="NutriPeques" style={{ height: 36, objectFit: 'contain' }} />
            <span style={{ background: '#FEF3C7', color: '#D97706', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>ADMIN</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a href="/dashboard" style={{ color: '#6b7280', fontSize: 14, textDecoration: 'none' }}>← Dashboard</a>
            <LogoutButton />
          </div>
        </header>

        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
          {/* Title + action */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 32, margin: '0 0 4px', color: '#1f2937' }}>
                Panel de administración 🌿
              </h1>
              <p style={{ color: '#6b7280', margin: 0, fontSize: 15 }}>Hola, Liliana 👋 Aquí tienes el resumen de tu comunidad</p>
            </div>
            <NuevoUsuario />
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 32 }}>
            {stats.map(s => (
              <div key={s.label} style={{ background: 'white', borderRadius: 16, padding: '20px 24px', boxShadow: '0 1px 6px rgba(0,0,0,.06)', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ background: s.color, borderRadius: 12, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: s.text, fontFamily: "'Fredoka',sans-serif", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Members table */}
          <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 1px 6px rgba(0,0,0,.06)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 20, margin: 0, color: '#1f2937' }}>
                👥 Miembros ({totalMiembros})
              </h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Email', 'Nombre', 'Bebé', 'Edad bebé', 'Productos', 'Registro'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', fontSize: 13, whiteSpace: 'nowrap', borderBottom: '1px solid #f3f4f6' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {!miembros?.length && (
                    <tr>
                      <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#9ca3af' }}>
                        Aún no hay miembros registrados
                      </td>
                    </tr>
                  )}
                  {miembros?.map((m, i) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #f9fafb', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td style={{ padding: '13px 16px', color: '#1f2937', fontWeight: 500 }}>{m.email}</td>
                      <td style={{ padding: '13px 16px', color: '#374151' }}>{m.nombre ?? <span style={{ color: '#d1d5db' }}>—</span>}</td>
                      <td style={{ padding: '13px 16px', color: '#374151' }}>{m.nombre_bebe ?? <span style={{ color: '#d1d5db' }}>—</span>}</td>
                      <td style={{ padding: '13px 16px', color: '#374151' }}>
                        {m.edad_bebe_meses != null ? `${m.edad_bebe_meses} m` : <span style={{ color: '#d1d5db' }}>—</span>}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        {m.productos_activos?.map((p: string) => (
                          <span key={p} style={{ background: '#CCFBF1', color: '#0d9488', padding: '3px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600, marginRight: 4 }}>
                            {p}
                          </span>
                        ))}
                      </td>
                      <td style={{ padding: '13px 16px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                        {new Date(m.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
