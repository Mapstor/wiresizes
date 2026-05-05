/**
 * Canonical NEC reference data — single source of truth for the site.
 *
 * Source: NFPA 70 (NEC) 2023 edition, with values verified against
 * publicly available code excerpts. Where pages on the site previously
 * shipped inconsistent or off-by-one values, this module is the
 * canonical version; pages should import from here rather than
 * defining their own copies.
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
  /** DC resistance at 25°C, ohms per 1000 ft (NEC Chapter 9 Table 8). */
  dc_resistance_ohms_per_1000ft: number;
  /** Approximate weight per 1000 ft, pounds (uncoated bare copper). */
  weight_lb_per_1000ft: number;
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
  // Aluminum is not commonly available below 12 AWG, hence nulls.
  { awg: '14',    area_kcmil: 4.11,   diameter_mils: 64.1,  dc_resistance_ohms_per_1000ft: 3.07,    weight_lb_per_1000ft: 12.4,  copper_60c: 15,  copper_75c: 20,  copper_90c: 25,  aluminum_60c: null, aluminum_75c: null, aluminum_90c: null },
  { awg: '12',    area_kcmil: 6.53,   diameter_mils: 80.8,  dc_resistance_ohms_per_1000ft: 1.93,    weight_lb_per_1000ft: 19.8,  copper_60c: 20,  copper_75c: 25,  copper_90c: 30,  aluminum_60c: 15,   aluminum_75c: 20,   aluminum_90c: 25 },
  { awg: '10',    area_kcmil: 10.38,  diameter_mils: 101.9, dc_resistance_ohms_per_1000ft: 1.21,    weight_lb_per_1000ft: 31.4,  copper_60c: 30,  copper_75c: 35,  copper_90c: 40,  aluminum_60c: 25,   aluminum_75c: 30,   aluminum_90c: 35 },
  { awg: '8',     area_kcmil: 16.51,  diameter_mils: 128.5, dc_resistance_ohms_per_1000ft: 0.764,   weight_lb_per_1000ft: 49.9,  copper_60c: 40,  copper_75c: 50,  copper_90c: 55,  aluminum_60c: 35,   aluminum_75c: 40,   aluminum_90c: 45 },
  { awg: '6',     area_kcmil: 26.24,  diameter_mils: 162.0, dc_resistance_ohms_per_1000ft: 0.491,   weight_lb_per_1000ft: 79.5,  copper_60c: 55,  copper_75c: 65,  copper_90c: 75,  aluminum_60c: 40,   aluminum_75c: 50,   aluminum_90c: 55 },
  { awg: '4',     area_kcmil: 41.74,  diameter_mils: 204.3, dc_resistance_ohms_per_1000ft: 0.308,   weight_lb_per_1000ft: 126.4, copper_60c: 70,  copper_75c: 85,  copper_90c: 95,  aluminum_60c: 55,   aluminum_75c: 65,   aluminum_90c: 75 },
  { awg: '3',     area_kcmil: 52.62,  diameter_mils: 229.4, dc_resistance_ohms_per_1000ft: 0.245,   weight_lb_per_1000ft: 159.3, copper_60c: 85,  copper_75c: 100, copper_90c: 115, aluminum_60c: 65,   aluminum_75c: 75,   aluminum_90c: 85 },
  { awg: '2',     area_kcmil: 66.36,  diameter_mils: 257.6, dc_resistance_ohms_per_1000ft: 0.194,   weight_lb_per_1000ft: 201.0, copper_60c: 95,  copper_75c: 115, copper_90c: 130, aluminum_60c: 75,   aluminum_75c: 90,   aluminum_90c: 100 },
  { awg: '1',     area_kcmil: 83.69,  diameter_mils: 289.3, dc_resistance_ohms_per_1000ft: 0.154,   weight_lb_per_1000ft: 253.3, copper_60c: 110, copper_75c: 130, copper_90c: 145, aluminum_60c: 85,   aluminum_75c: 100,  aluminum_90c: 115 },
  { awg: '1/0',   area_kcmil: 105.6,  diameter_mils: 325.0, dc_resistance_ohms_per_1000ft: 0.122,   weight_lb_per_1000ft: 319.5, copper_60c: 125, copper_75c: 150, copper_90c: 170, aluminum_60c: 100,  aluminum_75c: 120,  aluminum_90c: 135 },
  { awg: '2/0',   area_kcmil: 133.1,  diameter_mils: 364.8, dc_resistance_ohms_per_1000ft: 0.0967,  weight_lb_per_1000ft: 402.8, copper_60c: 145, copper_75c: 175, copper_90c: 195, aluminum_60c: 115,  aluminum_75c: 135,  aluminum_90c: 150 },
  { awg: '3/0',   area_kcmil: 167.8,  diameter_mils: 409.6, dc_resistance_ohms_per_1000ft: 0.0766,  weight_lb_per_1000ft: 508.0, copper_60c: 165, copper_75c: 200, copper_90c: 225, aluminum_60c: 130,  aluminum_75c: 155,  aluminum_90c: 175 },
  { awg: '4/0',   area_kcmil: 211.6,  diameter_mils: 460.0, dc_resistance_ohms_per_1000ft: 0.0608,  weight_lb_per_1000ft: 640.5, copper_60c: 195, copper_75c: 230, copper_90c: 260, aluminum_60c: 150,  aluminum_75c: 180,  aluminum_90c: 205 },
  { awg: '250',   area_kcmil: 250,    diameter_mils: 522.5, dc_resistance_ohms_per_1000ft: 0.0515,  weight_lb_per_1000ft: 770,   copper_60c: 215, copper_75c: 255, copper_90c: 290, aluminum_60c: 170,  aluminum_75c: 205,  aluminum_90c: 230 },
  { awg: '300',   area_kcmil: 300,    diameter_mils: 572.3, dc_resistance_ohms_per_1000ft: 0.0429,  weight_lb_per_1000ft: 925,   copper_60c: 240, copper_75c: 285, copper_90c: 320, aluminum_60c: 195,  aluminum_75c: 230,  aluminum_90c: 260 },
  { awg: '350',   area_kcmil: 350,    diameter_mils: 618.5, dc_resistance_ohms_per_1000ft: 0.0367,  weight_lb_per_1000ft: 1080,  copper_60c: 260, copper_75c: 310, copper_90c: 350, aluminum_60c: 210,  aluminum_75c: 250,  aluminum_90c: 280 },
  { awg: '400',   area_kcmil: 400,    diameter_mils: 661.6, dc_resistance_ohms_per_1000ft: 0.0321,  weight_lb_per_1000ft: 1235,  copper_60c: 280, copper_75c: 335, copper_90c: 380, aluminum_60c: 225,  aluminum_75c: 270,  aluminum_90c: 305 },
  { awg: '500',   area_kcmil: 500,    diameter_mils: 739.8, dc_resistance_ohms_per_1000ft: 0.0258,  weight_lb_per_1000ft: 1545,  copper_60c: 320, copper_75c: 380, copper_90c: 430, aluminum_60c: 260,  aluminum_75c: 310,  aluminum_90c: 350 },
  { awg: '600',   area_kcmil: 600,    diameter_mils: 813.0, dc_resistance_ohms_per_1000ft: 0.0214,  weight_lb_per_1000ft: 1850,  copper_60c: 350, copper_75c: 420, copper_90c: 475, aluminum_60c: 285,  aluminum_75c: 340,  aluminum_90c: 385 },
  { awg: '750',   area_kcmil: 750,    diameter_mils: 908.0, dc_resistance_ohms_per_1000ft: 0.0171,  weight_lb_per_1000ft: 2310,  copper_60c: 400, copper_75c: 475, copper_90c: 535, aluminum_60c: 320,  aluminum_75c: 385,  aluminum_90c: 435 },
];

// ─────────────────────────────────────────────────────────────────────────────
// NEC 240.4(D) — Small-conductor overcurrent protection rule.
// Limits maximum OCPD (breaker / fuse) on 14, 12, and 10 AWG regardless
// of higher 310.16 ampacity. Applies to general-purpose branch circuits;
// some specific applications (e.g., motors per Article 430) override.
// ─────────────────────────────────────────────────────────────────────────────

export const NEC_240_4_D_MAX_OCPD: Record<string, number> = {
  '14': 15,
  '12': 20,
  '10': 30,
};

// ─────────────────────────────────────────────────────────────────────────────
// NEC 250.122 — Minimum equipment grounding conductor (EGC) size.
// Sized by upstream OCPD rating, not by load.
// Each row: ocpd amps -> { copper EGC AWG, aluminum EGC AWG }.
// ─────────────────────────────────────────────────────────────────────────────

export interface GroundingRow {
  ocpd_amps: number;
  copper_awg: string;
  aluminum_awg: string;
}

export const NEC_250_122: GroundingRow[] = [
  { ocpd_amps: 15,   copper_awg: '14',   aluminum_awg: '12' },
  { ocpd_amps: 20,   copper_awg: '12',   aluminum_awg: '10' },
  { ocpd_amps: 30,   copper_awg: '10',   aluminum_awg: '8' },
  { ocpd_amps: 40,   copper_awg: '10',   aluminum_awg: '8' },
  { ocpd_amps: 60,   copper_awg: '10',   aluminum_awg: '8' },
  { ocpd_amps: 100,  copper_awg: '8',    aluminum_awg: '6' },
  { ocpd_amps: 200,  copper_awg: '6',    aluminum_awg: '4' },
  { ocpd_amps: 300,  copper_awg: '4',    aluminum_awg: '2' },
  { ocpd_amps: 400,  copper_awg: '3',    aluminum_awg: '1' },
  { ocpd_amps: 500,  copper_awg: '2',    aluminum_awg: '1/0' },
  { ocpd_amps: 600,  copper_awg: '1',    aluminum_awg: '2/0' },
  { ocpd_amps: 800,  copper_awg: '1/0',  aluminum_awg: '3/0' },
  { ocpd_amps: 1000, copper_awg: '2/0',  aluminum_awg: '4/0' },
  { ocpd_amps: 1200, copper_awg: '3/0',  aluminum_awg: '250' },
  { ocpd_amps: 1600, copper_awg: '4/0',  aluminum_awg: '350' },
  { ocpd_amps: 2000, copper_awg: '250',  aluminum_awg: '400' },
];

// ─────────────────────────────────────────────────────────────────────────────
// NEC 310.15(B)(1) (formerly 310.15(B)(2)(a)) — Ambient-temperature
// correction factors for ampacities at 30°C (86°F). Multiply the 310.16
// ampacity by this factor.
// ─────────────────────────────────────────────────────────────────────────────

export interface TempCorrectionRow {
  ambient_min_c: number;
  ambient_max_c: number;
  ambient_min_f: number;
  ambient_max_f: number;
  factor_60c: number;
  factor_75c: number;
  factor_90c: number;
}

export const NEC_310_15_TEMP_CORRECTION: TempCorrectionRow[] = [
  { ambient_min_c: 10, ambient_max_c: 15, ambient_min_f: 50,  ambient_max_f: 59,  factor_60c: 1.29, factor_75c: 1.20, factor_90c: 1.15 },
  { ambient_min_c: 16, ambient_max_c: 20, ambient_min_f: 61,  ambient_max_f: 68,  factor_60c: 1.22, factor_75c: 1.15, factor_90c: 1.11 },
  { ambient_min_c: 21, ambient_max_c: 25, ambient_min_f: 70,  ambient_max_f: 77,  factor_60c: 1.15, factor_75c: 1.11, factor_90c: 1.08 },
  { ambient_min_c: 26, ambient_max_c: 30, ambient_min_f: 79,  ambient_max_f: 86,  factor_60c: 1.00, factor_75c: 1.00, factor_90c: 1.00 },
  { ambient_min_c: 31, ambient_max_c: 35, ambient_min_f: 88,  ambient_max_f: 95,  factor_60c: 0.91, factor_75c: 0.94, factor_90c: 0.96 },
  { ambient_min_c: 36, ambient_max_c: 40, ambient_min_f: 97,  ambient_max_f: 104, factor_60c: 0.82, factor_75c: 0.88, factor_90c: 0.91 },
  { ambient_min_c: 41, ambient_max_c: 45, ambient_min_f: 106, ambient_max_f: 113, factor_60c: 0.71, factor_75c: 0.82, factor_90c: 0.87 },
  { ambient_min_c: 46, ambient_max_c: 50, ambient_min_f: 115, ambient_max_f: 122, factor_60c: 0.58, factor_75c: 0.75, factor_90c: 0.82 },
  { ambient_min_c: 51, ambient_max_c: 55, ambient_min_f: 124, ambient_max_f: 131, factor_60c: 0.41, factor_75c: 0.67, factor_90c: 0.76 },
  { ambient_min_c: 56, ambient_max_c: 60, ambient_min_f: 133, ambient_max_f: 140, factor_60c: 0,    factor_75c: 0.58, factor_90c: 0.71 },
];

// ─────────────────────────────────────────────────────────────────────────────
// NEC 310.15(C)(1) — Adjustment factors for more than three current-
// carrying conductors in a raceway or cable. Multiply ampacity by this.
// ─────────────────────────────────────────────────────────────────────────────

export const NEC_310_15_C_1_BUNDLING: Array<{ conductors: string; factor: number }> = [
  { conductors: '4–6',     factor: 0.80 },
  { conductors: '7–9',     factor: 0.70 },
  { conductors: '10–20',   factor: 0.50 },
  { conductors: '21–30',   factor: 0.45 },
  { conductors: '31–40',   factor: 0.40 },
  { conductors: '41+',     factor: 0.35 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Convenience: the most-common projection — 75°C copper terminations,
// which is what nearly every residential and commercial breaker /
// receptacle / panel is rated for. Includes the NEC 240.4(D) max OCPD
// for the small-conductor rule. This is what readers usually want.
// ─────────────────────────────────────────────────────────────────────────────

export interface CommonReferenceRow {
  awg: string;
  copper_ampacity_75c: number | null;
  aluminum_ampacity_75c: number | null;
  /** Max breaker per NEC 240.4(D); null if not capped (only 14/12/10). */
  max_ocpd: number | null;
}

export const NEC_COMMON_REFERENCE_75C: CommonReferenceRow[] = NEC_310_16.map((row) => ({
  awg: row.awg,
  copper_ampacity_75c: row.copper_75c,
  aluminum_ampacity_75c: row.aluminum_75c,
  max_ocpd: NEC_240_4_D_MAX_OCPD[row.awg] ?? null,
}));
