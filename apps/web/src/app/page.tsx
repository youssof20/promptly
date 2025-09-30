'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] to-[#1a1a1a]">
      {/* Navigation */}
      <nav className="border-b border-[#374151] bg-[#0D0D0D]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold gradient-text">Promptly</h1>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <Link 
                    href="/dashboard"
                    className="text-[#9CA3AF] hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                  <span className="text-[#9CA3AF]">Welcome, {session.user?.name || session.user?.email}</span>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/signin"
                    className="text-[#9CA3AF] hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/signup"
                    className="gradient-bg text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            AI Prompt Optimization
            <span className="block gradient-text">Made Simple</span>
          </h1>
          <p className="text-xl text-[#D1D5DB] mb-8 max-w-3xl mx-auto animate-fade-in">
            Automatically improve your prompts before sending to ChatGPT, Claude, and other AI systems. 
            Get better results without learning prompt engineering.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
            <button className="gradient-bg text-white px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity glow-blue">
              Install Extension
            </button>
            <button 
              onClick={() => router.push('/pricing')}
              className="border border-[#374151] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#1F1F1F] transition-colors"
            >
              View Pricing
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-[#1F1F1F] p-8 rounded-xl border border-[#374151] hover:border-[#3B82F6] transition-colors">
              <div className="w-12 h-12 gradient-bg rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Automatic</h3>
              <p className="text-[#9CA3AF]">Seamless, background assistance that works across all AI platforms</p>
            </div>

            <div className="bg-[#1F1F1F] p-8 rounded-xl border border-[#374151] hover:border-[#8B5CF6] transition-colors">
              <div className="w-12 h-12 gradient-bg rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Private</h3>
              <p className="text-[#9CA3AF]">PII redaction, minimal storage, optional local-only mode</p>
            </div>

            <div className="bg-[#1F1F1F] p-8 rounded-xl border border-[#374151] hover:border-[#06B6D4] transition-colors">
              <div className="w-12 h-12 gradient-bg rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Fast & Efficient</h3>
              <p className="text-[#9CA3AF]">Low-latency, controlled AI API usage with smart caching</p>
            </div>
          </div>

          {/* Demo Section */}
          <div className="bg-[#1F1F1F] rounded-2xl p-8 border border-[#374151]">
            <h2 className="text-3xl font-bold text-white mb-8">See Promptly in Action</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-[#9CA3AF] mb-4">Before</h3>
                <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#374151]">
                  <p className="text-[#D1D5DB]">&ldquo;help me write a blog post about ai&rdquo;</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#22C55E] mb-4">After</h3>
                <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#22C55E]">
                  <p className="text-[#D1D5DB]">
                    &ldquo;Write a comprehensive 1,500-word blog post about artificial intelligence, 
                    focusing on its current applications in healthcare, business automation, 
                    and creative industries. Include real-world examples, potential challenges, 
                    and future outlook. Target audience: general business professionals. 
                    Tone: informative yet accessible.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#374151] bg-[#0D0D0D] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold gradient-text mb-4">Promptly</h2>
            <p className="text-[#9CA3AF] mb-8">The AI prompt optimizer that makes you more productive</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-[#9CA3AF] hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-[#9CA3AF] hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-[#9CA3AF] hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
