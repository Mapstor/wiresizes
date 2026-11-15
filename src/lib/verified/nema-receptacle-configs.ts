// data/verified/nema-receptacle-configs.json: NEMA straight-blade receptacle configurations (ampere and volt ratings,
// poles, wires, grounding) from manufacturers' spec sheets that state NEMA WD 6 compliance (registry domain
// nema-receptacle-configs).
import data from '../../../data/verified/nema-receptacle-configs.json';

export const NEMA_DOMAIN = 'nema-receptacle-configs';

export interface NemaConfig {
  config: string;
  amps: number;
  volts: string;
  poles: number;
  wires: number;
  grounding: boolean;
}

export const NEMA_CONFIGS: NemaConfig[] = data.rows.map((r) => ({
  config: r.config,
  amps: r.amps,
  volts: r.volts,
  poles: r.poles,
  wires: r.wires,
  grounding: r.grounding,
}));

/** A configuration by name ("14-50R"); throws for one the file does not hold. */
export function nemaConfig(config: string): NemaConfig {
  const found = NEMA_CONFIGS.find((c) => c.config === config);
  if (!found) throw new Error(`nema-receptacle-configs.json: no ${config}`);
  return found;
}
