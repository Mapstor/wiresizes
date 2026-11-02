// Motor full-load current from NEC Tables 430.247 (DC), 430.248 (single-phase), 430.249 (two-phase, 4-wire) and
// 430.250 (three-phase induction), never from a formula (430.6(A), nec-430-440-2023.json notes). Single- and
// three-phase motors take the column of the system voltage by the table notes (src/lib/verified/nec-430-440-2023.ts);
// DC and two-phase motors need a rated voltage that is a column. Each current carries its row's status (D-09).
import { columnForSystemVolts, flcTable } from '../verified/nec-430-440-2023';
import type { MotorTableId } from '../verified/nec-430-440-2023';

export const ENGINE_ID = 'motor-flc';
export const DOMAINS = ['nec-430-flc'];

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
