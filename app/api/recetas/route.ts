import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ recetas: [] })

  try {
    const cookieStore = await cookies()
    const hijoId = cookieStore.get('hijo_activo_id')?.value ?? null

    let query = (supabase.from('recetas_guardadas') as ReturnType<typeof supabase.from>)
      .select('*')
      .eq('usuario_id', user.id)
      .order('created_at', { ascending: false })

    if (hijoId) query = (query as ReturnType<typeof supabase.from>).eq('hijo_id', hijoId)

    const { data } = await query
    return NextResponse.json({ recetas: data ?? [] })
  } catch {
    return NextResponse.json({ recetas: [] })
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()

  try {
    const { data, error } = await (supabase.from('recetas_guardadas') as ReturnType<typeof supabase.from>)
      .insert({ usuario_id: user.id, ...body } as never)
      .select()
      .single()

    if (error) return NextResponse.json({ error: (error as { message: string }).message }, { status: 500 })
    return NextResponse.json({ receta: data })
  } catch {
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Falta ID' }, { status: 400 })

  await (supabase.from('recetas_guardadas') as ReturnType<typeof supabase.from>)
    .delete()
    .eq('id', id)
    .eq('usuario_id', user.id)

  return NextResponse.json({ ok: true })
}
