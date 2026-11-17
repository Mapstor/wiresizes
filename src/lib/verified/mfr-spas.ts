// data/verified/mfr-spas.json: hot tub makers' electrical requirements (registry domain mfr-spas; WSZ-035): Hot
// Spring, Bullfrog and Marquis 2026 documents, re-read 2026-11-17. Throws at import unless the file is verified and
// every 240 V maker row asks for a 4-wire circuit with copper.
import data from '../../../data/verified/mfr-spas.json';

export const MFR_SPAS_DOMAIN = 'mfr-spas';
if (data.status !== 'VERIFIED-MFR-2026' || data.domain !== MFR_SPAS_DOMAIN) throw new Error('mfr-spas.json: not the verified 2026 data');

export interface SpaMaker {
  maker: string;
  model: string;
  /** The circuit's nominal voltage: 240 or 120. */
  volts: 240 | 120;
  /** The voltage the document prints (Hot Spring writes 230 V and 115 V). */
  volts_printed: number;
  breaker_a: number[];
  gfci: string;
  wires: number;
  conductors: string;
  copper_only: boolean | null;
  disconnect: string | null;
  doc: string;
  pdf_page: number;
  conversion_a?: number;
}
export const SPA_MAKERS: SpaMaker[] = data.makers.map((m) => ({ ...m, volts: m.volts as 240 | 120 }));
export const SPA_DOCUMENTS = data.documents;

for (const m of SPA_MAKERS.filter((x) => x.volts === 240)) {
  if (m.wires !== 4 || m.copper_only !== true) throw new Error(`mfr-spas.json: ${m.maker} ${m.model} is not a 4-wire copper circuit`);
}

/** Every breaker size a reviewed maker asks for, by voltage, smallest first. */
export function makerBreakers(volts: 240 | 120): number[] {
  return [...new Set(SPA_MAKERS.filter((m) => m.volts === volts).flatMap((m) => m.breaker_a))].sort((a, b) => a - b);
}
