import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase/admin'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() })
}

export async function POST(request: NextRequest) {
  try {
    const { alimento, edad } = await request.json()

    if (!alimento?.trim()) {
      return NextResponse.json({ error: 'Escribe un alimento' }, { status: 400, headers: corsHeaders() })
    }

    const edadMeses: number = typeof edad === 'number' && edad > 0 ? edad : 6
    const alimentoNorm = alimento.trim().toLowerCase()

    const admin = createAdminClient()

    // Buscar en caché (mismo alimento + misma edad)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: cached } = await (admin as any)
      .from('busquedas_ia')
      .select('respuesta')
      .ilike('query', alimentoNorm)
      .eq('edad_meses', edadMeses)
      .limit(1)
      .maybeSingle()

    if (cached?.respuesta) {
      return NextResponse.json({ respuesta: cached.respuesta, edad: edadMeses, cache: true }, { headers: corsHeaders() })
    }

    // Llamar a la IA
    const prompt = `Eres NutriPeques, asistente de Liliana, nutrióloga especialista en alimentación complementaria (AC) infantil.
Una mamá te pregunta sobre "${alimento.trim()}" para un bebé de ${edadMeses} meses.

Responde SIEMPRE en este formato exacto con emojis, en español:

**¿Es seguro para ${edadMeses} meses?**
[respuesta directa con ✅ seguro / ⚠️ con precauciones / ❌ no recomendado y por qué]

**Edad mínima recomendada:** [mes exacto]

**Cómo prepararlo a los ${edadMeses} meses:**
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

    // Guardar en caché (sin usuario_id para consultas públicas)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin as any).from('busquedas_ia').insert({
      query: alimento.trim(),
      respuesta,
      edad_meses: edadMeses,
      usuario_id: null,
    })

    return NextResponse.json({ respuesta, edad: edadMeses }, { headers: corsHeaders() })
  } catch (error) {
    console.error('Error en buscador público:', error)
    return NextResponse.json({ error: 'Error al consultar. Intenta de nuevo.' }, { status: 500, headers: corsHeaders() })
  }
}
