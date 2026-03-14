import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { hijo_id } = await request.json()
  if (!hijo_id) return NextResponse.json({ error: 'Falta hijo_id' }, { status: 400 })

  const admin = createAdminClient()

  // Verificar que el hijo pertenece al usuario (admin bypasses RLS)
  const { data: hijo } = await admin
    .from('hijos')
    .select('id')
    .eq('id', hijo_id)
    .eq('usuario_id', user.id)
    .maybeSingle()

  if (!hijo) return NextResponse.json({ error: 'Hijo no encontrado' }, { status: 404 })

  const { error, data: updated } = await admin
    .from('usuarios')
    .update({ hijo_activo_id: hijo_id } as never)
    .eq('id', user.id)
    .select('id, hijo_activo_id')

  console.log('[seleccionar-hijo] updated:', updated, '| error:', error)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const response = NextResponse.json({ ok: true })
  response.cookies.set('hijo_activo_id', hijo_id, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })
  return response
}
