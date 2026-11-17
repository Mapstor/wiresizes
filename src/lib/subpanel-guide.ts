// The 100 A guide's figures (WSZ-008d): a 100 A feeder to a subpanel from Table 310.16 at the column 110.14(C)(1)(a)
// sets for circuits of 100 A or less (60 °C, or 75 °C where every termination is listed and identified for it), the
// 240.4(B) case of 2 AWG copper, a 100 A dwelling service from Table 310.12, both ground wires and the voltage drop.
// Every value is read from data/verified through the engines; nothing here is typed in but the rating and the run.
import type { Material, SizeKey } from './verified/awg';
import { TERMINATION_RULES } from './verified/nec-110-14c';
import { TABLE_310_16_ROWS, columnKey, table31016 } from './verified/nec-310-16';
import type { AmpacityColumn } from './verified/nec-310-16';
import { VOLTAGE_DROP_NOTE } from './verified/nec-continuous-load-2023';
import { maxProtection } from './calculations/breaker-sizing';
import type { Protection } from './calculations/breaker-sizing';
import { egcFor, isEgcError } from './calculations/grounding';
import type { EgcResult } from './calculations/grounding';
import { SERVICE_VOLTS, minimumServiceAmpacity, serviceLookup } from './calculations/service-lookup';
import type { ServiceLookupResult } from './calculations/service-lookup';
import { RESISTANCE_TEMP_C, dropRun, lengthForDrop, voltageDropSizes } from './calculations/voltage-drop';
import type { DropRun } from './calculations/voltage-drop';

export interface ColumnPick {
  size: SizeKey;
  /** Its ampacity in that column, A. */
  amps: number;
}

/** The smallest Table 310.16 size whose ampacity in the column reaches the rating. */
export function smallestAt(ratingA: number, material: Material, column: AmpacityColumn): ColumnPick {
  const key = columnKey(material, column);
  for (const row of TABLE_310_16_ROWS) {
    const amps = row[key];
    if (amps !== null && amps >= ratingA) return { size: row.size, amps };
  }
  throw new Error(`smallestAt: no Table 310.16 size carries ${ratingA} A in ${key}`);
}

export interface LadderRow {
  size: SizeKey;
  /** Table 310.16 ampacity at 60 °C and at 75 °C, A. */
  a60: number;
  a75: number;
}

/** The sizes from the Table 310.12 service size to one past the 60 °C pick, with both columns' ampacity. */
function ladder(material: Material, from: SizeKey, to: SizeKey): LadderRow[] {
  const sizes = TABLE_310_16_ROWS.map((r) => r.size);
  const i = sizes.indexOf(from);
  const j = sizes.indexOf(to) + 1;
  if (i < 0 || j <= 0 || j >= sizes.length) throw new Error('100 A guide: the ladder runs off Table 310.16');
  return sizes.slice(i, j + 1).map((size) => {
    const a60 = table31016(size, columnKey(material, 60));
    const a75 = table31016(size, columnKey(material, 75));
    if (a60 === null || a75 === null) throw new Error(`100 A guide: ${size} has no 60 or 75 °C ampacity`);
    return { size, a60, a75 };
  });
}

function service(ratingA: number): ServiceLookupResult {
  const r = serviceLookup(ratingA);
  if (!r) throw new Error(`100 A guide: no Table 310.12 row for ${ratingA} A`);
  return r;
}

function egc(ratingA: number): EgcResult {
  const r = egcFor(ratingA, 'Cu');
  if (isEgcError(r)) throw new Error(`100 A guide: no Table 250.122 row for ${ratingA} A`);
  return r;
}

/** The full rating over a one-way run, single-phase at 240 V, conductors at the engine's 75 °C. */
export function feederDrop(size: SizeKey, material: Material, ratingA: number, lengthFt: number): DropRun {
  const r = dropRun({ size, material, amps: ratingA, lengthFt, volts: SERVICE_VOLTS, circuit: 'single', sets: 1, tempC: RESISTANCE_TEMP_C });
  if (!r) throw new Error(`100 A guide: no drop for ${size} ${material}`);
  return r;
}

/** The one-way length at which the full rating reaches the 215.2(A) note's feeder figure, ft. */
export function noteLength(size: SizeKey, material: Material, ratingA: number): number {
  const ft = lengthForDrop(
    { size, material, amps: ratingA, volts: SERVICE_VOLTS, circuit: 'single', sets: 1, tempC: RESISTANCE_TEMP_C },
    VOLTAGE_DROP_NOTE.feederPct,
  );
  if (ft === null) throw new Error(`100 A guide: no note length for ${size} ${material}`);
  return ft;
}

/** The smallest size in the voltage drop calculator's list whose drop at the full rating over the run stays within the note. */
export function smallestForNote(material: Material, ratingA: number, lengthFt: number): DropRun {
  for (const size of voltageDropSizes(material)) {
    const r = feederDrop(size, material, ratingA, lengthFt);
    if (r.vdPct <= VOLTAGE_DROP_NOTE.feederPct) return r;
  }
  throw new Error(`100 A guide: no ${material} size keeps ${lengthFt} ft within the note`);
}

/** One size below the 60 °C copper pick: what 240.4(B) lets protect it. */
export interface NextSizeUpCase {
  size: SizeKey;
  amps: number;
  protection: Protection;
}

export const GUIDE_100 = (() => {
  const ratingA = 100;
  if (ratingA > TERMINATION_RULES.limitA) throw new Error('100 A guide: the rating is above the 110.14(C)(1)(a) split');
  const s = service(ratingA);
  const low = TERMINATION_RULES.columnAtOrBelowLimit as AmpacityColumn;
  const high = TERMINATION_RULES.columnAboveLimit as AmpacityColumn;
  const cu60 = smallestAt(ratingA, 'Cu', low);
  const al60 = smallestAt(ratingA, 'Al', low);
  const cu75 = smallestAt(ratingA, 'Cu', high);
  const al75 = smallestAt(ratingA, 'Al', high);
  const sizes = TABLE_310_16_ROWS.map((r) => r.size);
  const below = sizes[sizes.indexOf(cu60.size) - 1];
  const belowA = table31016(below, columnKey('Cu', low));
  if (belowA === null) throw new Error('100 A guide: no 60 °C ampacity below the copper pick');
  const nextSizeUp: NextSizeUpCase = { size: below, amps: belowA, protection: maxProtection(belowA) };
  const lengthFt = 200;
  return {
    ratingA,
    service: s,
    /** 310.12(A): 83 % of the rating, A. */
    minA: minimumServiceAmpacity(ratingA),
    low,
    high,
    at60: { cu: cu60, al: al60 },
    at75: { cu: cu75, al: al75 },
    nextSizeUp,
    /** Table 250.122 for the 100 A breaker ahead of the feeder. */
    egc: egc(ratingA),
    ladder: { cu: ladder('Cu', s.cu, cu60.size), al: ladder('Al', s.alCca, al60.size) },
    /** The full rating over a searched run, on the 60 °C and 75 °C picks. */
    run: {
      lengthFt,
      cu60: feederDrop(cu60.size, 'Cu', ratingA, lengthFt),
      al60: feederDrop(al60.size, 'Al', ratingA, lengthFt),
      cu75: feederDrop(cu75.size, 'Cu', ratingA, lengthFt),
      al75: feederDrop(al75.size, 'Al', ratingA, lengthFt),
      /** The smallest sizes that keep the full rating over the run within the 215.2(A) note. */
      noteCu: smallestForNote('Cu', ratingA, lengthFt),
      noteAl: smallestForNote('Al', ratingA, lengthFt),
    },
    noteFt: {
      cu60: noteLength(cu60.size, 'Cu', ratingA),
      al60: noteLength(al60.size, 'Al', ratingA),
      cu75: noteLength(cu75.size, 'Cu', ratingA),
      al75: noteLength(al75.size, 'Al', ratingA),
    },
  };
})();

/** The drop chart's lengths, ft. */
export const SUBPANEL_DROP_LENGTHS = [0, 100, 200, 300, 400, 500];
