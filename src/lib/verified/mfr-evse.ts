// data/verified/mfr-evse.json (WSZ-031): three makers' circuit tables, terminal sizes and wire statements for Level 2
// chargers, as printed in their installation instructions (registry domain mfr-evse).
import data from '../../../data/verified/mfr-evse.json';
import type { SizeKey } from './awg';

export const MFR_EVSE_DOMAIN = 'mfr-evse';

export interface EvCircuit {
  breakerA: number;
  outputA: number;
  /** Tesla prints kW at 240 V; the others don't. */
  kw: number | null;
  plugIn: boolean;
}

export interface EvMaker {
  id: 'tesla' | 'chargepoint' | 'emporia';
  maker: string;
  model: string;
  url: string;
  circuits: EvCircuit[];
  /** The largest wire the charger's terminals take. */
  largestAwg: SizeKey;
}

type Raw = (typeof data.makers)[number];

function maker(id: EvMaker['id']): EvMaker {
  const m = data.makers.find((x) => x.id === id) as Raw | undefined;
  if (!m || !m.copper_only) throw new Error(`mfr-evse.json: ${id} missing or not copper only`);
  return {
    id,
    maker: m.maker,
    model: m.model,
    url: m.url,
    circuits: m.circuits.map((c) => ({ breakerA: c.breaker_a, outputA: c.output_a, kw: 'kw_240v' in c ? (c.kw_240v as number) : null, plugIn: c.plug_in })),
    largestAwg: m.terminal_awg.largest as SizeKey,
  };
}

export const TESLA = maker('tesla');
export const CHARGEPOINT = maker('chargepoint');
export const EMPORIA = maker('emporia');

const tesla = data.makers.find((x) => x.id === 'tesla')!;
/** Tesla at 48 A: the least copper size with a 60 °C-rated breaker and with a 75 °C-rated one. */
export const TESLA_MAX_WIRE = { at60: tesla.wire_at_max_output!.breaker_60c as SizeKey, at75: tesla.wire_at_max_output!.breaker_75c as SizeKey };
/** Tesla's terminal range. */
export const TESLA_TERMINALS = { smallest: tesla.terminal_awg.smallest as SizeKey, largest: tesla.terminal_awg.largest as SizeKey };

const chargepoint = data.makers.find((x) => x.id === 'chargepoint')!;
/** ChargePoint's terminal rating, °C. */
export const CHARGEPOINT_TERMINAL_C = chargepoint.terminal_rating_c as number;
/** ChargePoint: the circuit is rated for this percent of the charger's maximum load (its continuous-load caution). */
export const CHARGEPOINT_CIRCUIT_PCT = (() => {
  const m = /rated for (\d+)% of the maximum load/.exec(chargepoint.quotes.continuous ?? "");
  if (!m) throw new Error('mfr-evse.json: ChargePoint continuous-load quote changed');
  return Number(m[1]);
})();
/** The wire rating Tesla and ChargePoint both call for, °C. */
export const EVSE_WIRE_C = (() => {
  if (tesla.wire_rating_c !== chargepoint.wire_rating_c) throw new Error('mfr-evse.json: Tesla and ChargePoint call for different wire ratings');
  return chargepoint.wire_rating_c as number;
})();

/** The outputs Tesla and ChargePoint both list, from 16 A up: the guide's rows. */
export const SHARED_OUTPUTS_A: number[] = TESLA.circuits
  .map((c) => c.outputA)
  .filter((a) => a >= 16 && CHARGEPOINT.circuits.some((c) => c.outputA === a))
  .sort((a, b) => a - b);

/** ChargePoint's top setting, above Tesla's: hardwired only. */
export const CHARGEPOINT_TOP = (() => {
  const top = [...CHARGEPOINT.circuits].sort((a, b) => b.outputA - a.outputA)[0];
  if (top.plugIn) throw new Error('mfr-evse.json: ChargePoint top setting is plug-in');
  return top;
})();
