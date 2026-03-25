import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 60

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY no configurada' }, { status: 500 })
  }

  const body = await req.json() as { edadCumple: number; nombreBebe: string; numInvitados: number; pais: string }
  const { edadCumple, nombreBebe, numInvitados, pais } = body

  if (!edadCumple || !nombreBebe || !pais) {
    return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
  }

  const prompt = `Eres una nutricionista pediátrica. Genera recetas de cumpleaños saludables para un bebé/niño de ${edadCumple} meses que cumple años en ${pais}.

Responde ÚNICAMENTE con este JSON sin markdown:
{
  "pasteles": [
    {
      "nombre": "...",
      "emoji": "...",
      "descripcion": "...",
      "tiempo_preparacion": 20,
      "tiempo_coccion": 30,
      "porciones": "...",
      "ingredientes": ["..."],
      "preparacion": ["..."],
      "nota_salud": "Por qué es saludable para esta edad"
    }
  ],
  "aperitivos": [
    {
      "nombre": "...",
      "emoji": "...",
      "descripcion": "...",
      "tiempo_preparacion": 10,
      "ingredientes": ["..."],
      "para_edad": "Para bebés de X meses o más"
    }
  ]
}

Genera 3 pasteles y 15 aperitivos saludables. Sin azúcar refinada, sin miel (si menor de 12 meses), sin sal excesiva. Ingredientes fáciles de conseguir en ${pais}. La fiesta es para ${numInvitados} invitados.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const texto = message.content[0].type === 'text' ? message.content[0].text : ''
    const limpio = texto.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const data = JSON.parse(limpio)

    return NextResponse.json(data)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Error generando cumpleaños:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
