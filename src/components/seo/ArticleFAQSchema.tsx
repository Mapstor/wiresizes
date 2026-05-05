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

interface FAQItem {
  question: string;
  answer: string;
}

interface ArticleFAQSchemaProps {
  article: ArticleData;
  faqItems: FAQItem[];
}

const FALLBACK_DATE = '2026-01-01';

export function ArticleFAQSchema({ article, faqItems }: ArticleFAQSchemaProps) {
  const articleSchema = {
    '@type': 'Article',
    '@id': `${article.url}#article`,
    headline: article.headline,
    description: article.description,
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

  const faqPageSchema = {
    '@type': 'FAQPage',
    '@id': `${article.url}#faq`,
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };

  const breadcrumbSchema = generateBreadcrumbSchema(article.url);

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [articleSchema, faqPageSchema, breadcrumbSchema]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
    />
  );
}