// data/verified/nec-551-2023.json: NEC 2023 Article 551 Part VI, RV parks (registry domain nec-551-rv-demand; WSZ-033):
// the receptacles a park provides (551.71), GFCI at site equipment (551.71(F)), the per-site loads of 551.73(A) and the
// demand factors of Table 551.73(A). Throws at import unless each item is VERIFIED-2023.
import data from '../../../data/verified/nec-551-2023.json';

export const NEC_551_DOMAIN = 'nec-551-rv-demand';

type Item = { status: string; values: Record<string, unknown> };
function verified(key: string): Item {
  const item = (data.items as Record<string, Item>)[key];
  if (!item || !item.status.startsWith('VERIFIED-2023')) throw new Error(`nec-551-2023.json: ${key} is not VERIFIED-2023`);
  return item;
}

const r71 = verified('551.71').values as {
  B_30A_125V_min_pct_all_sites: number;
  C_50A_125_250V_min_pct_existing: number;
  C_50A_125_250V_min_pct_new: number;
};
const r73 = verified('551.73').values as {
  site_va: { '50A_208Y120_or_120_240': number; '20A_and_30A': number; '20A_only': number; '20A_only_tent': number };
  demand_factor_table: { from: number; to: number | null; pct: number }[];
  B_example: { sites: number; pct: number; site_va: number; per_site_va: number; total_va: number };
};

/** 551.71(B) and (C): the least share of sites with a 30 A and with a 50 A receptacle, percent. */
export const RECEPTACLE_SHARES = {
  min30Pct: r71.B_30A_125V_min_pct_all_sites,
  min50PctExisting: r71.C_50A_125_250V_min_pct_existing,
  min50PctNew: r71.C_50A_125_250V_min_pct_new,
};

/** 551.73(A): the calculated load per site, VA. */
export const SITE_VA = {
  site50: r73.site_va['50A_208Y120_or_120_240'],
  site30: r73.site_va['20A_and_30A'],
  site20: r73.site_va['20A_only'],
  tent: r73.site_va['20A_only_tent'],
};

/** Table 551.73(A): the demand factor by number of sites (to: null for "36 plus"). */
export const DEMAND_FACTORS = r73.demand_factor_table;

/** The demand factor, percent, for a number of sites (Table 551.73(A)); null below one site. */
export function demandFactor(sites: number): number | null {
  if (!(Number.isInteger(sites) && sites >= 1)) return null;
  const row = DEMAND_FACTORS.find((r) => sites >= r.from && (r.to === null || sites <= r.to));
  return row ? row.pct : null;
}

/** 551.73(B)'s own example: 20 sites at 45 % of 3600 VA. */
export const NEC_EXAMPLE = r73.B_example;

if (demandFactor(NEC_EXAMPLE.sites) !== NEC_EXAMPLE.pct || (NEC_EXAMPLE.site_va * NEC_EXAMPLE.pct) / 100 !== NEC_EXAMPLE.per_site_va) {
  throw new Error('nec-551-2023.json: 551.73(B) example and Table 551.73(A) disagree');
}
if (DEMAND_FACTORS.length !== 14 || DEMAND_FACTORS[0].pct !== 100) throw new Error('nec-551-2023.json: Table 551.73(A) is not the 14-row table');
