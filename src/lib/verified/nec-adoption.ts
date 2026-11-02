// data/verified/nec-adoption.json: the NEC edition in force by state, from state and DC government records.
import data from '../../../data/verified/nec-adoption.json';

export type AdoptionRow = (typeof data.states)[number];

/**
 * The rows with status "verified" (the file's first rule): the others stay in the file for their notes and are never
 * rendered (HI, "conflicting"; MS has no row and is listed in not_verified).
 */
export function adoption(): AdoptionRow[] {
  return data.states.filter((row) => row.status === 'verified');
}
