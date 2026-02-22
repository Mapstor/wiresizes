/**
 * NEC Table 310.16 - Allowable Ampacities of Insulated Conductors
 * 
 * For conductors rated 0 through 2000 volts, not more than 3 current-carrying
 * conductors in raceway, cable, or earth.
 * 
 * Based on ambient temperature of 30°C (86°F)
 */

export interface AmpacityEntry {
  awg: string;
  kcmil?: number;
  area_mm2: number;
  diameter_mm: number;
  copper: {
    temp60C: number | null;
    temp75C: number | null;
    temp90C: number | null;
  };
  aluminum: {
    temp60C: number | null;
    temp75C: number | null;
    temp90C: number | null;
  };
}

export const NEC_TABLE_310_16: AmpacityEntry[] = [
  {
    awg: '14',
    area_mm2: 2.08,
    diameter_mm: 1.63,
    copper: { temp60C: 15, temp75C: 20, temp90C: 25 },
    aluminum: { temp60C: null, temp75C: null, temp90C: null },
  },
  {
    awg: '12',
    area_mm2: 3.31,
    diameter_mm: 2.05,
    copper: { temp60C: 20, temp75C: 25, temp90C: 30 },
    aluminum: { temp60C: 15, temp75C: 20, temp90C: 25 },
  },
  {
    awg: '10',
    area_mm2: 5.26,
    diameter_mm: 2.59,
    copper: { temp60C: 30, temp75C: 35, temp90C: 40 },
    aluminum: { temp60C: 25, temp75C: 30, temp90C: 35 },
  },
  {
    awg: '8',
    area_mm2: 8.37,
    diameter_mm: 3.26,
    copper: { temp60C: 40, temp75C: 50, temp90C: 55 },
    aluminum: { temp60C: 35, temp75C: 40, temp90C: 45 },
  },
  {
    awg: '6',
    area_mm2: 13.3,
    diameter_mm: 4.11,
    copper: { temp60C: 55, temp75C: 65, temp90C: 75 },
    aluminum: { temp60C: 40, temp75C: 50, temp90C: 55 },
  },
  {
    awg: '4',
    area_mm2: 21.2,
    diameter_mm: 5.19,
    copper: { temp60C: 70, temp75C: 85, temp90C: 95 },
    aluminum: { temp60C: 55, temp75C: 65, temp90C: 75 },
  },
  {
    awg: '3',
    area_mm2: 26.7,
    diameter_mm: 5.83,
    copper: { temp60C: 85, temp75C: 100, temp90C: 115 },
    aluminum: { temp60C: 65, temp75C: 75, temp90C: 85 },
  },
  {
    awg: '2',
    area_mm2: 33.6,
    diameter_mm: 6.54,
    copper: { temp60C: 95, temp75C: 115, temp90C: 130 },
    aluminum: { temp60C: 75, temp75C: 90, temp90C: 100 },
  },
  {
    awg: '1',
    area_mm2: 42.4,
    diameter_mm: 7.35,
    copper: { temp60C: 110, temp75C: 130, temp90C: 145 },
    aluminum: { temp60C: 85, temp75C: 100, temp90C: 115 },
  },
  {
    awg: '1/0',
    area_mm2: 53.5,
    diameter_mm: 8.25,
    copper: { temp60C: 125, temp75C: 150, temp90C: 170 },
    aluminum: { temp60C: 100, temp75C: 120, temp90C: 135 },
  },
  {
    awg: '2/0',
    area_mm2: 67.4,
    diameter_mm: 9.27,
    copper: { temp60C: 145, temp75C: 175, temp90C: 195 },
    aluminum: { temp60C: 115, temp75C: 135, temp90C: 150 },
  },
  {
    awg: '3/0',
    area_mm2: 85.0,
    diameter_mm: 10.4,
    copper: { temp60C: 165, temp75C: 200, temp90C: 225 },
    aluminum: { temp60C: 130, temp75C: 155, temp90C: 175 },
  },
  {
    awg: '4/0',
    area_mm2: 107,
    diameter_mm: 11.7,
    copper: { temp60C: 195, temp75C: 230, temp90C: 260 },
    aluminum: { temp60C: 150, temp75C: 180, temp90C: 205 },
  },
  {
    awg: '250',
    kcmil: 250,
    area_mm2: 127,
    diameter_mm: 12.7,
    copper: { temp60C: 215, temp75C: 255, temp90C: 290 },
    aluminum: { temp60C: 170, temp75C: 205, temp90C: 230 },
  },
  {
    awg: '300',
    kcmil: 300,
    area_mm2: 152,
    diameter_mm: 13.9,
    copper: { temp60C: 240, temp75C: 285, temp90C: 320 },
    aluminum: { temp60C: 190, temp75C: 230, temp90C: 260 },
  },
  {
    awg: '350',
    kcmil: 350,
    area_mm2: 177,
    diameter_mm: 15.0,
    copper: { temp60C: 260, temp75C: 310, temp90C: 350 },
    aluminum: { temp60C: 210, temp75C: 250, temp90C: 280 },
  },
  {
    awg: '400',
    kcmil: 400,
    area_mm2: 203,
    diameter_mm: 16.1,
    copper: { temp60C: 280, temp75C: 335, temp90C: 380 },
    aluminum: { temp60C: 225, temp75C: 270, temp90C: 305 },
  },
  {
    awg: '500',
    kcmil: 500,
    area_mm2: 253,
    diameter_mm: 18.0,
    copper: { temp60C: 320, temp75C: 380, temp90C: 430 },
    aluminum: { temp60C: 260, temp75C: 310, temp90C: 350 },
  },
  {
    awg: '600',
    kcmil: 600,
    area_mm2: 304,
    diameter_mm: 19.7,
    copper: { temp60C: 350, temp75C: 420, temp90C: 475 },
    aluminum: { temp60C: 285, temp75C: 340, temp90C: 385 },
  },
  {
    awg: '750',
    kcmil: 750,
    area_mm2: 380,
    diameter_mm: 22.0,
    copper: { temp60C: 385, temp75C: 460, temp90C: 520 },
    aluminum: { temp60C: 315, temp75C: 375, temp90C: 425 },
  },
];

/**
 * Get ampacity for a specific wire size and material
 */
export function getAmpacity(
  awg: string,
  material: 'copper' | 'aluminum',
  tempRating: 60 | 75 | 90 = 75
): number | null {
  const entry = NEC_TABLE_310_16.find(e => e.awg === awg);
  if (!entry) return null;
  
  const key = `temp${tempRating}C` as keyof typeof entry.copper;
  return entry[material][key];
}

/**
 * Find minimum wire size for given amperage
 */
export function getMinWireSize(
  amps: number,
  material: 'copper' | 'aluminum',
  tempRating: 60 | 75 | 90 = 75
): string | null {
  const key = `temp${tempRating}C` as keyof AmpacityEntry['copper'];
  
  for (const entry of NEC_TABLE_310_16) {
    const ampacity = entry[material][key];
    if (ampacity && ampacity >= amps) {
      return entry.awg;
    }
  }
  
  return null; // No wire large enough
}

/**
 * Get wire diameter for visualization
 */
export function getWireDiameter(awg: string): number | null {
  const entry = NEC_TABLE_310_16.find(e => e.awg === awg);
  return entry?.diameter_mm ?? null;
}

/**
 * Get all wire sizes (AWG values only)
 */
export function getAllWireSizes(): string[] {
  return NEC_TABLE_310_16.map(entry => entry.awg);
}