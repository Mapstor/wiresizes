// WSZ-004a: page dates from src/data/page-dates.json (D-17), formatted from their YYYY-MM-DD strings, and the sitemap
// that reads them.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import PAGE_DATES from '../src/data/page-dates.json';
import { articleDates, formatDate, pageDates } from '../src/lib/page-dates';
import sitemap from '../src/app/sitemap';

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

  it('every route was published on 2026-02-22 and modified on or after it', () => {
    assert.equal(Object.keys(DATES).length, 32);
    for (const [route, { published, modified }] of Object.entries(DATES)) {
      assert.equal(published, '2026-02-22', route);
      assert.match(modified, /^\d{4}-\d{2}-\d{2}$/, route);
      assert.ok(modified >= published, route);
    }
  });

  it('the legal pages keep the day WSZ-002 went live; every other route the day of its last body-text change', () => {
    for (const route of ['/contact', '/privacy', '/terms', '/disclaimer']) assert.equal(DATES[route].modified, '2026-11-02', route);
    for (const [route, { modified }] of Object.entries(DATES)) {
      if (!['/contact', '/privacy', '/terms', '/disclaimer'].includes(route)) assert.equal(modified, '2026-11-03', route);
    }
  });

  it('pageDates and articleDates read the file, and an unknown route throws', () => {
    assert.deepEqual(pageDates('/guides/nec-table-310-16'), DATES['/guides/nec-table-310-16']);
    assert.deepEqual(articleDates('/guides/awg-wire-size-chart'), { datePublished: '2026-02-22', dateModified: '2026-11-03' });
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
