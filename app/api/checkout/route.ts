import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PRODUCTOS, type ProductoId } from '@/lib/productos'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-02-25.clover' })

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const productoParam = searchParams.get('producto') ?? 'metodo_nutripeques'

  const productoId: ProductoId = (productoParam in PRODUCTOS)
    ? (productoParam as ProductoId)
    : 'metodo_nutripeques'

  const producto = PRODUCTOS[productoId]

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    currency: 'mxn',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'mxn',
          unit_amount: producto.precio,
          product_data: {
            name: `${producto.emoji} ${producto.nombre}`,
            description: producto.descripcion,
            images: [`${APP_URL}/assets/logo.png`],
          },
        },
      },
    ],
    metadata: {
      producto_id: productoId,
    },
    success_url: `${APP_URL}/pago/exitoso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/`,
    locale: 'es',
    payment_method_types: ['card'],
    customer_creation: 'always',
    billing_address_collection: 'auto',
  })

  return NextResponse.redirect(session.url!)
}
