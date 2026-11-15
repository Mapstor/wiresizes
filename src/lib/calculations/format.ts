// Numbers as the calculators show them in results, headlines and print payloads: en-US digit grouping and never
// exponential notation ("38,243.68", "15,900", "0.000005186"). Rounding is toFixed's or toPrecision's, so the
// digits are the ones the tools showed before; only the grouping is new. The same output on server and client (D-11).
// Also the material names. Sizes ("14 AWG", "250 kcmil") are formatted by src/lib/verified/awg.ts, which knows the
// kcmil sizes. Since WSZ-003b: formatValue and withUnit, which <Val> uses, and text parts, the sentences whose numbers
// and sizes the result panels render through <Val> and <Size>.
import type { Material, SizeKey } from '../verified/awg';

const formatters = new Map<string, Intl.NumberFormat>();

function group(value: number, key: string, options: Intl.NumberFormatOptions): string {
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat('en-US', options);
    formatters.set(key, formatter);
  }
  // -0 prints as "0"
  return formatter.format(value === 0 ? 0 : value);
}

/** Exactly `decimals` decimals: formatFixed(38243.675, 2) → "38,243.68". */
export function formatFixed(value: number, decimals: number): string {
  return group(Number(value.toFixed(decimals)), `fixed:${decimals}`, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** At most `decimals` decimals, trailing zeros dropped: formatUpTo(1234.5, 3) → "1,234.5". */
export function formatUpTo(value: number, decimals: number): string {
  return group(Number(value.toFixed(decimals)), `upto:${decimals}`, { maximumFractionDigits: decimals });
}

/** `digits` significant figures: formatSignificant(15900, 4) → "15,900", formatSignificant(0.000005186, 4) → "0.000005186". */
export function formatSignificant(value: number, digits: number): string {
  return group(Number(value.toPrecision(digits)), `sig:${digits}`, {
    minimumSignificantDigits: digits,
    maximumSignificantDigits: digits,
  });
}

/**
 * The decimals that `value` shows at `digits` significant figures, at most `max` (3): decimalsAtSig(3.094, 3) → 2,
 * decimalsAtSig(0.0123, 3) → 3. A sum or difference with that value keeps those decimals (120 V − 3.09 V = 116.91 V).
 */
export function decimalsAtSig(value: number, digits: number, max = 3): number {
  if (!(Math.abs(value) > 0) || !Number.isFinite(value)) return 0;
  const shown = Number(value.toPrecision(digits));
  return Math.min(max, Math.max(0, digits - 1 - Math.floor(Math.log10(Math.abs(shown)))));
}

/** A number as the reader entered it, grouped and unrounded: formatEntered(1500) → "1,500", formatEntered(0.85) → "0.85". */
export function formatEntered(value: number): string {
  return group(value, 'entered', { maximumFractionDigits: 20 });
}

/** How a value is written: as entered (no format), fixed decimals, at most N decimals or N significant figures. */
export type ValueFormat = { fixed: number } | { upTo: number } | { sig: number };

/** formatValue(4.8561, { fixed: 2 }) → "4.86"; formatValue(1500) → "1,500". */
export function formatValue(value: number, format?: ValueFormat): string {
  if (!format) return formatEntered(value);
  if ('fixed' in format) return formatFixed(value, format.fixed);
  if ('upTo' in format) return formatUpTo(value, format.upTo);
  return formatSignificant(value, format.sig);
}

/**
 * The unit symbols a value may carry. <Val> keeps the number and its symbol on one line, so the symbol is all it
 * holds: words and context ("per 1000 ft at") stay outside as text that can wrap (WSZ-003c).
 */
export const UNIT_SYMBOLS = ['A', 'V', 'W', 'kW', 'kVA', 'VA', 'kVAR', 'Ω', '%', '°C', '°F', 'ft', 'ft²', 'in', 'mm', 'mm²', 'cmil', 'kcmil', 'lb', 'hp', 'Btu/h', 'm', 'km'] as const;
export type UnitSymbol = (typeof UNIT_SYMBOLS)[number];
const UNIT_SYMBOL_SET = new Set<string>(UNIT_SYMBOLS);

/**
 * The number, a plain space (U+0020) and the unit symbol: withUnit(4.8561, 'V', { fixed: 2 }) → "4.86 V" (D-14).
 * Throws for anything but a unit symbol, so a wrong unit fails the build and the tests.
 */
export function withUnit(value: number, unit: UnitSymbol, format?: ValueFormat): string {
  if (!UNIT_SYMBOL_SET.has(unit)) throw new Error(`withUnit: "${unit}" is not a unit symbol (format.ts UNIT_SYMBOLS)`);
  return `${formatValue(value, format)} ${unit}`;
}

/** "copper" or "aluminum". */
export function materialName(material: Material): string {
  return material === 'Cu' ? 'copper' : 'aluminum';
}

/**
 * A value in a sentence: src is calc:<ENGINE_ID> for an engine output, "input" for a value the reader entered, or a
 * registry domain (D-15).
 */
export interface ValuePart {
  v: number;
  unit: UnitSymbol;
  src: string;
  format?: ValueFormat;
}

/**
 * "a" or "an" before a number or a size as it is read aloud: an 8, an 11, an 18, an 80, an 800, an 18,000; a 1/0, a 100,
 * a 1,800 ("one thousand eight hundred").
 */
export function indefiniteArticle(value: number | string): 'a' | 'an' {
  const text = String(value).replace(/,/g, '');
  if (!/^\d/.test(text) || text.includes('/')) return 'a';
  const digits = (/^\d+/.exec(text) as RegExpExecArray)[0];
  const lead = digits.slice(0, digits.length % 3 || 3);
  return lead.startsWith('8') || lead === '11' || lead === '18' ? 'an' : 'a';
}

/** A conductor size in a sentence. */
export interface SizePart {
  size: SizeKey;
}

/** A number without a unit symbol in a sentence (a correction factor), with its source; rendered through <Num>. */
export interface NumberPart {
  n: number;
  src: string;
  format?: ValueFormat;
}

/** A sentence in parts: plain text, values, unitless numbers and sizes. */
export type TextPart = string | ValuePart | NumberPart | SizePart;

/**
 * The plain sentence (print payloads, steps[] and tests): values through withUnit, sizes through `sizeName`
 * (src/lib/verified/awg.ts formatSize), which a sentence with sizes must pass.
 */
export function partsText(parts: TextPart[], sizeName?: (key: SizeKey) => string): string {
  return parts
    .map((part) => {
      if (typeof part === 'string') return part;
      if ('size' in part) {
        if (!sizeName) throw new Error(`partsText: size ${part.size} without a size formatter`);
        return sizeName(part.size);
      }
      if ('n' in part) return formatValue(part.n, part.format);
      return withUnit(part.v, part.unit, part.format);
    })
    .join('');
}
