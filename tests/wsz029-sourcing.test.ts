// WSZ-029: the 2023 NEC text behind the 100 A guide, the garage subpanel calculator and the EV charger guide, read
// from NFPA's 2026-cycle public inputs (research/sources/round8/WSZ-029-public-inputs.md). These tests pin the values
// and the limits: 225.39(A)-(D), the 250.32(B)(1) neutral rule, 334.80 at 60 °C, and 340.80 / 310.15(F) never cited.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/lib/verified/csv.mjs';

const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8');
const json = (rel: string) => JSON.parse(read(rel));
type Rule = { ref: string; status: string; values: Record<string, unknown> };
const rule = (file: { rules: Rule[] }, ref: string) => {
  const found = file.rules.find((r) => r.ref === ref);
  assert.ok(found, ref);
  return found;
};

describe('WSZ-029 sourcing', () => {
  const registry = parseCsv(read('../research/data-sources.csv')) as Record<string, string>[];
  const row = (domain: string) => registry.find((r) => r.domain === domain);

  it('the three domains are verified, deep-link a page of an NFPA public-input report, and name what is not covered', () => {
    for (const [domain, page] of [
      ['nec-feeders-outbuildings', 'P10_PISubmittals.pdf#page=179'],
      ['nec-250-32', 'P05_PISubmittals.pdf#page=151'],
      ['nec-cable-rules', 'P06_PISubmittals.pdf#page=261'],
    ]) {
      const r = row(domain);
      assert.ok(r, domain);
      assert.equal(r.status, 'verified', domain);
      assert.ok(r.url.startsWith('https://docinfofiles.nfpa.org/files/AboutTheCodes/70/70_A2025_NEC_') && r.url.endsWith(page), domain);
      assert.equal(r.verified_date, '2026-11-17');
      assert.equal(r.key_required, 'no');
    }
    assert.match(row('nec-cable-rules')!.coverage, /Not covered: 340\.80 \(UF cable\) and 310\.15\(F\)/);
    assert.match(row('nec-feeders-outbuildings')!.coverage, /225\.32 does not exist in 2023/);
  });

  it('no verified row leaves key_required blank', () => {
    for (const r of registry.filter((x) => x.status === 'verified')) assert.ok(['yes', 'no'].includes(r.key_required), r.domain);
  });

  it('225.39(A)-(D) are the 2023 values from two reprints; 225.32 is absent in 2023', () => {
    const f = json('../data/verified/nec-225-2023.json');
    const r = rule(f, '225.39');
    assert.match(r.status, /^VERIFIED-2023/);
    assert.deepEqual(r.values.values_2023, { A_one_circuit_A: 15, B_two_2wire_circuits_A: 30, C_one_family_dwelling_A: 100, C_wires: 3, D_all_others_A: 60 });
    assert.match(rule(f, '225.30').status, /^VERIFIED-2023: main rule and \(A\)-\(F\)/);
    assert.match(rule(f, '225.32').status, /^NOT IN THE 2023 EDITION/);
  });

  it('250.32(B)(1): EGC with the feeder, sized per 250.122, the neutral not bonded at the separate building', () => {
    const f = json('../data/verified/nec-250-32-2023.json');
    const r = rule(f, '250.32(B)(1)');
    assert.match(r.status, /^VERIFIED-2023 including the neutral sentence/);
    assert.equal(r.values.egc_with_feeder, true);
    assert.equal(r.values.egc_size_rule, '250.122');
    assert.equal(r.values.neutral_bonded_at_separate_building, false);
    assert.match(rule(f, '250.32(A)').status, /^VERIFIED-2023/);
  });

  it('334.80 holds NM cable at the 60 °C column; 340.80 and 310.15(F) stay unverified', () => {
    const f = json('../data/verified/nec-cable-rules-2023.json');
    assert.equal(rule(f, '334.80').values.max_column_c, 60);
    assert.equal(rule(f, '334.80').values.derating_from_column_c, 90);
    assert.match(rule(f, '340.80').status, /^UNVERIFIED/);
    assert.match(rule(f, '310.15(F)').status, /^UNVERIFIED/);
  });

  it('the section allowlist gains the verified sections and never 340.80 or 310.15(F)', () => {
    const refs = new Set((parseCsv(read('../research/nec-sections-allowlist.csv')) as Record<string, string>[]).map((r) => r.ref));
    for (const ref of ['225.18', '225.30', '225.31(B)', '225.39', '250.32(A)', '250.32(B)(1)', '334.80', '310.15(E)']) assert.ok(refs.has(ref), ref);
    for (const ref of ['340.80', '310.15(F)', '225.32']) assert.ok(!refs.has(ref), ref);
  });

  it('the 100 A guide and the garage subpanel require nec-250-32 as well as nec-feeders-outbuildings', () => {
    const held = parseCsv(read('../research/held-pages-domains.csv')) as Record<string, string>[];
    for (const slug of ['/guides/wire-size-for-100-amp', '/calculators/garage-subpanel-calculator']) {
      const required = held.find((r) => r.slug === slug)!.required_domains.split(';');
      assert.ok(required.includes('nec-feeders-outbuildings') && required.includes('nec-250-32'), slug);
    }
  });
});
