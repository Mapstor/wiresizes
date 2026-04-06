import Script from 'next/script';
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
    <Script
      id={`breadcrumb-schema-${url.replace(/[^a-zA-Z0-9]/g, '-')}`}
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}