#!/bin/bash

# Script to update calculator layout patterns
CALC_DIR="/Users/markovisic/Desktop/wirecalculators/wiresizes/src/components/calculators"

# List of files to update (exclude WireSizeCalculator.tsx as it's already done)
files=(
  "VoltageDropCalculator.tsx"
  "ConduitFillCalculator.tsx" 
  "AmpsToWattsCalculator.tsx"
  "WattsToAmpsCalculator.tsx"
  "OhmsLawCalculator.tsx"
  "BTUToWattsCalculator.tsx"
  "kVAToAmpsCalculator.tsx"
  "VoltsToAmpsCalculator.tsx"
  "KilowattsToAmpsCalculator.tsx"
  "HorsepowerToAmpsCalculator.tsx"
  "GroundWireCalculator.tsx"
  "AmpacityCalculator.tsx"
  "BoxFillCalculator.tsx"
  "CircuitBreakerCalculator.tsx"
  "LowVoltageCalculator.tsx"
  "MotorCircuitCalculator.tsx"
  "ServiceEntranceCalculator.tsx"
  "ResidentialLoadCalculator.tsx"
  "WireResistanceCalculator.tsx"
  "WelderCalculator.tsx"
  "PoolPumpCalculator.tsx"
  "WellPumpCalculator.tsx"
  "AirConditionerCalculator.tsx"
  "DryerCalculator.tsx"
  "RangeCalculator.tsx"
  "GarageSubpanelCalculator.tsx"
  "RVHookupCalculator.tsx"
  "ElectricalLoadCalculator.tsx"
  "ThreePhaseCalculator.tsx"
  "EVChargerCalculator.tsx"
  "HotTubCalculator.tsx"
  "EVChargerWireSizeCalculator.tsx"
  "HotTubWireSizeCalculator.tsx"
  "GarageSubpanelWireSizeCalculator.tsx"
)

echo "Files needing layout updates:"
for file in "${files[@]}"; do
  if [ -f "$CALC_DIR/$file" ]; then
    if grep -q "grid lg:grid-cols-2.*gap-6 p-6" "$CALC_DIR/$file"; then
      echo "- $file (needs update)"
    else
      echo "- $file (already updated or different pattern)"
    fi
  else
    echo "- $file (not found)"
  fi
done