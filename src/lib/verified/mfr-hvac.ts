// data/verified/mfr-equipment.json ac_units and ac_unit_notes (registry domain mfr-hvac-specs; re-read WSZ-036): the MCA
// and MOCP of two makers' split-system air conditioners, 1.5 to 5 tons at 208/230 V single phase (Carrier 26SCA5-02PD,
// Amana SS-ALXS3N-R32), and what both documents say about the wire and the breaker. Carrier's 3.5- and 4-ton rows carry
// the higher MOCP its coastal sibling sheet prints. Trane's partly read sheet is not used.
import data from '../../../data/verified/mfr-equipment.json';

export const MFR_HVAC_DOMAIN = 'mfr-hvac-specs';

export interface AcUnit {
  brand: 'Carrier' | 'Amana';
  model: string;
  tons: number;
  mcaA: number;
  mocpA: number;
  /** The MOCP Carrier's coastal 26SCA5C sheet prints for the same size, where it differs. */
  coastalMocpA: number | null;
}

type Row = (typeof data.ac_units)[number] & { mocp_conflict?: { value_a: number } };

export const AC_UNITS: AcUnit[] = (data.ac_units as Row[])
  .filter((u) => (u.brand === 'Carrier' || u.brand === 'Amana') && u.status.startsWith('VERIFIED (mfr)'))
  .map((u) => ({
    brand: u.brand as AcUnit['brand'],
    model: u.model,
    tons: u.tons,
    mcaA: u.mca_a as number,
    mocpA: u.mocp_a as number,
    coastalMocpA: u.mocp_conflict ? u.mocp_conflict.value_a : null,
  }))
  .sort((a, b) => a.tons - b.tons || a.brand.localeCompare(b.brand));

for (const u of AC_UNITS) {
  if (!(u.mcaA > 0 && u.mocpA >= u.mcaA)) throw new Error(`mfr-equipment.json: ${u.brand} ${u.model} MCA/MOCP out of order`);
}
if (AC_UNITS.length !== 14) throw new Error(`mfr-equipment.json: expected 14 Carrier and Amana units, got ${AC_UNITS.length}`);

interface Doc {
  brand: string;
  doc: string;
  rev: string;
  url: string;
  pdf_page: number;
  copper: string;
  protective_device: string;
}
const docs = data.ac_unit_notes.documents as Doc[];
function doc(brand: string): Doc {
  const d = docs.find((x) => x.brand === brand);
  if (!d || !d.copper || !d.protective_device) throw new Error(`mfr-equipment.json: no ac_unit_notes document for ${brand}`);
  return d;
}

/** The two makers' documents: name, revision, link and their copper and breaker notes. */
export const AC_DOCS = { carrier: doc('Carrier'), amana: doc('Amana') };
if (!/copper/i.test(AC_DOCS.carrier.copper) || !/COPPER CONDUCTORS ONLY/.test(AC_DOCS.amana.copper)) {
  throw new Error('mfr-equipment.json: the copper notes changed');
}
if (!/HACR/.test(AC_DOCS.amana.protective_device)) throw new Error('mfr-equipment.json: the Amana breaker note changed');
