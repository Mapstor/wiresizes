// WSZ-005c: the two registry rows behind the 2026 NEC facts (the owner approved research/WSZ-005c-registry-proposal.md
// on 2026-11-12) and the values the pages read from them.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/lib/verified/csv.mjs';
import {
  NEC_2026_DOMAIN,
  NEC_2026_EFFECTIVE,
  NEC_2026_ISSUANCE_DOMAIN,
  NEC_2026_ISSUED,
  NEC_2026_MIN_SIZES,
  NEC_2026_OUTDOOR_GFCI,
} from '../src/lib/verified/nec-2026-edition';
import {
  adoption,
  adoptionByName,
  editionGroups,
  editionLabel,
  editionQualifier,
  JURISDICTION_TOTAL,
  joinNames,
  LOCAL_LABEL,
  newestEdition,
  nextChangeParts,
  NOT_VERIFIED,
  OFFLINE_SOURCE_URLS,
  startDateRange,
  STATE_NAMES,
  verifiedCount,
} from '../src/lib/verified/nec-adoption';
import { ROUTES } from '../src/lib/routes';
import { METHODOLOGY_SECTIONS } from '../src/lib/methodology';
import adoptionData from '../data/verified/nec-adoption.json';

const registry = new Map(parseCsv(readFileSync('research/data-sources.csv', 'utf8')).map((row) => [row.domain, row]));
const pageMap = new Map(parseCsv(readFileSync('research/page-map.csv', 'utf8')).map((row) => [row.slug, row]));

describe('the 2026 NEC registry rows', () => {
  it('link the documents that show their facts, and nothing links the dead change-summary PDF', () => {
    const edition = registry.get(NEC_2026_DOMAIN);
    const issuance = registry.get(NEC_2026_ISSUANCE_DOMAIN);
    assert.equal(edition?.status, 'verified');
    assert.equal(issuance?.status, 'verified');
    assert.equal(edition?.url, 'https://www.dli.mn.gov/sites/default/files/pdf/NEC-2026-adoption-review-092525-minutes.pdf');
    assert.equal(
      issuance?.url,
      'https://content.nfpa.org/-/media/Project/Storefront/Catalog/Files/Codes-and-standards/standards-council/August-2025/SC_Final_Minutes_08_2025.pdf',
    );
    for (const row of registry.values()) assert.ok(!row.url.endsWith('-change-summary.pdf'), row.domain);
  });

  it('give the dates from NFPA\'s minutes and the minimum sizes from the state summary', () => {
    assert.equal(NEC_2026_ISSUED, '2025-08-20');
    assert.equal(NEC_2026_EFFECTIVE, '2025-09-09');
    assert.match(registry.get(NEC_2026_ISSUANCE_DOMAIN)?.coverage ?? '', /issued 2025-08-20, effective 2025-09-09/);
    assert.doesNotMatch(registry.get(NEC_2026_DOMAIN)?.coverage ?? '', /issued \d{4}-\d{2}-\d{2}/);
    assert.deepEqual(NEC_2026_MIN_SIZES, { Cu: '16', CCA: '14', Al: '12' });
  });

  it('are in the page map of every page that cites them', () => {
    for (const slug of ['/', '/calculators', '/guides', '/guides/nec-table-310-16', '/guides/nec-code-compliance']) {
      assert.ok(pageMap.get(slug)?.data_sources_all.split(';').includes(NEC_2026_ISSUANCE_DOMAIN), slug);
    }
  });
});

describe('nec-adoption.json, rendered per its rules', () => {
  it('renders only verified rows: Hawaii stays in the file, unrendered, and Mississippi has no row', () => {
    const states = adoption().map((r) => r.state);
    assert.ok(!states.includes('HI'));
    assert.ok(!states.includes('MS'));
    assert.ok(adoptionData.states.some((r) => r.state === 'HI' && r.status !== 'verified'));
    assert.equal(adoption().length, adoptionData.states.filter((r) => r.status === 'verified').length);
  });

  it('counts each jurisdiction once: New York City left out, Ohio once, 49 verified and 2 not verified of 51', () => {
    assert.equal(JURISDICTION_TOTAL, 51);
    assert.equal(verifiedCount(), 49);
    assert.deepEqual(NOT_VERIFIED.map((n) => n.state), ['HI', 'MS']);
    const all = editionGroups().flatMap((g) => g.states);
    assert.equal(new Set(all).size, all.length);
    assert.ok(!all.includes('NY-NYC'));
    assert.equal(all.filter((s) => s === 'OH').length, 1);
  });

  it('groups the editions newest first, local adoption last', () => {
    const groups = editionGroups().map((g) => `${g.edition} ${g.states.length}`);
    assert.deepEqual(groups, ['2026 8', '2023 21', '2020 11', '2017 1', '2014 1', '2008 1', 'local 6']);
    assert.deepEqual(newestEdition().states, ['AR', 'CO', 'MA', 'MN', 'ND', 'OR', 'TX', 'WY']);
  });

  it('reads the labels and wording from the rules', () => {
    assert.equal(LOCAL_LABEL, 'Local adoption');
    assert.equal(editionLabel('local'), 'Local adoption');
    assert.equal(editionLabel('2023'), '2023 NEC');
    const tn = adoption().find((r) => r.state === 'TN');
    assert.ok(tn);
    assert.equal(editionQualifier(tn), "per the State Fire Marshal's list updated April 17, 2025");
    const fl = adoption().find((r) => r.state === 'FL');
    assert.ok(fl);
    assert.deepEqual(nextChangeParts(fl), { before: 'changes to the 2023 NEC on ', date: '2026-12-31', after: '' });
    const inRow = adoption().find((r) => r.state === 'IN');
    assert.ok(inRow);
    assert.deepEqual(nextChangeParts(inRow), { before: 'the 2023 NEC is proposed or pending', date: null, after: '' });
    assert.match(NOT_VERIFIED[0].reason, /^a newer NEC may have become the state code by default under HRS 107-24\(c\)/);
    assert.equal(NOT_VERIFIED[1].reason, 'no state statement on electrical codes was found.');
  });

  it('names every state code and sorts the rows by name, Ohio commercial before residential', () => {
    for (const r of adoptionData.states) assert.ok(STATE_NAMES[r.state], r.state);
    const order = adoptionByName().map((r) => r.state);
    assert.equal(order[0], 'AL');
    assert.ok(order.indexOf('NY') < order.indexOf('NY-NYC'));
    const ohio = adoptionByName().filter((r) => r.state === 'OH').map((r) => r.scope.split(' ')[0]);
    assert.deepEqual(ohio, ['commercial', 'residential']);
  });

  it('gives the start-date range of the newest edition, Wyoming undated', () => {
    const range = startDateRange('2026');
    assert.ok(range);
    assert.deepEqual([range.first.state, range.first.effective, range.last.state, range.last.effective], ['MA', '2026-04-24', 'OR', '2026-10-01']);
    assert.deepEqual(adoption().filter((r) => r.edition === '2026' && r.effective === null).map((r) => r.state), ['WY']);
  });

  it('lists only source links the data file still holds', () => {
    const urls = new Set(adoptionData.states.map((r) => r.source_url));
    for (const url of OFFLINE_SOURCE_URLS) assert.ok(urls.has(url), url);
  });

  it('joins names without a serial comma', () => {
    assert.equal(joinNames(['A']), 'A');
    assert.equal(joinNames(['A', 'B']), 'A and B');
    assert.equal(joinNames(['A', 'B', 'C']), 'A, B and C');
  });
});

describe('the 2026 changes and the pages that state them', () => {
  it('reads the 210.8(F) threshold from the state summary', () => {
    assert.deepEqual(NEC_2026_OUTDOOR_GFCI, { fromA: 50, toA: 60, maxVoltsToGround: 150 });
  });

  it('names the repurposed page NEC Edition by State, with a line free of numbers', () => {
    const route = ROUTES.find((r) => r.path === '/guides/nec-code-compliance');
    assert.equal(route?.name, 'NEC Edition by State');
    assert.doesNotMatch(route?.line ?? '', /\d/);
  });

  it('cites the adoption rows and the issuance minutes on the editions page, Table 310.16, the homepage and both hubs', () => {
    const cited = Object.fromEntries(METHODOLOGY_SECTIONS.map((s) => [s.domain, [...s.citedOn].sort()]));
    const pages = ['/', '/calculators', '/guides', '/guides/nec-code-compliance', '/guides/nec-table-310-16'].sort();
    assert.deepEqual(cited['nec-adoption'], pages);
    assert.deepEqual(cited[NEC_2026_ISSUANCE_DOMAIN], pages);
    assert.deepEqual(cited[NEC_2026_DOMAIN], ['/guides/nec-code-compliance', '/guides/nec-table-310-16']);
  });
});
