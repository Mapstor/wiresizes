/**
 * Wire Sizing Calculations
 * Based on NEC 2023 requirements
 */

import { getMinWireSize, getAmpacity, NEC_TABLE_310_16 } from '@/lib/data/nec-310-16';
import { getWireResistance, WIRE_PROPERTIES } from '@/lib/data/wire-properties';

// Types
export type WireMaterial = 'copper' | 'aluminum';
export type Phase = 'single' | 'three';
export type VoltageLevel = number;
export type TemperatureRating = 60 | 75 | 90;

export interface WireSizeInput {
  amps: number;
  distance: number; // one-way distance in feet
  voltage: VoltageLevel;
  material: WireMaterial;
  phase: Phase;
  temperatureRating?: TemperatureRating;
  maxVoltageDrop?: number; // percentage, default 3%
}

export interface WireSizeResult {
  awg: string;
  ampacity: number;
  voltageDrop: number;
  voltageDropPercent: number;
  isCompliant: boolean;
  groundWire: string;
  warnings: string[];
  necReference: string;
  recommendation: string;
}

export interface VoltageDropInput {
  awg: string;
  distance: number;
  amps: number;
  voltage: VoltageLevel;
  material: WireMaterial;
  phase: Phase;
}

export interface VoltageDropResult {
  voltageDrop: number;
  voltageDropPercent: number;
  voltageAtLoad: number;
  isAcceptable: boolean;
  recommendation: string;
}

/**
 * Calculate wire size based on amperage and distance
 */
export function calculateWireSize(input: WireSizeInput): WireSizeResult {
  const {
    amps,
    distance,
    voltage,
    material,
    phase,
    temperatureRating = 75,
    maxVoltageDrop = 3,
  } = input;

  const warnings: string[] = [];

  // Validate inputs
  if (amps <= 0) {
    return createErrorResult('Amperage must be greater than 0');
  }
  if (distance < 0) {
    return createErrorResult('Distance must be positive');
  }

  // Step 1: Get minimum wire size based on ampacity
  let awg = getMinWireSize(amps, material, temperatureRating);
  
  if (!awg) {
    return createErrorResult(`No wire size available for ${amps}A ${material}`);
  }

  // Step 2: Check voltage drop and upsize if needed (only if distance > 0)
  let vdResult: VoltageDropResult;
  
  if (distance === 0) {
    // For 0 distance, voltage drop is 0%
    vdResult = {
      voltageDrop: 0,
      voltageDropPercent: 0,
      voltageAtLoad: voltage,
      isAcceptable: true,
      recommendation: 'No voltage drop at 0 distance - size based on ampacity only',
    };
  } else {
    vdResult = calculateVoltageDrop({
      awg,
      distance,
      amps,
      voltage,
      material,
      phase,
    });
  }

  // Upsize wire if voltage drop exceeds maximum (only if distance > 0)
  let iterations = 0;
  const maxIterations = 20;

  while (distance > 0 && vdResult.voltageDropPercent > maxVoltageDrop && iterations < maxIterations) {
    const nextSize = getNextLargerWireSize(awg);
    if (!nextSize) {
      warnings.push(`Maximum wire size reached. Voltage drop is ${vdResult.voltageDropPercent.toFixed(2)}%`);
      break;
    }
    awg = nextSize;
    vdResult = calculateVoltageDrop({
      awg,
      distance,
      amps,
      voltage,
      material,
      phase,
    });
    iterations++;
  }

  // Get final ampacity
  const ampacity = getAmpacity(awg, material, temperatureRating) ?? 0;

  // Get ground wire size
  const groundWire = getGroundWireSize(amps);

  // Determine if compliant
  const isCompliant = ampacity >= amps && vdResult.voltageDropPercent <= maxVoltageDrop;

  // Add warnings if applicable
  if (distance > 0 && vdResult.voltageDropPercent > 3 && vdResult.voltageDropPercent <= 5) {
    warnings.push('Voltage drop exceeds 3% recommended maximum');
  }
  if (distance > 0 && vdResult.voltageDropPercent > 5) {
    warnings.push('Voltage drop exceeds 5% - consider parallel conductors');
  }
  if (distance === 0) {
    warnings.push('Wire sized for ampacity only - verify voltage drop for actual installation distance');
  }
  if (material === 'aluminum' && parseInt(awg) > 8) {
    warnings.push('Small aluminum conductors not recommended - consider copper');
  }

  // Generate recommendation
  const recommendation = generateRecommendation(awg, material, ampacity, vdResult.voltageDropPercent, distance);

  return {
    awg,
    ampacity,
    voltageDrop: vdResult.voltageDrop,
    voltageDropPercent: vdResult.voltageDropPercent,
    isCompliant,
    groundWire,
    warnings,
    necReference: 'NEC 310.16 (75°C column)',
    recommendation,
  };
}

/**
 * Calculate voltage drop for a given wire configuration
 * 
 * Formula (Single Phase): VD = (2 × K × I × D) / CM
 * Formula (Three Phase): VD = (1.732 × K × I × D) / CM
 * 
 * Where:
 *   K = Resistivity constant (12.9 for copper, 21.2 for aluminum)
 *   I = Current in amps
 *   D = One-way distance in feet
 *   CM = Circular mils of conductor
 */
export function calculateVoltageDrop(input: VoltageDropInput): VoltageDropResult {
  const { awg, distance, amps, voltage, material, phase } = input;

  // Get wire resistance per 1000 feet
  const resistance = getWireResistance(awg, material);
  
  if (!resistance) {
    return {
      voltageDrop: 0,
      voltageDropPercent: 0,
      voltageAtLoad: voltage,
      isAcceptable: false,
      recommendation: 'Invalid wire size',
    };
  }

  // Calculate voltage drop
  // VD = 2 × I × R × (D/1000) for single phase
  // VD = √3 × I × R × (D/1000) for three phase
  const multiplier = phase === 'single' ? 2 : Math.sqrt(3);
  const voltageDrop = multiplier * amps * resistance * (distance / 1000);
  const voltageDropPercent = (voltageDrop / voltage) * 100;
  const voltageAtLoad = voltage - voltageDrop;

  // Determine if acceptable (< 3% recommended, < 5% maximum)
  const isAcceptable = voltageDropPercent <= 3;

  // Generate recommendation
  let recommendation: string;
  if (voltageDropPercent <= 2) {
    recommendation = 'Excellent - well within NEC recommendations';
  } else if (voltageDropPercent <= 3) {
    recommendation = 'Good - meets NEC 3% recommendation';
  } else if (voltageDropPercent <= 5) {
    recommendation = 'Marginal - exceeds 3% but within 5% limit';
  } else {
    recommendation = 'Poor - consider upsizing wire';
  }

  return {
    voltageDrop: Math.round(voltageDrop * 100) / 100,
    voltageDropPercent: Math.round(voltageDropPercent * 100) / 100,
    voltageAtLoad: Math.round(voltageAtLoad * 100) / 100,
    isAcceptable,
    recommendation,
  };
}

/**
 * Get ground wire size based on circuit breaker rating
 * Per NEC Table 250.122
 */
export function getGroundWireSize(breakerAmps: number, material: WireMaterial = 'copper'): string {
  const groundTable: Array<{ maxAmps: number; copper: string; aluminum: string }> = [
    { maxAmps: 15, copper: '14', aluminum: '12' },
    { maxAmps: 20, copper: '12', aluminum: '10' },
    { maxAmps: 30, copper: '10', aluminum: '8' },
    { maxAmps: 40, copper: '10', aluminum: '8' },
    { maxAmps: 60, copper: '10', aluminum: '8' },
    { maxAmps: 100, copper: '8', aluminum: '6' },
    { maxAmps: 200, copper: '6', aluminum: '4' },
    { maxAmps: 300, copper: '4', aluminum: '2' },
    { maxAmps: 400, copper: '3', aluminum: '1' },
    { maxAmps: 500, copper: '2', aluminum: '1/0' },
    { maxAmps: 600, copper: '1', aluminum: '2/0' },
    { maxAmps: 800, copper: '1/0', aluminum: '3/0' },
    { maxAmps: 1000, copper: '2/0', aluminum: '4/0' },
    { maxAmps: 1200, copper: '3/0', aluminum: '250' },
  ];

  for (const entry of groundTable) {
    if (breakerAmps <= entry.maxAmps) {
      return entry[material];
    }
  }

  return material === 'copper' ? '3/0' : '250';
}

/**
 * Get the next larger wire size
 */
function getNextLargerWireSize(currentAwg: string): string | null {
  const wireSizes = WIRE_PROPERTIES.map(w => w.awg);
  const currentIndex = wireSizes.indexOf(currentAwg);
  
  if (currentIndex === -1 || currentIndex === wireSizes.length - 1) {
    return null;
  }
  
  return wireSizes[currentIndex + 1];
}

/**
 * Create error result
 */
function createErrorResult(message: string): WireSizeResult {
  return {
    awg: 'N/A',
    ampacity: 0,
    voltageDrop: 0,
    voltageDropPercent: 0,
    isCompliant: false,
    groundWire: 'N/A',
    warnings: [message],
    necReference: '',
    recommendation: message,
  };
}

/**
 * Generate recommendation text
 */
function generateRecommendation(
  awg: string,
  material: WireMaterial,
  ampacity: number,
  voltageDropPercent: number,
  distance: number
): string {
  const materialName = material === 'copper' ? 'Copper' : 'Aluminum';
  
  if (distance === 0) {
    return `Use #${awg} AWG ${materialName} wire (rated ${ampacity}A). This size meets ampacity requirements. Calculate voltage drop when actual distance is known.`;
  } else if (voltageDropPercent <= 3) {
    return `Use #${awg} AWG ${materialName} wire (rated ${ampacity}A). This selection meets NEC requirements with ${voltageDropPercent.toFixed(1)}% voltage drop.`;
  } else {
    return `Use #${awg} AWG ${materialName} wire (rated ${ampacity}A). Note: Voltage drop is ${voltageDropPercent.toFixed(1)}% which exceeds the 3% recommendation.`;
  }
}

/**
 * AWG to numeric value for comparison (smaller AWG = larger wire)
 */
export function awgToNumeric(awg: string): number {
  if (awg.includes('/0')) {
    // 1/0 = -1, 2/0 = -2, etc.
    const count = parseInt(awg.split('/')[0]);
    return -count;
  }
  if (parseInt(awg) >= 250) {
    // kcmil sizes: larger number = larger wire
    return -100 - parseInt(awg);
  }
  return parseInt(awg);
}

/**
 * Compare two AWG sizes
 * Returns negative if a is larger than b, positive if b is larger
 */
export function compareAwg(a: string, b: string): number {
  return awgToNumeric(a) - awgToNumeric(b);
}