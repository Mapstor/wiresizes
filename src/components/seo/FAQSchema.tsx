import { generateBreadcrumbSchema } from '@/utils/breadcrumbs';

interface FAQSchemaProps {
  items: Array<{ question: string; answer: string }>;
  url?: string;
}

export function FAQSchema({ items, url }: FAQSchemaProps) {
  const faqPageSchema = {
    '@type': 'FAQPage',
    '@id': url ? `${url}#faq` : undefined,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  // If URL is provided, include breadcrumbs in @graph pattern
  if (url) {
    const breadcrumbSchema = generateBreadcrumbSchema(url);
    const combinedSchema = {
      '@context': 'https://schema.org',
      '@graph': [faqPageSchema, breadcrumbSchema]
    };
    return (
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }} />
    );
  }

  // Fallback to simple schema without breadcrumbs for backward compatibility
  const schema = {
    '@context': 'https://schema.org',
    ...faqPageSchema
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}