import Script from 'next/script';
import { generateBreadcrumbSchema } from '@/utils/breadcrumbs';

interface ArticleData {
  headline: string;
  description: string;
  url: string;
}

interface ArticleSchemaProps {
  article: ArticleData;
}

export function ArticleSchema({ article }: ArticleSchemaProps) {
  const articleSchema = {
    '@type': 'Article',
    '@id': `${article.url}#article`,
    headline: article.headline,
    description: article.description,
    author: {
      '@type': 'Organization',
      name: 'WireSizes.com',
      url: 'https://www.wiresizes.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'WireSizes.com',
      url: 'https://www.wiresizes.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://wiresizes.com/icon.svg',
        width: 512,
        height: 512
      }
    },
    datePublished: '2026-01-01',
    dateModified: new Date().toISOString().split('T')[0],
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
    <Script
      id={`article-schema-${article.url.replace(/[^a-zA-Z0-9]/g, '-')}`}
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
    />
  );
}