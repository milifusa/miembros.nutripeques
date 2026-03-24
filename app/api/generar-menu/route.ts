import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 120

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

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY no configurada' }, { status: 500 })
  }

  function buildPrompt(dias: string[]): string {
    return `Eres una nutricionista pediátrica experta en alimentación complementaria (BLW y papillas).

Genera el menú para ${nombreBebe}, bebé de ${edadMeses} meses. Etapa: ${rango}.
País: ${pais}. Usa ingredientes típicos y fáciles de conseguir en ${pais}.
Sin sal ni miel para menores de 12 meses. Incluye hierro, zinc, omega-3.

Responde ÚNICAMENTE con un array JSON de ${dias.length} días, sin texto adicional ni markdown:

[
  {
    "dia": "${dias[0]}",
    "desayuno": { "nombre":"...","descripcion":"...","emoji":"...","tiempo_preparacion":10,"tiempo_coccion":0,"porciones":"1 porción (aprox. 120g)","ingredientes":["100g ingrediente"],"preparacion":["Paso 1.","Paso 2."],"nutricion":{"calorias":"~80 kcal","proteinas":"2g","carbohidratos":"15g","grasas":"1g","hierro":"0.5mg"},"alergenos":[] },
    "comida": { "nombre":"...","descripcion":"...","emoji":"...","tiempo_preparacion":10,"tiempo_coccion":15,"porciones":"1 porción (aprox. 150g)","ingredientes":[],"preparacion":[],"nutricion":{"calorias":"...","proteinas":"...","carbohidratos":"...","grasas":"...","hierro":"..."},"alergenos":[] },
    "merienda": { "nombre":"...","descripcion":"...","emoji":"...","tiempo_preparacion":5,"tiempo_coccion":0,"porciones":"1 porción (aprox. 80g)","ingredientes":[],"preparacion":[],"nutricion":{"calorias":"...","proteinas":"...","carbohidratos":"...","grasas":"...","hierro":"..."},"alergenos":[] },
    "cena": { "nombre":"...","descripcion":"...","emoji":"...","tiempo_preparacion":10,"tiempo_coccion":10,"porciones":"1 porción (aprox. 130g)","ingredientes":[],"preparacion":[],"nutricion":{"calorias":"...","proteinas":"...","carbohidratos":"...","grasas":"...","hierro":"..."},"alergenos":[] }
  }
]

Genera exactamente ${dias.length} objetos para los días: ${dias.join(', ')}.
En "alergenos" incluye solo: gluten, huevo, lácteos, pescado, mariscos, nueces, cacahuate, leguminosas, ajonjolí, soya. Si no hay, pon [].`
  }

  async function generarDias(dias: string[]) {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8192,
      messages: [{ role: 'user', content: buildPrompt(dias) }],
    })
    const texto = message.content[0].type === 'text' ? message.content[0].text : ''
    const limpio = texto.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(limpio) as object[]
  }

  let contenido: object
  try {
    const [diasA, diasB] = await Promise.all([
      generarDias(['Lunes', 'Martes', 'Miércoles', 'Jueves']),
      generarDias(['Viernes', 'Sábado', 'Domingo']),
    ])
    contenido = {
      rango,
      descripcion: `Menú personalizado para ${nombreBebe} — ${rango}`,
      dias: [...diasA, ...diasB],
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Error generando menú:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
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
