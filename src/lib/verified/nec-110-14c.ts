// data/verified/nec-110-14c.json: NEC 110.14(C) (2023) temperature limits of terminations (verified-sd2023, D-09).
// The column choice comes from the file's engine_rules, read from their text so a regenerated file changes the
// values here; a rule whose wording no longer matches throws when the module loads.
import data from '../../../data/verified/nec-110-14c.json';

function ruleText(id: string): string {
  const rule = data.engine_rules.find((r) => r.id === id);
  if (!rule) throw new Error(`nec-110-14c.json: no engine rule ${id}`);
  return rule.rule;
}

function read(id: string, pattern: RegExp): number {
  const match = pattern.exec(ruleText(id));
  if (!match) throw new Error(`nec-110-14c.json: engine rule ${id} no longer matches ${pattern}`);
  return Number(match[1]);
}

/** The engine_rules as numbers. */
export interface TerminationRules {
  /** default-100A-or-less and default-over-100A: the circuit rating that splits the two defaults, in amperes. */
  limitA: number;
  /** default-100A-or-less: the column for circuits rated at or below limitA. */
  columnAtOrBelowLimit: number;
  /** default-over-100A: the column for circuits rated above limitA. */
  columnAboveLimit: number;
  /** nm-cable: the only column for NM or UF cable, which is also where its correction and adjustment start. */
  cableColumn: number;
}

export const TERMINATION_RULES: TerminationRules = {
  limitA: read('default-100A-or-less', /rated (\d+) A or less/),
  columnAtOrBelowLimit: read('default-100A-or-less', /(\d+) °C column by default/),
  columnAboveLimit: read('default-over-100A', /(\d+) °C column by default/),
  cableColumn: read('nm-cable', /(\d+) °C only/),
};

if (read('default-over-100A', /rated over (\d+) A/) !== TERMINATION_RULES.limitA) {
  throw new Error('nec-110-14c.json: default-100A-or-less and default-over-100A name different ratings');
}
