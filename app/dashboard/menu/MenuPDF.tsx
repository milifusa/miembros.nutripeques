import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { MenuContenido, Comida } from './MenuSemanal'

const s = StyleSheet.create({
  page: { padding: 36, backgroundColor: 'white', fontFamily: 'Helvetica' },
  header: { marginBottom: 18, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  title: { fontSize: 18, color: '#1f2937', fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  meta: { fontSize: 10, color: '#6b7280', marginBottom: 5 },
  badge: { backgroundColor: '#F0FDF4', paddingVertical: 3, paddingHorizontal: 10, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 6 },
  badgeText: { fontSize: 9, color: '#15803d', fontFamily: 'Helvetica-Bold' },
  desc: { fontSize: 9, color: '#6b7280', lineHeight: 1.5 },
  dayWrap: { marginBottom: 10 },
  dayHead: { backgroundColor: '#E8821A', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, marginBottom: 7 },
  dayHeadText: { color: 'white', fontSize: 12, fontFamily: 'Helvetica-Bold' },
  row: { flexDirection: 'row', marginBottom: 5 },
  card: { flex: 1, backgroundColor: '#f9fafb', borderRadius: 6, padding: 8, marginRight: 6 },
  cardLast: { flex: 1, backgroundColor: '#f9fafb', borderRadius: 6, padding: 8 },
  cardLabel: { fontSize: 7, color: '#9ca3af', fontFamily: 'Helvetica-Bold', marginBottom: 3 },
  cardName: { fontSize: 10, color: '#1f2937', fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  cardDesc: { fontSize: 8, color: '#6b7280', lineHeight: 1.4 },
  cardAlerg: { fontSize: 7, color: '#A16207', marginTop: 3 },
  note: { marginTop: 10, backgroundColor: '#F0FDFA', borderRadius: 6, paddingVertical: 8, paddingHorizontal: 12, borderLeftWidth: 2, borderLeftColor: '#0d9488' },
  noteText: { fontSize: 8, color: '#0f766e', lineHeight: 1.5 },
})

function MealCard({ comida, label, last }: { comida: Comida; label: string; last: boolean }) {
  return (
    <View style={last ? s.cardLast : s.card}>
      <Text style={s.cardLabel}>{label}</Text>
      <Text style={s.cardName}>{comida.nombre}</Text>
      <Text style={s.cardDesc}>{comida.descripcion}</Text>
      {comida.alergenos && comida.alergenos.length > 0 && (
        <Text style={s.cardAlerg}>Alergenos: {comida.alergenos.join(', ')}</Text>
      )}
    </View>
  )
}

export function MenuPDFDoc({ contenido, nombreBebe, rangoSemana }: {
  contenido: MenuContenido
  nombreBebe: string | null
  rangoSemana: string
}) {
  return (
    <Document>
      <Page size="A4" style={s.page}>

        <View style={s.header}>
          <Text style={s.title}>Menu Semanal — Metodo NutriPeques</Text>
          <Text style={s.meta}>
            {nombreBebe ? `Para ${nombreBebe}  •  ` : ''}{contenido.rango}
          </Text>
          <View style={s.badge}>
            <Text style={s.badgeText}>Valido {rangoSemana}</Text>
          </View>
          <Text style={s.desc}>{contenido.descripcion}</Text>
        </View>

        {contenido.dias.map(diaData => (
          <View key={diaData.dia} style={s.dayWrap} wrap={false}>
            <View style={s.dayHead}>
              <Text style={s.dayHeadText}>{diaData.dia}</Text>
            </View>
            <View style={s.row}>
              <MealCard comida={diaData.desayuno as Comida} label="DESAYUNO" last={false} />
              <MealCard comida={diaData.comida as Comida} label="COMIDA" last={true} />
            </View>
            <View style={s.row}>
              <MealCard comida={diaData.merienda as Comida} label="MERIENDA" last={false} />
              <MealCard comida={diaData.cena as Comida} label="CENA" last={true} />
            </View>
          </View>
        ))}

        <View style={s.note}>
          <Text style={s.noteText}>
            Este menu es una guia orientativa generada con IA. Siempre adapta las porciones al apetito de tu bebe.
            La leche materna o formula sigue siendo su alimento principal hasta los 12 meses.
          </Text>
        </View>

      </Page>
    </Document>
  )
}
