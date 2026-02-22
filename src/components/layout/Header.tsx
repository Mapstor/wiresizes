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
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <nav className="container" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 font-bold text-xl text-primary-600 hover:text-primary-700 transition-colors"
          >
            <Zap className="w-6 h-6" />
            <span>WireSizes</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
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

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div 
            id="mobile-menu" 
            className="md:hidden py-4 border-t border-neutral-100 animate-fade-in"
          >
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
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