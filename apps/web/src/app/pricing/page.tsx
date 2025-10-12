'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started with AI optimization',
    features: [
      '50 optimizations per month',
      'Smart prompt enhancement',
      'Works on all AI platforms',
      'Basic optimization history (5 recent)',
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
    description: 'For professionals who use AI daily',
    features: [
      '1,000 optimizations per month',
      '⚡ Priority speed (instant processing)',
      '📚 Unlimited optimization history',
      '🌙 Dark mode',
      '📊 Advanced analytics',
      '🔧 Custom templates',
      '⌨️ Keyboard shortcuts',
      '💎 Premium support',
    ],
    cta: 'Upgrade to Pro',
    popular: true,
    priceId: 'pro_plan', // We'll handle this in the API
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
      <Header />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Simple, Transparent
            <span className="block bg-gradient-to-r from-electric-blue via-vibrant-purple to-cyan-teal bg-clip-text text-transparent">Pricing</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Start free, upgrade when you're ready. No hidden fees, no surprises.
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
                Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately,
                and we'll prorate any billing differences. No questions asked.
              </p>
            </div>

            <div className="bg-slate-800/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                What happens if I exceed my monthly optimizations?
              </h3>
              <p className="text-slate-300">
                We'll notify you when you're approaching your limit. If you exceed your monthly quota, 
                you can either wait until the next month or upgrade your plan for immediate access to more optimizations.
              </p>
            </div>

            <div className="bg-slate-800/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                How does prompt optimization work?
              </h3>
              <p className="text-slate-300">
                Our AI analyzes your prompts and makes them clearer, more specific, and more effective. 
                We improve structure, add context, and optimize for better AI responses. Works on ChatGPT, Claude, Gemini, and more.
              </p>
            </div>

            <div className="bg-slate-800/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                What's the difference between Free and Pro?
              </h3>
              <p className="text-slate-300">
                Free gives you 50 optimizations per month with basic features. Pro gives you 1,000 optimizations 
                plus priority speed, unlimited history, dark mode, analytics, templates, and keyboard shortcuts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
