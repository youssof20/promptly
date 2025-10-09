'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';

export default function InstallPage() {
  const { data: session } = useSession();
  const [browser, setBrowser] = useState<'chrome' | 'edge' | 'firefox' | 'unknown'>('unknown');
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect browser
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('edg/')) {
      setBrowser('edge');
    } else if (userAgent.includes('chrome')) {
      setBrowser('chrome');
    } else if (userAgent.includes('firefox')) {
      setBrowser('firefox');
    }

    // Check if extension is already installed
    checkExtensionInstalled();
  }, []);

  const checkExtensionInstalled = () => {
    // Try to detect if extension is installed
    const checkInterval = setInterval(() => {
      if (window.promptlyExtensionInstalled) {
        setIsInstalled(true);
        clearInterval(checkInterval);
      }
    }, 1000);

    // Stop checking after 10 seconds
    setTimeout(() => clearInterval(checkInterval), 10000);
  };

  const getInstallationSteps = () => {
    switch (browser) {
      case 'chrome':
        return [
          {
            step: 1,
            title: 'Download the Extension',
            description: 'Click the "Add to Chrome" button below to download the Promptly extension.',
            action: (
              <a
                href="https://chrome.google.com/webstore/detail/promptly-ai-prompt-optimizer/your-extension-id"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-electric-blue to-vibrant-purple text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-glow transition-all duration-200 transform hover:scale-105 inline-flex items-center"
              >
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Add to Chrome
              </a>
            )
          },
          {
            step: 2,
            title: 'Confirm Installation',
            description: 'Click "Add extension" in the Chrome Web Store popup to confirm installation.',
            action: null
          },
          {
            step: 3,
            title: 'Sign In to Your Account',
            description: 'Click the Promptly extension icon in your browser toolbar and sign in with your account.',
            action: session ? (
              <div className="bg-lime-green/20 border border-lime-green/30 rounded-lg p-4">
                <p className="text-lime-green font-medium">✓ You're already signed in!</p>
                <p className="text-slate-300 text-sm mt-1">The extension will automatically sync with your account.</p>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-gradient-to-r from-electric-blue to-vibrant-purple text-white px-6 py-3 rounded-lg font-semibold hover:shadow-glow transition-all duration-200"
              >
                Sign In to Your Account
              </Link>
            )
          },
          {
            step: 4,
            title: 'Start Optimizing',
            description: 'Visit any AI platform (ChatGPT, Claude, etc.) and start typing. You\'ll see optimization hints appear automatically.',
            action: null
          }
        ];
      case 'edge':
        return [
          {
            step: 1,
            title: 'Download the Extension',
            description: 'Click the "Get" button below to download the Promptly extension from Microsoft Edge Add-ons.',
            action: (
              <a
                href="https://microsoftedge.microsoft.com/addons/detail/promptly-ai-prompt-optimizer/your-extension-id"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-electric-blue to-vibrant-purple text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-glow transition-all duration-200 transform hover:scale-105 inline-flex items-center"
              >
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Get for Edge
              </a>
            )
          },
          {
            step: 2,
            title: 'Confirm Installation',
            description: 'Click "Add" in the Edge Add-ons popup to confirm installation.',
            action: null
          },
          {
            step: 3,
            title: 'Sign In to Your Account',
            description: 'Click the Promptly extension icon in your browser toolbar and sign in with your account.',
            action: session ? (
              <div className="bg-lime-green/20 border border-lime-green/30 rounded-lg p-4">
                <p className="text-lime-green font-medium">✓ You're already signed in!</p>
                <p className="text-slate-300 text-sm mt-1">The extension will automatically sync with your account.</p>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-gradient-to-r from-electric-blue to-vibrant-purple text-white px-6 py-3 rounded-lg font-semibold hover:shadow-glow transition-all duration-200"
              >
                Sign In to Your Account
              </Link>
            )
          },
          {
            step: 4,
            title: 'Start Optimizing',
            description: 'Visit any AI platform (ChatGPT, Claude, etc.) and start typing. You\'ll see optimization hints appear automatically.',
            action: null
          }
        ];
      default:
        return [
          {
            step: 1,
            title: 'Choose Your Browser',
            description: 'Promptly is available for Chrome and Microsoft Edge browsers.',
            action: (
              <div className="flex gap-4">
                <a
                  href="https://chrome.google.com/webstore/detail/promptly-ai-prompt-optimizer/your-extension-id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-electric-blue to-vibrant-purple text-white px-6 py-3 rounded-lg font-semibold hover:shadow-glow transition-all duration-200 inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Chrome
                </a>
                <a
                  href="https://microsoftedge.microsoft.com/addons/detail/promptly-ai-prompt-optimizer/your-extension-id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-electric-blue to-vibrant-purple text-white px-6 py-3 rounded-lg font-semibold hover:shadow-glow transition-all duration-200 inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Edge
                </a>
              </div>
            )
          }
        ];
    }
  };

  const steps = getInstallationSteps();

  if (isInstalled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rich-black via-charcoal-gray to-rich-black">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="w-20 h-20 bg-lime-green/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-lime-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Extension Installed Successfully!
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Promptly is now active in your browser. Visit any AI platform and start optimizing your prompts automatically.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-electric-blue to-vibrant-purple text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-glow transition-all duration-200 transform hover:scale-105"
              >
                Go to Dashboard
              </Link>
              
              <button
                onClick={() => window.close()}
                className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:border-white/50 hover:bg-white/10 transition-all duration-200"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rich-black via-charcoal-gray to-rich-black">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-gradient-to-br from-electric-blue to-vibrant-purple rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Install Promptly Extension
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Get automatic prompt optimization on all your favorite AI platforms. 
            <span className="text-white font-medium block mt-2">Install once, optimize everywhere.</span>
          </p>
        </div>

        {/* Installation Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={step.step} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-gradient-to-br from-electric-blue to-vibrant-purple rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">{step.step}</span>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-300 text-lg mb-6">{step.description}</p>
                  
                  {step.action && (
                    <div className="mt-4">
                      {step.action}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Preview */}
        <div className="mt-16 bg-slate-800/30 rounded-2xl p-8 border border-slate-700/30">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            What You'll Get
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-electric-blue/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Automatic Detection</h3>
              <p className="text-slate-400 text-sm">Works on ChatGPT, Claude, Bard, and 20+ other AI platforms</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-vibrant-purple/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-vibrant-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Optimization</h3>
              <p className="text-slate-400 text-sm">AI-powered improvements that make your prompts more effective</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-teal/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-cyan-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Privacy First</h3>
              <p className="text-slate-400 text-sm">Your prompts are processed securely with minimal data storage</p>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 mb-4">Need help with installation?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@promptly.ai"
              className="text-electric-blue hover:text-electric-blue/80 transition-colors duration-200 font-medium"
            >
              Contact Support
            </a>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <Link
              href="/dashboard"
              className="text-electric-blue hover:text-electric-blue/80 transition-colors duration-200 font-medium"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
