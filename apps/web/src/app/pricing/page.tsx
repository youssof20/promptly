'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out Promptly',
    features: [
      '50 prompts per month',
      'Basic optimization',
      'DeepSeek AI model',
      'Browser extension access',
      'Community support',
    ],
    cta: 'Current Plan',
    popular: false,
    priceId: null,
  },
  {
    name: 'Pro',
    price: '$8',
    period: 'per month',
    description: 'For power users and professionals',
    features: [
      '1,000 prompts per month',
      'Advanced optimization',
      'GPT-4o-mini model',
      'Priority support',
      'Usage analytics',
      'API access',
      'Custom templates',
    ],
    cta: 'Upgrade to Pro',
    popular: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleUpgrade = async (plan: typeof plans[0]) => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (!plan.priceId) {
      // Handle enterprise contact
      window.open('mailto:sales@promptly.ai?subject=Enterprise Plan Inquiry', '_blank');
      return;
    }

    setIsLoading(plan.name);

    try {
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          successUrl: `${window.location.origin}/dashboard?upgraded=true`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to start upgrade process. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rich-black via-charcoal-gray to-rich-black">
      {/* Navigation */}
      <nav className="border-b border-slate-800/50 bg-rich-black/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 relative">
                  <Image
                    src="/icon-500.png"
                    alt="Promptly Logo"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-electric-blue to-vibrant-purple bg-clip-text text-transparent">
                  Promptly
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/auth/signin')}
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => router.push('/auth/signup')}
                    className="bg-gradient-to-r from-electric-blue to-vibrant-purple text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Simple, Transparent
            <span className="block bg-gradient-to-r from-electric-blue via-vibrant-purple to-cyan-teal bg-clip-text text-transparent">Pricing</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Choose the plan that fits your needs. Upgrade or downgrade at any time.
          </p>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-800/40 border border-slate-700/40 backdrop-blur-sm">
            <div className="w-2 h-2 bg-lime-green rounded-full mr-3 animate-pulse"></div>
            <span className="text-slate-300 text-sm font-medium">30-day money-back guarantee</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border ${
                plan.popular
                  ? 'border-blue-500/50 ring-2 ring-blue-500/20'
                  : 'border-slate-700/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-electric-blue to-vibrant-purple text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400 ml-2">{plan.period}</span>
                </div>
                <p className="text-slate-300">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-400 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan)}
                disabled={isLoading === plan.name}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-electric-blue to-vibrant-purple text-white hover:opacity-90'
                    : 'border border-slate-600 text-white hover:bg-slate-700/50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading === plan.name ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  plan.cta
                )}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            <div className="bg-slate-800/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Can I change my plan at any time?
              </h3>
              <p className="text-slate-300">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately,
                and we'll prorate any billing differences.
              </p>
            </div>

            <div className="bg-slate-800/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                What happens if I exceed my quota?
              </h3>
              <p className="text-slate-300">
                If you exceed your monthly quota, you'll need to wait until the next month or upgrade
                your plan. We'll notify you when you're approaching your limit.
              </p>
            </div>

            <div className="bg-slate-800/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Do you offer refunds?
              </h3>
              <p className="text-slate-300">
                We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied,
                contact us for a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
