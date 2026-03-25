import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { UrgencyCountdown, HeroCountdown } from '@/components/landing/CountdownTimer'
import FoodSearch from '@/components/landing/FoodSearch'
import HeroImage from '@/components/landing/HeroImage'

const CHECKOUT_URL = '/api/checkout'
const PRECIO = '$299 MXN'
const PRECIO_TACHADO = '$800 MXN'

// Mockup visual de pantalla de la plataforma
function AppScreen({ color1, color2, emoji, title, desc, tag }: {
  color1: string; color2: string; emoji: string; title: string; desc: string; tag: string
}) {
  return (
    <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,.1)', border: '1px solid #f3f4f6' }}>
      {/* Barra de navegación simulada */}
      <div style={{ background: '#1f2937', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
        <div style={{ flex: 1, background: '#374151', borderRadius: 6, height: 18, marginLeft: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', fontFamily: 'monospace' }}>miembros.nutripequespro.com</span>
        </div>
      </div>
      {/* Contenido de la pantalla */}
      <div style={{ background: `linear-gradient(135deg,${color1},${color2})`, padding: '28px 24px', textAlign: 'center', minHeight: 160 }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>{emoji}</div>
        <h4 style={{ color: 'white', fontFamily: "'Fredoka',sans-serif", fontSize: 18, margin: '0 0 6px', fontWeight: 700 }}>{title}</h4>
        <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>{desc}</p>
      </div>
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ background: '#f3f4f6', color: '#374151', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 600 }}>{tag}</span>
        <span style={{ color: '#0d9488', fontSize: 12, fontWeight: 600 }}>Incluido ✓</span>
      </div>
    </div>
  )
}

// Mockup visual de PDF
function PdfMockup({ color1, color2, emoji, title, subtitle, badge }: {
  color1: string; color2: string; emoji: string; title: string; subtitle: string; badge?: string
}) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 200, margin: '0 auto' }}>
      {badge && (
        <div style={{ position: 'absolute', top: -10, right: -10, background: '#E8821A', color: 'white', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, zIndex: 2, boxShadow: '0 2px 8px rgba(232,130,26,.5)' }}>
          {badge}
        </div>
      )}
      <div style={{ position: 'absolute', bottom: -6, left: 6, right: -6, height: '100%', background: 'rgba(0,0,0,.12)', borderRadius: 12 }} />
      <div style={{ position: 'absolute', bottom: -3, left: 3, right: -3, height: '100%', background: 'rgba(0,0,0,.08)', borderRadius: 12 }} />
      <div style={{ position: 'relative', background: `linear-gradient(145deg,${color1},${color2})`, borderRadius: 12, padding: '24px 18px 20px', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,.2)', minHeight: 180 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 10, background: 'rgba(0,0,0,.15)', borderRadius: '12px 0 0 12px' }} />
        <div style={{ fontSize: 40, marginBottom: 10 }}>{emoji}</div>
        <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', margin: '0 0 6px' }}>Método NutriPeques</p>
        <h4 style={{ color: 'white', fontFamily: "'Fredoka',sans-serif", fontSize: 15, fontWeight: 700, margin: '0 0 6px', lineHeight: 1.3 }}>{title}</h4>
        <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 10, margin: 0, lineHeight: 1.4 }}>{subtitle}</p>
        <div style={{ marginTop: 12, background: 'rgba(255,255,255,.2)', borderRadius: 6, padding: '3px 0', fontSize: 9, color: 'white', fontWeight: 600 }}>PDF DESCARGABLE</div>
      </div>
    </div>
  )
}

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Fredoka:wght@400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        @media (max-width: 768px) {
          .np-nav { display: none !important; }
          .np-urgency-extra { display: none !important; }
          .np-header-title { display: none !important; }
          .np-header { height: 60px !important; top: 36px !important; }
          .np-header img { height: 46px !important; }
          .np-hero-emotional { grid-template-columns: 1fr !important; }
          .np-hero-emotional-photo { max-width: 280px !important; margin: 0 auto; }
          .np-guia-grid { grid-template-columns: 1fr !important; }
          .np-guia-grid > div:first-child { max-width: 160px; margin: 0 auto; }
          .np-liliana-grid { grid-template-columns: 1fr !important; }
          .np-liliana-inner { padding: 32px 24px !important; }
          .np-valor-items { grid-template-columns: 1fr !important; }
          .np-bono-item { flex-direction: column !important; align-items: center !important; text-align: center; }
          .np-bono-item > div:first-child { width: 120px !important; margin: 0 auto 4px; }
        }
        @media (max-width: 480px) {
          .np-hero-section { padding: 36px 0 28px !important; }
          .np-big-section { padding: 52px 0 !important; }
          .np-cta-section { padding: 52px 0 !important; }
        }
      `}</style>

      {/* ─── URGENCY BAR ─── */}
      <div style={{ background: 'linear-gradient(90deg,#0d9488,#0f766e,#0d9488)', color: 'white', textAlign: 'center', padding: '9px 16px', fontSize: 14, fontWeight: 600, position: 'sticky', top: 0, zIndex: 1000, fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, flexWrap: 'nowrap' }}>
          <UrgencyCountdown />
          <span style={{ background: '#F4A340', color: 'white', padding: '3px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>
            🔥 {PRECIO} pago único
          </span>
          <span className="np-urgency-extra" style={{ opacity: .9, whiteSpace: 'nowrap' }}>Acceso completo de por vida</span>
        </div>
      </div>

      {/* ─── HEADER ─── */}
      <header className="np-header" style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,.08)', position: 'sticky', top: 42, zIndex: 999, fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 80 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.png" alt="NutriPeques Pro" style={{ height: 60, objectFit: 'contain' }} />
            <span className="np-header-title" style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 20, fontWeight: 600, color: '#1f2937' }}>Método NutriPeques</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="np-nav" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <a href="#plataforma" style={{ textDecoration: 'none', color: '#6b7280', fontSize: 14, fontWeight: 500 }}>La plataforma</a>
              <a href="#contenido" style={{ textDecoration: 'none', color: '#6b7280', fontSize: 14, fontWeight: 500 }}>Qué incluye</a>
              <a href="#sobre-liliana" style={{ textDecoration: 'none', color: '#6b7280', fontSize: 14, fontWeight: 500 }}>Sobre Liliana</a>
              <a href="#faq" style={{ textDecoration: 'none', color: '#6b7280', fontSize: 14, fontWeight: 500 }}>Preguntas</a>
              <a href="https://www.instagram.com/nutri.pequespro" target="_blank" rel="noreferrer" aria-label="Instagram" style={{ color: '#6b7280', display: 'flex' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://wa.me/522225067864" target="_blank" rel="noreferrer" aria-label="WhatsApp" style={{ color: '#22c55e', display: 'flex' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              </a>
              <a href="/login" style={{ textDecoration: 'none', color: '#6b7280', fontSize: 14, fontWeight: 500 }}>Área de miembros</a>
            </div>
            <a href="/login" style={{ textDecoration: 'none', color: '#6b7280', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
              Ya soy miembro →
            </a>
            <a href={CHECKOUT_URL}
              style={{ background: 'linear-gradient(135deg,#F4A340,#E8821A)', color: 'white', padding: '10px 22px', borderRadius: 50, fontWeight: 700, fontSize: 15, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Acceder ahora
            </a>
          </div>
        </div>
      </header>

      {/* ─── HERO EMOCIONAL ─── */}
      <section className="np-hero-section" style={{ background: 'linear-gradient(150deg,#FFF7ED 0%,#CCFBF1 60%,#FFFBF5 100%)', padding: '60px 0 50px', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <div className="np-hero-emotional" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            {/* Foto */}
            <div className="np-hero-emotional-photo" style={{ textAlign: 'center', position: 'relative' }}>
              <HeroImage />
            </div>
            {/* Texto */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', borderRadius: 50, padding: '6px 18px', boxShadow: '0 4px 16px rgba(0,0,0,.08)', marginBottom: 20 }}>
                <span style={{ fontSize: 16 }}>🥄</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0d9488', letterSpacing: '.5px' }}>MÉTODO NUTRIPEQUES · PLATAFORMA OFICIAL</span>
              </div>
              <h1 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: '#1f2937', lineHeight: 1.2, margin: '0 0 8px' }}>
                Deja de improvisar<br />
                qué darle a tu bebé
              </h1>
              <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 'clamp(17px,2.2vw,22px)', color: '#E8821A', fontWeight: 600, lineHeight: 1.4, margin: '0 0 20px' }}>
                Menús listos, buscador IA y guías de nutrióloga — todo en un solo lugar 🥄
              </p>
              <p style={{ fontSize: 16, color: '#6b7280', lineHeight: 1.75, margin: '0 0 28px' }}>
                Soy <strong style={{ color: '#1f2937' }}>Liliana</strong>, nutrióloga pediátrica. Creé esta plataforma para que sepas exactamente qué, cómo y cuándo darle a tu bebé — <strong style={{ color: '#0d9488' }}>sin buscar en Google, sin dudar, sin estrés</strong>.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                {['Menú semanal listo — sin improvisar cada día', 'Buscador IA: cualquier alimento, al instante', 'Guías PDF descargables con todo el método'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,#0d9488,#0f766e)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span style={{ fontSize: 15, color: '#374151', fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
              <a href={CHECKOUT_URL}
                style={{ display: 'inline-block', background: 'linear-gradient(135deg,#F4A340,#E8821A)', color: 'white', padding: '18px 40px', borderRadius: 50, fontFamily: "'Fredoka',sans-serif", fontSize: 20, fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 32px rgba(232,130,26,.4)', letterSpacing: '.3px' }}>
                Quiero acceso ahora — {PRECIO}
              </a>
              <p style={{ margin: '12px 0 0', fontSize: 13, color: '#9ca3af' }}>Precio normal {PRECIO_TACHADO} · Pago único · Acceso de por vida</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HERO — Buscador IA GRATUITO ─── */}
      <section style={{ background: 'linear-gradient(160deg,#FFFBF5 0%,#CCFBF1 50%,#FFF7ED 100%)', padding: '50px 0 40px', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'white', borderRadius: 50, padding: '8px 20px', boxShadow: '0 4px 16px rgba(0,0,0,.08)', marginBottom: 16 }}>
              <span style={{ fontSize: 20 }}>🌿</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0d9488', letterSpacing: '.5px' }}>HERRAMIENTA GRATUITA · NutriPeques Pro</span>
            </div>
            <h1 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 'clamp(28px,5vw,50px)', fontWeight: 700, color: '#1f2937', lineHeight: 1.2, marginBottom: 12 }}>
              Buscador Inteligente de<br />
              <span style={{ color: '#E8821A' }}>Alimentos para Bebés</span> 🥄
            </h1>
            <p style={{ fontSize: 17, color: '#6b7280', maxWidth: 520, margin: '0 auto 6px', lineHeight: 1.7 }}>
              Escribe cualquier alimento y la edad de tu bebé — te digo al instante si es seguro, cómo prepararlo y recetas fáciles 💚
            </p>
            <p style={{ fontSize: 13, color: '#0d9488', fontWeight: 600, margin: '0 auto' }}>
              Esta es solo una muestra de lo que vive tu bebé dentro de la plataforma completa 👇
            </p>
          </div>
          <FoodSearch />
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <a href="#plataforma" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6b7280', fontSize: 14, textDecoration: 'none', fontWeight: 600 }}>
              Ver todo lo que incluye la plataforma 👇
            </a>
          </div>
        </div>
      </section>

      {/* ─── ¿TE SUENA ESTO? ─── */}
      <section style={{ background: 'white', padding: '70px 0', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FEF2F2', borderRadius: 50, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: '#dc2626' }}>❤️ ¿TE IDENTIFICAS?</span>
          </div>
          <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 'clamp(24px,3.5vw,38px)', textAlign: 'center', marginBottom: 10, color: '#1f2937' }}>¿Alguna de estas situaciones te suena familiar?</h2>
          <p style={{ textAlign: 'center', fontSize: 17, color: '#6b7280', marginBottom: 36, maxWidth: 600, margin: '0 auto 36px' }}>Si te identificas con aunque sea una, el Método NutriPeques es exactamente para ti:</p>
          <div style={{ maxWidth: 800, margin: '0 auto 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 12 }}>
            {[
              'Tienes dudas sobre cómo alternar la leche con sus primeros alimentos.',
              'Quieres estar segura de que tu bebé come todos los nutrientes que necesita.',
              'Te quedas sin ideas a la hora de cocinar y siempre ofreces lo mismo.',
              'Quieres iniciar con sólidos pero te da miedo que se atragante.',
              'No tienes un calendario claro de qué alimentos introducir y cuándo.',
              'Te sientes confundida con tanta información contradictoria en redes.',
              'No sabes si tu bebé tiene alergia alimentaria o intolerancia.',
              'La hora de comer es un momento de estrés, no de disfrute.',
            ].map((item, i) => (
              <div key={i} style={{ background: '#FEF2F2', borderLeft: '4px solid #EF4444', padding: '14px 18px', borderRadius: '0 14px 14px 0', fontSize: 15, color: '#1f2937', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ flexShrink: 0, marginTop: 1 }}>❎</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', background: 'linear-gradient(135deg,#CCFBF1,#FFF7ED)', borderRadius: 24, padding: '32px 40px', maxWidth: 700, margin: '0 auto' }}>
            <p style={{ fontSize: 18, color: '#1f2937', lineHeight: 1.7, margin: '0 0 10px', fontWeight: 500 }}>
              Creamos la plataforma más completa para que dejes de buscar en todos lados y tengas todo lo que necesitas en un solo lugar — <strong>organizado, práctico y siempre disponible</strong>.
            </p>
            <p style={{ fontSize: 15, color: '#0d9488', fontWeight: 700, margin: 0 }}>
              🥑 Todo basado en guías OMS/OPS 2023 · Diseñado por una nutrióloga · Para bebés de 6 meses a 2 años 🌎
            </p>
          </div>
        </div>
      </section>

      {/* ─── LA PLATAFORMA ─── */}
      <section id="plataforma" style={{ background: '#FAFAFA', padding: '80px 0', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <span style={{ display: 'inline-block', background: 'linear-gradient(135deg,#0d9488,#0f766e)', color: 'white', borderRadius: 50, padding: '6px 20px', fontSize: 13, fontWeight: 700 }}>💻 PLATAFORMA DIGITAL COMPLETA</span>
          </div>
          <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 'clamp(24px,3.5vw,42px)', textAlign: 'center', marginBottom: 12, color: '#1f2937', lineHeight: 1.2 }}>
            No es solo una guía.<br />
            <span style={{ color: '#0d9488' }}>Es tu plataforma de nutrición para siempre.</span>
          </h2>
          <p style={{ textAlign: 'center', fontSize: 16, color: '#6b7280', maxWidth: 640, margin: '0 auto 52px', lineHeight: 1.8 }}>
            Con tu acceso único obtienes una plataforma completa con herramientas interactivas, guías descargables y todo el contenido de Liliana — disponible 24/7 desde cualquier dispositivo.
          </p>

          {/* Herramientas de la plataforma */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24, marginBottom: 52 }}>
            <AppScreen
              color1="#0f766e" color2="#0d9488"
              emoji="🤖" title="Buscador IA Ilimitado"
              desc="Consulta cualquier alimento al instante. Seguridad, preparación, nutrientes y recetas adaptadas a la edad de tu bebé."
              tag="IA · Ilimitado"
            />
            <AppScreen
              color1="#E8821A" color2="#F4A340"
              emoji="📅" title="Menú Semanal Personalizado"
              desc="Genera menús completos para la semana según la edad de tu bebé, con recetas detalladas y lista de compras en PDF."
              tag="Interactivo · PDF"
            />
            <AppScreen
              color1="#7C3AED" color2="#A855F7"
              emoji="📓" title="Bitácora de tu Bebé"
              desc="Registra qué alimentos probó, cómo reaccionó y qué tan bien los aceptó. Lleva un historial completo."
              tag="Seguimiento"
            />
            <AppScreen
              color1="#15803d" color2="#22c55e"
              emoji="📚" title="Biblioteca de Recursos"
              desc="10 guías PDF descargables en un solo lugar. Accede a ellas cuando quieras, tantas veces como necesites."
              tag="10 PDFs incluidos"
            />
            <AppScreen
              color1="#0369a1" color2="#0284c7"
              emoji="🥣" title="Guía de Texturas y Etapas"
              desc="Descubre qué texturas son seguras para cada edad. Avanza con confianza en cada etapa de la alimentación."
              tag="Por edades"
            />
            <AppScreen
              color1="#b45309" color2="#d97706"
              emoji="🌰" title="Plan de Alérgenos"
              desc="Calendario para introducir los 9 alérgenos principales de forma segura, uno a uno, con señales de alerta."
              tag="Protocolo seguro"
            />
            <AppScreen
              color1="#be185d" color2="#db2777"
              emoji="🎂" title="Ideas de Cumpleaños"
              desc="Recetas de pastel saludable y 15 aperitivos nutritivos para celebrar sin azúcar refinada. Se generan una vez al mes."
              tag="Sin azúcar"
            />
            <AppScreen
              color1="#6d28d9" color2="#7c3aed"
              emoji="🔄" title="Sustitutos de Ingredientes"
              desc="¿No tienes un ingrediente? Encuentra alternativas seguras y nutritivas adaptadas a la edad de tu bebé al instante."
              tag="IA · Instantáneo"
            />
          </div>

          {/* CTA intermedio */}
          <div style={{ background: 'linear-gradient(135deg,#0f766e,#0d9488)', borderRadius: 24, padding: '36px 40px', textAlign: 'center', color: 'white' }}>
            <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 24, margin: '0 0 8px', fontWeight: 700 }}>Todo esto con un solo pago de {PRECIO}</p>
            <p style={{ fontSize: 15, opacity: .85, margin: '0 0 24px' }}>Acceso de por vida · Sin mensualidades · Actualizaciones incluidas</p>
            <a href={CHECKOUT_URL}
              style={{ display: 'inline-block', background: '#F4A340', color: 'white', padding: '16px 44px', borderRadius: 50, fontFamily: "'Fredoka',sans-serif", fontSize: 20, fontWeight: 700, textDecoration: 'none', boxShadow: '0 6px 24px rgba(0,0,0,.25)' }}>
              🛒 Quiero acceso completo — {PRECIO}
            </a>
          </div>
        </div>
      </section>

      {/* ─── CTA Principal con countdown ─── */}
      <section id="metodo" style={{ background: 'linear-gradient(135deg,#1f2937,#374151)', padding: '70px 0', color: 'white', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(244,163,64,.2)', border: '1px solid rgba(244,163,64,.4)', padding: '6px 20px', borderRadius: 20, fontSize: 13, fontWeight: 700, letterSpacing: 1, marginBottom: 20, color: '#F4A340' }}>
            🔥 PRECIO ESPECIAL DE LANZAMIENTO
          </div>
          <HeroCountdown />
          <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 'clamp(28px,4vw,52px)', marginBottom: 12, lineHeight: 1.2 }}>
            El Método NutriPeques 🥄
          </h2>
          <p style={{ fontSize: 18, opacity: .85, marginBottom: 28, maxWidth: 640, margin: '0 auto 28px', lineHeight: 1.8 }}>
            Plataforma completa + buscador IA + menú semanal + lista de compras + plan de alérgenos + texturas + cumpleaños + sustitutos + bitácora + 10 guías PDF — todo incluido, acceso de por vida.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
            {['🤖 IA ilimitada', '📅 Menú semanal', '🛒 Lista de compras', '🌰 Plan alérgenos', '🥣 Texturas', '🎂 Cumpleaños', '🔄 Sustitutos', '📓 Bitácora', '📚 10 guías PDF', '♾️ Acceso de por vida', '🛡️ Garantía 7 días'].map(b => (
              <span key={b} style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', padding: '7px 18px', borderRadius: 20, fontSize: 14, fontWeight: 500 }}>{b}</span>
            ))}
          </div>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 18, opacity: .5, textDecoration: 'line-through', marginBottom: 4 }}>{PRECIO_TACHADO}</div>
            <div style={{ fontSize: 'clamp(48px,8vw,72px)', fontFamily: "'Fredoka',sans-serif", fontWeight: 700, lineHeight: 1, color: '#F4A340' }}>{PRECIO}</div>
            <div style={{ fontSize: 14, opacity: .6, marginTop: 8 }}>Pago único · Sin mensualidades · Sin sorpresas</div>
          </div>
          <a href={CHECKOUT_URL}
            style={{ display: 'inline-block', background: 'linear-gradient(135deg,#F4A340,#E8821A)', color: 'white', padding: '18px 52px', borderRadius: 50, fontFamily: "'Fredoka',sans-serif", fontSize: 22, fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 32px rgba(244,163,64,.35)', letterSpacing: '.3px' }}>
            🛒 Quiero acceso completo — {PRECIO}
          </a>
          <p style={{ marginTop: 16, fontSize: 13, opacity: .55 }}>💳 Pago seguro con Stripe · Tarjeta de crédito o débito</p>
        </div>
      </section>

      {/* ─── CONTENIDO: guía + bonos ─── */}
      <section id="contenido" style={{ background: 'white', padding: '80px 0', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <span style={{ display: 'inline-block', background: '#FFF7ED', color: '#E8821A', borderRadius: 50, padding: '6px 20px', fontSize: 13, fontWeight: 700 }}>📚 LAS 10 GUÍAS INCLUIDAS EN TU PLATAFORMA</span>
          </div>
          <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 'clamp(24px,3.5vw,40px)', textAlign: 'center', marginBottom: 8, color: '#1f2937' }}>
            Guía Principal + 9 Bonos Exclusivos
          </h2>
          <p style={{ textAlign: 'center', fontSize: 16, color: '#6b7280', maxWidth: 640, margin: '0 auto 56px', lineHeight: 1.7 }}>
            Además de las herramientas de la plataforma, tienes 10 PDFs descargables listos para usar cuando quieras. Sin buscar en Google, sin confusiones.
          </p>

          {/* Guía Principal */}
          <div className="np-guia-grid" style={{ background: 'linear-gradient(135deg,#FFF7ED,#CCFBF1)', borderRadius: 28, padding: '40px', marginBottom: 40, display: 'grid', gridTemplateColumns: '200px 1fr', gap: 40, alignItems: 'center', boxShadow: '0 8px 32px rgba(244,163,64,.15)', border: '2px solid #F4A340' }}>
            <PdfMockup color1="#E8821A" color2="#F4A340" emoji="📖" title="El Método NutriPeques" subtitle="Guía Completa de AC" badge="⭐ PRINCIPAL" />
            <div>
              <span style={{ background: '#F4A340', color: 'white', borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 700 }}>GUÍA PRINCIPAL</span>
              <h3 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 28, color: '#1f2937', margin: '12px 0 12px' }}>El Método NutriPeques Completo</h3>
              <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.8, marginBottom: 16 }}>
                El corazón del método. Aprenderás cómo iniciar la alimentación complementaria de forma segura, nutritiva y sin miedo desde los 6 meses. Calendario de introducción, cantidades, combinaciones por nutrientes y mucho más.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['✅ 6 a 24 meses', '✅ BLW y purés', '✅ Calendario mes a mes', '✅ Basado en OMS 2023'].map(t => (
                  <span key={t} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 20, padding: '4px 12px', fontSize: 13, color: '#374151', fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Grid de bonos */}
          <h3 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 26, color: '#E8821A', textAlign: 'center', marginBottom: 8 }}>🎁 + 9 Bonos — Sin costo adicional</h3>
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 15, marginBottom: 36 }}>Todo incluido dentro de tu plataforma. Nada extra que pagar.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20, marginBottom: 48 }}>
            {[
              { color1: '#7C3AED', color2: '#A855F7', emoji: '🍼', title: 'Señales de Listo', subtitle: 'Cuándo iniciar la AC', desc: 'Cómo saber exactamente cuándo tu bebé está preparado para iniciar la alimentación complementaria. Sin adivinar, con evidencia.' },
              { color1: '#dc2626', color2: '#ef4444', emoji: '🚨', title: 'Atragantamiento vs Gag', subtitle: 'Manual de emergencias', desc: 'Diferencia una arcada de un atragantamiento real y aprende a actuar en cada caso sin pánico y con seguridad total.' },
              { color1: '#15803d', color2: '#22c55e', emoji: '🛡️', title: 'Ventana Inmunológica', subtitle: 'Introducción de alérgenos', desc: 'Guía para introducir alérgenos en el momento correcto. Protege a tu bebé desde el inicio con el método correcto.' },
              { color1: '#0d9488', color2: '#14b8a6', emoji: '🎨', title: 'Platitos Creativos', subtitle: 'Presentación que enamora', desc: 'Guía visual de presentación de platos que hacen que tu bebé quiera comer — colores, texturas y formas que llaman la atención.' },
              { color1: '#0369a1', color2: '#0ea5e9', emoji: '🛒', title: 'Lista de Compras', subtitle: 'Supermercado sin estrés', desc: 'Lista semanal organizada por categorías para que nunca te falte nada en casa. Ahorras tiempo y dinero cada semana.' },
              { color1: '#be185d', color2: '#ec4899', emoji: '🥛', title: 'Guía APLV', subtitle: 'Alergia a la leche de vaca', desc: 'De la confusión a la confianza — todo sobre la APLV para mamás. Identifica síntomas y actúa con seguridad.' },
              { color1: '#b45309', color2: '#d97706', emoji: '🤲', title: 'Método BLISS', subtitle: 'BLW adaptado y seguro', desc: 'La variante del BLW más segura para bebés. Mejores resultados desde el primer día, paso a paso.' },
              { color1: '#4338ca', color2: '#6366f1', emoji: '📅', title: 'Guía Completa AC', subtitle: 'Calendario mes a mes', desc: 'Qué alimentos introducir, cuándo y cómo combinarlos por nutrientes. Tu hoja de ruta de 6 a 24 meses.' },
              { color1: '#065f46', color2: '#059669', emoji: '✂️', title: 'BLW Cortes Seguros', subtitle: 'Guía visual de cortes', desc: 'Cómo cortar cada alimento según la edad exacta de tu bebé. Guía visual para evitar atragantamientos.' },
            ].map((bono, i) => (
              <div key={i} className="np-bono-item" style={{ background: '#FAFAFA', borderRadius: 20, padding: 24, border: '1px solid #f3f4f6', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, width: 90 }}>
                  <PdfMockup color1={bono.color1} color2={bono.color2} emoji={bono.emoji} title={bono.title} subtitle={bono.subtitle} />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ background: '#FFF7ED', color: '#E8821A', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>BONO {i + 1}</span>
                  <h4 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 17, color: '#1f2937', margin: '8px 0 6px' }}>{bono.title}</h4>
                  <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{bono.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Valor total */}
          <div style={{ background: 'linear-gradient(135deg,#1f2937,#374151)', borderRadius: 24, padding: '40px', textAlign: 'center', color: 'white' }}>
            <p style={{ fontSize: 15, opacity: .6, marginBottom: 20 }}>Si vendiéramos cada pieza por separado:</p>
            <div className="np-valor-items" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 8, maxWidth: 900, margin: '0 auto 28px' }}>
              {[
                ['Plataforma + Buscador IA', '$400'],
                ['Menú semanal interactivo', '$200'],
                ['Bitácora del bebé', '$150'],
                ['Guía Principal AC', '$200'],
                ['Bono Señales de Listo', '$80'],
                ['Bono Atragantamiento', '$80'],
                ['Bono Alérgenos', '$80'],
                ['Bono Platitos Creativos', '$60'],
                ['Bono Lista de Compras', '$60'],
                ['Bono APLV', '$80'],
                ['Bono BLISS', '$80'],
                ['Bono Calendario AC', '$80'],
                ['Bono Cortes Seguros', '$80'],
              ].map(([name, price]) => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, opacity: .75, background: 'rgba(255,255,255,.05)', borderRadius: 8, padding: '7px 14px' }}>
                  <span>{name}</span>
                  <span style={{ fontWeight: 700, color: '#F4A340' }}>{price}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,.15)', paddingTop: 24, marginBottom: 24 }}>
              <p style={{ fontSize: 16, opacity: .6, margin: '0 0 4px' }}>Valor total:</p>
              <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 32, margin: '0 0 4px', textDecoration: 'line-through', opacity: .4 }}>{PRECIO_TACHADO}</p>
              <p style={{ fontSize: 15, opacity: .6, margin: '0 0 12px' }}>Hoy lo tienes todo por solo:</p>
              <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 60, fontWeight: 700, color: '#F4A340', margin: '0 0 4px', lineHeight: 1 }}>{PRECIO}</p>
              <p style={{ fontSize: 14, opacity: .5, margin: '0 0 24px' }}>Pago único · Sin mensualidades · Acceso de por vida</p>
            </div>
            <a href={CHECKOUT_URL}
              style={{ display: 'inline-block', background: 'linear-gradient(135deg,#F4A340,#E8821A)', color: 'white', padding: '18px 52px', borderRadius: 50, fontFamily: "'Fredoka',sans-serif", fontSize: 20, fontWeight: 700, textDecoration: 'none', boxShadow: '0 6px 24px rgba(244,163,64,.4)' }}>
              🛒 Quiero acceso a todo — {PRECIO}
            </a>
          </div>
        </div>
      </section>

      {/* ─── ¿QUÉ VAS A NOTAR? ─── */}
      <section style={{ background: 'linear-gradient(135deg,#FFF7ED,#CCFBF1)', padding: '70px 0', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 'clamp(24px,3.5vw,40px)', textAlign: 'center', marginBottom: 10, color: '#1f2937' }}>
            ¿Qué cambios vas a notar? 💚
          </h2>
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 16, marginBottom: 36 }}>Desde los primeros días usando la plataforma NutriPeques</p>
          <div style={{ maxWidth: 900, margin: '0 auto 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 12 }}>
            {[
              ['😌', 'La hora de comer se convierte en ', 'disfrute y cero estrés'],
              ['🍽️', 'Tu bebé ', 'come mejor y con más variedad'],
              ['💚', 'Te sientes ', 'tranquila y segura', ' dando alimentos nutritivos'],
              ['📋', 'Tendrás ', 'menús listos', ' para cada semana — sin improvisar'],
              ['🥦', 'Tu bebé ', 'acepta más alimentos', ' con texturas variadas'],
              ['🤲', 'Aplicas ', 'BLW con confianza', ' y de forma completamente segura'],
              ['🚨', 'Sabrás ', 'actuar ante un atragantamiento', ' sin pánico'],
              ['🧠', 'Potencias el ', 'desarrollo cerebral', ' desde el primer bocado'],
            ].map(([icon, pre, bold, post], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'white', padding: '14px 18px', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,.07)', borderLeft: '4px solid #F4A340', fontSize: 14.5, lineHeight: 1.5 }}>
                <span style={{ fontSize: 26, flexShrink: 0 }}>{icon}</span>
                <span style={{ color: '#1f2937' }}>{pre}<strong style={{ color: '#E8821A' }}>{bold}</strong>{post}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <a href={CHECKOUT_URL}
              style={{ display: 'inline-block', background: 'linear-gradient(135deg,#F4A340,#E8821A)', color: 'white', padding: '18px 44px', borderRadius: 50, fontFamily: "'Fredoka',sans-serif", fontSize: 19, fontWeight: 700, textDecoration: 'none', boxShadow: '0 6px 20px rgba(232,130,26,.35)' }}>
              🛒 Quiero empezar hoy — {PRECIO}
            </a>
          </div>
        </div>
      </section>

      {/* ─── BENEFICIOS 3 columnas ─── */}
      <section style={{ background: 'linear-gradient(135deg,#0d9488,#0f766e)', padding: '70px 0', color: 'white', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 40 }}>
            {[
              ['📚', 'TODO EN UN SOLO LUGAR', 'Buscador IA, menú semanal, lista de compras, plan de alérgenos, texturas, cumpleaños saludables, sustitutos, bitácora y 10 guías PDF — todo en un solo inicio de sesión, desde tu celular.'],
              ['💖', 'SIEMPRE DISPONIBLE', 'Tu plataforma no caduca. Accede a las 3am cuando tu bebé no quiere dormir. Consulta el buscador IA en el súper. Todo disponible 24/7.'],
              ['🧠', 'CRECE CON TU BEBÉ', 'El contenido cubre de los 6 meses a los 2 años. Conforme crece tu bebé, la plataforma sigue siendo relevante y útil en cada etapa.'],
            ].map(([icon, title, desc], i) => (
              <div key={i} style={{ textAlign: 'center', background: 'rgba(255,255,255,.08)', borderRadius: 24, padding: '36px 28px', border: '1px solid rgba(255,255,255,.15)' }}>
                <span style={{ fontSize: 52, display: 'block', marginBottom: 20 }}>{icon}</span>
                <h3 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 22, marginBottom: 14 }}>{title}</h3>
                <p style={{ fontSize: 15, opacity: .9, lineHeight: 1.8 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIOS ─── (comentado hasta tener capturas reales)
      <section style={{ background: '#f0fdf4', padding: '70px 0', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 'clamp(24px,3.5vw,38px)', textAlign: 'center', marginBottom: 8, color: '#1f2937' }}>💬 Lo que dicen las mamás</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 16, marginBottom: 36 }}>+100k familias nos siguen en redes — esto es lo que viven ellas:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20, marginBottom: 40 }}>
            {[
              { text: 'El buscador IA me cambió la vida. Antes de comprar en el súper consulto qué tan seguros son los alimentos para Lucía. ¡Y el menú semanal es un salvavidas total!', name: 'María G.', role: 'mamá de Lucía (8 meses)', img: '/assets/testimonio-1.jpg', initial: 'M' },
              { text: 'La guía de atragantamiento me tranquilizó muchísimo. Por fin pude iniciar BLW sin ese miedo paralizante. Y tener todo en una sola plataforma es increíble.', name: 'Ana R.', role: 'mamá de Emma (6 meses)', img: '/assets/testimonio-2.jpg', initial: 'A' },
              { text: 'Tenía mil PDFs guardados en el celu sin orden. Ahora todo está en la plataforma, organizado, con el menú de la semana y la bitácora de Mateo. El mejor dinero que invertí.', name: 'Sofía M.', role: 'mamá de Mateo (10 meses)', img: '/assets/testimonio-3.jpg', initial: 'S' },
            ].map((t, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,.08)' }}>
                <TestimonialImage src={t.img} name={t.name} />
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ fontSize: 16, marginBottom: 8 }}>⭐⭐⭐⭐⭐</div>
                  <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, marginBottom: 14, fontStyle: 'italic' }}>&ldquo;{t.text}&rdquo;</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#0d9488,#0f766e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: "'Fredoka',sans-serif", fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
                      {t.initial}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1f2937' }}>{t.name}</p>
                      <p style={{ margin: 0, fontSize: 11, color: '#0d9488', fontWeight: 500 }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <a href={CHECKOUT_URL}
              style={{ display: 'inline-block', background: 'linear-gradient(135deg,#F4A340,#E8821A)', color: 'white', padding: '18px 44px', borderRadius: 50, fontFamily: "'Fredoka',sans-serif", fontSize: 19, fontWeight: 700, textDecoration: 'none' }}>
              🛒 Quiero acceso a la plataforma — {PRECIO}
            </a>
          </div>
        </div>
      </section>
      ─── FIN TESTIMONIOS ───) */}

      {/* ─── SOBRE LILIANA ─── */}
      <section id="sobre-liliana" style={{ background: 'white', padding: '70px 0', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <p style={{ textAlign: 'center', fontSize: 13, color: '#0d9488', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>La nutrióloga detrás del método</p>
          <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 'clamp(24px,3.5vw,38px)', textAlign: 'center', marginBottom: 40, color: '#1f2937' }}>Conoce a Liliana 👩‍⚕️</h2>
          <div className="np-liliana-grid np-liliana-inner" style={{ maxWidth: 800, margin: '0 auto', background: 'linear-gradient(135deg,#FFF7ED,#CCFBF1)', borderRadius: 32, padding: '40px 48px', boxShadow: '0 8px 32px rgba(244,163,64,.15)', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 36, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 140, height: 140, borderRadius: '50%', overflow: 'hidden', border: '4px solid #F4A340', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(244,163,64,.3)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/perfil.jpg" alt="Liliana - NutriPeques" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href="https://www.instagram.com/nutri.pequespro" target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'linear-gradient(135deg,#F4A340,#E8821A)', color: 'white', padding: '8px 16px', borderRadius: 50, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  @nutri.pequespro
                </a>
                <a href="https://wa.me/522225067864" target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#22c55e', color: 'white', padding: '8px 16px', borderRadius: 50, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
                  WhatsApp
                </a>
              </div>
            </div>
            <div>
              <h3 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 30, color: '#E8821A', marginBottom: 4 }}>Liliana</h3>
              <p style={{ color: '#0d9488', fontWeight: 600, fontSize: 15, marginBottom: 20 }}>Nutrióloga clínica · Mamá de Max · @nutri.pequespro</p>
              <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.9, marginBottom: 12 }}>
                Soy nutrióloga especialista en alimentación infantil y mamá de Max. Creé el Método NutriPeques porque viví en carne propia la confusión de los primeros alimentos — y quiero que tú no pases por lo mismo.
              </p>
              <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.9 }}>
                Con más de 5 años de experiencia clínica y una comunidad de <strong style={{ color: '#0d9488' }}>+100k mamás</strong> en redes, construí esta plataforma para que tengas a una nutrióloga en el bolsillo, disponible siempre.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GARANTÍA ─── */}
      <section style={{ background: 'linear-gradient(135deg,#ecfdf5,#f0fdf4)', padding: '70px 0', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <div style={{ background: 'white', borderRadius: 28, padding: '48px 40px', boxShadow: '0 8px 32px rgba(34,197,94,.2)', border: '2px solid #22c55e' }}>
            <span style={{ fontSize: 64, display: 'block', marginBottom: 16 }}>🛡️</span>
            <h3 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 30, color: '#15803d', marginBottom: 12 }}>Garantía de 7 días</h3>
            <p style={{ fontSize: 16, color: '#6b7280', lineHeight: 1.8, marginBottom: 24 }}>
              Si en los primeros 7 días no estás satisfecha con la plataforma o el contenido, te devolvemos el <strong>100% de tu dinero</strong>. Sin preguntas, sin complicaciones. Tu inversión está completamente protegida.
            </p>
            <a href={CHECKOUT_URL}
              style={{ display: 'inline-block', background: 'linear-gradient(135deg,#F4A340,#E8821A)', color: 'white', padding: '16px 36px', borderRadius: 50, fontFamily: "'Fredoka',sans-serif", fontSize: 18, fontWeight: 700, textDecoration: 'none' }}>
              🛒 Comenzar sin riesgo — {PRECIO}
            </a>
          </div>
        </div>
      </section>

      {/* ─── URGENCIA REAL ─── */}
      <section style={{ background: 'linear-gradient(135deg,#1f2937 0%,#111827 100%)', padding: '60px 0', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#E8821A', borderRadius: 50, padding: '6px 20px', marginBottom: 24, fontSize: 13, fontWeight: 700, color: 'white', letterSpacing: '.5px' }}>
            🔥 PRECIO DE LANZAMIENTO
          </div>
          <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 'clamp(26px,4vw,42px)', color: 'white', lineHeight: 1.2, margin: '0 0 16px' }}>
            Hoy: <span style={{ color: '#F4A340' }}>{PRECIO}</span>{' '}
            <span style={{ textDecoration: 'line-through', color: '#6b7280', fontSize: '0.65em' }}>{PRECIO_TACHADO}</span>
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,.75)', lineHeight: 1.75, margin: '0 0 32px', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            El 1 de abril sube el precio. Si entras hoy, pagas el precio de lanzamiento y <strong style={{ color: 'white' }}>nunca te cobramos más</strong> — acceso de por vida con todas las actualizaciones incluidas.
          </p>
          {/* Bloques de lo que pierdes si esperas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginBottom: 36 }}>
            {[
              { emoji: '📅', label: 'Menú semanal de esta semana', sub: 'listo para descargar' },
              { emoji: '🤖', label: 'Buscador IA ilimitado', sub: 'desde hoy mismo' },
              { emoji: '📚', label: '10 guías PDF', sub: 'acceso inmediato' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16, padding: '18px 16px' }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{item.emoji}</div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'white', lineHeight: 1.4 }}>{item.label}</p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(255,255,255,.5)' }}>{item.sub}</p>
              </div>
            ))}
          </div>
          <a href={CHECKOUT_URL}
            style={{ display: 'inline-block', background: 'linear-gradient(135deg,#F4A340,#E8821A)', color: 'white', padding: '20px 48px', borderRadius: 50, fontFamily: "'Fredoka',sans-serif", fontSize: 21, fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 40px rgba(232,130,26,.5)', letterSpacing: '.3px' }}>
            Entrar ahora al precio de lanzamiento →
          </a>
          <p style={{ margin: '16px 0 0', fontSize: 13, color: 'rgba(255,255,255,.4)' }}>
            🛡️ 7 días de garantía · Pago único · Sin suscripción
          </p>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" style={{ background: '#FAFAFA', padding: '70px 0', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 'clamp(24px,3.5vw,38px)', textAlign: 'center', marginBottom: 40, color: '#1f2937' }}>Preguntas frecuentes</h2>
          <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              ['¿Qué es exactamente lo que compro?', 'Acceso de por vida a una plataforma digital completa que incluye: buscador IA ilimitado, menú semanal personalizado con lista de compras, guía de texturas por etapas, plan de alérgenos, ideas de cumpleaños saludables, buscador de sustitutos de ingredientes, bitácora del bebé y 10 guías PDF descargables. Todo en un solo lugar.'],
              ['¿Desde qué edad puedo aplicar el Método NutriPeques?', 'Está diseñado para bebés de 6 meses hasta los 2 años, con contenido específico para cada etapa de desarrollo.'],
              ['¿Es BLW o purés?', 'Los dos. El método incluye BLW, purés, finger foods y una transición gradual entre estilos. Tú decides cuál se adapta mejor a tu bebé.'],
              ['¿Cuándo recibo el acceso?', 'Al instante. En cuanto se procesa tu pago recibes un correo con tu enlace de acceso a la plataforma. Todo está disponible desde el primer minuto.'],
              ['¿Tiene costo mensual?', 'No. Es pago único de $299 MXN y el acceso es de por vida. También recibes las actualizaciones sin costo adicional.'],
              ['¿Puedo acceder desde el celular?', 'Sí, desde cualquier dispositivo — celular, tablet o computadora. La plataforma es web, no necesitas descargar ninguna app.'],
              ['¿Qué pasa si no me funciona?', 'Tienes 7 días de garantía total. Si no estás satisfecha, te devolvemos el 100% de tu dinero sin ninguna pregunta.'],
            ].map(([q, a], i) => (
              <div key={i} style={{ background: 'white', borderRadius: 18, padding: '24px 28px', boxShadow: '0 2px 10px rgba(0,0,0,.06)' }}>
                <h4 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 18, color: '#E8821A', marginBottom: 10 }}>❓ {q}</h4>
                <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.8, margin: 0 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section style={{ background: 'linear-gradient(135deg,#0f766e,#0d9488)', padding: '80px 0', color: 'white', textAlign: 'center', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px' }}>
          <p style={{ fontSize: 14, opacity: .75, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>🌿 No lo pienses más</p>
          <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 'clamp(28px,4vw,48px)', marginBottom: 16, lineHeight: 1.2 }}>
            Dale a tu bebé el inicio más nutritivo y seguro posible 🥕
          </h2>
          <p style={{ fontSize: 17, opacity: .9, marginBottom: 20, maxWidth: 560, margin: '0 auto 20px', lineHeight: 1.7 }}>
            Plataforma completa + IA ilimitada + menú semanal + lista de compras + alérgenos + texturas + cumpleaños + sustitutos + bitácora + 10 guías PDF — todo lo que necesitas, por un solo pago.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 32, opacity: .8, fontSize: 14 }}>
            <span>🤖 Buscador IA</span>
            <span>📅 Menú semanal</span>
            <span>🛒 Lista de compras</span>
            <span>🌰 Plan alérgenos</span>
            <span>🥣 Texturas</span>
            <span>🎂 Cumpleaños</span>
            <span>🔄 Sustitutos</span>
            <span>📓 Bitácora</span>
            <span>📚 10 guías PDF</span>
          </div>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 18, opacity: .5, textDecoration: 'line-through', marginBottom: 4 }}>{PRECIO_TACHADO}</div>
            <div style={{ fontSize: 'clamp(48px,8vw,72px)', fontFamily: "'Fredoka',sans-serif", fontWeight: 700, lineHeight: 1 }}>{PRECIO}</div>
            <div style={{ fontSize: 14, opacity: .7, marginTop: 8 }}>Pago único · Sin mensualidades · Acceso de por vida</div>
          </div>
          <a href={CHECKOUT_URL}
            style={{ display: 'inline-block', background: '#F4A340', color: 'white', padding: '20px 56px', borderRadius: 50, fontFamily: "'Fredoka',sans-serif", fontSize: 22, fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 32px rgba(0,0,0,.25)' }}>
            🛒 Quiero mi acceso ahora
          </a>
          <p style={{ marginTop: 18, fontSize: 13, opacity: .6 }}>💳 Pago seguro con Stripe · 🛡️ Garantía 7 días · 📥 Acceso inmediato</p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: '#1f2937', color: 'white', padding: '40px 0', textAlign: 'center', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ marginBottom: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.png" alt="NutriPeques Pro" style={{ height: 50, filter: 'brightness(10)', objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 20 }}>
            <a href={CHECKOUT_URL} style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, textDecoration: 'none' }}>Adquirir</a>
            <a href="#plataforma" style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, textDecoration: 'none' }}>La plataforma</a>
            <a href="#contenido" style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, textDecoration: 'none' }}>Qué incluye</a>
            <a href="#sobre-liliana" style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, textDecoration: 'none' }}>Sobre Liliana</a>
            <a href="/login" style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, textDecoration: 'none' }}>Área de miembros</a>
            <a href="#faq" style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, textDecoration: 'none' }}>FAQ</a>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 20 }}>
            <a href="https://www.facebook.com/nutripequespro" target="_blank" rel="noreferrer" aria-label="Facebook" style={{ color: 'rgba(255,255,255,.6)', display: 'flex' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.instagram.com/nutri.pequespro" target="_blank" rel="noreferrer" aria-label="Instagram" style={{ color: 'rgba(255,255,255,.6)', display: 'flex' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@nutri.pequespro" target="_blank" rel="noreferrer" aria-label="TikTok" style={{ color: 'rgba(255,255,255,.6)', display: 'flex' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
            </a>
            <a href="https://wa.me/522225067864" target="_blank" rel="noreferrer" aria-label="WhatsApp" style={{ color: '#4ade80', display: 'flex' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
            </a>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.4)' }}>© 2025 NutriPeques Pro · Todos los derechos reservados</p>
        </div>
      </footer>
    </>
  )
}
