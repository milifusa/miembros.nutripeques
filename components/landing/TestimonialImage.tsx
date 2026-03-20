'use client'

interface Props {
  src: string
  name: string
}

export default function TestimonialImage({ src, name }: Props) {
  return (
    <div style={{ position: 'relative', background: '#075E54', minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`Testimonio de ${name}`}
        style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: 220 }}
        onError={(e) => {
          const el = e.currentTarget
          el.style.display = 'none'
          const parent = el.parentElement!
          parent.innerHTML = `<div style="padding:24px;text-align:center;color:rgba(255,255,255,.7);font-size:13px;font-family:Outfit,sans-serif"><div style="font-size:32px;margin-bottom:8px">📱</div><p style="margin:0">Agrega aquí una captura<br/>real de WhatsApp o DM<br/><strong style="color:white">${src}</strong></p></div>`
        }}
      />
      <div style={{ position: 'absolute', top: 8, right: 8, background: '#25D366', color: 'white', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>WhatsApp ✓✓</div>
    </div>
  )
}
