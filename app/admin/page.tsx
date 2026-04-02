import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Database } from '@/types/database'
import Stripe from 'stripe'
import NuevoUsuario from './NuevoUsuario'
import MiembrosTabla from './MiembrosTabla'
import LogoutButton from '@/components/ui/LogoutButton'

type Miembro = Database['public']['Tables']['usuarios']['Row']

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-02-25.clover' })

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')
  if (user.email !== 'nutripequespro@gmail.com') redirect('/dashboard')

  const admin = createAdminClient()

  type BusquedaRow = { usuario_id: string; consulta: string; created_at: string }
  type BitacoraRow = { usuario_id: string; alimento: string; reaccion: string; aceptacion: number; fecha_introduccion: string }
  type MenuRow = { usuario_id: string; semana: string; created_at: string }
  type CumpleanosRow = { usuario_id: string; mes: string; edad_meses: number; pais: string | null; created_at: string }
  type SustitutoRow = { usuario_id: string; ingrediente: string; edad_meses: number; created_at: string }
  type DescargaRow = { usuario_id: string; recurso_titulo: string; created_at: string }

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
    cumpleanosRes,
    sustitutosRes,
    descargasRes,
  ] = await Promise.all([
    admin.from('usuarios').select('*').order('created_at', { ascending: false }) as unknown as Promise<{ data: Miembro[] | null }>,
    admin.from('busquedas_ia').select('usuario_id, consulta, created_at').order('created_at', { ascending: false }).limit(500) as unknown as Promise<{ data: BusquedaRow[] | null }>,
    admin.from('bitacora_bebe').select('usuario_id, alimento, reaccion, aceptacion, fecha_introduccion').order('fecha_introduccion', { ascending: false }).limit(500) as unknown as Promise<{ data: BitacoraRow[] | null }>,
    admin.from('menus_semanales').select('usuario_id, semana, created_at').order('created_at', { ascending: false }).limit(200) as unknown as Promise<{ data: MenuRow[] | null }>,
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
    admin.from('ideas_cumpleanos').select('usuario_id, mes, edad_meses, pais, created_at').order('created_at', { ascending: false }) as unknown as Promise<{ data: CumpleanosRow[] | null }>,
    admin.from('sustitutos_cache').select('usuario_id, ingrediente, edad_meses, created_at').order('created_at', { ascending: false }).limit(500) as unknown as Promise<{ data: SustitutoRow[] | null }>,
    admin.from('descargas_recursos').select('usuario_id, recurso_titulo, created_at').order('created_at', { ascending: false }).limit(300) as unknown as Promise<{ data: DescargaRow[] | null }>,
  ])


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

  // Build per-user item lists
  const busquedasByUser: Record<string, { consulta: string; created_at: string }[]> = {}
  busquedasRes.data?.forEach(r => {
    if (!busquedasByUser[r.usuario_id]) busquedasByUser[r.usuario_id] = []
    busquedasByUser[r.usuario_id].push({ consulta: r.consulta, created_at: r.created_at })
  })

  const bitacoraByUser: Record<string, { alimento: string; reaccion: string; aceptacion: number; fecha_introduccion: string }[]> = {}
  bitacoraRes.data?.forEach(r => {
    if (!bitacoraByUser[r.usuario_id]) bitacoraByUser[r.usuario_id] = []
    bitacoraByUser[r.usuario_id].push({ alimento: r.alimento, reaccion: r.reaccion, aceptacion: r.aceptacion, fecha_introduccion: r.fecha_introduccion })
  })

  const menusByUser: Record<string, { semana: string; created_at: string }[]> = {}
  menuRes.data?.forEach(r => {
    if (!menusByUser[r.usuario_id]) menusByUser[r.usuario_id] = []
    menusByUser[r.usuario_id].push({ semana: r.semana, created_at: r.created_at })
  })

  const cumpleanosData = (cumpleanosRes as { data: CumpleanosRow[] | null }).data ?? []
  const cumpleanosMap: Record<string, { mes: string; edad_meses: number; pais: string | null; created_at: string }[]> = {}
  cumpleanosData.forEach(r => {
    if (!cumpleanosMap[r.usuario_id]) cumpleanosMap[r.usuario_id] = []
    cumpleanosMap[r.usuario_id].push({ mes: r.mes, edad_meses: r.edad_meses, pais: r.pais, created_at: r.created_at })
  })

  const sustitutosData = (sustitutosRes as { data: SustitutoRow[] | null }).data ?? []
  const sustitutosMap: Record<string, { ingrediente: string; edad_meses: number; created_at: string }[]> = {}
  sustitutosData.forEach(r => {
    if (!sustitutosMap[r.usuario_id]) sustitutosMap[r.usuario_id] = []
    sustitutosMap[r.usuario_id].push({ ingrediente: r.ingrediente, edad_meses: r.edad_meses, created_at: r.created_at })
  })

  const descargasData = (descargasRes as { data: DescargaRow[] | null }).data ?? []
  const descargasMap: Record<string, { recurso_titulo: string; created_at: string }[]> = {}
  descargasData.forEach(r => {
    if (!descargasMap[r.usuario_id]) descargasMap[r.usuario_id] = []
    descargasMap[r.usuario_id].push({ recurso_titulo: r.recurso_titulo, created_at: r.created_at })
  })

  const totalCumpleanos = cumpleanosData.length
  const totalSustitutos = sustitutosData.length
  const totalDescargas = descargasData.length

  const stats = [
    { label: 'Total miembros', value: totalMiembros, icon: '👥', color: '#CCFBF1', text: '#0d9488' },
    { label: 'Búsquedas IA hoy', value: totalBusquedasHoy, icon: '🔍', color: '#FEF3C7', text: '#D97706' },
    { label: 'Nuevos esta semana', value: totalEstaSemana, icon: '🆕', color: '#EDE9FE', text: '#7C3AED' },
    { label: 'Menús generados', value: totalMenus, icon: '📅', color: '#DBEAFE', text: '#1d4ed8' },
    { label: 'Ingresos totales', value: totalRevenueMXN, icon: '💰', color: '#DCFCE7', text: '#15803d' },
    { label: 'Ideas cumpleaños', value: totalCumpleanos, icon: '🎂', color: '#FEE2E2', text: '#dc2626' },
    { label: 'Búsquedas sustitutos', value: totalSustitutos, icon: '🔄', color: '#F3E8FF', text: '#7C3AED' },
    { label: 'Descargas PDF', value: totalDescargas, icon: '📥', color: '#DBEAFE', text: '#1d4ed8' },
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
          <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 1px 6px rgba(0,0,0,.06)', overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
              <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 20, margin: 0, color: '#1f2937' }}>
                👥 Miembros ({totalMiembros})
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#9ca3af' }}>Haz clic en cualquier miembro para ver sus detalles</p>
            </div>
            <MiembrosTabla
              miembros={(miembros ?? []).map(m => ({
                id: m.id,
                email: m.email,
                nombre: m.nombre ?? null,
                created_at: m.created_at,
                monto_pago: m.monto_pago ?? null,
                acceso_activo: null,
                productos_activos: m.productos_activos ?? [],
              }))}
              extras={Object.fromEntries((miembros ?? []).map(m => [m.id, {
                isBanned: banMap[m.id] ?? false,
                nuncaEntro: !lastLoginMap[m.id],
                lastLogin: lastLoginMap[m.id] ?? null,
                hijos: hijosMap[m.id] ?? [],
                busquedas: busquedasByUser[m.id] ?? [],
                bitacora: bitacoraByUser[m.id] ?? [],
                menus: menusByUser[m.id] ?? [],
                cumpleanos: cumpleanosMap[m.id] ?? [],
                sustitutos: sustitutosMap[m.id] ?? [],
                descargas: descargasMap[m.id] ?? [],
              }]))}
            />
          </div>
        </main>
      </div>
    </>
  )
}
