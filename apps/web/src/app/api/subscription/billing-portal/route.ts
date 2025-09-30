import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getOrCreateStripeCustomer, createBillingPortalSession } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { returnUrl } = await request.json();

    if (!returnUrl) {
      return NextResponse.json(
        { error: 'Missing returnUrl parameter' },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    const customer = await getOrCreateStripeCustomer(
      (session.user as any).id,
      session.user.email!,
      session.user.name || undefined
    );

    // Create billing portal session
    const portalSession = await createBillingPortalSession(
      customer.id,
      returnUrl
    );

    return NextResponse.json({
      url: portalSession.url,
    });
  } catch (error) {
    console.error('Create billing portal session error:', error);
    return NextResponse.json(
      { error: 'Failed to create billing portal session' },
      { status: 500 }
    );
  }
}
