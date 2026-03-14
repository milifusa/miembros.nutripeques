import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-02-25.clover' })

export default async function PagoExitosoPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams

  let email = ''
  let nombre = ''
  let valido = false

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id)
      if (session.payment_status === 'paid') {
        valido = true
        email = session.customer_details?.email ?? ''
        nombre = session.customer_details?.name?.split(' ')[0] ?? 'mamá'
      }
    } catch {
      // session inválida
    }
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Fredoka:wght@400;500;600&display=swap" rel="stylesheet" />

      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#FFFBF5,#CCFBF1)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ background: 'white', borderRadius: 28, padding: '48px 40px', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,.1)' }}>

          {valido ? (
            <>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
              <h1 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 30, color: '#1f2937', margin: '0 0 12px' }}>
                ¡Pago exitoso{nombre ? `, ${nombre}` : ''}!
              </h1>
              <p style={{ color: '#6b7280', fontSize: 16, lineHeight: 1.7, margin: '0 0 24px' }}>
                Tu compra del <strong>Método NutriPeques</strong> fue confirmada. Revisa tu correo{email ? ` (${email})` : ''} — te enviamos un enlace para crear tu contraseña y acceder.
              </p>
              <div style={{ background: '#FFF7ED', borderRadius: 16, padding: '16px 20px', marginBottom: 28, textAlign: 'left' }}>
                <p style={{ margin: 0, fontSize: 14, color: '#92400E', fontWeight: 600 }}>📌 Siguiente paso</p>
                <p style={{ margin: '6px 0 0', fontSize: 14, color: '#78350F', lineHeight: 1.6 }}>
                  Abre el correo de NutriPeques y haz clic en "Crear mi contraseña". El enlace caduca en 24 horas.
                </p>
              </div>
              <a href="/login" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#F4A340,#E8821A)', color: 'white', padding: '14px 32px', borderRadius: 50, fontFamily: "'Fredoka',sans-serif", fontSize: 17, fontWeight: 600, textDecoration: 'none' }}>
                Ir al inicio de sesión →
              </a>
            </>
          ) : (
            <>
              <div style={{ fontSize: 64, marginBottom: 16 }}>⚠️</div>
              <h1 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 26, color: '#1f2937', margin: '0 0 12px' }}>
                No encontramos tu pago
              </h1>
              <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.7, margin: '0 0 24px' }}>
                Si acabas de pagar, revisa tu correo en unos minutos. Si el problema persiste escríbenos.
              </p>
              <a href="/" style={{ display: 'inline-block', background: '#f3f4f6', color: '#374151', padding: '13px 28px', borderRadius: 50, fontFamily: "'Fredoka',sans-serif", fontSize: 16, fontWeight: 600, textDecoration: 'none' }}>
                Volver al inicio
              </a>
            </>
          )}

        </div>
      </div>
    </>
  )
}
