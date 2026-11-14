// data/verified/nec-continuous-load-2023.json: the 125 % continuous-load rules of NEC 2023 (210.19(A), 210.20(A),
// 215.2(A), 215.3, 230.42(A)). The percent is read from each rule's continuous_multiplier ("125 percent"); the
// branch-circuit (210.20(A)) and feeder (215.3) overcurrent rules must agree, or the module throws when it loads.
import data from '../../../data/verified/nec-continuous-load-2023.json';

function continuousPercent(ref: string): number {
  const rule = data.rules.find((r) => r.ref === ref);
  const text = rule && 'continuous_multiplier' in rule.values ? rule.values.continuous_multiplier : undefined;
  const match = text === undefined ? null : /^(\d+) percent$/.exec(text);
  if (!match) throw new Error(`nec-continuous-load-2023.json: no continuous_multiplier in ${ref}`);
  return Number(match[1]);
}

/**
 * 210.20(A) and 215.3: an overcurrent device rated at least the noncontinuous load plus this percent of the
 * continuous load (125).
 */
export const CONTINUOUS_LOAD_PERCENT = continuousPercent('210.20(A)');

if (continuousPercent('215.3') !== CONTINUOUS_LOAD_PERCENT) {
  throw new Error('nec-continuous-load-2023.json: 210.20(A) and 215.3 give different continuous-load percents');
}

/** A leading whole percent of a value text ("3 percent at the farthest outlet" → 3), or a throw. */
function leadingPercent(ref: string, key: string): number {
  const rule = data.rules.find((r) => r.ref === ref);
  const values = rule?.values as Record<string, string> | undefined;
  const match = values && typeof values[key] === 'string' ? /^(\d+) percent\b/.exec(values[key]) : null;
  if (!match) throw new Error(`nec-continuous-load-2023.json: no "N percent" in ${ref} ${key}`);
  return Number(match[1]);
}

const VD_NOTE_REF = '215.2(A) Informational Notes No. 1-3 (voltage drop)';

/**
 * 215.2(A) Informational Note No. 2 (2023): feeder conductors sized to prevent a voltage drop above `feederPct` at the
 * farthest outlet, with at most `totalPct` on feeders and branch circuits together, "will provide reasonable efficiency
 * of operation". Advice about efficiency, never a limit (the data file's notes).
 */
export const VOLTAGE_DROP_NOTE = {
  feederPct: leadingPercent(VD_NOTE_REF, 'feeder_drop'),
  totalPct: leadingPercent(VD_NOTE_REF, 'total_drop'),
};
