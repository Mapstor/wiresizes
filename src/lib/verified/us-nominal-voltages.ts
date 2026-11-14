// The nominal system voltages the calculators offer, read from the us-nominal-voltages registry row's coverage
// (North Carolina Utilities Commission Rule R8-17, which adopts ANSI C84.1), so no voltage list is typed into a page
// (WSZ-006b). Server only (registry.ts reads the CSV). Throws when the registry words the list differently: fix the
// pattern here, never type the values into a page.
import 'server-only';
import { coverage } from './registry';

export const NOMINAL_VOLTAGES_DOMAIN = 'us-nominal-voltages';

const text = coverage(NOMINAL_VOLTAGES_DOMAIN);
const lists = /single-phase ([^;]+); three-phase ([^(]+?) \(/.exec(text);
if (!lists) throw new Error('data-sources.csv us-nominal-voltages coverage: no "single-phase …; three-phase … (" lists');

const split = (s: string) => s.split(',').map((v) => v.trim()).filter(Boolean);

/** Single-phase nominal systems, as the rule writes them: "120", "120/240". */
export const NOMINAL_SINGLE_PHASE: string[] = split(lists[1]);
/** Three-phase nominal systems at low voltage: "208Y/120", "240/120", "240", "480Y/277", "480", "600". */
export const NOMINAL_THREE_PHASE: string[] = split(lists[2]);

for (const system of [...NOMINAL_SINGLE_PHASE, ...NOMINAL_THREE_PHASE]) {
  if (!/^\d+(Y?\/\d+)?$/.test(system)) throw new Error(`us-nominal-voltages: "${system}" is not a system voltage`);
}

/** Every voltage a nominal system names: its line-to-line and, for a Y or split system, its line-to-neutral voltage. */
export const NOMINAL_VOLTS: number[] = [
  ...new Set([...NOMINAL_SINGLE_PHASE, ...NOMINAL_THREE_PHASE].flatMap((s) => s.split(/Y?\//).map(Number))),
].sort((a, b) => a - b);

/** Throws when a calculator offers a voltage that no nominal system names (checked when a page that cites them builds). */
export function assertNominal(volts: readonly number[], what: string): void {
  const off = volts.filter((v) => !NOMINAL_VOLTS.includes(v));
  if (off.length) throw new Error(`${what}: ${off.join(', ')} V is not a nominal system voltage in us-nominal-voltages`);
}
