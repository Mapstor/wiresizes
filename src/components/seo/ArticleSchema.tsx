import { generateBreadcrumbSchema } from '@/utils/breadcrumbs';

interface ArticleData {
  headline: string;
  description: string;
  url: string;
  /** ISO date (YYYY-MM-DD). Use getArticleDates() for git-derived values. */
  datePublished?: string;
  /** ISO date (YYYY-MM-DD). Use getArticleDates() for git-derived values. */
  dateModified?: string;
}

interface ArticleSchemaProps {
  article: ArticleData;
}

const FALLBACK_DATE = '2026-01-01';

export function ArticleSchema({ article }: ArticleSchemaProps) {
  const articleSchema = {
    '@type': 'Article',
    '@id': `${article.url}#article`,
    headline: article.headline,
    description: article.description,
    image: {
      '@type': 'ImageObject',
      url: 'https://wiresizes.com/opengraph-image',
      width: 1200,
      height: 630
    },
    author: {
      '@type': 'Organization',
      '@id': 'https://wiresizes.com/#organization',
      name: 'WireSizes.com',
      url: 'https://wiresizes.com'
    },
    publisher: {
      '@type': 'Organization',
      '@id': 'https://wiresizes.com/#organization',
      name: 'WireSizes.com',
      url: 'https://wiresizes.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://wiresizes.com/icon.svg',
        width: 512,
        height: 512
      }
    },
    datePublished: article.datePublished ?? FALLBACK_DATE,
    dateModified: article.dateModified ?? article.datePublished ?? FALLBACK_DATE,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url
    }
  };

  const breadcrumbSchema = generateBreadcrumbSchema(article.url);

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [articleSchema, breadcrumbSchema]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
    />
  );
}