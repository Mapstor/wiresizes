'use client';

// The wire size calculator in the look (WSZ-009b; spec: research/page-specs-held.md "WSZ-009"; D-35). A breaker or fuse
// rating gives the smallest conductor whose ampacity reaches it, in the Table 310.16 column the terminals allow
// (110.14(C); NM or UF cable at 60 °C), corrected for heat and bundling when the reader enters them, moved up by 240.4(D),
// with the Table 250.122 ground wire. A load current checks the 125 % continuous-load rule (210.20(A), 210.19(A)) and
// sets the voltage drop, which steps the size up to the reader's target with the ground wire in proportion (250.122(B)).
// Where 240.4(B) would let the rating protect the next smaller size, a note says so. Engine: sizeConductor in
// src/lib/calculations/conductor-sizing.ts; its stepParts are the steps shown. Results appear only after Calculate; a
// share link restores them, and links of the old tool (rating, amps, load, length, distance, phase, voltage, target) still
// work.
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Size } from '@/components/content/Size';
import { Val } from '@/components/content/Val';
import { ValText } from '@/components/content/ValText';
import { ResultActions } from '@/components/look/ResultActions';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, FIELD_HINT, Field, Segmented, SelectInput, TextInput, describedBy } from '@/components/look/Form';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '@/lib/calculations/fields';
import { formatValue } from '@/lib/calculations/format';
import { ambientRowFor, bandFor } from '@/lib/calculations/ampacity';
import type { TempUnit } from '@/lib/calculations/ampacity';
import {
  EGC_LARGER_THAN_CONDUCTOR_NOTE,
  ENGINE_ID,
  RATING_MAX_A,
  SIZING_ERROR_MESSAGES,
  WIRE_SIZE_DEFAULTS,
  WIRE_SIZE_RATINGS,
  isSizingError,
  ratingForContinuous,
  sizeConductor,
} from '@/lib/calculations/conductor-sizing';
import type { SizeConductorResult, Termination, WiringMethod } from '@/lib/calculations/conductor-sizing';
import { SINGLE_PHASE_VOLTS, THREE_PHASE_VOLTS, voltsAfterPhaseChange } from '@/lib/calculations/inputs';
import type { Phase } from '@/lib/calculations/inputs';
import { LENGTH_MAX_FT, LENGTH_MIN_FT, VD_TARGET_OPTIONS } from '@/lib/calculations/voltage-drop';
import { TERMINATION_RULES } from '@/lib/verified/nec-110-14c';
import { CONTINUOUS_LOAD_PERCENT, VOLTAGE_DROP_NOTE } from '@/lib/verified/nec-continuous-load-2023';
import type { Material } from '@/lib/verified/awg';

const CALC = `calc:${ENGINE_ID}`;
const OCPD = 'nec-240-ocpd';
const TERM = 'nec-110-14c';
const CONT = 'nec-continuous-load';
const VOLTS = 'us-nominal-voltages';
const LINK = 'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]';
const METAL: Record<Material, string> = { Cu: 'copper', Al: 'aluminum' };
const METAL_FULL: Record<Material, string> = { Cu: 'copper', Al: 'aluminum or copper-clad aluminum' };
const TEMP_LIMIT = { C: [-40, 150], F: [-40, 302] } as const;
const COUNT_MAX = 100;
/** The Table 310.15(B)(1)(1) row whose factors are 1.00, and the band without adjustment: no derating. */
const PLAIN_ROW = '26–30';
const PLAIN_BAND = '1–3';

interface Inputs {
  rating: string;
  material: Material;
  method: WiringMethod;
  termination: Termination;
  load: string;
  continuous: 'no' | 'yes';
  length: string;
  phase: Phase;
  volts: string;
  target: string;
  temp: string;
  unit: TempUnit;
  count: string;
}
const DEFAULTS: Inputs = {
  rating: String(WIRE_SIZE_DEFAULTS.ocpdA),
  material: 'Cu',
  method: 'cable',
  termination: 'unknown',
  load: '',
  continuous: 'no',
  length: String(WIRE_SIZE_DEFAULTS.lengthFt),
  phase: WIRE_SIZE_DEFAULTS.phase,
  volts: String(WIRE_SIZE_DEFAULTS.volts),
  target: String(WIRE_SIZE_DEFAULTS.vdTargetPct),
  temp: '30',
  unit: 'C',
  count: '3',
};

type Key = 'load' | 'length' | 'temp' | 'count';
type Errors = Partial<Record<Key, string>>;

const signed = (v: number) => (v < 0 ? `−${formatValue(-v)}` : formatValue(v));
const voltsFor = (phase: Phase) => (phase === 'three' ? THREE_PHASE_VOLTS : SINGLE_PHASE_VOLTS);

function errorsOf(i: Inputs): Errors {
  const e: Errors = {};
  if (i.load.trim() !== '') {
    const a = fieldNumber(i.load);
    const rating = Number(i.rating);
    if (!(a > 0 && a <= rating)) e.load = `Enter up to ${formatValue(rating)} A, or leave it empty.`;
    else if (i.continuous === 'yes') {
      const needed = ratingForContinuous(a);
      if (needed === null) e.load = `A continuous ${formatValue(a)} A load needs more than ${formatValue(RATING_MAX_A)} A.`;
      else if (rating < needed) e.load = `A continuous ${formatValue(a)} A load needs a ${formatValue(needed)} A breaker or larger.`;
    }
  }
  const ft = fieldNumber(i.length);
  if (!(ft >= LENGTH_MIN_FT && ft <= LENGTH_MAX_FT)) e.length = `Enter ${formatValue(LENGTH_MIN_FT)} to ${formatValue(LENGTH_MAX_FT)} ft.`;
  const t = fieldNumber(i.temp);
  const [lo, hi] = TEMP_LIMIT[i.unit];
  if (!(Number.isInteger(t) && t >= lo && t <= hi)) e.temp = `Enter whole degrees, ${signed(lo)} to ${signed(hi)} °${i.unit}.`;
  else if (!ambientRowFor(t, i.unit)) e.temp = 'NEC Table 310.15(B)(1)(1) gives no factor this hot.';
  const n = fieldNumber(i.count);
  if (!(Number.isInteger(n) && n >= 1 && n <= COUNT_MAX)) e.count = `Enter a whole number from 1 to ${COUNT_MAX}.`;
  return e;
}

type Outcome = { inputs: Inputs; r: SizeConductorResult } | { inputs: Inputs; error: string };

function compute(i: Inputs): Outcome | null {
  if (Object.keys(errorsOf(i)).length > 0) return null;
  const row = ambientRowFor(fieldNumber(i.temp), i.unit);
  const band = bandFor(fieldNumber(i.count));
  const derate = !!row && (row.key !== PLAIN_ROW || band !== PLAIN_BAND);
  const r = sizeConductor({
    ocpdA: Number(i.rating),
    material: i.material,
    wiringMethod: i.method,
    termination: i.method === 'cable' ? 'unknown' : i.termination,
    ambientRow: derate && row ? row.key : null,
    cccBand: derate && band !== PLAIN_BAND ? band : null,
    loadA: i.load.trim() === '' ? null : fieldNumber(i.load),
    continuous: i.continuous === 'yes',
    lengthFt: fieldNumber(i.length),
    volts: Number(i.volts),
    phase: i.phase,
    vdTargetPct: Number(i.target),
  });
  return isSizingError(r) ? { inputs: i, error: SIZING_ERROR_MESSAGES[r.error] } : { inputs: i, r };
}

function inputsFromQuery(params: URLSearchParams): Inputs {
  const phase = choiceParam(params, 'phase', ['single', 'three'] as const) ?? DEFAULTS.phase;
  const rating = choiceParam(params, 'rating', WIRE_SIZE_RATINGS) ?? choiceParam(params, 'amps', WIRE_SIZE_RATINGS);
  const volts = choiceParam(params, 'voltage', voltsFor(phase)) ?? voltsAfterPhaseChange(Number(DEFAULTS.volts), phase);
  const target = choiceParam(params, 'target', VD_TARGET_OPTIONS);
  return {
    rating: rating === null ? DEFAULTS.rating : String(rating),
    material: choiceParam(params, 'material', ['cu', 'al'] as const) === 'al' ? 'Al' : 'Cu',
    method: choiceParam(params, 'method', ['nm', 'c'] as const) === 'c' ? 'conductors' : 'cable',
    termination: choiceParam(params, 'terminals', ['unknown', '60', '75'] as const) ?? DEFAULTS.termination,
    load: numberParam(params, 'load') ?? '',
    continuous: choiceParam(params, 'continuous', ['no', 'yes'] as const) ?? 'no',
    length: numberParam(params, 'length', 'distance') ?? DEFAULTS.length,
    phase,
    volts: String(volts),
    target: target === null ? DEFAULTS.target : String(target),
    temp: numberParam(params, 'ambient') ?? DEFAULTS.temp,
    unit: choiceParam(params, 'unit', ['c', 'f'] as const) === 'f' ? 'F' : 'C',
    count: numberParam(params, 'ccc') ?? DEFAULTS.count,
  };
}

const queryOf = (i: Inputs) =>
  buildQuery({
    rating: i.rating,
    material: i.material.toLowerCase(),
    method: i.method === 'conductors' ? 'c' : 'nm',
    terminals: i.method === 'conductors' ? i.termination : '',
    load: i.load.trim(),
    continuous: i.continuous === 'yes' ? 'yes' : '',
    length: i.length.trim(),
    phase: i.phase,
    voltage: i.volts,
    target: i.target,
    ambient: i.temp.trim(),
    unit: i.unit.toLowerCase(),
    ccc: i.count.trim(),
  });

export function WireSizeTool() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [result, setResult] = useState<Outcome | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fieldErrors = useFieldErrors();
  const errors = errorsOf(inputs);
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
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      fieldErrors.revealAll(formRef.current);
      return;
    }
    markChanged();
    setResult(compute(inputs));
    window.requestAnimationFrame(() => focusResults(headingRef.current));
  };
  const onReset = () => {
    markChanged();
    fieldErrors.reset();
    setInputs(DEFAULTS);
    setResult(null);
  };
  const shown = (k: Key) => fieldErrors.shown(k, errors[k]);
  const text = (k: Key, label: string, hint: string) => (
    <Field id={k} label={label} hint={hint} error={shown(k)}>
      <TextInput
        id={k}
        value={inputs[k]}
        onChange={(v) => update({ [k]: v } as Partial<Inputs>)}
        onBlur={() => fieldErrors.touch(k)}
        error={shown(k)}
        describedById={describedBy(k, shown(k), true)}
        className="max-w-[12rem]"
      />
    </Field>
  );

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Wire size calculator">
        <div className="grid gap-x-10 gap-y-7 lg:grid-cols-2">
          <Field id="rating" label="Breaker or fuse rating" hint="The overcurrent device ahead of the circuit.">
            <SelectInput id="rating" value={inputs.rating} onChange={(rating) => update({ rating })} describedById="rating-hint">
              {WIRE_SIZE_RATINGS.map((a) => (
                <option key={a} value={String(a)} data-src={OCPD}>
                  {formatValue(a)} A
                </option>
              ))}
            </SelectInput>
          </Field>
          <Segmented
            name="material"
            legend="Conductor material"
            value={inputs.material === 'Cu' ? 'cu' : 'al'}
            options={[
              { value: 'cu', label: 'Copper' },
              { value: 'al', label: 'Aluminum or CCA' },
            ]}
            onChange={(m) => update({ material: m === 'al' ? 'Al' : 'Cu' })}
          />
          <Segmented
            name="method"
            legend="Wiring method"
            value={inputs.method}
            options={[
              { value: 'cable', label: 'NM or UF cable' },
              { value: 'conductors', label: 'Single conductors' },
            ]}
            onChange={(method) => update({ method })}
          />
          {inputs.method === 'conductors' ? (
            <div>
              <Segmented
                name="termination"
                legend="Terminals"
                value={inputs.termination}
                options={[
                  { value: 'unknown', label: 'Not sure' },
                  { value: '60', label: <>Marked <Val v={60} unit="°C" src={TERM} /></> },
                  { value: '75', label: <>Listed <Val v={75} unit="°C" src={TERM} /></> },
                ]}
                onChange={(termination) => update({ termination })}
              />
              <p className={FIELD_HINT} data-src={TERM}>
                Every terminal on the circuit counts. Not sure: <Val v={TERMINATION_RULES.columnAtOrBelowLimit} unit="°C" src={TERM} /> up to{' '}
                <Val v={TERMINATION_RULES.limitA} unit="A" src={TERM} />, <Val v={TERMINATION_RULES.columnAboveLimit} unit="°C" src={TERM} /> above.
              </p>
            </div>
          ) : (
            <p className="self-end text-[15px] leading-[1.6] text-[#333333]" data-src={TERM}>
              Cable stays in the <Val v={TERMINATION_RULES.cableColumn} unit="°C" src={TERM} /> column, corrections included. Choose it when not
              sure.
            </p>
          )}
          {text('load', 'Load current, A', 'Optional. Sets the voltage drop and the continuous check.')}
          <div>
            <Segmented
              name="continuous"
              legend="Continuous load"
              value={inputs.continuous}
              options={[
                { value: 'no', label: 'No' },
                { value: 'yes', label: 'Yes' },
              ]}
              onChange={(continuous) => update({ continuous })}
            />
            <p className={FIELD_HINT} data-src={CONT}>
              Yes applies the <Val v={CONTINUOUS_LOAD_PERCENT} unit="%" src={CONT} /> rule of NEC 210.20(A).
            </p>
          </div>
          {text('length', 'Length, ft', 'One way, as the wire runs.')}
          <div className="space-y-4">
            <Segmented
              name="phase"
              legend="Circuit"
              value={inputs.phase}
              options={[
                { value: 'single', label: 'Single-phase' },
                { value: 'three', label: 'Three-phase' },
              ]}
              onChange={(phase) => update({ phase, volts: String(voltsAfterPhaseChange(Number(inputs.volts), phase)) })}
            />
            <Segmented
              name="volts"
              legend={inputs.phase === 'three' ? 'Voltage, line to line' : 'Voltage'}
              value={inputs.volts}
              options={voltsFor(inputs.phase).map((v) => ({ value: String(v), label: <Val v={v} unit="V" src={VOLTS} /> }))}
              onChange={(volts) => update({ volts })}
            />
          </div>
          <Field id="target" label="Voltage-drop target" hint="The size steps up until the drop is within it.">
            <SelectInput id="target" value={inputs.target} onChange={(target) => update({ target })} describedById="target-hint">
              {VD_TARGET_OPTIONS.map((p) => (
                <option key={p} value={String(p)} data-src="input">
                  {formatValue(p)} %
                </option>
              ))}
            </SelectInput>
          </Field>
          <div className="space-y-4">
            {text('temp', 'Ambient temperature', 'Where the wire runs, in whole degrees.')}
            <Segmented
              name="unit"
              legend="Temperature unit"
              srLegend
              value={inputs.unit}
              options={[
                { value: 'C', label: '°C' },
                { value: 'F', label: '°F' },
              ]}
              onChange={(unit) => update({ unit })}
            />
          </div>
          {text('count', 'Current-carrying conductors', 'In the raceway or cable; more than three lowers the ampacity.')}
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

const ROW = 'border-b border-cut-rule';
const TH = 'py-2 pr-4 text-left font-normal';
const TD = 'whitespace-nowrap py-2 pl-4 text-right font-mono tabular-nums';
const NOTE = 'max-w-[38rem] text-[17px] leading-[1.65] text-ink';

function Result({
  inputs,
  r,
  headingRef,
  shareUrl,
}: {
  inputs: Inputs;
  r: SizeConductorResult;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  shareUrl: () => string;
}) {
  const rating = Number(inputs.rating);
  const load = inputs.load.trim() === '' ? rating : fieldNumber(inputs.load);
  const below = r.nextSizeUp;
  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none">
        <Val v={rating} unit="A" src="input" /> breaker or fuse, {METAL[inputs.material]}, <Val v={fieldNumber(inputs.length)} unit="ft" src="input" />{' '}
        one way
      </h2>
      <p className="mt-3 font-mono text-[34px] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[46px]" data-src={CALC}>
        <Size s={r.size} />
      </p>
      <p className="mt-2 text-[17px] text-ink" data-src={CALC}>
        {METAL_FULL[inputs.material]}
        {r.egc ? (
          <>
            , with a <Size s={r.egc} /> ground wire
          </>
        ) : null}
      </p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full max-w-[38rem] border-collapse text-[15px]" data-src={CALC}>
          <caption className="sr-only">Wire size result</caption>
          <tbody>
            <tr className={`${ROW} border-t-2 border-t-ink`}>
              <th scope="row" className={TH}>
                Size the rating needs{r.limitedBy240_4D ? ', after 240.4(D)' : ''}
              </th>
              <td className={TD}>
                <Size s={r.minSizeByAmpacity} />
              </td>
            </tr>
            <tr className={ROW}>
              <th scope="row" className={TH}>
                {r.startColumnC === null ? (
                  <>
                    Its ampacity, <Val v={r.columnC} unit="°C" src={CALC} /> column
                  </>
                ) : (
                  'Its corrected ampacity'
                )}
              </th>
              <td className={TD}>
                <Val v={r.minAmpacity} unit="A" src={CALC} format={{ upTo: 1 }} />
              </td>
            </tr>
            <tr className={ROW}>
              <th scope="row" className={TH}>
                Voltage drop with <Size s={r.size} /> at <Val v={load} unit="A" src="input" format={{ upTo: 1 }} />
              </th>
              <td className={TD}>
                <Val v={r.vdVolts} unit="V" src={CALC} format={{ fixed: 2 }} />, <Val v={r.vdPct} unit="%" src={CALC} format={{ fixed: 2 }} />
              </td>
            </tr>
            <tr className={ROW}>
              <th scope="row" className={TH}>
                Ground wire{r.egcUpsized ? ', enlarged in proportion' : ''}
              </th>
              <td className={TD}>{r.egc ? <Size s={r.egc} /> : 'none large enough'}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-5 space-y-3">
        {!r.meetsTarget && (
          <p className={`${NOTE} font-semibold`} data-src={CALC}>
            Even the largest size in Table 310.16 stays above your <Val v={Number(inputs.target)} unit="%" src="input" /> target.
          </p>
        )}
        {r.egc && r.egcLargerThanConductor && <p className={NOTE}>{EGC_LARGER_THAN_CONDUCTOR_NOTE}</p>}
        {below && (
          <p className={NOTE} data-src={OCPD}>
            NEC 240.4(B) also lets this <Val v={rating} unit="A" src="input" /> breaker or fuse protect <Size s={below.size} /> {METAL[inputs.material]},
            good for <Val v={below.ampacity} unit="A" src={CALC} format={{ upTo: 1 }} /> here, when the load is at most{' '}
            <Val v={below.maxLoadA} unit="A" src={CALC} format={{ upTo: 1 }} /> (<Val v={below.maxContinuousA} unit="A" src={CALC} format={{ upTo: 1 }} /> if
            continuous) and the circuit does not supply more than one receptacle for cord-and-plug-connected portable loads.
          </p>
        )}
      </div>
      <ol className="mt-6 max-w-[38rem] list-decimal space-y-2 pl-6 text-[17px] leading-[1.65] text-ink" data-src={CALC}>
        {r.stepParts.map((parts, k) => (
          <li key={k}>
            <ValText parts={parts} />
          </li>
        ))}
      </ol>
      <p className="mt-8 max-w-[38rem] border-t border-cut-rule pt-4 text-[15px] leading-[1.6] text-[#333333]" data-src={CONT}>
        The drop target is yours. An informational note in the 2023 NEC (215.2(A)) ties a feeder drop of up to{' '}
        <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={CONT} />, and <Val v={VOLTAGE_DROP_NOTE.totalPct} unit="%" src={CONT} /> for feeder and
        branch circuit together, to reasonable efficiency: advice, not a rule. A dwelling service is sized from Table 310.12 instead: see the{' '}
        <Link href="/calculators/service-entrance-calculator" className={LINK}>
          service entrance calculator
        </Link>
        .{' '}
        <Link href="/methodology#wire-size-method" className={LINK}>
          How the calculator picks a size
        </Link>
        .
      </p>
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}
