export default function AccesoBloqueado() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Fredoka:wght@400;500;600&display=swap" rel="stylesheet" />

      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#fff7ed,#f0fdfa)', fontFamily: "'Outfit',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ background: 'white', borderRadius: 28, boxShadow: '0 8px 48px rgba(0,0,0,.10)', padding: '52px 44px', maxWidth: 500, width: '100%', textAlign: 'center', border: '1px solid #fed7aa' }}>

          {/* Lock icon */}
          <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg,#FFF7ED,#FFEDD5)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, margin: '0 auto 28px', border: '2px solid #FED7AA' }}>
            🔒
          </div>

          {/* Badge */}
          <div style={{ display: 'inline-block', background: '#FFF7ED', color: '#E8821A', borderRadius: 50, padding: '5px 18px', fontSize: 12, fontWeight: 700, letterSpacing: 0.5, marginBottom: 20 }}>
            SECCIÓN EXCLUSIVA DEL PLAN COMPLETO
          </div>

          <h1 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 28, fontWeight: 600, color: '#1f2937', margin: '0 0 14px', lineHeight: 1.3 }}>
            Esta sección requiere el Método NutriPeques completo
          </h1>

          <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.8, margin: '0 0 28px' }}>
            Tu plan actual solo incluye acceso a los recursos de tu guía. Actualiza al plan completo por <strong style={{ color: '#1f2937' }}>$299 MXN</strong> — pago único, acceso de por vida — y desbloquea todo:
          </p>

          {/* Features list */}
          <div style={{ background: '#f8fafc', borderRadius: 18, padding: '20px 24px', marginBottom: 32, textAlign: 'left' }}>
            {[
              '🤖 Buscador IA ilimitado',
              '📅 Menú semanal personalizado',
              '📓 Bitácora del bebé',
              '📊 Texturas y etapas',
              '⚠️ Plan de alérgenos',
              '🎂 Ideas de cumpleaños',
              '🔄 Sustitutos de ingredientes',
              '📚 10 guías PDF descargables',
            ].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid #f3f4f6', fontSize: 14, color: '#374151', fontWeight: 500 }}>
                <span style={{ color: '#0d9488', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>✓</span>
                {f}
              </div>
            ))}
          </div>

          {/* CTA button */}
          <a
            href="/api/checkout?producto=metodo_nutripeques"
            style={{ display: 'block', background: 'linear-gradient(135deg,#F4A340,#E8821A)', color: 'white', padding: '18px 32px', borderRadius: 50, fontFamily: "'Fredoka',sans-serif", fontSize: 20, fontWeight: 700, textDecoration: 'none', boxShadow: '0 6px 24px rgba(244,163,64,.35)', marginBottom: 16, letterSpacing: '.2px' }}
          >
            🌟 Actualizar al plan completo — $299 MXN
          </a>

          <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 24px' }}>
            Pago único · Sin mensualidades · Garantía 7 días
          </p>

          {/* Back link */}
          <a
            href="/dashboard"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6b7280', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}
          >
            ← Volver al dashboard
          </a>
        </div>
      </div>
    </>
  )
}
