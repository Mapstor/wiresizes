/**
 * Wire Physical Properties
 * 
 * Resistance values at 20°C (68°F)
 * Resistance increases approximately 0.4% per °C above 20°C
 */

export interface WireProperty {
  awg: string;
  diameter_in: number;
  diameter_mm: number;
  area_cmil: number;
  area_mm2: number;
  resistance_copper_ohm_per_1000ft: number;
  resistance_aluminum_ohm_per_1000ft: number;
  weight_copper_lb_per_1000ft: number;
  weight_aluminum_lb_per_1000ft: number;
}

export const WIRE_PROPERTIES: WireProperty[] = [
  {
    awg: '14',
    diameter_in: 0.0641,
    diameter_mm: 1.63,
    area_cmil: 4110,
    area_mm2: 2.08,
    resistance_copper_ohm_per_1000ft: 2.525,
    resistance_aluminum_ohm_per_1000ft: 4.148,
    weight_copper_lb_per_1000ft: 12.43,
    weight_aluminum_lb_per_1000ft: 3.899,
  },
  {
    awg: '12',
    diameter_in: 0.0808,
    diameter_mm: 2.05,
    area_cmil: 6530,
    area_mm2: 3.31,
    resistance_copper_ohm_per_1000ft: 1.588,
    resistance_aluminum_ohm_per_1000ft: 2.609,
    weight_copper_lb_per_1000ft: 19.77,
    weight_aluminum_lb_per_1000ft: 6.200,
  },
  {
    awg: '10',
    diameter_in: 0.1019,
    diameter_mm: 2.59,
    area_cmil: 10380,
    area_mm2: 5.26,
    resistance_copper_ohm_per_1000ft: 0.999,
    resistance_aluminum_ohm_per_1000ft: 1.641,
    weight_copper_lb_per_1000ft: 31.43,
    weight_aluminum_lb_per_1000ft: 9.858,
  },
  {
    awg: '8',
    diameter_in: 0.1285,
    diameter_mm: 3.26,
    area_cmil: 16510,
    area_mm2: 8.37,
    resistance_copper_ohm_per_1000ft: 0.628,
    resistance_aluminum_ohm_per_1000ft: 1.032,
    weight_copper_lb_per_1000ft: 50.01,
    weight_aluminum_lb_per_1000ft: 15.68,
  },
  {
    awg: '6',
    diameter_in: 0.1620,
    diameter_mm: 4.11,
    area_cmil: 26240,
    area_mm2: 13.3,
    resistance_copper_ohm_per_1000ft: 0.395,
    resistance_aluminum_ohm_per_1000ft: 0.649,
    weight_copper_lb_per_1000ft: 79.46,
    weight_aluminum_lb_per_1000ft: 24.92,
  },
  {
    awg: '4',
    diameter_in: 0.2043,
    diameter_mm: 5.19,
    area_cmil: 41740,
    area_mm2: 21.2,
    resistance_copper_ohm_per_1000ft: 0.249,
    resistance_aluminum_ohm_per_1000ft: 0.409,
    weight_copper_lb_per_1000ft: 126.3,
    weight_aluminum_lb_per_1000ft: 39.62,
  },
  {
    awg: '3',
    diameter_in: 0.2294,
    diameter_mm: 5.83,
    area_cmil: 52620,
    area_mm2: 26.7,
    resistance_copper_ohm_per_1000ft: 0.197,
    resistance_aluminum_ohm_per_1000ft: 0.324,
    weight_copper_lb_per_1000ft: 159.3,
    weight_aluminum_lb_per_1000ft: 49.97,
  },
  {
    awg: '2',
    diameter_in: 0.2576,
    diameter_mm: 6.54,
    area_cmil: 66360,
    area_mm2: 33.6,
    resistance_copper_ohm_per_1000ft: 0.156,
    resistance_aluminum_ohm_per_1000ft: 0.257,
    weight_copper_lb_per_1000ft: 200.9,
    weight_aluminum_lb_per_1000ft: 63.03,
  },
  {
    awg: '1',
    diameter_in: 0.2893,
    diameter_mm: 7.35,
    area_cmil: 83690,
    area_mm2: 42.4,
    resistance_copper_ohm_per_1000ft: 0.124,
    resistance_aluminum_ohm_per_1000ft: 0.204,
    weight_copper_lb_per_1000ft: 253.3,
    weight_aluminum_lb_per_1000ft: 79.45,
  },
  {
    awg: '1/0',
    diameter_in: 0.3249,
    diameter_mm: 8.25,
    area_cmil: 105600,
    area_mm2: 53.5,
    resistance_copper_ohm_per_1000ft: 0.0983,
    resistance_aluminum_ohm_per_1000ft: 0.162,
    weight_copper_lb_per_1000ft: 319.5,
    weight_aluminum_lb_per_1000ft: 100.2,
  },
  {
    awg: '2/0',
    diameter_in: 0.3648,
    diameter_mm: 9.27,
    area_cmil: 133100,
    area_mm2: 67.4,
    resistance_copper_ohm_per_1000ft: 0.0779,
    resistance_aluminum_ohm_per_1000ft: 0.128,
    weight_copper_lb_per_1000ft: 402.8,
    weight_aluminum_lb_per_1000ft: 126.3,
  },
  {
    awg: '3/0',
    diameter_in: 0.4096,
    diameter_mm: 10.4,
    area_cmil: 167800,
    area_mm2: 85.0,
    resistance_copper_ohm_per_1000ft: 0.0618,
    resistance_aluminum_ohm_per_1000ft: 0.102,
    weight_copper_lb_per_1000ft: 507.8,
    weight_aluminum_lb_per_1000ft: 159.3,
  },
  {
    awg: '4/0',
    diameter_in: 0.4600,
    diameter_mm: 11.7,
    area_cmil: 211600,
    area_mm2: 107,
    resistance_copper_ohm_per_1000ft: 0.0490,
    resistance_aluminum_ohm_per_1000ft: 0.0806,
    weight_copper_lb_per_1000ft: 640.5,
    weight_aluminum_lb_per_1000ft: 200.9,
  },
  {
    awg: '250',
    diameter_in: 0.5000,
    diameter_mm: 12.7,
    area_cmil: 250000,
    area_mm2: 127,
    resistance_copper_ohm_per_1000ft: 0.0431,
    resistance_aluminum_ohm_per_1000ft: 0.0708,
    weight_copper_lb_per_1000ft: 756.8,
    weight_aluminum_lb_per_1000ft: 237.4,
  },
  {
    awg: '300',
    diameter_in: 0.5477,
    diameter_mm: 13.9,
    area_cmil: 300000,
    area_mm2: 152,
    resistance_copper_ohm_per_1000ft: 0.0360,
    resistance_aluminum_ohm_per_1000ft: 0.0590,
    weight_copper_lb_per_1000ft: 908.2,
    weight_aluminum_lb_per_1000ft: 284.8,
  },
  {
    awg: '350',
    diameter_in: 0.5916,
    diameter_mm: 15.0,
    area_cmil: 350000,
    area_mm2: 177,
    resistance_copper_ohm_per_1000ft: 0.0308,
    resistance_aluminum_ohm_per_1000ft: 0.0505,
    weight_copper_lb_per_1000ft: 1059.6,
    weight_aluminum_lb_per_1000ft: 332.3,
  },
  {
    awg: '400',
    diameter_in: 0.6325,
    diameter_mm: 16.1,
    area_cmil: 400000,
    area_mm2: 203,
    resistance_copper_ohm_per_1000ft: 0.0270,
    resistance_aluminum_ohm_per_1000ft: 0.0442,
    weight_copper_lb_per_1000ft: 1211.0,
    weight_aluminum_lb_per_1000ft: 379.8,
  },
  {
    awg: '500',
    diameter_in: 0.7071,
    diameter_mm: 18.0,
    area_cmil: 500000,
    area_mm2: 253,
    resistance_copper_ohm_per_1000ft: 0.0216,
    resistance_aluminum_ohm_per_1000ft: 0.0354,
    weight_copper_lb_per_1000ft: 1513.7,
    weight_aluminum_lb_per_1000ft: 474.7,
  },
];

/**
 * Get wire resistance per 1000 feet
 */
export function getWireResistance(
  awg: string,
  material: 'copper' | 'aluminum'
): number | null {
  const wire = WIRE_PROPERTIES.find(w => w.awg === awg);
  if (!wire) return null;
  
  return material === 'copper' 
    ? wire.resistance_copper_ohm_per_1000ft 
    : wire.resistance_aluminum_ohm_per_1000ft;
}

/**
 * Get wire weight per 1000 feet
 */
export function getWireWeight(
  awg: string,
  material: 'copper' | 'aluminum'
): number | null {
  const wire = WIRE_PROPERTIES.find(w => w.awg === awg);
  if (!wire) return null;
  
  return material === 'copper'
    ? wire.weight_copper_lb_per_1000ft
    : wire.weight_aluminum_lb_per_1000ft;
}

/**
 * Get wire diameter in millimeters
 */
export function getWireDiameterMM(awg: string): number | null {
  const wire = WIRE_PROPERTIES.find(w => w.awg === awg);
  return wire?.diameter_mm ?? null;
}

/**
 * Get wire area in circular mils
 */
export function getWireArea(awg: string): number | null {
  const wire = WIRE_PROPERTIES.find(w => w.awg === awg);
  return wire?.area_cmil ?? null;
}

/**
 * Convert circular mils to square millimeters
 */
export function cmilToMm2(cmil: number): number {
  return cmil * 0.0005067;
}

/**
 * Convert square millimeters to circular mils
 */
export function mm2ToCmil(mm2: number): number {
  return mm2 / 0.0005067;
}