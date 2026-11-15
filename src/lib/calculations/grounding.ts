// Ground wires (WSZ-008a): the equipment grounding conductor (EGC) from NEC Table 250.122, the first row whose
// overcurrent device rating is not exceeded (copper column, or the aluminum or copper-clad aluminum column), grown by
// the 250.122(B) area ratio when the circuit conductors were upsized; and the grounding electrode conductor (GEC) from
// NEC Table 250.66 by the largest ungrounded service-entrance conductor. The 250.66(A)/(B) limits for rod, pipe, plate
// and concrete-encased electrodes and the 250.122 cap at the circuit conductor size are not verified, so neither is
// applied (data/verified/nec-250-66.json and nec-250-122.json notes).
import { areaCmil } from '../verified/awg';
import type { Material, SizeKey } from '../verified/awg';
import { ocpdRatings } from '../verified/nec-240-6-a';
import { egcProportional, egcRow } from '../verified/nec-250-122';
import { gec } from '../verified/nec-250-66';
import type { GecSizes } from '../verified/nec-250-66';
import { TABLE_310_16_SIZES } from '../verified/nec-310-16';

export const ENGINE_ID = 'grounding';
export const DOMAINS = ['nec-250-grounding', 'nec-240-ocpd'];

export { TABLE_250_122_ROWS } from '../verified/nec-250-122';
export type { EgcRow } from '../verified/nec-250-122';
export { TABLE_250_66_ROWS } from '../verified/nec-250-66';
export type { GecSizes } from '../verified/nec-250-66';
// The name before WSZ-003a, for the wire size calculator and the 100 A guide
export { egcRow as egcForOcpd } from '../verified/nec-250-122';

export const PROPORTIONAL_NOTE =
  'Size increases in proportion if the phase conductors are upsized (NEC 250.122(B)); the wire size calculator does this.';

/** Breaker and fuse ratings offered: NEC Table 240.6(A) ratings from 15 A to 6000 A. */
export const GROUND_WIRE_RATINGS: number[] = ocpdRatings().filter((a) => a >= 15 && a <= 6000);

export const GROUND_WIRE_DEFAULTS = { ocpdA: 20 };

/** Conductor sizes the tool offers: the Table 310.16 sizes from 14 AWG to 2000 kcmil. */
export const GROUND_WIRE_SIZES: SizeKey[] = TABLE_310_16_SIZES.filter((s) => s !== '18' && s !== '16');

export interface EgcUpsize {
  /** The size the rating needs (the reader's, or the wire size calculator's). */
  minSize: SizeKey;
  /** The size installed, larger than minSize. */
  installedSize: SizeKey;
}

export interface EgcResult {
  ocpdA: number;
  material: Material;
  /** The Table 250.122 row: its rating and both columns. */
  rowA: number;
  table: { cu: SizeKey; alCca: SizeKey };
  /** The table EGC in the chosen material. */
  tableEgc: SizeKey;
  /** 250.122(B): the table EGC's area × installed area ÷ minimum area, and the size that reaches it (null: none does). */
  upsized: (EgcUpsize & { requiredCmil: number; egc: SizeKey | null }) | null;
  /** The EGC to install: the proportional size when upsized, else the table size; null when no size is large enough. */
  egc: SizeKey | null;
}

export type EgcError = 'rating-invalid' | 'sizes-invalid';

export function isEgcError(r: EgcResult | { error: EgcError }): r is { error: EgcError } {
  return 'error' in r;
}

/** The EGC for a breaker or fuse rating, and with upsize the 250.122(B) increase. */
export function egcFor(ocpdA: number, material: Material, upsize?: EgcUpsize | null): EgcResult | { error: EgcError } {
  if (!GROUND_WIRE_RATINGS.includes(ocpdA)) return { error: 'rating-invalid' };
  const row = egcRow(ocpdA);
  if (!row) return { error: 'rating-invalid' };
  const tableEgc = material === 'Cu' ? row.cu : row.alCca;
  let upsized: EgcResult['upsized'] = null;
  if (upsize) {
    const { minSize, installedSize } = upsize;
    if (!GROUND_WIRE_SIZES.includes(minSize) || !GROUND_WIRE_SIZES.includes(installedSize)) return { error: 'sizes-invalid' };
    if (!(areaCmil(installedSize) > areaCmil(minSize))) return { error: 'sizes-invalid' };
    const p = egcProportional(tableEgc, minSize, installedSize);
    upsized = { minSize, installedSize, requiredCmil: p.requiredCmil, egc: p.egc };
  }
  return {
    ocpdA,
    material,
    rowA: row.rowA,
    table: { cu: row.cu, alCca: row.alCca },
    tableEgc,
    upsized,
    egc: upsized ? upsized.egc : tableEgc,
  };
}

export interface GecResult {
  /** The largest ungrounded service-entrance conductor and its material. */
  serviceSize: SizeKey;
  material: Material;
  /** The Table 250.66 row's grounding electrode conductor in copper and in aluminum or copper-clad aluminum. */
  gec: GecSizes;
}

/** The GEC for the largest service conductor, or null for a size the tool does not offer. */
export function gecFor(serviceSize: SizeKey, material: Material): GecResult | null {
  if (!GROUND_WIRE_SIZES.includes(serviceSize)) return null;
  const sizes = gec(serviceSize, material);
  return sizes ? { serviceSize, material, gec: sizes } : null;
}
