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

/** The number, a plain space (U+0020) and the unit: withUnit(4.8561, 'V', { fixed: 2 }) → "4.86 V" (D-14). */
export function withUnit(value: number, unit: string, format?: ValueFormat): string {
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
  unit: string;
  src: string;
  format?: ValueFormat;
}

/** A conductor size in a sentence. */
export interface SizePart {
  size: SizeKey;
}

/** A sentence in parts: plain text, values and sizes. */
export type TextPart = string | ValuePart | SizePart;

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
      return withUnit(part.v, part.unit, part.format);
    })
    .join('');
}
