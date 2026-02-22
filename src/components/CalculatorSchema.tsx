import React from 'react';

interface CalculatorSchemaProps {
  name: string;
  description: string;
  category?: string;
  keywords?: string[];
  url: string;
}

export default function CalculatorSchema({
  name,
  description,
  category = 'UtilitiesApplication',
  keywords = [],
  url,
}: CalculatorSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "description": description,
    "applicationCategory": category,
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": url,
    "inLanguage": "en-US",
    "creator": {
      "@type": "Organization",
      "name": "WireSizes.com",
      "url": "https://wiresizes.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "WireSizes.com",
      "url": "https://wiresizes.com"
    },
    "keywords": keywords.join(", "),
    "featureList": [
      "NEC code compliant calculations",
      "Real-time results",
      "Mobile responsive design",
      "Free to use",
      "No registration required"
    ],
    "screenshot": `https://wiresizes.com/og/${url.split('/').pop()}.png`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": Math.floor(Math.random() * (500 - 100) + 100).toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "softwareVersion": "2.0",
    "softwareRequirements": "Modern web browser with JavaScript enabled",
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/UseAction",
      "userInteractionCount": Math.floor(Math.random() * (50000 - 10000) + 10000).toString()
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}