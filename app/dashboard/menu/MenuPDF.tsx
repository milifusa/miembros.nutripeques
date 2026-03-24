import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { Style } from '@react-pdf/types'
import type { MenuContenido, Comida } from './MenuSemanal'

const ORANGE = '#E8821A'
const TEAL = '#0d9488'
const GRAY = '#6b7280'
const DARK = '#1f2937'
const LIGHT_BG = '#f9fafb'
const TEAL_LIGHT = '#F0FDFA'

const s = StyleSheet.create({
  page: { padding: 36, backgroundColor: 'white', fontFamily: 'Helvetica', fontSize: 9 },

  // Header
  header: { marginBottom: 16, paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: ORANGE },
  headerTitle: { fontSize: 20, color: DARK, fontFamily: 'Helvetica-Bold', marginBottom: 3 },
  headerSub: { fontSize: 10, color: GRAY, marginBottom: 6 },
  headerBadge: { backgroundColor: '#FFF7ED', paddingVertical: 3, paddingHorizontal: 10, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 4 },
  headerBadgeText: { fontSize: 8, color: ORANGE, fontFamily: 'Helvetica-Bold' },
  headerDesc: { fontSize: 9, color: GRAY, lineHeight: 1.5 },

  // Day
  dayWrap: { marginBottom: 18 },
  dayHead: { backgroundColor: ORANGE, paddingVertical: 7, paddingHorizontal: 14, borderRadius: 6, marginBottom: 10 },
  dayHeadText: { color: 'white', fontSize: 13, fontFamily: 'Helvetica-Bold' },

  // Meal
  mealWrap: { marginBottom: 10, backgroundColor: LIGHT_BG, borderRadius: 8, padding: 10, borderLeftWidth: 3, borderLeftColor: ORANGE },
  mealHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  mealLabel: { fontSize: 7, color: 'white', backgroundColor: ORANGE, paddingVertical: 2, paddingHorizontal: 7, borderRadius: 10, fontFamily: 'Helvetica-Bold', marginRight: 8 },
  mealLabelTeal: { fontSize: 7, color: 'white', backgroundColor: TEAL, paddingVertical: 2, paddingHorizontal: 7, borderRadius: 10, fontFamily: 'Helvetica-Bold', marginRight: 8 },
  mealLabelPurple: { fontSize: 7, color: 'white', backgroundColor: '#7C3AED', paddingVertical: 2, paddingHorizontal: 7, borderRadius: 10, fontFamily: 'Helvetica-Bold', marginRight: 8 },
  mealLabelBlue: { fontSize: 7, color: 'white', backgroundColor: '#1d4ed8', paddingVertical: 2, paddingHorizontal: 7, borderRadius: 10, fontFamily: 'Helvetica-Bold', marginRight: 8 },
  mealEmoji: { fontSize: 16, marginRight: 6 },
  mealName: { fontSize: 12, color: DARK, fontFamily: 'Helvetica-Bold', flex: 1 },
  mealDesc: { fontSize: 9, color: GRAY, lineHeight: 1.5, marginBottom: 6 },

  // Badges row
  badgesRow: { flexDirection: 'row', gap: 6, marginBottom: 8, flexWrap: 'wrap' },
  badge: { backgroundColor: '#FEF3C7', paddingVertical: 2, paddingHorizontal: 8, borderRadius: 10 },
  badgeText: { fontSize: 7, color: '#92400E', fontFamily: 'Helvetica-Bold' },
  badgeTeal: { backgroundColor: TEAL_LIGHT, paddingVertical: 2, paddingHorizontal: 8, borderRadius: 10 },
  badgeTealText: { fontSize: 7, color: TEAL, fontFamily: 'Helvetica-Bold' },

  // Sections inside meal
  sectionTitle: { fontSize: 8, color: DARK, fontFamily: 'Helvetica-Bold', marginBottom: 3, marginTop: 6 },
  bullet: { fontSize: 8, color: GRAY, lineHeight: 1.5, marginLeft: 8 },
  step: { fontSize: 8, color: GRAY, lineHeight: 1.5, marginLeft: 8, marginBottom: 1 },

  // Nutrition table
  nutriRow: { flexDirection: 'row', marginTop: 4, flexWrap: 'wrap', gap: 4 },
  nutriCell: { backgroundColor: '#EDE9FE', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 6, minWidth: 60 },
  nutriLabel: { fontSize: 6, color: '#7C3AED', fontFamily: 'Helvetica-Bold' },
  nutriVal: { fontSize: 7, color: DARK },

  // Allergens
  alergenRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  alergenBadge: { backgroundColor: '#FEF9C3', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 8 },
  alergenText: { fontSize: 7, color: '#A16207', fontFamily: 'Helvetica-Bold' },
  noAlerg: { fontSize: 7, color: '#9ca3af' },

  // Footer note
  note: { marginTop: 14, backgroundColor: TEAL_LIGHT, borderRadius: 6, paddingVertical: 8, paddingHorizontal: 12, borderLeftWidth: 2, borderLeftColor: TEAL },
  noteText: { fontSize: 8, color: '#0f766e', lineHeight: 1.5 },
})

const MEAL_LABELS: Record<string, { label: string; style: Style }> = {
  DESAYUNO: { label: 'DESAYUNO', style: s.mealLabel },
  COMIDA:   { label: 'COMIDA',   style: s.mealLabelTeal },
  MERIENDA: { label: 'MERIENDA', style: s.mealLabelPurple },
  CENA:     { label: 'CENA',     style: s.mealLabelBlue },
}

function MealCard({ comida, tipo }: { comida: Comida; tipo: string }) {
  const ml = MEAL_LABELS[tipo] ?? MEAL_LABELS.DESAYUNO
  const tieneReceta = !!(comida.ingredientes?.length || comida.preparacion?.length)

  return (
    <View style={s.mealWrap} wrap={false}>
      {/* Header */}
      <View style={s.mealHeader}>
        <Text style={ml.style}>{ml.label}</Text>
        <Text style={s.mealName}>{comida.emoji ? `${comida.emoji}  ` : ''}{comida.nombre}</Text>
      </View>

      <Text style={s.mealDesc}>{comida.descripcion}</Text>

      {/* Badges: tiempo + porciones */}
      <View style={s.badgesRow}>
        {comida.tiempo_preparacion != null && (
          <View style={s.badge}>
            <Text style={s.badgeText}>⏱ Prep: {comida.tiempo_preparacion} min</Text>
          </View>
        )}
        {comida.tiempo_coccion != null && comida.tiempo_coccion > 0 && (
          <View style={s.badge}>
            <Text style={s.badgeText}>🔥 Cocción: {comida.tiempo_coccion} min</Text>
          </View>
        )}
        {comida.porciones && (
          <View style={s.badgeTeal}>
            <Text style={s.badgeTealText}>🍽 {comida.porciones}</Text>
          </View>
        )}
      </View>

      {/* Ingredientes */}
      {tieneReceta && comida.ingredientes && comida.ingredientes.length > 0 && (
        <>
          <Text style={s.sectionTitle}>Ingredientes</Text>
          {comida.ingredientes.map((ing, i) => (
            <Text key={i} style={s.bullet}>• {ing}</Text>
          ))}
        </>
      )}

      {/* Preparación */}
      {tieneReceta && comida.preparacion && comida.preparacion.length > 0 && (
        <>
          <Text style={s.sectionTitle}>Preparación</Text>
          {comida.preparacion.map((paso, i) => (
            <Text key={i} style={s.step}>{i + 1}. {paso}</Text>
          ))}
        </>
      )}

      {/* Nutrición */}
      {comida.nutricion && Object.keys(comida.nutricion).length > 0 && (
        <>
          <Text style={s.sectionTitle}>Información nutricional</Text>
          <View style={s.nutriRow}>
            {Object.entries(comida.nutricion).map(([k, v]) => (
              <View key={k} style={s.nutriCell}>
                <Text style={s.nutriLabel}>{k.charAt(0).toUpperCase() + k.slice(1)}</Text>
                <Text style={s.nutriVal}>{v}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Alergenos */}
      <Text style={s.sectionTitle}>Alérgenos</Text>
      {comida.alergenos && comida.alergenos.length > 0 ? (
        <View style={s.alergenRow}>
          {comida.alergenos.map(a => (
            <View key={a} style={s.alergenBadge}>
              <Text style={s.alergenText}>⚠ {a}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={s.noAlerg}>Sin alérgenos comunes</Text>
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
      {contenido.dias.map(diaData => (
        <Page key={diaData.dia} size="A4" style={s.page}>

          {/* Header */}
          <View style={s.header}>
            <Text style={s.headerTitle}>Menu Semanal — Metodo NutriPeques</Text>
            <Text style={s.headerSub}>
              {nombreBebe ? `Para ${nombreBebe}  •  ` : ''}{contenido.rango}
            </Text>
            <View style={s.headerBadge}>
              <Text style={s.headerBadgeText}>Semana: {rangoSemana}</Text>
            </View>
            <Text style={s.headerDesc}>{contenido.descripcion}</Text>
          </View>

          {/* Día */}
          <View style={s.dayWrap}>
            <View style={s.dayHead}>
              <Text style={s.dayHeadText}>{diaData.dia}</Text>
            </View>
            <MealCard comida={diaData.desayuno as Comida} tipo="DESAYUNO" />
            <MealCard comida={diaData.comida as Comida} tipo="COMIDA" />
            <MealCard comida={diaData.merienda as Comida} tipo="MERIENDA" />
            <MealCard comida={diaData.cena as Comida} tipo="CENA" />
          </View>

          <View style={s.note}>
            <Text style={s.noteText}>
              Este menu es una guia orientativa. Siempre adapta las porciones al apetito de tu bebe.
              La leche materna o formula sigue siendo su alimento principal hasta los 12 meses.
            </Text>
          </View>

        </Page>
      ))}
    </Document>
  )
}
