import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  // Verificar que quien llama es la admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { email, nombre, password } = await request.json()

  if (!email?.trim() || !password?.trim()) {
    return NextResponse.json({ error: 'Email y contraseña son obligatorios' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Crear usuario en Supabase Auth
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: email.trim(),
    password: password.trim(),
    email_confirm: true,
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  // Insertar en tabla usuarios
  const { error: dbError } = await (admin.from('usuarios') as ReturnType<typeof admin.from>).insert({
    id: authData.user.id,
    email: email.trim(),
    nombre: nombre?.trim() || null,
    fecha_compra: new Date().toISOString(),
    productos_activos: ['metodo_nutripeques'],
  } as never)

  if (dbError) {
    // Si falla la tabla, borrar el auth user para no dejar inconsistencia
    await admin.auth.admin.deleteUser(authData.user.id)
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  return NextResponse.json({ email: authData.user.email })
}
