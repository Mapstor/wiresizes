// The garage subpanel calculator page's figures (WSZ-008f): the feeder sizes for the common garage ratings in both
// columns 110.14(C)(1)(a) can set, their ground wires, the one-way length at which each 60 °C size reaches the 215.2(A)
// note's 3 % at the full rating, the Table 300.5(A) cover for each method and place, and the calculator's default run.
// Every value is read through the engines and data/verified; nothing here is typed in but the ratings and the inputs.
import type { Material, SizeKey } from './verified/awg';
import { columnKey, table31016 } from './verified/nec-310-16';
import type { AmpacityColumn } from './verified/nec-310-16';
import { TERMINATION_RULES } from './verified/nec-110-14c';
import { VOLTAGE_DROP_NOTE } from './verified/nec-continuous-load-2023';
import { BURIAL_METHODS, BURIAL_PLACES, burialCover } from './verified/nec-300-5';
import type { BurialMethod, BurialPlace, Cover } from './verified/nec-300-5';
import { minimumConductor } from './calculations/conductor-sizing';
import { egcFor, isEgcError } from './calculations/grounding';
import { RESISTANCE_TEMP_C, lengthForDrop } from './calculations/voltage-drop';
import { garageRun, isGarageError } from './calculations/garage-subpanel';
import type { GarageInput, GarageRun } from './calculations/garage-subpanel';

export const GARAGE_LOW = TERMINATION_RULES.columnAtOrBelowLimit as AmpacityColumn;
export const GARAGE_HIGH = TERMINATION_RULES.columnAboveLimit as AmpacityColumn;
/** The garage table's ratings: all at or below 110.14(C)(1)(a)'s split, where both columns can apply. */
export const TABLE_RATINGS = [30, 40, 50, 60, 70, 80, 90, 100];
if (TABLE_RATINGS.some((a) => a > TERMINATION_RULES.limitA)) throw new Error('garage page: a table rating is above the 110.14(C) split');
export const GARAGE_VOLTS_DEFAULT = 240;

export interface Pick {
  size: SizeKey;
  ampacity: number;
  /** 240.4(D) moved the size up from the first one that reaches the rating. */
  limited: boolean;
}

function pick(ratingA: number, material: Material, column: AmpacityColumn): Pick {
  const m = minimumConductor({ ocpdA: ratingA, material, wiringMethod: 'conductors', termination: column === GARAGE_LOW ? '60' : '75' });
  if (!m || m.columnC !== column) throw new Error(`garage page: no ${material} size for ${ratingA} A at ${column} °C`);
  const ampacity = table31016(m.size, columnKey(material, column));
  if (ampacity === null) throw new Error(`garage page: no ampacity for ${m.size}`);
  return { size: m.size, ampacity, limited: m.limitedBy240_4D };
}

function egc(ratingA: number, material: Material): SizeKey {
  const r = egcFor(ratingA, material);
  if (isEgcError(r)) throw new Error(`garage page: no Table 250.122 row for ${ratingA} A`);
  return r.tableEgc;
}

/** The one-way length at which the full rating drops the 215.2(A) note's feeder figure at 240 V, ft. */
function noteFt(size: SizeKey, material: Material, ratingA: number): number {
  const ft = lengthForDrop(
    { size, material, amps: ratingA, volts: GARAGE_VOLTS_DEFAULT, circuit: 'single', sets: 1, tempC: RESISTANCE_TEMP_C },
    VOLTAGE_DROP_NOTE.feederPct,
  );
  if (ft === null) throw new Error(`garage page: no note length for ${size}`);
  return ft;
}

export interface RatingRow {
  ratingA: number;
  cu60: Pick;
  cu75: Pick;
  al60: Pick;
  al75: Pick;
  egcCu: SizeKey;
  egcAl: SizeKey;
  /** One-way length at which the full rating drops 3 % on the 60 °C sizes, ft. */
  noteFt: { cu60: number; al60: number };
}

export const RATING_ROWS: RatingRow[] = TABLE_RATINGS.map((ratingA) => {
  const cu60 = pick(ratingA, 'Cu', GARAGE_LOW);
  const al60 = pick(ratingA, 'Al', GARAGE_LOW);
  return {
    ratingA,
    cu60,
    cu75: pick(ratingA, 'Cu', GARAGE_HIGH),
    al60,
    al75: pick(ratingA, 'Al', GARAGE_HIGH),
    egcCu: egc(ratingA, 'Cu'),
    egcAl: egc(ratingA, 'Al'),
    noteFt: { cu60: noteFt(cu60.size, 'Cu', ratingA), al60: noteFt(al60.size, 'Al', ratingA) },
  };
});

export function ratingRow(ratingA: number): RatingRow {
  const r = RATING_ROWS.find((x) => x.ratingA === ratingA);
  if (!r) throw new Error(`garage page: no ${ratingA} A row`);
  return r;
}

/** The calculator's default run: a 60 A copper feeder, 100 ft, single conductors in nonmetallic conduit under a lawn. */
export const DEFAULT_INPUT: GarageInput = {
  feederA: 60,
  material: 'Cu',
  wiringMethod: 'conductors',
  termination: 'unknown',
  loadA: null,
  lengthFt: 100,
  volts: GARAGE_VOLTS_DEFAULT,
  vdTargetPct: VOLTAGE_DROP_NOTE.feederPct,
  burial: 'nonmetallic',
  place: 'general',
};

function run(input: GarageInput): GarageRun {
  const r = garageRun(input);
  if (isGarageError(r)) throw new Error(`garage page: ${r.error}`);
  return r;
}

export const EXAMPLE = run(DEFAULT_INPUT);
/** The same feeder with a 50 A calculated load: 240.4(B) lets the 60 A breaker protect the next size down. */
export const EXAMPLE_LOAD_A = 50;
export const EXAMPLE_LOAD = run({ ...DEFAULT_INPUT, loadA: EXAMPLE_LOAD_A });

/** Table 300.5(A) for the methods and places the calculator offers. */
export const COVER_ROWS: { place: BurialPlace; label: string; covers: { method: BurialMethod; cover: Cover }[] }[] = BURIAL_PLACES.map((p) => ({
  place: p.id,
  label: p.label,
  covers: BURIAL_METHODS.map((m) => ({ method: m.id, cover: burialCover(m.id, p.id) })),
}));

/** The cover of each method under open ground, deepest first: the burial diagram's three runs. */
export const GENERAL_COVERS = BURIAL_METHODS.map((m) => ({ method: m.id, label: m.label, cover: burialCover(m.id, 'general') })).sort(
  (a, b) => b.cover.inches - a.cover.inches,
);
