// Dataset schema — for pages that publish a structured reference
// dataset (e.g., the NEC 310.16 ampacity table). Helps the page appear
// in Google Dataset Search and signals to AI assistants that the page
// is a citable data source.
// https://schema.org/Dataset

interface DatasetSchemaProps {
  /** Path on the site, beginning with `/`. */
  path: string;
  name: string;
  /** Alternate name(s) — e.g., "NEC 310.16" for "Conductor Ampacities". */
  alternateName?: string | string[];
  description: string;
  /** What the dataset measures (e.g., "ampacity", "conductor diameter"). */
  variableMeasured?: string[];
  /** Free-text keywords for indexing. */
  keywords?: string[];
  /** Citation to the upstream authoritative source (e.g., NFPA 70). */
  citation?: string;
  /** ISO date the dataset was first published, YYYY-MM-DD. */
  datePublished?: string;
  /** ISO date the dataset was last revised, YYYY-MM-DD. */
  dateModified?: string;
  /** Coverage area (e.g., "United States"). */
  spatialCoverage?: string;
}

const ORIGIN = 'https://wiresizes.com';

export function DatasetSchema({
  path,
  name,
  alternateName,
  description,
  variableMeasured,
  keywords,
  citation,
  datePublished,
  dateModified,
  spatialCoverage,
}: DatasetSchemaProps) {
  const url = `${ORIGIN}${path}`;
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': `${url}#dataset`,
    name,
    description,
    url,
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    creator: {
      '@type': 'Organization',
      '@id': `${ORIGIN}/#organization`,
      name: 'WireSizes.com',
      url: ORIGIN,
    },
    publisher: { '@id': `${ORIGIN}/#organization` },
    inLanguage: 'en-US',
  };

  if (alternateName) schema.alternateName = alternateName;
  if (variableMeasured) schema.variableMeasured = variableMeasured;
  if (keywords) schema.keywords = keywords;
  if (citation) schema.citation = citation;
  if (datePublished) schema.datePublished = datePublished;
  if (dateModified) schema.dateModified = dateModified;
  if (spatialCoverage) {
    schema.spatialCoverage = { '@type': 'Place', name: spatialCoverage };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
