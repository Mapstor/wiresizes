// data/verified/mfr-well-pump.json: Franklin Electric's AIM Manual, 2026 edition (registry domain mfr-well-pump;
// WSZ-034): the 4-inch single-phase 75 °C cable table (maximum cable length per copper size at a 5 % drop), its rules,
// the fuse and breaker table (maximum per NEC and typical submersible sizes) and the motors' line amps. Throws at import
// unless the file is the verified 2026 edition and its tables hold together.
import data from '../../../data/verified/mfr-well-pump.json';
import type { SizeKey } from './awg';

export const MFR_WELL_PUMP_DOMAIN = 'mfr-well-pump';

if (data.status !== 'VERIFIED-MFR-2026' || data.domain !== MFR_WELL_PUMP_DOMAIN) throw new Error('mfr-well-pump.json: not the verified 2026 AIM data');

export type PumpVolts = 115 | 230;
export type PumpWires = 2 | 3;
/** Horsepower as Franklin prints it: "1/2", "3/4", "1", "1.5", "2", "3", "5". */
export type PumpHp = string;

export const SOURCE = data.source;

/** The cable table's rules (pdf p. 51): 5 % drop at maximum nameplate amps, 0.6 for 3 %, aluminum two gauges larger. */
export const CABLE_RULES = {
  dropPct: data.cable_rules.voltage_drop_pct,
  threePctFactor: data.cable_rules.three_pct_factor,
  aluminumGaugesLarger: data.cable_rules.aluminum_gauges_larger,
  aluminumExample: data.cable_rules.aluminum_example as { copper: SizeKey; aluminum: SizeKey },
  contactorBoxMaxSharePct: data.cable_rules.line_contactor_control_box_max_share_pct,
  pdfPage: data.cable_rules.pdf_page,
};

/** Copper sizes of the single-phase table, smallest first (14 AWG to 4/0). */
export const CABLE_SIZES: SizeKey[] = data.cable_1ph_4in_75c.sizes;

export interface CableRow {
  volts: PumpVolts;
  hp: PumpHp;
  kw: number;
  /** Maximum length, ft, per size at a 5 % drop: null where the table prints a dash, 0 where it prints 0. */
  ft: (number | null)[];
  /** Sizes in shaded cells: they meet the NEC ampacity rules only as individual conductors, not as jacketed cable. */
  shaded: SizeKey[];
}
export const CABLE_ROWS: CableRow[] = data.cable_1ph_4in_75c.rows.map((r) => ({ ...r, volts: r.volts as PumpVolts }));
export const CABLE_PDF_PAGE = data.cable_1ph_4in_75c.pdf_page;

export interface FuseSet {
  fuse: number;
  dual_element_fuse: number;
  breaker: number;
}
export interface FuseRow {
  wires: PumpWires;
  model: string;
  hp: PumpHp;
  kw: number;
  volts: PumpVolts;
  max_nec: FuseSet;
  typical: FuseSet;
}
export const FUSE_ROWS: FuseRow[] = data.fuses_1ph_4in.rows.map((r) => ({ ...r, wires: r.wires as PumpWires, volts: r.volts as PumpVolts }));
export const FUSE_PDF_PAGE = data.fuses_1ph_4in.pdf_page;

export interface MotorRow {
  wires: PumpWires;
  model: string;
  hp: PumpHp;
  kw: number;
  volts: PumpVolts;
  sf: number;
  /** Line amps at full load and at maximum service factor load. */
  fl_amps: number;
  max_amps: number;
}
export const MOTOR_ROWS: MotorRow[] = data.motors_1ph_4in.rows.map((r) => ({ ...r, wires: r.wires as PumpWires, volts: r.volts as PumpVolts }));
export const MOTOR_PDF_PAGES = data.motors_1ph_4in.pdf_pages;

/** Horsepower as a number ("1/2" → 0.5), for sorting and checks. */
export function hpValue(hp: PumpHp): number {
  if (hp === '1/2') return 0.5;
  if (hp === '3/4') return 0.75;
  return Number(hp);
}

export function cableRow(volts: PumpVolts, hp: PumpHp): CableRow | null {
  return CABLE_ROWS.find((r) => r.volts === volts && r.hp === hp) ?? null;
}
export function fuseRow(wires: PumpWires, volts: PumpVolts, hp: PumpHp): FuseRow | null {
  return FUSE_ROWS.find((r) => r.wires === wires && r.volts === volts && r.hp === hp) ?? null;
}
export function motorRow(wires: PumpWires, volts: PumpVolts, hp: PumpHp): MotorRow | null {
  return MOTOR_ROWS.find((r) => r.wires === wires && r.volts === volts && r.hp === hp) ?? null;
}

// The tables must hold together: 13 sizes from 14 AWG to 4/0; every row rises with the size and every size falls with
// the horsepower; each fuse row has a motor row and a cable row; the typical size never above the maximum per NEC.
if (CABLE_SIZES.length !== 13 || CABLE_SIZES[0] !== '14' || CABLE_SIZES[12] !== '4/0') throw new Error('mfr-well-pump.json: cable sizes changed');
for (const r of CABLE_ROWS) {
  if (r.ft.length !== CABLE_SIZES.length) throw new Error(`mfr-well-pump.json: ${r.volts} V ${r.hp} hp row length`);
  const nums = r.ft.filter((x): x is number => typeof x === 'number' && x > 0);
  if (nums.some((x, i) => i > 0 && x <= nums[i - 1])) throw new Error(`mfr-well-pump.json: ${r.volts} V ${r.hp} hp lengths do not rise`);
}
for (const volts of [115, 230] as const) {
  const rows = CABLE_ROWS.filter((r) => r.volts === volts).sort((a, b) => hpValue(a.hp) - hpValue(b.hp));
  CABLE_SIZES.forEach((_, i) => {
    const col = rows.map((r) => r.ft[i]).filter((x): x is number => typeof x === 'number' && x > 0);
    if (col.some((x, k) => k > 0 && x >= col[k - 1])) throw new Error(`mfr-well-pump.json: ${volts} V column ${CABLE_SIZES[i]} does not fall`);
  });
}
for (const f of FUSE_ROWS) {
  if (!motorRow(f.wires, f.volts, f.hp) || !cableRow(f.volts, f.hp)) throw new Error(`mfr-well-pump.json: no motor or cable row for ${f.model}`);
  for (const k of ['fuse', 'dual_element_fuse', 'breaker'] as const) {
    if (f.typical[k] > f.max_nec[k]) throw new Error(`mfr-well-pump.json: ${f.model} typical ${k} above the NEC maximum`);
  }
}
if (FUSE_ROWS.length !== 13 || MOTOR_ROWS.length !== 13 || CABLE_ROWS.length !== 8) throw new Error('mfr-well-pump.json: table sizes changed');
