import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? 'hola@nutripequespro.com'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'nutripequespro@gmail.com') return null
  return user
}

export async function POST() {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: usuarios, error } = await (admin as any)
    .from('usuarios')
    .select('email, nombre, productos_activos')
    .contains('productos_activos', ['metodo_nutripeques'])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!usuarios?.length) return NextResponse.json({ enviados: 0 })

  let enviados = 0
  const errores: string[] = []

  for (const u of usuarios) {
    const nombre = u.nombre?.split(' ')[0] ?? 'mamá'
    try {
      await resend.emails.send({
        from: `Liliana · NutriPeques <${FROM}>`,
        to: u.email,
        subject: '¿Ya exploraste todo lo que tienes en NutriPeques? 🌟',
        html: emailHtml(nombre),
      })
      enviados++
    } catch (e) {
      errores.push(`${u.email}: ${(e as Error).message}`)
    }
  }

  return NextResponse.json({ enviados, total: usuarios.length, errores })
}

function emailHtml(nombre: string) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tus beneficios NutriPeques</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:580px;margin:32px auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0D9488,#0F766E);padding:32px 36px;text-align:center;">
      <p style="margin:0;font-size:13px;color:rgba(255,255,255,.75);letter-spacing:1px;text-transform:uppercase;font-weight:600;">Método NutriPeques</p>
      <h1 style="margin:10px 0 0;color:white;font-size:26px;font-weight:700;line-height:1.3;">¿Ya exploraste todo lo que tienes, ${nombre}? 🌟</h1>
    </div>

    <!-- Body -->
    <div style="padding:32px 36px;">
      <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 20px;">
        Hola <strong>${nombre}</strong>, tengo el Método NutriPeques completo y quiero recordarte que tienes acceso a <strong>todos estos beneficios</strong> dentro de la plataforma:
      </p>

      <!-- Beneficios -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        ${[
          ['📅', 'Menú semanal', 'Plan de comidas adaptado a la edad exacta de tu bebé, semana a semana.'],
          ['🔍', 'Buscador IA', 'Pregunta sobre cualquier alimento y recibe respuestas personalizadas con inteligencia artificial.'],
          ['📚', 'Mis recursos', 'Todos los PDFs, guías y materiales exclusivos que puedes descargar cuando quieras.'],
          ['📓', 'Bitácora del bebé', 'Registra cada alimento nuevo, cómo reaccionó tu bebé y lleva un historial completo.'],
          ['📊', 'Texturas y etapas', 'Guía de progresión de texturas según la edad para hacer la AC de forma segura.'],
          ['⚠️', 'Plan de alérgenos', 'Calendario personalizado para introducir los alérgenos sin estrés.'],
          ['🎂', 'Ideas de cumpleaños', 'Pasteles y aperitivos saludables para celebrar el primer año de tu bebé.'],
          ['🔄', 'Sustitutos de ingredientes', '¿No tienes un ingrediente? Encuentra el reemplazo perfecto al instante.'],
        ].map(([icon, titulo, desc]) => `
        <tr>
          <td style="padding:10px 0;vertical-align:top;width:44px;">
            <div style="width:40px;height:40px;background:#F0FDFA;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;text-align:center;line-height:40px;">${icon}</div>
          </td>
          <td style="padding:10px 0 10px 12px;vertical-align:top;">
            <p style="margin:0 0 2px;font-weight:700;color:#1f2937;font-size:15px;">${titulo}</p>
            <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.5;">${desc}</p>
          </td>
        </tr>`).join('')}
      </table>

      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 28px;">
        Todo esto lo tienes disponible ahora mismo. Entra a la plataforma y sigue disfrutando una alimentación complementaria sin estrés. 💚
      </p>

      <!-- CTA -->
      <div style="text-align:center;margin-bottom:28px;">
        <a href="https://miembros.nutripequespro.com/dashboard"
           style="display:inline-block;background:linear-gradient(135deg,#E8821A,#F4A340);color:white;font-weight:700;font-size:16px;padding:15px 36px;border-radius:50px;text-decoration:none;box-shadow:0 6px 20px rgba(232,130,26,.35);">
          Entrar a mi plataforma →
        </a>
      </div>

      <p style="color:#9ca3af;font-size:13px;text-align:center;margin:0;">
        Con cariño,<br/>
        <strong style="color:#374151;">Liliana · Nutrióloga pediátrica NutriPeques</strong>
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;border-top:1px solid #f3f4f6;padding:20px 36px;text-align:center;">
      <p style="margin:0;color:#9ca3af;font-size:12px;">
        Recibiste este correo porque tienes el Método NutriPeques completo.<br/>
        <a href="https://miembros.nutripequespro.com" style="color:#0D9488;text-decoration:none;">miembros.nutripequespro.com</a>
      </p>
    </div>

  </div>
</body>
</html>`
}
