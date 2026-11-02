// Numbers as the calculators show them in results, headlines and print payloads: en-US digit grouping and never
// exponential notation ("38,243.68", "15,900", "0.000005186"). Rounding is toFixed's or toPrecision's, so the
// digits are the ones the tools showed before; only the grouping is new. The same output on server and client (D-11).

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
