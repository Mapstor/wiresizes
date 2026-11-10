'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Calculator, BookOpen, Zap } from 'lucide-react';

const navigation = [
  { name: 'Calculators', href: '/calculators', icon: Calculator },
  { name: 'Guides', href: '/guides', icon: BookOpen },
  { name: 'About', href: '/about', icon: null },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
      <nav className="container" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 font-bold text-xl text-primary-600 hover:text-primary-700 transition-colors group"
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center group-hover:from-primary-600 group-hover:to-primary-800 transition-all">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <span className="leading-tight" data-name="">WireSizes</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                data-name=""
                className="flex items-center gap-2 px-4 py-2.5 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all font-medium border border-transparent hover:border-primary-100"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              type="button"
              className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors border border-neutral-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">
                {mobileMenuOpen ? 'Close menu' : 'Open menu'}
              </span>
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div 
            id="mobile-menu" 
            className="md:hidden py-4 border-t border-neutral-100 animate-fade-in bg-neutral-50"
          >
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  data-name=""
                  className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:text-primary-600 hover:bg-white rounded-lg transition-colors font-medium border border-transparent hover:border-primary-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}