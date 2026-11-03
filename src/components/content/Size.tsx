// A conductor size name: <Size s="4/0" /> renders <span data-size="4/0">4/0 AWG</span> through formatSize. Sizes are
// names, not measurements, so the number-trace gate skips [data-size]. A key that is in neither awg.json nor
// nec-310-16.json throws, which fails the build.
import { awgRow, formatSize, kcmilRow } from '@/lib/verified/awg';
import type { SizeKey } from '@/lib/verified/awg';
import { TABLE_310_16_SIZES } from '@/lib/verified/nec-310-16';

export function isSizeKey(key: SizeKey): boolean {
  return awgRow(key) !== null || kcmilRow(key) !== null || TABLE_310_16_SIZES.includes(key);
}

/** svg: inside an SVG <text>, a <tspan>, since a <span> does not render there. */
export function Size({ s, svg = false }: { s: SizeKey; svg?: boolean }) {
  if (!isSizeKey(s)) throw new Error(`No conductor size "${s}" in awg.json or nec-310-16.json`);
  return svg ? <tspan data-size={s}>{formatSize(s)}</tspan> : <span data-size={s}>{formatSize(s)}</span>;
}
