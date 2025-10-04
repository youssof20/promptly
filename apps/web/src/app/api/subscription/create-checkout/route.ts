import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';
import { prisma } from '@promptly/database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { priceId, successUrl, cancelUrl } = await req.json();

  // Use the actual Stripe price ID from environment variables
  const actualPriceId = process.env.STRIPE_PRO_PRICE_ID;
  
  if (!actualPriceId) {
    return new NextResponse('Stripe price ID not configured', { status: 500 });
  }

  try {
    // Get or create Stripe customer
    let stripeCustomerId = (await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { stripeCustomerId: true },
    }))?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name || undefined,
      });
      stripeCustomerId = customer.id;

      await prisma.user.update({
        where: { email: session.user.email },
        data: { stripeCustomerId },
      });
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      line_items: [
        {
          price: actualPriceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${req.nextUrl.origin}/dashboard?upgraded=true`,
      cancel_url: cancelUrl || `${req.nextUrl.origin}/pricing`,
      metadata: {
        userId: session.user.id || session.user.email,
        email: session.user.email,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Stripe checkout session creation failed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}