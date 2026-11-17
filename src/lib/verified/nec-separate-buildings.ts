// data/verified/nec-225-2023.json and data/verified/nec-cable-rules-2023.json (WSZ-029): the 2023 values the 100 A guide
// states about a feeder to a separate building (225.39) and about NM cable (334.80). Each throws at import if its rule is
// not VERIFIED-2023, so a page can never print a value whose status changed.
import outbuildings from '../../../data/verified/nec-225-2023.json';
import cables from '../../../data/verified/nec-cable-rules-2023.json';

function verified<T extends { ref: string; status: string }>(rules: T[], ref: string): T {
  const rule = rules.find((r) => r.ref === ref);
  if (!rule || !rule.status.startsWith('VERIFIED-2023')) throw new Error(`${ref} is not VERIFIED-2023 in data/verified`);
  return rule;
}

const r225_39 = verified(outbuildings.rules as { ref: string; status: string; values: Record<string, unknown> }[], '225.39');
const values = r225_39.values.values_2023 as {
  A_one_circuit_A: number;
  B_two_2wire_circuits_A: number;
  C_one_family_dwelling_A: number;
  C_wires: number;
  D_all_others_A: number;
};

/** 225.39 (2023): the least rating of a separate building's feeder or branch-circuit disconnecting means, A. */
export const DISCONNECT_MIN_A = {
  oneCircuit: values.A_one_circuit_A,
  twoCircuits: values.B_two_2wire_circuits_A,
  oneFamilyDwelling: values.C_one_family_dwelling_A,
  oneFamilyDwellingWires: values.C_wires,
  allOthers: values.D_all_others_A,
};

const r334_80 = verified(cables.rules as { ref: string; status: string; values: Record<string, unknown> }[], '334.80');

/** 334.80 (2023): NM and NMC cable at the 60 °C column; the 90 °C rating only as the start of corrections. */
export const NM_CABLE = {
  maxColumnC: r334_80.values.max_column_c as number,
  correctionsFromC: r334_80.values.derating_from_column_c as number,
};
