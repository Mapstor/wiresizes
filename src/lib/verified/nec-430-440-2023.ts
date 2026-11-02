// data/verified/nec-430-440-2023.json: NEC 2023 motor full-load current tables 430.247 (DC), 430.248
// (single-phase), 430.249 (two-phase) and 430.250 (three-phase induction), each value with its status (D-09). The
// system-voltage columns come from the file's note on the table notes ("map system voltages 110–120, … V to the
// 115, … V columns; 200 V and 208 V have their own columns"); text that no longer matches throws when the module loads.
import data from '../../../data/verified/nec-430-440-2023.json';

export type MotorTableId = '430.247' | '430.248' | '430.249' | '430.250';

export interface FlcRow {
  /** As the table prints it: "1/2", "7-1/2", "100". */
  hp: string;
  status: string;
  /** Full-load current in amperes by column ("115", "230" …), null where the table has none. */
  amps: Record<string, number | null>;
}

export interface FlcTable {
  columns: string[];
  rows: FlcRow[];
}

type JsonRow = Record<string, number | string | null>;

function flcRows(columns: string[], rows: JsonRow[], tableStatus: string | null): FlcRow[] {
  return rows.map((row) => {
    const status = typeof row.status === 'string' ? row.status : tableStatus;
    if (status === null) throw new Error(`nec-430-440-2023.json: no status for the ${String(row.hp)} hp row`);
    const amps: Record<string, number | null> = {};
    for (const column of columns) amps[column] = typeof row[column] === 'number' ? (row[column] as number) : null;
    return { hp: String(row.hp), status, amps };
  });
}

function plainTable(table: { columns: string[]; rows: unknown[]; status: string }): FlcTable {
  return { columns: table.columns, rows: flcRows(table.columns, table.rows as JsonRow[], table.status) };
}

const TABLES: Record<MotorTableId, FlcTable> = {
  '430.247': plainTable(data.table_430_247),
  '430.248': plainTable(data.table_430_248),
  '430.249': plainTable(data.table_430_249),
  '430.250': {
    columns: data.table_430_250.induction_columns,
    rows: flcRows(data.table_430_250.induction_columns, data.table_430_250.induction_rows as JsonRow[], null),
  },
};

/** A full-load current table (430.250: the induction motor columns). */
export function flcTable(id: MotorTableId): FlcTable {
  return TABLES[id];
}

const voltageNote = data.notes.find((note) => note.includes('map system voltages'));
const voltageMatch = voltageNote
  ? /map system voltages (.+?) V to the (.+?) V columns; (.+?) have their own columns/.exec(voltageNote)
  : null;
if (!voltageMatch) throw new Error('nec-430-440-2023.json: the system-voltage note no longer matches');
const listItems = (text: string) => text.split(/, | and /);
const systemRanges = listItems(voltageMatch[1]).map((range) => /^(\d+)–(\d+)$/.exec(range));
const rangeColumns = listItems(voltageMatch[2]);
if (systemRanges.some((range) => !range) || systemRanges.length !== rangeColumns.length) {
  throw new Error('nec-430-440-2023.json: the system-voltage note no longer pairs ranges with columns');
}

/** System voltage ranges and the column each maps to (220–240 V → "230"). */
export const SYSTEM_VOLTAGE_COLUMNS = systemRanges.map((range, i) => ({
  min: Number((range as RegExpExecArray)[1]),
  max: Number((range as RegExpExecArray)[2]),
  column: rangeColumns[i],
}));

/** System voltages with their own column ("200", "208"). */
export const OWN_VOLTAGE_COLUMNS: string[] = voltageMatch[3].match(/\d+/g) ?? [];

/** The column for a system voltage: its own column, or the column its range maps to; null otherwise. */
export function columnForSystemVolts(volts: number): string | null {
  if (OWN_VOLTAGE_COLUMNS.includes(String(volts))) return String(volts);
  return SYSTEM_VOLTAGE_COLUMNS.find((r) => volts >= r.min && volts <= r.max)?.column ?? null;
}
