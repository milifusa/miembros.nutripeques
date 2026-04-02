'use client'

export default function HeroImage() {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{ position: 'absolute', inset: -6, borderRadius: '40% 60% 55% 45% / 45% 45% 55% 55%', background: 'linear-gradient(135deg,#F4A340,#0d9488)', opacity: .18, zIndex: 0 }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/mamamax.jpg"
        alt="Liliana — Nutrióloga pediátrica NutriPeques"
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420, borderRadius: '40% 60% 55% 45% / 45% 45% 55% 55%', objectFit: 'cover', aspectRatio: '4/5', boxShadow: '0 24px 64px rgba(232,130,26,.25)' }}
        onError={(e) => {
          const img = e.target as HTMLImageElement
          img.src = '/assets/mamamax.jpg'
          img.style.borderRadius = '50%'
          img.style.maxWidth = '320px'
        }}
      />
    </div>
  )
}
