import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { PRODUCTOS } from '@/lib/productos'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'nutripequespro@gmail.com') return null
  return user
}

// PATCH /api/admin/productos-usuario
// Body: { usuario_id: string, productos_activos: string[] }
export async function PATCH(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { usuario_id, productos_activos } = await req.json()
  if (!usuario_id || !Array.isArray(productos_activos)) {
    return NextResponse.json({ error: 'usuario_id y productos_activos requeridos' }, { status: 400 })
  }

  // Validar que todos los productos sean válidos
  const productosValidos = Object.keys(PRODUCTOS)
  const invalidos = productos_activos.filter((p: string) => !productosValidos.includes(p))
  if (invalidos.length > 0) {
    return NextResponse.json({ error: `Productos inválidos: ${invalidos.join(', ')}` }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await (admin as ReturnType<typeof admin.from> & { from: typeof admin.from })
    .from('usuarios')
    .update({ productos_activos } as never)
    .eq('id', usuario_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, productos_activos })
}
