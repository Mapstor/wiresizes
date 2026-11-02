// data/verified/nec-220-2023.json: NEC 2023 Article 220 dwelling load calculations (as reproduced in NFPA Public
// Input 4311). Typed values for the standard method (220.41, Table 220.45, 220.52–220.57, 220.51, 220.60), the
// optional method (220.82, 220.83) and Table 220.55 with its notes. Values printed only in rule text ("First 3000 at",
// "15 kW + 1 kW for each range", Note 1's 12 kW and 5 percent) are read from that text, so a regenerated file changes
// them here; text that no longer matches throws when the module loads.
import data from '../../../data/verified/nec-220-2023.json';

// unit definition: 1 kVA = 1000 VA
const VA_PER_KVA = 1000;
const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

function rule<T>(ref: string): T {
  const found = data.rules.find((r) => r.ref === ref);
  if (!found) throw new Error(`nec-220-2023.json: no rule ${ref}`);
  return found as unknown as T;
}

function read(text: string, pattern: RegExp): RegExpExecArray {
  const match = pattern.exec(text);
  if (!match) throw new Error(`nec-220-2023.json: "${text}" no longer matches ${pattern}`);
  return match;
}

/** "12", "3.5", "120,000", "3/4", "1 3/4" → a number. */
function parseNumber(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .reduce((sum, part) => {
      const fraction = /^(\d+)\/(\d+)$/.exec(part);
      return sum + (fraction ? Number(fraction[1]) / Number(fraction[2]) : Number(part.replace(/,/g, '')));
    }, 0);
}

function wordNumber(word: string): number {
  const n = NUMBER_WORDS.indexOf(word.toLowerCase());
  if (n === -1) throw new Error(`nec-220-2023.json: "${word}" is not a number word`);
  return n;
}

/** A count column: 5, "1–4", "26–30", "43 and over", "61 and over". */
function parseCount(n: number | string): { minCount: number; maxCount: number } {
  if (typeof n === 'number') return { minCount: n, maxCount: n };
  const range = /^(\d+)–(\d+)$/.exec(n);
  if (range) return { minCount: Number(range[1]), maxCount: Number(range[2]) };
  const over = /^(\d+) and over$/.exec(n);
  if (over) return { minCount: Number(over[1]), maxCount: Infinity };
  return { minCount: Number(read(n, /^(\d+)$/)[1]), maxCount: Number(n) };
}

/** A demand tier: the part of the load up to `upToVa` (Infinity for the remainder) at `pct` percent. */
export interface DemandTier {
  upToVa: number;
  pct: number;
}

// ── Table 220.55 and its notes ──────────────────────────────────────────────

interface Table220_55Json {
  title: string;
  columns: { A: string; B: string; C: string };
  rows: { n: number | string; A_pct: number; B_pct: number; C_kw: number | string }[];
  notes: { '1': string; '3': string; '4': string[] };
}

export interface CookingRow {
  minCount: number;
  maxCount: number;
  /** Column A demand factor, appliances under columnABelowKw. */
  aPct: number;
  /** Column B demand factor, appliances from columnABelowKw through columnBMaxKw. */
  bPct: number;
  /** Column C maximum demand in kW: cBaseKw plus cPerRangeKw for each range (rows 26 and over). */
  cBaseKw: number;
  cPerRangeKw: number;
}

const t220_55 = rule<Table220_55Json>('Table 220.55');
const note1 = read(t220_55.notes['1'], /rated more than (\d+) kW but not more than (\d+) kW, the maximum demand in Column C shall be increased (\d+) percent for each additional kilowatt/);
const note4Ovens = t220_55.notes['4'].map((text) => /not more than (\w+) wall-mounted ovens/.exec(text)).find(Boolean);
if (!note4Ovens) throw new Error('nec-220-2023.json: Table 220.55 Note 4 no longer names the number of ovens');

export const TABLE_220_55 = {
  rows: t220_55.rows.map((row): CookingRow => {
    const perRange = typeof row.C_kw === 'string' ? read(row.C_kw, /^(\d+) kW \+ ([\d /]+) kW for each range$/) : null;
    return {
      ...parseCount(row.n),
      aPct: row.A_pct,
      bPct: row.B_pct,
      cBaseKw: perRange ? Number(perRange[1]) : (row.C_kw as number),
      cPerRangeKw: perRange ? parseNumber(perRange[2]) : 0,
    };
  }),
  /** The table covers household cooking appliances rated over this many kW (title: "over 1 3/4 kW Rating"). */
  minKw: parseNumber(read(t220_55.title, /over ([\d /]+) kW Rating/)[1]),
  /** Column A: appliances rated less than this many kW. */
  columnABelowKw: Number(read(t220_55.columns.A, /^less than ([\d.]+) kW/)[1]),
  /** Column B: appliances rated up to this many kW. */
  columnBMaxKw: Number(read(t220_55.columns.B, /^[\d.]+–([\d.]+) kW/)[1]),
  /** Note 1: ranges rated more than fromKw and not more than maxKw add pctPerKw to Column C for each kW over fromKw. */
  note1: { fromKw: Number(note1[1]), maxKw: Number(note1[2]), pctPerKw: Number(note1[3]) },
  /** Note 4: one counter-mounted cooking unit with not more than this many wall-mounted ovens is one range. */
  note4MaxOvens: wordNumber(note4Ovens[1]),
};

/** The Table 220.55 row for a number of appliances, or null. */
export function cookingRow(count: number): CookingRow | null {
  return TABLE_220_55.rows.find((row) => count >= row.minCount && count <= row.maxCount) ?? null;
}

// ── Standard method ─────────────────────────────────────────────────────────

interface Table220_45Json {
  dwelling_units: { portion: string; pct: number }[];
}

function tierLimitVa(portion: string): number {
  const first = /^First ([\d,]+)(?: or less)? at$/.exec(portion) ?? /^From [\d,]+ to ([\d,]+) at$/.exec(portion);
  if (first) return parseNumber(first[1]);
  read(portion, /^Remainder over [\d,]+ at$/);
  return Infinity;
}

interface Table220_54Json {
  min_w: number;
  table: { rows: { n: string; pct: number | string }[] };
}

export interface DryerRow {
  minCount: number;
  maxCount: number;
  /** Percent = basePct − lessPctPerDryer × (dryers − over); lessPctPerDryer 0 where the table prints one percent. */
  basePct: number;
  lessPctPerDryer: number;
  over: number;
}

function dryerRow(row: { n: string; pct: number | string }): DryerRow {
  const count = parseCount(row.n);
  if (typeof row.pct === 'number') return { ...count, basePct: row.pct, lessPctPerDryer: 0, over: 0 };
  const sliding = /^([\d.]+)% minus ([\d.]+)% for each dryer exceeding (\d+)$/.exec(row.pct);
  if (sliding) {
    return { ...count, basePct: Number(sliding[1]), lessPctPerDryer: Number(sliding[2]), over: Number(sliding[3]) };
  }
  return { ...count, basePct: Number(read(row.pct, /^([\d.]+)%$/)[1]), lessPctPerDryer: 0, over: 0 };
}

const r220_52 = rule<{ A: { va_per_2wire_small_appliance_circuit: number }; B: { va_per_2wire_laundry_circuit_min: number } }>('220.52');
const r220_53 = rule<{ pct: number; min_appliances: number }>('220.53');
const r220_54 = rule<Table220_54Json>('220.54');
const r220_60 = rule<{ text: string }>('220.60');

export const STANDARD_METHOD = {
  /** 220.41: general lighting load per ft² of dwelling floor area. */
  vaPerFt2: rule<{ va_per_ft2: number }>('220.41').va_per_ft2,
  /** Table 220.45, dwelling units: general lighting (with 220.52 circuits included) demand tiers. */
  lightingTiers: rule<Table220_45Json>('Table 220.45').dwelling_units.map(
    (tier): DemandTier => ({ upToVa: tierLimitVa(tier.portion), pct: tier.pct }),
  ),
  /** 220.52(A): each 2-wire small-appliance branch circuit. */
  smallApplianceCircuitVa: r220_52.A.va_per_2wire_small_appliance_circuit,
  /** 220.52(B): each 2-wire laundry branch circuit. */
  laundryCircuitVa: r220_52.B.va_per_2wire_laundry_circuit_min,
  /** 220.53: fastened-in-place appliances at this percent when there are at least minAppliances of them. */
  appliancePct: r220_53.pct,
  minAppliances: r220_53.min_appliances,
  /** 220.54: each dryer at the larger of this and its nameplate rating. */
  dryerMinW: r220_54.min_w,
  /** Table 220.54 demand factors by number of dryers. */
  dryerRows: r220_54.table.rows.map(dryerRow),
  /** 220.57: each EVSE at the larger of this and its nameplate rating. */
  evseMinW: rule<{ min_w: number }>('220.57').min_w,
  /** 220.51: fixed electric space heating at this percent of the connected load. */
  spaceHeatPct: rule<{ pct_of_total_connected_load: number }>('220.51').pct_of_total_connected_load,
  /** 220.60 (the site's reading, nec-220-2023.json notes): an air-conditioning or motor load at this percent. */
  noncoincidentMotorPct: Number(read(r220_60.text, /(\d+) percent of either the motor load or air-conditioning load/)[1]),
};

// ── Optional method ─────────────────────────────────────────────────────────

type HeatingAcPct = number | { compressor: number; supplemental_heat: number };

interface Rule220_82Json {
  general_first_kva: number;
  general_first_pct: number;
  general_rest_pct: number;
  va_per_ft2: number;
  small_appliance_and_laundry_va_each: number;
  heating_ac_items: { item: string; text: string; pct: HeatingAcPct }[];
}

const r220_82 = rule<Rule220_82Json>('220.82');
const c4 = r220_82.heating_ac_items.find((i) => i.item === '(C)(4)');
if (!c4) throw new Error('nec-220-2023.json: 220.82 has no item (C)(4)');

function heatingAcItem(item: string): { item: string; pct: HeatingAcPct } {
  const found = r220_82.heating_ac_items.find((i) => i.item === item);
  if (!found) throw new Error(`nec-220-2023.json: 220.82 has no item ${item}`);
  return { item: found.item, pct: found.pct };
}

interface Rule220_83Json {
  A_no_added_ac_or_heat: { load: string; pct: number }[];
}

export const OPTIONAL_METHOD = {
  /** 220.82(B)(1): general lighting per ft². */
  vaPerFt2: r220_82.va_per_ft2,
  /** 220.82(B)(2): each small-appliance and laundry branch circuit. */
  smallApplianceAndLaundryCircuitVa: r220_82.small_appliance_and_laundry_va_each,
  /** 220.82(B): the first general_first_kva at general_first_pct, the remainder at general_rest_pct. */
  generalTiers: [
    { upToVa: r220_82.general_first_kva * VA_PER_KVA, pct: r220_82.general_first_pct },
    { upToVa: Infinity, pct: r220_82.general_rest_pct },
  ] as DemandTier[],
  /** 220.82(C)(1)–(C)(6), the largest of which is included. */
  heatingAc: {
    airConditioning: heatingAcItem('(C)(1)'),
    heatPumpWithoutSupplementalHeat: heatingAcItem('(C)(2)'),
    heatPumpWithSupplementalHeat: heatingAcItem('(C)(3)'),
    spaceHeatFewUnits: heatingAcItem('(C)(4)'),
    spaceHeatManyUnits: heatingAcItem('(C)(5)'),
    thermalStorage: heatingAcItem('(C)(6)'),
  },
  /** (C)(4) applies with fewer separately controlled space-heating units than this, (C)(5) from this many. */
  spaceHeatUnitsLimit: wordNumber(read(c4.text, /if less than (\w+) separately controlled units/)[1]),
  /** 220.83(A): an existing dwelling with no added air conditioning or electric space heating. */
  existingTiers: rule<Rule220_83Json>('220.83').A_no_added_ac_or_heat.map((tier): DemandTier => {
    const first = /^First (\d+) kVA of load at$/.exec(tier.load);
    if (first) return { upToVa: Number(first[1]) * VA_PER_KVA, pct: tier.pct };
    read(tier.load, /^Remainder of load at$/);
    return { upToVa: Infinity, pct: tier.pct };
  }),
};
