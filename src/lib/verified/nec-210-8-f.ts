// data/verified/nec-2023-rules-round2.json, item "210.8(F) TIA 23-3": GFCI protection for outdoor outlets at dwellings,
// 2023 edition as amended by TIA 23-3 (registry domain nec-2023-rule-excerpts). Throws at import unless the item is
// VERIFIED-2023 (WSZ-008e).
import data from '../../../data/verified/nec-2023-rules-round2.json';

export const NEC_210_8_F_DOMAIN = 'nec-2023-rule-excerpts';

const item = (data.items as { ref: string; status: string; values: Record<string, unknown> }[]).find((r) => r.ref.startsWith('210.8(F) TIA 23-3'));
if (!item || !item.status.startsWith('VERIFIED-2023')) throw new Error('nec-2023-rules-round2.json: 210.8(F) is not VERIFIED-2023');
const { max_volts_to_ground: v, max_amperes: a } = item.values as { max_volts_to_ground: unknown; max_amperes: unknown };
if (typeof v !== 'number' || typeof a !== 'number') throw new Error('nec-2023-rules-round2.json: 210.8(F) values are not numbers');

/** 210.8(F) (2023): outdoor outlets at dwellings on single-phase branch circuits up to these ratings need GFCI protection. */
export const OUTDOOR_GFCI = { maxVoltsToGround: v, maxA: a };
