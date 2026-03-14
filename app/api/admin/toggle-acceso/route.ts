import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { usuario_id, activar } = await request.json()
  if (!usuario_id) return NextResponse.json({ error: 'Falta usuario_id' }, { status: 400 })

  const admin = createAdminClient()
  const { error } = await admin.auth.admin.updateUserById(usuario_id, {
    ban_duration: activar ? 'none' : '876000h',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
