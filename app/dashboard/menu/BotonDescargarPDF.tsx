'use client'

import { PDFDownloadLink } from '@react-pdf/renderer'
import { MenuPDFDoc } from './MenuPDF'
import type { MenuContenido } from './MenuSemanal'

export default function BotonDescargarPDF({ contenido, nombreBebe, rangoSemana }: {
  contenido: MenuContenido
  nombreBebe: string | null
  rangoSemana: string
}) {
  const fileName = `menu-${(nombreBebe ?? 'bebe').toLowerCase().replace(/\s+/g, '-')}-nutripeques.pdf`

  return (
    <PDFDownloadLink
      document={<MenuPDFDoc contenido={contenido} nombreBebe={nombreBebe} rangoSemana={rangoSemana} />}
      fileName={fileName}
      style={{ textDecoration: 'none' }}
    >
      {({ loading }) => (
        <button
          disabled={loading}
          style={{
            background: loading ? '#d1d5db' : 'white',
            color: loading ? '#9ca3af' : '#1f2937',
            border: '1.5px solid #e5e7eb',
            borderRadius: 50,
            padding: '9px 20px',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "'Outfit',sans-serif",
            cursor: loading ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 1px 4px rgba(0,0,0,.06)',
            transition: 'all .15s',
          }}
        >
          <span style={{ fontSize: 16 }}>⬇</span>
          {loading ? 'Preparando...' : 'Descargar PDF'}
        </button>
      )}
    </PDFDownloadLink>
  )
}
