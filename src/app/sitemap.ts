import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://wiresizes.com';

  const calculators = [
    'wire-size-calculator',
    'voltage-drop-calculator',
    'watts-to-amps-calculator',
    'amps-to-watts-calculator',
    'volts-to-amps-calculator',
    'kilowatts-to-amps-calculator',
    'horsepower-to-amps-calculator',
    'btu-to-watts-calculator',
    'kva-to-amps-calculator',
    'ohms-law-calculator',
    'conduit-fill-calculator',
    'box-fill-calculator',
    'ground-wire-calculator',
    'ampacity-calculator',
    'ev-charger-calculator',
    'hot-tub-calculator',
    'welder-calculator',
    'pool-pump-calculator',
    'well-pump-calculator',
    'air-conditioner-calculator',
    'dryer-calculator',
    'range-calculator',
    'garage-subpanel-calculator',
    'rv-hookup-calculator',
    'circuit-breaker-calculator',
    'electrical-load-calculator',
    'three-phase-calculator',
    'low-voltage-calculator',
    'wire-resistance-calculator'
  ];

  const guides = [
    'wire-size-for-100-amp',
    'wire-size-for-200-amp',
    'wire-size-for-ev-charger',
    'awg-wire-size-chart',
    'nec-table-310-16',
    'wire-sizing-guide',
    'electrical-safety',
    'nec-code-compliance',
    'electrical-power-calculations',
    'single-vs-three-phase',
    'power-factor-explained'
  ];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/calculators`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...calculators.map((calc) => ({
      url: `${baseUrl}/calculators/${calc}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...guides.map((guide) => ({
      url: `${baseUrl}/guides/${guide}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}