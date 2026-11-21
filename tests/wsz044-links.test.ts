// WSZ-044: pages link the first mention of a breaker rating in their text to its wire size guide. The map from rating to
// guide is read from the live route list, so a guide that goes away takes its links with it.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { AMP_GUIDE_PATHS, ampGuideHref } from '../src/lib/amp-guide-links';
import { ROUTES } from '../src/lib/routes';

const read = (rel: string) => readFileSync(join(import.meta.dirname, rel), 'utf8');

describe('WSZ-044 amp guide links', () => {
  it('maps every rating with a live guide, and only those', () => {
    assert.deepEqual(
      [...AMP_GUIDE_PATHS.keys()].sort((a, b) => a - b),
      [15, 20, 30, 40, 50, 60, 70, 80, 90, 100, 125, 200],
    );
    const live = new Set(ROUTES.map((r) => r.path));
    for (const path of AMP_GUIDE_PATHS.values()) assert.ok(live.has(path), path);
    assert.equal(ampGuideHref(80), '/guides/wire-size-for-70-80-90-amp');
    assert.equal(ampGuideHref(150), null);
  });

  it('the pages that mention a rating link it', () => {
    const pages = [
      'calculators/wire-size-calculator',
      'calculators/circuit-breaker-calculator',
      'calculators/dryer-calculator',
      'calculators/range-calculator',
      'calculators/rv-hookup-calculator',
      'calculators/hot-tub-calculator',
      'calculators/welder-calculator',
      'calculators/air-conditioner-calculator',
      'calculators/garage-subpanel-calculator',
      'calculators/residential-load-calculator',
      'calculators/ground-wire-calculator',
      'calculators/ampacity-calculator',
      'calculators/voltage-drop-calculator',
      'calculators/service-entrance-calculator',
      'guides/wire-size-for-ev-charger',
      'guides/nec-table-310-16',
      'guides/awg-wire-size-chart',
    ];
    for (const p of pages) assert.match(read(`../src/app/${p}/page.tsx`), /<AmpGuideLink a=\{/, p);
  });

  it('answers the searches the keyword export found missing', () => {
    assert.match(read('../src/app/calculators/rv-hookup-calculator/page.tsx'), /50 amp RV outlet or plug/);
    assert.match(read('../src/app/guides/wire-size-for-100-amp/page.tsx'), /subpanel <Val v=\{NEAR\.lengthFt\}/);
    assert.match(read('../src/app/guides/awg-wire-size-chart/page.tsx'), /How many amps can <Size s="20" \/> wire carry\?/);
  });
});
