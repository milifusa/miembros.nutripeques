import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClientRaw } from '@/lib/supabase/admin'
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

  const body = await req.json() as { edadCumple: number; nombreBebe: string; numInvitados: number; pais: string; hijoId?: string }
  const { edadCumple, nombreBebe, numInvitados, pais, hijoId } = body

  if (!edadCumple || !nombreBebe || !pais) {
    return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
  }

  const mesActual = new Date().toISOString().slice(0, 7) // 'YYYY-MM'
  const db = createAdminClientRaw()

  // Check if already generated this month for this hijo
  if (hijoId) {
    try {
      const { data: cached } = await db
        .from('ideas_cumpleanos')
        .select('resultado')
        .eq('hijo_id', hijoId)
        .eq('mes', mesActual)
        .maybeSingle()

      if (cached) {
        return NextResponse.json({ ...(cached.resultado as object), fromCache: true })
      }
    } catch {
      // Table may not exist yet, continue to generate
    }
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

    // Guardar en BD (insert; si ya existe el registro del mes, actualizar)
    if (hijoId) {
      const saveResult = await db.from('ideas_cumpleanos').insert({
        usuario_id: user.id,
        hijo_id: hijoId,
        mes: mesActual,
        edad_meses: edadCumple,
        num_invitados: numInvitados,
        pais,
        resultado: data,
      })
      // Si falla por duplicado (unique constraint), intentar update
      if (saveResult.error) {
        await db.from('ideas_cumpleanos')
          .update({ resultado: data, num_invitados: numInvitados })
          .eq('hijo_id', hijoId)
          .eq('mes', mesActual)
          .then(() => null, () => null)
      }
    }

    return NextResponse.json(data)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Error generando cumpleaños:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const hijoId = searchParams.get('hijoId')
  const mesActual = new Date().toISOString().slice(0, 7)

  if (!hijoId) return NextResponse.json({ data: null })

  const db = createAdminClientRaw()
  try {
    const { data } = await db
      .from('ideas_cumpleanos')
      .select('resultado, created_at')
      .eq('hijo_id', hijoId)
      .eq('mes', mesActual)
      .maybeSingle()
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ data: null })
  }
}
