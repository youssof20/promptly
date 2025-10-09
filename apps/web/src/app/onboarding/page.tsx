'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isExtensionInstalled, setIsExtensionInstalled] = useState(false);

  useEffect(() => {
    // Check if extension is installed
    checkExtensionInstalled();
  }, []);

  const checkExtensionInstalled = () => {
    // Try to detect if extension is installed
    const checkInterval = setInterval(() => {
      if (window.promptlyExtensionInstalled) {
        setIsExtensionInstalled(true);
        clearInterval(checkInterval);
      }
    }, 1000);

    // Stop checking after 10 seconds
    setTimeout(() => clearInterval(checkInterval), 10000);
  };

  const steps = [
    {
      title: 'Welcome to Promptly!',
      subtitle: 'Let\'s get you set up in just a few steps',
      content: (
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-electric-blue to-vibrant-purple rounded-2xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Welcome to Promptly!</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            You're about to transform how you interact with AI. Promptly automatically improves your prompts 
            to get you better results from ChatGPT, Claude, and other AI platforms.
          </p>
          <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/30 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-white mb-3">What you'll get:</h3>
            <ul className="text-slate-300 space-y-2 text-left">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-lime-green mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Automatic prompt optimization
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-lime-green mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Works on 20+ AI platforms
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-lime-green mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Privacy-first design
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-lime-green mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Free tier with 50 optimizations/month
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: 'Install the Extension',
      subtitle: 'This is where the magic happens',
      content: (
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-electric-blue to-vibrant-purple rounded-2xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Install the Extension</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            The Promptly extension automatically detects when you're typing prompts on AI platforms 
            and offers to optimize them for you.
          </p>
          
          {isExtensionInstalled ? (
            <div className="bg-lime-green/20 border border-lime-green/30 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-lime-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-lime-green mb-2">Extension Installed!</h3>
              <p className="text-slate-300 text-sm">Great! You're all set to start optimizing prompts.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Link
                href="/install"
                className="bg-gradient-to-r from-electric-blue to-vibrant-purple text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-glow transition-all duration-200 transform hover:scale-105 inline-flex items-center"
              >
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Install Extension
              </Link>
              <p className="text-slate-400 text-sm">Click to open the installation guide</p>
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Try It Out',
      subtitle: 'See Promptly in action',
      content: (
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-electric-blue to-vibrant-purple rounded-2xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Try It Out</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Now that you have Promptly installed, let's see how it works. 
            Visit any AI platform and start typing a prompt.
          </p>
          
          <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/30 max-w-2xl mx-auto mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">How it works:</h3>
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-electric-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="text-white font-medium">Visit an AI platform</p>
                  <p className="text-slate-400 text-sm">Go to ChatGPT, Claude, Bard, or any other supported platform</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-electric-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="text-white font-medium">Start typing your prompt</p>
                  <p className="text-slate-400 text-sm">Type a simple prompt like "help me write a blog post"</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-electric-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="text-white font-medium">Click the optimization hint</p>
                  <p className="text-slate-400 text-sm">Promptly will show a hint below your text - click it to optimize</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-electric-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">4</span>
                </div>
                <div>
                  <p className="text-white font-medium">Get better results</p>
                  <p className="text-slate-400 text-sm">Your prompt is automatically improved and replaced</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://chat.openai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-electric-blue to-vibrant-purple text-white px-6 py-3 rounded-lg font-semibold hover:shadow-glow transition-all duration-200"
            >
              Try on ChatGPT
            </Link>
            <Link
              href="https://claude.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:border-white/50 hover:bg-white/10 transition-all duration-200"
            >
              Try on Claude
            </Link>
          </div>
        </div>
      )
    },
    {
      title: 'You\'re All Set!',
      subtitle: 'Start optimizing your prompts',
      content: (
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-lime-green to-cyan-teal rounded-2xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">You're All Set!</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Promptly is now active and ready to help you get better results from AI. 
            Start using it on any supported platform!
          </p>
          
          <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/30 max-w-md mx-auto mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">Your account:</h3>
            <div className="text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Plan:</span>
                <span className="text-white font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Optimizations:</span>
                <span className="text-white font-medium">50/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Extension:</span>
                <span className="text-lime-green font-medium">✓ Installed</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-electric-blue to-vibrant-purple text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-glow transition-all duration-200 transform hover:scale-105"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/pricing"
              className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:border-white/50 hover:bg-white/10 transition-all duration-200"
            >
              View Pricing
            </Link>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/dashboard');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rich-black via-charcoal-gray to-rich-black">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-400">Step {currentStep + 1} of {steps.length}</span>
            <button
              onClick={skipOnboarding}
              className="text-slate-400 hover:text-white transition-colors duration-200 text-sm"
            >
              Skip
            </button>
          </div>
          <div className="w-full bg-slate-700/30 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-electric-blue to-vibrant-purple h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-slate-800/20 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-slate-700/30 min-h-[500px] flex items-center">
          <div className="w-full">
            {steps[currentStep].content}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="border-2 border-slate-600 text-slate-300 px-6 py-3 rounded-lg font-semibold hover:border-slate-500 hover:bg-slate-800/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentStep 
                    ? 'bg-electric-blue' 
                    : index < currentStep 
                      ? 'bg-electric-blue/50' 
                      : 'bg-slate-600'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextStep}
            className="bg-gradient-to-r from-electric-blue to-vibrant-purple text-white px-6 py-3 rounded-lg font-semibold hover:shadow-glow transition-all duration-200 transform hover:scale-105"
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
