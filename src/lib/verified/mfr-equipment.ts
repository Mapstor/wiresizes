// data/verified/mfr-equipment.json: manufacturers' installation data for household ranges and dryers (registry domain
// mfr-dryer-range). Each value belongs to its brand, document and revision: the pages cite them as that maker's
// instructions, never as a rule (the file's notes). Text that no longer reads as expected throws when the module loads.
import data from '../../../data/verified/mfr-equipment.json';
import type { SizeKey } from './awg';

export const MFR_DOMAIN = 'mfr-dryer-range';

function read(text: string, pattern: RegExp, what: string): RegExpExecArray {
  const m = pattern.exec(text);
  if (!m) throw new Error(`mfr-equipment.json: no ${what} in "${text}"`);
  return m;
}

/** "8.8 – 16.5" → [8.8, 16.5]. */
function kwRange(text: string): [number, number] {
  const m = read(text, /^([\d.]+) – ([\d.]+)$/, 'kW range');
  return [Number(m[1]), Number(m[2])];
}

// ── Ranges ──────────────────────────────────────────────────────────────────

interface RangeJson {
  brand: string;
  doc: string;
  url: string;
  status: string;
  table?: { kw_120_240: string; kw_120_208: string; amps: string }[] | string;
  cord_3wire?: string;
  cord_4wire?: string;
  direct_wire?: string;
  nema?: string | null;
  cord?: string;
  four_wire_when?: string;
  min_copper_4wire_40a_circuit?: { hot: string; neutral: string; ground: string };
}

const ranges = data.ranges as RangeJson[];
const whirlpool = ranges.find((r) => r.brand === 'Whirlpool' && r.doc === 'W11640146A');
const frigidaire = ranges.find((r) => r.brand.startsWith('Frigidaire'));
if (!whirlpool || !Array.isArray(whirlpool.table) || !whirlpool.cord_4wire || !whirlpool.cord_3wire || !whirlpool.direct_wire) {
  throw new Error('mfr-equipment.json: the Whirlpool range manual W11640146A is missing a field');
}
if (!frigidaire || !frigidaire.nema || !frigidaire.four_wire_when || !frigidaire.min_copper_4wire_40a_circuit) {
  throw new Error('mfr-equipment.json: the Frigidaire range instructions are missing a field');
}

export interface MakerRangeRow {
  /** kW at 120/240 V, from and to. */
  kw240: [number, number];
  /** kW at 120/208 V, from and to. */
  kw208: [number, number];
  /** The circuit ratings the manual allows for that rating. */
  circuitsA: number[];
}

const direct = read(whirlpool.direct_wire, /^(\d+) gauge copper or (\d+) gauge aluminum$/, 'direct-wire sizes');
const fourWire = read(whirlpool.cord_4wire, /NEMA (\d+-\d+R) receptacle/, 'the 4-wire receptacle');
const threeWire = read(whirlpool.cord_3wire, /NEMA (\d+-\d+R) receptacle/, 'the 3-wire receptacle');

/** Whirlpool's freestanding electric range manual W11640146A (whirlpool.com), the same kW table as W10403811C. */
export const WHIRLPOOL_RANGE = {
  brand: 'Whirlpool',
  doc: whirlpool.doc,
  url: whirlpool.url,
  rows: whirlpool.table.map(
    (row): MakerRangeRow => ({
      kw240: kwRange(row.kw_120_240),
      kw208: kwRange(row.kw_120_208),
      circuitsA: row.amps.split(' or ').map(Number),
    }),
  ),
  /** The 4-wire cord's receptacle (recommended) and the 3-wire one (only where local codes permit). */
  receptacle4Wire: fourWire[1],
  receptacle3Wire: threeWire[1],
  /** Direct wiring: copper and aluminum sizes. */
  directWire: { cu: direct[1] as SizeKey, al: direct[2] as SizeKey },
};

const minCu = frigidaire.min_copper_4wire_40a_circuit;
const sizeOf = (text: string) => read(text, /No\. (\d+)/, 'a wire size')[1] as SizeKey;
const frigidaireCord = read(frigidaire.nema, /^(\d+-\d+R) with matching U\.L\.-listed 4-wire, 250 volt, (\d+) ampere range cord$/, 'the receptacle and cord');

/** Frigidaire's 40-inch electric range installation instructions, P/N 318201707 Rev. A. */
export const FRIGIDAIRE_RANGE = {
  brand: 'Frigidaire',
  doc: frigidaire.doc,
  url: frigidaire.url,
  receptacle: frigidaireCord[1],
  cordA: Number(frigidaireCord[2]),
  /** Where the instructions call for the 4-wire connection. */
  fourWireWhen: frigidaire.four_wire_when,
  /** The smallest copper conductors of a 4-wire 40 A circuit. */
  minCopper40A: { hot: sizeOf(minCu.hot), neutral: sizeOf(minCu.neutral), ground: sizeOf(minCu.ground) },
};

/** The Whirlpool rows whose 240 V (or 208 V) kW span holds `kw`, or null. */
export function whirlpoolRangeRow(kw: number, volts: 240 | 208): MakerRangeRow | null {
  return WHIRLPOOL_RANGE.rows.find((row) => {
    const [from, to] = volts === 240 ? row.kw240 : row.kw208;
    return kw >= from && kw <= to;
  }) ?? null;
}

// ── Dryers ──────────────────────────────────────────────────────────────────

interface DryerJson {
  brand: string;
  doc: string;
  url: string;
  status: string;
  circuit_a: number | null;
  receptacles?: string[] | null;
  cord?: string;
  direct_wire?: string;
  four_wire_statement?: string;
  conductors?: string;
  rating?: string;
}

const dryers = data.dryers as DryerJson[];
const wDryer = dryers.find((d) => d.brand === 'Whirlpool' && d.doc === 'W10267633A');
const geDryer = dryers.find((d) => d.brand === 'GE' && d.doc.startsWith('Pub # 31-16135'));
const geSheet = dryers.find((d) => d.brand === 'GE' && d.doc.startsWith('DBLR333EE'));
if (!wDryer || wDryer.circuit_a === null || !wDryer.receptacles || !wDryer.cord || !wDryer.direct_wire || !wDryer.four_wire_statement) {
  throw new Error('mfr-equipment.json: the Whirlpool dryer instructions W10267633A are missing a field');
}
if (!geDryer || geDryer.circuit_a === null || !geDryer.conductors) throw new Error('mfr-equipment.json: the GE dryer instructions 31-16135 are missing a field');
if (!geSheet || geSheet.circuit_a === null || !geSheet.rating) throw new Error('mfr-equipment.json: the GE DBLR333EE spec sheet is missing a field');

const receptacle = (text: string) => read(text, /^NEMA (\d+-\d+R) \((\d)-wire\)$/, 'a receptacle');
const wCord = read(wDryer.cord, /^UL listed (\d+)-amp, rated ([\d/]+) volt minimum, type (\w+) or (\w+), at least (\d+) ft; four \(4-wire\) or three \(3-wire\) (\d+)-gauge copper wires$/, 'the cord');
const wDirect = read(wDryer.direct_wire, /^(\d+)-gauge solid copper wire \(do not use aluminum\)$/, 'the direct-wire size');
const geSize = read(geDryer.conductors, /#(\d+) AWG minimum copper/, 'the conductor size');
const rating = read(geSheet.rating, /^240V, (\d+)W, (\d+)A, 60 Hz; 208V, (\d+)W, (\d+)A, 60 Hz$/, 'the 240 V and 208 V ratings');

/** Whirlpool's electric dryer installation instructions W10267633A (whirlpool.com). */
export const WHIRLPOOL_DRYER = {
  brand: 'Whirlpool',
  doc: wDryer.doc,
  url: wDryer.url,
  circuitA: wDryer.circuit_a,
  /** The 4-wire and the 3-wire receptacle, in that order. */
  receptacles: wDryer.receptacles.map((r) => ({ config: receptacle(r)[1], wires: Number(receptacle(r)[2]) })),
  cord: { amps: Number(wCord[1]), volts: wCord[2], types: [wCord[3], wCord[4]], minFt: Number(wCord[5]), size: wCord[6] as SizeKey },
  /** Direct wiring: solid copper of this size; the instructions say not to use aluminum. */
  directWireCu: wDirect[1] as SizeKey,
  /** The instructions' own sentence on the NEC and the 4-wire connection. */
  fourWireStatement: wDryer.four_wire_statement,
};

/** GE's electric dryer installation instructions, Pub # 31-16135. */
export const GE_DRYER = { brand: 'GE', doc: geDryer.doc, url: geDryer.url, circuitA: geDryer.circuit_a, minCopper: geSize[1] as SizeKey };

/** GE's DBLR333EE dryer spec sheet: its circuit breaker and its ratings at 240 V and 208 V. */
export const GE_DBLR333EE = {
  brand: 'GE',
  model: 'DBLR333EE',
  url: geSheet.url,
  breakerA: geSheet.circuit_a,
  at240: { w: Number(rating[1]), a: Number(rating[2]) },
  at208: { w: Number(rating[3]), a: Number(rating[4]) },
};
