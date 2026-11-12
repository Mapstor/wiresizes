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
} from '../src/lib/verified/nec-2026-edition';

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
