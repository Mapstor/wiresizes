// HowTo schema — for procedural step-by-step guides. Eligible for
// Google's "How-to" rich results on mobile (and AI assistant citation
// when answering "how do I X?" queries).
// https://schema.org/HowTo

interface HowToStep {
  /** Short imperative step title, e.g., "Calculate the load in amps". */
  name: string;
  /** Longer plain-text description of what to do in this step. */
  text: string;
  /** Optional fragment URL to the section on the page (e.g., '#step-1'). */
  url?: string;
}

interface HowToSchemaProps {
  /** Path on the site, beginning with `/`. */
  path: string;
  /** Imperative how-to title — e.g., "How to size a wire for any circuit". */
  name: string;
  description: string;
  /** ISO 8601 duration, e.g., "PT15M" for 15 minutes. */
  totalTime?: string;
  steps: HowToStep[];
}

const ORIGIN = 'https://wiresizes.com';

export function HowToSchema({ path, name, description, totalTime, steps }: HowToSchemaProps) {
  const url = `${ORIGIN}${path}`;
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${url}#howto`,
    name,
    description,
    inLanguage: 'en-US',
    publisher: { '@id': `${ORIGIN}/#organization` },
    step: steps.map((s, idx) => {
      const step: Record<string, unknown> = {
        '@type': 'HowToStep',
        position: idx + 1,
        name: s.name,
        text: s.text,
      };
      if (s.url) step.url = `${url}${s.url}`;
      return step;
    }),
  };

  if (totalTime) schema.totalTime = totalTime;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
