import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 30

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY no configurada' }, { status: 500 })
  }

  const body = await req.json() as { ingrediente: string; edadMeses: number; contexto?: string }
  const { ingrediente, edadMeses, contexto } = body

  if (!ingrediente || !edadMeses) {
    return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
  }

  const prompt = `Eres una nutricionista pediátrica experta en alimentación complementaria.

Una mamá necesita sustituir "${ingrediente}" en una receta para su bebé de ${edadMeses} meses. ${contexto ? `Contexto: ${contexto}` : ''}

Responde ÚNICAMENTE con este JSON sin markdown:
{
  "ingrediente_original": "...",
  "sustitutos": [
    {
      "nombre": "...",
      "emoji": "...",
      "razon": "Por qué funciona como sustituto",
      "proporcion": "Ej: usar la misma cantidad",
      "nota": "Consideración nutricional o de textura importante",
      "disponibilidad": "Fácil de conseguir"
    }
  ],
  "consejo_general": "Consejo breve de la nutricionista"
}

Genera 4-5 sustitutos ordenados de mejor a peor opción para esta edad. Considera la seguridad y el valor nutricional para bebés de ${edadMeses} meses.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const texto = message.content[0].type === 'text' ? message.content[0].text : ''
    const limpio = texto.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const data = JSON.parse(limpio)

    return NextResponse.json(data)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Error buscando sustitutos:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
