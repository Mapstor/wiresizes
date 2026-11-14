// The copper spiral (D-33, DESIGN.md "Copper Spiral"): every AWG size from 4/0 to 40 as a cut solid conductor at one
// scale, diameters from awg.json, each disc one gauge step further along a logarithmic spiral that shrinks by the AWG
// step ratio, so neighbors touch. The AWG chart's main drawing (WSZ-025), also on the homepage (WSZ-027). The wide
// drawing (569 px) shows from 640 px, the narrow one (342 px, may shrink to 94 % at 320 px) below; they swap with
// visibility and size in globals.css (.spiral-wide, .spiral-narrow), never with display. One per page: the ids are fixed.
import { clsx } from 'clsx';
import { AWG_DEFINITION, AWG_TABLE, sizeKeyFromAwgName } from '@/lib/verified/awg';

const GEO = 'awg-geometry';
const STEP_RATIO = AWG_DEFINITION.ratio;

const STEP_ANGLE = Math.PI / 4; // one gauge per 45°: eight discs a turn, so the turns of the spiral do not touch

/** Every gauge from 4/0 to 40 as a cut solid conductor at one scale (diameters from awg.json), each disc placed one
 *  gauge step further along a logarithmic spiral. Discs touch their neighbors because each is the last one's diameter
 *  divided by the AWG step ratio, the same ratio the spiral shrinks by. */
function spiralLayout(pxPerIn: number) {
  const q = 1 / STEP_RATIO;
  const reach = (1 + q) / Math.sqrt(1 + q * q - 2 * q * Math.cos(STEP_ANGLE));
  const start = (150 * Math.PI) / 180;
  const raw = AWG_TABLE.map((r, i) => {
    const radius = (r.diameter_in * pxPerIn) / 2;
    const angle = start + i * STEP_ANGLE;
    return { key: sizeKeyFromAwgName(r.awg), x: reach * radius * Math.cos(angle), y: reach * radius * Math.sin(angle), radius };
  });
  const pad = 8;
  const minX = Math.min(...raw.map((d) => d.x - d.radius)) - pad;
  const minY = Math.min(...raw.map((d) => d.y - d.radius)) - pad;
  const width = Math.ceil(Math.max(...raw.map((d) => d.x + d.radius)) - minX + pad);
  const height = Math.ceil(Math.max(...raw.map((d) => d.y + d.radius)) - minY + pad);
  return { discs: raw.map((d) => ({ ...d, x: d.x - minX, y: d.y - minY })), width, height };
}

function Spiral({ narrow = false }: { narrow?: boolean }) {
  // Labels stay at 13 px or more on screen (§5: SVG labels below 13 px). The wide drawing (569 px) keeps its size; the
  // narrow one (342 px) shrinks only on screens under 342 px, to 94 % at 320 px, so its labels start at 14 px.
  const { discs, width, height } = spiralLayout(narrow ? 268 : 455);
  const fontMin = narrow ? 14 : 13;
  const fontMax = narrow ? 26 : 34;
  const id = narrow ? 'spiral-narrow' : 'spiral-wide';
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-labelledby={`${id}-title`}
      className={clsx('mx-auto block overflow-visible font-display', narrow ? 'spiral-narrow' : 'spiral-wide')}
      data-src={GEO}
    >
      <title id={`${id}-title`}>
        Cross sections of solid copper wire from 4/0 to 40 AWG drawn to one scale, each one gauge step smaller than the last, laid in a spiral
      </title>
      <defs>
        <linearGradient id={`${id}-cu`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#f3c193" />
          <stop offset="0.45" stopColor="#d6904f" />
          <stop offset="1" stopColor="#a95a26" />
        </linearGradient>
      </defs>
      {discs.map((d, i) => {
        const diameter = 2 * d.radius;
        const font = Math.max(fontMin, Math.min(fontMax, 0.36 * diameter));
        return (
          <g key={d.key} className="spiral-disc" style={{ animationDelay: `${(0.25 + i * 0.055).toFixed(3)}s` }}>
            <circle cx={d.x} cy={d.y} r={d.radius} fill={`url(#${id}-cu)`} stroke={diameter > 6 ? '#6b3112' : 'none'} strokeWidth={0.8} />
            {diameter > 14 && <circle cx={d.x} cy={d.y} r={d.radius - 2.2} fill="none" stroke="#ffe2c4" strokeOpacity={0.55} strokeWidth={1} />}
            {diameter > 10 && (
              <ellipse
                className="spiral-shine"
                style={{ animationDelay: `${(3.4 + i * 0.07).toFixed(2)}s` }}
                cx={d.x - d.radius * 0.28}
                cy={d.y - d.radius * 0.32}
                rx={d.radius * 0.5}
                ry={d.radius * 0.26}
                transform={`rotate(-32 ${d.x - d.radius * 0.28} ${d.y - d.radius * 0.32})`}
                fill="#fff6ec"
              />
            )}
            {diameter >= 21 && (
              <text x={d.x} y={d.y + font * 0.36} textAnchor="middle" fontSize={font} fontWeight={700} fill="#2a1205">
                <tspan data-size={d.key}>{d.key}</tspan>
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}


/** Both drawings in their wrapper, which reaches the screen edges on phones. */
export function CopperSpiral() {
  return (
    <div className="relative -mx-4 overflow-hidden sm:mx-0 sm:overflow-visible">
      <Spiral />
      <Spiral narrow />
    </div>
  );
}
