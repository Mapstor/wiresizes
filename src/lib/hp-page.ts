// The horsepower to amps page's worked values (WSZ-011), each through motorRun so the copy states the engine's own
// numbers: the default 1 hp single-phase motor at 230 V, a 5 hp three-phase motor at 460 V, the small and large ends
// of Table 430.250 at 460 V, and the chart's rows (every single-phase rating at 230 V). Pure data, no JSX.
import { isMotorRunError, motorRun, hpRatings } from './calculations/motor-flc';
import type { MotorRun, ToolPhase } from './calculations/motor-flc';

function run(phase: ToolPhase, hp: string, column: string): MotorRun {
  const r = motorRun({ phase, hp, column });
  if (isMotorRunError(r)) throw new Error(`hp page: ${r.error} for ${phase} ${hp} hp ${column} V`);
  if (r.flcA === null) throw new Error(`hp page: no table current for ${phase} ${hp} hp ${column} V`);
  return r;
}

/** The calculator's default: a 1 hp single-phase motor in the 230 V column. */
export const EXAMPLE = run('1', '1', '230');
/** The same motor in the 115 V column. */
export const EXAMPLE_115 = run('1', '1', '115');
/** A 5 hp three-phase motor on a 440–480 V system, and on 208 V. */
export const FIVE_460 = run('3', '5', '460');
export const FIVE_208 = run('3', '5', '208');
/** Table 430.250 at 460 V: a 1 hp motor, the smallest rating and the largest. */
export const THREE_1 = run('3', '1', '460');
export const THREE_HALF = run('3', '1/2', '460');
export const THREE_500 = run('3', '500', '460');
/** A 10 hp DC motor at 240 V: DC has no power factor. */
export const DC_10 = run('dc', '10', '240');

/** The chart: each single-phase rating in the 230 V column, its table current and the current of its power alone. */
export const RATIO_ROWS = hpRatings('1').map((hp) => {
  const r = run('1', hp, '230');
  return { hp, flcA: r.flcA as number, powerAmps: r.powerAmps, ratio: r.ratio as number };
});
