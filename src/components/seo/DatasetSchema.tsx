// Dataset schema — for pages that publish a structured reference
// dataset (e.g., the NEC 310.16 ampacity table). Helps the page appear
// in Google Dataset Search and signals to AI assistants that the page
// is a citable data source.
// https://schema.org/Dataset
// WSZ-004a: author → the Person, publisher → the Organization (src/lib/identity.ts), printed in the same graph; dates
// from src/data/page-dates.json.
import { ORGANIZATION, ORGANIZATION_REF, PERSON, PERSON_REF } from '@/lib/identity';

/**
 * One variable / column the dataset publishes. Use the structured form
 * (with unitText / unitCode) where the variable is numeric — Google
 * Dataset Search and downstream consumers extract this metadata.
 */
export interface DatasetVariable {
  name: string;
  description?: string;
  /** Human-readable unit, e.g., "ampere", "millimeter". */
  unitText?: string;
  /** UN/CEFACT Common Code, e.g., "AMP" amperes, "MMT" millimeters, "INH" inches. */
  unitCode?: string;
}

interface DatasetSchemaProps {
  /** Path on the site, beginning with `/`. */
  path: string;
  name: string;
  /** Alternate name(s) — e.g., "NEC 310.16" for "Conductor Ampacities". */
  alternateName?: string | string[];
  description: string;
  /**
   * What the dataset measures. Pass plain strings for simple variables,
   * or DatasetVariable objects for structured metadata (units etc).
   */
  variableMeasured?: Array<string | DatasetVariable>;
  /** Free-text keywords for indexing. */
  keywords?: string[];
  /** Citation to the upstream authoritative source (e.g., NFPA 70). */
  citation?: string;
  /** YYYY-MM-DD, the route's published date in src/data/page-dates.json. */
  datePublished: string;
  /** YYYY-MM-DD, the route's modified date in src/data/page-dates.json. */
  dateModified: string;
  /** Coverage area (e.g., "United States"). */
  spatialCoverage?: string;
  /** The primary sources the values come from (WSZ-005a): name and registry URL each. No license is claimed. */
  isBasedOn?: { name: string; url: string }[];
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
  isBasedOn,
}: DatasetSchemaProps) {
  const url = `${ORIGIN}${path}`;
  const dataset: Record<string, unknown> = {
    '@type': 'Dataset',
    '@id': `${url}#dataset`,
    name,
    description,
    url,
    isAccessibleForFree: true,
    author: PERSON_REF,
    publisher: ORGANIZATION_REF,
    inLanguage: 'en-US',
    datePublished,
    dateModified,
  };

  if (alternateName) dataset.alternateName = alternateName;
  if (variableMeasured) {
    dataset.variableMeasured = variableMeasured.map((v) =>
      typeof v === 'string' ? v : { '@type': 'PropertyValue', ...v },
    );
  }
  if (keywords) dataset.keywords = keywords;
  if (citation) dataset.citation = citation;
  if (isBasedOn) dataset.isBasedOn = isBasedOn.map(({ name, url }) => ({ '@type': 'CreativeWork', name, url }));
  if (spatialCoverage) {
    dataset.spatialCoverage = { '@type': 'Place', name: spatialCoverage };
  }

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [dataset, PERSON, ORGANIZATION],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
