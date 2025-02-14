import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe('sk_test_51QsUghPr6AEsQaoxWITkJ1mJKd7KzsAtBORu80dzKj5chI0M72JgqDn2nmX22eolETnttyrs6wnAm0kiQ5ozJGue00tZjkXKlb');

export async function POST(req: Request) {
  try {
    const { amount } = await req.json()
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'inr',
      payment_method_types: ['card'],
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    return NextResponse.json({ error: 'Error creating payment intent' }, { status: 500 })
  }
}