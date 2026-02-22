export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateAmps(amps: number): ValidationResult {
  if (isNaN(amps)) return { isValid: false, error: 'Enter a valid number' };
  if (amps <= 0) return { isValid: false, error: 'Must be greater than 0' };
  if (amps > 1200) return { isValid: false, error: 'Maximum is 1200A' };
  return { isValid: true };
}

export function validateDistance(distance: number): ValidationResult {
  if (isNaN(distance)) return { isValid: false, error: 'Enter a valid number' };
  if (distance <= 0) return { isValid: false, error: 'Must be greater than 0' };
  if (distance > 5000) return { isValid: false, error: 'Maximum is 5000 ft' };
  return { isValid: true };
}

export function validateVoltage(voltage: number): ValidationResult {
  const valid = [12, 24, 48, 120, 208, 240, 277, 480, 600];
  if (!valid.includes(voltage)) return { isValid: false, error: `Must be: ${valid.join(', ')}V` };
  return { isValid: true };
}

export function validateWatts(watts: number): ValidationResult {
  if (isNaN(watts)) return { isValid: false, error: 'Enter a valid number' };
  if (watts < 0) return { isValid: false, error: 'Cannot be negative' };
  return { isValid: true };
}