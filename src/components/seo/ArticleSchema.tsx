import { generateBreadcrumbSchema } from '@/utils/breadcrumbs';
import { ORGANIZATION, ORGANIZATION_REF, PERSON, PERSON_REF } from '@/lib/identity';

interface ArticleData {
  headline: string;
  description: string;
  url: string;
  /** YYYY-MM-DD, from src/data/page-dates.json (articleDates() in src/lib/page-dates.ts). */
  datePublished: string;
  /** YYYY-MM-DD, from src/data/page-dates.json (articleDates() in src/lib/page-dates.ts). */
  dateModified: string;
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
    image: {
      '@type': 'ImageObject',
      url: 'https://wiresizes.com/opengraph-image',
      width: 1200,
      height: 630
    },
    author: PERSON_REF,
    publisher: ORGANIZATION_REF,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url
    }
  };

  const breadcrumbSchema = generateBreadcrumbSchema(article.url);

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [articleSchema, breadcrumbSchema, PERSON, ORGANIZATION]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
    />
  );
}