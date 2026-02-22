'use client';

import Link from 'next/link';
import { 
  Home, 
  Calculator, 
  BookOpen, 
  Search,
  Zap,
  AlertTriangle,
  ArrowLeft,
  TrendingUp
} from 'lucide-react';

export default function NotFound() {
  const popularCalculators = [
    { 
      href: '/calculators/wire-size-calculator', 
      title: 'Wire Size Calculator',
      description: 'Calculate AWG wire size for any circuit'
    },
    { 
      href: '/calculators/voltage-drop-calculator', 
      title: 'Voltage Drop Calculator',
      description: 'Calculate voltage drop over distance'
    },
    { 
      href: '/calculators/ampacity-calculator', 
      title: 'Ampacity Calculator',
      description: 'Find wire current carrying capacity'
    },
    { 
      href: '/calculators/watts-to-amps-calculator', 
      title: 'Watts to Amps',
      description: 'Convert watts to amperage'
    },
  ];

  const categories = [
    {
      title: 'Wire & Cable Calculators',
      icon: <Zap className="w-5 h-5" />,
      href: '/calculators#wire-cable',
      count: 5
    },
    {
      title: 'Load & Power Calculators',
      icon: <TrendingUp className="w-5 h-5" />,
      href: '/calculators#load-power',
      count: 6
    },
    {
      title: 'Appliance Calculators',
      icon: <Calculator className="w-5 h-5" />,
      href: '/calculators#appliances',
      count: 12
    },
    {
      title: 'Electrical Guides',
      icon: <BookOpen className="w-5 h-5" />,
      href: '/guides',
      count: 11
    },
  ];

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="max-w-5xl w-full">
        {/* Error Message Section */}
        <section className="text-center mb-12" role="main" aria-labelledby="error-title">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-16 h-16 text-red-500" aria-hidden="true" />
              </div>
              <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                <span className="text-4xl font-bold text-red-600">404</span>
              </div>
            </div>
          </div>
          
          <h1 id="error-title" className="text-4xl font-bold text-neutral-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            Looks like this circuit is broken! The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <form action="/search" method="GET" className="relative">
              <input
                type="search"
                name="q"
                placeholder="Search for calculators or guides..."
                className="w-full px-4 py-3 pl-12 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                aria-label="Search"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" aria-hidden="true" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              Go to Homepage
            </Link>
            <Link
              href="/calculators"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
            >
              <Calculator className="w-5 h-5" />
              Browse All Calculators
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

        {/* Popular Calculators Section */}
        <section className="mb-12" aria-labelledby="popular-title">
          <h2 id="popular-title" className="text-2xl font-bold text-neutral-900 mb-6 text-center">
            Popular Calculators
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularCalculators.map((calc) => (
              <Link
                key={calc.href}
                href={calc.href}
                className="bg-white p-4 rounded-lg border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                    <Calculator className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                      {calc.title}
                    </h3>
                    <p className="text-sm text-neutral-600 mt-1">
                      {calc.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section aria-labelledby="categories-title">
          <h2 id="categories-title" className="text-2xl font-bold text-neutral-900 mb-6 text-center">
            Browse by Category
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="bg-white p-6 rounded-lg border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all group text-center"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-200 transition-colors">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-neutral-500 mt-1">
                  {category.count} tools available
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Help Section */}
        <section className="mt-12 text-center bg-blue-50 rounded-lg p-8" aria-labelledby="help-title">
          <h2 id="help-title" className="text-xl font-semibold text-neutral-900 mb-4">
            Need Help Finding Something?
          </h2>
          <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
            If you're looking for a specific calculator or guide that seems to be missing, 
            it might have been moved or renamed. Check our full calculator list or contact us for assistance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/sitemap"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              View Sitemap
            </Link>
            <span className="text-neutral-400">•</span>
            <Link
              href="/guides"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              Browse Guides
            </Link>
            <span className="text-neutral-400">•</span>
            <Link
              href="/about"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              About Us
            </Link>
          </div>
        </section>

        {/* Schema Markup for 404 Page */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "404 Error - Page Not Found",
              "description": "The requested page could not be found on WireSizes.com",
              "url": "https://wiresizes.com/404",
              "isPartOf": {
                "@type": "WebSite",
                "name": "WireSizes.com",
                "url": "https://wiresizes.com"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://wiresizes.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
      </div>
    </main>
  );
}