// WSZ-009d (with WSZ-032's sourcing): the box fill calculator, back from its WSZ-002 withdrawal. Table 314.16(A)'s 24
// rows and Table 314.16(B)(1) come from data/verified/nec-314-16.json, each maximum count equals the box volume divided
// by the conductor volume (whole conductors), the engine adds the 2023 allowances of 314.16(B)(1) to (B)(5), and the
// page's one source agrees with /methodology, the registry, the page map and the section allowlist.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import data from '../data/verified/nec-314-16.json';
import { parseCsv } from '../src/lib/verified/csv.mjs';
import { METHODOLOGY_SECTIONS } from '../src/lib/methodology';
import { ROUTES } from '../src/lib/routes';
import { DOMAINS, ENGINE_ID, boxFill, isBoxFillError } from '../src/lib/calculations/box-fill';
import type { BoxFillInput } from '../src/lib/calculations/box-fill';
import { BOX_SIZES, FILL_RULES, METAL_BOXES, VOLUME_PER_CONDUCTOR } from '../src/lib/verified/nec-314-16';
import { EXAMPLE_12, EXAMPLE_14, EXAMPLE_BOX, NO_CONDUCTORS, WITH_DEVICE_12, WITH_DEVICE_CLAMPS_12, exampleInput } from '../src/lib/box-fill-page';

const ROUTE = '/calculators/box-fill-calculator';
const DOMAIN = 'nec-314-16-box-fill';
const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8');
const code = (rel: string) => read(rel).replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
const run = (patch: Partial<BoxFillInput>) => {
  const r = boxFill({ ...exampleInput('12'), ...patch });
  assert.ok(!isBoxFillError(r), isBoxFillError(r) ? r.error : '');
  return r;
};

describe('WSZ-009d the data', () => {
  it('Table 314.16(B)(1): seven sizes, 18 AWG 1.50 in³ to 6 AWG 5.00 in³', () => {
    assert.deepEqual(
      BOX_SIZES.map((s) => VOLUME_PER_CONDUCTOR[s].in3),
      [1.5, 1.75, 2, 2.25, 2.5, 3, 5],
    );
    assert.deepEqual(
      BOX_SIZES.map((s) => VOLUME_PER_CONDUCTOR[s].cm3),
      [24.6, 28.7, 32.8, 36.9, 41, 49.2, 81.9],
    );
  });

  it('Table 314.16(A): 24 boxes, all 2023, each count the volume divided by the conductor volume', () => {
    assert.equal(METAL_BOXES.length, 24);
    const rows = (data.items as Record<string, { rows?: { status: string }[] }>)['Table 314.16(A)'].rows ?? [];
    assert.ok(rows.every((r) => r.status === 'VERIFIED-2023'));
    for (const b of METAL_BOXES) {
      for (const s of BOX_SIZES) assert.equal(b.max[s], Math.floor(b.in3 / VOLUME_PER_CONDUCTOR[s].in3 + 1e-9), `${b.inches} ${b.kind} ${s} AWG`);
    }
    const round = METAL_BOXES.find((b) => b.kind === 'round/octagonal' && b.inches === '4 × 1¼');
    assert.equal(round?.max['8'], 4);
    assert.equal(EXAMPLE_BOX.in3, 18);
  });

  it('the 2023 rules: four ground wires share one allowance, a quarter for each more, devices count twice', () => {
    assert.equal(FILL_RULES.egcSingleUpTo, 4);
    assert.equal(FILL_RULES.egcExtraFraction, 0.25);
    assert.equal(FILL_RULES.deviceAllowances, 2);
    assert.deepEqual([FILL_RULES.entering, FILL_RULES.passingThrough, FILL_RULES.loop, FILL_RULES.whollyInside], [1, 1, 2, 0]);
  });
});

describe('WSZ-009d the engine', () => {
  it('the worked example: 18.00 in³ on 12 AWG fills the 18.0 in³ box; 16.00 in³ on 14 AWG', () => {
    assert.equal(ENGINE_ID, 'box-fill');
    assert.deepEqual(DOMAINS, [DOMAIN]);
    assert.equal(EXAMPLE_12.fillIn3, 18);
    assert.ok(EXAMPLE_12.fits);
    assert.equal(EXAMPLE_14.fillIn3, 16);
    assert.equal(EXAMPLE_14.spareIn3, 2);
    assert.deepEqual(
      EXAMPLE_12.lines.map((l) => [l.rule, l.allowances, l.in3]),
      [
        ['(B)(1)', 4, 9],
        ['(B)(2)', 1, 2.25],
        ['(B)(4)', 2, 4.5],
        ['(B)(5)', 1, 2.25],
      ],
    );
    assert.equal(WITH_DEVICE_12, 5);
    assert.equal(WITH_DEVICE_CLAMPS_12, 4);
  });

  it('ground wires: one allowance up to four, then a quarter each, on the largest', () => {
    const egc = (n: number) => run({ egcCount: n }).lines.find((l) => l.rule === '(B)(5)')?.in3;
    assert.equal(egc(1), 2.25);
    assert.equal(egc(4), 2.25);
    assert.equal(egc(5), 2.8125);
    assert.equal(egc(8), 4.5);
    assert.equal(run({ egcCount: 0 }).lines.some((l) => l.rule === '(B)(5)'), false);
  });

  it('clamps and fittings use the largest conductor in the box; a wide device adds two per gang', () => {
    const r = run({ conductors: { ...NO_CONDUCTORS, '12': 2, '10': 2 }, deviceSize: '12', clamps: true, fittingTypes: 2, extraGangs: 1 });
    assert.equal(r.largest, '10');
    assert.equal(r.lines.find((l) => l.rule === '(B)(2)')?.in3, 2.5);
    assert.equal(r.lines.find((l) => l.rule === '(B)(3)')?.in3, 5);
    assert.equal(r.lines.find((l) => l.rule === '(B)(4)')?.in3, 9);
  });

  it('a marked box with a ring; too small; and the inputs it refuses', () => {
    const r = run({ boxIn3: 15, boxSource: 'marked', addedIn3: 3.5 });
    assert.equal(r.boxIn3, 18.5);
    assert.ok(r.fits);
    assert.ok(!run({ boxIn3: 15, boxSource: 'marked' }).fits);
    for (const bad of [
      { conductors: { ...NO_CONDUCTORS } },
      { boxIn3: 0 },
      { boxIn3: 120 },
      { egcCount: 1.5 },
      { deviceSize: '10' as const },
      { devices: 0, extraGangs: 1 },
    ]) {
      assert.ok(isBoxFillError(boxFill({ ...exampleInput('12'), ...bad })), JSON.stringify(bad));
    }
  });

  it('names the smallest Table 314.16(A) box of each kind with room for the fill', () => {
    const device = EXAMPLE_12.smallestByKind.find((x) => x.kind === 'device')?.box;
    assert.ok(device && device.in3 >= EXAMPLE_12.fillIn3);
    assert.ok(METAL_BOXES.filter((b) => b.kind === 'device' && b.in3 >= EXAMPLE_12.fillIn3).every((b) => b.in3 >= (device?.in3 ?? 0)));
  });
});

describe('WSZ-009d sources and listings', () => {
  const registry = parseCsv(read('../research/data-sources.csv')) as Record<string, string>[];
  const pageMap = parseCsv(read('../research/page-map.csv')) as Record<string, string>[];
  const allow = parseCsv(read('../research/nec-sections-allowlist.csv')) as Record<string, string>[];
  const page = code('../src/app/calculators/box-fill-calculator/page.tsx');

  it('one source, verified, listed the same everywhere', () => {
    const row = registry.find((r) => r.domain === DOMAIN);
    assert.ok(row && row.status === 'verified' && row.pages_served === ROUTE);
    assert.ok(!registry.some((r) => r.domain !== DOMAIN && r.pages_served.split(';').includes(ROUTE)));
    assert.deepEqual(
      METHODOLOGY_SECTIONS.filter((s) => s.citedOn.includes(ROUTE)).map((s) => s.domain),
      [DOMAIN],
    );
    assert.equal(pageMap.find((r) => r.slug === ROUTE)?.data_sources_all, DOMAIN);
    for (const ref of ['314.16', '314.16(A)', '314.16(A)(2)', '314.16(B)', '314.16(B)(1)', '314.16(B)(2)', '314.16(B)(3)', '314.16(B)(4)', '314.16(B)(5)', '314.16(B)(6)', '314.27(E)']) {
      assert.ok(allow.some((r) => r.ref === ref && r.status === 'verified'), ref);
    }
  });

  it('no withdrawal, joins the gates, the route list and the footer', () => {
    assert.ok(!page.includes('WithdrawnTool'));
    assert.ok(!read('../research/wsz002-withdrawals.csv').includes(ROUTE));
    const gates = JSON.parse(read('../scripts/gates.config.json'));
    assert.ok(gates.numberTrace.enforce.includes(ROUTE) && gates.necRefs.enforce.includes(ROUTE));
    const r = ROUTES.find((x) => x.path === ROUTE);
    assert.ok(r && r.name === 'Box Fill Calculator' && r.group === 'wire-sizing' && !/\d/.test(r.line.replace(/314\.16(\([A-Z0-9]+\))*/g, '')));
    assert.match(read('../src/components/layout/Footer.tsx'), /box-fill-calculator/);
  });
});
