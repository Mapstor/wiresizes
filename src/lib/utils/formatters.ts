export function formatAwg(awg: string): string {
  if (awg.includes('/0')) return `#${awg} AWG`;
  if (parseInt(awg) >= 250) return `${awg} kcmil`;
  return `#${awg} AWG`;
}

export function formatVoltageDrop(percent: number): string {
  return `${percent.toFixed(2)}%`;
}

export function formatDistance(feet: number): string {
  return `${feet.toLocaleString()} ft`;
}

export function formatAmps(amps: number): string {
  return `${amps.toLocaleString()}A`;
}

export function formatVoltage(volts: number): string {
  return `${volts}V`;
}

export function formatMaterial(material: 'copper' | 'aluminum'): string {
  return material === 'copper' ? 'Copper' : 'Aluminum';
}

export function formatPhase(phase: 'single' | 'three'): string {
  return phase === 'single' ? 'Single-Phase' : 'Three-Phase';
}

export function getVoltageDropStatus(percent: number): 'success' | 'warning' | 'error' {
  if (percent <= 3) return 'success';
  if (percent <= 5) return 'warning';
  return 'error';
}

export function formatNumber(num: number, decimals: number = 0): string {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}