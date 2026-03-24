import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function getLunesDeEstaSemana(): string {
  const hoy = new Date()
  const dia = hoy.getDay()
  const diff = dia === 0 ? -6 : 1 - dia
  const lunes = new Date(hoy)
  lunes.setDate(hoy.getDate() + diff)
  return lunes.toISOString().split('T')[0]
}

function rangoEdad(meses: number): string {
  if (meses <= 8) return '6 a 8 meses (inicio de alimentación complementaria, purés y papillas muy suaves, texturas homogéneas)'
  if (meses <= 11) return '9 a 11 meses (texturas mixtas y trozos blandos, autoalimentación, finger foods suaves)'
  if (meses <= 17) return '12 a 17 meses (comida familiar adaptada, variedad amplia, trozos manejables)'
  return '18 meses o más (menú casi familiar, sabores variados, autonomía en la alimentación)'
}

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  // Obtener hijo activo desde cookie
  const cookieStore = await cookies()
  const hijoActivoId = cookieStore.get('hijo_activo_id')?.value ?? null

  let edadMeses = 6
  let nombreBebe = 'el bebé'
  let hijoId: string | null = null

  // Traer todos los hijos del usuario y seleccionar el activo o el primero
  const { data: hijosData } = await supabase
    .from('hijos')
    .select('id, nombre, fecha_nacimiento, pais')
    .eq('usuario_id', user.id)
    .order('created_at', { ascending: true })

  const hijos = (hijosData ?? []) as { id: string; nombre: string; fecha_nacimiento: string; pais: string | null }[]
  const hijoSeleccionado = hijos.find(h => h.id === hijoActivoId) ?? hijos[0] ?? null

  console.log('[generar-menu] cookie hijoActivoId:', hijoActivoId, '| hijoSeleccionado:', hijoSeleccionado?.nombre)

  const pais = hijoSeleccionado?.pais ?? 'México'

  if (hijoSeleccionado) {
    hijoId = hijoSeleccionado.id
    nombreBebe = hijoSeleccionado.nombre
    const nac = new Date(hijoSeleccionado.fecha_nacimiento)
    const hoyD = new Date()
    let m = (hoyD.getFullYear() - nac.getFullYear()) * 12 + (hoyD.getMonth() - nac.getMonth())
    if (hoyD.getDate() < nac.getDate()) m--
    edadMeses = Math.max(0, m)
  }

  if (!hijoId) return NextResponse.json({ error: 'No hay un hijo registrado' }, { status: 400 })

  const semana = getLunesDeEstaSemana()
  const rango = rangoEdad(edadMeses)

  const prompt = `Eres una nutricionista pediátrica experta en alimentación complementaria (BLW y papillas).

Genera un menú semanal completo para ${nombreBebe}, un bebé de ${edadMeses} meses. Etapa: ${rango}.
País de referencia: ${pais}. Usa ingredientes típicos y fáciles de conseguir en ${pais}.

REQUISITOS:
- 7 días: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo
- 4 tiempos por día: desayuno, comida, merienda, cena
- Ingredientes variados, nutritivos y apropiados para la edad, fáciles de conseguir en ${pais}
- Sin sal añadida para menores de 12 meses, mínima para mayores
- Sin miel para menores de 12 meses
- Incluye alimentos ricos en hierro, zinc, omega-3 y vitaminas
- Varía los grupos de alimentos a lo largo de la semana
- Para cada comida incluye receta completa: ingredientes con cantidades, pasos de preparación e información nutricional estimada

Responde ÚNICAMENTE con este JSON, sin texto adicional, sin markdown, sin explicaciones:

{
  "rango": "descripción corta del rango de edad",
  "descripcion": "frase de 1 línea describiendo la etapa",
  "dias": [
    {
      "dia": "Lunes",
      "desayuno": {
        "nombre": "...",
        "descripcion": "...",
        "emoji": "...",
        "tiempo_preparacion": 10,
        "tiempo_coccion": 15,
        "porciones": "1 porción (aprox. 150g)",
        "ingredientes": ["100g plátano maduro", "2 cdas leche materna o fórmula"],
        "preparacion": ["Pelar y triturar el plátano.", "Mezclar con leche hasta obtener textura deseada."],
        "nutricion": {
          "calorias": "~90 kcal",
          "proteinas": "1g",
          "carbohidratos": "23g",
          "grasas": "0.3g",
          "hierro": "0.3mg"
        },
        "alergenos": []
      },
      "comida": { "nombre": "...", "descripcion": "...", "emoji": "...", "tiempo_preparacion": 10, "tiempo_coccion": 20, "porciones": "...", "ingredientes": [], "preparacion": [], "nutricion": { "calorias": "...", "proteinas": "...", "carbohidratos": "...", "grasas": "...", "hierro": "..." }, "alergenos": [] },
      "merienda": { "nombre": "...", "descripcion": "...", "emoji": "...", "tiempo_preparacion": 5, "tiempo_coccion": 0, "porciones": "...", "ingredientes": [], "preparacion": [], "nutricion": { "calorias": "...", "proteinas": "...", "carbohidratos": "...", "grasas": "...", "hierro": "..." }, "alergenos": [] },
      "cena": { "nombre": "...", "descripcion": "...", "emoji": "...", "tiempo_preparacion": 10, "tiempo_coccion": 15, "porciones": "...", "ingredientes": [], "preparacion": [], "nutricion": { "calorias": "...", "proteinas": "...", "carbohidratos": "...", "grasas": "...", "hierro": "..." }, "alergenos": [] }
    }
  ]
}

En "alergenos" incluye solo los que apliquen de: gluten, huevo, lácteos, pescado, mariscos, nueces, cacahuate, leguminosas, ajonjolí, soya. Si no hay, pon array vacío [].
En "tiempo_coccion" pon 0 si no requiere cocción.
Completa los 7 días con el mismo nivel de detalle.`

  let contenido: object
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    })
    const texto = message.content[0].type === 'text' ? message.content[0].text : ''
    const limpio = texto.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    contenido = JSON.parse(limpio)
  } catch (err) {
    console.error('Error generando menú con IA:', err)
    return NextResponse.json({ error: 'Error al generar el menú con IA' }, { status: 500 })
  }

  // Guardar en DB — upsert por usuario + hijo + semana
  const { error: dbError } = await (supabase.from('menus_semanales') as ReturnType<typeof supabase.from>)
    .upsert({
      usuario_id: user.id,
      hijo_id: hijoId,
      semana,
      edad_meses: edadMeses,
      contenido,
    } as never, { onConflict: 'usuario_id,hijo_id,semana' })

  if (dbError) {
    console.error('Error guardando menú:', dbError)
    return NextResponse.json({ error: 'Error al guardar el menú' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, contenido, semana })
}
