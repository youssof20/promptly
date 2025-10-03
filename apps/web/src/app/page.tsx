'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  
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
            <div className="flex items-center space-x-6">
              {session ? (
                <>
                  <Link 
                    href="/dashboard"
                    className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
                  >
                    Dashboard
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
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/signin"
                    className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/signup"
                    className="bg-gradient-to-r from-electric-blue to-vibrant-purple text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-200 transform hover:scale-105"
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
      <main className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 via-vibrant-purple/5 to-cyan-teal/5"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-electric-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-vibrant-purple/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm mb-8">
              <div className="w-2 h-2 bg-lime-green rounded-full mr-3 animate-pulse"></div>
              <span className="text-slate-300 text-sm font-medium">Now Available for Chrome & Edge</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
              <span className="block">AI Prompt</span>
              <span className="block bg-gradient-to-r from-electric-blue via-vibrant-purple to-cyan-teal bg-clip-text text-transparent">
                Optimization
              </span>
              <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-slate-300 mt-4">
                Made Simple
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed px-4">
              Automatically improve your prompts before sending to ChatGPT, Claude, and other AI systems. 
              <span className="text-white font-semibold block mt-2">Get better results without learning prompt engineering.</span>
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 px-4">
              <button className="group relative bg-gradient-to-r from-electric-blue to-vibrant-purple text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-electric-blue/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                <span className="relative z-10 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Install Extension
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/80 to-vibrant-purple/80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button 
                onClick={() => router.push('/pricing')}
                className="group border-2 border-slate-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:border-slate-500 hover:bg-slate-800/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  View Pricing
                </span>
              </button>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-24 px-4">
              <div className="group relative bg-slate-800/30 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 hover:border-electric-blue/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 to-vibrant-purple/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-electric-blue to-electric-blue/80 rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-electric-blue transition-colors duration-300">Automatic</h3>
                  <p className="text-slate-400 text-lg leading-relaxed">Seamless, background assistance that works across all AI platforms without any setup required.</p>
                </div>
              </div>

              <div className="group relative bg-slate-800/30 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 hover:border-vibrant-purple/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-vibrant-purple/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-vibrant-purple to-vibrant-purple/80 rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-vibrant-purple transition-colors duration-300">Private</h3>
                  <p className="text-slate-400 text-lg leading-relaxed">PII redaction, minimal storage, and optional local-only mode to keep your data secure.</p>
                </div>
              </div>

              <div className="group relative bg-slate-800/30 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 hover:border-cyan-teal/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-teal/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-teal to-cyan-teal/80 rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-teal transition-colors duration-300">Fast & Efficient</h3>
                  <p className="text-slate-400 text-lg leading-relaxed">Low-latency processing with smart caching and controlled AI API usage for optimal performance.</p>
                </div>
              </div>
            </div>

            {/* Demo Section */}
            <div className="relative bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-slate-700/50 overflow-hidden mx-4">
              <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 via-vibrant-purple/5 to-cyan-teal/5"></div>
              <div className="relative z-10">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                    See Promptly in Action
                  </h2>
                  <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
                    Watch how we transform your simple prompts into powerful, detailed instructions
                  </p>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                  {/* Before */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-crimson rounded-full"></div>
                      <h3 className="text-xl font-bold text-crimson">Before</h3>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50 relative">
                      <div className="absolute top-4 right-4 text-slate-500 text-sm">Basic Prompt</div>
                      <p className="text-slate-300 text-lg leading-relaxed">
                        &ldquo;help me write a blog post about ai&rdquo;
                      </p>
                    </div>
                    <div className="text-slate-400 text-sm space-y-1">
                      <p>❌ Vague and unclear</p>
                      <p>❌ No specific requirements</p>
                      <p>❌ Poor results from AI</p>
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  <div className="hidden lg:flex justify-center items-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-electric-blue to-vibrant-purple rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* After */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-lime-green rounded-full"></div>
                      <h3 className="text-xl font-bold text-lime-green">After</h3>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-xl border border-lime-green/30 relative">
                      <div className="absolute top-4 right-4 text-lime-green text-sm font-semibold">Optimized Prompt</div>
                      <p className="text-slate-300 text-lg leading-relaxed">
                        &ldquo;Write a comprehensive 1,500-word blog post about artificial intelligence, 
                        focusing on its current applications in healthcare, business automation, 
                        and creative industries. Include real-world examples, potential challenges, 
                        and future outlook. Target audience: general business professionals. 
                        Tone: informative yet accessible.&rdquo;
                      </p>
                    </div>
                    <div className="text-slate-400 text-sm space-y-1">
                      <p>✅ Clear and specific</p>
                      <p>✅ Detailed requirements</p>
                      <p>✅ Excellent AI results</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-rich-black/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-8 h-8 relative">
                <Image
                  src="/icon-500.png"
                  alt="Promptly Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-electric-blue to-vibrant-purple bg-clip-text text-transparent">
                Promptly
              </h2>
            </div>
            
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              The AI prompt optimizer that makes you more productive. 
              <span className="text-white font-semibold block mt-2">Transform your AI interactions today.</span>
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200 font-medium">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200 font-medium">
                Terms of Service
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200 font-medium">
                Support
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200 font-medium">
                Contact
              </a>
            </div>
            
            <div className="border-t border-slate-800/50 pt-6">
              <p className="text-slate-500 text-sm">
                © 2024 Promptly. All rights reserved. Made with ❤️ for AI enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}