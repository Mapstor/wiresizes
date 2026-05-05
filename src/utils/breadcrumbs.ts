// Stop words that should stay lowercase except when they're the first
// word in a title — matches AP/Chicago title-case conventions and looks
// natural in SERP breadcrumb rich results.
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor',
  'of', 'on', 'or', 'so', 'the', 'to', 'up', 'vs', 'with', 'yet',
]);

// Initialisms that must stay uppercase. Includes the common electrical
// acronyms used in wire-sizing slugs.
const ACRONYMS = new Set([
  'awg', 'nec', 'ev', 'ac', 'dc', 'hp', 'rv', 'btu', 'hvac',
  'pvc', 'thhn', 'thwn', 'mcm', 'kcmil', 'fla', 'flc', 'mca',
  'mocp', 'gfci', 'afci', 'osha', 'nfpa', 'iaei', 'ul', 'neca',
]);

// Mixed-case technical terms (the SI / electrical convention).
const MIXED_CASE: Record<string, string> = {
  kva: 'kVA',
  kw: 'kW',
  mw: 'MW',
  ohms: "Ohm's", // "ohms-law" → "Ohm's Law"
};

// Per-slug overrides for cases where naive splitting can't recover
// the canonical display name (e.g. dotted NEC table numbers).
const SLUG_OVERRIDES: Record<string, string> = {
  'nec-table-310-16': 'NEC Table 310.16',
};

/**
 * Converts a slug string to a human-friendly title.
 * Example: "wire-size-for-200-amp" → "Wire Size for 200 Amp"
 *          "nec-code-compliance"   → "NEC Code Compliance"
 *          "kva-to-amps-calculator" → "kVA to Amps Calculator"
 */
function slugToTitle(slug: string): string {
  if (SLUG_OVERRIDES[slug]) return SLUG_OVERRIDES[slug];

  return slug
    .split('-')
    .map((word, idx) => {
      const lower = word.toLowerCase();
      if (ACRONYMS.has(lower)) return lower.toUpperCase();
      if (MIXED_CASE[lower]) return MIXED_CASE[lower];
      if (idx > 0 && STOP_WORDS.has(lower)) return lower;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Generates breadcrumb items from a URL path
 * Example: "/calculators/wire-size-calculator" → 
 * [
 *   { name: "Home", url: "https://wiresizes.com" },
 *   { name: "Calculators", url: "https://wiresizes.com/calculators" }, 
 *   { name: "Wire Size Calculator", url: "https://wiresizes.com/calculators/wire-size-calculator" }
 * ]
 */
export function generateBreadcrumbs(url: string) {
  const baseUrl = 'https://wiresizes.com';
  const urlObj = new URL(url);
  const pathSegments = urlObj.pathname.split('/').filter(segment => segment !== '');
  
  // Always start with Home
  const breadcrumbs = [
    {
      name: 'Home',
      url: baseUrl
    }
  ];
  
  // Build breadcrumbs for each path segment
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Convert segment to title case
    let name = slugToTitle(segment);
    
    // Special handling for common sections
    if (segment === 'calculators') {
      name = 'Calculators';
    } else if (segment === 'guides') {
      name = 'Guides';
    }
    
    breadcrumbs.push({
      name,
      url: `${baseUrl}${currentPath}`
    });
  });
  
  return breadcrumbs;
}

/**
 * Generates BreadcrumbList schema from URL
 */
export function generateBreadcrumbSchema(url: string) {
  const breadcrumbs = generateBreadcrumbs(url);
  
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url
    }))
  };
}