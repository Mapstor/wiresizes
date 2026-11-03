// WSZ-003c: a <Val> unit is a unit symbol only (the 320 px overflow came from a whole phrase in one nowrap span), and
// the Sources list shows each registry attribution without "Source: " and without its " — retrieved" segment.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { partsText, UNIT_SYMBOLS, withUnit } from '../src/lib/calculations/format';
import type { TextPart, UnitSymbol } from '../src/lib/calculations/format';
import { formatSize } from '../src/lib/verified/awg';
import { sizeConductor, WIRE_SIZE_RATINGS } from '../src/lib/calculations/conductor-sizing';
import { attributionParts } from '../src/lib/verified/registry';

describe('unit symbols', () => {
  it('withUnit takes every unit symbol of the list', () => {
    assert.equal(UNIT_SYMBOLS.length, 20);
    for (const unit of UNIT_SYMBOLS) assert.equal(withUnit(2, unit), `2 ${unit}`);
  });

  it('withUnit and partsText throw for a phrase, a word or an empty unit', () => {
    for (const unit of ['Ω per 1000 ft at 75 °C', 'Ω/1000 ft', 'amps', 'per ft', '']) {
      assert.throws(() => withUnit(1, unit as UnitSymbol), /not a unit symbol/, unit);
      const parts: TextPart[] = ['at ', { v: 1, unit: unit as UnitSymbol, src: 'input' }];
      assert.throws(() => partsText(parts), /not a unit symbol/, unit);
    }
  });

  it('the wire size steps keep their text and carry unit symbols only', () => {
    let steps = 0;
    for (const ocpdA of WIRE_SIZE_RATINGS) {
      for (const material of ['Cu', 'Al'] as const) {
        const result = sizeConductor({ ocpdA, material, lengthFt: 400, volts: 120, phase: 'single', vdTargetPct: 3 });
        if ('error' in result) continue;
        for (const parts of result.stepParts) {
          steps++;
          for (const part of parts) {
            if (typeof part === 'object' && 'v' in part) assert.ok((UNIT_SYMBOLS as readonly string[]).includes(part.unit), part.unit);
          }
        }
        assert.deepEqual(result.steps, result.stepParts.map((parts) => partsText(parts, formatSize)));
        assert.ok(result.steps.some((step) => / Ω per 1000 ft at 75 °C\): /.test(step)), result.steps.join(' | '));
      }
    }
    assert.ok(steps > 100);
  });
});

describe('attributionParts', () => {
  it('drops "Source: " and the retrieved segment, and keeps the text after it', () => {
    assert.deepEqual(
      attributionParts('Source: NIST (NBS) Handbooks 100 and 109 — retrieved Oct 2026; 75 °C and aluminum values calculated'),
      {
        full: 'NIST (NBS) Handbooks 100 and 109 — retrieved Oct 2026; 75 °C and aluminum values calculated',
        short: 'NIST (NBS) Handbooks 100 and 109; 75 °C and aluminum values calculated',
        retrieved: 'Oct 2026',
      },
    );
    assert.deepEqual(attributionParts('Source: NFPA 70 (NEC) 2023, Table 310.16 — retrieved Oct 2026'), {
      full: 'NFPA 70 (NEC) 2023, Table 310.16 — retrieved Oct 2026',
      short: 'NFPA 70 (NEC) 2023, Table 310.16',
      retrieved: 'Oct 2026',
    });
  });

  it('keeps other dashes, and leaves a text without the segment whole', () => {
    assert.equal(
      attributionParts('Source: NFPA 70 (NEC), 240.4(D) — NFPA revision record SR-8377 and 2023 text (Leviton reprint) — retrieved Oct 2026').short,
      'NFPA 70 (NEC), 240.4(D) — NFPA revision record SR-8377 and 2023 text (Leviton reprint)',
    );
    assert.deepEqual(attributionParts('U.S. EIA Glossary'), { full: 'U.S. EIA Glossary', short: 'U.S. EIA Glossary', retrieved: null });
  });
});
