'use client'

import { tieneAccesoCompleto } from '@/lib/productos'

const SECCIONES = [
  {
    icon: '📅',
    titulo: 'Menú semanal',
    descripcion: 'Plan de comidas adaptado a la edad de tu bebé',
    href: '/dashboard/menu',
    bg: '#FFF7ED', border: '#FED7AA', iconBg: '#FFEDD5',
  },
  {
    icon: '🔍',
    titulo: 'Buscador IA',
    descripcion: 'Consulta cualquier alimento con inteligencia artificial',
    href: '/dashboard/buscar',
    bg: '#F0FDFA', border: '#99F6E4', iconBg: '#CCFBF1',
  },
  {
    icon: '📚',
    titulo: 'Mis recursos',
    descripcion: 'PDFs, guías y materiales exclusivos de tu compra',
    href: '/dashboard/recursos',
    bg: '#FAF5FF', border: '#E9D5FF', iconBg: '#F3E8FF',
  },
  {
    icon: '📓',
    titulo: 'Bitácora del bebé',
    descripcion: 'Registra y sigue los alimentos que introduces',
    href: '/dashboard/bitacora',
    bg: '#FFF0F6', border: '#FBCFE8', iconBg: '#FCE7F3',
  },
  {
    icon: '📊',
    titulo: 'Texturas y etapas',
    descripcion: 'Guía de progresión de texturas según la edad',
    href: '/dashboard/texturas',
    bg: '#FFF7ED', border: '#FED7AA', iconBg: '#FFEDD5',
  },
  {
    icon: '⚠️',
    titulo: 'Plan de alérgenos',
    descripcion: 'Calendario personalizado para introducir alérgenos',
    href: '/dashboard/alergenos',
    bg: '#FEFCE8', border: '#FEF08A', iconBg: '#FEF9C3',
  },
  {
    icon: '🎂',
    titulo: 'Ideas de cumpleaños',
    descripcion: 'Pasteles y aperitivos saludables para la fiesta',
    href: '/dashboard/cumpleanos',
    bg: '#FFF0F6', border: '#FBCFE8', iconBg: '#FCE7F3',
  },
  {
    icon: '🔄',
    titulo: 'Sustitutos de ingredientes',
    descripcion: '¿No tienes un ingrediente? Encuentra el reemplazo ideal',
    href: '/dashboard/sustitutos',
    bg: '#F0FDFA', border: '#99F6E4', iconBg: '#CCFBF1',
  },
]

export default function SeccionCards({ productosActivos }: { productosActivos: string[] }) {
  const accesoCompleto = tieneAccesoCompleto(productosActivos)

  return (
    <div className="np-section-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14, marginBottom: 28 }}>
      {SECCIONES.map((s) => {
        const esRecursos = s.href === '/dashboard/recursos'
        const bloqueado = !accesoCompleto && !esRecursos

        if (bloqueado) {
          return (
            <a
              key={s.href}
              href={s.href}
              style={{ background: s.bg, border: `2px solid ${s.border}`, borderRadius: 20, padding: '22px 20px', textDecoration: 'none', display: 'block', opacity: 0.6, position: 'relative', cursor: 'pointer' }}
              onClick={e => {
                e.preventDefault()
                alert('Para acceder a esta sección necesitas el Método NutriPeques completo por $299 MXN. Visita la página principal para actualizar tu plan. 🌟')
              }}
            >
              <div style={{ position: 'absolute', top: 10, right: 12, fontSize: 16 }}>🔒</div>
              <div style={{ width: 48, height: 48, background: s.iconBg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 14 }}>
                {s.icon}
              </div>
              <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 17, fontWeight: 600, color: '#1f2937', margin: '0 0 4px' }}>{s.titulo}</p>
              <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>{s.descripcion}</p>
            </a>
          )
        }

        return (
          <a
            key={s.href}
            href={s.href}
            style={{ background: s.bg, border: `2px solid ${s.border}`, borderRadius: 20, padding: '22px 20px', textDecoration: 'none', display: 'block', transition: 'transform .15s, box-shadow .15s' }}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,.1)' }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
          >
            <div style={{ width: 48, height: 48, background: s.iconBg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 14 }}>
              {s.icon}
            </div>
            <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 17, fontWeight: 600, color: '#1f2937', margin: '0 0 4px' }}>{s.titulo}</p>
            <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>{s.descripcion}</p>
          </a>
        )
      })}
    </div>
  )
}
