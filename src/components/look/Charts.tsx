// Charts in the look (WSZ-028, DESIGN.md "Charts"; the dataviz method): every value from a data module, every number
// inside an element whose data-src names its source, a table on the same page with the same values. Marks grow, draw
// or appear as the chart scrolls into view (globals.css .viz-grow, .viz-draw, .viz-pop; CSS only, none under reduced
// motion), and a mark's value shows while the pointer is on it (.viz-mark, .viz-tip). Colors, validated with the dataviz
// palette script on white: copper #a95a26 and aluminum #2f6aa3 for the two materials (The Material Color Rule), an
// ordinal copper ramp for the 60, 75 and 90 °C columns, an ordinal gray ramp for NEC editions. Text stays ink.
// Wide and phone versions swap by visibility at 768 px (.swap-md-*), so text stays at 13 px or more on screen.
import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { Num } from '@/components/content/Num';
import { Size } from '@/components/content/Size';
import { Val } from '@/components/content/Val';
import { areaRatio } from '@/lib/calculations/awg-geometry';
import { AWG_TABLE, sizeKeyFromAwgName } from '@/lib/verified/awg';
import { AMBIENT_ROWS } from '@/lib/verified/nec-310-15-B-1-1';
import type { CorrectionColumn } from '@/lib/verified/nec-310-15-B-1-1';
import { ADJUSTMENT_ROWS } from '@/lib/verified/nec-310-15-C-1';
import { TABLE_310_16_ROWS } from '@/lib/verified/nec-310-16';
import { editionGroups, editionLabel, NEC_ADOPTION_DOMAIN, NOT_VERIFIED, stateName } from '@/lib/verified/nec-adoption';

export const COPPER = '#a95a26';
export const ALUMINUM = '#2f6aa3';
const TEMP_RAMP: Record<CorrectionColumn, string> = { f_60: '#c8803f', f_75: '#a95a26', f_90: '#6b3112' };
const INK = '#111111';
const MUTED = '#555555';
const GRID = '#ebe7e2';
const CONNECT = '#c4bdb5';

const GEO = 'awg-geometry';
const RES = 'conductor-resistance-20c';
const AMP = 'nec-310-16';
const COR = 'nec-310-15-corrections';
const CALC = 'calc:awg-geometry';
const ADOPT = NEC_ADOPTION_DOMAIN;

/** A legend entry: a short line or dot in the series color beside its name in ink. */
function Key({ x, y, color, children, dot = false }: { x: number; y: number; color: string; children: ReactNode; dot?: boolean }) {
  return (
    <g>
      {dot ? (
        <circle cx={x + 6} cy={y - 5} r={5} fill={color} />
      ) : (
        <line x1={x} x2={x + 18} y1={y - 5} y2={y - 5} stroke={color} strokeWidth={3} strokeLinecap="round" />
      )}
      <text x={x + (dot ? 17 : 25)} y={y} fontSize={14} fill={INK}>
        {children}
      </text>
    </g>
  );
}

/** A bar with a square end at the baseline and a 4 px rounded data end (dataviz mark spec). */
export function barPath(x: number, y: number, w: number, h: number): string {
  const r = Math.min(4, w / 2, h / 2);
  return `M${x},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x}Z`;
}

// ── Resistance per 1,000 ft, every gauge (AWG chart) ─────────────────────────────────────────────────────────────

const RES_ROWS = AWG_TABLE.map((r, i) => ({
  i,
  key: sizeKeyFromAwgName(r.awg),
  cu: r.r20_cu_ohm_per_1000ft,
  al: 'r20_al_ech19_ohm_per_1000ft_derived' in r ? (r.r20_al_ech19_ohm_per_1000ft_derived ?? null) : null,
}));
const LOG_MIN = Math.log10(0.03);
const LOG_MAX = Math.log10(2000);
const RES_TICKS = [0.1, 1, 10, 100, 1000];

function ResistancePlot({ narrow }: { narrow: boolean }) {
  const W = narrow ? 288 : 640;
  const H = narrow ? 330 : 380;
  const left = narrow ? 46 : 60;
  const right = narrow ? 14 : 92;
  const top = narrow ? 58 : 44;
  const bottom = 46;
  const pw = W - left - right;
  const ph = H - top - bottom;
  const n = RES_ROWS.length - 1;
  const x = (i: number) => left + (i / n) * pw;
  const y = (v: number) => top + ((LOG_MAX - Math.log10(v)) / (LOG_MAX - LOG_MIN)) * ph;
  const line = (pts: { i: number; v: number }[]) => pts.map((p, k) => `${k ? 'L' : 'M'}${x(p.i).toFixed(1)},${y(p.v).toFixed(1)}`).join('');
  const cuPts = RES_ROWS.map((r) => ({ i: r.i, v: r.cu }));
  const alPts = RES_ROWS.filter((r) => r.al !== null).map((r) => ({ i: r.i, v: r.al as number }));
  const tickKeys = narrow ? ['4/0', '10', '20', '30', '40'] : ['4/0', '1/0', '4', '8', '12', '16', '20', '24', '28', '32', '36', '40'];
  const at = (key: string) => RES_ROWS.find((r) => r.key === key) as (typeof RES_ROWS)[number];
  const p10 = at('10');
  const p20 = at('20');
  const lastCu = RES_ROWS[n];
  const lastAl = alPts[alPts.length - 1];
  const id = narrow ? 'res-chart-narrow' : 'res-chart-wide';
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby={`${id}-title`}
      className={clsx('viz-scope h-auto font-display', narrow ? 'swap-md-narrow max-w-[420px]' : 'swap-md-wide w-full max-w-[720px]')}
      data-src={GEO}
    >
      <title id={`${id}-title`}>
        Resistance per 1,000 feet at 20 °C of solid copper and of aluminum, every gauge from 4/0 to 40 AWG, on a logarithmic scale: a
        straight line, ten times higher every ten gauges
      </title>
      <Key x={left} y={narrow ? 18 : 22} color={COPPER}>
        Copper
      </Key>
      <Key x={narrow ? left : left + 100} y={narrow ? 40 : 22} color={ALUMINUM}>
        Aluminum EC-H19 (calculated)
      </Key>
      {RES_TICKS.map((t) => (
        <g key={t}>
          <line x1={left} x2={W - right} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth={1} />
          <text x={left - 8} y={y(t) + 4.5} textAnchor="end" fontSize={13} fill={MUTED}>
            <Num v={t} src={GEO} svg />
          </text>
        </g>
      ))}
      {!narrow && (
        <text x={left} y={top - 8} fontSize={13} fill={MUTED}>
          Ω per thousand feet, log scale
        </text>
      )}
      {tickKeys.map((k) => {
        const r = at(k);
        return (
          <text key={k} x={x(r.i)} y={H - bottom + 20} textAnchor="middle" fontSize={13} fill={MUTED}>
            <tspan data-size={k}>{k}</tspan>
          </text>
        );
      })}
      <text x={left + pw / 2} y={H - 8} textAnchor="middle" fontSize={13} fill={MUTED}>
        AWG, thick to thin
      </text>
      {/* ten gauge steps: ×10.16; it appears with the end values, once the lines are drawn */}
      <g className="viz-end-fade">
        <g aria-hidden="true">
          <line x1={x(p10.i)} x2={x(p20.i)} y1={y(p10.cu)} y2={y(p10.cu)} stroke={INK} strokeWidth={1} />
          <line x1={x(p20.i)} x2={x(p20.i)} y1={y(p10.cu)} y2={y(p20.cu)} stroke={INK} strokeWidth={1} />
        </g>
        <text x={x(p20.i) + 6} y={(y(p10.cu) + y(p20.cu)) / 2 + 4} fontSize={13} fontWeight={700} fill={INK}>
          <Num v={areaRatio(10)} src={CALC} format={{ fixed: 2 }} prefix="×" svg />
        </text>
        <text
          x={narrow ? x(p10.i) + 4 : (x(p10.i) + x(p20.i)) / 2}
          y={y(p10.cu) + 17}
          textAnchor={narrow ? 'start' : 'middle'}
          fontSize={13}
          fill={MUTED}
        >
          ten gauges
        </text>
      </g>
      <path d={line(alPts)} pathLength={1} fill="none" stroke={ALUMINUM} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" className="viz-draw" />
      <path d={line(cuPts)} pathLength={1} fill="none" stroke={COPPER} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" className="viz-draw" />
      <circle cx={x(lastCu.i)} cy={y(lastCu.cu)} r={4.5} fill={COPPER} stroke="#ffffff" strokeWidth={2} className="viz-end" />
      <circle cx={x(lastAl.i)} cy={y(lastAl.v)} r={4.5} fill={ALUMINUM} stroke="#ffffff" strokeWidth={2} className="viz-end" />
      {!narrow && (
        <g className="viz-end-fade">
          <text x={x(lastCu.i) + 10} y={y(lastCu.cu) + 4.5} fontSize={13} fill={INK}>
            <tspan data-size="40">40 AWG</tspan>
          </text>
          <text x={x(lastCu.i) + 10} y={y(lastCu.cu) + 21} fontSize={13} fill={MUTED} data-src={GEO}>
            <Val v={lastCu.cu} unit="Ω" src={GEO} svg />
          </text>
        </g>
      )}
      {/* the value of each gauge while the pointer is on it */}
      {RES_ROWS.map((r) => {
        const cx = x(r.i);
        const cy = y(r.cu);
        const leftSide = cx > left + pw * 0.55;
        return (
          <g key={r.key} className="viz-mark">
            <circle cx={cx} cy={cy} r={narrow ? 6 : 7} fill="transparent" />
            <g className="viz-tip" aria-hidden="true">
              <circle cx={cx} cy={cy} r={4} fill={COPPER} stroke="#ffffff" strokeWidth={2} />
              <rect x={leftSide ? cx - 138 : cx + 8} y={cy - 30} width={130} height={22} fill="#ffffff" stroke={INK} strokeWidth={1} />
              <text x={leftSide ? cx - 132 : cx + 14} y={cy - 14} fontSize={13} fill={INK}>
                <tspan data-size={r.key} fontWeight={700}>
                  {r.key}
                </tspan>
                {'  '}
                <Val v={r.cu} unit="Ω" src={GEO} svg />
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

/** Resistance per 1,000 ft at 20 °C for every gauge, copper (NIST) and aluminum (calculated), log scale. */
export function ResistanceChart() {
  return (
    <div data-src={RES}>
      <ResistancePlot narrow={false} />
      <ResistancePlot narrow />
    </div>
  );
}

// ── Copper and aluminum ampacity at 75 °C, 12 AWG to 2000 kcmil (Table 310.16) ───────────────────────────────────

const DUMBBELL_ROWS = TABLE_310_16_ROWS.filter((r) => r.cu_75 !== null && r.al_75 !== null) as {
  size: string;
  cu_75: number;
  al_75: number;
}[];
const AMP_TICKS = [0, 100, 200, 300, 400, 500, 600, 700];

function DumbbellPlot({ narrow }: { narrow: boolean }) {
  const W = narrow ? 288 : 640;
  const rowH = narrow ? 21 : 22;
  const left = narrow ? 82 : 96;
  const right = narrow ? 16 : 70;
  const top = narrow ? 62 : 52;
  const bottom = 40;
  const H = top + DUMBBELL_ROWS.length * rowH + bottom;
  const pw = W - left - right;
  const max = 700;
  const x = (v: number) => left + (v / max) * pw;
  const yRow = (k: number) => top + k * rowH + rowH / 2;
  const ticks = narrow ? [0, 200, 400, 600] : AMP_TICKS;
  const last = DUMBBELL_ROWS[DUMBBELL_ROWS.length - 1];
  const id = narrow ? 'amp-chart-narrow' : 'amp-chart-wide';
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby={`${id}-title`}
      className={clsx('h-auto font-display', narrow ? 'swap-md-narrow max-w-[420px]' : 'swap-md-wide w-full max-w-[720px]')}
      data-src={AMP}
    >
      <title id={`${id}-title`}>
        Allowable ampacity in the 75 °C column of 2023 NEC Table 310.16, copper and aluminum, for each size from 12 AWG to 2000 kcmil
      </title>
      {/* on a phone the two keys stack from the left edge, so the longer one fits the 288 px drawing */}
      <Key x={narrow ? 0 : left} y={narrow ? 18 : 20} color={COPPER} dot>
        Copper
      </Key>
      <Key x={narrow ? 0 : left + 92} y={narrow ? 40 : 20} color={ALUMINUM} dot>
        Aluminum or copper-clad aluminum
      </Key>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={top - 4} y2={H - bottom + 4} stroke={GRID} strokeWidth={1} />
          <text x={x(t)} y={H - bottom + 20} textAnchor="middle" fontSize={13} fill={MUTED}>
            <Num v={t} src={AMP} svg />
          </text>
        </g>
      ))}
      <text x={left + pw / 2} y={H - 4} textAnchor="middle" fontSize={13} fill={MUTED}>
        Amperes, 75 °C column
      </text>
      {DUMBBELL_ROWS.map((r, k) => {
        const cy = yRow(k);
        const tipX = narrow ? W - 150 : x(r.cu_75) + 170 > W ? x(r.al_75) - 160 : x(r.cu_75) + 10;
        return (
          <g key={r.size} className="viz-mark">
            <rect x={0} y={cy - rowH / 2} width={W} height={rowH} fill="transparent" />
            <text x={left - 10} y={cy + 4.5} textAnchor="end" fontSize={13} fill={INK}>
              <Size s={r.size} svg />
            </text>
            <line x1={x(r.al_75)} x2={x(r.cu_75)} y1={cy} y2={cy} stroke={CONNECT} strokeWidth={2} className="viz-grow" />
            <circle cx={x(r.al_75)} cy={cy} r={5} fill={ALUMINUM} stroke="#ffffff" strokeWidth={2} className="viz-pop" />
            <circle cx={x(r.cu_75)} cy={cy} r={5} fill={COPPER} stroke="#ffffff" strokeWidth={2} className="viz-pop" />
            <g className="viz-tip" aria-hidden="true">
              <rect x={tipX} y={cy - 11} width={narrow ? 146 : 150} height={22} fill="#ffffff" stroke={INK} strokeWidth={1} />
              <text x={tipX + 6} y={cy + 4.5} fontSize={13} fill={INK}>
                Cu <Val v={r.cu_75} unit="A" src={AMP} svg /> · Al <Val v={r.al_75} unit="A" src={AMP} svg />
              </text>
            </g>
          </g>
        );
      })}
      {!narrow && (
        <text x={x(last.cu_75) + 10} y={yRow(DUMBBELL_ROWS.length - 1) + 4.5} fontSize={13} fill={INK} className="viz-pop">
          <Val v={last.cu_75} unit="A" src={AMP} svg />
        </text>
      )}
    </svg>
  );
}

/** Copper beside aluminum at 75 °C, every size both columns list. */
export function AmpacityDumbbell() {
  return (
    <div>
      <DumbbellPlot narrow={false} />
      <DumbbellPlot narrow />
    </div>
  );
}

// ── Ambient temperature correction factors (Table 310.15(B)(1)(1)) ──────────────────────────────────────────────

const COLUMNS: { key: CorrectionColumn; label: string }[] = [
  { key: 'f_60', label: '60' },
  { key: 'f_75', label: '75' },
  { key: 'f_90', label: '90' },
];
/** Band k of the table spans 5 °C: "10 or less" is drawn from 5 to 10 °C, "81–85" from 80 to 85 °C. */
const bandStart = (k: number) => 5 + 5 * k;

function AmbientPlot({ narrow }: { narrow: boolean }) {
  const W = narrow ? 288 : 640;
  const H = narrow ? 300 : 340;
  const left = narrow ? 40 : 52;
  const right = narrow ? 12 : 40;
  const top = narrow ? 40 : 44;
  const bottom = 46;
  const pw = W - left - right;
  const ph = H - top - bottom;
  const x = (c: number) => left + ((c - 5) / 80) * pw;
  const y = (f: number) => top + ((1.35 - f) / (1.35 - 0.2)) * ph;
  const xTicks = narrow ? [10, 30, 50, 70] : [10, 20, 30, 40, 50, 60, 70, 80];
  const id = narrow ? 'ambient-chart-narrow' : 'ambient-chart-wide';
  const steps = (col: CorrectionColumn) => {
    let d = '';
    let end: { x: number; y: number } | null = null;
    AMBIENT_ROWS.forEach((r, k) => {
      const v = r[col];
      if (v === null) return;
      const x0 = x(bandStart(k));
      const x1 = x(bandStart(k) + 5);
      d += `${d ? 'L' : 'M'}${x0.toFixed(1)},${y(v).toFixed(1)}H${x1.toFixed(1)}`;
      end = { x: x1, y: y(v) };
    });
    return { d, end: end as { x: number; y: number } | null };
  };
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby={`${id}-title`}
      className={clsx('viz-scope h-auto font-display', narrow ? 'swap-md-narrow max-w-[420px]' : 'swap-md-wide w-full max-w-[720px]')}
      data-src={COR}
    >
      <title id={`${id}-title`}>
        Ambient temperature correction factors of 2023 NEC Table 310.15(B)(1)(1) for the 60, 75 and 90 °C columns: 1.00 at 26 to 30 °C, higher
        when it is cooler, lower when it is hotter, ending where a column is not permitted
      </title>
      {COLUMNS.map((c, k) => (
        <Key key={c.key} x={left + k * (narrow ? 80 : 92)} y={20} color={TEMP_RAMP[c.key]}>
          <Val v={Number(c.label)} unit="°C" src={AMP} svg />
        </Key>
      ))}
      {[0.4, 0.6, 0.8, 1.0, 1.2].map((t) => (
        <g key={t}>
          <line x1={left} x2={W - right} y1={y(t)} y2={y(t)} stroke={t === 1 ? MUTED : GRID} strokeWidth={1} />
          <text x={left - 8} y={y(t) + 4.5} textAnchor="end" fontSize={13} fill={MUTED}>
            <Num v={t} src={COR} format={{ fixed: 1 }} svg />
          </text>
        </g>
      ))}
      {xTicks.map((t) => (
        <text key={t} x={x(t)} y={H - bottom + 20} textAnchor="middle" fontSize={13} fill={MUTED}>
          <Val v={t} unit="°C" src={COR} svg />
        </text>
      ))}
      <text x={left + pw / 2} y={H - 6} textAnchor="middle" fontSize={13} fill={MUTED}>
        Ambient temperature
      </text>
      {COLUMNS.map((c) => {
        const { d, end } = steps(c.key);
        return (
          <g key={c.key}>
            <path d={d} pathLength={1} fill="none" stroke={TEMP_RAMP[c.key]} strokeWidth={2.5} strokeLinejoin="round" className="viz-draw" />
            {end && <circle cx={end.x} cy={end.y} r={4.5} fill={TEMP_RAMP[c.key]} stroke="#ffffff" strokeWidth={2} className="viz-end" />}
            {end && !narrow && (
              <text x={end.x} y={end.y + 22} textAnchor="middle" fontSize={13} fill={INK} className="viz-end-fade">
                <Val v={Number(c.label)} unit="°C" src={AMP} svg />
              </text>
            )}
          </g>
        );
      })}
      {/* each band's factors while the pointer is on it */}
      {AMBIENT_ROWS.map((r, k) => {
        const x0 = x(bandStart(k));
        const x1 = x(bandStart(k) + 5);
        const tipX = Math.min(Math.max(x0 - 40, 2), W - 132);
        return (
          <g key={r.key} className="viz-mark">
            <rect x={x0} y={top} width={x1 - x0} height={ph} fill="transparent" />
            <g className="viz-tip" aria-hidden="true">
              <line x1={(x0 + x1) / 2} x2={(x0 + x1) / 2} y1={top} y2={top + ph} stroke={INK} strokeWidth={1} />
              <rect x={tipX} y={top + 2} width={130} height={72} fill="#ffffff" stroke={INK} strokeWidth={1} />
              <text x={tipX + 8} y={top + 19} fontSize={13} fontWeight={700} fill={INK}>
                {r.key} °C
              </text>
              {COLUMNS.map((c, j) => (
                <text key={c.key} x={tipX + 8} y={top + 36 + j * 16} fontSize={13} fill={INK}>
                  {c.label}:{' '}
                  {r[c.key] === null ? 'not permitted' : <Num v={r[c.key] as number} src={COR} format={{ fixed: 2 }} svg />}
                </text>
              ))}
            </g>
          </g>
        );
      })}
    </svg>
  );
}

/** The three columns' correction factors against ambient temperature, one step per band of the table. */
export function AmbientChart() {
  return (
    <div>
      <AmbientPlot narrow={false} />
      <AmbientPlot narrow />
    </div>
  );
}

// ── More than three current-carrying conductors (Table 310.15(C)(1)) ────────────────────────────────────────────

function BundlingPlot({ narrow }: { narrow: boolean }) {
  const W = narrow ? 288 : 480;
  const left = narrow ? 96 : 110;
  const right = 52;
  const rowH = narrow ? 30 : 32;
  const barH = 16;
  const H = ADJUSTMENT_ROWS.length * rowH + 8;
  const pw = W - left - right;
  const x = (p: number) => (p / 100) * pw;
  const id = narrow ? 'bundling-narrow' : 'bundling-wide';
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby={`${id}-title`}
      className={clsx('h-auto font-display', narrow ? 'swap-md-narrow max-w-[420px]' : 'swap-md-wide w-full max-w-[480px]')}
      data-src={COR}
    >
      <title id={`${id}-title`}>
        Percent of the Table 310.16 ampacity allowed for more than three current-carrying conductors, from 2023 NEC Table 310.15(C)(1)
      </title>
      {ADJUSTMENT_ROWS.map((r, k) => {
        const top = 4 + k * rowH;
        const w = x(r.percent);
        return (
          <g key={r.key}>
            <text x={left - 10} y={top + barH / 2 + 4.5} textAnchor="end" fontSize={narrow ? 13 : 14} fill={INK}>
              {r.key}
            </text>
            {/* the track is the full Table 310.16 value (100 %); the bar is the part that remains */}
            <path d={barPath(left, top, pw, barH)} fill={GRID} />
            <path d={barPath(left, top, w, barH)} fill="#57514c" className="viz-grow" />
            <text x={W} y={top + barH / 2 + 4.5} textAnchor="end" fontSize={narrow ? 13 : 14} fontWeight={700} fill={INK}>
              <Val v={r.percent} unit="%" src={COR} svg />
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** The adjustment percent for each band of conductor counts, one bar each. */
export function BundlingBars() {
  return (
    <div>
      <BundlingPlot narrow={false} />
      <BundlingPlot narrow />
    </div>
  );
}

// ── NEC edition by state: a tile map (NEC Edition by State) ──────────────────────────────────────────────────────

/**
 * Each state's tile in an 11 × 8 grid that keeps the states roughly where they are on a map; Alaska sits above
 * Washington and Hawaii below California, so the grid is one column narrower and its tiles bigger on a phone.
 */
const TILES: Record<string, [number, number]> = {
  AK: [0, 0], ME: [10, 0],
  VT: [9, 1], NH: [10, 1],
  WA: [0, 2], ID: [1, 2], MT: [2, 2], ND: [3, 2], MN: [4, 2], IL: [5, 2], WI: [6, 2], MI: [7, 2], NY: [8, 2], RI: [9, 2], MA: [10, 2],
  OR: [0, 3], NV: [1, 3], WY: [2, 3], SD: [3, 3], IA: [4, 3], IN: [5, 3], OH: [6, 3], PA: [7, 3], NJ: [8, 3], CT: [9, 3],
  CA: [0, 4], UT: [1, 4], CO: [2, 4], NE: [3, 4], MO: [4, 4], KY: [5, 4], WV: [6, 4], VA: [7, 4], MD: [8, 4], DE: [9, 4],
  AZ: [1, 5], NM: [2, 5], KS: [3, 5], AR: [4, 5], TN: [5, 5], NC: [6, 5], SC: [7, 5], DC: [8, 5],
  OK: [3, 6], LA: [4, 6], MS: [5, 6], AL: [6, 6], GA: [7, 6],
  HI: [0, 7], TX: [3, 7], FL: [8, 7],
};

// The newest edition in copper (the page's story), the older ones in grays, darker for newer. Checked with the dataviz
// validator, all pairs: worst normal-vision ΔE 15.8, worst colorblind ΔE 10.3. The lightest gray is 2.7:1 on white, so
// every tile carries its state code and the table below the map lists each state (the validator's relief rule).
const EDITION_RAMP = [COPPER, '#2b2826', '#57514c', '#a39b93'];

/** The fill of an edition by its rank (0 = newest); local adoption and "not verified" are white with an ink outline. */
export function editionStyle(edition: string, newest: string[]): { fill: string; text: string; dashed?: boolean } {
  const rank = newest.indexOf(edition);
  if (edition === 'local') return { fill: '#ffffff', text: INK };
  if (edition === 'not-verified') return { fill: '#ffffff', text: MUTED, dashed: true };
  const fill = EDITION_RAMP[Math.min(rank, EDITION_RAMP.length - 1)];
  return { fill, text: fill === EDITION_RAMP[EDITION_RAMP.length - 1] ? INK : '#ffffff' };
}

function TilePlot({ narrow }: { narrow: boolean }) {
  const groups = editionGroups();
  const editions = groups.filter((g) => g.edition !== 'local').map((g) => g.edition);
  const byState = new Map<string, string>();
  for (const g of groups) for (const s of g.states) byState.set(s, g.edition);
  for (const n of NOT_VERIFIED) byState.set(n.state, 'not-verified');
  // the phone version is 285 px wide, so it fits a 320 px screen at full size; its codes keep 2 px clear of the tile edge
  const tile = narrow ? 25 : 46;
  const gap = narrow ? 1 : 2;
  const step = tile + gap;
  const W = 11 * step - gap;
  const mapH = 8 * step - gap;
  const legendTop = mapH + (narrow ? 22 : 30);
  // legend rows: the editions (the oldest ones together), local adoption, not verified
  const older = editions.slice(3);
  const legend: { key: string; label: ReactNode; count: number; style: { fill: string; text: string; dashed?: boolean } }[] = [
    ...editions.slice(0, 3).map((e) => ({
      key: e,
      label: editionLabel(e),
      count: groups.find((g) => g.edition === e)?.states.length ?? 0,
      style: editionStyle(e, editions),
    })),
    ...(older.length
      ? [
          {
            key: 'older',
            label: `${editionLabel(older[0])} or older`,
            count: older.reduce((n, e) => n + (groups.find((g) => g.edition === e)?.states.length ?? 0), 0),
            style: editionStyle(older[0], editions),
          },
        ]
      : []),
    { key: 'local', label: 'No statewide code', count: groups.find((g) => g.edition === 'local')?.states.length ?? 0, style: editionStyle('local', editions) },
    { key: 'not-verified', label: 'Not verified', count: NOT_VERIFIED.length, style: editionStyle('not-verified', editions) },
  ];
  const perRow = narrow ? 1 : 2;
  const colW = W / perRow;
  const legendRows = Math.ceil(legend.length / perRow);
  const H = legendTop + legendRows * 24;
  const id = narrow ? 'tiles-narrow' : 'tiles-wide';
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby={`${id}-title`}
      className={clsx('h-auto font-display', narrow ? 'swap-sm-narrow max-w-[420px]' : 'swap-sm-wide w-full max-w-[580px]')}
      data-src={ADOPT}
    >
      <title id={`${id}-title`}>
        The NEC edition each state and the District of Columbia has adopted, one square per state: the newest edition in copper, older ones in grays
      </title>
      {Object.entries(TILES).map(([state, [col, row]]) => {
        const edition = byState.get(state) ?? 'not-verified';
        const st = editionStyle(edition, editions);
        const tx = col * step;
        const ty = row * step;
        return (
          <g key={state} className="viz-pop">
            <title>{`${stateName(state)}: ${edition === 'not-verified' ? 'not verified' : edition === 'local' ? 'no statewide code' : editionLabel(edition)}`}</title>
            <rect
              x={tx + (st.fill === '#ffffff' ? 0.5 : 0)}
              y={ty + (st.fill === '#ffffff' ? 0.5 : 0)}
              width={tile - (st.fill === '#ffffff' ? 1 : 0)}
              height={tile - (st.fill === '#ffffff' ? 1 : 0)}
              fill={st.fill}
              stroke={st.fill === '#ffffff' ? INK : 'none'}
              strokeWidth={1}
              strokeDasharray={st.dashed ? '3 2' : undefined}
            />
            <text
              x={tx + tile / 2}
              y={ty + tile / 2 + (narrow ? 4.5 : 5.5)}
              textAnchor="middle"
              fontSize={narrow ? 13 : 15}
              fontWeight={700}
              letterSpacing={narrow ? '-0.03em' : '-0.02em'}
              fill={st.text}
            >
              {state}
            </text>
          </g>
        );
      })}
      {legend.map((l, k) => {
        const lx = (k % perRow) * colW;
        const ly = legendTop + Math.floor(k / perRow) * 24;
        return (
          <g key={l.key}>
            <rect
              x={lx + 0.5}
              y={ly - 13.5}
              width={15}
              height={15}
              fill={l.style.fill}
              stroke={l.style.fill === '#ffffff' ? INK : 'none'}
              strokeDasharray={l.style.dashed ? '3 2' : undefined}
            />
            <text x={lx + 22} y={ly} fontSize={13.5} fill={INK}>
              {l.label} (<Num v={l.count} src={ADOPT} svg />)
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Every state's adopted edition on one picture; the state table on the same page has each record. */
export function EditionTileMap() {
  return (
    <div>
      <TilePlot narrow={false} />
      <TilePlot narrow />
    </div>
  );
}

