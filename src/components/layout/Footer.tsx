// The site footer in the picked look (D-33, WSZ-025): white with ink type and copper-underlined links, the same
// groups, site pages, trademark notice and disclaimer as before.
import Link from 'next/link';
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
  const groups = [
    { id: 'core', title: 'Core Tools', links: footerLinks.coreCalculators },
    { id: 'conversions', title: 'Conversions', links: footerLinks.conversionCalculators },
    { id: 'advanced', title: 'Advanced', links: footerLinks.advancedCalculators },
    { id: 'guides', title: 'Wire Guides', links: footerLinks.guides },
    { id: 'education', title: 'Education', links: footerLinks.resources },
  ];
  const link =
    'text-ink underline decoration-cut-line decoration-1 underline-offset-[3px] transition-colors hover:text-cut-deep hover:decoration-2';

  return (
    <footer className="border-t-2 border-ink bg-white font-display text-ink">
      <div className="container py-14">
        <div className="mb-10">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-ink hover:text-cut-deep">
            <span data-name="">WireSizes.com</span>
          </Link>
          <p className="mt-2 max-w-2xl text-lg leading-relaxed text-cut-muted">
            Wire gauge charts, NEC table values and calculators for sizing conductors.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 border-t border-cut-rule pt-8 md:grid-cols-2 lg:grid-cols-5">
          {groups.map((group) => (
            <div key={group.id}>
              <h3 className="mb-3 text-base font-bold text-ink">{group.title}</h3>
              <ul className="space-y-2 text-[0.9375rem]">
                {group.links.map((item) => (
                  <li key={item.href + item.name}>
                    <Link href={item.href} data-name="" className={`${link} ${'isViewAll' in item && item.isViewAll ? 'font-semibold' : ''}`}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-cut-rule pt-8">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem]">
            {sitePages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} data-name="" className={link}>
                  {page.name}
                </Link>
              </li>
            ))}
            <li>
              <CookieSettingsButton className={link} />
            </li>
          </ul>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-cut-muted">
            NFPA 70®, National Electrical Code® and NEC® are registered trademarks of the National Fire Protection
            Association. wiresizes.com is not affiliated with or endorsed by NFPA.
          </p>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink">
            <strong className="font-bold">Disclaimer.</strong> Reference values for planning. Check them against the NEC edition your
            jurisdiction enforces and the equipment&apos;s instructions. The author is a physicist, not a licensed electrician or engineer.
          </p>
        </div>
      </div>

      <div className="border-t border-cut-rule">
        <div className="container py-6">
          <p className="text-sm text-cut-muted">© {currentYear} Moving Data Systems d.o.o.</p>
        </div>
      </div>
    </footer>
  );
}
