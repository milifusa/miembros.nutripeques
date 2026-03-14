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

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const tipo = (formData.get('tipo') as string) || 'pdf' // 'pdf' | 'imagen'

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const ext = file.name.split('.').pop()
  const carpeta = tipo === 'imagen' ? 'imagenes' : 'pdfs'
  const fileName = `${carpeta}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const admin = createAdminClient()

  // Crear bucket si no existe
  const { data: buckets } = await admin.storage.listBuckets()
  const bucketExiste = buckets?.some(b => b.name === 'recursos')
  if (!bucketExiste) {
    const { error: createErr } = await admin.storage.createBucket('recursos', { public: true })
    if (createErr) {
      console.error('[upload] error creando bucket:', createErr)
      return NextResponse.json({ error: 'No se pudo crear el bucket: ' + createErr.message }, { status: 500 })
    }
  }

  const { data, error } = await admin.storage
    .from('recursos')
    .upload(fileName, buffer, { contentType: file.type, upsert: false })

  if (error) {
    console.error('[upload] error subiendo archivo:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: { publicUrl } } = admin.storage.from('recursos').getPublicUrl(data.path)
  return NextResponse.json({ url: publicUrl })
}
