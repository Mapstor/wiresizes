'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { 
  Home, 
  RefreshCw, 
  AlertCircle,
  ArrowLeft,
  Calculator,
  Wrench
} from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
    
    // You could send this to a service like Sentry
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error);
    // }
  }, [error]);

  const quickLinks = [
    { 
      href: '/calculators/wire-size-calculator', 
      title: 'Wire Size Calculator',
      icon: <Calculator className="w-4 h-4" />
    },
    { 
      href: '/calculators/voltage-drop-calculator', 
      title: 'Voltage Drop Calculator',
      icon: <Calculator className="w-4 h-4" />
    },
    { 
      href: '/calculators', 
      title: 'All Calculators',
      icon: <Calculator className="w-4 h-4" />
    },
    { 
      href: '/guides', 
      title: 'Electrical Guides',
      icon: <Calculator className="w-4 h-4" />
    },
  ];

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-3xl w-full">
        {/* Error Icon and Message */}
        <section className="text-center mb-12" role="alert" aria-live="assertive">
          <div className="flex justify-center mb-6">
            <div className="relative animate-pulse">
              <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-16 h-16 text-orange-500" aria-hidden="true" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                <Wrench className="w-6 h-6 text-orange-600" aria-hidden="true" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Oops! Something Went Wrong
          </h1>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            We've encountered an unexpected electrical fault. Don't worry - no breakers were harmed! 
            Our team has been notified and is working to fix the issue.
          </p>

          {/* Error Details (in development) */}
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="mb-8 p-4 bg-red-100 border border-red-300 rounded-lg text-left max-w-2xl mx-auto">
              <h2 className="text-sm font-semibold text-red-900 mb-2">
                Error Details (Development Mode)
              </h2>
              <pre className="text-xs text-red-800 overflow-x-auto whitespace-pre-wrap font-mono">
                {error.message}
              </pre>
              {error.digest && (
                <p className="text-xs text-red-700 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="Try again"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
            >
              <Home className="w-5 h-5" />
              Go to Homepage
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>
        </section>

        {/* Quick Links Section */}
        <section aria-labelledby="quick-links-title">
          <h2 id="quick-links-title" className="text-xl font-bold text-neutral-900 mb-6 text-center">
            Quick Links to Popular Tools
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="bg-white p-4 rounded-lg border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                    {link.icon}
                  </div>
                  <span className="font-medium text-neutral-900 group-hover:text-primary-600 transition-colors">
                    {link.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Troubleshooting Tips */}
        <section className="mt-12 bg-blue-50 rounded-lg p-8" aria-labelledby="tips-title">
          <h2 id="tips-title" className="text-lg font-semibold text-neutral-900 mb-4">
            Troubleshooting Tips
          </h2>
          <ul className="space-y-2 text-neutral-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Try refreshing the page (Ctrl+F5 or Cmd+Shift+R)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Clear your browser cache and cookies</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Check if you're using the latest version of your browser</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Disable browser extensions that might interfere</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Try accessing the site in incognito/private mode</span>
            </li>
          </ul>
        </section>

        {/* Status Message */}
        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-500">
            Error reference: {new Date().toISOString()}
          </p>
          <p className="text-sm text-neutral-500 mt-1">
            If this problem persists, please contact support
          </p>
        </div>
      </div>
    </main>
  );
}