#!/bin/bash

# Batch update calculator layout patterns
CALC_DIR="/Users/markovisic/Desktop/wirecalculators/wiresizes/src/components/calculators"

# Files that still need updating
files_to_update=(
  "BTUToWattsCalculator.tsx"
  "kVAToAmpsCalculator.tsx"
  "VoltsToAmpsCalculator.tsx"
  "KilowattsToAmpsCalculator.tsx"
  "GroundWireCalculator.tsx"
  "AmpacityCalculator.tsx"
  "BoxFillCalculator.tsx"
  "WelderCalculator.tsx"
)

echo "Updating layout patterns in calculator files..."

for file in "${files_to_update[@]}"; do
  filepath="$CALC_DIR/$file"
  
  if [ -f "$filepath" ]; then
    if grep -q "grid lg:grid-cols-2 gap-6 p-6" "$filepath"; then
      echo "Updating $file..."
      
      # Create backup
      cp "$filepath" "${filepath}.backup"
      
      # Update the main layout pattern
      sed -i.tmp 's/<div className="grid lg:grid-cols-2 gap-6 p-6">/<div className="max-w-4xl mx-auto p-6 space-y-8">/g' "$filepath"
      
      # Update inputs section
      sed -i.tmp 's/{\/\* Inputs Column \*\/}/{\/\* Inputs Section \*\/}/g' "$filepath"
      sed -i.tmp 's/<div className="space-y-6">/{\/\* After Inputs Column pattern \*\/}<div className="bg-gray-50 rounded-lg p-6"><h2 className="text-lg font-semibold mb-6">Input Parameters<\/h2><div className="grid md:grid-cols-2 gap-6">/g' "$filepath"
      
      # Clean up temporary files
      rm "${filepath}.tmp"
      
      echo "✓ Updated $file"
    else
      echo "- $file doesn't need update (pattern not found)"
    fi
  else
    echo "✗ $file not found"
  fi
done

echo "Batch layout update completed!"