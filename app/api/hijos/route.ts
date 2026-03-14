import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

type DB = ReturnType<Awaited<ReturnType<typeof createClient>>['from']>

function tb(supabase: Awaited<ReturnType<typeof createClient>>, table: string): DB {
  return supabase.from(table) as unknown as DB
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data, error } = await tb(supabase, 'hijos')
    .select('*')
    .eq('usuario_id', user.id)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: (error as { message: string }).message }, { status: 500 })
  return NextResponse.json({ hijos: data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { nombre, fecha_nacimiento } = await request.json()
  if (!nombre?.trim()) return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
  if (!fecha_nacimiento) return NextResponse.json({ error: 'La fecha de nacimiento es requerida' }, { status: 400 })

  // Garantizar fila en usuarios usando admin client (bypasa RLS de INSERT)
  const admin = createAdminClient()
  await admin.from('usuarios').upsert(
    { id: user.id, email: user.email!, fecha_compra: new Date().toISOString() } as never,
    { onConflict: 'id', ignoreDuplicates: true }
  )

  const { data, error } = await tb(supabase, 'hijos')
    .insert({ usuario_id: user.id, nombre: nombre.trim(), fecha_nacimiento } as never)
    .select()
    .single()

  if (error) return NextResponse.json({ error: (error as { message: string }).message }, { status: 500 })

  const hijo = data as { id: string }

  // Si es el primer hijo, seleccionarlo automáticamente
  const { data: lista } = await tb(supabase, 'hijos')
    .select('id')
    .eq('usuario_id', user.id)

  if (lista && (lista as unknown[]).length === 1) {
    await admin.from('usuarios')
      .update({ hijo_activo_id: hijo.id } as never)
      .eq('id', user.id)
  }

  return NextResponse.json({ hijo: data })
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Falta ID' }, { status: 400 })

  const { nombre, fecha_nacimiento } = await request.json()
  if (!nombre?.trim()) return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
  if (!fecha_nacimiento) return NextResponse.json({ error: 'La fecha de nacimiento es requerida' }, { status: 400 })

  const { data, error } = await tb(supabase, 'hijos')
    .update({ nombre: nombre.trim(), fecha_nacimiento } as never)
    .eq('id', id)
    .eq('usuario_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: (error as { message: string }).message }, { status: 500 })
  return NextResponse.json({ hijo: data })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Falta ID' }, { status: 400 })

  const { error } = await tb(supabase, 'hijos')
    .delete()
    .eq('id', id)
    .eq('usuario_id', user.id)

  if (error) return NextResponse.json({ error: (error as { message: string }).message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
