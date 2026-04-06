import { generateBreadcrumbSchema } from '@/utils/breadcrumbs';

interface ArticleData {
  headline: string;
  description: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ArticleFAQSchemaProps {
  article: ArticleData;
  faqItems: FAQItem[];
}

export function ArticleFAQSchema({ article, faqItems }: ArticleFAQSchemaProps) {
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