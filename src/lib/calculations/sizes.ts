// The import path before WSZ-003a, kept only for the pages this wave leaves alone: the guides (WSZ-005 removes it)
// and the ampacity and wire resistance calculator pages. Other code imports src/lib/verified/awg.ts and nec-310-16.ts.
import { columnKey, table31016 } from '../verified/nec-310-16';
import type { AmpacityColumn } from '../verified/nec-310-16';
import type { Material, SizeKey } from '../verified/awg';

export { conductor, diameterMm, formatSize, isKcmil, sizeKeyFromAwgName } from '../verified/awg';
export type { ConductorData, Material, SizeKey } from '../verified/awg';
export { TABLE_310_16_SIZES } from '../verified/nec-310-16';

/** table31016 by material and column: tableAmpacity('4/0', 'Cu', 75) = table31016('4/0', 'cu_75'). */
export function tableAmpacity(key: SizeKey, material: Material, column: AmpacityColumn): number | null {
  return table31016(key, columnKey(material, column));
}
