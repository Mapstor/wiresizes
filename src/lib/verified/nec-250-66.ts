// data/verified/nec-250-66.json: NEC Table 250.66 grounding electrode conductor (GEC) sizes by the largest ungrounded
// service-entrance conductor (values from NFPA's 2020 grounding fact sheet). Each service cell ("2 or smaller",
// "1 or 1/0", "Over 3/0 through 350", "Over 1100") becomes an area range: AWG sizes take their awg.json area, kcmil
// numbers kcmil × 1000 cmil (awg.json has no 1100 kcmil row).
import table from '../../../data/verified/nec-250-66.json';
import { areaCmil, awgRow } from './awg';
import type { SizeKey } from './awg';

// unit definition: 1 kcmil = 1000 cmil
const CMIL_PER_KCMIL = 1000;

/** The seven rows as the file holds them: service_cu and service_al_cca cells, gec_cu and gec_al_cca sizes. */
export const TABLE_250_66_ROWS = table.rows;

interface AreaRange {
  /** Inclusive lower bound in cmil, or null. */
  min: number | null;
  /** Exclusive lower bound in cmil ("Over …"), or null. */
  above: number | null;
  /** Inclusive upper bound in cmil, or null. */
  max: number | null;
}

function sizeArea(token: string): number {
  return awgRow(token) ? areaCmil(token) : Number(token) * CMIL_PER_KCMIL;
}

export function parseCell(cell: string): AreaRange {
  let match = /^(\S+) or smaller$/.exec(cell);
  if (match) return { min: null, above: null, max: sizeArea(match[1]) };
  match = /^(\S+) or (\S+)$/.exec(cell);
  if (match) return { min: sizeArea(match[1]), above: null, max: sizeArea(match[2]) };
  match = /^Over (\S+) through (\S+)$/.exec(cell);
  if (match) return { min: null, above: sizeArea(match[1]), max: sizeArea(match[2]) };
  match = /^Over (\S+)$/.exec(cell);
  if (match) return { min: null, above: sizeArea(match[1]), max: null };
  throw new Error(`Unrecognised Table 250.66 cell: ${cell}`);
}

function inRange(area: number, range: AreaRange): boolean {
  return (
    (range.min === null || area >= range.min) &&
    (range.above === null || area > range.above) &&
    (range.max === null || area <= range.max)
  );
}

export interface GecSizes {
  cu: SizeKey;
  alCca: SizeKey;
}

const ROWS = TABLE_250_66_ROWS.map((row) => ({
  cu: parseCell(row.service_cu),
  alCca: parseCell(row.service_al_cca),
  gec: { cu: row.gec_cu, alCca: row.gec_al_cca } as GecSizes,
}));

/** Copper and aluminum/CCA grounding electrode conductors for a service conductor of the given material, or null. */
export function gec(serviceConductorSize: SizeKey, material: 'Cu' | 'Al'): GecSizes | null {
  const area = areaCmil(serviceConductorSize);
  const row = ROWS.find((r) => inRange(area, material === 'Cu' ? r.cu : r.alCca));
  return row ? row.gec : null;
}
