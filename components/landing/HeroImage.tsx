'use client'

export default function HeroImage() {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{ position: 'absolute', inset: -6, borderRadius: '40% 60% 55% 45% / 45% 45% 55% 55%', background: 'linear-gradient(135deg,#F4A340,#0d9488)', opacity: .18, zIndex: 0 }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/hero.jpg"
        alt="Liliana — Nutrióloga pediátrica NutriPeques"
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420, borderRadius: '40% 60% 55% 45% / 45% 45% 55% 55%', objectFit: 'cover', aspectRatio: '4/5', boxShadow: '0 24px 64px rgba(232,130,26,.25)' }}
        onError={(e) => {
          const img = e.target as HTMLImageElement
          img.src = '/assets/perfil.jpg'
          img.style.borderRadius = '50%'
          img.style.maxWidth = '320px'
        }}
      />
      <div style={{ position: 'absolute', bottom: 16, right: -16, zIndex: 2, background: 'white', borderRadius: 20, padding: '10px 18px', boxShadow: '0 8px 24px rgba(0,0,0,.12)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 24 }}>👶</span>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1f2937' }}>+100k familias</p>
          <p style={{ margin: 0, fontSize: 11, color: '#6b7280' }}>confían en NutriPeques</p>
        </div>
      </div>
    </div>
  )
}
