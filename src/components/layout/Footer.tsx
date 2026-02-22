import Link from 'next/link';
import { Zap, Calculator, Wrench, Home, Cpu, ArrowRight } from 'lucide-react';

const footerLinks = {
  coreCalculators: [
    { name: 'Wire Size Calculator', href: '/calculators/wire-size-calculator' },
    { name: 'Voltage Drop Calculator', href: '/calculators/voltage-drop-calculator' },
    { name: 'Ampacity Calculator', href: '/calculators/ampacity-calculator' },
    { name: 'Ground Wire Calculator', href: '/calculators/ground-wire-size' },
    { name: 'Ohms Law Calculator', href: '/calculators/ohms-law' },
    { name: 'View All Core Tools', href: '/calculators', isViewAll: true },
  ],
  conversionCalculators: [
    { name: 'Watts to Amps', href: '/calculators/watts-to-amps' },
    { name: 'Amps to Watts', href: '/calculators/amps-to-watts' },
    { name: 'kW to Amps Calculator', href: '/calculators/kw-to-amps' },
    { name: 'Horsepower to Amps', href: '/calculators/horsepower-to-amps' },
    { name: 'View All Conversions', href: '/calculators', isViewAll: true },
  ],
  equipmentCalculators: [
    { name: 'AC Wire Size', href: '/calculators/ac-wire-size' },
    { name: 'EV Charger Wire Size', href: '/calculators/ev-charger-wire-size-calculator' },
    { name: 'Hot Tub Wire Size', href: '/calculators/hot-tub-wire-size-calculator' },
    { name: 'Garage Subpanel', href: '/calculators/garage-subpanel-wire-size' },
    { name: 'Pool Pump Calculator', href: '/calculators/pool-pump' },
    { name: 'View All Equipment', href: '/calculators', isViewAll: true },
  ],
  advancedCalculators: [
    { name: 'Three Phase Calculator', href: '/calculators/three-phase' },
    { name: 'Conduit Fill Calculator', href: '/calculators/conduit-fill' },
    { name: 'Electrical Load Calculator', href: '/calculators/residential-load-calculator' },
    { name: 'Service Entrance Calculator', href: '/calculators/service-entrance-calculator' },
    { name: 'Motor Circuit Calculator', href: '/calculators/motor-circuit' },
    { name: 'View All Advanced', href: '/calculators', isViewAll: true },
  ],
  guides: [
    { name: 'Wire Size for 100 Amp', href: '/guides/wire-size-for-100-amp' },
    { name: 'Wire Size for 200 Amp', href: '/guides/wire-size-for-200-amp' },
    { name: 'EV Charger Wire Guide', href: '/guides/wire-size-for-ev-charger' },
    { name: 'AWG Wire Size Chart', href: '/guides/awg-wire-size-chart' },
    { name: 'NEC Table 310.16', href: '/guides/nec-table-310-16' },
    { name: 'View All Guides', href: '/guides', isViewAll: true },
  ],
  resources: [
    { name: 'Wire Sizing Guide', href: '/guides/wire-sizing-guide' },
    { name: 'Electrical Safety', href: '/guides/electrical-safety' },
    { name: 'NEC Code Compliance', href: '/guides/nec-code-compliance' },
    { name: 'Power Calculations', href: '/guides/electrical-power-calculations' },
    { name: 'Single vs Three Phase', href: '/guides/single-vs-three-phase' },
    { name: 'Power Factor Explained', href: '/guides/power-factor-explained' },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-blue-900 text-white">
      {/* Main Footer Content */}
      <div className="container py-16">
        {/* Brand and Description */}
        <div className="mb-12">
          <Link 
            href="/" 
            className="flex items-center gap-3 font-bold text-2xl text-yellow-400 mb-4"
          >
            <div className="p-2 bg-yellow-400/20 rounded-lg">
              <Zap className="w-8 h-8" />
            </div>
            <span>WireSizes.com</span>
          </Link>
          <p className="text-neutral-300 text-lg max-w-2xl leading-relaxed">
            Professional electrical wire sizing calculators and comprehensive guides based on NEC 2023 requirements. 
            Trusted by electricians, contractors, engineers, and electrical professionals worldwide.
          </p>
          <div className="flex gap-6 mt-4 text-sm text-neutral-400">
            <span>🔥 30+ Professional Tools</span>
            <span>⚡ NEC 2023 Compliant</span>
            <span>🌍 Used in 50+ Countries</span>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          
          {/* Core Calculators */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Core Tools</h3>
            </div>
            <ul className="space-y-2">
              {footerLinks.coreCalculators.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className={`text-neutral-300 hover:text-blue-400 text-sm transition-colors flex items-center gap-1 ${
                      link.isViewAll ? 'font-semibold mt-3 text-blue-300' : ''
                    }`}
                  >
                    {link.isViewAll && <ArrowRight className="w-3 h-3" />}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Power Conversions */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-white">Conversions</h3>
            </div>
            <ul className="space-y-2">
              {footerLinks.conversionCalculators.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className={`text-neutral-300 hover:text-yellow-400 text-sm transition-colors flex items-center gap-1 ${
                      link.isViewAll ? 'font-semibold mt-3 text-yellow-300' : ''
                    }`}
                  >
                    {link.isViewAll && <ArrowRight className="w-3 h-3" />}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Equipment Specific */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="w-5 h-5 text-green-400" />
              <h3 className="font-semibold text-white">Equipment</h3>
            </div>
            <ul className="space-y-2">
              {footerLinks.equipmentCalculators.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className={`text-neutral-300 hover:text-green-400 text-sm transition-colors flex items-center gap-1 ${
                      link.isViewAll ? 'font-semibold mt-3 text-green-300' : ''
                    }`}
                  >
                    {link.isViewAll && <ArrowRight className="w-3 h-3" />}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Advanced Calculators */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5 text-purple-400" />
              <h3 className="font-semibold text-white">Advanced</h3>
            </div>
            <ul className="space-y-2">
              {footerLinks.advancedCalculators.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className={`text-neutral-300 hover:text-purple-400 text-sm transition-colors flex items-center gap-1 ${
                      link.isViewAll ? 'font-semibold mt-3 text-purple-300' : ''
                    }`}
                  >
                    {link.isViewAll && <ArrowRight className="w-3 h-3" />}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Guides */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-5 h-5 text-orange-400" />
              <h3 className="font-semibold text-white">Wire Guides</h3>
            </div>
            <ul className="space-y-2">
              {footerLinks.guides.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className={`text-neutral-300 hover:text-orange-400 text-sm transition-colors flex items-center gap-1 ${
                      link.isViewAll ? 'font-semibold mt-3 text-orange-300' : ''
                    }`}
                  >
                    {link.isViewAll && <ArrowRight className="w-3 h-3" />}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Education */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-5 h-5 text-red-400" />
              <h3 className="font-semibold text-white">Education</h3>
            </div>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-neutral-300 hover:text-red-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Professional Authority Links */}
        <div className="mt-12 pt-8 border-t border-neutral-700">
          <h3 className="font-semibold text-white mb-4">Industry Standards & Authority Links</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <a href="https://www.nfpa.org/codes-and-standards/nfpa-70-national-electrical-code" 
              target="_blank" rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all text-center">
              <div className="text-xs font-semibold text-red-400">NFPA 70</div>
              <div className="text-xs text-neutral-400">National Electrical Code</div>
            </a>
            <a href="https://www.ul.com/news/understanding-wire-and-cable" 
              target="_blank" rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all text-center">
              <div className="text-xs font-semibold text-blue-400">UL Standards</div>
              <div className="text-xs text-neutral-400">Wire & Cable Testing</div>
            </a>
            <a href="https://www.copper.org/applications/electrical/building/" 
              target="_blank" rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all text-center">
              <div className="text-xs font-semibold text-orange-400">Copper Dev Assoc</div>
              <div className="text-xs text-neutral-400">Technical Resources</div>
            </a>
            <a href="https://www.aluminum.org/resources/electrical" 
              target="_blank" rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all text-center">
              <div className="text-xs font-semibold text-gray-400">Aluminum Assoc</div>
              <div className="text-xs text-neutral-400">Electrical Apps</div>
            </a>
            <a href="https://iaei.org/" 
              target="_blank" rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all text-center">
              <div className="text-xs font-semibold text-green-400">IAEI</div>
              <div className="text-xs text-neutral-400">Electrical Inspectors</div>
            </a>
            <a href="https://www.neca-neis.org/" 
              target="_blank" rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all text-center">
              <div className="text-xs font-semibold text-purple-400">NECA</div>
              <div className="text-xs text-neutral-400">Electrical Contractors</div>
            </a>
          </div>
        </div>

        {/* Professional Disclaimer */}
        <div className="mt-8 pt-6 border-t border-neutral-700">
          <div className="bg-amber-600/20 border border-amber-500/30 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="text-amber-400 flex-shrink-0">⚠️</div>
              <div>
                <p className="text-amber-200 text-sm font-semibold mb-1">Professional Disclaimer</p>
                <p className="text-amber-100 text-sm leading-relaxed">
                  These calculators are provided for reference and educational purposes only. All electrical work 
                  must be performed by licensed professionals in accordance with local electrical codes and regulations. 
                  Always verify calculations with official NEC tables and consult your local Authority Having Jurisdiction (AHJ). 
                  Users assume full responsibility for the application of these calculations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-neutral-900 border-t border-neutral-700">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p className="text-neutral-400 text-sm">
                © {currentYear} WireSizes.com. All rights reserved.
              </p>
              <div className="text-neutral-500 text-xs">
                Professional electrical calculation tools • NEC 2023 compliant • Trusted worldwide
              </div>
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <Link 
                href="/about"
                className="text-neutral-400 hover:text-blue-400 transition-colors"
              >
                About
              </Link>
              <Link 
                href="/terms"
                className="text-neutral-400 hover:text-blue-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                href="/privacy"
                className="text-neutral-400 hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/contact"
                className="text-neutral-400 hover:text-blue-400 transition-colors"
              >
                Contact
              </Link>
              <Link 
                href="/disclaimer"
                className="text-neutral-400 hover:text-blue-400 transition-colors"
              >
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}