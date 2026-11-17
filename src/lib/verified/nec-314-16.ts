// data/verified/nec-314-16.json: NEC 2023 box fill (registry domain nec-314-16-box-fill; WSZ-032). Table 314.16(A)'s
// 24 metal boxes, Table 314.16(B)(1)'s volume per conductor and the numbers the 314.16(B)(1) to (B)(5) counting rules
// carry. Each item throws at import unless its status is VERIFIED-2023 or verified-sd2023 (D-09), so a page can never
// print a value whose status changed. Terminal blocks ((B)(6)) are verified too but the calculator does not ask for
// them (its Limits say so).
import data from '../../../data/verified/nec-314-16.json';

export const BOX_FILL_DOMAIN = 'nec-314-16-box-fill';

/** Conductor sizes Table 314.16(B)(1) lists, smallest to largest. */
export const BOX_SIZES = ['18', '16', '14', '12', '10', '8', '6'] as const;
export type BoxSize = (typeof BOX_SIZES)[number];

type Item = { status: string; values?: Record<string, unknown> };
const items = data.items as unknown as Record<string, Item & Record<string, unknown>>;

function verified(key: string): Item & Record<string, unknown> {
  const item = items[key];
  if (!item || !/^(VERIFIED-2023|verified-sd2023)/.test(item.status)) throw new Error(`${key} is not verified as 2023 in data/verified/nec-314-16.json`);
  return item;
}

const tableB1 = verified('Table 314.16(B)') as unknown as { values: { awg: string; cm3: number; in3: number }[] };

/** Table 314.16(B)(1): free space within the box for each conductor, in.³ and cm³. */
export const VOLUME_PER_CONDUCTOR = Object.fromEntries(
  BOX_SIZES.map((s) => {
    const row = tableB1.values.find((v) => v.awg === s);
    if (!row) throw new Error(`Table 314.16(B)(1) has no ${s} AWG row`);
    return [s, { in3: row.in3, cm3: row.cm3 }];
  }),
) as Record<BoxSize, { in3: number; cm3: number }>;

/** A metal box's kind, as Table 314.16(A) names it. */
export type BoxKind = 'round/octagonal' | 'square' | 'device' | 'masonry box/gang' | 'FS/FD box';

export interface MetalBox {
  id: string;
  /** Trade size in millimeters, as the table prints it ("100 × 32"; "min. 44.5 depth" for FS and FD boxes). */
  mm: string;
  /** Trade size in inches with fractions ("4 × 1¼"), or the FS/FD depth. */
  inches: string;
  kind: BoxKind;
  /** The table's own words for an FS or FD box ("FS — single cover/gang"); the kind otherwise. */
  kindLabel: string;
  cm3: number;
  in3: number;
  /** Maximum number of conductors of one size, where no other allowance applies (the table's footnote). */
  max: Record<BoxSize, number>;
}

const FRACTIONS: Record<string, string> = { '1/4': '¼', '1/2': '½', '3/4': '¾', '1/8': '⅛', '3/8': '⅜', '7/8': '⅞', '11/16': '¹¹⁄₁₆' };
/** "4-11/16" → "4¹¹⁄₁₆", "1-1/4" → "1¼", "2" → "2". */
function fraction(s: string): string {
  const m = /^(\d+)(?:-(\d+\/\d+))?$/.exec(s.trim());
  if (!m) throw new Error(`Table 314.16(A): unreadable size "${s}"`);
  if (!m[2]) return m[1];
  const f = FRACTIONS[m[2]];
  if (!f) throw new Error(`Table 314.16(A): no glyph for ${m[2]}`);
  return m[1] + f;
}

type RawBox = { box: string; volume_cm3: number; volume_in3: number; status: string } & Record<string, unknown>;
const tableA = verified('Table 314.16(A)') as unknown as { rows: RawBox[]; footnote_2023: string };

export const METAL_BOXES: MetalBox[] = tableA.rows.map((row, k) => {
  if (row.status !== 'VERIFIED-2023') throw new Error(`Table 314.16(A) row ${k + 1} is not VERIFIED-2023`);
  const max = Object.fromEntries(BOX_SIZES.map((s) => [s, row[`max_${s}`] as number])) as Record<BoxSize, number>;
  const fsfd = /^min\. ([\d.]+) depth (FS|FD) - (single|multiple) cover\/gang \(([\d-/]+)\)$/.exec(row.box);
  if (fsfd) {
    return {
      id: `${fsfd[2].toLowerCase()}-${fsfd[3]}`,
      mm: `min. ${fsfd[1]} depth`,
      inches: `${fraction(fsfd[4])} deep`,
      kind: 'FS/FD box',
      kindLabel: `${fsfd[2]} — ${fsfd[3]} cover/gang`,
      cm3: row.volume_cm3,
      in3: row.volume_in3,
      max,
    };
  }
  const m = /^([\d x]+?) \(([\d x/-]+)\) (round\/octagonal|square|device|masonry box\/gang)$/.exec(row.box);
  if (!m) throw new Error(`Table 314.16(A) row ${k + 1}: unreadable box "${row.box}"`);
  const inches = m[2].split(' x ').map(fraction).join(' × ');
  const kind = m[3] as BoxKind;
  return {
    id: `${kind.split(/[ /]/)[0]}-${m[2].replace(/[^\d]+/g, '-')}`,
    mm: m[1].split(' x ').join(' × '),
    inches,
    kind,
    kindLabel: kind,
    cm3: row.volume_cm3,
    in3: row.volume_in3,
    max,
  };
});

if (METAL_BOXES.length !== 24 || new Set(METAL_BOXES.map((b) => b.id)).size !== 24) throw new Error('Table 314.16(A): expected 24 distinct boxes');

/** The table's footnote: its maximum counts hold only where no other allowance applies. */
export const TABLE_A_FOOTNOTE = tableA.footnote_2023;

const b1 = verified('314.16(B)(1) (2023)').values as { count_entering: number; count_passing_through: number; count_loop: number; count_wholly_inside: number; exception_fixture_wires_max: number };
const b4 = verified('314.16(B)(4) (2023)').values as { allowance_per_yoke: string };
const b5 = verified('314.16(B)(5) (2023)').values as { count_covered_by_single_allowance: number; additional_allowance_each: string };
verified('314.16(B)(2) (2023)');
verified('314.16(B)(3) (2023)');
verified('314.16 lead-in (2023)');
verified('314.27(E) (2023)');

if (b4.allowance_per_yoke !== 'double') throw new Error('314.16(B)(4): expected a double allowance per yoke');
if (b5.additional_allowance_each !== '1/4') throw new Error('314.16(B)(5): expected a 1/4 allowance for each additional EGC');

/** The numbers the 2023 counting rules carry. */
export const FILL_RULES = {
  /** (B)(1): a conductor that enters and ends or is spliced in the box counts this many times. */
  entering: b1.count_entering,
  /** (B)(1): a conductor passing through without splice or termination. */
  passingThrough: b1.count_passing_through,
  /** (B)(1): a loop or coil at least twice the 300.14 free length. */
  loop: b1.count_loop,
  /** (B)(1): a conductor no part of which leaves the box. */
  whollyInside: b1.count_wholly_inside,
  /** (B)(1) Exception: fixture wires smaller than 14 AWG from a domed luminaire canopy that may be omitted, at most. */
  fixtureWiresMax: b1.exception_fixture_wires_max,
  /** (B)(2) and (B)(3): one allowance, on the largest conductor present. */
  clampAllowances: 1,
  fittingAllowancesPerType: 1,
  /** (B)(4): allowances per yoke or strap, and per gang of a wide device. */
  deviceAllowances: 2,
  /** (B)(5): this many EGCs entering share one allowance; each more adds a quarter. */
  egcSingleUpTo: b5.count_covered_by_single_allowance,
  egcExtraFraction: 0.25,
} as const;
