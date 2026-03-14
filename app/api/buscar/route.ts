import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    // Obtener edad del hijo activo via cookie (igual que las demás páginas)
    const cookieStore = await cookies()
    const hijoActivoId = cookieStore.get('hijo_activo_id')?.value ?? null

    const { data: hijosRaw } = await supabase
      .from('hijos')
      .select('id, fecha_nacimiento')
      .eq('usuario_id', user.id)
      .order('created_at', { ascending: true })
    const hijos = (hijosRaw ?? []) as { id: string; fecha_nacimiento: string }[]
    const hijoActivo = hijos.find(h => h.id === hijoActivoId) ?? hijos[0] ?? null

    let edadPerfil: number | null = null
    if (hijoActivo) {
      const nac = new Date(hijoActivo.fecha_nacimiento)
      const hoyD = new Date()
      let m = (hoyD.getFullYear() - nac.getFullYear()) * 12 + (hoyD.getMonth() - nac.getMonth())
      if (hoyD.getDate() < nac.getDate()) m--
      edadPerfil = Math.max(0, m)
    }

    const { alimento } = await request.json()

    if (!alimento?.trim()) {
      return NextResponse.json({ error: 'Escribe un alimento' }, { status: 400 })
    }

    const edad = edadPerfil ?? 6
    const alimentoNorm = alimento.trim().toLowerCase()

    // Buscar en caché (mismo alimento + misma edad, cualquier usuario)
    const admin = createAdminClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: cached } = await (admin as any)
      .from('busquedas_ia')
      .select('respuesta')
      .ilike('query', alimentoNorm)
      .eq('edad_meses', edad)
      .limit(1)
      .maybeSingle()

    if (cached?.respuesta) {
      // Registrar que este usuario hizo la búsqueda (para stats) sin llamar a la IA
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (admin as any).from('busquedas_ia').insert({
        usuario_id: user.id,
        query: alimento.trim(),
        respuesta: cached.respuesta,
        edad_meses: edad,
      })
      return NextResponse.json({ respuesta: cached.respuesta, edad, cache: true })
    }

    const prompt = `Eres NutriPeques, asistente de Liliana, nutrióloga especialista en alimentación complementaria (AC) infantil.
Una mamá te pregunta sobre "${alimento.trim()}" para un bebé de ${edad} meses.

Responde SIEMPRE en este formato exacto con emojis, en español:

**¿Es seguro para ${edad} meses?**
[respuesta directa con ✅ seguro / ⚠️ con precauciones / ❌ no recomendado y por qué]

**Edad mínima recomendada:** [mes exacto]

**Cómo prepararlo a los ${edad} meses:**
• [forma 1]
• [forma 2]
• [forma 3 si aplica]

**Nutrientes clave:**
• [nutriente 1 y su beneficio]
• [nutriente 2 y su beneficio]

**Receta rápida:**
[receta simple y práctica de 2-3 pasos]

**¡Importante!**
[1-2 precauciones o tips clave]

Sé amigable, concisa y práctica. Máximo 280 palabras.`

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    })

    const respuesta = message.content[0].type === 'text' ? message.content[0].text : ''

    // Guardar en historial
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const insertResult = await (admin as any).from('busquedas_ia').insert({
      usuario_id: user.id,
      query: alimento.trim(),
      respuesta,
      edad_meses: edad,
    })
    if (insertResult.error) console.error('[buscar] insert error:', insertResult.error)

    return NextResponse.json({ respuesta, edad })
  } catch (error) {
    console.error('Error en buscador IA:', error)
    return NextResponse.json({ error: 'Error al consultar. Intenta de nuevo.' }, { status: 500 })
  }
}
