// data/verified/nec-240-6-a.json: NEC Table 240.6(A) (2023) standard ampere ratings for fuses and inverse time
// circuit breakers, 10 A to 6000 A.
import table from '../../../data/verified/nec-240-6-a.json';

/** The 38 standard ratings, smallest first (a new array on each call). */
export function ocpdRatings(): number[] {
  return [...table.ratings_a];
}
