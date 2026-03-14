import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data, error } = await supabase
    .from('bitacora_bebe')
    .select('*')
    .eq('usuario_id', user.id)
    .order('fecha_introduccion', { ascending: false })

  if (error) return NextResponse.json({ error: 'Error al cargar' }, { status: 500 })
  return NextResponse.json({ entradas: data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const { alimento, fecha_introduccion, reaccion, aceptacion, notas } = body

  if (!alimento?.trim() || !fecha_introduccion || !reaccion) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }
  if (!['ninguna', 'leve', 'moderada'].includes(reaccion)) {
    return NextResponse.json({ error: 'Reacción inválida' }, { status: 400 })
  }
  const acep = parseInt(aceptacion ?? '3', 10)
  if (isNaN(acep) || acep < 1 || acep > 5) {
    return NextResponse.json({ error: 'Aceptación inválida (1-5)' }, { status: 400 })
  }

  // Obtener hijo activo desde cookie
  const cookieStore = await cookies()
  const hijoActivoId = cookieStore.get('hijo_activo_id')?.value ?? null

  // Verificar que el hijo pertenece al usuario
  let hijoId: string | null = null
  if (hijoActivoId) {
    const { data: hijosData } = await supabase
      .from('hijos')
      .select('id')
      .eq('usuario_id', user.id)
      .order('created_at', { ascending: true })
    const hijos = (hijosData ?? []) as { id: string }[]
    const match = hijos.find(h => h.id === hijoActivoId) ?? hijos[0] ?? null
    hijoId = match?.id ?? null
  } else {
    const { data: hijosData } = await supabase
      .from('hijos')
      .select('id')
      .eq('usuario_id', user.id)
      .order('created_at', { ascending: true })
      .limit(1)
    hijoId = ((hijosData ?? [])[0] as { id: string } | undefined)?.id ?? null
  }

  const admin = createAdminClient()
  const { data, error } = await (admin.from('bitacora_bebe') as ReturnType<typeof admin.from>)
    .insert({
      usuario_id: user.id,
      hijo_id: hijoId,
      alimento: alimento.trim(),
      fecha_introduccion,
      reaccion,
      aceptacion: acep,
      notas: notas?.trim() || null,
    } as never)
    .select()
    .single()

  if (error) {
    console.error('[bitacora POST] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ entrada: data })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Falta ID' }, { status: 400 })

  const { error } = await supabase
    .from('bitacora_bebe')
    .delete()
    .eq('id', id)
    .eq('usuario_id', user.id)

  if (error) return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
