// data/verified/mfr-welders.json (registry domain mfr-welders; re-read WSZ-037): six welders' electrical service guides,
// from the makers' own hosts. The four with an I1max are the calculator's presets.
import data from '../../../data/verified/mfr-welders.json';
import type { SizeKey } from './awg';

export const MFR_WELDERS_DOMAIN = 'mfr-welders';
/** The ambient Miller's 2026 guides correct their minimum wire for, °C. */
export const MILLER_AMBIENT_C: number = (data as { ambient_c_2026_miller: number }).ambient_c_2026_miller;
if (data.status !== 'VERIFIED-MFR-2026') throw new Error('mfr-welders.json: not VERIFIED-MFR-2026');

export interface Welder {
  id: string;
  brand: 'Miller' | 'Lincoln';
  model: string;
  doc: string;
  rev: string;
  url: string;
  supplyV: number;
  ratedOutput: string;
  i1maxA: number | null;
  i1effA: number | null;
  inputAtRatedA: number | null;
  fuseTimeDelayA: number | null;
  fuseNormalA: number | null;
  fuseOrBreakerA: number | null;
  minConductor: SizeKey;
  minGround: SizeKey | null;
  maxLengthFt: number | null;
  necReference: string | null;
  longRun: { overFt: number; conductor: SizeKey } | null;
  receptacle: string | null;
}

type Row = (typeof data.machines)[number] & { long_run?: { over_ft: number; conductor: string }; receptacle?: string };
export const WELDERS: Welder[] = (data.machines as Row[]).map((m) => ({
  id: m.id,
  brand: m.brand as Welder['brand'],
  model: m.model,
  doc: m.doc,
  rev: m.rev,
  url: m.url,
  supplyV: m.supply_v,
  ratedOutput: m.rated_output,
  i1maxA: m.i1max_a,
  i1effA: m.i1eff_a,
  inputAtRatedA: m.input_a_at_rated_output,
  fuseTimeDelayA: m.fuse_time_delay_a,
  fuseNormalA: m.fuse_normal_a,
  fuseOrBreakerA: m.fuse_or_breaker_a,
  minConductor: m.min_conductor as SizeKey,
  minGround: (m.min_ground as SizeKey | null) ?? null,
  maxLengthFt: m.max_length_ft,
  necReference: m.nec_reference,
  longRun: m.long_run ? { overFt: m.long_run.over_ft, conductor: m.long_run.conductor as SizeKey } : null,
  receptacle: m.receptacle ?? null,
}));

/** The fuse or breaker the calculator starts from: Miller's time-delay fuse, or Lincoln's fuse-or-breaker rating. */
export function manualOcpd(w: Welder): number {
  const a = w.fuseTimeDelayA ?? w.fuseOrBreakerA;
  if (a === null) throw new Error(`mfr-welders.json: ${w.model} has no fuse or breaker`);
  return a;
}

/** The calculator's presets: the machines whose guide gives an I1max. */
export const WELDER_PRESETS = WELDERS.filter((w) => w.i1maxA !== null);
if (WELDER_PRESETS.length !== 4) throw new Error(`mfr-welders.json: expected 4 machines with an I1max, got ${WELDER_PRESETS.length}`);
for (const w of WELDERS) {
  if (w.fuseTimeDelayA !== null && w.fuseNormalA !== null && w.fuseTimeDelayA > w.fuseNormalA) throw new Error(`mfr-welders.json: ${w.model} fuses out of order`);
  if (w.i1maxA !== null && w.i1effA !== null && w.i1effA > w.i1maxA) throw new Error(`mfr-welders.json: ${w.model} I1eff above I1max`);
}
export function welder(id: string): Welder {
  const w = WELDERS.find((x) => x.id === id);
  if (!w) throw new Error(`mfr-welders.json: no ${id}`);
  return w;
}
