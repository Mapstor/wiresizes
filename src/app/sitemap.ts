import type { MetadataRoute } from 'next';
import { pageDates } from '@/lib/page-dates';

const baseUrl = 'https://wiresizes.com';

// lastmod is the route's modified date in src/data/page-dates.json, as YYYY-MM-DD (D-17): the day its last body-text
// change went live. A route without an entry fails the build.
function lastmod(routePath: string): string {
  return pageDates(routePath).modified;
}

const calculators = [
  // Wire & cable
  'wire-size-calculator',
  'voltage-drop-calculator',
  'ampacity-calculator',
  'ground-wire-calculator',
  'wire-resistance-calculator',
  // Power conversions
  'watts-to-amps-calculator',
  'amps-to-watts-calculator',
  'volts-to-amps-calculator',
  'kilowatts-to-amps-calculator',
  'kva-to-amps-calculator',
  'btu-to-watts-calculator',
  'ohms-law-calculator',
  // Service / load
  'service-entrance-calculator',
  'three-phase-calculator',
  'low-voltage-calculator',
];

const guides = [
  'awg-wire-size-chart',
  'nec-table-310-16',
  'nec-code-compliance',
  'wire-size-for-100-amp',
  'wire-size-for-200-amp',
  'wire-size-for-ev-charger',
  'electrical-power-calculations',
  'single-vs-three-phase',
  'power-factor-explained',
];

// Calculators that get a slight priority boost because they target the
// strongest commercial intent / volume queries.
const TOP_CALCULATORS = new Set([
  'wire-size-calculator',
  'voltage-drop-calculator',
  'ampacity-calculator',
]);

const TOP_GUIDES = new Set([
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
