// Dwelling load calculations of NEC 2023 Article 220 (src/lib/verified/nec-220-2023.ts): Table 220.55 with Notes 1, 3
// and 4; dryers (220.54, Table 220.54); EVSE (220.57); the standard method (220.41 and 220.52 through Table 220.45,
// 220.53, 220.54, Table 220.55, 220.51 and the site's reading of 220.60: heating against air conditioning at 125 %);
// the optional method (220.82) and 220.83(A). The service is the smallest Table 310.12 rating at or above the load
// current. Loads in VA, with W and kW counted as VA and kVA as the rules do.
import { cookingRow, OPTIONAL_METHOD, STANDARD_METHOD, TABLE_220_55 } from '../verified/nec-220-2023';
import type { DemandTier } from '../verified/nec-220-2023';
import { TABLE_310_12_ROWS } from '../verified/nec-310-12';
import type { ServiceRow } from '../verified/nec-310-12';

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
  const over = ratingKw - fromKw;
  const steps = Math.floor(over) + (over - Math.floor(over) > HALF ? 1 : 0);
  return (columnC * (PERCENT + steps * pctPerKw)) / PERCENT;
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
  const heatOrAcVa = Math.max((input.spaceHeatW * m.spaceHeatPct) / PERCENT, (input.acVa * m.noncoincidentMotorPct) / PERCENT);
  const totalVa = lightingAfterDemandVa + appliancesVa + dryerVa + rangeVa + heatOrAcVa;
  const amps = totalVa / input.volts;
  return {
    generalLightingVa,
    lightingAfterDemandVa,
    appliancesVa,
    dryerVa,
    rangeVa,
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
