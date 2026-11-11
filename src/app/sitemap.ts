import type { MetadataRoute } from 'next';
import { pageDates } from '@/lib/page-dates';
import { sectionRoutes } from '@/lib/routes';

const baseUrl = 'https://wiresizes.com';

// lastmod is the route's modified date in src/data/page-dates.json, as YYYY-MM-DD (D-17): the day its last body-text
// change went live. A route without an entry fails the build.
function lastmod(routePath: string): string {
  return pageDates(routePath).modified;
}

// Live calculators and guides from the route list (src/lib/routes.ts, D-26), the same list the homepage and hubs show
const calculators = sectionRoutes('calculators').map((r) => r.path);
const guides = sectionRoutes('guides').map((r) => r.path);

// Calculators that get a slight priority boost because they target the
// strongest commercial intent / volume queries.
const TOP_CALCULATORS = new Set([
  '/calculators/wire-size-calculator',
  '/calculators/voltage-drop-calculator',
  '/calculators/ampacity-calculator',
]);

const TOP_GUIDES = new Set([
  '/guides/awg-wire-size-chart',
  '/guides/nec-table-310-16',
  '/guides/wire-size-for-200-amp',
  '/guides/wire-size-for-ev-charger',
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

  const calcEntries: MetadataRoute.Sitemap = calculators.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: lastmod(path),
    changeFrequency: 'monthly',
    priority: TOP_CALCULATORS.has(path) ? 0.9 : 0.8,
  }));

  const guideEntries: MetadataRoute.Sitemap = guides.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: lastmod(path),
    changeFrequency: 'monthly',
    priority: TOP_GUIDES.has(path) ? 0.8 : 0.7,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { path: '/about', priority: 0.5 },
    { path: '/methodology', priority: 0.5 },
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
