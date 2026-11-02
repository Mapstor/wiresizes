'use client';

import { formatFixed } from '@/lib/calculations/format';
import { diameterMm, formatSize } from '@/lib/calculations/sizes';

interface WireVisualizationProps {
  awg: string;
  material: 'copper' | 'aluminum';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Diameters from awg.json; kcmil sizes as a solid round conductor, √cmil mils × 0.0254 mm
const REFERENCE_DIAMETER_MM = diameterMm('500') ?? 18;

export function WireVisualization({
  awg,
  material,
  showLabel = true,
  size = 'md',
  className = '',
}: WireVisualizationProps) {
  const diameter = diameterMm(awg);
  const minDisplaySize = 20;
  const maxDisplaySize = size === 'lg' ? 120 : size === 'md' ? 80 : 50;

  // Scale diameter to display size; sizes above 500 kcmil draw at the largest circle
  const displaySize = Math.min(
    maxDisplaySize,
    Math.max(minDisplaySize, ((diameter ?? 0) / REFERENCE_DIAMETER_MM) * maxDisplaySize),
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

  const { stroke, gradient } = colors[material];
  const svgSize = size === 'lg' ? 160 : size === 'md' ? 120 : 80;
  const center = svgSize / 2;
  const gradientId = `wire-gradient-${awg.replace(/[^0-9A-Za-z]/g, '-')}-${material}`;

  if (diameter === null) return null;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="drop-shadow-md"
        aria-hidden="true"
      >
        <defs>
          {/* Radial gradient for 3D effect */}
          <radialGradient id={gradientId} cx="30%" cy="30%" r="70%">
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
        <circle
          cx={center}
          cy={center}
          r={displaySize / 2}
          fill={`url(#${gradientId})`}
          stroke={stroke}
          strokeWidth="2"
          filter="url(#wire-shadow)"
        />

        {/* Center highlight */}
        <circle
          cx={center - displaySize * 0.15}
          cy={center - displaySize * 0.15}
          r={displaySize * 0.15}
          fill="white"
          opacity="0.3"
        />
      </svg>

      {showLabel && (
        <div className="text-center">
          <div className="font-mono text-lg font-bold text-neutral-900">
            {formatSize(awg)}
          </div>
          <div className="text-sm text-neutral-500 capitalize">
            {material}
          </div>
          <div className="text-xs text-neutral-400">
            {formatFixed(diameter, 2)} mm
          </div>
        </div>
      )}
    </div>
  );
}
