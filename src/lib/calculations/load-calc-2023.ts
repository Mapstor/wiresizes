// Dwelling load calculations of NEC 2023 Article 220 (src/lib/verified/nec-220-2023.ts): Table 220.55 with Notes 1, 3
// and 4; dryers (220.54, Table 220.54); EVSE (220.57); the standard method (220.41 and 220.52 through Table 220.45,
// 220.53, 220.54, Table 220.55, 220.51 and the site's reading of 220.60: heating against air conditioning at 125 %);
// the optional method (220.82) and 220.83(A). The service is the smallest Table 310.12 rating at or above the load
// current. Loads in VA, with W and kW counted as VA and kVA as the rules do.
import { cookingRow, OPTIONAL_METHOD, STANDARD_METHOD, TABLE_220_55 } from '../verified/nec-220-2023';
import type { CookingRow, DemandTier } from '../verified/nec-220-2023';
import { TABLE_310_12_ROWS } from '../verified/nec-310-12';
import type { ServiceRow } from '../verified/nec-310-12';
import { formatSize } from '../verified/awg';
import { partsText } from './format';
import type { NumberPart, TextPart, ValuePart } from './format';

export const ENGINE_ID = 'load-calc-2023';
export const DOMAINS = ['nec-220-load-calcs', 'nec-310-12'];

// unit definitions: 1 kW = 1000 W; a percent is a hundredth
const W_PER_KW = 1000;
const PERCENT = 100;
// Table 220.55 Note 1: a "major fraction" of a kilowatt is more than half of one
const HALF = 1 / 2;

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

/** A load over demand tiers: each tier's part of the load at its percent, added. */
export function tieredDemand(va: number, tiers: DemandTier[]): number {
  let demand = 0;
  let from = 0;
  for (const tier of tiers) {
    if (va <= from) break;
    demand += ((Math.min(va, tier.upToVa) - from) * tier.pct) / PERCENT;
    from = tier.upToVa;
  }
  return demand;
}

/**
 * Table 220.55 Column C for `count` ranges of one rating; Note 1 for ratings over 12 kW through 27 kW: Column C plus
 * 5 % for each kW or major fraction over 12 kW. Null outside the table: a rating not over 1 3/4 kW or over 27 kW, or
 * a count without a row.
 */
export function rangeDemandKw(count: number, ratingKw: number): number | null {
  const row = Number.isInteger(count) ? cookingRow(count) : null;
  const { fromKw, maxKw, pctPerKw } = TABLE_220_55.note1;
  if (!row || !(ratingKw > TABLE_220_55.minKw) || ratingKw > maxKw) return null;
  const columnC = row.cBaseKw + row.cPerRangeKw * count;
  if (ratingKw <= fromKw) return columnC;
  return (columnC * (PERCENT + note1Steps(ratingKw) * pctPerKw)) / PERCENT;
}

/** Note 1: the kilowatts, each whole one or major fraction of one, by which a rating exceeds 12 kW (0 at or below). */
export function note1Steps(ratingKw: number): number {
  const over = ratingKw - TABLE_220_55.note1.fromKw;
  if (!(over > 0)) return 0;
  return Math.floor(over) + (over - Math.floor(over) > HALF ? 1 : 0);
}

export interface Note3Result {
  demandKw: number;
  column: 'A' | 'B';
  pct: number;
}

/**
 * Table 220.55 Note 3, in place of Column C: appliances rated over 1 3/4 kW through 8 3/4 kW, their nameplates added
 * and multiplied by the Column A (under 3 1/2 kW) or Column B factor for their number. Null when an appliance is
 * outside that range, or when the appliances fall under both columns (how Note 3 counts them then is not settled).
 */
export function note3DemandKw(appliancesKw: number[]): Note3Result | null {
  const { minKw, columnABelowKw, columnBMaxKw } = TABLE_220_55;
  if (appliancesKw.length === 0 || appliancesKw.some((kw) => !(kw > minKw && kw <= columnBMaxKw))) return null;
  const underA = appliancesKw.filter((kw) => kw < columnABelowKw).length;
  if (underA !== 0 && underA !== appliancesKw.length) return null;
  const row = cookingRow(appliancesKw.length);
  if (!row) return null;
  const column = underA === 0 ? 'B' : 'A';
  const pct = column === 'A' ? row.aPct : row.bPct;
  return { demandKw: (sum(appliancesKw) * pct) / PERCENT, column, pct };
}

/** Table 220.55 Note 4: one wall-mounted oven or one counter-mounted cooking unit is its nameplate rating. */
export function singleUnitBranchLoadKw(nameplateKw: number): number {
  return nameplateKw;
}

/**
 * Table 220.55 Note 4: a counter-mounted cooking unit and not more than two wall-mounted ovens on one branch circuit
 * in one room are added and treated as one range. Null for more ovens or a total outside the table.
 */
export function cooktopAndOvensBranchLoad(
  cooktopKw: number,
  ovensKw: number[],
): { equivalentRangeKw: number; demandKw: number } | null {
  if (ovensKw.length > TABLE_220_55.note4MaxOvens) return null;
  const equivalentRangeKw = cooktopKw + sum(ovensKw);
  const demandKw = rangeDemandKw(1, equivalentRangeKw);
  return demandKw === null ? null : { equivalentRangeKw, demandKw };
}

/** 220.54: a dryer at the larger of 5000 W and its nameplate. */
export function dryerLoadW(nameplateW: number): number {
  return Math.max(STANDARD_METHOD.dryerMinW, nameplateW);
}

/** Table 220.54: the demand factor in percent for a number of dryers, or null. */
export function dryerDemandPct(count: number): number | null {
  const row = STANDARD_METHOD.dryerRows.find((r) => count >= r.minCount && count <= r.maxCount);
  return row ? row.basePct - row.lessPctPerDryer * (count - row.over) : null;
}

/** 220.57: EVSE at the larger of 7200 W and its nameplate. */
export function evseLoadW(nameplateW: number): number {
  return Math.max(STANDARD_METHOD.evseMinW, nameplateW);
}

/** The smallest Table 310.12 row rated at least `amps`, or null above 400 A. */
export function serviceRowForAmps(amps: number): ServiceRow | null {
  return TABLE_310_12_ROWS.find((row) => row.ratingA >= amps) ?? null;
}

export interface StandardDwellingInput {
  ft2: number;
  smallApplianceCircuits: number;
  laundryCircuits: number;
  /** 220.53 appliances fastened in place (not cooking units, dryers, space heating, air conditioning or EVSE). */
  fastenedAppliancesW: number[];
  /** One dryer's nameplate (220.54), or null. */
  dryerW: number | null;
  /** One range's nameplate in kW (Table 220.55), or null. */
  rangeKw: number | null;
  /** Fixed electric space heating, total connected load (220.51). */
  spaceHeatW: number;
  acVa: number;
  /** One EVSE's nameplate (220.57), or null. */
  evseW?: number | null;
  volts: number;
}

export interface StandardDwellingResult {
  /** 220.41 floor area load plus the 220.52 small-appliance and laundry circuits. */
  generalLightingVa: number;
  /** After Table 220.45. */
  lightingAfterDemandVa: number;
  /** After 220.53. */
  appliancesVa: number;
  dryerVa: number;
  rangeVa: number;
  /** 220.57, 0 without an EVSE. */
  evseVa: number;
  /** Fixed electric space heating at 220.51's percent. */
  heatVa: number;
  /** Air conditioning at 220.60's percent (the site's reading). */
  coolingVa: number;
  /** The larger of the space heating (220.51) and the air conditioning at 125 % (220.60). */
  heatOrAcVa: number;
  totalVa: number;
  amps: number;
  serviceRow: ServiceRow | null;
}

/** The standard method for one dwelling unit; null for invalid inputs or a range outside Table 220.55. */
export function standardDwellingLoad(input: StandardDwellingInput): StandardDwellingResult | null {
  const m = STANDARD_METHOD;
  if (!(input.volts > 0 && input.ft2 >= 0)) return null;
  const generalLightingVa =
    input.ft2 * m.vaPerFt2 + input.smallApplianceCircuits * m.smallApplianceCircuitVa + input.laundryCircuits * m.laundryCircuitVa;
  const lightingAfterDemandVa = tieredDemand(generalLightingVa, m.lightingTiers);
  const fastenedVa = sum(input.fastenedAppliancesW);
  const appliancesVa = input.fastenedAppliancesW.length >= m.minAppliances ? (fastenedVa * m.appliancePct) / PERCENT : fastenedVa;
  const dryerVa = input.dryerW === null ? 0 : dryerLoadW(input.dryerW);
  const rangeKw = input.rangeKw === null ? 0 : rangeDemandKw(1, input.rangeKw);
  if (rangeKw === null) return null;
  const rangeVa = rangeKw * W_PER_KW;
  const evseVa = input.evseW === undefined || input.evseW === null ? 0 : evseLoadW(input.evseW);
  const heatVa = (input.spaceHeatW * m.spaceHeatPct) / PERCENT;
  const coolingVa = (input.acVa * m.noncoincidentMotorPct) / PERCENT;
  const heatOrAcVa = Math.max(heatVa, coolingVa);
  const totalVa = lightingAfterDemandVa + appliancesVa + dryerVa + rangeVa + evseVa + heatOrAcVa;
  const amps = totalVa / input.volts;
  return {
    generalLightingVa,
    lightingAfterDemandVa,
    appliancesVa,
    dryerVa,
    rangeVa,
    evseVa,
    heatVa,
    coolingVa,
    heatOrAcVa,
    totalVa,
    amps,
    serviceRow: serviceRowForAmps(amps),
  };
}

export interface OptionalDwellingInput {
  ft2: number;
  smallApplianceAndLaundryCircuits: number;
  /**
   * 220.82(B)(3) and (B)(4): nameplates of appliances fastened in place or on a specific circuit, ranges, wall-mounted
   * ovens, counter-mounted cooking units, dryers not on the laundry circuit, water heaters and permanent motors.
   */
  nameplateItemsVa: number[];
  /** 220.82(C)(1): air conditioning and cooling. */
  acVa?: number;
  /** (C)(2): a heat pump without supplemental electric heating. */
  heatPumpVa?: number;
  /** (C)(3): the heat pump compressor and the supplemental heating of a central electric space-heating system. */
  heatPumpCompressorVa?: number;
  supplementalHeatVa?: number;
  /** (C)(4) or (C)(5) by the number of separately controlled units. */
  spaceHeatVa?: number;
  spaceHeatUnits?: number;
  /** (C)(6): electric thermal storage and other heating expected to run at full nameplate continuously. */
  thermalStorageVa?: number;
  volts: number;
}

export interface OptionalDwellingResult {
  /** 220.82(B)(1)–(B)(4). */
  generalLoadVa: number;
  /** After 220.82(B)'s first 10 kVA at 100 % and the rest at 40 %. */
  generalAfterDemandVa: number;
  /** The largest 220.82(C) selection: its item ("(C)(4)"); null when no heating or air conditioning is given. */
  heatingAcItem: string | null;
  heatingAcVa: number;
  totalVa: number;
  amps: number;
  serviceRow: ServiceRow | null;
}

function atPct(va: number | undefined, pct: number): number {
  return va === undefined ? 0 : (va * pct) / PERCENT;
}

/** The optional method of 220.82; null for invalid inputs (space heating without its number of units). */
export function optionalDwellingLoad(input: OptionalDwellingInput): OptionalDwellingResult | null {
  const m = OPTIONAL_METHOD;
  if (!(input.volts > 0 && input.ft2 >= 0)) return null;
  if (input.spaceHeatVa !== undefined && !(input.spaceHeatUnits !== undefined && input.spaceHeatUnits >= 1)) return null;
  const generalLoadVa =
    input.ft2 * m.vaPerFt2 + input.smallApplianceAndLaundryCircuits * m.smallApplianceAndLaundryCircuitVa + sum(input.nameplateItemsVa);
  const generalAfterDemandVa = tieredDemand(generalLoadVa, m.generalTiers);

  const pct = (item: { pct: number | { compressor: number; supplemental_heat: number } }): number =>
    typeof item.pct === 'number' ? item.pct : Number.NaN;
  const h = m.heatingAc;
  const combined = h.heatPumpWithSupplementalHeat.pct;
  const spaceHeat = (input.spaceHeatUnits ?? 0) < m.spaceHeatUnitsLimit ? h.spaceHeatFewUnits : h.spaceHeatManyUnits;
  const selections = [
    { item: h.airConditioning.item, va: atPct(input.acVa, pct(h.airConditioning)), given: input.acVa },
    { item: h.heatPumpWithoutSupplementalHeat.item, va: atPct(input.heatPumpVa, pct(h.heatPumpWithoutSupplementalHeat)), given: input.heatPumpVa },
    {
      item: h.heatPumpWithSupplementalHeat.item,
      va:
        typeof combined === 'number'
          ? Number.NaN
          : atPct(input.heatPumpCompressorVa, combined.compressor) + atPct(input.supplementalHeatVa, combined.supplemental_heat),
      given: input.heatPumpCompressorVa ?? input.supplementalHeatVa,
    },
    { item: spaceHeat.item, va: atPct(input.spaceHeatVa, pct(spaceHeat)), given: input.spaceHeatVa },
    { item: h.thermalStorage.item, va: atPct(input.thermalStorageVa, pct(h.thermalStorage)), given: input.thermalStorageVa },
  ].filter((s) => s.given !== undefined);
  if (selections.some((s) => !Number.isFinite(s.va))) throw new Error('nec-220-2023.json: a 220.82(C) item has no usable percent');
  const largest = selections.reduce<{ item: string; va: number } | null>((best, s) => (best && best.va >= s.va ? best : s), null);
  const heatingAcVa = largest ? largest.va : 0;
  const totalVa = generalAfterDemandVa + heatingAcVa;
  const amps = totalVa / input.volts;
  return {
    generalLoadVa,
    generalAfterDemandVa,
    heatingAcItem: largest ? largest.item : null,
    heatingAcVa,
    totalVa,
    amps,
    serviceRow: serviceRowForAmps(amps),
  };
}

/** 220.83(A): an existing dwelling unit with no added air conditioning or electric space heating. */
export function existingDwellingLoad(totalVa: number): number {
  return tieredDemand(totalVa, OPTIONAL_METHOD.existingTiers);
}

// ── The residential load calculator (WSZ-010a): one dwelling, both methods, every step ───────────────────────────

/** A 120/240 V single-phase service: the load current is the load divided by 240 V (Table 310.12's scope). */
export const DWELLING_VOLTS = 240;
/** Table 220.55 covers ranges rated over this (1 3/4 kW) through RANGE_MAX_KW (Note 1's 27 kW). */
export const RANGE_OVER_KW = TABLE_220_55.minKw;
export const RANGE_MAX_KW = TABLE_220_55.note1.maxKw;

export type Heating = 'none' | 'electric' | 'heat-pump';

export interface DwellingRunInput {
  ft2: number;
  smallApplianceCircuits: number;
  laundryCircuits: number;
  /** One electric range's nameplate in kW, or null. */
  rangeKw: number | null;
  /** One electric dryer's nameplate in W, or null. */
  dryerW: number | null;
  waterHeaterW: number | null;
  /** Other appliances fastened in place, each rated 500 W or more (220.53). */
  otherAppliancesW: number[];
  /** One EV charger's nameplate in W, or null. */
  evW: number | null;
  heating: Heating;
  /** 'electric': the fixed electric space heating; 'heat-pump': the heat pump's backup electric heat (0 if none). */
  heatW: number;
  /** 'electric': its number of separately controlled units, which picks 220.82(C)(4) or (C)(5). */
  heatUnits: number;
  /** 'heat-pump': the heat pump's nameplate rating. */
  heatPumpVa: number;
  /** 'none' or 'electric': the air conditioning's nameplate rating. */
  acVa: number;
}

export interface DwellingMethodRun {
  totalVa: number;
  amps: number;
  /** The smallest Table 310.12 row rated at least `amps`; null above its largest row. */
  serviceRow: ServiceRow | null;
  steps: string[];
  stepParts: TextPart[][];
}

export interface DwellingRun {
  standard: DwellingMethodRun & { detail: StandardDwellingResult };
  optional: DwellingMethodRun & { detail: OptionalDwellingResult };
}

export type DwellingError = 'range-outside-table' | 'heating-units';

const L = 'nec-220-load-calcs';
const SVC = 'nec-310-12';
const CALC = `calc:${ENGINE_ID}`;

/** VA as a sentence value: whole volt-amperes, or up to one decimal. */
function va(v: number, src: string): ValuePart {
  return { v, unit: 'VA', src, format: Number.isInteger(v) ? undefined : { upTo: 1 } };
}
function pct(v: number, src = L): ValuePart {
  return { v, unit: '%', src };
}
function num(n: number, src: string): NumberPart {
  return { n, src };
}

/** "a, b and c" from sentence parts. */
function joined(items: TextPart[][]): TextPart[] {
  return items.flatMap((item, k) => [...(k === 0 ? [] : k === items.length - 1 ? [' and '] : [', ']), ...item]);
}

/** The demand tiers a load reaches: "the first 3,000 VA at 100 % and the remaining 7,500 VA at 35 %". */
function tierParts(loadVa: number, tiers: DemandTier[]): TextPart[] {
  const used: TextPart[][] = [];
  let from = 0;
  for (const tier of tiers) {
    if (loadVa <= from) break;
    const part = Math.min(loadVa, tier.upToVa) - from;
    const first = from === 0;
    const rest = tier.upToVa === Infinity || loadVa <= tier.upToVa;
    const words = first ? (rest ? 'all ' : 'the first ') : rest ? 'the remaining ' : 'the next ';
    used.push([words, va(part, first && !rest ? L : CALC), ' at ', pct(tier.pct)]);
    from = tier.upToVa;
  }
  return joined(used);
}

function serviceStep(amps: number, row: ServiceRow | null): TextPart[] {
  const first = TABLE_310_12_ROWS[0];
  const last = TABLE_310_12_ROWS[TABLE_310_12_ROWS.length - 1];
  if (!row) {
    return ['That is over ', { v: last.ratingA, unit: 'A', src: SVC }, ', the largest rating in Table 310.12, which gives no service for it.'];
  }
  return [
    row === first && amps < first.ratingA ? 'Table 310.12 starts at ' : 'The smallest service rating in Table 310.12 at or above it: ',
    { v: row.ratingA, unit: 'A', src: SVC },
    ', with ',
    { size: row.cu },
    ' copper or ',
    { size: row.alCca },
    ' aluminum or copper-clad aluminum.',
  ];
}

/** The heating and the cooling each method counts for a choice of heating. */
function heatingLoads(i: DwellingRunInput): { heatW: number; coolingVa: number } {
  if (i.heating === 'heat-pump') return { heatW: i.heatPumpVa + i.heatW, coolingVa: i.heatPumpVa };
  return { heatW: i.heating === 'electric' ? i.heatW : 0, coolingVa: i.acVa };
}

const totalStep = (totalVa: number, amps: number): TextPart[] => [
  'Total: ',
  va(totalVa, CALC),
  ' ÷ ',
  { v: DWELLING_VOLTS, unit: 'V', src: SVC },
  ' = ',
  { v: amps, unit: 'A', src: CALC, format: { upTo: 2 } },
  '.',
];

function standardSteps(i: DwellingRunInput, r: StandardDwellingResult): TextPart[][] {
  const m = STANDARD_METHOD;
  const steps: TextPart[][] = [];
  steps.push(['General lighting, 220.41: ', { v: i.ft2, unit: 'ft²', src: 'input' }, ' at ', va(m.vaPerFt2, L), ' per ft² = ', va(i.ft2 * m.vaPerFt2, CALC), '.']);
  const circuits = i.smallApplianceCircuits + i.laundryCircuits;
  if (circuits > 0) {
    steps.push([
      'Small-appliance and laundry circuits, 220.52: ',
      num(circuits, 'input'),
      ' × ',
      va(m.smallApplianceCircuitVa, L),
      ' = ',
      va(circuits * m.smallApplianceCircuitVa, CALC),
      ', counted with the lighting: ',
      va(r.generalLightingVa, CALC),
      '.',
    ]);
  }
  steps.push(['Table 220.45 takes ', ...tierParts(r.generalLightingVa, m.lightingTiers), ': ', va(r.lightingAfterDemandVa, CALC), '.']);
  const appliances = [...(i.waterHeaterW ? [i.waterHeaterW] : []), ...i.otherAppliancesW];
  if (appliances.length > 0) {
    steps.push(
      appliances.length >= m.minAppliances
        ? [
            'Appliances fastened in place, 220.53: with ',
            num(appliances.length, 'input'),
            ' of them (the rule needs ',
            num(m.minAppliances, L),
            ' or more), ',
            va(sum(appliances), CALC),
            ' × ',
            pct(m.appliancePct),
            ' = ',
            va(r.appliancesVa, CALC),
            '.',
          ]
        : ['Appliances fastened in place: with ', num(appliances.length, 'input'), ' of them (220.53 needs ', num(m.minAppliances, L), ' or more), they count at full rating: ', va(r.appliancesVa, CALC), '.'],
    );
  }
  if (i.dryerW !== null) {
    steps.push(['Dryer, 220.54: the larger of ', { v: m.dryerMinW, unit: 'W', src: L }, ' and its ', { v: i.dryerW, unit: 'W', src: 'input' }, ' nameplate: ', va(r.dryerVa, CALC), '.']);
  }
  if (i.rangeKw !== null) {
    const { fromKw, pctPerKw } = TABLE_220_55.note1;
    const base: ValuePart = { v: (cookingRow(1) as CookingRow).cBaseKw, unit: 'kW', src: L };
    if (i.rangeKw <= fromKw) {
      steps.push(['Range, Table 220.55, Column C: one range of ', { v: fromKw, unit: 'kW', src: L }, ' or less counts as ', base, ': ', va(r.rangeVa, CALC), '.']);
    } else {
      const over = i.rangeKw - fromKw;
      const n = note1Steps(i.rangeKw);
      steps.push([
        'Range, Table 220.55, Column C with Note 1: ',
        { v: i.rangeKw, unit: 'kW', src: 'input' },
        ' is ',
        { v: over, unit: 'kW', src: CALC, format: { upTo: 2 } },
        ' over ',
        { v: fromKw, unit: 'kW', src: L },
        ...(Number.isInteger(over) ? [] : [', which counts as ', { v: n, unit: 'kW', src: CALC } as ValuePart]),
        '; each kW, or major fraction of one, adds ',
        pct(pctPerKw),
        ' to ',
        base,
        ': ',
        va(r.rangeVa, CALC),
        '.',
      ]);
    }
  }
  if (i.evW !== null) {
    steps.push(['EV charger, 220.57: the larger of ', { v: m.evseMinW, unit: 'W', src: L }, ' and its ', { v: i.evW, unit: 'W', src: 'input' }, ' nameplate: ', va(r.evseVa, CALC), '.']);
  }
  const hp = i.heating === 'heat-pump';
  const heatName = hp ? (i.heatW > 0 ? 'the heat pump with its backup heat' : 'the heat pump') : 'electric heat';
  const coolName = hp ? 'the heat pump cooling' : 'air conditioning';
  if (r.heatVa > 0 && r.coolingVa > 0) {
    steps.push([
      `Heating and cooling: ${heatName} at `,
      pct(m.spaceHeatPct),
      ' (220.51), ',
      va(r.heatVa, CALC),
      `; ${coolName} at `,
      pct(m.noncoincidentMotorPct),
      ' (220.60, as this calculator reads it), ',
      va(r.coolingVa, CALC),
      '. The two do not run at once, so only the larger counts: ',
      va(r.heatOrAcVa, CALC),
      '.',
    ]);
  } else if (r.heatVa > 0) {
    steps.push([`Heating: ${heatName} at `, pct(m.spaceHeatPct), ' (220.51): ', va(r.heatVa, CALC), '.']);
  } else if (r.coolingVa > 0) {
    steps.push([`Cooling: ${coolName} at `, pct(m.noncoincidentMotorPct), ' (220.60, as this calculator reads it): ', va(r.coolingVa, CALC), '.']);
  }
  steps.push(totalStep(r.totalVa, r.amps));
  steps.push(serviceStep(r.amps, r.serviceRow));
  return steps;
}

/** A 220.82(B)(3) nameplate item: its name in the step and its rating. */
interface NameplateItem {
  name: TextPart[];
  va: number;
}

function optionalSteps(i: DwellingRunInput, r: OptionalDwellingResult, items: NameplateItem[]): TextPart[][] {
  const m = OPTIONAL_METHOD;
  const h = m.heatingAc;
  const steps: TextPart[][] = [];
  const circuits = i.smallApplianceCircuits + i.laundryCircuits;
  const general: TextPart[][] = [[{ v: i.ft2, unit: 'ft²', src: 'input' }, ' at ', va(m.vaPerFt2, L), ' per ft², ', va(i.ft2 * m.vaPerFt2, CALC)]];
  if (circuits > 0) {
    general.push([num(circuits, 'input'), ' small-appliance and laundry circuits at ', va(m.smallApplianceAndLaundryCircuitVa, L), ', ', va(circuits * m.smallApplianceAndLaundryCircuitVa, CALC)]);
  }
  if (items.length > 0) {
    general.push(['the nameplates of the ', ...joined(items.map((x) => x.name)), ', ', va(sum(items.map((x) => x.va)), CALC)]);
  }
  steps.push(['General load, 220.82(B): ', ...general.flatMap((g, k) => [...(k === 0 ? [] : ['; ']), ...g]), '. Together: ', va(r.generalLoadVa, CALC), '.']);
  steps.push(['220.82(B) takes ', ...tierParts(r.generalLoadVa, m.generalTiers), ': ', va(r.generalAfterDemandVa, CALC), '.']);
  const { heatW, coolingVa } = heatingLoads(i);
  const selections: TextPart[][] = [];
  if (i.heating === 'heat-pump') {
    const combined = h.heatPumpWithSupplementalHeat.pct as { compressor: number; supplemental_heat: number };
    const alone = h.heatPumpWithoutSupplementalHeat.pct as number;
    selections.push(
      i.heatW > 0
        ? [
            `${h.heatPumpWithSupplementalHeat.item}, the heat pump at `,
            pct(combined.compressor),
            ' and its backup heat at ',
            pct(combined.supplemental_heat),
            ', gives ',
            va((i.heatPumpVa * combined.compressor + i.heatW * combined.supplemental_heat) / PERCENT, CALC),
          ]
        : [`${h.heatPumpWithoutSupplementalHeat.item}, the heat pump with no backup electric heat at `, pct(alone), ', gives ', va((i.heatPumpVa * alone) / PERCENT, CALC)],
    );
  } else {
    const ac = h.airConditioning.pct as number;
    if (coolingVa > 0) selections.push([`${h.airConditioning.item}, air conditioning at `, pct(ac), ', gives ', va((coolingVa * ac) / PERCENT, CALC)]);
    if (heatW > 0) {
      const many = i.heatUnits >= m.spaceHeatUnitsLimit;
      const item = many ? h.spaceHeatManyUnits : h.spaceHeatFewUnits;
      const p = item.pct as number;
      selections.push([
        `${item.item}, electric heat in ${many ? '' : 'fewer than '}`,
        num(m.spaceHeatUnitsLimit, L),
        `${many ? ' or more' : ''} separately controlled units at `,
        pct(p),
        ', gives ',
        va((heatW * p) / PERCENT, CALC),
      ]);
    }
  }
  if (selections.length === 1) steps.push(['Heating and cooling, 220.82(C): ', ...selections[0], '.']);
  if (selections.length > 1) {
    steps.push(['Heating and cooling, 220.82(C): ', ...selections.flatMap((x, k) => [...(k === 0 ? [] : ['; ']), ...x]), '. Only the largest counts: ', va(r.heatingAcVa, CALC), '.']);
  }
  steps.push(totalStep(r.totalVa, r.amps));
  steps.push(serviceStep(r.amps, r.serviceRow));
  return steps;
}

/** Both methods for one dwelling unit at 240 V, with steps; an error only for inputs the tool rejects first. */
export function dwellingLoadRun(i: DwellingRunInput): DwellingRun | { error: DwellingError } {
  if (i.heating === 'electric' && i.heatW > 0 && !(i.heatUnits >= 1)) return { error: 'heating-units' };
  const { heatW, coolingVa } = heatingLoads(i);
  const standard = standardDwellingLoad({
    ft2: i.ft2,
    smallApplianceCircuits: i.smallApplianceCircuits,
    laundryCircuits: i.laundryCircuits,
    fastenedAppliancesW: [...(i.waterHeaterW ? [i.waterHeaterW] : []), ...i.otherAppliancesW],
    dryerW: i.dryerW,
    rangeKw: i.rangeKw,
    spaceHeatW: heatW,
    acVa: coolingVa,
    evseW: i.evW,
    volts: DWELLING_VOLTS,
  });
  if (!standard) return { error: 'range-outside-table' };
  // 220.82(B)(3) at nameplate: ranges, dryers not on the laundry circuit, water heaters and the appliances fastened in
  // place, permanently connected or on a specific circuit. The 2023 text has no item for an EV charger; the
  // calculator counts it here, on its own circuit (the site's reading, set out on /methodology).
  const others = i.otherAppliancesW.length;
  const items: NameplateItem[] = [
    ...(i.rangeKw !== null ? [{ name: ['range'], va: i.rangeKw * W_PER_KW }] : []),
    ...(i.dryerW !== null ? [{ name: ['dryer'], va: i.dryerW }] : []),
    ...(i.waterHeaterW ? [{ name: ['water heater'], va: i.waterHeaterW }] : []),
    ...(others > 0 ? [{ name: others === 1 ? ['other appliance'] : [num(others, 'input'), ' other appliances'], va: sum(i.otherAppliancesW) }] : []),
    ...(i.evW !== null ? [{ name: ['EV charger'], va: i.evW }] : []),
  ];
  const hp = i.heating === 'heat-pump';
  const electric = i.heating === 'electric' && i.heatW > 0;
  const optional = optionalDwellingLoad({
    ft2: i.ft2,
    smallApplianceAndLaundryCircuits: i.smallApplianceCircuits + i.laundryCircuits,
    nameplateItemsVa: items.map((x) => x.va),
    acVa: !hp && i.acVa > 0 ? i.acVa : undefined,
    heatPumpVa: hp && i.heatW === 0 ? i.heatPumpVa : undefined,
    heatPumpCompressorVa: hp && i.heatW > 0 ? i.heatPumpVa : undefined,
    supplementalHeatVa: hp && i.heatW > 0 ? i.heatW : undefined,
    spaceHeatVa: electric ? i.heatW : undefined,
    spaceHeatUnits: electric ? i.heatUnits : undefined,
    volts: DWELLING_VOLTS,
  });
  if (!optional) return { error: 'heating-units' };
  const sParts = standardSteps(i, standard);
  const oParts = optionalSteps(i, optional, items);
  const text = (parts: TextPart[][]) => parts.map((p) => partsText(p, formatSize));
  return {
    standard: { totalVa: standard.totalVa, amps: standard.amps, serviceRow: standard.serviceRow, steps: text(sParts), stepParts: sParts, detail: standard },
    optional: { totalVa: optional.totalVa, amps: optional.amps, serviceRow: optional.serviceRow, steps: text(oParts), stepParts: oParts, detail: optional },
  };
}

export function isDwellingError(r: DwellingRun | { error: DwellingError }): r is { error: DwellingError } {
  return 'error' in r;
}
