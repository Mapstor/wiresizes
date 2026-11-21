// The wire size guide for a breaker rating, read from the live route list (src/lib/routes.ts):
// /guides/wire-size-for-50-amp answers 50 A, and /guides/wire-size-for-70-80-90-amp answers 70, 80 and 90 A.
// Pages link the first mention of a rating in their text to its guide (WSZ-044); a rating with no live guide stays plain.
import { ROUTES } from './routes';

const GUIDE_PATH = /^\/guides\/wire-size-for-((?:\d+-)*\d+)-amp$/;

export const AMP_GUIDE_PATHS: ReadonlyMap<number, string> = new Map(
  ROUTES.flatMap((r) => {
    const m = GUIDE_PATH.exec(r.path);
    return m ? m[1].split('-').map((a): [number, string] => [Number(a), r.path]) : [];
  }),
);

/** The live wire size guide for a rating in amperes, or null. */
export function ampGuideHref(a: number): string | null {
  return AMP_GUIDE_PATHS.get(a) ?? null;
}
