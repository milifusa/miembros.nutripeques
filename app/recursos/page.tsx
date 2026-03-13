import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recursos que te recomiendo | NutriPeques Pro',
  description: 'Productos que usamos en casa para la alimentación complementaria del bebé. Platos BLW, cubiertos, bandejas y más.',
}

const HOTMART_URL = 'https://hotm.io/x7hSCoK'

const PRODUCTOS = [
  {
    id: 'munchkin_taza',
    href: 'https://amzn.to/4aFwhWj',
    img: 'https://m.media-amazon.com/images/I/61dNH2pzRpL._AC_SL400_.jpg',
    titulo: 'Munchkin Miracle 360 — Taza de entrenamiento',
    desc: 'Taza de entrenamiento de 7 onzas (2 piezas). Diseño que permite beber desde cualquier borde, ideal para la transición del biberón al vaso.',
  },
  {
    id: 'evenflo_multiprocesador',
    href: 'https://amzn.to/4rUOQNm',
    img: 'https://m.media-amazon.com/images/I/51SKMO8ADhL._AC_SL400_.jpg',
    titulo: 'Advanced by Evenflo — Multiprocesador 4 en 1',
    desc: 'Cocina y descongela al vapor, licúa para papillas y esteriliza biberones. Todo en uno conservando los nutrientes.',
  },
  {
    id: 'lictin_babero',
    href: 'https://amzn.to/40hCkM3',
    img: 'https://m.media-amazon.com/images/I/81UcxqChXuL._AC_SL400_.jpg',
    titulo: 'Lictin — Babero con mangas impermeable (5 pzs)',
    desc: 'Babero de manga larga con escote ajustable. Impermeable, fácil de limpiar. Set de 5 piezas para proteger la ropa durante las comidas.',
  },
  {
    id: 'uchef_platos',
    href: 'https://amzn.to/4rtiucQ',
    img: 'https://m.media-amazon.com/images/I/51Udj5xXW0L._AC_SL400_.jpg',
    titulo: 'U Chef — Juego de 3 Platos con Ventosa',
    desc: 'Platos de silicona con divisiones y ventosa antiderrapante. Sin BPA, aptos para microondas y lavavajillas. Ideales para BLW.',
  },
]

const SOCIAL = [
  { href: 'https://www.facebook.com/nutripequespro', label: 'Facebook', color: 'rgba(255,255,255,.6)', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
  { href: 'https://www.instagram.com/nutri.pequespro', label: 'Instagram', color: 'rgba(255,255,255,.6)', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
  { href: 'https://www.tiktok.com/@nutri.pequespro', label: 'TikTok', color: 'rgba(255,255,255,.6)', path: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z' },
  { href: 'https://wa.me/522225067864', label: 'WhatsApp', color: '#4ade80', path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z' },
]

const WA_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z'

export default function RecursosPage() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Fredoka:wght@400;500;600&display=swap" rel="stylesheet" />

      <style>{`
        .resource-card { transition: transform .25s, box-shadow .25s, border-color .25s; }
        .resource-card:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(244,163,64,.25); border-color: #F4A340; }
        .resource-card:hover .resource-img { transform: scale(1.05); }
        .resource-img { transition: transform .3s; width: 100%; height: 100%; object-fit: cover; }
        .resource-btn { transition: background .2s; }
        .resource-card:hover .resource-btn { background: #E8821A; }
        @keyframes wapulse { 0%,100%{box-shadow:0 4px 20px rgba(34,197,94,.5)} 50%{box-shadow:0 4px 35px rgba(34,197,94,.85)} }
        .wa-fab { animation: wapulse 2.5s infinite; transition: transform .2s; }
        .wa-fab:hover { transform: scale(1.12); }
      `}</style>

      {/* ─── HEADER ─── */}
      <header style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,.08)', position: 'sticky', top: 0, zIndex: 999, fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 90 }}>
          <a href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.png" alt="NutriPeques Pro" style={{ height: 70, objectFit: 'contain' }} />
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a href="/" style={{ textDecoration: 'none', color: '#6b7280', fontSize: 14, fontWeight: 500 }}>Inicio</a>
            {SOCIAL.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} style={{ color: s.color === 'rgba(255,255,255,.6)' ? '#6b7280' : s.color, display: 'flex' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
              </a>
            ))}
            <a href={HOTMART_URL} target="_blank" rel="noreferrer"
              style={{ background: '#F4A340', color: 'white', padding: '10px 22px', borderRadius: 50, fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
              Adquirir ahora 🛒
            </a>
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <div style={{ background: 'linear-gradient(135deg,#F4A340,#0d9488)', color: 'white', padding: '60px 20px 50px', textAlign: 'center', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h1 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 'clamp(28px,4vw,44px)', marginBottom: 12 }}>🛒 Recursos que te recomiendo</h1>
          <p style={{ fontSize: 17, opacity: .9, maxWidth: 620, margin: '0 auto 8px', lineHeight: 1.7 }}>
            Productos que usamos en casa para la alimentación complementaria de Max. Si te interesan, aquí los comparto para facilitarte el día a día 💚
          </p>
          <p style={{ fontSize: 13, opacity: .7, marginTop: 12 }}>
            * Algunos links son de afiliado Amazon. El precio es el mismo para ti — solo es una forma de apoyar el contenido gratuito que comparto 🌿
          </p>
        </div>
      </div>

      {/* ─── CONTENIDO ─── */}
      <main style={{ background: '#fafafa', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#0d9488', fontWeight: 600, fontSize: 14, textDecoration: 'none', margin: '28px 0 8px' }}>
            ← Volver al inicio
          </a>

          {/* Grid de productos */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 24, margin: '32px 0 60px' }}>
            {PRODUCTOS.map(p => (
              <a key={p.id} href={p.href} target="_blank" rel="noreferrer sponsored"
                className="resource-card"
                style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,.08)', textDecoration: 'none', color: '#1f2937', display: 'flex', flexDirection: 'column', border: '2px solid transparent' }}>
                <div style={{ width: '100%', aspectRatio: '1', overflow: 'hidden', background: '#FFF7ED' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.titulo} className="resource-img" loading="lazy" />
                </div>
                <div style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <h3 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 17, color: '#1f2937', lineHeight: 1.3 }}>{p.titulo}</h3>
                  <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, flex: 1 }}>{p.desc}</p>
                  <span className="resource-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#F4A340', color: 'white', padding: '9px 18px', borderRadius: 50, fontSize: 13, fontWeight: 600, marginTop: 4, width: 'fit-content' }}>
                    Ver en Amazon →
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* CTA Método */}
          <div style={{ background: 'linear-gradient(135deg,#FFF7ED,#CCFBF1)', borderRadius: 24, padding: 40, textAlign: 'center', marginBottom: 60, border: '2px solid #F4A340' }}>
            <p style={{ fontSize: 13, color: '#E8821A', fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>🌿 OFERTA DE LANZAMIENTO</p>
            <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 28, marginBottom: 12, color: '#1f2937' }}>¿Ya tienes el Método NutriPeques? 🥄</h2>
            <p style={{ color: '#6b7280', fontSize: 16, marginBottom: 20, maxWidth: 500, margin: '0 auto 20px', lineHeight: 1.7 }}>
              Guía principal + 9 bonos exclusivos para iniciar la AC con confianza desde los 6 meses.
            </p>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 18, textDecoration: 'line-through', color: '#9ca3af', marginRight: 10 }}>$1,000 MXN</span>
              <span style={{ fontSize: 36, fontFamily: "'Fredoka',sans-serif", color: '#E8821A', fontWeight: 700 }}>$197 MXN</span>
            </div>
            <a href={HOTMART_URL} target="_blank" rel="noreferrer"
              style={{ display: 'inline-block', background: 'linear-gradient(135deg,#F4A340,#E8821A)', color: 'white', padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: 16, textDecoration: 'none', boxShadow: '0 4px 15px rgba(232,130,26,.4)' }}>
              🛒 Quiero el Método NutriPeques — $197 MXN
            </a>
            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 10 }}>Cupón: <strong style={{ color: '#E8821A' }}>LANZAMIENTO</strong> · Acceso inmediato · Pago único</p>
          </div>
        </div>
      </main>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: '#1f2937', color: 'white', padding: '40px 0', textAlign: 'center', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.png" alt="NutriPeques Pro" style={{ height: 50, filter: 'brightness(10)', objectFit: 'contain', marginBottom: 20 }} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 20 }}>
            <a href="/" style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, textDecoration: 'none' }}>Inicio</a>
            <a href={HOTMART_URL} target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, textDecoration: 'none' }}>Adquirir el Método</a>
            <a href="/login" style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, textDecoration: 'none' }}>Área de miembros</a>
            <a href="mailto:nutripequespro@gmail.com" style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, textDecoration: 'none' }}>Contacto</a>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
            {SOCIAL.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} style={{ color: s.color, display: 'flex' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
              </a>
            ))}
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.4)' }}>© NutriPeques Pro — Liliana, Nutrióloga · Alimentación infantil saludable 🌿</p>
        </div>
      </footer>

      {/* ─── WhatsApp flotante ─── */}
      <a href="https://wa.me/522225067864?text=Hola%20Liliana!%20Vi%20la%20página%20de%20recursos%20y%20tengo%20una%20pregunta%20🌿"
        target="_blank" rel="noreferrer" aria-label="WhatsApp" className="wa-fab"
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999, background: '#22c55e', color: 'white', width: 58, height: 58, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="white"><path d={WA_PATH} /></svg>
      </a>
    </>
  )
}
