'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import { useEffect } from 'react';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // Demo functionality
    const demoBtn = document.getElementById('demo-optimize-btn');
    const demoPrompt = document.getElementById('demo-prompt') as HTMLTextAreaElement;
    const demoResult = document.getElementById('demo-result');
    const demoOptimizedText = document.getElementById('demo-optimized-text');

    if (demoBtn && demoPrompt && demoResult && demoOptimizedText) {
      demoBtn.addEventListener('click', async () => {
        const prompt = demoPrompt.value.trim();
        if (!prompt) {
          demoPrompt.value = 'help me write a blog post about ai';
          return;
        }

        (demoBtn as HTMLButtonElement).disabled = true;
        demoBtn.innerHTML = `
          <span class="flex items-center justify-center">
            <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Optimizing...
          </span>
        `;

        try {
          // Simulate API call with mock optimization
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const optimizedPrompt = `Write a comprehensive, well-structured ${prompt.includes('blog') ? 'blog post' : 'piece of content'} about ${prompt.includes('ai') ? 'artificial intelligence' : 'the topic'}. 

Please ensure your response:
- Is clear, detailed, and actionable
- Includes specific examples where relevant
- Addresses potential follow-up questions
- Is organized in a logical structure
- Provides practical insights and recommendations
- Uses an engaging, professional tone

Please proceed with your response.`;

          demoOptimizedText.textContent = optimizedPrompt;
          demoResult.classList.remove('hidden');
          demoResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (error) {
          console.error('Demo optimization failed:', error);
        } finally {
          (demoBtn as HTMLButtonElement).disabled = false;
          demoBtn.innerHTML = `
            <span class="flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Optimize with AI
            </span>
          `;
        }
      });
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-rich-black via-charcoal-gray to-rich-black">
      <Header />

      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/3 via-vibrant-purple/3 to-cyan-teal/3"></div>
        
        {/* Abstract floating elements inspired by winning SaaS sites */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-electric-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-vibrant-purple/5 rounded-full blur-3xl"></div>
        
        {/* Additional abstract elements */}
        <div className="absolute top-40 right-1/3 w-32 h-32 bg-cyan-teal/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-40 left-1/3 w-24 h-24 bg-lime-green/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/6 w-16 h-16 bg-amber/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/6 w-20 h-20 bg-vibrant-purple/10 rounded-full blur-xl animate-float" style={{ animationDelay: '0.5s' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-800/40 border border-slate-700/40 backdrop-blur-sm mb-8">
              <div className="w-2 h-2 bg-lime-green rounded-full mr-3 animate-pulse"></div>
              <span className="text-slate-300 text-sm font-medium">Now Available for Chrome & Edge</span>
            </div>
            
            {/* Main Heading - Transformational messaging */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight tracking-tight" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
              <span className="block">Write Once.</span>
              <span className="block bg-gradient-to-r from-electric-blue via-vibrant-purple to-cyan-teal bg-clip-text text-transparent">
                Think Better.
              </span>
              <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-300 mt-6 tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                Because how you ask matters.
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed px-4" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
              Transform your simple prompts into powerful, detailed instructions that get you better results from AI. 
              <span className="text-white font-medium block mt-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>No prompt engineering skills required.</span>
            </p>
            
            {/* CTA Buttons - Clean extension-style */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 px-4">
              <Link href="/install" className="bg-gradient-to-r from-electric-blue to-vibrant-purple text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Install Extension
                </span>
              </Link>
              
              <button 
                onClick={() => router.push('/pricing')}
                className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:border-white/50 hover:bg-white/10 transition-all duration-200 transform hover:-translate-y-1"
                style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  View Pricing
                </span>
              </button>
            </div>

            {/* Real Testimonials */}
            <div className="mb-20">
              <p className="text-slate-400 text-sm mb-8 font-medium">What users are saying</p>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/30">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-electric-blue to-vibrant-purple rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold text-sm">SJ</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Sarah Johnson</p>
                      <p className="text-slate-400 text-sm">Content Creator</p>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    "Promptly has completely transformed how I interact with AI. My prompts are now 10x more effective, and I get exactly what I need every time."
                  </p>
                </div>
                
                <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/30">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-vibrant-purple to-cyan-teal rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold text-sm">MR</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Mike Rodriguez</p>
                      <p className="text-slate-400 text-sm">Product Manager</p>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    "As someone who uses AI daily for work, Promptly saves me hours every week. The optimization suggestions are spot-on."
                  </p>
                </div>
                
                <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/30">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-teal to-lime-green rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold text-sm">AL</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Alex Liu</p>
                      <p className="text-slate-400 text-sm">Developer</p>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    "Finally, a tool that makes AI actually useful for complex tasks. Promptly turns my rough ideas into precise, actionable prompts."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-24 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
              Why Choose Promptly?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
              Built for modern AI workflows with enterprise-grade security and performance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative bg-slate-800/20 backdrop-blur-sm p-10 rounded-3xl border border-slate-700/20 hover:border-electric-blue/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-3">
              <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 to-vibrant-purple/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-electric-blue to-electric-blue/80 rounded-2xl mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-glow">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-6 group-hover:text-electric-blue transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Automatic</h3>
                <p className="text-slate-300 text-lg leading-relaxed">Seamless, background assistance that works across all AI platforms without any setup required.</p>
              </div>
            </div>

            <div className="group relative bg-slate-800/20 backdrop-blur-sm p-10 rounded-3xl border border-slate-700/20 hover:border-vibrant-purple/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-3">
              <div className="absolute inset-0 bg-gradient-to-br from-vibrant-purple/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-vibrant-purple to-vibrant-purple/80 rounded-2xl mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-glow-purple">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-6 group-hover:text-vibrant-purple transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Private</h3>
                <p className="text-slate-300 text-lg leading-relaxed">PII redaction, minimal storage, and optional local-only mode to keep your data secure.</p>
              </div>
            </div>

            <div className="group relative bg-slate-800/20 backdrop-blur-sm p-10 rounded-3xl border border-slate-700/20 hover:border-cyan-teal/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-3">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-teal/5 to-teal-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-teal to-cyan-teal/80 rounded-2xl mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-glow">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-6 group-hover:text-cyan-teal transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Fast & Efficient</h3>
                <p className="text-slate-300 text-lg leading-relaxed">Low-latency processing with smart caching and controlled AI API usage for optimal performance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-slate-800/20 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-slate-700/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 via-vibrant-purple/5 to-cyan-teal/5"></div>
            <div className="relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                  See the Magic Happen
                </h2>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                  Watch how Promptly transforms a simple thought into a powerful, detailed prompt
                </p>
              </div>
              
              {/* Interactive Demo */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-700/30 mb-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Try It Yourself</h3>
                    <p className="text-slate-400">Type a simple prompt below and see how Promptly improves it</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Your Prompt</label>
                      <textarea
                        id="demo-prompt"
                        className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg p-4 text-white placeholder-slate-400 focus:border-electric-blue/50 focus:ring-1 focus:ring-electric-blue/20 transition-all duration-200"
                        placeholder="e.g., help me write a blog post about ai"
                        rows={3}
                      ></textarea>
                    </div>
                    
                    <div className="text-center">
                      <button
                        id="demo-optimize-btn"
                        className="bg-gradient-to-r from-electric-blue to-vibrant-purple text-white px-8 py-3 rounded-lg font-semibold hover:shadow-glow transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Optimize with AI
                        </span>
                      </button>
                    </div>
                    
                    <div id="demo-result" className="hidden">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Optimized Prompt</label>
                      <div className="bg-slate-800/50 border border-lime-green/30 rounded-lg p-4">
                        <p id="demo-optimized-text" className="text-slate-200 leading-relaxed"></p>
                      </div>
                      <div className="mt-3 flex items-center justify-center space-x-4 text-sm text-slate-400">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-lime-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          More specific
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-lime-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Better structure
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-lime-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Clearer context
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Static Example */}
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                  {/* Before */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-crimson rounded-full"></div>
                      <h3 className="text-lg font-semibold text-crimson">Before</h3>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/30">
                      <p className="text-slate-300 text-sm leading-relaxed">
                        "help me write a blog post about ai"
                      </p>
                    </div>
                    <div className="text-slate-400 text-xs space-y-1">
                      <p>❌ Vague and unclear</p>
                      <p>❌ No specific requirements</p>
                      <p>❌ Poor results from AI</p>
                    </div>
                  </div>
                  
                  {/* After */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-lime-green rounded-full"></div>
                      <h3 className="text-lg font-semibold text-lime-green">After</h3>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-lime-green/30">
                      <p className="text-slate-200 text-sm leading-relaxed">
                        "Write a comprehensive 1,500-word blog post about artificial intelligence, 
                        focusing on its current applications in healthcare, business automation, 
                        and creative industries. Include real-world examples, potential challenges, 
                        and future outlook. Target audience: general business professionals. 
                        Tone: informative yet accessible."
                      </p>
                    </div>
                    <div className="text-slate-400 text-xs space-y-1">
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
      </section>


      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
            Ready to Transform Your AI Workflow?
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
            Join thousands of professionals who've already optimized their AI interactions. 
            Start free, upgrade anytime.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/install" className="group relative bg-gradient-to-r from-electric-blue to-vibrant-purple text-white px-8 py-4 rounded-xl font-medium text-lg hover:shadow-glow transition-all duration-300 transform hover:scale-105 hover:-translate-y-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
              <span className="relative z-10 flex items-center justify-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Install Extension
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/80 to-vibrant-purple/80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <button 
              onClick={() => router.push('/pricing')}
              className="group border-2 border-slate-600 text-white px-8 py-4 rounded-xl font-medium text-lg hover:border-slate-500 hover:bg-slate-800/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                View Pricing
              </span>
            </button>
          </div>
          
          <p className="text-slate-400 text-sm mt-6">
            Free forever • No credit card required • 30-day money-back guarantee
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/30 bg-rich-black/80 backdrop-blur-sm">
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
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-electric-blue to-vibrant-purple bg-clip-text text-transparent">
                Promptly
              </h2>
            </div>
            
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              The AI prompt optimizer that makes you more productive. 
              <span className="text-white font-medium block mt-2">Transform your AI interactions today.</span>
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
            
            <div className="border-t border-slate-800/30 pt-6">
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