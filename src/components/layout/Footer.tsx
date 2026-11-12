import Link from 'next/link';
import { Zap, Calculator, Home, Cpu, ArrowRight } from 'lucide-react';
import { CookieSettingsButton } from '@/components/analytics/Consent';

const footerLinks = {
  coreCalculators: [
    { name: 'Wire Size Calculator', href: '/calculators/wire-size-calculator' },
    { name: 'Voltage Drop Calculator', href: '/calculators/voltage-drop-calculator' },
    { name: 'Ampacity Calculator', href: '/calculators/ampacity-calculator' },
    { name: 'Ground Wire Calculator', href: '/calculators/ground-wire-calculator' },
    { name: 'Wire Resistance Calculator', href: '/calculators/wire-resistance-calculator' },
    { name: 'View All Core Tools', href: '/calculators', isViewAll: true },
  ],
  conversionCalculators: [
    { name: 'Watts to Amps', href: '/calculators/watts-to-amps-calculator' },
    { name: 'Amps to Watts', href: '/calculators/amps-to-watts-calculator' },
    { name: 'Volts to Amps', href: '/calculators/volts-to-amps-calculator' },
    { name: 'Kilowatts to Amps', href: '/calculators/kilowatts-to-amps-calculator' },
    { name: 'kVA to Amps', href: '/calculators/kva-to-amps-calculator' },
    { name: 'BTU to Watts', href: '/calculators/btu-to-watts-calculator' },
    { name: "Ohm's Law Calculator", href: '/calculators/ohms-law-calculator' },
    { name: 'View All Conversions', href: '/calculators', isViewAll: true },
  ],
  advancedCalculators: [
    { name: 'Three Phase Calculator', href: '/calculators/three-phase-calculator' },
    { name: 'Low Voltage Calculator', href: '/calculators/low-voltage-calculator' },
    { name: 'Service Entrance Calculator', href: '/calculators/service-entrance-calculator' },
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
    { name: 'NEC Edition by State', href: '/guides/nec-code-compliance' },
    { name: 'Power Calculations', href: '/guides/electrical-power-calculations' },
    { name: 'Single vs Three Phase', href: '/guides/single-vs-three-phase' },
    { name: 'Power Factor Explained', href: '/guides/power-factor-explained' },
  ],
};

const sitePages = [
  { name: 'About', href: '/about' },
  { name: 'Methodology', href: '/methodology' },
  { name: 'Contact', href: '/contact' },
  { name: 'Privacy', href: '/privacy' },
  { name: 'Terms', href: '/terms' },
  { name: 'Disclaimer', href: '/disclaimer' },
];

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
            <span data-name="">WireSizes.com</span>
          </Link>
          <p className="text-neutral-300 text-lg max-w-2xl leading-relaxed">
            Wire gauge charts, NEC table values and calculators for sizing conductors.
          </p>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
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
                    data-name=""
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
                    data-name=""
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
                    data-name=""
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
                    data-name=""
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
                    data-name=""
                    className="text-neutral-300 hover:text-red-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Site pages and trademark notice */}
        <div className="mt-12 pt-8 border-t border-neutral-700">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {sitePages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} data-name="" className="text-neutral-300 hover:text-blue-400 transition-colors">
                  {page.name}
                </Link>
              </li>
            ))}
            <li>
              <CookieSettingsButton className="text-neutral-300 hover:text-blue-400 transition-colors" />
            </li>
          </ul>
          <p className="mt-4 text-neutral-400 text-xs leading-relaxed max-w-3xl">
            NFPA 70®, National Electrical Code® and NEC® are registered trademarks of the National Fire Protection
            Association. wiresizes.com is not affiliated with or endorsed by NFPA.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-6 border-t border-neutral-700">
          <div className="bg-amber-600/20 border border-amber-500/30 rounded-lg p-4">
            <p className="text-amber-200 text-sm font-semibold mb-1">Disclaimer</p>
            <p className="text-amber-100 text-sm leading-relaxed">
              Reference values for planning. Check them against the NEC edition your jurisdiction enforces and the
              equipment&apos;s instructions. The author is a physicist, not a licensed electrician or engineer.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-neutral-900 border-t border-neutral-700">
        <div className="container py-6">
          <p className="text-neutral-400 text-sm">© {currentYear} Moving Data Systems d.o.o.</p>
        </div>
      </div>
    </footer>
  );
}