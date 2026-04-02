import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'
import { PRODUCTOS } from '@/lib/productos'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-02-25.clover' })
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook inválido' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const email = session.customer_details?.email
  const nombre = session.customer_details?.name ?? null
  const productoId = (session.metadata?.producto_id ?? 'metodo_nutripeques') as keyof typeof PRODUCTOS
  const producto = PRODUCTOS[productoId] ?? PRODUCTOS['metodo_nutripeques']

  if (!email) {
    return NextResponse.json({ error: 'Sin email' }, { status: 400 })
  }

  const admin = createAdminClient()

  console.log('[webhook] email:', email, '| nombre:', nombre)

  // Verificar si ya existe el usuario
  const { data: existing, error: listError } = await admin.auth.admin.listUsers({ perPage: 1000 })
  if (listError) console.error('[webhook] listUsers error:', listError)
  const yaExiste = existing?.users.some(u => u.email === email) ?? false
  console.log('[webhook] yaExiste:', yaExiste)

  let userId: string

  if (yaExiste) {
    // Ya existe — actualizar productos_activos y reenviar el link de acceso
    const { data: userList } = await admin.auth.admin.listUsers({ perPage: 1000 })
    const existingUser = userList?.users.find(u => u.email === email)
    if (!existingUser) return NextResponse.json({ received: true })
    userId = existingUser.id
    console.log('[webhook] usuario existente, actualizando productos_activos y reenviando magic link')

    // Fetch current productos_activos and append the new product if not already present
    const { data: usuarioActual } = await (admin.from('usuarios') as ReturnType<typeof admin.from>)
      .select('productos_activos')
      .eq('id', userId)
      .maybeSingle() as unknown as { data: { productos_activos: string[] } | null }

    const productosActuales: string[] = (usuarioActual as { productos_activos: string[] } | null)?.productos_activos ?? []
    if (!productosActuales.includes(productoId)) {
      const { error: updateError } = await (admin.from('usuarios') as ReturnType<typeof admin.from>).update({
        productos_activos: [...productosActuales, productoId],
      } as never).eq('id', userId)
      if (updateError) console.error('[webhook] update productos_activos error:', updateError)
    }
  } else {
    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
    })

    if (authError || !authData.user) {
      console.error('[webhook] Error creando usuario:', authError)
      return NextResponse.json({ error: 'No se pudo crear usuario' }, { status: 500 })
    }

    userId = authData.user.id
    console.log('[webhook] usuario creado:', userId)

    // Insertar en tabla usuarios
    const { error: insertError } = await (admin.from('usuarios') as ReturnType<typeof admin.from>).insert({
      id: userId,
      email,
      nombre,
      fecha_compra: new Date().toISOString(),
      productos_activos: [productoId],
      monto_pago: session.amount_total ?? null,
    } as never)
    if (insertError) console.error('[webhook] insert usuarios error:', insertError)
  }

  // Generar magic link para acceso directo al dashboard
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard` },
  })
  if (linkError) console.error('[webhook] generateLink error:', linkError)

  const accessLink = linkData?.properties?.action_link ?? `${process.env.NEXT_PUBLIC_APP_URL}/login`
  console.log('[webhook] accessLink generado:', accessLink ? 'OK' : 'FALLIDO')

  // Build email content based on product
  const esCompleto = productoId === 'metodo_nutripeques'
  const emailSubject = esCompleto
    ? '🥕 ¡Bienvenida al Método NutriPeques! Tu acceso está listo'
    : `${producto.emoji} Tu ${producto.nombre} está lista — accede ahora`

  const emailBody = esCompleto
    ? `Tu compra fue exitosa. Ya tienes acceso completo al <strong>Método NutriPeques</strong> — la guía definitiva de alimentación complementaria.`
    : `Tu compra fue exitosa. Ya tienes acceso a <strong>${producto.emoji} ${producto.nombre}</strong>. Encuentra tu recurso en la sección "Mis recursos" dentro del dashboard.`

  const ctaText = esCompleto
    ? 'Crear mi contraseña y entrar →'
    : `Acceder a mi ${producto.nombre} →`

  // Enviar email de bienvenida con el link de acceso
  const { data: sentEmail, error: sendErr } = await resend.emails.send({
    from: `NutriPeques <${process.env.RESEND_FROM_EMAIL}>`,
    to: email,
    subject: emailSubject,
    html: `
      <div style="font-family:'Outfit',Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 20px;background:#fff;">
        <div style="text-align:center;margin-bottom:28px;">
          <img src="${process.env.NEXT_PUBLIC_APP_URL}/assets/logo.png" alt="NutriPeques" style="height:48px;" />
        </div>
        <h1 style="font-size:26px;color:#1f2937;margin-bottom:8px;">¡Felicidades${nombre ? `, ${nombre.split(' ')[0]}` : ''}! 🎉</h1>
        <p style="color:#374151;font-size:16px;line-height:1.7;">
          ${emailBody}
        </p>

        <div style="background:#FFF7ED;border-left:4px solid #F4A340;border-radius:8px;padding:16px 20px;margin:24px 0;">
          <p style="margin:0;color:#92400E;font-size:14px;font-weight:600;">📌 Importante</p>
          <p style="margin:8px 0 0;color:#78350F;font-size:14px;">
            Haz clic en el botón de abajo para crear tu contraseña y acceder a tu área exclusiva. El enlace es válido por 24 horas.
          </p>
        </div>

        <div style="text-align:center;margin:28px 0;">
          <a href="${accessLink}" style="background:linear-gradient(135deg,#F4A340,#E8821A);color:white;padding:16px 36px;border-radius:50px;text-decoration:none;font-size:17px;font-weight:700;display:inline-block;">
            ${ctaText}
          </a>
        </div>

        <p style="color:#6b7280;font-size:13px;text-align:center;margin-top:24px;">
          ¿Problemas? <a href="https://wa.me/5212225067864" style="color:#E8821A;font-weight:600;">Escríbenos por WhatsApp 💬</a>
        </p>
      </div>
    `,
  })

  console.log('[webhook] email enviado:', sentEmail?.id ?? null, '| error:', sendErr)

  return NextResponse.json({ received: true })
}
