'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface UserStats {
  totalPrompts: number;
  thisMonthPrompts: number;
  recentPrompts: Array<{
    id: string;
    originalPrompt: string;
    optimizedPrompt: string;
    modelUsed: string;
    createdAt: string;
  }>;
}

interface QuotaInfo {
  canOptimize: boolean;
  remainingQuota: number;
  quotaLimit: number;
  tier: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [quotaInfo, setQuotaInfo] = useState<QuotaInfo | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [billingLoading, setBillingLoading] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    setIsLoading(false);
    loadUserData();
  }, [session, status, router]);

  const loadUserData = async () => {
    try {
      setStatsLoading(true);
      
      // Load user stats and quota in parallel
      const [statsResponse, quotaResponse] = await Promise.all([
        fetch('/api/user/stats'),
        fetch('/api/quota')
      ]);

      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        setUserStats(stats);
      }

      if (quotaResponse.ok) {
        const quota = await quotaResponse.json();
        setQuotaInfo(quota);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rich-black via-charcoal-gray to-rich-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleBillingPortal = async () => {
    setBillingLoading(true);
    try {
      const response = await fetch('/api/subscription/billing-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: window.location.href,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create billing portal session');
      }
    } catch (error) {
      console.error('Billing portal error:', error);
      alert('Failed to open billing portal. Please try again.');
    } finally {
      setBillingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rich-black via-charcoal-gray to-rich-black">
      {/* Navigation Header */}
      <nav className="border-b border-slate-800/30 bg-rich-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
                <div className="w-8 h-8 bg-gradient-to-br from-electric-blue to-vibrant-purple rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-electric-blue to-vibrant-purple bg-clip-text text-transparent">
                  Promptly
                </h1>
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <Link 
                href="/"
                className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
              >
                Home
              </Link>
              <Link 
                href="/pricing"
                className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
              >
                Pricing
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-electric-blue to-vibrant-purple rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {(session.user?.name || session.user?.email || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-slate-300 text-sm">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-slate-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
          <p className="text-slate-300">Here's your prompt optimization overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Prompts Optimized</h3>
            {statsLoading ? (
              <div className="w-8 h-8 border-2 border-electric-blue border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <p className="text-3xl font-bold text-electric-blue">
                  {userStats?.thisMonthPrompts || 0}
                </p>
                <p className="text-slate-400 text-sm">This month</p>
              </>
            )}
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Subscription</h3>
            <p className="text-2xl font-bold text-vibrant-purple capitalize">
              {quotaInfo?.tier || (session.user as any)?.subscriptionTier || 'Free'}
            </p>
            <p className="text-slate-400 text-sm">Current plan</p>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Quota Remaining</h3>
            {statsLoading ? (
              <div className="w-8 h-8 border-2 border-lime-green border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <p className="text-3xl font-bold text-lime-green">
                  {quotaInfo?.remainingQuota || 0}
                </p>
                <p className="text-slate-400 text-sm">
                  of {quotaInfo?.quotaLimit || 0} prompts left
                </p>
              </>
            )}
          </div>
        </div>

        {/* Plan Status */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Current Plan</h2>
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-vibrant-purple capitalize">
                  {quotaInfo?.tier || (session.user as any)?.subscriptionTier || 'Free'}
                </span>
                <span className="text-slate-400 text-sm">
                  {quotaInfo?.remainingQuota || 0} of {quotaInfo?.quotaLimit || 50} prompts remaining
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {(quotaInfo?.tier || (session.user as any)?.subscriptionTier || 'Free') === 'FREE' ? (
                <button 
                  onClick={() => router.push('/pricing')}
                  className="bg-gradient-to-r from-electric-blue to-vibrant-purple text-white px-6 py-3 rounded-lg font-semibold hover:shadow-glow transition-all duration-200 transform hover:scale-105"
                >
                  Upgrade to Pro
                </button>
              ) : (
                <button 
                  onClick={handleBillingPortal}
                  disabled={billingLoading}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50"
                >
                  {billingLoading ? 'Loading...' : 'Manage Billing'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Extension Installation */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Browser Extension</h2>
              <p className="text-slate-400">Install the extension to start optimizing prompts automatically</p>
            </div>
            <button className="bg-gradient-to-r from-electric-blue to-vibrant-purple text-white px-6 py-3 rounded-lg font-semibold hover:shadow-glow transition-all duration-200 transform hover:scale-105">
              Install Extension
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          {statsLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : userStats?.recentPrompts && userStats.recentPrompts.length > 0 ? (
            <div className="space-y-4">
              {userStats.recentPrompts.map((prompt) => (
                <div key={prompt.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-slate-400">
                      {new Date(prompt.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-electric-blue bg-electric-blue/20 px-2 py-1 rounded">
                      {prompt.modelUsed}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Original:</p>
                      <p className="text-slate-300 text-sm line-clamp-2">
                        {prompt.originalPrompt}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Optimized:</p>
                      <p className="text-slate-200 text-sm line-clamp-2">
                        {prompt.optimizedPrompt}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-slate-400">No recent activity</p>
              <p className="text-slate-500 text-sm">Start optimizing prompts to see your history here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
