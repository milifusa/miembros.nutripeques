import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClientRaw } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false }, { status: 401 })

  const body = await req.json() as { titulo: string; url?: string }
  const { titulo, url } = body
  if (!titulo) return NextResponse.json({ ok: false }, { status: 400 })

  const db = createAdminClientRaw()
  await db.from('descargas_recursos').insert({
    usuario_id: user.id,
    recurso_titulo: titulo,
    recurso_url: url ?? null,
  }).then(() => null, () => null)

  return NextResponse.json({ ok: true })
}
