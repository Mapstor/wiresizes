'use client';

import { motion } from 'framer-motion';

// Wire diameters in mm (used to calculate relative sizes)
const WIRE_DIAMETERS: Record<string, number> = {
  '14': 1.63,
  '12': 2.05,
  '10': 2.59,
  '8': 3.26,
  '6': 4.11,
  '4': 5.19,
  '3': 5.83,
  '2': 6.54,
  '1': 7.35,
  '1/0': 8.25,
  '2/0': 9.27,
  '3/0': 10.4,
  '4/0': 11.7,
  '250': 12.7,
  '300': 13.9,
  '350': 15.0,
  '400': 16.1,
  '500': 18.0,
};

interface WireVisualizationProps {
  awg: string;
  material: 'copper' | 'aluminum';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function WireVisualization({
  awg,
  material,
  showLabel = true,
  size = 'md',
  className = '',
}: WireVisualizationProps) {
  const diameter = WIRE_DIAMETERS[awg] || 5;
  const maxDiameter = 18; // 500 kcmil
  const minDisplaySize = 20;
  const maxDisplaySize = size === 'lg' ? 120 : size === 'md' ? 80 : 50;
  
  // Scale diameter to display size
  const displaySize = Math.max(
    minDisplaySize,
    (diameter / maxDiameter) * maxDisplaySize
  );

  const colors = {
    copper: {
      fill: '#d97706',
      stroke: '#92400e',
      gradient: ['#fae6c8', '#d97706', '#78350f'],
    },
    aluminum: {
      fill: '#94a3b8',
      stroke: '#475569',
      gradient: ['#e2e8f0', '#94a3b8', '#334155'],
    },
  };

  const { fill, stroke, gradient } = colors[material];
  const svgSize = size === 'lg' ? 160 : size === 'md' ? 120 : 80;
  const center = svgSize / 2;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="drop-shadow-md"
      >
        <defs>
          {/* Radial gradient for 3D effect */}
          <radialGradient
            id={`wire-gradient-${awg}-${material}`}
            cx="30%"
            cy="30%"
            r="70%"
          >
            <stop offset="0%" stopColor={gradient[0]} />
            <stop offset="50%" stopColor={gradient[1]} />
            <stop offset="100%" stopColor={gradient[2]} />
          </radialGradient>
          
          {/* Shadow filter */}
          <filter id="wire-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Background circle (outline) */}
        <circle
          cx={center}
          cy={center}
          r={displaySize / 2 + 2}
          fill="none"
          stroke={stroke}
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Main wire cross-section */}
        <motion.circle
          cx={center}
          cy={center}
          fill={`url(#wire-gradient-${awg}-${material})`}
          stroke={stroke}
          strokeWidth="2"
          filter="url(#wire-shadow)"
          initial={{ r: 10 }}
          animate={{ r: displaySize / 2 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
          }}
        />

        {/* Center highlight */}
        <motion.circle
          cx={center - displaySize * 0.15}
          cy={center - displaySize * 0.15}
          fill="white"
          opacity="0.3"
          initial={{ r: 2 }}
          animate={{ r: displaySize * 0.15 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
          }}
        />
      </svg>

      {showLabel && (
        <div className="text-center">
          <div className="font-mono text-lg font-bold text-neutral-900">
            #{awg} AWG
          </div>
          <div className="text-sm text-neutral-500 capitalize">
            {material}
          </div>
          <div className="text-xs text-neutral-400">
            {diameter.toFixed(2)} mm
          </div>
        </div>
      )}
    </div>
  );
}