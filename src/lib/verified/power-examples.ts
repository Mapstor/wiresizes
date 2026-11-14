// The two U.S. Department of Energy fact sheets' worked examples, read from their registry rows' coverage (WSZ-006d), so
// the three-phase calculator page and /methodology state the sheets' own figures without typing them. Server only
// (registry.ts reads the CSV). Throws when the registry words an example differently: fix the pattern here, never type
// the values into a page.
import 'server-only';
import { coverage } from './registry';

export const DOE_MOTOR_DOMAIN = 'doe-motor-load-efficiency';
export const DOE_PF_DOMAIN = 'doe-power-factor-cost';

const num = '(\\d+(?:\\.\\d+)?)';

const motor = new RegExp(`worked example ${num} V, ${num} A, PF ${num} → ${num} kW`).exec(coverage(DOE_MOTOR_DOMAIN));
if (!motor) throw new Error(`data-sources.csv ${DOE_MOTOR_DOMAIN} coverage: no "worked example N V, N A, PF N → N kW"`);

/** DOE/GO-10097-517's measured motor: the mean line-to-line voltage, line current and power factor, and the kW it prints. */
export const DOE_MOTOR = { volts: Number(motor[1]), amps: Number(motor[2]), pf: Number(motor[3]), printedKw: Number(motor[4]) };

const pf = new RegExp(`example: ${num} kW at ${num} kVA .*? bring it to ${num} kVA, PF ${num} and about ${num} % less current`).exec(
  coverage(DOE_PF_DOMAIN),
);
if (!pf) throw new Error(`data-sources.csv ${DOE_PF_DOMAIN} coverage: no "example: N kW at N kVA … bring it to N kVA, PF N and about N % less current"`);

/** DOE/GO-10096-286's example: real and apparent power before, the apparent power and power factor after, the current saved. */
export const DOE_PF = {
  kw: Number(pf[1]),
  kva: Number(pf[2]),
  kvaAfter: Number(pf[3]),
  to: Number(pf[4]),
  printedPct: Number(pf[5]),
};
