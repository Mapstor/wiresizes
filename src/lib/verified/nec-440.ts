// data/verified/nec-430-440-2023.json, the rules an air conditioner circuit reads (registry domain nec-440-hvac;
// WSZ-036): 440.4(B) (the nameplate's minimum supply circuit conductor ampacity and maximum protective device),
// 440.14 (the disconnect's location) and 240.4(G) (air-conditioning conductors protected per Article 440, not 240.4(D)).
// Throws at import unless each is VERIFIED-2023.
import data from '../../../data/verified/nec-430-440-2023.json';

export const NEC_440_DOMAIN = 'nec-440-hvac';

type Rule = { ref: string; status: string; values: Record<string, unknown> };
function rule(ref: string): Rule {
  const r = (data.rules as Rule[]).find((x) => x.ref === ref);
  if (!r || r.status !== 'VERIFIED-2023') throw new Error(`nec-430-440-2023.json: ${ref} is not VERIFIED-2023`);
  return r;
}

const nameplate = rule('440.4(B)').values as { nameplate: string[]; exception_2: string };
const disconnect = rule('440.14').values as { location: string };
const table240_4G = rule('240.4(G)').values as { air_conditioning: string };

/** 440.4(B): the two nameplate markings the calculator reads. */
export const NAMEPLATE_MARKINGS = { mca: nameplate.nameplate[0], mocp: nameplate.nameplate[1] };
/** 440.4(B) Exception No. 2: some room air conditioners need not carry the two markings. */
export const ROOM_AC_EXCEPTION = nameplate.exception_2;
/** 440.14: within sight from, and readily accessible from, the equipment. */
export const DISCONNECT_LOCATION = disconnect.location;
/** Table 240.4(G)'s air-conditioning row. */
export const AC_CONDUCTORS_240_4_G = table240_4G.air_conditioning;

if (!/minimum supply circuit conductor ampacity/.test(NAMEPLATE_MARKINGS.mca) || !/maximum rating/.test(NAMEPLATE_MARKINGS.mocp)) {
  throw new Error('nec-430-440-2023.json: 440.4(B) markings changed');
}
if (!/Article 440, Parts III, IV, VI/.test(AC_CONDUCTORS_240_4_G)) throw new Error('nec-430-440-2023.json: Table 240.4(G) row changed');

// 440.22(A): the motor-compressor's protective device up to 175 % of its rated-load current (or branch-circuit selection
// current, whichever is greater), and up to 225 % where that will not carry the starting current. The main rule is
// verified-sd2023 and the values VERIFIED-2023 (Eaton's 2023 reprint, with NFPA's permission).
const p440_22 = (data.rules as Rule[]).find((x) => x.ref === '440.22(A)');
if (!p440_22 || !p440_22.status.includes('VERIFIED-2023')) throw new Error('nec-430-440-2023.json: 440.22(A) values are not VERIFIED-2023');
const v440_22 = p440_22.values as { max_pct: number; exc2_max_pct_if_needed_to_start: number };
export const COMPRESSOR_PROTECTION = { maxPct: v440_22.max_pct, startPct: v440_22.exc2_max_pct_if_needed_to_start };
if (!(COMPRESSOR_PROTECTION.maxPct > 100 && COMPRESSOR_PROTECTION.startPct > COMPRESSOR_PROTECTION.maxPct)) {
  throw new Error('nec-430-440-2023.json: 440.22(A) percentages out of order');
}
