'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rich-black via-charcoal-gray to-rich-black">
      {/* Header */}
      <header className="border-b border-slate-800/30 bg-rich-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-electric-blue to-vibrant-purple bg-clip-text text-transparent">
                Promptly
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/your-username/promptly"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </a>
              <a
                href="#install"
                className="bg-gradient-to-r from-electric-blue to-vibrant-purple text-white px-6 py-2 rounded-lg font-semibold hover:shadow-glow transition-all duration-200"
              >
                Get Extension
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/3 via-vibrant-purple/3 to-cyan-teal/3"></div>
        
        {/* Abstract floating elements */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-electric-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-vibrant-purple/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-800/40 border border-slate-700/40 backdrop-blur-sm mb-8">
              <div className="w-2 h-2 bg-lime-green rounded-full mr-3 animate-pulse"></div>
              <span className="text-slate-300 text-sm font-medium">Open Source • Free • Privacy-First</span>
            </div>
            
            {/* Main Heading */}
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
              <span className="text-white font-medium block mt-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>No prompt engineering skills required. Use your own API keys. Completely free.</span>
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 px-4">
              <a 
                href="#install" 
                className="bg-gradient-to-r from-electric-blue to-vibrant-purple text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1" 
                style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Install Extension
                </span>
              </a>
              
              <a 
                href="https://github.com/your-username/promptly"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:border-white/50 hover:bg-white/10 transition-all duration-200 transform hover:-translate-y-1"
                style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View on GitHub
                </span>
              </a>
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
              Built for modern AI workflows with privacy-first design and open-source transparency
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
                <p className="text-slate-300 text-lg leading-relaxed">Uses your own API keys, supports local AI models, and never sends your data to our servers.</p>
              </div>
            </div>

            <div className="group relative bg-slate-800/20 backdrop-blur-sm p-10 rounded-3xl border border-slate-700/20 hover:border-cyan-teal/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-3">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-teal/5 to-teal-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-teal to-cyan-teal/80 rounded-2xl mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-glow">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-6 group-hover:text-cyan-teal transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Open Source</h3>
                <p className="text-slate-300 text-lg leading-relaxed">Completely free, open source, and transparent. No hidden costs, no data collection, no vendor lock-in.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
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
              
              {/* Demo Example */}
              <div className="max-w-4xl mx-auto">
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

      {/* Supported Platforms */}
      <section className="py-24 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
              Works Everywhere
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
              Promptly works on all major AI platforms and writing tools
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              'ChatGPT', 'Claude', 'Gemini', 'DeepSeek', 'Poe', 'Perplexity',
              'You.com', 'Hugging Face', 'Together AI', 'LM Studio', 'Ollama', 'Cursor'
            ].map((platform) => (
              <div key={platform} className="bg-slate-800/30 rounded-lg p-4 text-center border border-slate-700/30 hover:border-electric-blue/30 transition-all duration-300">
                <div className="text-slate-300 font-medium text-sm">{platform}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section id="install" className="py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
            Ready to Get Started?
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
            Install the extension, configure your AI provider, and start getting better results from AI.
          </p>
          
          <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700/30 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">Installation Steps</h3>
            <div className="space-y-4 text-left max-w-2xl mx-auto">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-electric-blue rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                <div>
                  <p className="text-white font-medium">Download the extension</p>
                  <p className="text-slate-400 text-sm">Get it from Chrome Web Store or Edge Add-ons</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-vibrant-purple rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                <div>
                  <p className="text-white font-medium">Configure your AI provider</p>
                  <p className="text-slate-400 text-sm">Add your API key or local AI endpoint in settings</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-cyan-teal rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                <div>
                  <p className="text-white font-medium">Start optimizing prompts</p>
                  <p className="text-slate-400 text-sm">Visit any AI platform and watch the magic happen</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://chrome.google.com/webstore/detail/promptly/your-extension-id"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-electric-blue to-vibrant-purple text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
            >
              Install for Chrome
            </a>
            <a
              href="https://microsoftedge.microsoft.com/addons/detail/promptly/your-extension-id"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:border-white/50 hover:bg-white/10 transition-all duration-200 transform hover:-translate-y-1"
            >
              Install for Edge
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            <div className="bg-slate-800/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Is Promptly really free?
              </h3>
              <p className="text-slate-300">
                Yes! Promptly is completely free and open source. You only pay for your own AI API usage, 
                which is typically very affordable. We don't charge anything and never will.
              </p>
            </div>

            <div className="bg-slate-800/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                What AI providers are supported?
              </h3>
              <p className="text-slate-300">
                We support OpenAI (GPT-4, GPT-3.5), Anthropic (Claude), Google (Gemini), DeepSeek, 
                and local models via Ollama and LM Studio. You can use any or all of these providers.
              </p>
            </div>

            <div className="bg-slate-800/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Is my data private?
              </h3>
              <p className="text-slate-300">
                Absolutely! We never see your prompts or data. Everything is processed using your own API keys 
                or local AI models. Your data never leaves your control.
              </p>
            </div>

            <div className="bg-slate-800/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Can I contribute to the project?
              </h3>
              <p className="text-slate-300">
                Yes! Promptly is open source and we welcome contributions. Check out our GitHub repository 
                for ways to contribute, report issues, or suggest new features.
              </p>
            </div>
          </div>
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
              The open-source AI prompt optimizer that makes you more productive. 
              <span className="text-white font-medium block mt-2">Transform your AI interactions today.</span>
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <a href="/privacy" className="text-slate-400 hover:text-white transition-colors duration-200 font-medium">
                Privacy Policy
              </a>
              <a href="/terms" className="text-slate-400 hover:text-white transition-colors duration-200 font-medium">
                Terms of Service
              </a>
              <a href="https://github.com/your-username/promptly" className="text-slate-400 hover:text-white transition-colors duration-200 font-medium">
                GitHub
              </a>
              <a href="https://github.com/your-username/promptly/issues" className="text-slate-400 hover:text-white transition-colors duration-200 font-medium">
                Support
              </a>
            </div>
            
            <div className="border-t border-slate-800/30 pt-6">
              <p className="text-slate-500 text-sm">
                © 2024 Promptly. Open source under MIT License. Made with ❤️ for the AI community.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}