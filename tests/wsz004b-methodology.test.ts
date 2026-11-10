// WSZ-004b: the /methodology section map (src/lib/methodology.ts) and the values its copy reads from the data modules
// (nothing on the page is typed). check-structure 24 holds the section map to the built pages; these tests hold it to
// the source registry and to chat's scope (WSZ-017 answers 10 and 12).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/lib/verified/csv.mjs';
import { attribution } from '../src/lib/verified/registry';
import { CALCULATOR_NAMES, METHODOLOGY_EXTRA_SECTIONS, METHODOLOGY_ROUTE, METHODOLOGY_SECTIONS } from '../src/lib/methodology';
import { SERVICE_AMPACITY_PERCENT } from '../src/lib/verified/nec-310-12';
import { ROWS_240_4_D, max240_4D } from '../src/lib/verified/nec-240-4-d';
import { TABLE_AMBIENT } from '../src/lib/verified/nec-310-16';
import { REFERENCE_TEMP_C, resistanceAt, r20 } from '../src/lib/calculations/resistance';
import pageDates from '../src/data/page-dates.json';

const registry = new Map(parseCsv(readFileSync('research/data-sources.csv', 'utf8')).map((row) => [row.domain, row]));

describe('METHODOLOGY_SECTIONS', () => {
  it('has unique ids and domains, all verified, and no id shared with the extra sections', () => {
    const ids = [...METHODOLOGY_SECTIONS.map((s) => s.id), ...Object.values(METHODOLOGY_EXTRA_SECTIONS).map((s) => s.id)];
    assert.equal(new Set(ids).size, ids.length);
    const domains = METHODOLOGY_SECTIONS.map((s) => s.domain);
    assert.equal(new Set(domains).size, domains.length);
    for (const domain of domains) assert.equal(registry.get(domain)?.status, 'verified', domain);
  });

  it('leaves out nec-110-14c until WSZ-009 and the verified domains no live page cites', () => {
    const domains = new Set(METHODOLOGY_SECTIONS.map((s) => s.domain));
    for (const off of ['nec-110-14c', 'nec-continuous-load', 'doe-efficiency-standards']) assert.ok(!domains.has(off), off);
  });

  it('cites only named live calculators, each section at least one', () => {
    for (const s of METHODOLOGY_SECTIONS) {
      assert.ok(s.citedOn.length > 0, s.domain);
      assert.equal(new Set(s.citedOn).size, s.citedOn.length, s.domain);
      for (const route of s.citedOn) assert.ok(CALCULATOR_NAMES[route], `${s.domain}: ${route} has no name`);
    }
    // every named calculator is cited somewhere, so no name is left over
    const cited = new Set(METHODOLOGY_SECTIONS.flatMap((s) => s.citedOn));
    assert.deepEqual([...cited].sort(), Object.keys(CALCULATOR_NAMES).sort());
  });

  it('has page dates for its route', () => {
    const dates = (pageDates as Record<string, { published: string; modified: string }>)[METHODOLOGY_ROUTE];
    assert.ok(dates);
    assert.ok(dates.published <= dates.modified);
  });
});

describe('values the /methodology copy reads', () => {
  it('attribution() gives the registry publisher', () => {
    for (const s of METHODOLOGY_SECTIONS) assert.equal(attribution(s.domain).publisher, registry.get(s.domain)?.publisher);
  });

  it('SERVICE_AMPACITY_PERCENT is the 83 % of the 310.12(A) and (B) rules', () => {
    assert.equal(SERVICE_AMPACITY_PERCENT, 83);
  });

  it('TABLE_AMBIENT is the 30 °C (86 °F) of the Table 310.16 title', () => {
    assert.deepEqual(TABLE_AMBIENT, { c: 30, f: 86 });
  });

  it('ROWS_240_4_D holds the unconditional limits the calculators apply and the conditional rows they skip', () => {
    const unconditional = ROWS_240_4_D.filter((row) => row.conditions === null).map((row) => `${row.size} ${row.material} ${row.max_ocpd_a}`);
    assert.deepEqual(unconditional.sort(), ['10 Al 25', '10 CCA 25', '10 Cu 30', '12 Al 15', '12 CCA 15', '12 Cu 20', '14 Cu 15'].sort());
    const conditional = ROWS_240_4_D.filter((row) => row.conditions !== null).map((row) => `${row.size} ${row.material}`);
    assert.deepEqual(conditional.sort(), ['14 CCA', '16 Cu', '18 Cu'].sort());
    for (const row of ROWS_240_4_D) assert.deepEqual(max240_4D(row.size, row.material), { max_ocpd_a: row.max_ocpd_a, conditions: row.conditions, status: row.status });
  });

  it('REFERENCE_TEMP_C is the temperature at which resistanceAt returns the 20 °C table value', () => {
    assert.equal(REFERENCE_TEMP_C, 20);
    assert.equal(resistanceAt('12', 'Cu', REFERENCE_TEMP_C), r20('12', 'Cu'));
  });
});
