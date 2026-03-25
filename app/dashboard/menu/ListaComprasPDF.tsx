'use client'

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { PDFDownloadLink } from '@react-pdf/renderer'

type CategoriaCompras = {
  emoji: string
  label: string
  items: string[]
}

const CATEGORIA_BG: Record<string, string> = {
  'Frutas y verduras': '#F0FDF4',
  'Proteínas':         '#FFF7ED',
  'Cereales y granos': '#FEFCE8',
  'Lácteos':           '#EFF6FF',
  'Otros':             '#F8FAFC',
}

const CATEGORIA_COLOR: Record<string, string> = {
  'Frutas y verduras': '#15803d',
  'Proteínas':         '#C2410C',
  'Cereales y granos': '#A16207',
  'Lácteos':           '#1D4ED8',
  'Otros':             '#475569',
}

const s = StyleSheet.create({
  page:        { padding: 40, backgroundColor: 'white', fontFamily: 'Helvetica' },
  header:      { marginBottom: 20, paddingBottom: 14, borderBottomWidth: 2, borderBottomColor: '#E8821A' },
  title:       { fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#1f2937', marginBottom: 4 },
  subtitle:    { fontSize: 10, color: '#6b7280' },
  badge:       { marginTop: 6, backgroundColor: '#FFF7ED', paddingVertical: 3, paddingHorizontal: 10, borderRadius: 20, alignSelf: 'flex-start' },
  badgeText:   { fontSize: 8, color: '#E8821A', fontFamily: 'Helvetica-Bold' },
  catWrap:     { marginBottom: 16 },
  catHeader:   { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, marginBottom: 6 },
  catTitle:    { fontSize: 11, fontFamily: 'Helvetica-Bold' },
  grid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  item:        { flexDirection: 'row', alignItems: 'flex-start', width: '48%', marginBottom: 5 },
  checkbox:    { width: 10, height: 10, borderWidth: 1.5, borderColor: '#d1d5db', borderRadius: 2, marginRight: 6, marginTop: 1, flexShrink: 0 },
  itemText:    { fontSize: 9, color: '#374151', lineHeight: 1.4, flex: 1 },
  footer:      { marginTop: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  footerText:  { fontSize: 8, color: '#9ca3af', textAlign: 'center' },
})

function ListaComprasPDFDoc({ categorias, rangoSemana }: {
  categorias: CategoriaCompras[]
  rangoSemana: string
}) {
  const total = categorias.reduce((acc, c) => acc + c.items.length, 0)

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.title}>🛒 Lista de compras semanal</Text>
          <Text style={s.subtitle}>Método NutriPeques  •  {rangoSemana}  •  {total} ingredientes</Text>
          <View style={s.badge}>
            <Text style={s.badgeText}>Imprime y lleva al súper ✓</Text>
          </View>
        </View>

        {categorias.filter(c => c.items.length > 0).map(cat => {
          const bg = CATEGORIA_BG[cat.label] ?? '#f8fafc'
          const color = CATEGORIA_COLOR[cat.label] ?? '#374151'
          return (
            <View key={cat.label} style={s.catWrap} wrap={false}>
              <View style={[s.catHeader, { backgroundColor: bg }]}>
                <Text style={[s.catTitle, { color }]}>{cat.emoji}  {cat.label}</Text>
              </View>
              <View style={s.grid}>
                {cat.items.map((item, i) => (
                  <View key={i} style={s.item}>
                    <View style={s.checkbox} />
                    <Text style={s.itemText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )
        })}

        <View style={s.footer}>
          <Text style={s.footerText}>
            Generado con Método NutriPeques  •  miembros.nutripequespro.com
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export default function BotonDescargarListaPDF({ categorias, rangoSemana }: {
  categorias: CategoriaCompras[]
  rangoSemana: string
}) {
  return (
    <PDFDownloadLink
      document={<ListaComprasPDFDoc categorias={categorias} rangoSemana={rangoSemana} />}
      fileName={`lista-compras-nutripeques.pdf`}
      style={{ textDecoration: 'none' }}
    >
      {({ loading }) => (
        <button
          disabled={loading}
          style={{
            background: loading ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: 10, padding: '8px 16px',
            fontSize: 13, fontWeight: 600, cursor: loading ? 'default' : 'pointer',
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          {loading ? '⏳ Preparando...' : '⬇️ Descargar PDF'}
        </button>
      )}
    </PDFDownloadLink>
  )
}
