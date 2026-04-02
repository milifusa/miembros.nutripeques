import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/ui/LogoutButton'
import RecursoCard from './RecursoCard'

import { tieneAccesoCompleto } from '@/lib/productos'

type Categoria = { id: string; nombre: string; icono: string; orden: number }
type Recurso = { id: string; categoria_id: string | null; titulo: string; descripcion: string | null; pdf_url: string; imagen_url: string | null; orden: number; producto_ids?: string[] | null }

export default async function RecursosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Usar admin client para bypasear RLS en todas las queries
  const admin = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [{ data: catData }, { data: recData }, { data: usuarioRaw }] = await Promise.all([
    (admin as any).from('categorias_recursos').select('*').order('orden'),
    (admin as any).from('recursos').select('*').order('orden'),
    (admin as any).from('usuarios').select('nombre, productos_activos').eq('id', user.id).maybeSingle(),
  ])

  const usuarioData = usuarioRaw as { nombre: string | null; productos_activos: string[] } | null
  const nombre = usuarioData?.nombre?.split(' ')[0] ?? user.email?.split('@')[0] ?? 'mamá'
  const productosActivos: string[] = usuarioData?.productos_activos ?? []
  const accesoCompleto = tieneAccesoCompleto(productosActivos)

  const categorias: Categoria[] = catData ?? []
  const todosRecursos: Recurso[] = recData ?? []

  // Filter resources based on access level
  const recursos: Recurso[] = accesoCompleto
    ? todosRecursos
    : todosRecursos.filter(r => {
        const pids: string[] = (r as { producto_ids?: string[] | null }).producto_ids ?? []
        // visible si al menos uno de sus productos coincide con lo que compró la usuaria
        return pids.length > 0 && pids.some(p => productosActivos.includes(p))
      })

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

        <main className="np-dash-main" style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px' }}>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 30, margin: '0 0 6px', color: '#1f2937' }}>
              📚 Mis recursos
            </h1>
            <p style={{ color: '#6b7280', margin: 0, fontSize: 15 }}>
              Hola, {nombre} — aquí tienes todas tus guías y materiales exclusivos
            </p>
          </div>

          {!accesoCompleto && (
            <div style={{ background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: 16, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>🔓</span>
              <p style={{ margin: 0, fontSize: 14, color: '#92400E', flex: 1 }}>
                Tienes acceso a los recursos de tu guía. Para ver todos los materiales,{' '}
                <a href="/api/checkout?producto=metodo_nutripeques" style={{ color: '#E8821A', fontWeight: 700, textDecoration: 'none' }}>
                  actualiza al plan completo →
                </a>
              </p>
            </div>
          )}

          <div style={{ background: 'linear-gradient(135deg,#0D9488,#0F766E)', borderRadius: 20, padding: '20px 24px', color: 'white', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <span style={{ fontSize: 36, flexShrink: 0 }}>🔐</span>
            <div>
              <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 17, fontWeight: 600, margin: '0 0 2px' }}>Acceso exclusivo de miembros</p>
              <p style={{ fontSize: 13, opacity: .9, margin: 0 }}>Todos los PDF son de descarga libre para ti. Guárdalos en tu dispositivo para acceso sin internet.</p>
            </div>
          </div>

          {categorias.length === 0 && recursos.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
              <p style={{ fontSize: 40, margin: '0 0 12px' }}>📭</p>
              <p style={{ fontSize: 16, fontWeight: 600 }}>Pronto habrá recursos disponibles</p>
            </div>
          )}

          {/* Recursos por categoría */}
          {categorias.map(cat => {
            const items = recursos.filter(r => r.categoria_id === cat.id)
            if (items.length === 0) return null
            return (
              <div key={cat.id} style={{ marginBottom: 32 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
                  {cat.icono} {cat.nombre}
                </p>
                <div className="np-recursos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14 }}>
                  {items.map(r => (
                    <RecursoCard
                      key={r.id}
                      titulo={r.titulo}
                      descripcion={r.descripcion ?? ''}
                      emoji={cat.icono}
                      href={r.pdf_url}
                      imagenUrl={r.imagen_url ?? undefined}
                    />
                  ))}
                </div>
              </div>
            )
          })}

          {/* Recursos sin categoría */}
          {recursos.filter(r => !r.categoria_id).length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
                📄 Otros recursos
              </p>
              <div className="np-recursos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14 }}>
                {recursos.filter(r => !r.categoria_id).map(r => (
                  <RecursoCard
                    key={r.id}
                    titulo={r.titulo}
                    descripcion={r.descripcion ?? ''}
                    emoji="📄"
                    href={r.pdf_url}
                    imagenUrl={r.imagen_url ?? undefined}
                  />
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  )
}
