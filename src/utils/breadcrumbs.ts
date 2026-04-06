/**
 * Converts a slug string to title case
 * Example: "wire-size-calculator" → "Wire Size Calculator"
 */
function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
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