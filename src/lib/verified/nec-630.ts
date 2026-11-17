// data/verified/nec-630-2023.json (registry domain nec-630-welders; WSZ-037): NEC 2023 630.12 (the welder's and the
// conductors' overcurrent limits, the next higher standard rating), 630.13 (the disconnect) and 630.8 (GFCI for 125 V
// receptacles in welding work areas), each as NFPA's records print the 2023 text. 630.11 is not verified and not used.
import data from '../../../data/verified/nec-630-2023.json';

export const NEC_630_DOMAIN = 'nec-630-welders';

type Rule = { ref: string; status: string; values: Record<string, unknown> };
function rule(ref: string, statuses: string[]): Rule['values'] {
  const r = (data.rules as Rule[]).find((x) => x.ref === ref);
  if (!r || !statuses.includes(r.status)) throw new Error(`nec-630-2023.json: ${ref} is not ${statuses.join(' or ')}`);
  return r.values;
}

const v630_12 = rule('630.12', ['VERIFIED-2023']) as { welder_max_pct_of_i1max: number; conductor_max_pct_of_ampacity: number };
/** 630.12(A) and (B): the welder's overcurrent device at most this percent of I1max; the conductors' at most this percent of their ampacity. */
export const WELDER_OCPD = { pctOfI1max: v630_12.welder_max_pct_of_i1max, pctOfAmpacity: v630_12.conductor_max_pct_of_ampacity };
if (WELDER_OCPD.pctOfI1max !== 200 || WELDER_OCPD.pctOfAmpacity !== 200) throw new Error('nec-630-2023.json: 630.12 percentages changed');

const v630_8 = rule('630.8', ['VERIFIED-2023']) as { volts: number; amps: number[]; max_volts_to_ground: number };
/** 630.8: GFCI for these receptacles (hand tools, portable lighting) in work areas where welders are operated. */
export const WELDING_AREA_GFCI = { volts: v630_8.volts, amps: v630_8.amps, maxVoltsToGround: v630_8.max_volts_to_ground };

const v630_13 = rule('630.13', ['verified-sd2023']) as { type: string };
/** 630.13: the disconnect's kinds. */
export const WELDER_DISCONNECT_TYPES = v630_13.type;
