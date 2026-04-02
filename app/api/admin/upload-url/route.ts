import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'nutripequespro@gmail.com') return null
  return user
}

export async function POST(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { tipo, ext } = await req.json()
  const carpeta = tipo === 'imagen' ? 'imagenes' : 'pdfs'
  const fileName = `${carpeta}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const admin = createAdminClient()

  // Crear bucket si no existe
  const { data: buckets } = await admin.storage.listBuckets()
  if (!buckets?.some(b => b.name === 'recursos')) {
    await admin.storage.createBucket('recursos', { public: true })
  }

  const { data, error } = await admin.storage.from('recursos').createSignedUploadUrl(fileName)
  if (error) {
    console.error('[upload-url]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: { publicUrl } } = admin.storage.from('recursos').getPublicUrl(data.path)
  return NextResponse.json({ token: data.token, path: data.path, publicUrl })
}
