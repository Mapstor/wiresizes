import { generateBreadcrumbSchema } from '@/utils/breadcrumbs';

interface BreadcrumbSchemaProps {
  url: string;
}

export function BreadcrumbSchema({ url }: BreadcrumbSchemaProps) {
  const breadcrumbSchema = generateBreadcrumbSchema(url);

  const schema = {
    '@context': 'https://schema.org',
    ...breadcrumbSchema
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}