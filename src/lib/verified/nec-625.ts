// data/verified/nec-625-2023.json (WSZ-031): the 2023 Article 625 values the EV charger guide states. Each rule throws
// at import unless its status starts with VERIFIED-2023, so a page never prints a value whose status changed.
import data from '../../../data/verified/nec-625-2023.json';

export const NEC_625_DOMAIN = 'nec-625-ev';

interface Rule {
  ref: string;
  status: string;
  values: Record<string, unknown>;
}

function verified(ref: string): Record<string, unknown> {
  const rule = (data.rules as Rule[]).find((r) => r.ref === ref);
  if (!rule || !rule.status.startsWith('VERIFIED-2023')) throw new Error(`${ref} is not VERIFIED-2023 in nec-625-2023.json`);
  return rule.values;
}

function num(values: Record<string, unknown>, key: string): number {
  const v = values[key];
  if (typeof v !== 'number') throw new Error(`nec-625-2023.json: ${key} is not a number`);
  return v;
}

const r40 = verified('625.40');
const r41 = verified('625.41');
const r42 = verified('625.42');
const r43 = verified('625.43');
const r44 = verified('625.44');
const r54 = verified('625.54');

if (r42.charging_load_is_continuous !== true) throw new Error('nec-625-2023.json: 625.42 no longer makes charging a continuous load');
if (r54.gfci_required_for !== 'receptacles' || r54.covers_hardwired_2023 !== false) throw new Error('nec-625-2023.json: 625.54 changed scope');

/** 625.40: an outlet for EVSE above these values gets its own branch circuit. */
export const INDIVIDUAL_CIRCUIT = { aboveA: num(r40, 'individual_circuit_above_a'), aboveV: num(r40, 'individual_circuit_above_v') };

/** 625.41: overcurrent protection of at least this percent of the equipment's maximum load. */
export const EV_OCPD_PERCENT = num(r41, 'ocpd_pct_of_max_load');

/** 625.43: EVSE rated above these values needs a readily accessible, lockable disconnecting means. */
export const DISCONNECT_ABOVE = { a: num(r43, 'disconnect_above_a'), voltsToGround: num(r43, 'disconnect_above_v_to_ground') };

/** 625.44(A)(3) and (B)(3): the 125/250 V single-phase receptacle ratings, A. */
export const RECEPTACLE_125_250_A = (() => {
  const portable = r44.portable_125_250v_1ph_a as number[];
  const fastened = r44.fastened_125_250v_1ph_3pole_4wire_a as number[];
  if (portable.join() !== fastened.join()) throw new Error('nec-625-2023.json: the 625.44 receptacle lists differ');
  return portable;
})();
