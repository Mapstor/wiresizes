// The site's two identity nodes (WSZ-004a): the publisher, Moving Data Systems d.o.o. (Organization), and the author,
// Marko Visic (Person). Facts from research/trust-frame-spec.md and DEVLOG §1 only (D-03: the physics credential only).
// Every JSON-LD graph that references a node by @id prints the node in the same graph.

export const ORGANIZATION_ID = 'https://wiresizes.com/#organization';
export const PERSON_ID = 'https://wiresizes.com/about#marko-visic';

export const AUTHOR_NAME = 'Marko Visic';
export const AUTHOR_CREDENTIAL = 'BSc Physics';
export const AUTHOR_URL = 'https://wiresizes.com/about';
export const AUTHOR_LINKEDIN = 'https://www.linkedin.com/in/marko-visic/';
export const PUBLISHER_NAME = 'Moving Data Systems d.o.o.';

export const ORGANIZATION = {
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: PUBLISHER_NAME,
  legalName: PUBLISHER_NAME,
  url: 'https://wiresizes.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Smolnik 62',
    postalCode: '2342',
    addressLocality: 'Ruše',
    addressCountry: 'SI',
  },
  vatID: 'SI94001154',
  logo: {
    '@type': 'ImageObject',
    url: 'https://wiresizes.com/icons/icon-512.png',
    width: 512,
    height: 512,
  },
};

export const PERSON = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: AUTHOR_NAME,
  url: AUTHOR_URL,
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'University of Ljubljana, Faculty of Mathematics and Physics',
  },
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'degree',
    name: AUTHOR_CREDENTIAL,
  },
  knowsAbout: ['conductor resistance', 'electrical units and conversions', 'wire gauge geometry'],
  sameAs: [AUTHOR_LINKEDIN],
};

/** References to the two nodes, for author and publisher keys. */
export const ORGANIZATION_REF = { '@id': ORGANIZATION_ID };
export const PERSON_REF = { '@id': PERSON_ID };
