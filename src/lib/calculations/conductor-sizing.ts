// Conductor size for a breaker or fuse rating:
// 1. smallest NEC Table 310.16 size whose 60 °C ampacity for the material is at least the rating;
// 2. NEC 240.4(D) rows without conditions move the size up while the rating exceeds their limit;
// 3. equipment grounding conductor (EGC) from Table 250.122 by rating, copper or aluminum/CCA column;
// 4. voltage drop at the load current with 75 °C resistance from awg.json;
// 5. larger Table 310.16 sizes until the drop meets the reader's target, 2000 kcmil at most;
// 6. if step 5 upsized, the EGC grows in proportion (250.122(B)): table EGC area × chosen area ÷ step-2 area,
//    multiplied first, smallest Table 310.16 size at or above it, never smaller than the table EGC, not capped.
import ratings from '../../../data/verified/nec-240-6-a.json';
import { formatEntered, formatFixed } from './format';
import {
  areaCmil,
  formatSize,
  materialName,
  nextLargerSize,
  smallestSizeWithArea,
  tableAmpacity,
  TABLE_310_16_SIZES,
} from './sizes';
import type { Material, SizeKey } from './sizes';
import { voltsValid } from './inputs';
import type { Phase } from './inputs';
import { DEFAULT_VD_TARGET_PCT, LENGTH_MAX_FT, LENGTH_MIN_FT, voltageDrop } from './voltage-drop';
import { maxOcpd240_4D } from './ampacity';
import { egcSize } from './grounding';

export type SizingError =
  | 'rating-not-standard'
  | 'rating-out-of-range'
  | 'load-above-rating'
  | 'length-out-of-range'
  | 'vd-target-out-of-range'
  | 'voltage-invalid';

export const SIZING_ERROR_MESSAGES: Record<SizingError, string> = {
  'rating-not-standard': 'Choose a standard breaker or fuse rating from NEC Table 240.6(A).',
  'rating-out-of-range': 'This calculator covers breaker and fuse ratings from 15 A to 400 A.',
  'load-above-rating': 'The load current must be between 0 A and the breaker or fuse rating.',
  'length-out-of-range': 'Enter a one-way length from 0 ft to 2000 ft.',
  'vd-target-out-of-range': 'Choose a voltage-drop target from 1 % to 10 %.',
  'voltage-invalid':
    'Enter a voltage above 0 V. Three-phase uses the line-to-line voltages 208, 240, 480 or 600 V.',
};

export const RATING_MIN_A = 15;
export const RATING_MAX_A = 400;
export const VD_TARGET_MIN_PCT = 1;
export const VD_TARGET_MAX_PCT = 10;

/** NEC Table 240.6(A) standard ratings. */
export const STANDARD_RATINGS: number[] = ratings.ratings_a;
/** Ratings the wire size calculator offers: 15 A to 400 A. */
export const WIRE_SIZE_RATINGS: number[] = STANDARD_RATINGS.filter((a) => a >= RATING_MIN_A && a <= RATING_MAX_A);

export const BASIS_LINES = [
  'Sized from the 60 °C column of NEC Table 310.16 (2023), limited by 240.4(D); ground wire from Table 250.122.',
  'Assumes 30 °C (86 °F) ambient and no more than three current-carrying conductors together. Hotter locations or more conductors need the factors in Tables 310.15(B)(1)(1) and 310.15(C)(1): use the ampacity calculator.',
  'A 120/240 V dwelling service or main power feeder is sized from NEC Table 310.12 instead: see the service entrance calculator.',
];
export const EGC_UPSIZED_NOTE = 'Ground wire increased in proportion to the larger conductors (NEC 250.122(B)).';
export const EGC_LARGER_THAN_CONDUCTOR_NOTE =
  'For this rating, Table 250.122 lists a ground wire larger than the smallest conductor the rating allows.';
export const EGC_NONE_MESSAGE = 'No size in NEC Table 310.16 is large enough for this ground wire.';

export interface SizeConductorInput {
  ocpdA: number;
  /** Load current for voltage drop; defaults to the rating. */
  loadA?: number | null;
  lengthFt: number;
  volts: number;
  phase: Phase;
  material: Material;
  vdTargetPct?: number;
}

export interface SizeConductorResult {
  size: SizeKey;
  /** 60 °C ampacity of the returned size. */
  ampacity60: number;
  /** Size required by the 60 °C ampacity and 240.4(D) (steps 1 and 2). */
  minSizeByAmpacity: SizeKey;
  vdVolts: number;
  vdPct: number;
  meetsTarget: boolean;
  /** null only when no Table 310.16 size reaches the required area. */
  egc: SizeKey | null;
  /** The returned EGC is larger than the Table 250.122 size (or none is large enough). */
  egcUpsized: boolean;
  /** The EGC is null or its area is larger than the returned conductor's area. */
  egcLargerThanConductor: boolean;
  steps: string[];
}

export interface SizeConductorError {
  error: SizingError;
}

export function isSizingError(result: SizeConductorResult | SizeConductorError): result is SizeConductorError {
  return 'error' in result;
}

export const WIRE_SIZE_DEFAULTS = {
  ocpdA: 20,
  loadA: null as number | null,
  lengthFt: 50,
  volts: 240,
  phase: 'single' as Phase,
  vdTargetPct: DEFAULT_VD_TARGET_PCT,
};

function amps(value: number): string {
  return `${Number.isInteger(value) ? formatEntered(value) : formatFixed(value, 1)} A`;
}

function cmil(value: number): string {
  return `${Math.round(value).toLocaleString('en-US')} cmil`;
}

export function sizeConductor(input: SizeConductorInput): SizeConductorResult | SizeConductorError {
  const { ocpdA, lengthFt, volts, phase, material } = input;
  const loadA = input.loadA ?? ocpdA;
  const target = input.vdTargetPct ?? DEFAULT_VD_TARGET_PCT;

  if (!STANDARD_RATINGS.includes(ocpdA)) return { error: 'rating-not-standard' };
  if (ocpdA < RATING_MIN_A || ocpdA > RATING_MAX_A) return { error: 'rating-out-of-range' };
  if (!(loadA >= 0 && loadA <= ocpdA)) return { error: 'load-above-rating' };
  if (!(lengthFt >= LENGTH_MIN_FT && lengthFt <= LENGTH_MAX_FT)) return { error: 'length-out-of-range' };
  if (!(target >= VD_TARGET_MIN_PCT && target <= VD_TARGET_MAX_PCT)) return { error: 'vd-target-out-of-range' };
  if (!voltsValid(volts, phase)) return { error: 'voltage-invalid' };

  const metal = materialName(material);
  const steps: string[] = [];

  // Step 1: smallest size whose 60 °C ampacity is at least the rating (sizes without a 60 °C value are skipped)
  const step1 = TABLE_310_16_SIZES.find((key) => {
    const a = tableAmpacity(key, material, 60);
    return a !== null && a >= ocpdA;
  });
  if (!step1) throw new Error(`No 60 °C ${metal} size carries ${ocpdA} A`);
  steps.push(
    `Smallest ${metal} size with a 60 °C ampacity of at least ${amps(ocpdA)} in NEC Table 310.16: ${formatSize(step1)} (${amps(tableAmpacity(step1, material, 60) as number)}).`,
  );

  // Step 2: 240.4(D) rows without conditions
  let step2 = step1;
  for (;;) {
    const limit = maxOcpd240_4D(step2, material);
    if (!limit || limit.conditions !== null) break;
    if (ocpdA <= limit.max_ocpd_a) {
      steps.push(
        `NEC 240.4(D) limits ${formatSize(step2)} ${metal} to ${amps(limit.max_ocpd_a)} overcurrent protection; ${amps(ocpdA)} is within that limit.`,
      );
      break;
    }
    let next = nextLargerSize(step2);
    while (next && tableAmpacity(next, material, 60) === null) next = nextLargerSize(next);
    if (!next) break;
    steps.push(
      `NEC 240.4(D) limits ${formatSize(step2)} ${metal} to ${amps(limit.max_ocpd_a)} overcurrent protection, so the size moves up to ${formatSize(next)}.`,
    );
    step2 = next;
  }

  // Step 3: EGC by rating and material
  const tableEgc = egcSize(ocpdA, material) as SizeKey;
  steps.push(
    `Ground wire for a ${amps(ocpdA)} breaker or fuse, NEC Table 250.122 (${material === 'Cu' ? 'copper' : 'aluminum or copper-clad aluminum'} column): ${formatSize(tableEgc)}.`,
  );

  // Step 4: voltage drop at the load current
  let size = step2;
  let vd = voltageDrop({ size, material, amps: loadA, lengthFt, volts, phase });
  if (!vd) throw new Error(`No resistance for ${size} ${metal}`);
  steps.push(
    `Voltage drop with ${formatSize(size)} ${metal} at ${amps(loadA)} over ${formatEntered(lengthFt)} ft one way, ${phase === 'three' ? 'three-phase' : 'single-phase'} ${formatEntered(volts)} V (${formatEntered(vd.ohmsPer1000ft)} Ω per 1000 ft at 75 °C): ${formatFixed(vd.vdVolts, 2)} V, ${formatFixed(vd.vdPct, 2)} %.`,
  );

  // Step 5: step up until the drop meets the target or 2000 kcmil
  if (vd.vdPct > target) {
    while (vd.vdPct > target) {
      const next = nextLargerSize(size);
      if (!next) break;
      size = next;
      vd = voltageDrop({ size, material, amps: loadA, lengthFt, volts, phase });
      if (!vd) throw new Error(`No resistance for ${size} ${metal}`);
    }
    if (vd.vdPct <= target) {
      steps.push(
        `Above your ${target} % target, so the size steps up to ${formatSize(size)}: ${formatFixed(vd.vdVolts, 2)} V, ${formatFixed(vd.vdPct, 2)} %.`,
      );
    } else {
      steps.push(
        `Even ${formatSize(size)}, the largest size in NEC Table 310.16, gives ${formatFixed(vd.vdVolts, 2)} V, ${formatFixed(vd.vdPct, 2)} %, above your ${target} % target.`,
      );
    }
  }

  // Step 6: proportional EGC when step 5 upsized
  let egc: SizeKey | null = tableEgc;
  if (size !== step2) {
    const required = (areaCmil(tableEgc) * areaCmil(size)) / areaCmil(step2);
    const candidate = smallestSizeWithArea(required);
    egc = candidate === null ? null : areaCmil(candidate) >= areaCmil(tableEgc) ? candidate : tableEgc;
    steps.push(
      egc
        ? `Ground wire increased in proportion to the larger conductors (NEC 250.122(B)): ${cmil(areaCmil(tableEgc))} × ${cmil(areaCmil(size))} ÷ ${cmil(areaCmil(step2))} = ${cmil(required)}, so ${formatSize(egc)}.`
        : `Ground wire increased in proportion to the larger conductors (NEC 250.122(B)): ${cmil(areaCmil(tableEgc))} × ${cmil(areaCmil(size))} ÷ ${cmil(areaCmil(step2))} = ${cmil(required)}. ${EGC_NONE_MESSAGE}`,
    );
  }

  const egcUpsized = egc === null || areaCmil(egc) > areaCmil(tableEgc);
  const egcLargerThanConductor = egc === null || areaCmil(egc) > areaCmil(size);

  return {
    size,
    ampacity60: tableAmpacity(size, material, 60) as number,
    minSizeByAmpacity: step2,
    vdVolts: vd.vdVolts,
    vdPct: vd.vdPct,
    meetsTarget: vd.vdPct <= target,
    egc,
    egcUpsized,
    egcLargerThanConductor,
    steps,
  };
}
