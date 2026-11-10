import { generateBreadcrumbSchema } from '@/utils/breadcrumbs';
import { ORGANIZATION, ORGANIZATION_REF, PERSON, PERSON_REF } from '@/lib/identity';

interface WebApplicationData {
  name: string;
  url: string;
  description: string;
}

interface CombinedSchemaProps {
  webApp: WebApplicationData;
}

export function CombinedSchema({ webApp }: CombinedSchemaProps) {
  const webApplicationSchema = {
    '@type': 'WebApplication',
    '@id': `${webApp.url}#webapp`,
    name: webApp.name,
    url: webApp.url,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    description: webApp.description,
    author: PERSON_REF,
    publisher: ORGANIZATION_REF
  };

  const breadcrumbSchema = generateBreadcrumbSchema(webApp.url);

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [webApplicationSchema, breadcrumbSchema, PERSON, ORGANIZATION]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
    />
  );
}