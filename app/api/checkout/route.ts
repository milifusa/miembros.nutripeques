import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-02-25.clover' })

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!

export async function GET() {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    currency: 'mxn',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'mxn',
          unit_amount: 39900, // $399 MXN
          product_data: {
            name: 'El Método NutriPeques 🥄',
            description: 'Plataforma completa · Buscador IA · Menú semanal · Bitácora · 10 guías PDF · Acceso de por vida',
            images: [`${APP_URL}/assets/logo.png`],
          },
        },
      },
    ],
    success_url: `${APP_URL}/pago/exitoso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/`,
    locale: 'es',
    payment_method_types: ['card'],
    customer_creation: 'always',
    billing_address_collection: 'auto',
  })

  return NextResponse.redirect(session.url!)
}
