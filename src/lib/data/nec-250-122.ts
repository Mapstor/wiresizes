export interface GroundingConductorEntry {
  overcurrentDevice: number;
  copper: string;
  aluminum: string;
}

export const NEC_TABLE_250_122: GroundingConductorEntry[] = [
  { overcurrentDevice: 15, copper: '14', aluminum: '12' },
  { overcurrentDevice: 20, copper: '12', aluminum: '10' },
  { overcurrentDevice: 30, copper: '10', aluminum: '8' },
  { overcurrentDevice: 40, copper: '10', aluminum: '8' },
  { overcurrentDevice: 60, copper: '10', aluminum: '8' },
  { overcurrentDevice: 100, copper: '8', aluminum: '6' },
  { overcurrentDevice: 200, copper: '6', aluminum: '4' },
  { overcurrentDevice: 300, copper: '4', aluminum: '2' },
  { overcurrentDevice: 400, copper: '3', aluminum: '1' },
  { overcurrentDevice: 500, copper: '2', aluminum: '1/0' },
  { overcurrentDevice: 600, copper: '1', aluminum: '2/0' },
  { overcurrentDevice: 800, copper: '1/0', aluminum: '3/0' },
  { overcurrentDevice: 1000, copper: '2/0', aluminum: '4/0' },
];

export function getGroundingConductorSize(
  breakerAmps: number,
  material: 'copper' | 'aluminum' = 'copper'
): string {
  for (const entry of NEC_TABLE_250_122) {
    if (breakerAmps <= entry.overcurrentDevice) return entry[material];
  }
  return NEC_TABLE_250_122[NEC_TABLE_250_122.length - 1][material];
}