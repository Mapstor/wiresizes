// The dryer calculator page's examples (WSZ-010c), run through the dryer engine. The golden "load-calc-2023" cases
// behind them: 220.54 for a 4500 W and a 5600 W nameplate (5000 W and 5600 W), and Table 220.54 for five dryers (85 %).
import { dryerRun, dryerTableRows, isDryerError } from './calculations/dryer-circuit';
import type { DryerRun, DryerRunInput } from './calculations/dryer-circuit';
import { minimumConductor } from './calculations/conductor-sizing';
import { GE_DBLR333EE, WHIRLPOOL_DRYER } from './verified/mfr-equipment';
import type { SizeKey } from './verified/awg';

function run(input: DryerRunInput): DryerRun {
  const r = dryerRun(input);
  if (isDryerError(r)) throw new Error(`dryer page: ${r.error}`);
  return r;
}

const BASE = { dryers: 1, volts: 240 as const, circuitA: WHIRLPOOL_DRYER.circuitA, material: 'Cu' as const, wiringMethod: 'cable' as const, termination: 'unknown' as const };

/** GE's DBLR333EE at 240 V: 5,600 W. */
export const EXAMPLE = run({ ...BASE, nameplateW: GE_DBLR333EE.at240.w });
/** A dryer rated under 5,000 W still counts as 5,000 W. */
export const SMALL_NAMEPLATE_W = 4500;
export const SMALL = run({ ...BASE, nameplateW: SMALL_NAMEPLATE_W });
/** Five dryers of 5,000 W, Table 220.54's first reduced row. */
export const FIVE = run({ ...BASE, nameplateW: 5000, dryers: 5 });
export const TABLE_ROWS = dryerTableRows();

/** The wire and ground wire for the 30 A circuit the makers give, both metals, both columns. */
function wire(material: 'Cu' | 'Al', warm: boolean): SizeKey {
  const m = minimumConductor({ ocpdA: WHIRLPOOL_DRYER.circuitA, material, wiringMethod: warm ? 'conductors' : 'cable', termination: warm ? '75' : 'unknown' });
  if (!m) throw new Error(`dryer page: no ${material} size for the dryer circuit`);
  return m.size;
}
const egc = (material: 'Cu' | 'Al') => minimumConductor({ ocpdA: WHIRLPOOL_DRYER.circuitA, material })?.egc ?? null;
export const WIRE_30 = { cuCable: wire('Cu', false), cuWarm: wire('Cu', true), alCable: wire('Al', false), alWarm: wire('Al', true), egcCu: egc('Cu'), egcAl: egc('Al') };
