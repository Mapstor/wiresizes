import type { MetadataRoute } from 'next';
import { statSync } from 'node:fs';
import { join } from 'node:path';

const baseUrl = 'https://wiresizes.com';

// Returns the page.tsx mtime so lastmod actually reflects content changes
// instead of every build clobbering it to "now". Falls back to build time
// if the file isn't found (shouldn't happen for known routes).
function lastmod(routePath: string): Date {
  // routePath is e.g. '/calculators/wire-size-calculator'.
  // page.tsx lives at src/app<routePath>/page.tsx.
  const file = join(process.cwd(), 'src', 'app', routePath, 'page.tsx');
  try {
    return statSync(file).mtime;
  } catch {
    return new Date();
  }
}

const calculators = [
  // Wire & cable
  'wire-size-calculator',
  'voltage-drop-calculator',
  'ampacity-calculator',
  'ground-wire-calculator',
  'wire-resistance-calculator',
  'conduit-fill-calculator',
  'box-fill-calculator',
  'circuit-breaker-calculator',
  // Power conversions
  'watts-to-amps-calculator',
  'amps-to-watts-calculator',
  'volts-to-amps-calculator',
  'kilowatts-to-amps-calculator',
  'kva-to-amps-calculator',
  'horsepower-to-amps-calculator',
  'btu-to-watts-calculator',
  'ohms-law-calculator',
  // Equipment
  'ev-charger-calculator',
  'ev-charger-wire-size-calculator',
  'hot-tub-calculator',
  'hot-tub-wire-size-calculator',
  'air-conditioner-calculator',
  'dryer-calculator',
  'range-calculator',
  'welder-calculator',
  'pool-pump-calculator',
  'well-pump-calculator',
  'rv-hookup-calculator',
  'garage-subpanel-calculator',
  // Service / load
  'electrical-load-calculator',
  'residential-load-calculator',
  'service-entrance-calculator',
  'three-phase-calculator',
  'low-voltage-calculator',
  'motor-circuit',
];

const guides = [
  'wire-sizing-guide',
  'awg-wire-size-chart',
  'nec-table-310-16',
  'nec-code-compliance',
  'wire-size-for-100-amp',
  'wire-size-for-200-amp',
  'wire-size-for-ev-charger',
  'electrical-power-calculations',
  'electrical-safety',
  'single-vs-three-phase',
  'power-factor-explained',
];

// Calculators that get a slight priority boost because they target the
// strongest commercial intent / volume queries.
const TOP_CALCULATORS = new Set([
  'wire-size-calculator',
  'voltage-drop-calculator',
  'ampacity-calculator',
  'ev-charger-wire-size-calculator',
  'electrical-load-calculator',
]);

const TOP_GUIDES = new Set([
  'wire-sizing-guide',
  'awg-wire-size-chart',
  'nec-table-310-16',
  'wire-size-for-200-amp',
  'wire-size-for-ev-charger',
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const home: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: lastmod('/'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/calculators`,
      lastModified: lastmod('/calculators'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: lastmod('/guides'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  const calcEntries: MetadataRoute.Sitemap = calculators.map((slug) => ({
    url: `${baseUrl}/calculators/${slug}`,
    lastModified: lastmod(`/calculators/${slug}`),
    changeFrequency: 'monthly',
    priority: TOP_CALCULATORS.has(slug) ? 0.9 : 0.8,
  }));

  const guideEntries: MetadataRoute.Sitemap = guides.map((slug) => ({
    url: `${baseUrl}/guides/${slug}`,
    lastModified: lastmod(`/guides/${slug}`),
    changeFrequency: 'monthly',
    priority: TOP_GUIDES.has(slug) ? 0.8 : 0.7,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { path: '/about', priority: 0.5 },
    { path: '/contact', priority: 0.5 },
    { path: '/privacy', priority: 0.3 },
    { path: '/terms', priority: 0.3 },
    { path: '/disclaimer', priority: 0.3 },
  ].map(({ path, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: lastmod(path),
    changeFrequency: 'yearly',
    priority,
  }));

  return [...home, ...calcEntries, ...guideEntries, ...staticPages];
}
