// Motor full-load current from NEC Tables 430.247 (DC), 430.248 (single-phase), 430.249 (two-phase, 4-wire) and
// 430.250 (three-phase induction), never from a formula (430.6(A), nec-430-440-2023.json notes). Single- and
// three-phase motors take the column of the system voltage by the table notes (src/lib/verified/nec-430-440-2023.ts);
// DC and two-phase motors need a rated voltage that is a column. Each current carries its row's status (D-09).
//
// motorRun (WSZ-011, the horsepower to amps calculator) reads one table cell for a DC, single-phase or three-phase motor,
// lists the rest of its row, and sets the table current beside the current of the rated power alone: hp × 746 W
// (NIST SP 811's electric horsepower) ÷ the column's volts, ÷ √3 more on three-phase (DOE/GO-10097-517 Equation 1 at
// power factor 1). That second current is a comparison, never an answer: 430.6(A) sizes from the table.
import { W_PER_ELECTRICAL_HP } from './conversions';
import type { TextPart, ValuePart } from './format';
import { partsText } from './format';
import { OWN_VOLTAGE_COLUMNS, SYSTEM_VOLTAGE_COLUMNS, columnForSystemVolts, flcTable } from '../verified/nec-430-440-2023';
import type { MotorTableId } from '../verified/nec-430-440-2023';

export const ENGINE_ID = 'motor-flc';
export const DOMAINS = ['nec-430-flc', 'nist-sp811-conversions', 'doe-motor-load-efficiency'];

/** 1, 2 or 3 phases, or 'dc'. */
export type MotorPhase = 1 | 2 | 3 | 'dc';

export interface MotorFlcInput {
  phase: MotorPhase;
  /** As the tables print it: "1/2", "7-1/2", "10". */
  hp: string;
  /** System voltage for single- and three-phase motors; rated voltage for DC and two-phase motors. */
  volts: number;
}

export interface MotorFlcResult {
  table: MotorTableId;
  column: string;
  flcA: number;
  /** "verified-2023" or "verified-sd2023". */
  status: string;
}

const TABLE_BY_PHASE: Record<string, MotorTableId> = { dc: '430.247', 1: '430.248', 2: '430.249', 3: '430.250' };

/** The table's full-load current, or null when the table has no row, column or value for the inputs. */
export function motorFlc(input: MotorFlcInput): MotorFlcResult | null {
  const table = TABLE_BY_PHASE[String(input.phase)];
  if (!table) return null;
  const { columns, rows } = flcTable(table);
  const byNote = input.phase === 1 || input.phase === 3;
  const column = byNote ? columnForSystemVolts(input.volts) : String(input.volts);
  if (column === null || !columns.includes(column)) return null;
  const row = rows.find((r) => r.hp === input.hp);
  const flcA = row ? row.amps[column] : null;
  return row && flcA !== null ? { table, column, flcA, status: row.status } : null;
}

// ── The horsepower to amps calculator (WSZ-011) ─────────────────────────────────────────────────────────────────────

/** The motors the calculator offers. Two-phase (Table 430.249) is left out: a 120/240 V supply is single-phase. */
export const TOOL_PHASES = ['1', '3', 'dc'] as const;
export type ToolPhase = (typeof TOOL_PHASES)[number];

export function toolTable(phase: ToolPhase): MotorTableId {
  return TABLE_BY_PHASE[phase];
}

/** The table's horsepower ratings, in order, as printed ("1/6" … "10"). */
export function hpRatings(phase: ToolPhase): string[] {
  return flcTable(toolTable(phase)).rows.map((r) => r.hp);
}

/** One voltage column and the system voltages it serves (min = max for 200 V, 208 V and DC). */
export interface VoltageColumn {
  column: string;
  /** The column's rated voltage, in volts. */
  volts: number;
  min: number;
  max: number;
}

/** The columns of a table in order, each with the system voltages the table notes give it. */
export function voltageColumns(phase: ToolPhase): VoltageColumn[] {
  return flcTable(toolTable(phase)).columns.map((column) => {
    const volts = Number(column);
    if (phase === 'dc' || OWN_VOLTAGE_COLUMNS.includes(column)) return { column, volts, min: volts, max: volts };
    const range = SYSTEM_VOLTAGE_COLUMNS.find((r) => r.column === column);
    if (!range) throw new Error(`motor-flc: no system voltage range for the ${column} V column`);
    return { column, volts, min: range.min, max: range.max };
  });
}

/** A printed horsepower as a number: "7-1/2" → 7.5, "1/6" → 0.1666…, "10" → 10. */
export function hpNumber(hp: string): number {
  const m = /^(?:(\d+)-)?(\d+)(?:\/(\d+))?$/.exec(hp);
  if (!m) throw new Error(`motor-flc: "${hp}" is not a horsepower as the tables print it`);
  const whole = m[1] ? Number(m[1]) : 0;
  return m[3] ? whole + Number(m[2]) / Number(m[3]) : whole + Number(m[2]);
}

/** A printed horsepower for reading: "7-1/2" → "7 1/2" with a no-break space; the rest as printed. */
export function hpText(hp: string): string {
  return hp.replace('-', ' ');
}

/** The current of the rated power alone: hp × 746 W ÷ V on DC and single-phase, ÷ (√3 × V) on three-phase. */
export function ratedPowerAmps(hp: number, volts: number, phase: ToolPhase): number {
  const watts = hp * W_PER_ELECTRICAL_HP;
  return phase === '3' ? watts / (Math.sqrt(3) * volts) : watts / volts;
}

export interface MotorRunInput {
  phase: ToolPhase;
  hp: string;
  column: string;
}

export interface MotorRun {
  table: MotorTableId;
  column: VoltageColumn;
  hp: string;
  /** The table's current; null where the table prints none for this horsepower and column. */
  flcA: number | null;
  /** The row's status, for the 2023 reading (D-09). */
  status: string;
  /** The rest of the row: the columns that print a current. */
  others: { column: VoltageColumn; flcA: number }[];
  /** hp × 746 W. */
  watts: number;
  /** The current of the rated power alone at the column's voltage. */
  powerAmps: number;
  /** flcA ÷ powerAmps; null without a table current. */
  ratio: number | null;
  steps: string[];
  stepParts: TextPart[][];
}

export type MotorRunError = 'phase-invalid' | 'hp-invalid' | 'column-invalid';

const FLC = 'nec-430-flc';
const NIST = 'nist-sp811-conversions';
const CALC = `calc:${ENGINE_ID}`;
const PHASE_NAME: Record<ToolPhase, string> = { '1': 'single-phase AC', '3': 'three-phase AC', dc: 'DC' };
const amps = (v: number, src: string): ValuePart => ({ v, unit: 'A', src, format: Number.isInteger(v) ? undefined : { upTo: 2 } });
const volts = (v: number, src: string): ValuePart => ({ v, unit: 'V', src });

/** The system voltages of a column as parts: "220–240 V", or "208 V". */
export function columnParts(c: VoltageColumn, src: string): TextPart[] {
  return c.min === c.max ? [volts(c.volts, src)] : [{ n: c.min, src }, '–', volts(c.max, src)];
}

export function motorRun(input: MotorRunInput): MotorRun | { error: MotorRunError } {
  if (!(TOOL_PHASES as readonly string[]).includes(input.phase)) return { error: 'phase-invalid' };
  const table = toolTable(input.phase);
  const { rows } = flcTable(table);
  const row = rows.find((r) => r.hp === input.hp);
  if (!row) return { error: 'hp-invalid' };
  const columns = voltageColumns(input.phase);
  const column = columns.find((c) => c.column === input.column);
  if (!column) return { error: 'column-invalid' };
  const flcA = row.amps[column.column];
  const others = columns
    .filter((c) => c.column !== column.column && row.amps[c.column] !== null)
    .map((c) => ({ column: c, flcA: row.amps[c.column] as number }));
  const hp = hpNumber(input.hp);
  const watts = hp * W_PER_ELECTRICAL_HP;
  const powerAmps = ratedPowerAmps(hp, column.volts, input.phase);
  const ratio = flcA === null ? null : flcA / powerAmps;
  const steps: TextPart[][] = [];
  const hpLabel = `${hpText(input.hp)} hp`;
  if (input.phase === 'dc') {
    steps.push([`Table ${table} lists ${PHASE_NAME.dc} motors by horsepower and rated voltage: the `, volts(column.volts, FLC), ' column.']);
  } else if (column.min === column.max) {
    steps.push([`Table ${table} lists ${PHASE_NAME[input.phase]} motors by horsepower and rated voltage; `, volts(column.volts, FLC), ' has a column of its own.']);
  } else {
    steps.push([
      `Table ${table} lists ${PHASE_NAME[input.phase]} motors by horsepower and rated voltage; a `,
      ...columnParts(column, FLC),
      ' system takes the ',
      volts(column.volts, FLC),
      ' column.',
    ]);
  }
  steps.push(
    flcA === null
      ? [`The ${hpLabel} row prints no current in the `, volts(column.volts, FLC), ' column.']
      : [`The ${hpLabel} row of the `, volts(column.volts, FLC), ' column: ', amps(flcA, FLC), '.'],
  );
  const divisor: TextPart[] = input.phase === '3' ? ['(√3 × ', volts(column.volts, FLC), ')'] : [volts(column.volts, FLC)];
  const w: ValuePart = { v: watts, unit: 'W', src: CALC, format: Number.isInteger(watts) ? undefined : { upTo: 1 } };
  steps.push([`${hpLabel} × `, { v: W_PER_ELECTRICAL_HP, unit: 'W', src: NIST }, ' per horsepower = ', w, '.']);
  const ideal: TextPart[] =
    input.phase === 'dc'
      ? ['At ', { v: 100, unit: '%', src: CALC }, ' efficiency']
      : ['At ', { v: 100, unit: '%', src: CALC }, ' efficiency and power factor ', { n: 1, src: CALC }];
  const power: TextPart[] = [...ideal, ', that power at ', volts(column.volts, FLC), ' would draw ', w, ' ÷ ', ...divisor, ' = ', amps(powerAmps, CALC)];
  steps.push(
    ratio === null ? [...power, '.'] : [...power, '; the table current is ', { n: ratio, src: CALC, format: { upTo: 2 } }, ' times that.'],
  );
  return {
    table,
    column,
    hp: input.hp,
    flcA,
    status: row.status,
    others,
    watts,
    powerAmps,
    ratio,
    steps: steps.map((parts) => partsText(parts)),
    stepParts: steps,
  };
}

export function isMotorRunError(r: MotorRun | { error: MotorRunError }): r is { error: MotorRunError } {
  return 'error' in r;
}

/** The page's path for a golden case: the column the system voltage takes (DC: the rated voltage itself). */
export function columnForTool(phase: ToolPhase, systemVolts: number): string | null {
  if (phase === 'dc') return voltageColumns('dc').some((c) => c.column === String(systemVolts)) ? String(systemVolts) : null;
  return columnForSystemVolts(systemVolts);
}
