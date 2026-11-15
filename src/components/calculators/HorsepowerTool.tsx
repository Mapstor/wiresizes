'use client';

// The horsepower to amps calculator in the look (WSZ-011; spec: research/page-specs-held.md "WSZ-011"; data gate BUILD
// on nec-430-flc): a motor's full-load current read from NEC Table 430.248 (single-phase), 430.250 (three-phase
// induction) or 430.247 (DC), the cell the horsepower and the voltage column pick, never a formula (430.6(A)). Beside
// it, the motor's rating in watts and the current of that power alone, as a comparison. No conductor, overload or
// breaker output: Article 430's sizing rules are unverified (nec-430-motors GAP). Engine: motorRun in
// src/lib/calculations/motor-flc.ts; its stepParts are the steps shown. Results appear only after Calculate; a share
// link restores them.
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Val } from '@/components/content/Val';
import { ValText } from '@/components/content/ValText';
import { ResultActions } from '@/components/look/ResultActions';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Field, Segmented, SelectInput } from '@/components/look/Form';
import { focusResults, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { buildQuery, choiceParam } from '@/lib/calculations/fields';
import { formatValue, indefiniteArticle } from '@/lib/calculations/format';
import {
  ENGINE_ID,
  TOOL_PHASES,
  hpRatings,
  hpText,
  isMotorRunError,
  motorRun,
  voltageColumns,
} from '@/lib/calculations/motor-flc';
import type { MotorRun, ToolPhase, VoltageColumn } from '@/lib/calculations/motor-flc';

const CALC = `calc:${ENGINE_ID}`;
const FLC = 'nec-430-flc';
const EXC = 'nec-2023-rule-excerpts';
const LINK = 'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]';
const PHASE_LABEL: Record<ToolPhase, string> = { '1': 'Single-phase AC', '3': 'Three-phase AC', dc: 'DC' };
const PHASE_WORD: Record<ToolPhase, string> = { '1': 'single-phase', '3': 'three-phase', dc: 'DC' };
const TABLE_ANCHOR: Record<ToolPhase, string> = { '1': '#single-phase', '3': '#three-phase', dc: '#dc' };

interface Inputs {
  phase: ToolPhase;
  hp: string;
  column: string;
}
const DEFAULTS: Inputs = { phase: '1', hp: '1', column: '230' };

/** The column with the nearest rated voltage in another table (DC 240 V → AC 230 V), or the same column. */
function nearestColumn(phase: ToolPhase, column: string): string {
  const columns = voltageColumns(phase);
  if (columns.some((c) => c.column === column)) return column;
  const v = Number(column);
  return columns.reduce((best, c) => (Math.abs(c.volts - v) < Math.abs(best.volts - v) ? c : best)).column;
}

type Outcome = { inputs: Inputs; r: MotorRun } | { inputs: Inputs; error: string };

function compute(i: Inputs): Outcome {
  const r = motorRun(i);
  return isMotorRunError(r) ? { inputs: i, error: 'These inputs fall outside the calculator.' } : { inputs: i, r };
}

function inputsFromQuery(params: URLSearchParams): Inputs {
  const phase = choiceParam(params, 'phase', TOOL_PHASES) ?? DEFAULTS.phase;
  const hp = choiceParam(params, 'hp', hpRatings(phase)) ?? DEFAULTS.hp;
  const column = choiceParam(params, 'v', voltageColumns(phase).map((c) => c.column)) ?? nearestColumn(phase, DEFAULTS.column);
  return { phase, hp, column };
}

const queryOf = (i: Inputs) => buildQuery({ phase: i.phase, hp: i.hp, v: i.column });

/** "220–240 V" or "208 V": the system voltages a column serves. */
function ColumnRange({ c, src }: { c: VoltageColumn; src: string }) {
  return c.min === c.max ? (
    <Val v={c.volts} unit="V" src={src} />
  ) : (
    <>
      {formatValue(c.min)}–<Val v={c.max} unit="V" src={src} />
    </>
  );
}

export function HorsepowerTool() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [result, setResult] = useState<Outcome | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const query = useMemo(() => (result ? queryOf(result.inputs) : ''), [result]);
  const { markChanged, shareUrl } = useUrlState(query, (params) => {
    const next = inputsFromQuery(params);
    setInputs(next);
    setResult(compute(next));
  });
  const update = (patch: Partial<Inputs>) => {
    markChanged();
    setInputs((prev) => ({ ...prev, ...patch }));
  };
  const onPhase = (phase: ToolPhase) =>
    update({
      phase,
      hp: hpRatings(phase).includes(inputs.hp) ? inputs.hp : DEFAULTS.hp,
      column: nearestColumn(phase, inputs.column),
    });
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    markChanged();
    setResult(compute(inputs));
    window.requestAnimationFrame(() => focusResults(headingRef.current));
  };
  const onReset = () => {
    markChanged();
    setInputs(DEFAULTS);
    setResult(null);
  };
  const dc = inputs.phase === 'dc';

  return (
    <div>
      <form onSubmit={onSubmit} noValidate aria-label="Horsepower to amps calculator">
        <div className="grid gap-x-10 gap-y-7 lg:grid-cols-2">
          <Segmented
            name="phase"
            legend="Motor"
            value={inputs.phase}
            options={TOOL_PHASES.map((p) => ({ value: p, label: PHASE_LABEL[p] }))}
            onChange={onPhase}
          />
          <Field id="hp" label="Horsepower" hint="The motor's rating.">
            <SelectInput id="hp" value={inputs.hp} onChange={(hp) => update({ hp })} describedById="hp-hint">
              {hpRatings(inputs.phase).map((hp) => (
                <option key={hp} value={hp} data-src={FLC}>
                  {hpText(hp)} hp
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field id="volts" label={dc ? 'Rated voltage' : 'System voltage'} hint={dc ? "The motor's rated voltage." : 'The voltage that supplies it.'}>
            <SelectInput id="volts" value={inputs.column} onChange={(column) => update({ column })} describedById="volts-hint">
              {voltageColumns(inputs.phase).map((c) => (
                <option key={c.column} value={c.column} data-src={FLC}>
                  {c.min === c.max ? `${formatValue(c.volts)} V` : `${formatValue(c.min)}–${formatValue(c.max)} V`}
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button type="submit" className={BUTTON_PRIMARY}>
            Calculate
          </button>
          <button type="button" onClick={onReset} className={BUTTON_SECONDARY}>
            Reset
          </button>
        </div>
      </form>

      {result && queryOf(result.inputs) !== queryOf(inputs) && (
        <p role="status" className="mt-6 text-[15px] font-semibold text-ink">
          The inputs have changed since this result. Press Calculate to update it.
        </p>
      )}
      {result && 'error' in result && (
        <p role="alert" className="mt-8 max-w-[38rem] border-t-2 border-ink pt-6 text-[17px] font-semibold text-ink">
          {result.error}
        </p>
      )}
      {result && 'r' in result && <Result inputs={result.inputs} r={result.r} headingRef={headingRef} shareUrl={shareUrl} />}
    </div>
  );
}

const BIG = 'mt-2 font-mono text-[34px] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[46px]';

function Result({
  inputs,
  r,
  headingRef,
  shareUrl,
}: {
  inputs: Inputs;
  r: MotorRun;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  shareUrl: () => string;
}) {
  const dc = inputs.phase === 'dc';
  const article = indefiniteArticle(inputs.hp) === 'an' ? 'An' : 'A';
  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none" data-src={FLC}>
        {article} {hpText(inputs.hp)} hp {PHASE_WORD[inputs.phase]} motor {dc ? 'rated' : 'at'} <ColumnRange c={r.column} src={FLC} />
      </h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <div className="border-t border-cut-rule pt-4">
          <h3 className="font-display text-[17px] font-semibold text-ink">Full-load current, Table {r.table}</h3>
          {r.flcA === null ? (
            <>
              <p className="mt-2 font-display text-[26px] font-semibold leading-tight text-ink">Not in the table</p>
              <p className="mt-2 text-[17px] text-ink" data-src={FLC}>
                The {hpText(inputs.hp)} hp row prints no current in the <Val v={r.column.volts} unit="V" src={FLC} /> column.
              </p>
            </>
          ) : (
            <>
              <p className={BIG} data-src={FLC}>
                <Val v={r.flcA} unit="A" src={FLC} />
              </p>
              <p className="mt-2 text-[17px] text-ink" data-src={FLC}>
                the <Val v={r.column.volts} unit="V" src={FLC} /> column
              </p>
            </>
          )}
        </div>
        <div className="border-t border-cut-rule pt-4">
          <h3 className="font-display text-[17px] font-semibold text-ink">Rated power</h3>
          <p className={BIG} data-src={CALC}>
            <Val v={r.watts} unit="W" src={CALC} format={{ upTo: 1 }} />
          </p>
          <p className="mt-2 text-[17px] text-ink" data-src={CALC}>
            or <Val v={r.watts / 1000} unit="kW" src={CALC} format={{ upTo: 3 }} />
          </p>
        </div>
      </div>
      {r.others.length > 0 && (
        <p className="mt-6 max-w-[38rem] text-[17px] leading-[1.65] text-ink" data-src={FLC}>
          {r.flcA === null ? 'The row prints ' : 'The same row: '}
          {r.others.map((o, k) => (
            <span key={o.column.column}>
              {k > 0 ? (k === r.others.length - 1 ? ' and ' : ', ') : null}
              <Val v={o.flcA} unit="A" src={FLC} /> at <Val v={o.column.volts} unit="V" src={FLC} />
            </span>
          ))}
          .
        </p>
      )}
      <ol className="mt-6 max-w-[38rem] list-decimal space-y-2 pl-6 text-[17px] leading-[1.65] text-ink" data-src={CALC}>
        {r.stepParts.map((parts, k) => (
          <li key={k}>
            <ValText parts={parts} />
          </li>
        ))}
      </ol>
      <p className="mt-8 max-w-[38rem] border-t border-cut-rule pt-4 text-[15px] leading-[1.6] text-[#333333]" data-src={EXC}>
        430.6(A) sizes the conductors, switches and short-circuit and ground-fault protection from the table current, not the nameplate&apos;s; the
        overload protection follows the nameplate current. This site does not size motor circuits yet.{' '}
        <a href={TABLE_ANCHOR[inputs.phase]} className={LINK}>
          Table {r.table} in full
        </a>
        .{' '}
        <Link href="/methodology#hp-method" className={LINK}>
          How the calculator works
        </Link>
        .
      </p>
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}
