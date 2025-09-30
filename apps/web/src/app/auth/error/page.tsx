'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const errorMessages: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'Access denied. You do not have permission to sign in.',
  Verification: 'The verification token has expired or has already been used.',
  Default: 'An error occurred during authentication.',
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Default';
  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Authentication Error</h1>
          <p className="text-slate-300">Something went wrong during sign in</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-900/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold text-white mb-2">Sign In Failed</h2>
            <p className="text-slate-300 mb-6">{errorMessage}</p>

            <div className="space-y-3">
              <Link
                href="/auth/signin"
                className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200"
              >
                Try Again
              </Link>
              
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center px-4 py-3 border border-slate-600 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-white font-medium transition-all duration-200"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-slate-400 text-sm">
            Need help?{' '}
            <Link href="/support" className="text-blue-400 hover:text-blue-300">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
