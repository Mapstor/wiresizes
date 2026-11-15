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
import { resistanceAt, resistanceSig } from '@/lib/calculations/resistance';
import { AWG_TABLE, sizeKeyFromAwgName } from '@/lib/verified/awg';
import { AMBIENT_ROWS } from '@/lib/verified/nec-310-15-B-1-1';
import type { CorrectionColumn } from '@/lib/verified/nec-310-15-B-1-1';
import { ADJUSTMENT_ROWS } from '@/lib/verified/nec-310-15-C-1';
import { VOLTAGE_DROP_NOTE } from '@/lib/verified/nec-continuous-load-2023';
import { TABLE_310_16_ROWS, table31016 } from '@/lib/verified/nec-310-16';
import { decimalsAtSig } from '@/lib/calculations/format';
import { dropRun, lengthForDrop } from '@/lib/calculations/voltage-drop';
import { lowVoltageSize, lvLengthForDrop } from '@/lib/calculations/dc-sizing';
import { SQRT3, TP_WYE_SYSTEMS } from '@/lib/calculations/power';
import type { TpResult } from '@/lib/calculations/power';
import { COMPARE_KW, COMPARE_ROWS, GUIDE_EXAMPLES, PF_BARS, PF_BAR_ROWS, PF_EXAMPLE, WATTS_PER_AMP_ROWS } from '@/lib/power-guides';
import { areaCmil, conductor } from '@/lib/verified/awg';
import { TABLE_250_122_ROWS, egcRow } from '@/lib/verified/nec-250-122';
import { serviceLookup } from '@/lib/calculations/service-lookup';
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

// ── Resistance against conductor temperature (wire resistance calculator, WSZ-006) ─────────────────────────────

const TEMP_SIZE = '12';
const TEMP_POINTS = [-40, 90];
const TEMP_MARKS = [20, 75];
const RCALC = 'calc:resistance';

function TemperaturePlot({ narrow }: { narrow: boolean }) {
  const W = narrow ? 288 : 640;
  const H = narrow ? 300 : 330;
  const left = narrow ? 44 : 52;
  const right = narrow ? 14 : 64;
  const top = narrow ? 70 : 52;
  const bottom = 52;
  const pw = W - left - right;
  const ph = H - top - bottom;
  const tMin = -40;
  const tMax = 90;
  const yMin = 1;
  const yMax = 3.5;
  const x = (t: number) => left + ((t - tMin) / (tMax - tMin)) * pw;
  const y = (v: number) => top + ph - ((v - yMin) / (yMax - yMin)) * ph;
  const series = (['Cu', 'Al'] as const).map((m) => ({
    m,
    color: m === 'Cu' ? COPPER : ALUMINUM,
    pts: TEMP_POINTS.map((t) => ({ t, v: resistanceAt(TEMP_SIZE, m, t) as number })),
    marks: TEMP_MARKS.map((t) => ({ t, v: resistanceAt(TEMP_SIZE, m, t) as number })),
  }));
  const id = narrow ? 'temp-narrow' : 'temp-wide';
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby={`${id}-title`}
      className={clsx('viz-scope h-auto font-display', narrow ? 'swap-md-narrow max-w-[420px]' : 'swap-md-wide w-full max-w-[640px]')}
      data-src={RCALC}
    >
      <title id={`${id}-title`}>
        Resistance of 12 AWG copper and aluminum EC-H19 per 1,000 ft from −40 °C to 90 °C, calculated from NIST Handbooks 100 and 109
      </title>
      <Key x={0} y={18} color={COPPER}>
        <tspan data-size="12">12 AWG</tspan> copper
      </Key>
      <Key x={narrow ? 0 : 150} y={narrow ? 40 : 18} color={ALUMINUM}>
        <tspan data-size="12">12 AWG</tspan> aluminum EC-H19
      </Key>
      <text x={0} y={narrow ? 62 : 40} fontSize={13} fill={MUTED}>
        Ω per thousand feet
      </text>
      {[1, 1.5, 2, 2.5, 3, 3.5].map((v) => (
        <g key={v}>
          <line x1={left} x2={left + pw} y1={y(v)} y2={y(v)} stroke={GRID} strokeWidth={1} />
          <text x={left - 8} y={y(v) + 4.5} textAnchor="end" fontSize={13} fill={MUTED}>
            <Num v={v} src={RCALC} format={{ fixed: 1 }} svg />
          </text>
        </g>
      ))}
      {[-40, -20, 0, 20, 40, 60, 75, 90].filter((t) => !narrow || t % 40 === 0 || t === 20 || t === 75).map((t) => (
        <text key={t} x={x(t)} y={top + ph + 22} textAnchor="middle" fontSize={13} fill={TEMP_MARKS.includes(t) ? INK : MUTED} fontWeight={TEMP_MARKS.includes(t) ? 700 : 400}>
          <Val v={t} unit="°C" src={RCALC} svg />
        </text>
      ))}
      {TEMP_MARKS.map((t) => (
        <line key={t} x1={x(t)} x2={x(t)} y1={top} y2={top + ph} stroke={INK} strokeWidth={1} strokeDasharray="3 4" />
      ))}
      {series.map((s) => (
        <g key={s.m}>
          <path
            d={`M${x(s.pts[0].t).toFixed(1)},${y(s.pts[0].v).toFixed(1)}L${x(s.pts[1].t).toFixed(1)},${y(s.pts[1].v).toFixed(1)}`}
            pathLength={1}
            fill="none"
            stroke={s.color}
            strokeWidth={2}
            strokeLinecap="round"
            className="viz-draw"
          />
          {s.marks.map((p) => (
            <circle key={p.t} cx={x(p.t)} cy={y(p.v)} r={5} fill={s.color} stroke="#ffffff" strokeWidth={2} className="viz-end" />
          ))}
          {/* the lines rise to the right: aluminum's values sit above and left of their dots, copper's below and right */}
          {!narrow &&
            s.marks.map((p) => (
              <text
                key={p.t}
                x={x(p.t) + (s.m === 'Cu' ? 10 : -10)}
                y={y(p.v) + (s.m === 'Cu' ? 19 : -11)}
                textAnchor={s.m === 'Cu' ? 'start' : 'end'}
                fontSize={13}
                fill={INK}
                className="viz-end-fade"
              >
                <Val v={p.v} unit="Ω" src={RCALC} format={{ sig: resistanceSig(TEMP_SIZE, s.m) }} svg />
              </text>
            ))}
        </g>
      ))}
    </svg>
  );
}

/** 12 AWG copper and aluminum per 1,000 ft across the calculator's temperature range, 20 °C and 75 °C marked. */
export function TemperatureChart() {
  return (
    <div>
      <TemperaturePlot narrow={false} />
      <TemperaturePlot narrow />
    </div>
  );
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


// ── How far each size runs before a 3 % drop (voltage drop calculator, WSZ-006b) ───────────────────────────────────

const VD = 'calc:voltage-drop';
/** The scenario of the chart and of the distance table beside it: copper at 75 °C carrying its 60 °C ampacity. */
export const DROP_CHART = { targetPct: VOLTAGE_DROP_NOTE.feederPct, volts: 120, tempC: 75, column: 'cu_60' as const };
const DROP_CHART_SIZES = ['14', '12', '10', '8', '6', '4', '3', '2', '1', '1/0', '2/0', '3/0', '4/0'];

/** The one-way length in whole feet, rounded down, at which `size` copper carrying its 60 °C ampacity drops the target. */
export function dropDistanceFt(size: string, volts: number, circuit: 'single' | 'three'): { amps: number; ft: number } {
  const amps = table31016(size, DROP_CHART.column) as number;
  const ft = lengthForDrop({ size, material: 'Cu', amps, volts, circuit, tempC: DROP_CHART.tempC, sets: 1 }, DROP_CHART.targetPct) as number;
  return { amps, ft: Math.floor(ft) };
}

const DROP_ROWS = DROP_CHART_SIZES.map((size) => ({ size, ...dropDistanceFt(size, DROP_CHART.volts, 'single') }));

function DropDistancePlot({ narrow }: { narrow: boolean }) {
  const W = narrow ? 288 : 560;
  const left = narrow ? 62 : 74;
  const right = narrow ? 20 : 56;
  const top = 8;
  const rowH = narrow ? 26 : 28;
  const barH = narrow ? 14 : 16;
  const bottom = 42;
  const H = top + DROP_ROWS.length * rowH + bottom;
  const pw = W - left - right;
  const max = 175;
  const x = (v: number) => left + (v / max) * pw;
  const ticks = narrow ? [0, 50, 100, 150] : [0, 25, 50, 75, 100, 125, 150, 175];
  const id = narrow ? 'drop-distance-narrow' : 'drop-distance-wide';
  const first = DROP_ROWS[0];
  const last = DROP_ROWS[DROP_ROWS.length - 1];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby={`${id}-title`}
      className={clsx('h-auto font-display', narrow ? 'swap-md-narrow max-w-[420px]' : 'swap-md-wide w-full max-w-[560px]')}
      data-src={VD}
    >
      <title id={`${id}-title`}>
        {`One-way length at which the voltage drop reaches ${DROP_CHART.targetPct} % on a ${DROP_CHART.volts} V single-phase circuit, for copper from 14 AWG to 4/0 carrying its ampacity in the 60 °C column of NEC Table 310.16, conductor at ${DROP_CHART.tempC} °C: from ${first.ft} ft for 14 AWG to ${last.ft} ft for 4/0`}
      </title>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={top - 4} y2={H - bottom + 4} stroke={GRID} strokeWidth={1} />
          <text x={x(t)} y={H - bottom + 20} textAnchor="middle" fontSize={13} fill={MUTED}>
            <Num v={t} src={VD} svg />
          </text>
        </g>
      ))}
      <text x={left + pw / 2} y={H - 4} textAnchor="middle" fontSize={13} fill={MUTED}>
        Feet, one way
      </text>
      {DROP_ROWS.map((r, k) => {
        const y = top + k * rowH + (rowH - barH) / 2;
        const cy = y + barH / 2;
        const tipW = narrow ? 168 : 182;
        const tipX = Math.min(x(r.ft) + 8, W - tipW - 1);
        return (
          <g key={r.size} className="viz-mark">
            <rect x={0} y={top + k * rowH} width={W} height={rowH} fill="transparent" />
            <text x={left - 10} y={cy + 4.5} textAnchor="end" fontSize={13} fill={INK}>
              <Size s={r.size} svg />
            </text>
            <path d={barPath(left, y, x(r.ft) - left, barH)} fill={COPPER} className="viz-grow" />
            {(r === first || r === last) && (
              <text x={x(r.ft) + 6} y={cy + 4.5} fontSize={13} fontWeight={700} fill={INK} className="viz-pop">
                <Val v={r.ft} unit="ft" src={VD} svg />
              </text>
            )}
            <g className="viz-tip" aria-hidden="true">
              <rect x={tipX} y={cy - 11} width={tipW} height={22} fill="#ffffff" stroke={INK} strokeWidth={1} />
              <text x={tipX + 6} y={cy + 4.5} fontSize={13} fill={INK}>
                <Val v={r.ft} unit="ft" src={VD} svg /> at <Val v={r.amps} unit="A" src={AMP} svg />
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

/**
 * How far each copper size can run on a 120 V circuit before the drop reaches 3 %, carrying the current Table 310.16's
 * 60 °C column allows it, conductor at 75 °C. The page's distance table has the same values and the 240 V and
 * three-phase columns.
 */
export function DropDistanceChart() {
  return (
    <div>
      <DropDistancePlot narrow={false} />
      <DropDistancePlot narrow />
    </div>
  );
}

// ── Where the drop happens: out and back (voltage drop calculator's worked example) ──────────────────────────────

/** The worked example the diagram draws: golden case "3/0 AWG Cu, 200 A, 100 ft one way, 240 V, single-phase, 75 °C". */
export const SPLIT_EXAMPLE = dropRun({ size: '3/0', material: 'Cu', amps: 200, lengthFt: 100, volts: 240, circuit: 'single', tempC: 75, sets: 1 });

function SplitPlot({ narrow }: { narrow: boolean }) {
  const run = SPLIT_EXAMPLE;
  if (!run) throw new Error('SplitPlot: the worked example has no result');
  const W = narrow ? 288 : 560;
  const H = narrow ? 196 : 176;
  const boxW = narrow ? 66 : 104;
  const loadW = narrow ? 92 : 116;
  const boxTop = narrow ? 52 : 44;
  const boxH = narrow ? 92 : 88;
  const yOut = boxTop + 22;
  const yBack = boxTop + boxH - 22;
  const x1 = boxW;
  const x2 = W - loadW;
  const mid = (x1 + x2) / 2;
  const half = run.vdVolts / 2;
  const sig = { sig: run.sig };
  const load = { fixed: decimalsAtSig(run.vdVolts, run.sig) };
  const id = narrow ? 'drop-split-narrow' : 'drop-split-wide';
  const arrow = (x: number, y: number, dir: 1 | -1) => `M${x - 6 * dir},${y - 5}L${x},${y}L${x - 6 * dir},${y + 5}`;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby={`${id}-title`}
      className={clsx('h-auto font-display', narrow ? 'swap-md-narrow max-w-[420px]' : 'swap-md-wide w-full max-w-[560px]')}
      data-src={VD}
    >
      <title id={`${id}-title`}>
        {`A ${run.volts} V supply feeding a load ${run.lengthFt} ft away through two 3/0 AWG copper conductors at ${run.amps} A: each conductor drops half of the total, and the load gets the supply voltage less the total drop`}
      </title>
      {/* supply and load: square boxes in ink, the conductors as two ink lines with the current's direction */}
      <rect x={1} y={boxTop} width={boxW - 2} height={boxH} fill="#ffffff" stroke={INK} strokeWidth={2} />
      <text x={boxW / 2} y={boxTop + boxH / 2 - 4} textAnchor="middle" fontSize={13} fill={MUTED}>
        Supply
      </text>
      <text x={boxW / 2} y={boxTop + boxH / 2 + 15} textAnchor="middle" fontSize={14} fontWeight={700} fill={INK}>
        <Val v={run.volts} unit="V" src={VD} svg />
      </text>
      <rect x={x2 + 1} y={boxTop} width={loadW - 2} height={boxH} fill="#ffffff" stroke={INK} strokeWidth={2} />
      <text x={x2 + loadW / 2} y={boxTop + boxH / 2 - 4} textAnchor="middle" fontSize={13} fill={MUTED}>
        Load
      </text>
      <text x={x2 + loadW / 2} y={boxTop + boxH / 2 + 15} textAnchor="middle" fontSize={14} fontWeight={700} fill={INK}>
        <Val v={run.loadVolts} unit="V" src={VD} format={load} svg />
      </text>
      <line x1={x1} x2={x2} y1={yOut} y2={yOut} stroke={INK} strokeWidth={3} pathLength={1} className="viz-draw" />
      <line x1={x2} x2={x1} y1={yBack} y2={yBack} stroke={INK} strokeWidth={3} pathLength={1} className="viz-draw" />
      <path d={arrow(mid + 10, yOut, 1)} fill="none" stroke={INK} strokeWidth={2} />
      <path d={arrow(mid - 10, yBack, -1)} fill="none" stroke={INK} strokeWidth={2} />
      <text x={mid} y={yOut - 12} textAnchor="middle" fontSize={13} fill={INK} className="viz-pop">
        Out: drops <Val v={half} unit="V" src={VD} format={sig} svg />
      </text>
      <text x={mid} y={yBack + 22} textAnchor="middle" fontSize={13} fill={INK} className="viz-pop">
        Back: drops <Val v={half} unit="V" src={VD} format={sig} svg />
      </text>
      <text x={mid} y={(yOut + yBack) / 2 + 4.5} textAnchor="middle" fontSize={13} fill={MUTED}>
        <Val v={run.lengthFt} unit="ft" src={VD} svg /> one way
      </text>
      <text x={0} y={narrow ? 18 : 18} fontSize={13} fill={INK}>
        Total drop <Val v={run.vdVolts} unit="V" src={VD} format={sig} svg />, <Val v={run.vdPct} unit="%" src={VD} format={sig} svg />
      </text>
    </svg>
  );
}

/** The worked example drawn: a supply, two conductors and a load, the drop shared by the two conductors. */
export function DropSplitDiagram() {
  return (
    <div>
      <SplitPlot narrow={false} />
      <SplitPlot narrow />
    </div>
  );
}

// ── Low voltage: the same load at 12, 24 and 48 V, drawn to one scale (low voltage calculator, WSZ-006c) ───────────

const DC = 'calc:dc-sizing';
/** The scenario of the drawing: golden case "12 V, 400 W, 40 ft one way, 2% drop, copper at 75 °C", at three voltages. */
export const DISC_SCENARIO = { watts: 400, lengthFt: 40, dropPct: 2, tempC: 75, volts: [12, 24, 48] };

export const DISC_ROWS = DISC_SCENARIO.volts.map((volts) => {
  const r = lowVoltageSize({ volts, amps: DISC_SCENARIO.watts / volts, lengthFt: DISC_SCENARIO.lengthFt, dropPct: DISC_SCENARIO.dropPct, tempC: DISC_SCENARIO.tempC });
  if (!r?.resultSize) throw new Error(`DISC_ROWS: no size at ${volts} V`);
  const diameterIn = (conductor(r.resultSize)?.diameterMm ?? 0) / 25.4;
  return { volts, amps: r.amps, cmil: r.requiredCmil, size: r.resultSize, diameterIn };
});

function DiscPlot({ narrow }: { narrow: boolean }) {
  const W = narrow ? 288 : 560;
  const pxPerIn = narrow ? 150 : 280;
  const maxR = (Math.max(...DISC_ROWS.map((d) => d.diameterIn)) * pxPerIn) / 2;
  const top = 30;
  const cy = top + maxR + 6;
  const H = cy + maxR + (narrow ? 50 : 54);
  const id = narrow ? 'lv-discs-narrow' : 'lv-discs-wide';
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby={`${id}-title`}
      className={clsx('h-auto font-display', narrow ? 'swap-md-narrow max-w-[420px]' : 'swap-md-wide w-full max-w-[560px]')}
      data-src={DC}
    >
      <title id={`${id}-title`}>
        {`Cross sections drawn to one scale of the copper a ${DISC_SCENARIO.watts} W load ${DISC_SCENARIO.lengthFt} ft away needs for a ${DISC_SCENARIO.dropPct} % drop: ` +
          DISC_ROWS.map((d) => `${d.size} AWG at ${d.volts} V`).join(', ')}
      </title>
      <defs>
        <linearGradient id={`${id}-cu`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#f3c193" />
          <stop offset="0.45" stopColor="#d6904f" />
          <stop offset="1" stopColor="#a95a26" />
        </linearGradient>
      </defs>
      {DISC_ROWS.map((d, k) => {
        const cx = (W / 6) * (2 * k + 1);
        const r = (d.diameterIn * pxPerIn) / 2;
        return (
          <g key={d.volts}>
            <text x={cx} y={18} textAnchor="middle" fontSize={narrow ? 14 : 16} fontWeight={800} fill={INK}>
              <Val v={d.volts} unit="V" src={DC} svg />
            </text>
            <g className="viz-pop">
              <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-cu)`} stroke="#6b3112" strokeWidth={0.8} />
              {2 * r > 14 && <circle cx={cx} cy={cy} r={r - 2.2} fill="none" stroke="#ffe2c4" strokeOpacity={0.55} strokeWidth={1} />}
            </g>
            <text x={cx} y={cy + maxR + 24} textAnchor="middle" fontSize={narrow ? 13 : 14} fontWeight={700} fill={INK}>
              <Size s={d.size} svg />
            </text>
            <text x={cx} y={cy + maxR + (narrow ? 42 : 44)} textAnchor="middle" fontSize={13} fill={MUTED}>
              <Val v={d.amps} unit="A" src={DC} format={{ sig: 3 }} svg />
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** The copper the same load needs at 12, 24 and 48 V, as cut conductors at one scale (The Measured Copper Rule). */
export function LowVoltageDiscs() {
  return (
    <div>
      <DiscPlot narrow={false} />
      <DiscPlot narrow />
    </div>
  );
}

/** The bar chart's scenario: 10 A at 12 V, a 3 % drop (the informational note's figure), copper at 75 °C. */
export const LV_BAR_SCENARIO = { amps: 10, volts: 12, dropPct: VOLTAGE_DROP_NOTE.feederPct, tempC: 75 };
const LV_BAR_SIZES = ['14', '12', '10', '8', '6', '4', '2', '1/0'];
const LV_BAR_ROWS = LV_BAR_SIZES.map((size) => ({
  size,
  ft: lvLengthForDrop(size, LV_BAR_SCENARIO.volts, LV_BAR_SCENARIO.amps, LV_BAR_SCENARIO.dropPct, LV_BAR_SCENARIO.tempC),
}));

function LvBarPlot({ narrow }: { narrow: boolean }) {
  const W = narrow ? 288 : 560;
  const left = narrow ? 62 : 74;
  const right = narrow ? 20 : 64;
  const top = 8;
  const rowH = narrow ? 26 : 28;
  const barH = narrow ? 14 : 16;
  const bottom = 42;
  const H = top + LV_BAR_ROWS.length * rowH + bottom;
  const pw = W - left - right;
  const max = 160;
  const x = (v: number) => left + (v / max) * pw;
  const ticks = narrow ? [0, 50, 100, 150] : [0, 20, 40, 60, 80, 100, 120, 140, 160];
  const id = narrow ? 'lv-bars-narrow' : 'lv-bars-wide';
  const first = LV_BAR_ROWS[0];
  const last = LV_BAR_ROWS[LV_BAR_ROWS.length - 1];
  const sig = { sig: 3 };
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby={`${id}-title`}
      className={clsx('h-auto font-display', narrow ? 'swap-md-narrow max-w-[420px]' : 'swap-md-wide w-full max-w-[560px]')}
      data-src={DC}
    >
      <title id={`${id}-title`}>
        {`One-way length at which ${LV_BAR_SCENARIO.amps} A at ${LV_BAR_SCENARIO.volts} V DC reaches a ${LV_BAR_SCENARIO.dropPct} % drop, copper at ${LV_BAR_SCENARIO.tempC} °C, for each size from 14 AWG to 1/0`}
      </title>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={top - 4} y2={H - bottom + 4} stroke={GRID} strokeWidth={1} />
          <text x={x(t)} y={H - bottom + 20} textAnchor="middle" fontSize={13} fill={MUTED}>
            <Num v={t} src={DC} svg />
          </text>
        </g>
      ))}
      <text x={left + pw / 2} y={H - 4} textAnchor="middle" fontSize={13} fill={MUTED}>
        Feet, one way
      </text>
      {LV_BAR_ROWS.map((r, k) => {
        const y = top + k * rowH + (rowH - barH) / 2;
        const cy = y + barH / 2;
        const tipW = narrow ? 120 : 130;
        const tipX = Math.min(x(r.ft) + 8, W - tipW - 1);
        return (
          <g key={r.size} className="viz-mark">
            <rect x={0} y={top + k * rowH} width={W} height={rowH} fill="transparent" />
            <text x={left - 10} y={cy + 4.5} textAnchor="end" fontSize={13} fill={INK}>
              <Size s={r.size} svg />
            </text>
            <path d={barPath(left, y, Math.max(2, x(r.ft) - left), barH)} fill={COPPER} className="viz-grow" />
            {(r === first || r === last) && (
              <text x={x(r.ft) + 6} y={cy + 4.5} fontSize={13} fontWeight={700} fill={INK} className="viz-pop">
                <Val v={r.ft} unit="ft" src={DC} format={sig} svg />
              </text>
            )}
            <g className="viz-tip" aria-hidden="true">
              <rect x={tipX} y={cy - 11} width={tipW} height={22} fill="#ffffff" stroke={INK} strokeWidth={1} />
              <text x={tipX + 6} y={cy + 4.5} fontSize={13} fill={INK}>
                <Val v={r.ft} unit="ft" src={DC} format={sig} svg />
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

/** How far each copper size carries 10 A at 12 V before a 3 % drop. */
export function LowVoltageBars() {
  return (
    <div>
      <LvBarPlot narrow={false} />
      <LvBarPlot narrow />
    </div>
  );
}

// ── Three-phase: line to line and line to neutral on a wye system (three-phase calculator, WSZ-006d) ───────────────

const TP = 'calc:power';
const NOMINAL = 'us-nominal-voltages';
const POLY = 'mit-polyphase-networks';
const PFC = 'doe-power-factor-cost';
/** The system the phasor drawing shows: the larger nominal wye system (480Y/277 V). */
export const WYE_DRAWN = TP_WYE_SYSTEMS[TP_WYE_SYSTEMS.length - 1];
const PHASOR = '#57514c';

function PhasorPlot({ narrow }: { narrow: boolean }) {
  const W = narrow ? 288 : 560;
  const R = narrow ? 96 : 140;
  const cx = W / 2;
  const cy = narrow ? 124 : 176;
  const H = cy + R / 2 + (narrow ? 52 : 58);
  const tip = (deg: number) => ({ x: cx + R * Math.cos((deg * Math.PI) / 180), y: cy - R * Math.sin((deg * Math.PI) / 180) });
  // A up, B lower right, C lower left: 120° apart
  const A = tip(90);
  const B = tip(-30);
  const C = tip(210);
  const head = (to: { x: number; y: number }) => {
    const dx = to.x - cx;
    const dy = to.y - cy;
    const len = Math.hypot(dx, dy);
    const ux = dx / len;
    const uy = dy / len;
    const bx = to.x - ux * 11;
    const by = to.y - uy * 11;
    return `M${to.x},${to.y}L${bx - uy * 5},${by + ux * 5}L${bx + uy * 5},${by - ux * 5}Z`;
  };
  const arcR = narrow ? 24 : 30;
  const arc = `M${cx},${cy - arcR}A${arcR},${arcR} 0 0 1 ${cx + arcR * Math.cos(Math.PI / 6)},${cy + arcR * Math.sin(Math.PI / 6)}`;
  const fs = narrow ? 13 : 14;
  const id = narrow ? 'tp-phasors-narrow' : 'tp-phasors-wide';
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby={`${id}-title`}
      className={clsx('h-auto font-display', narrow ? 'swap-md-narrow max-w-[420px]' : 'swap-md-wide w-full max-w-[560px]')}
      data-src={NOMINAL}
    >
      <title id={`${id}-title`}>
        {`The three line-to-neutral voltages of a ${WYE_DRAWN.lineVolts}Y/${WYE_DRAWN.neutralVolts} V system, ${WYE_DRAWN.neutralVolts} V each and 120° apart, and the ${WYE_DRAWN.lineVolts} V between two lines, √3 times longer`}
      </title>
      {[A, B, C].map((t, k) => (
        <g key={k}>
          <line x1={cx} y1={cy} x2={t.x} y2={t.y} stroke={PHASOR} strokeWidth={2.5} pathLength={1} className="viz-draw" />
          <path d={head(t)} fill={PHASOR} className="viz-pop" />
        </g>
      ))}
      {/* the line-to-line voltage between B and C */}
      <line x1={C.x} y1={C.y} x2={B.x} y2={B.y} stroke={INK} strokeWidth={3.5} pathLength={1} className="viz-draw" />
      <path d={arc} fill="none" stroke={MUTED} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={4} fill={INK} />
      <text x={cx - 10} y={cy + 5} textAnchor="end" fontSize={fs} fontWeight={700} fill={INK}>
        N
      </text>
      <text x={A.x} y={A.y - 8} textAnchor="middle" fontSize={fs} fontWeight={700} fill={INK}>
        A
      </text>
      <text x={B.x + 8} y={B.y + 5} fontSize={fs} fontWeight={700} fill={INK}>
        B
      </text>
      <text x={C.x - 8} y={C.y + 5} textAnchor="end" fontSize={fs} fontWeight={700} fill={INK}>
        C
      </text>
      <text x={cx + 10} y={cy - R * (narrow ? 0.62 : 0.58)} fontSize={fs} fill={INK} className="viz-pop">
        <Val v={WYE_DRAWN.neutralVolts} unit="V" src={NOMINAL} svg /> to neutral
      </text>
      <text x={cx + arcR + 6} y={cy + 4} fontSize={13} fill={MUTED} data-src={POLY}>
        <Num v={120} src={POLY} svg />°
      </text>
      <text x={cx} y={B.y + (narrow ? 26 : 30)} textAnchor="middle" fontSize={fs} fontWeight={700} fill={INK} className="viz-pop">
        <Val v={WYE_DRAWN.lineVolts} unit="V" src={NOMINAL} svg /> line to line
      </text>
      <text x={cx} y={B.y + (narrow ? 44 : 50)} textAnchor="middle" fontSize={13} fill={MUTED} data-src={TP}>
        = √3 × <Val v={WYE_DRAWN.lineVolts / SQRT3} unit="V" src={TP} format={{ sig: 4 }} svg />
      </text>
    </svg>
  );
}

/** A wye system's three voltages to neutral and the voltage between two lines (MIT 6.061 polyphase notes). */
export function WyePhasors() {
  return (
    <div>
      <PhasorPlot narrow={false} />
      <PhasorPlot narrow />
    </div>
  );
}

// ── Three-phase: the power triangle before and after a capacitor bank (the golden case, 100 kW from PF 0.80 to 0.95) ─


function TrianglePlot({ narrow, example, idPrefix }: { narrow: boolean; example: TpResult; idPrefix: string }) {
  const r = example;
  const c = r.correction;
  if (!c) throw new Error('TrianglePlot: no correction');
  const W = narrow ? 288 : 560;
  // px per kW and per kVAR, one scale for both sides, so the longer side fits 150 px (phones) or 310 px
  const k = Math.min(narrow ? 1.5 : 3.1, (narrow ? 150 : 310) / Math.max(r.kw, r.kvar));
  const x0 = narrow ? 14 : 30;
  const top = narrow ? 24 : 26;
  const base = top + r.kvar * k;
  const H = base + (narrow ? 78 : 44);
  const xP = x0 + r.kw * k;
  const yQ1 = base - r.kvar * k;
  const yQ2 = base - c.kvarAfter * k;
  const sig = { sig: 4 };
  const pf2 = { fixed: 2 };
  const fs = narrow ? 13 : 14;
  const id = `${idPrefix}-${narrow ? 'narrow' : 'wide'}`;
  const lx = xP + 10;
  const before = (
    <>
      <Val v={Number(r.kva.toPrecision(4))} unit="kVA" src={TP} svg /> at PF <Num v={r.pf} src={TP} format={pf2} svg />
    </>
  );
  const after = (
    <>
      <Val v={c.kvaAfter} unit="kVA" src={TP} format={sig} svg /> at PF <Num v={c.targetPf} src={TP} format={pf2} svg />
    </>
  );
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby={`${id}-title`}
      className={clsx('h-auto font-display', narrow ? 'swap-md-narrow max-w-[420px]' : 'swap-md-wide w-full max-w-[560px]')}
      data-src={TP}
    >
      <title id={`${id}-title`}>
        {`Power triangle of a ${r.kw} kW load, drawn to scale: at power factor ${r.pf.toFixed(2)} it draws ${Number(r.kvar.toPrecision(4))} kVAR and ${Number(r.kva.toPrecision(4))} kVA; a ${c.capKvar.toPrecision(4)} kVAR capacitor bank brings it to power factor ${c.targetPf.toFixed(2)}, ${c.kvarAfter.toPrecision(4)} kVAR and ${c.kvaAfter.toPrecision(4)} kVA`}
      </title>
      {/* real power along the bottom, reactive power up the right side, apparent power as the long sides */}
      <line x1={x0} y1={base} x2={xP} y2={base} stroke={INK} strokeWidth={3} pathLength={1} className="viz-draw" />
      <line x1={xP} y1={base} x2={xP} y2={yQ2} stroke={PHASOR} strokeWidth={3} pathLength={1} className="viz-draw" />
      <line x1={xP} y1={yQ2} x2={xP} y2={yQ1} stroke={PHASOR} strokeWidth={3} strokeDasharray="5 4" />
      <line x1={x0} y1={base} x2={xP} y2={yQ1} stroke={MUTED} strokeWidth={2} pathLength={1} className="viz-draw" />
      <line x1={x0} y1={base} x2={xP} y2={yQ2} stroke={INK} strokeWidth={2.5} pathLength={1} className="viz-draw" />
      <text x={(x0 + xP) / 2} y={base + 24} textAnchor="middle" fontSize={fs} fontWeight={700} fill={INK}>
        <Val v={r.kw} unit="kW" src={TP} svg /> real power
      </text>
      <text x={lx} y={yQ1 + 4} fontSize={13} fill={MUTED}>
        <Val v={Number(r.kvar.toPrecision(4))} unit="kVAR" src={TP} svg /> before
      </text>
      {/* the capacitor's share of the side: from the corrected reactive power up to the original */}
      <text x={lx} y={(yQ1 + yQ2) / 2 + 2} fontSize={fs} fontWeight={700} fill={INK} className="viz-pop" data-src={PFC}>
        <Val v={c.capKvar} unit="kVAR" src={TP} format={sig} svg />
      </text>
      <text x={lx} y={(yQ1 + yQ2) / 2 + (narrow ? 18 : 20)} fontSize={13} fill={MUTED} className="viz-pop">
        capacitor
      </text>
      <text x={lx} y={(yQ2 + base) / 2 + 4} fontSize={fs} fill={INK} className="viz-pop">
        <Val v={c.kvarAfter} unit="kVAR" src={TP} format={sig} svg /> after
      </text>
      {narrow ? (
        <>
          <Key x={x0} y={base + 50} color={MUTED}>
            {before}
          </Key>
          <Key x={x0} y={base + 70} color={INK}>
            {after}
          </Key>
        </>
      ) : (
        <>
          <text x={x0 + (xP - x0) * 0.42 - 8} y={base - r.kvar * k * 0.42 - 12} textAnchor="end" fontSize={14} fill={MUTED}>
            {before}
          </text>
          <text x={xP - 12} y={base - 14} textAnchor="end" fontSize={14} fontWeight={700} fill={INK}>
            {after}
          </text>
        </>
      )}
    </svg>
  );
}

/** The power triangle before and after power factor correction, to one scale (DOE/GO-10096-286's triangle). */
export function PowerTriangle({ example = PF_EXAMPLE, idPrefix = 'tp-triangle' }: { example?: TpResult; idPrefix?: string }) {
  return (
    <div>
      <TrianglePlot narrow={false} example={example} idPrefix={idPrefix} />
      <TrianglePlot narrow example={example} idPrefix={idPrefix} />
    </div>
  );
}

// ── Single phase vs three phase: power over one cycle (MIT 6.061 polyphase notes) ──────────────────────────────────

const PHASE_GRAY = '#a39b93';

function PhasePowerPlot({ narrow }: { narrow: boolean }) {
  const W = narrow ? 288 : 560;
  const left = narrow ? 34 : 44;
  // room for half of the "360°" label, centred on the plot's right end
  const right = narrow ? 18 : 16;
  const top = narrow ? 62 : 48;
  const ph = narrow ? 130 : 170;
  const H = top + ph + 46;
  const pw = W - left - right;
  const x = (deg: number) => left + (deg / 360) * pw;
  const y = (v: number) => top + ph - (v / 2) * ph;
  const steps = 72;
  const path = (f: (deg: number) => number) =>
    Array.from({ length: steps + 1 }, (_, i) => {
      const deg = (360 * i) / steps;
      return `${i === 0 ? 'M' : 'L'}${x(deg).toFixed(1)},${y(f(deg)).toFixed(1)}`;
    }).join('');
  const rad = (deg: number) => (deg * Math.PI) / 180;
  // at power factor 1: one phase delivers P(1 − cos 2θ); three phases 120° apart each a third of it, summing to P
  const single = (deg: number) => 1 - Math.cos(2 * rad(deg));
  const phase = (k: number) => (deg: number) => (1 - Math.cos(2 * rad(deg - 120 * k))) / 3;
  const total = (deg: number) => phase(0)(deg) + phase(1)(deg) + phase(2)(deg);
  const id = narrow ? 'phase-power-narrow' : 'phase-power-wide';
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby={`${id}-title`}
      className={clsx('h-auto font-display', narrow ? 'swap-md-narrow max-w-[420px]' : 'swap-md-wide w-full max-w-[560px]')}
      data-src={POLY}
    >
      <title id={`${id}-title`}>
        Power delivered over one cycle at the same average power: single-phase rises and falls between zero and twice the average; the
        three phases of a balanced three-phase load add up to a constant
      </title>
      <Key x={0} y={narrow ? 16 : 18} color={INK}>
        Three-phase, the sum
      </Key>
      <Key x={narrow ? 0 : 200} y={narrow ? 36 : 18} color={MUTED}>
        Single-phase
      </Key>
      {!narrow && (
        <Key x={340} y={18} color={PHASE_GRAY}>
          Each phase
        </Key>
      )}
      {[0, 1, 2].map((v) => (
        <g key={v}>
          <line x1={left} x2={W - right} y1={y(v)} y2={y(v)} stroke={GRID} strokeWidth={1} />
          <text x={left - 8} y={y(v) + 4.5} textAnchor="end" fontSize={13} fill={MUTED}>
            <Num v={v} src={POLY} svg />×
          </text>
        </g>
      ))}
      {[0, 90, 180, 270, 360].map((d) => (
        <text key={d} x={x(d)} y={top + ph + 20} textAnchor="middle" fontSize={13} fill={MUTED}>
          <Num v={d} src={POLY} svg />°
        </text>
      ))}
      <text x={left + pw / 2} y={H - 6} textAnchor="middle" fontSize={13} fill={MUTED}>
        One cycle of the voltage
      </text>
      {!narrow &&
        [0, 1, 2].map((k) => (
          <path key={k} d={path(phase(k))} fill="none" stroke={PHASE_GRAY} strokeWidth={1.5} pathLength={1} className="viz-draw" />
        ))}
      <path d={path(single)} fill="none" stroke={MUTED} strokeWidth={2} pathLength={1} className="viz-draw" />
      <path d={path(total)} fill="none" stroke={INK} strokeWidth={3} pathLength={1} className="viz-draw" />
    </svg>
  );
}

/** Instantaneous power over one cycle, single-phase against the three phases' sum, at the same average power. */
export function PhasePowerChart() {
  return (
    <div>
      <PhasePowerPlot narrow={false} />
      <PhasePowerPlot narrow />
    </div>
  );
}

// ── Single phase vs three phase: the same 10 kW at three voltages (golden cases, power group) ─────────────────────

const POWER_ENGINE = 'calc:power';

const BAR_GRAY = '#57514c';

function CompareBarsPlot({ narrow }: { narrow: boolean }) {
  const W = narrow ? 288 : 560;
  const left = narrow ? 104 : 150;
  const right = narrow ? 62 : 80;
  const top = 8;
  const rowH = narrow ? 34 : 36;
  const barH = narrow ? 16 : 18;
  const H = top + COMPARE_ROWS.length * rowH + (narrow ? 46 : 30);
  const pw = W - left - right;
  const max = Math.max(...COMPARE_ROWS.map((r) => r.amps));
  const id = narrow ? 'compare-bars-narrow' : 'compare-bars-wide';
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby={`${id}-title`}
      className={clsx('h-auto font-display', narrow ? 'swap-md-narrow max-w-[420px]' : 'swap-md-wide w-full max-w-[560px]')}
      data-src={POWER_ENGINE}
    >
      <title id={`${id}-title`}>
        {`Current of a ${COMPARE_KW} kW load at power factor 1: ` +
          COMPARE_ROWS.map((r) => `${r.amps.toPrecision(4)} A at ${r.volts} V ${r.phases === 1 ? 'single-phase' : 'three-phase'}`).join(', ')}
      </title>
      {COMPARE_ROWS.map((r, k) => {
        const yb = top + k * rowH + (rowH - barH) / 2;
        const w = (r.amps / max) * pw;
        return (
          <g key={r.key}>
            <text x={left - 10} y={yb + barH / 2 + 4.5} textAnchor="end" fontSize={13} fill={INK} data-src={NOMINAL}>
              <Val v={r.volts} unit="V" src={NOMINAL} svg /> {r.phases === 1 ? 'single' : 'three'}
            </text>
            <path d={barPath(left, yb, Math.max(2, w), barH)} fill={BAR_GRAY} className="viz-grow" />
            <text x={left + w + 8} y={yb + barH / 2 + 4.5} fontSize={13} fontWeight={700} fill={INK} className="viz-pop">
              <Val v={r.amps} unit="A" src={POWER_ENGINE} format={{ sig: 4 }} svg />
            </text>
          </g>
        );
      })}
      {narrow ? (
        <>
          <text x={0} y={H - 24} fontSize={13} fill={MUTED}>
            Current per line,
          </text>
          <text x={0} y={H - 8} fontSize={13} fill={MUTED}>
            <Val v={COMPARE_KW} unit="kW" src={POWER_ENGINE} svg /> at power factor <Num v={1} src={POWER_ENGINE} svg />
          </text>
        </>
      ) : (
        <text x={left} y={H - 8} fontSize={13} fill={MUTED}>
          Current per line, <Val v={COMPARE_KW} unit="kW" src={POWER_ENGINE} svg /> at power factor <Num v={1} src={POWER_ENGINE} svg />
        </text>
      )}
    </svg>
  );
}

/** One 10 kW load at 240 V single-phase, 208 V three-phase and 480 V three-phase. */
export function CompareCurrentBars() {
  return (
    <div>
      <CompareBarsPlot narrow={false} />
      <CompareBarsPlot narrow />
    </div>
  );
}

// ── Power factor: current for 100 kW at 480 V as the power factor falls (power factor guide) ──────────────────────


function PfBarsPlot({ narrow }: { narrow: boolean }) {
  const W = narrow ? 288 : 560;
  const left = narrow ? 70 : 92;
  const right = narrow ? 58 : 72;
  const top = 8;
  const rowH = narrow ? 26 : 28;
  const barH = narrow ? 14 : 16;
  const H = top + PF_BAR_ROWS.length * rowH + (narrow ? 46 : 30);
  const pw = W - left - right;
  const max = Math.max(...PF_BAR_ROWS.map((r) => r.amps));
  const id = narrow ? 'pf-bars-narrow' : 'pf-bars-wide';
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby={`${id}-title`}
      className={clsx('h-auto font-display', narrow ? 'swap-md-narrow max-w-[420px]' : 'swap-md-wide w-full max-w-[560px]')}
      data-src={TP}
    >
      <title id={`${id}-title`}>
        {`Current in each line of a ${PF_BARS.kw} kW three-phase load at ${PF_BARS.volts} V as the power factor falls: ` +
          PF_BAR_ROWS.map((r) => `${r.amps.toPrecision(4)} A at ${r.pf}`).join(', ')}
      </title>
      {PF_BAR_ROWS.map((r, k) => {
        const yb = top + k * rowH + (rowH - barH) / 2;
        const w = (r.amps / max) * pw;
        return (
          <g key={r.pf} className="viz-mark">
            <text x={left - 10} y={yb + barH / 2 + 4.5} textAnchor="end" fontSize={13} fill={INK}>
              PF <Num v={r.pf} src={TP} format={{ fixed: 2 }} svg />
            </text>
            <path d={barPath(left, yb, Math.max(2, w), barH)} fill={BAR_GRAY} className="viz-grow" />
            <text x={left + w + 8} y={yb + barH / 2 + 4.5} fontSize={13} fill={INK} className="viz-pop">
              <Val v={r.amps} unit="A" src={TP} format={{ sig: 4 }} svg />
            </text>
          </g>
        );
      })}
      {narrow ? (
        <>
          <text x={0} y={H - 24} fontSize={13} fill={MUTED}>
            Amperes per line,
          </text>
          <text x={0} y={H - 8} fontSize={13} fill={MUTED}>
            <Val v={PF_BARS.kw} unit="kW" src={TP} svg /> at <Val v={PF_BARS.volts} unit="V" src={NOMINAL} svg /> three-phase
          </text>
        </>
      ) : (
        <text x={left} y={H - 8} fontSize={13} fill={MUTED}>
          Amperes per line, <Val v={PF_BARS.kw} unit="kW" src={TP} svg /> at <Val v={PF_BARS.volts} unit="V" src={NOMINAL} svg /> three-phase
        </text>
      )}
    </svg>
  );
}

/** The current of one load as its power factor falls. */
export function PfCurrentBars() {
  return (
    <div>
      <PfBarsPlot narrow={false} />
      <PfBarsPlot narrow />
    </div>
  );
}

// ── Volts to amps: the current of one 4,500 W load against voltage, as a fixed power and as a fixed resistance ───────

/** Golden case "4500 W at 240 V" (power) and the 12.8 Ω the same element has at 240 V (R = V² ÷ P). */
export const VA_CHART = { watts: 4500, volts: 240, voltsFrom: 100, voltsTo: 300 };
export const VA_CHART_OHMS = (VA_CHART.volts * VA_CHART.volts) / VA_CHART.watts;

function VoltsAmpsPlot({ narrow }: { narrow: boolean }) {
  const W = narrow ? 288 : 560;
  const left = narrow ? 40 : 48;
  const right = narrow ? 16 : 24;
  const top = narrow ? 84 : 66;
  const ph = narrow ? 170 : 210;
  const H = top + ph + 46;
  const pw = W - left - right;
  const { watts, volts, voltsFrom, voltsTo } = VA_CHART;
  const ampsMax = 50;
  const x = (v: number) => left + ((v - voltsFrom) / (voltsTo - voltsFrom)) * pw;
  const y = (a: number) => top + ph - (Math.min(a, ampsMax) / ampsMax) * ph;
  const steps = 80;
  const path = (f: (v: number) => number) =>
    Array.from({ length: steps + 1 }, (_, i) => {
      const v = voltsFrom + ((voltsTo - voltsFrom) * i) / steps;
      return `${i === 0 ? 'M' : 'L'}${x(v).toFixed(1)},${y(f(v)).toFixed(1)}`;
    }).join('');
  const atPower = (v: number) => watts / v;
  const atOhms = (v: number) => v / VA_CHART_OHMS;
  const meet = atPower(volts);
  const id = narrow ? 'volts-amps-narrow' : 'volts-amps-wide';
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby={`${id}-title`}
      className={clsx('h-auto font-display', narrow ? 'swap-md-narrow max-w-[420px]' : 'swap-md-wide w-full max-w-[560px]')}
      data-src={TP}
    >
      <title id={`${id}-title`}>
        {`Current against voltage for a ${watts} W load: held at ${watts} W the current falls as the voltage rises; as a fixed ${VA_CHART_OHMS} Ω resistance it rises with the voltage. Both give ${meet} A at ${volts} V.`}
      </title>
      <Key x={0} y={narrow ? 16 : 18} color={INK}>
        Fixed power, <Val v={watts} unit="W" src={TP} svg />
      </Key>
      <Key x={narrow ? 0 : 230} y={narrow ? 36 : 18} color={MUTED}>
        Fixed resistance, <Val v={VA_CHART_OHMS} unit="Ω" src={TP} svg />
      </Key>
      <Key x={0} y={narrow ? 56 : 42} color={INK} dot>
        Both: <Val v={meet} unit="A" src={TP} svg /> at <Val v={volts} unit="V" src={TP} svg />
      </Key>
      {[0, 10, 20, 30, 40, 50].map((a) => (
        <g key={a}>
          <line x1={left} x2={W - right} y1={y(a)} y2={y(a)} stroke={GRID} strokeWidth={1} />
          <text x={left - 8} y={y(a) + 4.5} textAnchor="end" fontSize={13} fill={MUTED}>
            <Num v={a} src={TP} svg />
          </text>
        </g>
      ))}
      {[100, 150, 200, 250, 300].map((v) => (
        <text key={v} x={x(v)} y={top + ph + 20} textAnchor="middle" fontSize={13} fill={MUTED}>
          <Num v={v} src={TP} svg />
        </text>
      ))}
      <text x={left + pw / 2} y={H - 6} textAnchor="middle" fontSize={13} fill={MUTED}>
        Volts (amps on the left)
      </text>
      <path d={path(atPower)} fill="none" stroke={INK} strokeWidth={3} pathLength={1} className="viz-draw" />
      <path d={path(atOhms)} fill="none" stroke={MUTED} strokeWidth={2} pathLength={1} className="viz-draw" />
      <circle cx={x(volts)} cy={y(meet)} r={5} fill={INK} stroke="#fff" strokeWidth={2} className="viz-pop" />
    </svg>
  );
}

/** The current of one load against voltage: held at a fixed power, and as a fixed resistance. */
export function VoltsAmpsChart() {
  return (
    <div>
      <VoltsAmpsPlot narrow={false} />
      <VoltsAmpsPlot narrow />
    </div>
  );
}

// ── Electrical power calculations (WSZ-007e): one load's power triangle, and watts per ampere ──────────────────────

/** Golden case "50 A three-phase 480 V PF 0.92 to watts" (power), drawn to one scale for kW and kVAR. */
function WorkedTrianglePlot({ narrow }: { narrow: boolean }) {
  const r = GUIDE_EXAMPLES.fromAmps;
  const kw = r.kw;
  const kvar = r.kvar;
  const pf = r.pf;
  if (kw === null || kvar === null || pf === null) throw new Error('WorkedTrianglePlot: the example has no power factor');
  const W = narrow ? 288 : 560;
  const x0 = narrow ? 14 : 30;
  const top = narrow ? 22 : 24;
  // px per kW and per kVAR: the real power side spans 170 px (phones) or 360 px
  const k = (narrow ? 170 : 360) / kw;
  const xP = x0 + kw * k;
  const base = top + kvar * k;
  const H = base + (narrow ? 64 : 44);
  const sig = { sig: 4 };
  const fs = narrow ? 13 : 14;
  const arcR = narrow ? 46 : 54;
  const phi = Math.acos(pf);
  // the label sits right of the arc, where the long side has risen clear of its cap height
  const labelX = x0 + arcR + 14;
  const id = narrow ? 'worked-triangle-narrow' : 'worked-triangle-wide';
  return (
    <svg
      viewBox={`0 0 ${W} ${H.toFixed(1)}`}
      width={W}
      height={Number(H.toFixed(1))}
      role="img"
      aria-labelledby={`${id}-title`}
      className={clsx('h-auto font-display', narrow ? 'swap-md-narrow max-w-[420px]' : 'swap-md-wide w-full max-w-[560px]')}
      data-src={TP}
    >
      <title id={`${id}-title`}>
        {`Power triangle of ${r.amps} A on ${r.volts} V three-phase at power factor ${pf}, drawn to scale: ${Number(kw.toPrecision(4))} kW real power, ${Number(kvar.toPrecision(4))} kVAR reactive power and ${Number(r.kva.toPrecision(4))} kVA apparent power`}
      </title>
      {/* real power along the bottom, reactive power up the right side at 90°, apparent power as the long side */}
      <line x1={x0} y1={base} x2={xP} y2={base} stroke={INK} strokeWidth={3} pathLength={1} className="viz-draw" />
      <line x1={xP} y1={base} x2={xP} y2={top} stroke={PHASOR} strokeWidth={3} pathLength={1} className="viz-draw" />
      <line x1={x0} y1={base} x2={xP} y2={top} stroke={MUTED} strokeWidth={2} pathLength={1} className="viz-draw" />
      <path d={`M${xP - 10},${base}V${base - 10}H${xP}`} fill="none" stroke={MUTED} strokeWidth={1} />
      <path
        d={`M${x0 + arcR},${base}A${arcR} ${arcR} 0 0 0 ${(x0 + arcR * Math.cos(phi)).toFixed(1)},${(base - arcR * Math.sin(phi)).toFixed(1)}`}
        fill="none"
        stroke={MUTED}
        strokeWidth={1.5}
      />
      <text x={labelX} y={base - 8} fontSize={13} fill={INK} className="viz-pop">
        PF <Num v={pf} src={TP} svg />
      </text>
      <text x={(x0 + xP) / 2} y={base + 24} textAnchor="middle" fontSize={fs} fontWeight={700} fill={INK}>
        <Val v={kw} unit="kW" src={TP} format={sig} svg /> real power
      </text>
      <text x={xP + 10} y={(top + base) / 2} fontSize={fs} fontWeight={700} fill={INK} className="viz-pop">
        <Val v={kvar} unit="kVAR" src={TP} format={sig} svg />
      </text>
      <text x={xP + 10} y={(top + base) / 2 + 18} fontSize={13} fill={MUTED} className="viz-pop">
        {narrow ? 'reactive' : 'reactive power'}
      </text>
      {narrow ? (
        <Key x={x0} y={base + 52} color={MUTED}>
          <Val v={r.kva} unit="kVA" src={TP} format={sig} svg /> apparent power
        </Key>
      ) : (
        <text x={(x0 + xP) / 2 - 14} y={(top + base) / 2 - 10} textAnchor="end" fontSize={14} fill={INK} className="viz-pop">
          <Val v={r.kva} unit="kVA" src={TP} format={sig} svg /> apparent power
        </text>
      )}
    </svg>
  );
}

/** The real, reactive and apparent power of 50 A on 480 V three-phase at power factor 0.92, to one scale. */
export function WorkedPowerTriangle() {
  return (
    <div>
      <WorkedTrianglePlot narrow={false} />
      <WorkedTrianglePlot narrow />
    </div>
  );
}

function WattsPerAmpPlot({ narrow }: { narrow: boolean }) {
  const rows = WATTS_PER_AMP_ROWS;
  const W = narrow ? 288 : 560;
  const left = narrow ? 104 : 150;
  const right = narrow ? 62 : 80;
  const top = 8;
  const rowH = narrow ? 34 : 36;
  const barH = narrow ? 16 : 18;
  const H = top + rows.length * rowH + (narrow ? 46 : 30);
  const pw = W - left - right;
  const max = Math.max(...rows.map((r) => r.watts));
  const w4 = (v: number) => Number(v.toPrecision(4));
  const id = narrow ? 'watts-per-amp-narrow' : 'watts-per-amp-wide';
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby={`${id}-title`}
      className={clsx('h-auto font-display', narrow ? 'swap-md-narrow max-w-[420px]' : 'swap-md-wide w-full max-w-[560px]')}
      data-src={TP}
    >
      <title id={`${id}-title`}>
        {'Watts per ampere of line current at power factor 1: ' +
          rows.map((r) => `${w4(r.watts)} W at ${r.volts} V ${r.phases === 1 ? 'single-phase' : 'three-phase'}`).join(', ')}
      </title>
      {rows.map((r, i) => {
        const yb = top + i * rowH + (rowH - barH) / 2;
        const w = (r.watts / max) * pw;
        return (
          <g key={r.key}>
            <text x={left - 10} y={yb + barH / 2 + 4.5} textAnchor="end" fontSize={13} fill={INK} data-src={NOMINAL}>
              <Val v={r.volts} unit="V" src={NOMINAL} svg /> {r.phases === 1 ? 'single' : 'three'}
            </text>
            <path d={barPath(left, yb, Math.max(2, w), barH)} fill={BAR_GRAY} className="viz-grow" />
            <text x={left + w + 8} y={yb + barH / 2 + 4.5} fontSize={13} fontWeight={700} fill={INK} className="viz-pop">
              <Val v={w4(r.watts)} unit="W" src={TP} svg />
            </text>
          </g>
        );
      })}
      {narrow ? (
        <>
          <text x={0} y={H - 24} fontSize={13} fill={MUTED}>
            Watts per amp of line current,
          </text>
          <text x={0} y={H - 8} fontSize={13} fill={MUTED}>
            at power factor <Num v={1} src={TP} svg />
          </text>
        </>
      ) : (
        <text x={left} y={H - 8} fontSize={13} fill={MUTED}>
          Watts per amp of line current, at power factor <Num v={1} src={TP} svg />
        </text>
      )}
    </svg>
  );
}

/** Watts per ampere at power factor 1 at 120 and 240 V single-phase and 208 and 480 V three-phase. */
export function WattsPerAmpBars() {
  return (
    <div>
      <WattsPerAmpPlot narrow={false} />
      <WattsPerAmpPlot narrow />
    </div>
  );
}

// ── Ground wire calculator (WSZ-008a): Table 250.122 as steps, and a 200 A service's wires to one scale ─────────────

const GND = 'nec-250-grounding';
const GND_CALC = 'calc:grounding';
const EGC_TICKS_A = [15, 100, 1000, 6000];
const EGC_TICK_SIZES = ['14', '8', '2', '2/0', '250', '750'];

function EgcStepPlot({ narrow }: { narrow: boolean }) {
  const W = narrow ? 288 : 560;
  const left = narrow ? 64 : 76;
  const right = narrow ? 14 : 92;
  const top = narrow ? 62 : 40;
  const ph = narrow ? 200 : 230;
  const H = top + ph + 48;
  const pw = W - left - right;
  const aMin = Math.log10(15);
  const aMax = Math.log10(6000);
  const cMin = Math.log10(areaCmil('14') * 0.85);
  const cMax = Math.log10(areaCmil('1250') * 1.1);
  const x = (a: number) => left + ((Math.log10(a) - aMin) / (aMax - aMin)) * pw;
  const y = (size: string) => top + ph - ((Math.log10(areaCmil(size)) - cMin) / (cMax - cMin)) * ph;
  const steps = (pick: (r: (typeof TABLE_250_122_ROWS)[number]) => string) => {
    let d = '';
    let from = 15;
    TABLE_250_122_ROWS.forEach((r, k) => {
      const yy = y(pick(r)).toFixed(1);
      d += `${k === 0 ? 'M' : 'L'}${x(from).toFixed(1)},${yy}H${x(r.rowA).toFixed(1)}`;
      from = r.rowA;
    });
    return d;
  };
  const last = TABLE_250_122_ROWS[TABLE_250_122_ROWS.length - 1];
  const id = narrow ? 'egc-steps-narrow' : 'egc-steps-wide';
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby={`${id}-title`}
      className={clsx('h-auto font-display', narrow ? 'swap-md-narrow max-w-[420px]' : 'swap-md-wide w-full max-w-[560px]')}
      data-src={GND}
    >
      <title id={`${id}-title`}>
        {`Equipment grounding conductor size against the breaker or fuse rating, NEC Table 250.122: from 14 AWG copper and 12 AWG aluminum at 15 A to ${last.cu} kcmil copper and ${last.alCca} kcmil aluminum at 6000 A`}
      </title>
      <Key x={0} y={16} color={COPPER}>
        Copper
      </Key>
      <Key x={narrow ? 0 : 110} y={narrow ? 36 : 16} color={ALUMINUM}>
        Aluminum or copper-clad aluminum
      </Key>
      {EGC_TICK_SIZES.map((s) => (
        <g key={s}>
          <line x1={left} x2={W - right} y1={y(s)} y2={y(s)} stroke={GRID} strokeWidth={1} />
          <text x={left - 8} y={y(s) + 4.5} textAnchor="end" fontSize={13} fill={MUTED} data-size={s}>
            <Size s={s} svg />
          </text>
        </g>
      ))}
      {EGC_TICKS_A.map((a) => (
        <text key={a} x={x(a)} y={top + ph + 20} textAnchor={a === 6000 ? 'end' : a === 15 ? 'start' : 'middle'} fontSize={13} fill={MUTED}>
          <Val v={a} unit="A" src={GND} svg />
        </text>
      ))}
      <text x={left + pw / 2} y={H - 6} textAnchor="middle" fontSize={13} fill={MUTED}>
        Breaker or fuse rating (size on the left)
      </text>
      <path d={steps((r) => r.alCca)} fill="none" stroke={ALUMINUM} strokeWidth={2.5} pathLength={1} className="viz-draw" />
      <path d={steps((r) => r.cu)} fill="none" stroke={COPPER} strokeWidth={2.5} pathLength={1} className="viz-draw" />
      {!narrow && (
        <>
          <text x={W - right + 8} y={y(last.alCca) + 4.5} fontSize={13} fill={INK} className="viz-pop">
            <Size s={last.alCca} svg />
          </text>
          <text x={W - right + 8} y={y(last.cu) + 4.5} fontSize={13} fill={INK} className="viz-pop">
            <Size s={last.cu} svg />
          </text>
        </>
      )}
    </svg>
  );
}

/** Table 250.122 as two step lines, copper and aluminum, against the rating on a log scale. */
export function EgcStepChart() {
  return (
    <div>
      <EgcStepPlot narrow={false} />
      <EgcStepPlot narrow />
    </div>
  );
}

/** Golden case "200 A 120/240 V dwelling service" (service-lookup): its copper service conductor and GEC, and the EGC of a 200 A feeder. */
export const SERVICE_200 = (() => {
  const s = serviceLookup(200);
  const egc = egcRow(200);
  if (!s || !egc) throw new Error('SERVICE_200: no 200 A row');
  const disc = (size: string) => ({ size, diameterIn: (conductor(size)?.diameterMm ?? 0) / 25.4 });
  return [
    { key: 'service', label: 'Service', note: 'Table 310.12', src: 'nec-310-12', ...disc(s.cu) },
    { key: 'gec', label: 'GEC', note: 'Table 250.66', src: GND, ...disc(s.gecForCuService.cu) },
    { key: 'egc', label: 'EGC', note: 'Table 250.122', src: GND, ...disc(egc.cu) },
  ];
})();

function ServiceDiscPlot({ narrow }: { narrow: boolean }) {
  const W = narrow ? 288 : 560;
  const pxPerIn = narrow ? 170 : 300;
  const maxR = (Math.max(...SERVICE_200.map((d) => d.diameterIn)) * pxPerIn) / 2;
  const top = 30;
  const cy = top + maxR + 6;
  const H = cy + maxR + (narrow ? 50 : 54);
  const id = narrow ? 'service-discs-narrow' : 'service-discs-wide';
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby={`${id}-title`}
      className={clsx('h-auto font-display', narrow ? 'swap-md-narrow max-w-[420px]' : 'swap-md-wide w-full max-w-[560px]')}
      data-src={GND_CALC}
    >
      <title id={`${id}-title`}>
        {`Cross sections drawn to one scale, as solid copper: a 200 A dwelling service's ${SERVICE_200[0].size} AWG conductor, its ${SERVICE_200[1].size} AWG grounding electrode conductor, and the ${SERVICE_200[2].size} AWG equipment grounding conductor of a 200 A feeder`}
      </title>
      <defs>
        <linearGradient id={`${id}-cu`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#f3c193" />
          <stop offset="0.45" stopColor="#d6904f" />
          <stop offset="1" stopColor="#a95a26" />
        </linearGradient>
      </defs>
      {SERVICE_200.map((d, k) => {
        const cx = (W / 6) * (2 * k + 1);
        const r = (d.diameterIn * pxPerIn) / 2;
        return (
          <g key={d.key}>
            <text x={cx} y={18} textAnchor="middle" fontSize={narrow ? 14 : 16} fontWeight={800} fill={INK}>
              {d.label}
            </text>
            <g className="viz-pop">
              <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-cu)`} stroke="#6b3112" strokeWidth={0.8} />
              {2 * r > 14 && <circle cx={cx} cy={cy} r={r - 2.2} fill="none" stroke="#ffe2c4" strokeOpacity={0.55} strokeWidth={1} />}
            </g>
            <text x={cx} y={cy + maxR + 24} textAnchor="middle" fontSize={narrow ? 13 : 14} fontWeight={700} fill={INK} data-src={d.src}>
              <Size s={d.size} svg />
            </text>
            <text x={cx} y={cy + maxR + (narrow ? 42 : 44)} textAnchor="middle" fontSize={13} fill={MUTED} data-src={d.src}>
              {d.note}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** A 200 A dwelling service's copper conductor and grounding electrode conductor, and a 200 A feeder's EGC, to one scale. */
export function ServiceGroundDiscs() {
  return (
    <div>
      <ServiceDiscPlot narrow={false} />
      <ServiceDiscPlot narrow />
    </div>
  );
}
