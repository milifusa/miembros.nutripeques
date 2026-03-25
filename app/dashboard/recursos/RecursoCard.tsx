'use client'

export default function RecursoCard({
  titulo,
  descripcion,
  emoji,
  href,
  badge,
  imagenUrl,
}: {
  titulo: string
  descripcion: string
  emoji: string
  href: string
  badge?: string
  imagenUrl?: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        fetch('/api/descargas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ titulo, url: href }),
        }).catch(() => {})
      }}
      style={{
        background: 'white', borderRadius: 18, padding: '20px', textDecoration: 'none',
        border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,.04)',
        display: 'flex', flexDirection: 'column', gap: 10, position: 'relative',
        transition: 'transform .15s, box-shadow .15s',
      }}
      onMouseOver={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(-3px)'
        el.style.boxShadow = '0 8px 24px rgba(0,0,0,.1)'
      }}
      onMouseOut={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = '0 1px 4px rgba(0,0,0,.04)'
      }}
    >
      {badge && (
        <span style={{
          position: 'absolute', top: 14, right: 14,
          background: badge === 'Nuevo' ? '#CCFBF1' : '#FEF3C7',
          color: badge === 'Nuevo' ? '#0d9488' : '#D97706',
          fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20,
        }}>
          {badge}
        </span>
      )}
      {imagenUrl
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={imagenUrl} alt={titulo} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 10 }} />
        : <div style={{ fontSize: 32 }}>{emoji}</div>
      }
      <div>
        <p style={{ fontFamily: "'Fredoka',sans-serif", fontSize: 16, fontWeight: 600, color: '#1f2937', margin: '0 0 4px' }}>
          {titulo}
        </p>
        <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
          {descripcion}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
        <span style={{ fontSize: 13, color: '#0d9488', fontWeight: 700 }}>⬇ Descargar PDF</span>
      </div>
    </a>
  )
}
