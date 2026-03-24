import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Database } from '@/types/database'
import Stripe from 'stripe'
import NuevoUsuario from './NuevoUsuario'
import AccionesUsuario from './AccionesUsuario'
import LogoutButton from '@/components/ui/LogoutButton'

type Miembro = Database['public']['Tables']['usuarios']['Row']

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-02-25.clover' })

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')
  if (user.email !== 'nutripequespro@gmail.com') redirect('/dashboard')

  const admin = createAdminClient()

  const [
    { data: miembros },
    busquedasRes,
    bitacoraRes,
    menuRes,
    hijosRes,
    { data: busquedasHoy },
    { data: miembrosEstaSemana },
    authUsersRes,
    sessionesAbandonadas,
  ] = await Promise.all([
    admin.from('usuarios').select('*').order('created_at', { ascending: false }) as unknown as Promise<{ data: Miembro[] | null }>,
    admin.from('busquedas_ia').select('id, usuario_id') as unknown as Promise<{ data: { usuario_id: string }[] | null; error: unknown }>,
    admin.from('bitacora_bebe').select('id, usuario_id') as unknown as Promise<{ data: { usuario_id: string }[] | null; error: unknown }>,
    admin.from('menus_semanales').select('id, usuario_id') as unknown as Promise<{ data: { usuario_id: string }[] | null; error: unknown }>,
    admin.from('hijos').select('id, usuario_id, nombre, fecha_nacimiento').order('fecha_nacimiento', { ascending: true }) as unknown as Promise<{ data: { id: string; usuario_id: string; nombre: string; fecha_nacimiento: string }[] | null; error: unknown }>,
    admin.from('busquedas_ia').select('id', { count: 'exact' })
      .gte('created_at', new Date(Date.now() - 86400000).toISOString()),
    admin.from('usuarios').select('id', { count: 'exact' })
      .gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
    admin.auth.admin.listUsers({ perPage: 1000 }),
    // Checkouts expirados (abandonados) de los últimos 30 días
    stripe.checkout.sessions.list({
      limit: 50,
      status: 'expired',
    }).catch(() => ({ data: [] })),
  ])

  // Contar uso por usuario
  const busquedasMap: Record<string, number> = {}
  busquedasRes.data?.forEach(b => { busquedasMap[b.usuario_id] = (busquedasMap[b.usuario_id] ?? 0) + 1 })

  const bitacoraMap: Record<string, number> = {}
  bitacoraRes.data?.forEach(b => { bitacoraMap[b.usuario_id] = (bitacoraMap[b.usuario_id] ?? 0) + 1 })

  const menuMap: Record<string, number> = {}
  menuRes.data?.forEach(m => { menuMap[m.usuario_id] = (menuMap[m.usuario_id] ?? 0) + 1 })

  const hijosMap: Record<string, { id: string; nombre: string; fecha_nacimiento: string }[]> = {}
  hijosRes.data?.forEach(h => {
    if (!hijosMap[h.usuario_id]) hijosMap[h.usuario_id] = []
    hijosMap[h.usuario_id].push({ id: h.id, nombre: h.nombre, fecha_nacimiento: h.fecha_nacimiento })
  })

  // Estado de ban + último login
  const authUsers = authUsersRes.data?.users ?? []
  const banMap: Record<string, boolean> = {}
  const lastLoginMap: Record<string, string | null> = {}
  authUsers.forEach((u: { id: string; banned_until?: string | null; last_sign_in_at?: string | null }) => {
    banMap[u.id] = !!u.banned_until && new Date(u.banned_until) > new Date()
    lastLoginMap[u.id] = u.last_sign_in_at ?? null
  })

  // Checkouts abandonados: con email pero sin usuario creado en Supabase
  const emailsRegistrados = new Set(miembros?.map(m => m.email) ?? [])
  const abandonados = (sessionesAbandonadas.data ?? [])
    .filter(s => s.customer_details?.email && !emailsRegistrados.has(s.customer_details.email!))
    .map(s => ({
      email: s.customer_details!.email!,
      nombre: s.customer_details?.name ?? null,
      monto: s.amount_total ?? 0,
      fecha: new Date(s.expires_at * 1000),
    }))
    // Deduplicar por email (quedarse con el más reciente)
    .filter((s, i, arr) => arr.findIndex(x => x.email === s.email) === i)

  const totalMiembros = miembros?.length ?? 0
  const totalBusquedasHoy = busquedasHoy?.length ?? 0
  const totalEstaSemana = miembrosEstaSemana?.length ?? 0
  const totalMenus = menuRes.data?.length ?? 0
  const totalRevenueCents = miembros?.reduce((sum, m) => sum + (m.monto_pago ?? 0), 0) ?? 0
  const totalRevenueMXN = (totalRevenueCents / 100).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })

  const stats = [
    { label: 'Total miembros', value: totalMiembros, icon: '👥', color: '#CCFBF1', text: '#0d9488' },
    { label: 'Búsquedas IA hoy', value: totalBusquedasHoy, icon: '🔍', color: '#FEF3C7', text: '#D97706' },
    { label: 'Nuevos esta semana', value: totalEstaSemana, icon: '🆕', color: '#EDE9FE', text: '#7C3AED' },
    { label: 'Menús generados', value: totalMenus, icon: '📅', color: '#DBEAFE', text: '#1d4ed8' },
    { label: 'Ingresos totales', value: totalRevenueMXN, icon: '💰', color: '#DCFCE7', text: '#15803d' },
  ]

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Fredoka:wght@400;500;600&display=swap" rel="stylesheet" />

      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Outfit',sans-serif" }}>
        <header className="np-dash-header" style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 32px', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.png" alt="NutriPeques" style={{ height: 52, objectFit: 'contain' }} />
            <span className="np-dash-header-title" style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 18, fontWeight: 600, color: '#1f2937' }}>Método NutriPeques</span>
            <span className="np-dash-header-title" style={{ background: '#FEF3C7', color: '#D97706', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>ADMIN</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a href="/dashboard" style={{ color: '#6b7280', fontSize: 14, textDecoration: 'none' }}>← Dashboard</a>
            <LogoutButton />
          </div>
        </header>

        <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 32, margin: '0 0 4px', color: '#1f2937' }}>
                Panel de administración 🌿
              </h1>
              <p style={{ color: '#6b7280', margin: 0, fontSize: 15 }}>Hola, Liliana 👋 Aquí tienes el resumen de tu comunidad</p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a
                href="/admin/recursos"
                style={{ background: '#7C3AED', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: 14, padding: '9px 18px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                📚 Gestionar recursos
              </a>
              <NuevoUsuario />
            </div>
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

          {/* Pagos abandonados */}
          {abandonados.length > 0 && (
            <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 1px 6px rgba(0,0,0,.06)', overflow: 'hidden', marginBottom: 24 }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>⚠️</span>
                <div>
                  <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 20, margin: 0, color: '#1f2937' }}>
                    Carritos abandonados ({abandonados.length})
                  </h2>
                  <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>Personas que iniciaron el pago pero no completaron el proceso</p>
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: '#fffbeb' }}>
                      {['Email', 'Nombre', 'Monto', 'Expiró'].map(h => (
                        <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontWeight: 600, color: '#92400E', fontSize: 13, whiteSpace: 'nowrap', borderBottom: '1px solid #fef3c7' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {abandonados.map((a, i) => (
                      <tr key={a.email} style={{ borderBottom: '1px solid #fef9ec', background: i % 2 === 0 ? 'white' : '#fffdf5' }}>
                        <td style={{ padding: '12px 16px', color: '#1f2937', fontWeight: 500 }}>{a.email}</td>
                        <td style={{ padding: '12px 16px', color: '#374151' }}>{a.nombre ?? <span style={{ color: '#d1d5db' }}>—</span>}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ background: '#FEF3C7', color: '#D97706', fontWeight: 700, fontSize: 13, padding: '3px 10px', borderRadius: 10 }}>
                            {(a.monto / 100).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: 13 }}>
                          {a.fecha.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Members table */}
          <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 1px 6px rgba(0,0,0,.06)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
              <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 20, margin: 0, color: '#1f2937' }}>
                👥 Miembros ({totalMiembros})
              </h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Email', 'Nombre', 'Registro', '👶 Hijos', '💳 Pago', '🔍 Búsquedas', '📓 Bitácora', '📅 Menús', 'Estado', 'Acciones'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', fontSize: 13, whiteSpace: 'nowrap', borderBottom: '1px solid #f3f4f6' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {!miembros?.length && (
                    <tr>
                      <td colSpan={10} style={{ padding: '32px', textAlign: 'center', color: '#9ca3af' }}>
                        Aún no hay miembros registrados
                      </td>
                    </tr>
                  )}
                  {miembros?.map((m, i) => {
                    const isBanned = banMap[m.id] ?? false
                    const nuncaEntro = !lastLoginMap[m.id]
                    return (
                      <tr key={m.id} style={{ borderBottom: '1px solid #f9fafb', background: isBanned ? '#fff5f5' : i % 2 === 0 ? 'white' : '#fafafa' }}>
                        <td style={{ padding: '13px 16px', color: '#1f2937', fontWeight: 500, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {m.email}
                        </td>
                        <td style={{ padding: '13px 16px', color: '#374151' }}>
                          {m.nombre ?? <span style={{ color: '#d1d5db' }}>—</span>}
                        </td>
                        <td style={{ padding: '13px 16px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                          {new Date(m.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '13px 16px', minWidth: 160 }}>
                          {(hijosMap[m.id] ?? []).length === 0 ? (
                            <span style={{ color: '#d1d5db', fontSize: 13 }}>—</span>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {hijosMap[m.id].map(h => {
                                const fn = new Date(h.fecha_nacimiento + 'T12:00:00')
                                const hoy = new Date()
                                const meses = (hoy.getFullYear() - fn.getFullYear()) * 12 + (hoy.getMonth() - fn.getMonth())
                                const edad = meses < 24 ? `${meses}m` : `${Math.floor(meses / 12)}a`
                                return (
                                  <div key={h.id} style={{ background: '#F3E8FF', borderRadius: 8, padding: '4px 10px' }}>
                                    <span style={{ color: '#7C3AED', fontWeight: 700, fontSize: 13 }}>👶 {h.nombre}</span>
                                    <span style={{ color: '#9333ea', fontSize: 11, display: 'block' }}>
                                      {fn.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })} · {edad}
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                          {m.monto_pago != null ? (
                            <span style={{ background: '#DCFCE7', color: '#15803d', fontWeight: 700, fontSize: 13, padding: '3px 10px', borderRadius: 10 }}>
                              💳 {(m.monto_pago / 100).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })}
                            </span>
                          ) : (
                            <span style={{ background: '#F3F4F6', color: '#6b7280', fontSize: 12, padding: '3px 10px', borderRadius: 10 }}>
                              Manual
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                          <span style={{ background: '#FEF3C7', color: '#D97706', fontWeight: 700, fontSize: 13, padding: '3px 10px', borderRadius: 10 }}>
                            {busquedasMap[m.id] ?? 0}
                          </span>
                        </td>
                        <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                          <span style={{ background: '#CCFBF1', color: '#0d9488', fontWeight: 700, fontSize: 13, padding: '3px 10px', borderRadius: 10 }}>
                            {bitacoraMap[m.id] ?? 0}
                          </span>
                        </td>
                        <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                          <span style={{ background: '#DBEAFE', color: '#1d4ed8', fontWeight: 700, fontSize: 13, padding: '3px 10px', borderRadius: 10 }}>
                            {menuMap[m.id] ?? 0}
                          </span>
                        </td>
                        <td style={{ padding: '13px 16px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <span style={{
                              background: isBanned ? '#FEE2E2' : '#DCFCE7',
                              color: isBanned ? '#dc2626' : '#15803d',
                              fontSize: 12, fontWeight: 600,
                              padding: '3px 10px', borderRadius: 10, whiteSpace: 'nowrap', display: 'inline-block',
                            }}>
                              {isBanned ? '⊘ Bloqueado' : '✓ Activo'}
                            </span>
                            {nuncaEntro && !isBanned && (
                              <span style={{ background: '#FEF3C7', color: '#D97706', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10, whiteSpace: 'nowrap', display: 'inline-block' }}>
                                ⏳ Sin acceder
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '13px 16px' }}>
                          <AccionesUsuario usuarioId={m.id} isBanned={isBanned} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
