import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/ui/LogoutButton'

const SECCIONES = [
  {
    icon: '📅',
    titulo: 'Menú semanal',
    descripcion: 'Menú adaptado a la edad de tu bebé',
    href: '/dashboard/menu',
    color: 'bg-orange-50 border-orange-200',
  },
  {
    icon: '🔍',
    titulo: 'Buscador IA',
    descripcion: 'Consulta cualquier alimento con IA',
    href: '/dashboard/buscar',
    color: 'bg-teal-50 border-teal-200',
  },
  {
    icon: '📚',
    titulo: 'Mis recursos',
    descripcion: 'PDFs y materiales de tu compra',
    href: '/dashboard/recursos',
    color: 'bg-purple-50 border-purple-200',
  },
  {
    icon: '📓',
    titulo: 'Bitácora del bebé',
    descripcion: 'Registra los alimentos introducidos',
    href: '/dashboard/bitacora',
    color: 'bg-pink-50 border-pink-200',
  },
]

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: usuarioRaw } = await supabase
    .from('usuarios')
    .select('nombre, nombre_bebe, edad_bebe_meses')
    .eq('id', user.id)
    .maybeSingle()

  const usuario = usuarioRaw as { nombre: string | null; nombre_bebe: string | null; edad_bebe_meses: number | null } | null

  const nombre = usuario?.nombre?.split(' ')[0] ?? 'mamá'
  const nombreBebe = usuario?.nombre_bebe
  const edadBebe = usuario?.edad_bebe_meses

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🥕</span>
            <span className="font-bold text-gray-800">NutriPeques</span>
          </div>
          <LogoutButton />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Saludo */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">
            Hola {nombre} 👋
          </h1>
          {nombreBebe && edadBebe ? (
            <p className="text-gray-500 mt-1">
              {nombreBebe} tiene {edadBebe} meses — contenido adaptado para esta etapa
            </p>
          ) : (
            <p className="text-gray-500 mt-1">
              Bienvenida al área exclusiva de miembros.{' '}
              <a href="/dashboard/perfil" className="text-teal-500 underline">
                Configura el perfil de tu bebé
              </a>
            </p>
          )}
        </div>

        {/* Accesos rápidos */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Tu contenido
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {SECCIONES.map((seccion) => (
              <a
                key={seccion.href}
                href={seccion.href}
                className={`${seccion.color} border rounded-2xl p-5 hover:shadow-md transition-shadow`}
              >
                <span className="text-3xl block mb-2">{seccion.icon}</span>
                <p className="font-semibold text-gray-800 text-sm">{seccion.titulo}</p>
                <p className="text-gray-500 text-xs mt-1">{seccion.descripcion}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Novedades */}
        <div className="bg-teal-500 text-white rounded-2xl p-6">
          <p className="text-xs font-semibold uppercase tracking-wide opacity-75 mb-1">
            Novedad
          </p>
          <p className="font-bold text-lg">Bienvenida al Método NutriPeques</p>
          <p className="text-sm opacity-90 mt-1">
            Explora el menú semanal y el buscador IA — sin límites de búsqueda.
          </p>
        </div>
      </div>
    </main>
  )
}
