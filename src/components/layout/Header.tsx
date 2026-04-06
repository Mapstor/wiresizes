'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Calculator, BookOpen, Zap, Shield, Award, Users } from 'lucide-react';

const navigation = [
  { name: 'Calculators', href: '/calculators', icon: Calculator },
  { name: 'Guides', href: '/guides', icon: BookOpen },
  { name: 'About', href: '/about', icon: null },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
      {/* Professional Trust Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-1.5">
        <div className="container">
          <div className="flex items-center justify-center gap-6 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              <span>NEC Code Compliant</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <Award className="w-3 h-3" />
              <span>Professional Grade</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5">
              <Users className="w-3 h-3" />
              <span>Trusted by 50,000+ Electricians</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="container" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          {/* Enhanced Logo */}
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
            <div className="flex flex-col">
              <span className="leading-tight">WireSizes</span>
              <span className="text-xs font-normal text-neutral-500 leading-none">Professional Tools</span>
            </div>
          </Link>

          {/* Desktop Navigation with Professional Styling */}
          <div className="hidden md:flex items-center gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2.5 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all font-medium border border-transparent hover:border-primary-100"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.name}
              </Link>
            ))}
            <div className="ml-3 pl-3 border-l border-neutral-200">
              <div className="flex flex-col text-right">
                <span className="text-xs font-semibold text-green-600">FREE</span>
                <span className="text-xs text-neutral-500">Always</span>
              </div>
            </div>
          </div>

          {/* Mobile menu button with professional styling */}
          <div className="md:hidden flex items-center gap-3">
            <div className="flex flex-col text-right">
              <span className="text-xs font-semibold text-green-600">FREE</span>
              <span className="text-xs text-neutral-500">Always</span>
            </div>
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

        {/* Enhanced Mobile Navigation */}
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
                  className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:text-primary-600 hover:bg-white rounded-lg transition-colors font-medium border border-transparent hover:border-primary-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  {item.name}
                </Link>
              ))}
              <div className="mt-3 pt-3 border-t border-neutral-200 px-4">
                <div className="flex items-center gap-4 text-xs text-neutral-600">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-blue-600" />
                    <span>NEC Compliant</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-3 h-3 text-blue-600" />
                    <span>Professional</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}