import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { UrgencyCountdown, HeroCountdown } from '@/components/landing/CountdownTimer'
import FoodSearch from '@/components/landing/FoodSearch'

const HOTMART_URL = 'https://hotm.io/x7hSCoK'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Fredoka:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* ─── URGENCY BAR ─── */}
      <div style={{ background: 'linear-gradient(90deg,#E8821A,#F4A340,#E8821A)', color: 'white', textAlign: 'center', padding: '10px 16px', fontSize: 14, fontWeight: 600, position: 'sticky', top: 0, zIndex: 1000, fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <UrgencyCountdown />
          <span style={{ background: 'white', color: '#E8821A', padding: '3px 12px', borderRadius: 20, fontSize: 13 }}>
            🎁 ¡80% DE DESCUENTO! — Cupón: LANZAMIENTO
          </span>
          <span>Últimos cupos disponibles</span>
        </div>
      </div>

      {/* ─── HEADER ─── */}
      <header style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,.08)', position: 'sticky', top: 42, zIndex: 999, fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.png" alt="NutriPeques Pro" style={{ height: 48, objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <a href="#sobre-liliana" style={{ textDecoration: 'none', color: '#6b7280', fontSize: 14, fontWeight: 500 }}>Sobre Liliana</a>
            <a href="#faq" style={{ textDecoration: 'none', color: '#6b7280', fontSize: 14, fontWeight: 500 }}>Preguntas</a>
            <a href="/recursos" style={{ textDecoration: 'none', color: '#6b7280', fontSize: 14, fontWeight: 500 }}>Recursos</a>
            {/* Redes sociales */}
            <a href="https://www.facebook.com/nutripequespro" target="_blank" rel="noreferrer" aria-label="Facebook" style={{ color: '#6b7280', display: 'flex' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.instagram.com/nutri.pequespro" target="_blank" rel="noreferrer" aria-label="Instagram" style={{ color: '#6b7280', display: 'flex' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@nutri.pequespro" target="_blank" rel="noreferrer" aria-label="TikTok" style={{ color: '#6b7280', display: 'flex' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
            </a>
            <a href="https://wa.me/522225067864" target="_blank" rel="noreferrer" aria-label="WhatsApp" style={{ color: '#22c55e', display: 'flex' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
            </a>
            <a href="/login" style={{ textDecoration: 'none', color: '#6b7280', fontSize: 14, fontWeight: 500 }}>Área de miembros</a>
            <a href={HOTMART_URL} target="_blank" rel="noreferrer"
              style={{ background: '#F4A340', color: 'white', padding: '10px 22px', borderRadius: 50, fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
              Adquirir ahora
            </a>
          </div>
        </div>
      </header>

      {/* ─── HERO — Buscador IA ─── */}
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
            <p style={{ fontSize: 17, color: '#6b7280', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              Escribe cualquier alimento y la edad de tu bebé — te digo al instante si es seguro, cómo prepararlo y recetas fáciles 💚
            </p>
          </div>
          <FoodSearch />
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <a href="#metodo" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6b7280', fontSize: 14, textDecoration: 'none', fontWeight: 600 }}>
              ¿Quieres el método completo? Ver más abajo 👇
            </a>
          </div>
        </div>
      </section>

      {/* ─── MÉTODO NUTRIPEQUES — CTA Principal ─── */}
      <section id="metodo" style={{ background: 'linear-gradient(135deg,#F4A340,#E8821A)', padding: '60px 0', color: 'white', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,.2)', padding: '6px 20px', borderRadius: 20, fontSize: 13, fontWeight: 700, letterSpacing: 1, marginBottom: 16 }}>
            🌿 OFERTA DE LANZAMIENTO — CUPÓN: LANZAMIENTO
          </div>
          <HeroCountdown />
          <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 'clamp(26px,4vw,48px)', marginBottom: 12 }}>
            El Método NutriPeques 🥄
          </h2>
          <p style={{ fontSize: 18, opacity: .9, marginBottom: 20 }}>Guía completa + 9 bonos exclusivos — acceso inmediato y de por vida</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
            {['📥 Acceso inmediato', '♾️ Tuyo para siempre', '✅ Pago único', '🛡️ Garantía total'].map(b => (
              <span key={b} style={{ background: 'rgba(255,255,255,.2)', padding: '6px 16px', borderRadius: 20, fontSize: 14, fontWeight: 500 }}>{b}</span>
            ))}
          </div>
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 22, textDecoration: 'line-through', opacity: .7, marginRight: 10 }}>$1,000 MXN</span>
            <span style={{ fontSize: 52, fontFamily: "'Fredoka',sans-serif", fontWeight: 700 }}>$197 MXN</span>
          </div>
          <a href={HOTMART_URL} target="_blank" rel="noreferrer"
            style={{ display: 'inline-block', background: 'white', color: '#E8821A', padding: '16px 40px', borderRadius: 50, fontFamily: "'Fredoka',sans-serif", fontSize: 20, fontWeight: 700, textDecoration: 'none', boxShadow: '0 6px 24px rgba(0,0,0,.2)' }}>
            🛒 Quiero el Método NutriPeques — $197 MXN
          </a>
          <p style={{ marginTop: 14, fontSize: 13, opacity: .75 }}>Cupón <strong>LANZAMIENTO</strong> · 80% descuento · Precio normal $1,000 MXN</p>
          <p style={{ fontSize: 13, opacity: .7, marginTop: 6 }}>💳 Tarjeta · PayPal · OXXO · Transferencia</p>
        </div>
      </section>

      {/* ─── MEJORAS ─── */}
      <section id="mejoras" style={{ background: 'linear-gradient(135deg,#FFF7ED,#CCFBF1)', padding: '70px 0', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 'clamp(24px,3.5vw,38px)', textAlign: 'center', marginBottom: 10, color: '#1f2937' }}>
            ¿Qué cambios vas a notar? 💚
          </h2>
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 16, marginBottom: 28 }}>Desde los primeros días aplicando el Método NutriPeques</p>
          <div style={{ maxWidth: 860, margin: '0 auto 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 12 }}>
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
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'white', padding: '12px 16px', borderRadius: 14, boxShadow: '0 2px 6px rgba(0,0,0,.07)', borderLeft: '4px solid #F4A340', fontSize: 14, lineHeight: 1.4 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
                <span style={{ color: '#1f2937' }}>{pre}<strong style={{ color: '#E8821A' }}>{bold}</strong>{post}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <a href={HOTMART_URL} target="_blank" rel="noreferrer"
              style={{ display: 'inline-block', background: 'linear-gradient(135deg,#F4A340,#E8821A)', color: 'white', padding: '16px 36px', borderRadius: 50, fontFamily: "'Fredoka',sans-serif", fontSize: 17, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 15px rgba(232,130,26,.4)' }}>
              🛒 Quiero empezar hoy — $197 MXN
            </a>
          </div>
        </div>
      </section>

      {/* ─── ¿TE SUENA ESTO? ─── */}
      <section style={{ background: 'white', padding: '70px 0', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 'clamp(24px,3.5vw,38px)', textAlign: 'center', marginBottom: 16, color: '#1f2937' }}>¿TE SUENA ESTO?</h2>
          <p style={{ textAlign: 'center', fontSize: 18, color: '#6b7280', marginBottom: 28 }}>Si te identificas con alguna de estas situaciones, el Método NutriPeques es para ti:</p>
          <div style={{ maxWidth: 700, margin: '0 auto 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              'Tienes dudas sobre cómo alternar la leche con sus primeros alimentos.',
              'Quieres estar segura de que tu bebé come todos los nutrientes que necesita.',
              'Te quedas sin ideas a la hora de cocinar y siempre ofreces lo mismo.',
              'Quieres iniciar con sólidos pero te da miedo que se atragante.',
              'No tienes un calendario claro de qué alimentos introducir y cuándo.',
              'Te sientes confundida con tanta información contradictoria en redes.',
              'No sabes si tu bebé tiene alergia alimentaria o intolerancia.',
            ].map((item, i) => (
              <div key={i} style={{ background: '#FEF2F2', borderLeft: '4px solid #EF4444', padding: '14px 18px', borderRadius: '0 12px 12px 0', fontSize: 16, color: '#1f2937' }}>
                ❎ {item}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 17, maxWidth: 700, margin: '0 auto 12px', lineHeight: 1.7, color: '#1f2937' }}>
              Te traemos el método más completo para que dejes de buscar en todos lados y aprendas de forma segura a dar los primeros alimentos con <em>recetas fáciles, sabrosas y nutritivas</em>.
            </p>
            <p style={{ fontSize: 15, color: '#0d9488', fontWeight: 600, marginBottom: 24 }}>
              🥑🍗 Desde sus primeros purés hasta alimentos sólidos — todo basado en guías OMS/OPS 2023 🌎
            </p>
            <a href={HOTMART_URL} target="_blank" rel="noreferrer"
              style={{ display: 'inline-block', background: 'linear-gradient(135deg,#F4A340,#E8821A)', color: 'white', padding: '16px 36px', borderRadius: 50, fontFamily: "'Fredoka',sans-serif", fontSize: 17, fontWeight: 700, textDecoration: 'none' }}>
              🛒 Quiero el Método NutriPeques — $197 MXN
            </a>
          </div>
        </div>
      </section>

      {/* ─── CONTENIDO + BONOS ─── */}
      <section id="contenido" style={{ background: '#FAFAFA', padding: '70px 0', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 'clamp(24px,3.5vw,38px)', textAlign: 'center', marginBottom: 8, color: '#1f2937' }}>CONTENIDO EXCLUSIVO 📚</h2>
          <h3 style={{ textAlign: 'center', fontSize: 18, color: '#F4A340', fontWeight: 600, marginBottom: 8 }}>GUÍA PRINCIPAL + 9 BONOS INCLUIDOS</h3>
          <p style={{ textAlign: 'center', fontSize: 16, color: '#6b7280', maxWidth: 700, margin: '0 auto 32px' }}>
            Todo lo que necesitas en un solo lugar — sin buscar en Google, sin confusiones, sin estrés. 💚
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20, marginBottom: 36 }}>
            {[
              ['📋', 'Guía Principal', 'El Método NutriPeques completo — cómo iniciar la AC de forma segura, nutritiva y sin miedo desde los 6 meses.'],
              ['🎁', 'Bono 1: Señales de Listo', 'Cómo saber exactamente cuándo tu bebé está preparado para iniciar la alimentación complementaria.'],
              ['🎁', 'Bono 2: Atragantamiento vs Gag', 'Manual para diferenciar una arcada de un atragantamiento y actuar sin pánico en cada caso.'],
              ['🎁', 'Bono 3: Ventana Inmunológica', 'Guía para introducir alérgenos en el momento correcto y proteger a tu bebé sin complicaciones.'],
              ['🎁', 'Bono 4: Platitos Creativos', 'Guía de presentación de platos que hacen que tu bebé quiera comer — colores, texturas y formas.'],
              ['🎁', 'Bono 5: Lista de Compras', 'Lista semanal de supermercado organizada por categorías para que nunca te falte nada en casa.'],
              ['🎁', 'Bono 6: Guía APLV', 'De la confusión a la confianza — todo sobre la alergia a la proteína de leche de vaca para mamás.'],
              ['🎁', 'Bono 7: Método BLISS', 'Variante del BLW adaptada para bebés — más segura y con mejores resultados desde el primer día.'],
              ['🎁', 'Bono 8: Guía Completa AC', 'Calendario mes a mes, qué alimentos introducir, cantidades y cómo combinarlos por nutrientes.'],
              ['🎁', 'Bono 9: BLW Cortes Seguros', 'Guía visual de cómo cortar cada alimento según la edad de tu bebé para evitar atragantamientos.'],
            ].map(([icon, title, desc], i) => (
              <div key={i} style={{ background: 'white', borderRadius: 20, padding: 24, borderTop: '4px solid #F4A340', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
                <h3 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 18, color: '#E8821A', marginBottom: 10 }}>{icon} {title}</h3>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <a href={HOTMART_URL} target="_blank" rel="noreferrer"
              style={{ display: 'inline-block', background: 'linear-gradient(135deg,#F4A340,#E8821A)', color: 'white', padding: '16px 36px', borderRadius: 50, fontFamily: "'Fredoka',sans-serif", fontSize: 17, fontWeight: 700, textDecoration: 'none' }}>
              🛒 Quiero todo esto — $197 MXN
            </a>
          </div>
        </div>
      </section>

      {/* ─── BENEFICIOS ─── */}
      <section id="beneficios" style={{ background: 'linear-gradient(135deg,#F4A340,#0d9488)', padding: '70px 0', color: 'white', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 32 }}>
            {[
              ['📚', 'VAS A ESTAR ORGANIZADA', 'Menús semanales listos, listas de compras y calendarios de introducción — todo planeado para ti.'],
              ['💖', 'VAS A SENTIRTE SEGURA', 'Sabrás exactamente cómo y cuándo ofrecer cada alimento, con la tranquilidad de una nutrióloga.'],
              ['🧠', 'TU BEBÉ CRECERÁ FUERTE', 'Recetas diseñadas para potenciar el desarrollo cerebral, la inmunidad y hábitos saludables de por vida.'],
            ].map(([icon, title, desc], i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>{icon}</span>
                <h3 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 22, marginBottom: 12 }}>{title}</h3>
                <p style={{ fontSize: 15, opacity: .9, lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIOS ─── */}
      <section style={{ background: '#f0fdf4', padding: '70px 0', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 'clamp(24px,3.5vw,38px)', textAlign: 'center', marginBottom: 28, color: '#1f2937' }}>💬 Lo que dicen las mamás</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
            {[
              ['Clara y directa al grano. Descargué la guía y esa misma noche ya tenía el menú de la semana listo. Lucas ahora prueba de todo.', 'María G., mamá de Lucas (8 meses)'],
              ['La guía de atragantamiento vs arcada me tranquilizó muchísimo. Saber qué hacer me quitó el miedo de iniciar con sólidos.', 'Ana R., mamá de Emma (6 meses)'],
              ['El menú semanal me salvó la vida. Tengo todo organizado y mi bebé come con más variedad que nunca.', 'Sofía M., mamá de Mateo (10 meses)'],
            ].map(([text, author], i) => (
              <div key={i} style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 4px 14px rgba(0,0,0,.08)' }}>
                <div style={{ fontSize: 20, marginBottom: 12 }}>⭐⭐⭐⭐⭐</div>
                <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.7, marginBottom: 12, fontStyle: 'italic' }}>&ldquo;{text}&rdquo;</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#0d9488' }}>— {author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOBRE LILIANA ─── */}
      <section id="sobre-liliana" style={{ background: 'white', padding: '70px 0', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <p style={{ textAlign: 'center', fontSize: 16, color: '#6b7280', fontStyle: 'italic', marginBottom: 8 }}>La nutrióloga detrás del método</p>
          <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 'clamp(24px,3.5vw,38px)', textAlign: 'center', marginBottom: 36, color: '#1f2937' }}>Conoce a Liliana 👩‍⚕️</h2>
          <div style={{ maxWidth: 680, margin: '0 auto', background: '#FFF7ED', borderRadius: 28, padding: 40, textAlign: 'center', boxShadow: '0 6px 24px rgba(244,163,64,.2)' }}>
            <div style={{ width: 120, height: 120, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 20px', border: '4px solid #F4A340', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/perfil.jpg" alt="Liliana - NutriPeques" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h3 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 26, color: '#E8821A', marginBottom: 4 }}>Liliana</h3>
            <p style={{ color: '#0d9488', fontWeight: 600, fontSize: 15, marginBottom: 20 }}>Nutrióloga clínica · Mamá de Max · @nutri.pequespro</p>
            <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.8, marginBottom: 10 }}>
              Soy nutrióloga especialista en alimentación infantil y mamá de Max. Creé el Método NutriPeques porque viví en carne propia la confusión de los primeros alimentos — y quiero que tú no pases por lo mismo.
            </p>
            <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.8, marginBottom: 20 }}>
              Con más de 5 años de experiencia clínica y una comunidad de +100k mamás en redes, he diseñado un método práctico, basado en evidencia y adaptado a la realidad de las familias latinoamericanas.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <a href="https://www.instagram.com/nutri.pequespro" target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#F4A340,#E8821A)', color: 'white', padding: '10px 20px', borderRadius: 50, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                @nutri.pequespro
              </a>
              <a href="https://wa.me/522225067864" target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#22c55e', color: 'white', padding: '10px 20px', borderRadius: 50, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GARANTÍA ─── */}
      <section style={{ background: 'linear-gradient(135deg,#ecfdf5,#f0fdf4)', padding: '70px 0', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <div style={{ background: 'white', borderRadius: 24, padding: 40, boxShadow: '0 6px 20px rgba(34,197,94,.15)', border: '2px solid #22c55e' }}>
            <span style={{ fontSize: 56, display: 'block', marginBottom: 16 }}>🛡️</span>
            <h3 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 26, color: '#15803d', marginBottom: 12 }}>Garantía de 7 días</h3>
            <p style={{ fontSize: 16, color: '#6b7280', lineHeight: 1.7 }}>
              Si en los primeros 7 días no estás satisfecha, te devolvemos el 100% de tu dinero. Sin preguntas, sin complicaciones.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" style={{ background: '#FAFAFA', padding: '70px 0', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 'clamp(24px,3.5vw,38px)', textAlign: 'center', marginBottom: 36, color: '#1f2937' }}>Preguntas frecuentes</h2>
          <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              ['¿Desde qué edad puedo aplicar el Método NutriPeques?', 'Está diseñado para bebés de 6 meses hasta los 2 años, con contenido específico para cada etapa.'],
              ['¿Es BLW o purés?', 'Los dos. El método incluye BLW, purés, finger foods y una transición gradual entre estilos. Tú eliges.'],
              ['¿Cuándo recibo el acceso?', 'Al instante. En cuanto se procesa el pago, recibes el acceso por correo electrónico.'],
              ['¿Tiene costo mensual?', 'No. Es pago único y el acceso es de por vida. También recibes las actualizaciones gratis.'],
              ['¿Puedo acceder desde el celular?', 'Sí, desde cualquier dispositivo. El contenido es descargable y también tienes acceso al área de miembros.'],
            ].map(([q, a], i) => (
              <div key={i} style={{ background: 'white', borderRadius: 16, padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
                <h4 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 18, color: '#E8821A', marginBottom: 10 }}>{q}</h4>
                <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.7 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section style={{ background: 'linear-gradient(135deg,#F4A340,#E8821A)', padding: '70px 0', color: 'white', textAlign: 'center', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 'clamp(26px,4vw,44px)', marginBottom: 12 }}>
            ¿Lista para empezar? 🥕
          </h2>
          <p style={{ fontSize: 18, opacity: .9, marginBottom: 24 }}>Únete a cientos de mamás que ya aplican el Método NutriPeques</p>
          <div style={{ marginBottom: 24 }}>
            <span style={{ fontSize: 22, textDecoration: 'line-through', opacity: .7, marginRight: 10 }}>$1,000 MXN</span>
            <span style={{ fontSize: 52, fontFamily: "'Fredoka',sans-serif", fontWeight: 700 }}>$197 MXN</span>
          </div>
          <a href={HOTMART_URL} target="_blank" rel="noreferrer"
            style={{ display: 'inline-block', background: 'white', color: '#E8821A', padding: '16px 40px', borderRadius: 50, fontFamily: "'Fredoka',sans-serif", fontSize: 20, fontWeight: 700, textDecoration: 'none', boxShadow: '0 6px 24px rgba(0,0,0,.2)' }}>
            🛒 Quiero el Método NutriPeques ahora
          </a>
          <p style={{ marginTop: 16, fontSize: 13, opacity: .7 }}>💳 Tarjeta · PayPal · OXXO · Transferencia · Garantía 7 días</p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: '#1f2937', color: 'white', padding: '40px 0', textAlign: 'center', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          {/* Logo */}
          <div style={{ marginBottom: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.png" alt="NutriPeques Pro" style={{ height: 50, filter: 'brightness(10)', objectFit: 'contain' }} />
          </div>
          {/* Links */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 20 }}>
            <a href={HOTMART_URL} target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, textDecoration: 'none' }}>Adquirir</a>
            <a href="#sobre-liliana" style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, textDecoration: 'none' }}>Sobre Liliana</a>
            <a href="/login" style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, textDecoration: 'none' }}>Área de miembros</a>
            <a href="#faq" style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, textDecoration: 'none' }}>Preguntas</a>
          </div>
          {/* Iconos redes */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 20 }}>
            <a href="https://www.facebook.com/nutripequespro" target="_blank" rel="noreferrer" aria-label="Facebook" style={{ color: 'rgba(255,255,255,.6)', display: 'flex', transition: 'color .2s' }}>
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
