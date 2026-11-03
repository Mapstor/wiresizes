// WSZ-003b: the source registry (src/lib/verified/registry.ts) and the text parts and value formatting of
// src/lib/calculations/format.ts that <Val>, <Size> and <ValText> render.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { attribution } from '../src/lib/verified/registry';
import { formatValue, partsText, withUnit } from '../src/lib/calculations/format';
import type { TextPart } from '../src/lib/calculations/format';
import { formatSize } from '../src/lib/verified/awg';
import { ENGINE_ID, sizeConductor } from '../src/lib/calculations/conductor-sizing';
import { ampacityNote, NO_14_AWG_ALUMINUM_NOTE, NO_14_AWG_ALUMINUM_NOTE_PARTS } from '../src/lib/calculations/voltage-drop';
import { ocpdLimitLabel, ocpdLimitParts } from '../src/lib/calculations/ampacity';

describe('attribution()', () => {
  it('returns the attribution, URL, verified_date and status of a verified domain', () => {
    const a = attribution('nec-310-16');
    assert.equal(a.text, 'Source: NFPA 70 (NEC) 2023, Table 310.16 — retrieved Oct 2026');
    assert.match(a.url, /^https:\/\/docinfofiles\.nfpa\.org\//);
    assert.equal(a.verified_date, '2026-10-19');
    assert.equal(a.status, 'verified');
  });

  it('throws for a missing domain', () => {
    assert.throws(() => attribution('no-such-domain'), /no domain "no-such-domain"/);
  });

  it('throws for a candidate or GAP domain', () => {
    assert.throws(() => attribution('mfr-well-pump'), /"candidate", not verified/);
    assert.throws(() => attribution('nec-ch9-fill'), /"GAP", not verified/);
  });
});

describe('formatValue and withUnit', () => {
  it('write the number through format.ts and a plain space before the unit', () => {
    assert.equal(formatValue(1500), '1,500');
    assert.equal(formatValue(4.8561, { fixed: 2 }), '4.86');
    assert.equal(formatValue(1234.5, { upTo: 3 }), '1,234.5');
    assert.equal(formatValue(15900, { sig: 4 }), '15,900');
    assert.equal(withUnit(20, 'A'), '20 A');
    assert.equal(withUnit(2.0234, '%', { fixed: 2 }), '2.02 %');
    assert.equal(withUnit(104, '°F'), '104 °F');
    assert.ok(!withUnit(1234.5, 'V').includes(' '));
  });
});

describe('text parts', () => {
  it('partsText joins text, values and sizes', () => {
    const parts: TextPart[] = ['Use ', { size: '4/0' }, ' at ', { v: 1200, unit: 'ft', src: 'input' }, '.'];
    assert.equal(partsText(parts, formatSize), 'Use 4/0 AWG at 1,200 ft.');
    assert.throws(() => partsText(parts), /without a size formatter/);
  });

  it('steps[] is the text of stepParts, and every value names its source', () => {
    const result = sizeConductor({ ocpdA: 30, lengthFt: 400, volts: 120, phase: 'single', material: 'Cu' });
    assert.ok(!('error' in result));
    if ('error' in result) return;
    assert.ok(result.stepParts.length >= 4);
    assert.deepEqual(result.steps, result.stepParts.map((parts) => partsText(parts, formatSize)));
    for (const parts of result.stepParts) {
      for (const part of parts) {
        if (typeof part === 'object' && 'v' in part) assert.ok(part.src === 'input' || part.src === `calc:${ENGINE_ID}`, part.src);
      }
    }
  });

  it('the voltage-drop note, the 14 AWG aluminum note and the 240.4(D) label read the same as text', () => {
    const note = ampacityNote('10', 'Cu', 30);
    assert.equal(note.before, partsText(note.beforeParts, formatSize));
    assert.equal(NO_14_AWG_ALUMINUM_NOTE, partsText(NO_14_AWG_ALUMINUM_NOTE_PARTS, formatSize));
    assert.equal(ocpdLimitLabel(20), partsText(ocpdLimitParts(20)));
  });
});
