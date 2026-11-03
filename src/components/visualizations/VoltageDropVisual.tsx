'use client';

import { useMemo } from 'react';
import { Val } from '@/components/content/Val';
import { Size } from '@/components/content/Size';
import { DEFAULT_VD_TARGET_PCT, ENGINE_ID, targetTitle, VD_FORMAT } from '@/lib/calculations/voltage-drop';

const CALC = `calc:${ENGINE_ID}`;

interface VoltageDropVisualProps {
  sourceVoltage: number;
  loadVoltage: number;
  dropPercent: number;
  distance: number;
  wireSize?: string;  // Add wire size prop
  /** The reader's voltage-drop target in percent. */
  targetPct?: number;
}

export function VoltageDropVisual({
  sourceVoltage,
  loadVoltage,
  dropPercent,
  distance,
  wireSize = '12',  // Default to 12 AWG
  targetPct = DEFAULT_VD_TARGET_PCT,
}: VoltageDropVisualProps) {
  const meetsTarget = dropPercent <= targetPct;

  const gradientColors = meetsTarget ? ['#22c55e', '#86efac'] : ['#f59e0b', '#fcd34d'];
  const textColor = meetsTarget ? '#15803d' : '#b45309';

  // Calculate wire length based on distance (min 100px, max 260px)
  const wireLength = useMemo(() => {
    const minLength = 100;
    const maxLength = 260;
    // Scale distance: 0-2000 ft maps to minLength-maxLength
    const scaledLength = minLength + (distance / 2000) * (maxLength - minLength);
    return Math.min(Math.max(scaledLength, minLength), maxLength);
  }, [distance]);

  // Calculate wire thickness based on AWG size
  const wireThickness = useMemo(() => {
    // Map AWG sizes to visual thickness in pixels
    const sizeMap: Record<string, number> = {
      '18': 3,
      '16': 4,
      '14': 5,
      '12': 6,
      '10': 8,
      '8': 10,
      '6': 12,
      '4': 14,
      '3': 15,
      '2': 16,
      '1': 17,
      '1/0': 18,
      '2/0': 20,
      '3/0': 22,
      '4/0': 24,
      '250': 26,
      '300': 28,
      '350': 30,
      '400': 32,
      '500': 35,
    };
    // Sizes above 500 kcmil draw at the 500 kcmil thickness
    return sizeMap[wireSize] ?? (Number(wireSize) > 500 ? 35 : 6);
  }, [wireSize]);

  // Calculate positions based on wire length
  const loadX = 70 + wireLength;
  const midX = 70 + wireLength / 2;

  return (
    <div className="bg-neutral-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-6">
        Voltage Drop Visualization
      </h3>

      <svg viewBox="0 0 400 120" className="w-full max-w-lg mx-auto">
        <defs>
          <linearGradient id="voltage-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradientColors[0]} />
            <stop offset="100%" stopColor={gradientColors[1]} />
          </linearGradient>
          
          {/* Animated gradient showing voltage loss */}
          <linearGradient id="voltage-loss-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e40af">
              <animate attributeName="stop-color" 
                values={`#1e40af;${gradientColors[0]};${gradientColors[1]}`}
                dur="2s" 
                repeatCount="indefinite" />
            </stop>
            <stop offset={`${100 - dropPercent}%`} stopColor={gradientColors[0]} />
            <stop offset="100%" stopColor={gradientColors[1]} />
          </linearGradient>
        </defs>

        {/* Panel (source) */}
        <rect x="10" y="30" width="60" height="60" rx="4" fill="#1e40af" />
        <text x="40" y="65" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
          PANEL
        </text>
        <text x="40" y="110" textAnchor="middle" fill="#1e40af" fontSize="12" fontWeight="bold">
          <Val v={sourceVoltage} unit="V" src="input" svg />
        </text>

        {/* Wire with gradient - responsive to distance and thickness */}
        <rect
          x="70"
          y={60 - wireThickness / 2}
          width={wireLength}
          height={wireThickness}
          rx={wireThickness / 4}
          fill="url(#voltage-gradient)"
        />
        
        {/* Wire size label */}
        <text 
          x={midX} 
          y={75 + wireThickness / 2} 
          textAnchor="middle" 
          fill="#525252" 
          fontSize="9"
          fontWeight="600"
        >
          <Size s={wireSize} svg />
        </text>
        
        {/* Animated electrons showing current flow - adjust to wire thickness */}
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cy={60}
            r={Math.min(wireThickness / 3, 4)}
            fill="white"
          >
            <animate
              attributeName="cx"
              from="70"
              to={loadX}
              dur="2s"
              begin={`${i * 0.7}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* Distance label */}
        <text x={midX} y="40" textAnchor="middle" fill="#737373" fontSize="10">
          <Val v={distance} unit="ft" src="input" svg />
        </text>

        {/* Voltage drop indicator - moved down and made bigger/bolder */}
        <text
          x={midX}
          y={95 + Math.max(wireThickness / 2, 8)}
          textAnchor="middle"
          fontSize="14"
          fontWeight="800"
          fill={textColor}
        >
          <Val v={dropPercent} unit="%" format={VD_FORMAT} src={CALC} svg /> drop
        </text>

        {/* Load (end) - position based on wire length */}
        <rect x={loadX} y="30" width="60" height="60" rx="4" fill="#64748b" />
        <text x={loadX + 30} y="65" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
          LOAD
        </text>
        <text x={loadX + 30} y="110" textAnchor="middle" fontSize="12" fontWeight="bold"
          fill={textColor}>
          <Val v={loadVoltage} unit="V" format={{ fixed: 1 }} src={CALC} svg />
        </text>
      </svg>

      {/* Status message */}
      <div className={`mt-4 p-3 rounded-lg text-center ${
        meetsTarget ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
      }`}>
        {targetTitle(meetsTarget)} (<Val v={targetPct} unit="%" src="input" />)
      </div>
    </div>
  );
}