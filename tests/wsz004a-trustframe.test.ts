// WSZ-004a: page dates from src/data/page-dates.json (D-17), formatted from their YYYY-MM-DD strings, and the sitemap
// that reads them; the identity nodes; the /about corrections file; gate b skipping page names (D-20).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import PAGE_DATES from '../src/data/page-dates.json';
import CORRECTIONS from '../src/data/corrections.json';
import { articleDates, formatDate, pageDates } from '../src/lib/page-dates';
import sitemap from '../src/app/sitemap';
import { AUTHOR_CREDENTIAL, AUTHOR_NAME, ORGANIZATION, ORGANIZATION_REF, PERSON, PERSON_REF } from '../src/lib/identity';
import { tokenizeHtml } from '../scripts/lib/build-output.mjs';
import { traceNumbers } from '../scripts/lib/gate-rules.mjs';

const DATES = PAGE_DATES as Record<string, { published: string; modified: string }>;

describe('page dates', () => {
  it('formats a YYYY-MM-DD string as "Month D, YYYY"', () => {
    assert.equal(formatDate('2026-11-03'), 'November 3, 2026');
    assert.equal(formatDate('2026-11-02'), 'November 2, 2026');
    assert.equal(formatDate('2026-02-22'), 'February 22, 2026');
    assert.equal(formatDate('2027-01-01'), 'January 1, 2027');
    for (const bad of ['2026-13-01', '2026-00-10', '2026-11-00', '2026-11-3', 'Nov 3, 2026', '2026-11-03T00:00:00Z', '']) {
      assert.throws(() => formatDate(bad), /not a YYYY-MM-DD date/, bad);
    }
  });

  // Routes added after the launch, with the day each went live (D-17); WSZ-004b added /methodology
  const ADDED_LATER: Record<string, string> = { '/methodology': '2026-11-10' };

  it('every route was published on 2026-02-22, or on the day it was added, and modified on or after it', () => {
    assert.equal(Object.keys(DATES).length, 33);
    for (const [route, { published, modified }] of Object.entries(DATES)) {
      assert.equal(published, ADDED_LATER[route] ?? '2026-02-22', route);
      assert.match(modified, /^\d{4}-\d{2}-\d{2}$/, route);
      assert.ok(modified >= published, route);
    }
  });

  it('the legal pages keep the day WSZ-002 went live; every other route the day of its last body-text change', () => {
    const legal = ['/contact', '/privacy', '/terms', '/disclaimer'];
    for (const route of legal) assert.equal(DATES[route].modified, '2026-11-02', route);
    for (const [route, { modified }] of Object.entries(DATES)) {
      if (!legal.includes(route)) assert.ok(modified >= '2026-11-03', route);
    }
    // WSZ-004a changed the body text of /about and the eight converters (Sources sections); it goes live with WSZ-019
    const wsz004a = ['/about', ...['amps-to-watts', 'btu-to-watts', 'kilowatts-to-amps', 'kva-to-amps', 'ohms-law', 'three-phase', 'volts-to-amps', 'watts-to-amps'].map((s) => `/calculators/${s}-calculator`)];
    for (const route of wsz004a) assert.ok(DATES[route].modified >= '2026-11-09', route);
  });

  it('pageDates and articleDates read the file, and an unknown route throws', () => {
    assert.deepEqual(pageDates('/guides/nec-table-310-16'), DATES['/guides/nec-table-310-16']);
    assert.deepEqual(articleDates('/guides/awg-wire-size-chart'), { datePublished: '2026-02-22', dateModified: DATES['/guides/awg-wire-size-chart'].modified });
    assert.throws(() => pageDates('/calculators/welder-calculator'), /no entry/);
  });

  it('the sitemap lists every dated route once, with lastmod = modified as YYYY-MM-DD', () => {
    const entries = sitemap();
    const routes = entries.map((e) => e.url.replace(/^https:\/\/wiresizes\.com/, '') || '/');
    assert.deepEqual([...routes].sort(), Object.keys(DATES).sort());
    for (const entry of entries) {
      const route = entry.url.replace(/^https:\/\/wiresizes\.com/, '') || '/';
      assert.equal(entry.lastModified, DATES[route].modified, route);
    }
  });
});

describe('identity nodes', () => {
  it('the Organization is the publisher with its address and VAT ID, and no sameAs', () => {
    assert.equal(ORGANIZATION['@id'], 'https://wiresizes.com/#organization');
    assert.equal(ORGANIZATION.name, 'Moving Data Systems d.o.o.');
    assert.equal(ORGANIZATION.legalName, 'Moving Data Systems d.o.o.');
    assert.equal(ORGANIZATION.url, 'https://wiresizes.com');
    assert.deepEqual(ORGANIZATION.address, {
      '@type': 'PostalAddress', streetAddress: 'Smolnik 62', postalCode: '2342', addressLocality: 'Ruše', addressCountry: 'SI',
    });
    assert.equal(ORGANIZATION.vatID, 'SI94001154');
    assert.deepEqual(ORGANIZATION.logo, { '@type': 'ImageObject', url: 'https://wiresizes.com/icons/icon-512.png', width: 512, height: 512 });
    assert.ok(!('sameAs' in ORGANIZATION));
  });

  it('the Person is the author with the physics credential only (D-03) and the LinkedIn profile', () => {
    assert.equal(PERSON['@id'], 'https://wiresizes.com/about#marko-visic');
    assert.equal(PERSON.name, 'Marko Visic');
    assert.equal(PERSON.url, 'https://wiresizes.com/about');
    assert.deepEqual(PERSON.alumniOf, { '@type': 'CollegeOrUniversity', name: 'University of Ljubljana, Faculty of Mathematics and Physics' });
    assert.deepEqual(PERSON.hasCredential, { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'BSc Physics' });
    assert.deepEqual(PERSON.knowsAbout, ['conductor resistance', 'electrical units and conversions', 'wire gauge geometry']);
    assert.deepEqual(PERSON.sameAs, ['https://www.linkedin.com/in/marko-visic/']);
    assert.deepEqual(PERSON_REF, { '@id': PERSON['@id'] });
    assert.deepEqual(ORGANIZATION_REF, { '@id': ORGANIZATION['@id'] });
    assert.equal(`By ${AUTHOR_NAME}, ${AUTHOR_CREDENTIAL}`, 'By Marko Visic, BSc Physics');
  });
});

describe('corrections', () => {
  it('each line has a YYYY-MM-DD date and text; the first is the audit, dated the day it went live', () => {
    assert.ok(CORRECTIONS.length >= 1);
    for (const { date, text } of CORRECTIONS) {
      assert.doesNotThrow(() => formatDate(date), date);
      assert.ok(text.length > 0 && !/^\s|\s$/.test(text), text);
    }
    assert.equal(CORRECTIONS[0].date, '2026-11-02');
    assert.match(CORRECTIONS[0].text, /^Audited every page\. /);
    assert.equal(`${formatDate(CORRECTIONS[0].date)}: ${CORRECTIONS[0].text}`.slice(0, 38), 'November 2, 2026: Audited every page. ');
  });
});

describe('gate b skips page names', () => {
  it('numbers inside [data-name] do not count; descriptions beside them do', () => {
    const html =
      '<html><body><a href="/guides/wire-size-for-100-amp"><span data-name="">Wire Size for 100 Amp</span></a>' +
      '<a href="/guides/wire-size-for-200-amp"><h3 data-name="">200 Amp Service Guide</h3><p>Upgrading to 200 A service.</p></a>' +
      '<p>A 30 A circuit</p></body></html>';
    const found = traceNumbers(tokenizeHtml(html), () => false).map((n: { match: string }) => n.match);
    assert.deepEqual(found, ['200 A', '30 A']);
  });
});
