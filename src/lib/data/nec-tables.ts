/**
 * Canonical NEC reference data — single source of truth for the site.
 *
 * Source: NFPA 70 (NEC) 2023 edition. Where pages on the site previously
 * shipped inconsistent or off-by-one values, this module is authoritative;
 * pages should import from here rather than defining their own copies.
 *
 * Numeric ampacity entries are integers in amperes. `null` means the
 * NEC table does not list a value for that combination (typically
 * aluminum at small AWG sizes that aren't manufactured for service).
 */

// ─────────────────────────────────────────────────────────────────────────────
// NEC 310.16 — Allowable ampacities of insulated conductors rated up to
// and including 2000V, for not more than three current-carrying
// conductors in raceway, cable, or earth, based on ambient temperature
// of 30°C (86°F).
// ─────────────────────────────────────────────────────────────────────────────

export interface AmpacityRow {
  /** AWG or kcmil designation, as text (e.g., "14", "1/0", "250"). */
  awg: string;
  /** Cross-section area in kcmil (1000 circular mils). */
  area_kcmil: number;
  /** Conductor diameter in mils (1/1000 inch). */
  diameter_mils: number;
  /** Cross-section area in square millimeters. */
  area_mm2: number;
  /** Conductor diameter in millimeters. */
  diameter_mm: number;
  /** NEC 310.16 ampacity in 60°C insulation column (e.g., TW). */
  copper_60c: number | null;
  /** NEC 310.16 ampacity in 75°C insulation column (e.g., THWN, THW, RHW). */
  copper_75c: number | null;
  /** NEC 310.16 ampacity in 90°C insulation column (e.g., THHN, XHHW-2). */
  copper_90c: number | null;
  /** NEC 310.16 ampacity for aluminum / copper-clad aluminum at 60°C. */
  aluminum_60c: number | null;
  /** Aluminum at 75°C. */
  aluminum_75c: number | null;
  /** Aluminum at 90°C. */
  aluminum_90c: number | null;
}

export const NEC_310_16: AmpacityRow[] = [
  // NEC Table 310.16 has no aluminum values for 14 AWG.
  { awg: '14',    area_kcmil: 4.11,   diameter_mils: 64.1,  area_mm2: 2.08,  diameter_mm: 1.63,  copper_60c: 15,  copper_75c: 20,  copper_90c: 25,  aluminum_60c: null, aluminum_75c: null, aluminum_90c: null },
  { awg: '12',    area_kcmil: 6.53,   diameter_mils: 80.8,  area_mm2: 3.31,  diameter_mm: 2.05,  copper_60c: 20,  copper_75c: 25,  copper_90c: 30,  aluminum_60c: 15,   aluminum_75c: 20,   aluminum_90c: 25 },
  { awg: '10',    area_kcmil: 10.38,  diameter_mils: 101.9, area_mm2: 5.26,  diameter_mm: 2.59,  copper_60c: 30,  copper_75c: 35,  copper_90c: 40,  aluminum_60c: 25,   aluminum_75c: 30,   aluminum_90c: 35 },
  { awg: '8',     area_kcmil: 16.51,  diameter_mils: 128.5, area_mm2: 8.37,  diameter_mm: 3.26,  copper_60c: 40,  copper_75c: 50,  copper_90c: 55,  aluminum_60c: 35,   aluminum_75c: 40,   aluminum_90c: 45 },
  { awg: '6',     area_kcmil: 26.24,  diameter_mils: 162.0, area_mm2: 13.3,  diameter_mm: 4.11,  copper_60c: 55,  copper_75c: 65,  copper_90c: 75,  aluminum_60c: 40,   aluminum_75c: 50,   aluminum_90c: 55 },
  { awg: '4',     area_kcmil: 41.74,  diameter_mils: 204.3, area_mm2: 21.2,  diameter_mm: 5.19,  copper_60c: 70,  copper_75c: 85,  copper_90c: 95,  aluminum_60c: 55,   aluminum_75c: 65,   aluminum_90c: 75 },
  { awg: '3',     area_kcmil: 52.62,  diameter_mils: 229.4, area_mm2: 26.7,  diameter_mm: 5.83,  copper_60c: 85,  copper_75c: 100, copper_90c: 115, aluminum_60c: 65,   aluminum_75c: 75,   aluminum_90c: 85 },
  { awg: '2',     area_kcmil: 66.36,  diameter_mils: 257.6, area_mm2: 33.6,  diameter_mm: 6.54,  copper_60c: 95,  copper_75c: 115, copper_90c: 130, aluminum_60c: 75,   aluminum_75c: 90,   aluminum_90c: 100 },
  { awg: '1',     area_kcmil: 83.69,  diameter_mils: 289.3, area_mm2: 42.4,  diameter_mm: 7.35,  copper_60c: 110, copper_75c: 130, copper_90c: 145, aluminum_60c: 85,   aluminum_75c: 100,  aluminum_90c: 115 },
  { awg: '1/0',   area_kcmil: 105.6,  diameter_mils: 325.0, area_mm2: 53.5,  diameter_mm: 8.25,  copper_60c: 125, copper_75c: 150, copper_90c: 170, aluminum_60c: 100,  aluminum_75c: 120,  aluminum_90c: 135 },
  { awg: '2/0',   area_kcmil: 133.1,  diameter_mils: 364.8, area_mm2: 67.4,  diameter_mm: 9.27,  copper_60c: 145, copper_75c: 175, copper_90c: 195, aluminum_60c: 115,  aluminum_75c: 135,  aluminum_90c: 150 },
  { awg: '3/0',   area_kcmil: 167.8,  diameter_mils: 409.6, area_mm2: 85.0,  diameter_mm: 10.4,  copper_60c: 165, copper_75c: 200, copper_90c: 225, aluminum_60c: 130,  aluminum_75c: 155,  aluminum_90c: 175 },
  { awg: '4/0',   area_kcmil: 211.6,  diameter_mils: 460.0, area_mm2: 107,   diameter_mm: 11.7,  copper_60c: 195, copper_75c: 230, copper_90c: 260, aluminum_60c: 150,  aluminum_75c: 180,  aluminum_90c: 205 },
  { awg: '250',   area_kcmil: 250,    diameter_mils: 522.5, area_mm2: 127,   diameter_mm: 12.7,  copper_60c: 215, copper_75c: 255, copper_90c: 290, aluminum_60c: 170,  aluminum_75c: 205,  aluminum_90c: 230 },
  { awg: '300',   area_kcmil: 300,    diameter_mils: 572.3, area_mm2: 152,   diameter_mm: 13.9,  copper_60c: 240, copper_75c: 285, copper_90c: 320, aluminum_60c: 195,  aluminum_75c: 230,  aluminum_90c: 260 },
  { awg: '350',   area_kcmil: 350,    diameter_mils: 618.5, area_mm2: 177,   diameter_mm: 15.0,  copper_60c: 260, copper_75c: 310, copper_90c: 350, aluminum_60c: 210,  aluminum_75c: 250,  aluminum_90c: 280 },
  { awg: '400',   area_kcmil: 400,    diameter_mils: 661.6, area_mm2: 203,   diameter_mm: 16.1,  copper_60c: 280, copper_75c: 335, copper_90c: 380, aluminum_60c: 225,  aluminum_75c: 270,  aluminum_90c: 305 },
  { awg: '500',   area_kcmil: 500,    diameter_mils: 739.8, area_mm2: 253,   diameter_mm: 18.0,  copper_60c: 320, copper_75c: 380, copper_90c: 430, aluminum_60c: 260,  aluminum_75c: 310,  aluminum_90c: 350 },
  { awg: '600',   area_kcmil: 600,    diameter_mils: 813.0, area_mm2: 304,   diameter_mm: 19.7,  copper_60c: 350, copper_75c: 420, copper_90c: 475, aluminum_60c: 285,  aluminum_75c: 340,  aluminum_90c: 385 },
  { awg: '700',   area_kcmil: 700,    diameter_mils: 836.7,  area_mm2: 354.7,  diameter_mm: 21.25,  copper_60c: 385, copper_75c: 460, copper_90c: 520, aluminum_60c: 315,  aluminum_75c: 375,  aluminum_90c: 425 },
  { awg: '750',   area_kcmil: 750,    diameter_mils: 908.0, area_mm2: 380,   diameter_mm: 22.0,  copper_60c: 400, copper_75c: 475, copper_90c: 535, aluminum_60c: 320,  aluminum_75c: 385,  aluminum_90c: 435 },
  { awg: '800',   area_kcmil: 800,    diameter_mils: 894.4,  area_mm2: 405.4,  diameter_mm: 22.72,  copper_60c: 410, copper_75c: 490, copper_90c: 555, aluminum_60c: 330,  aluminum_75c: 395,  aluminum_90c: 445 },
  { awg: '900',   area_kcmil: 900,    diameter_mils: 948.7,  area_mm2: 456.0,  diameter_mm: 24.1,   copper_60c: 435, copper_75c: 520, copper_90c: 585, aluminum_60c: 355,  aluminum_75c: 425,  aluminum_90c: 480 },
  { awg: '1000',  area_kcmil: 1000,   diameter_mils: 1060,  area_mm2: 507,   diameter_mm: 26.9,  copper_60c: 455, copper_75c: 545, copper_90c: 615, aluminum_60c: 375,  aluminum_75c: 445,  aluminum_90c: 500 },
  { awg: '1250',  area_kcmil: 1250,   diameter_mils: 1118.0,  area_mm2: 633.4,  diameter_mm: 28.4,   copper_60c: 495, copper_75c: 590, copper_90c: 665, aluminum_60c: 405,  aluminum_75c: 485,  aluminum_90c: 545 },
  { awg: '1500',  area_kcmil: 1500,   diameter_mils: 1224.7,  area_mm2: 760.1,  diameter_mm: 31.11,  copper_60c: 525, copper_75c: 625, copper_90c: 705, aluminum_60c: 435,  aluminum_75c: 520,  aluminum_90c: 585 },
  { awg: '1750',  area_kcmil: 1750,   diameter_mils: 1322.9,  area_mm2: 886.7,  diameter_mm: 33.6,   copper_60c: 545, copper_75c: 650, copper_90c: 735, aluminum_60c: 455,  aluminum_75c: 545,  aluminum_90c: 615 },
  { awg: '2000',  area_kcmil: 2000,   diameter_mils: 1414.2,  area_mm2: 1013.0,  diameter_mm: 35.92,  copper_60c: 555, copper_75c: 665, copper_90c: 750, aluminum_60c: 470,  aluminum_75c: 560,  aluminum_90c: 630 },
];

/**
 * Backward-compat alias for the previous filename. The original
 * src/lib/data/nec-310-16.ts exported `NEC_TABLE_310_16` with a slightly
 * different per-row shape (nested `copper`/`aluminum` objects). New code
 * should use `NEC_310_16` directly with the flat field names.
 */
export const NEC_TABLE_310_16 = NEC_310_16;

// ─────────────────────────────────────────────────────────────────────────────
// Helper functions (carried over from the legacy nec-310-16.ts).
// ─────────────────────────────────────────────────────────────────────────────

export type WireMaterial = 'copper' | 'aluminum';
export type TemperatureRating = 60 | 75 | 90;

function ampacityField(material: WireMaterial, temp: TemperatureRating): keyof AmpacityRow {
  return `${material}_${temp}c` as keyof AmpacityRow;
}

/** NEC 310.16 ampacity for a given AWG, material, and termination temp. */
export function getAmpacity(
  awg: string,
  material: WireMaterial,
  tempRating: TemperatureRating = 75,
): number | null {
  const row = NEC_310_16.find((r) => r.awg === awg);
  if (!row) return null;
  const value = row[ampacityField(material, tempRating)];
  return typeof value === 'number' ? value : null;
}

/** Smallest AWG whose NEC 310.16 ampacity meets or exceeds `amps`. */
export function getMinWireSize(
  amps: number,
  material: WireMaterial,
  tempRating: TemperatureRating = 75,
): string | null {
  for (const row of NEC_310_16) {
    const ampacity = row[ampacityField(material, tempRating)];
    if (typeof ampacity === 'number' && ampacity >= amps) return row.awg;
  }
  return null;
}

/** Conductor diameter in millimeters (for visualization). */
export function getWireDiameter(awg: string): number | null {
  return NEC_310_16.find((r) => r.awg === awg)?.diameter_mm ?? null;
}

/** All AWG / kcmil sizes in canonical order. */
export function getAllWireSizes(): string[] {
  return NEC_310_16.map((r) => r.awg);
}

// ─────────────────────────────────────────────────────────────────────────────
// NEC 310.15(C)(1) — Adjustment factors for more than three current-
// carrying conductors in a raceway or cable.
// ─────────────────────────────────────────────────────────────────────────────

export const NEC_310_15_C_1_BUNDLING: Array<{ conductors: string; factor: number }> = [
  { conductors: '4–6',   factor: 0.80 },
  { conductors: '7–9',   factor: 0.70 },
  { conductors: '10–20', factor: 0.50 },
  { conductors: '21–30', factor: 0.45 },
  { conductors: '31–40', factor: 0.40 },
  { conductors: '41+',   factor: 0.35 },
];
