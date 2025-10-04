'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="border-b border-slate-800/30 bg-rich-black/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
              <div className="w-8 h-8 relative">
                <Image
                  src="/icon-500.png"
                  alt="Promptly Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                  priority
                  onError={(e) => {
                    // Fallback to gradient icon if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-electric-blue to-vibrant-purple rounded-xl flex items-center justify-center hidden">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-electric-blue to-vibrant-purple bg-clip-text text-transparent">
                Promptly
              </h1>
            </Link>
          </div>

          {/* Navigation Links */}
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
            
            {session ? (
              <>
                <Link 
                  href="/dashboard"
                  className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  Dashboard
                </Link>
                
                {/* User Menu */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-electric-blue to-vibrant-purple rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {(session.user?.name || session.user?.email || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-slate-300 text-sm">
                      {session.user?.name || session.user?.email}
                    </span>
                    <svg 
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-sm rounded-lg border border-slate-700/50 shadow-lg">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-slate-700/50">
                          <p className="text-sm text-slate-300">
                            {session.user?.name || session.user?.email}
                          </p>
                          <p className="text-xs text-slate-500">
                            {session.user?.email}
                          </p>
                        </div>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors duration-200"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
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
                  className="bg-gradient-to-r from-electric-blue to-vibrant-purple text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-glow transition-all duration-200 transform hover:scale-105"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
