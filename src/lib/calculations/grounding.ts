// Equipment grounding conductor from NEC Table 250.122: the first row whose overcurrent device rating is not
// exceeded; copper column for copper, aluminum or copper-clad aluminum column for aluminum.
import { ocpdRatings } from '../verified/nec-240-6-a';

export const ENGINE_ID = 'grounding';
export const DOMAINS = ['nec-250-grounding', 'nec-240-ocpd'];

export { TABLE_250_122_ROWS } from '../verified/nec-250-122';
export type { EgcRow } from '../verified/nec-250-122';
// The name before WSZ-003a, for the ground wire calculator and the 100 A guide
export { egcRow as egcForOcpd } from '../verified/nec-250-122';

export const PROPORTIONAL_NOTE =
  'Size increases in proportion if the phase conductors are upsized (NEC 250.122(B)); the wire size calculator does this.';

/** Breaker and fuse ratings offered: NEC Table 240.6(A) ratings from 15 A to 6000 A. */
export const GROUND_WIRE_RATINGS: number[] = ocpdRatings().filter((a) => a >= 15 && a <= 6000);

export const GROUND_WIRE_DEFAULTS = { ocpdA: 20 };
