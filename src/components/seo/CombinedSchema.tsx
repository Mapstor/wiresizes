import { generateBreadcrumbSchema } from '@/utils/breadcrumbs';

interface WebApplicationData {
  name: string;
  url: string;
  description: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface CombinedSchemaProps {
  webApp: WebApplicationData;
  faqItems: FAQItem[];
}

export function CombinedSchema({ webApp, faqItems }: CombinedSchemaProps) {
  const webApplicationSchema = {
    '@type': 'WebApplication',
    '@id': `${webApp.url}#webapp`,
    name: webApp.name,
    url: webApp.url,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    description: webApp.description
  };

  const faqPageSchema = {
    '@type': 'FAQPage',
    '@id': `${webApp.url}#faq`,
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };

  const breadcrumbSchema = generateBreadcrumbSchema(webApp.url);

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [webApplicationSchema, faqPageSchema, breadcrumbSchema]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
    />
  );
}