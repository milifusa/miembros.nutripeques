import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/ui/LogoutButton'
import RecursoCard from './RecursoCard'

type Recurso = {
  titulo: string
  descripcion: string
  emoji: string
  categoria: string
  href: string
  badge?: string
}

const RECURSOS: Recurso[] = [
  {
    categoria: 'Guías esenciales',
    emoji: '📘',
    titulo: 'Guía completa de inicio AC',
    descripcion: 'Todo lo que necesitas saber para empezar la alimentación complementaria de manera segura.',
    href: '/recursos/guia-inicio-ac.pdf',
    badge: 'Esencial',
  },
  {
    categoria: 'Guías esenciales',
    emoji: '🥕',
    titulo: 'Primeros alimentos por etapa',
    descripcion: 'Qué ofrecer mes a mes, texturas, cantidades y cómo preparar cada alimento.',
    href: '/recursos/primeros-alimentos.pdf',
  },
  {
    categoria: 'Guías esenciales',
    emoji: '⚠️',
    titulo: 'Alimentos a evitar y por qué',
    descripcion: 'Lista de alimentos prohibidos antes del año: miel, sal, azúcar, leche de vaca y más.',
    href: '/recursos/alimentos-evitar.pdf',
  },
  {
    categoria: 'Nutrición',
    emoji: '🩸',
    titulo: 'Hierro y vitamina C en la AC',
    descripcion: 'Cómo prevenir anemia, fuentes de hierro, combinaciones que potencian su absorción.',
    href: '/recursos/hierro-vitamina-c.pdf',
  },
  {
    categoria: 'Nutrición',
    emoji: '🐟',
    titulo: 'Omega-3 para el desarrollo cerebral',
    descripcion: 'Fuentes de omega-3 adecuadas para bebés y cómo incluirlas en la dieta diaria.',
    href: '/recursos/omega-3-bebes.pdf',
  },
  {
    categoria: 'BLW',
    emoji: '🤲',
    titulo: 'Manual de BLW paso a paso',
    descripcion: 'Baby Led Weaning explicado de forma práctica: postura, tamaños, señales de hambre.',
    href: '/recursos/manual-blw.pdf',
    badge: 'Nuevo',
  },
  {
    categoria: 'BLW',
    emoji: '🍽️',
    titulo: 'Texturas y cortes seguros por edad',
    descripcion: 'Guía visual de cómo cortar y preparar cada alimento para evitar atragantamientos.',
    href: '/recursos/texturas-cortes.pdf',
  },
  {
    categoria: 'Recetas',
    emoji: '🍲',
    titulo: '30 recetas 6-12 meses',
    descripcion: 'Recetas simples, nutritivas y sin sal para los primeros meses de alimentación.',
    href: '/recursos/recetas-6-12-meses.pdf',
  },
  {
    categoria: 'Recetas',
    emoji: '🥞',
    titulo: '20 recetas finger foods',
    descripcion: 'Recetas de trozos para que tu bebé se alimente solo: tortitas, palitos, bolitas.',
    href: '/recursos/recetas-finger-foods.pdf',
  },
]

const categorias = [...new Set(RECURSOS.map(r => r.categoria))]

export default async function RecursosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: usuarioRaw } = await supabase
    .from('usuarios')
    .select('nombre, productos_activos')
    .eq('id', user.id)
    .maybeSingle()

  const usuario = usuarioRaw as { nombre: string | null; productos_activos: string[] } | null
  const nombre = usuario?.nombre?.split(' ')[0] ?? user.email?.split('@')[0] ?? 'mamá'

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

          {/* Banner acceso */}
          <div style={{ background: 'linear-gradient(135deg,#0D9488,#0F766E)', borderRadius: 20, padding: '20px 24px', color: 'white', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <span style={{ fontSize: 36, flexShrink: 0 }}>🔐</span>
            <div>
              <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 17, fontWeight: 600, margin: '0 0 2px' }}>Acceso exclusivo de miembros</p>
              <p style={{ fontSize: 13, opacity: .9, margin: 0 }}>Todos los PDF son de descarga libre para ti. Guárdalos en tu dispositivo para acceso sin internet.</p>
            </div>
          </div>

          {/* Recursos por categoría */}
          {categorias.map(cat => {
            const items = RECURSOS.filter(r => r.categoria === cat)
            return (
              <div key={cat} style={{ marginBottom: 32 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
                  {cat}
                </p>
                <div className="np-recursos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14 }}>
                  {items.map(r => (
                    <RecursoCard
                      key={r.titulo}
                      titulo={r.titulo}
                      descripcion={r.descripcion}
                      emoji={r.emoji}
                      href={r.href}
                      badge={r.badge}
                    />
                  ))}
                </div>
              </div>
            )
          })}

        </main>
      </div>
    </>
  )
}
