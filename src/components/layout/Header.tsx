'use client';

// The site header in the picked look (D-33, WSZ-025): the WireSizes wordmark in Archivo, the three section links
// underlined in copper, a warm hairline below. Phones get the same links behind a menu button.
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const navigation = [
  { name: 'Calculators', href: '/calculators' },
  { name: 'Guides', href: '/guides' },
  { name: 'About', href: '/about' },
];

const NAV_LINK =
  'font-display font-medium text-ink underline decoration-cut-line decoration-2 underline-offset-[6px] transition-colors hover:text-cut-deep hover:decoration-cut-deep';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-cut-rule bg-white">
      <nav className="container" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="font-display text-2xl font-extrabold tracking-tight text-ink transition-colors hover:text-cut-deep">
            <span className="leading-tight" data-name="">
              WireSizes
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} data-name="" className={`py-2 text-base ${NAV_LINK}`}>
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="rounded-md border border-cut-rule p-2 text-ink transition-colors hover:border-ink"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {mobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="border-t border-cut-rule py-3 md:hidden">
            <div className="flex flex-col">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  data-name=""
                  className={`px-1 py-3 text-lg ${NAV_LINK}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
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
