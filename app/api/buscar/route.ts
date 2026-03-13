import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const { alimento, edad } = await request.json()

    if (!alimento?.trim() || !edad) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    const prompt = `Eres NutriPeques, la asistente de Liliana, nutrióloga especialista en alimentación complementaria (AC) infantil.
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

    const respuesta =
      message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({ respuesta })
  } catch (error) {
    console.error('Error en buscador IA:', error)
    return NextResponse.json(
      { error: 'Error al consultar. Intenta de nuevo.' },
      { status: 500 }
    )
  }
}
