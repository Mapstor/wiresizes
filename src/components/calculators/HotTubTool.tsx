'use client';

// The hot tub calculator in the look (WSZ-011d; makers' data WSZ-035). The breaker the hot tub's manual asks for, at
// 240 V or 120 V, in copper (every reviewed maker rules out aluminum): the wire size engine's conductor, ground wire and
// voltage drop over the run, four wires at 240 V, and the makers' GFCI requirement. Results appear only after
// Calculate; a share link restores them.
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Num } from '@/components/content/Num';
import { Size } from '@/components/content/Size';
import { Val } from '@/components/content/Val';
import { ValText } from '@/components/content/ValText';
import { ResultActions } from '@/components/look/ResultActions';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, FIELD_HINT, Field, Segmented, SelectInput, TextInput, describedBy } from '@/components/look/Form';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '@/lib/calculations/fields';
import { formatValue } from '@/lib/calculations/format';
import type { Termination, WiringMethod } from '@/lib/calculations/conductor-sizing';
import { LENGTH_MAX_FT, LENGTH_MIN_FT, VD_TARGET_OPTIONS } from '@/lib/calculations/voltage-drop';
import { HT_BREAKERS, HT_CALC, hotTub } from '@/lib/calculations/hot-tub';
import type { HotTubRun } from '@/lib/calculations/hot-tub';
import { TERMINATION_RULES } from '@/lib/verified/nec-110-14c';
import { MFR_SPAS_DOMAIN } from '@/lib/verified/mfr-spas';

const CALC = HT_CALC;
const SPAS = MFR_SPAS_DOMAIN;
const TERM = 'nec-110-14c';
const LINK = 'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]';

interface Inputs {
  volts: 240 | 120;
  breaker: string;
  method: WiringMethod;
  termination: Termination;
  length: string;
  target: string;
}
const DEFAULTS: Inputs = { volts: 240, breaker: '50', method: 'conductors', termination: 'unknown', length: '50', target: '3' };

type Errors = Partial<Record<'length', string>>;
function errorsOf(i: Inputs): Errors {
  const ft = fieldNumber(i.length);
  return ft >= LENGTH_MIN_FT && ft <= LENGTH_MAX_FT ? {} : { length: `Enter ${formatValue(LENGTH_MIN_FT)} to ${formatValue(LENGTH_MAX_FT)} ft.` };
}

/** The breaker kept when the voltage changes, else the nearest one offered at the new voltage. */
function fitBreaker(volts: 240 | 120, breaker: string): string {
  const options = HT_BREAKERS[volts];
  const b = Number(breaker);
  if (options.includes(b)) return breaker;
  return String(options.reduce((best, x) => (Math.abs(x - b) < Math.abs(best - b) ? x : best), options[0]));
}

type Outcome = { inputs: Inputs; run: HotTubRun } | { inputs: Inputs; error: string };
function compute(i: Inputs): Outcome | null {
  if (Object.keys(errorsOf(i)).length > 0) return null;
  const r = hotTub({
    volts: i.volts,
    breakerA: Number(i.breaker),
    wiringMethod: i.method,
    termination: i.method === 'cable' ? 'unknown' : i.termination,
    lengthFt: fieldNumber(i.length),
    vdTargetPct: Number(i.target),
  });
  return 'error' in r ? { inputs: i, error: r.error } : { inputs: i, run: r };
}

function inputsFromQuery(params: URLSearchParams): Inputs {
  const volts = choiceParam(params, 'volts', ['240', '120'] as const) === '120' ? 120 : 240;
  const target = choiceParam(params, 'target', VD_TARGET_OPTIONS);
  return {
    volts,
    breaker: fitBreaker(volts, numberParam(params, 'breaker') ?? DEFAULTS.breaker),
    method: choiceParam(params, 'method', ['cable', 'c'] as const) === 'cable' ? 'cable' : 'conductors',
    termination: choiceParam(params, 'terminals', ['unknown', '60', '75'] as const) ?? DEFAULTS.termination,
    length: numberParam(params, 'length') ?? DEFAULTS.length,
    target: target === null ? DEFAULTS.target : String(target),
  };
}

const queryOf = (i: Inputs) =>
  buildQuery({
    volts: i.volts,
    breaker: i.breaker,
    method: i.method === 'cable' ? 'cable' : 'c',
    terminals: i.method === 'conductors' ? i.termination : '',
    length: i.length.trim(),
    target: i.target,
  });

export function HotTubTool() {
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
    setInputs((prev) => {
      const next = { ...prev, ...patch };
      return { ...next, breaker: fitBreaker(next.volts, next.breaker) };
    });
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
  const shownLength = fieldErrors.shown('length', errors.length);

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Hot tub calculator">
        <div className="grid gap-x-10 gap-y-7 lg:grid-cols-2">
          <Segmented
            name="volts"
            legend="Hot tub voltage"
            value={String(inputs.volts)}
            options={[
              { value: '240', label: <span data-src={SPAS}>240 V, hardwired</span> },
              { value: '120', label: <span data-src={SPAS}>120 V, plug-in</span> },
            ]}
            onChange={(v) => update({ volts: v === '120' ? 120 : 240 })}
          />
          <Field id="breaker" label="Breaker in the hot tub’s manual" hint={<span data-src={SPAS}>Most 240 V hot tubs ask for 50 A.</span>}>
            <SelectInput id="breaker" value={inputs.breaker} onChange={(breaker) => update({ breaker })} describedById="breaker-hint">
              {HT_BREAKERS[inputs.volts].map((a) => (
                <option key={a} value={String(a)} data-src="input">
                  {a} A
                </option>
              ))}
            </SelectInput>
          </Field>
          <Segmented
            name="method"
            legend="Wiring method"
            value={inputs.method}
            options={[
              { value: 'conductors', label: 'Single conductors' },
              { value: 'cable', label: 'UF or NM cable' },
            ]}
            onChange={(method) => update({ method })}
          />
          {inputs.method === 'conductors' ? (
            <div>
              <Segmented
                name="termination"
                legend="Terminal rating"
                value={inputs.termination}
                options={[
                  { value: 'unknown', label: 'Not sure' },
                  { value: '60', label: <Val v={TERMINATION_RULES.columnAtOrBelowLimit} unit="°C" src={TERM} /> },
                  { value: '75', label: <Val v={TERMINATION_RULES.columnAboveLimit} unit="°C" src={TERM} /> },
                ]}
                onChange={(termination) => update({ termination })}
              />
              <p className={FIELD_HINT} data-src={TERM}>
                <Val v={TERMINATION_RULES.columnAboveLimit} unit="°C" src={TERM} /> only if the breaker, the disconnect and the hot tub are listed for it.
              </p>
            </div>
          ) : (
            <p className="self-end text-[15px] leading-[1.6] text-[#333333]" data-src={TERM}>
              Cable stays in the <Val v={TERMINATION_RULES.cableColumn} unit="°C" src={TERM} /> column.
            </p>
          )}
          <Field id="length" label="One-way length, ft" hint="Panel to the hot tub, through the disconnect." error={shownLength}>
            <TextInput
              id="length"
              value={inputs.length}
              onChange={(length) => update({ length })}
              onBlur={() => fieldErrors.touch('length')}
              error={shownLength}
              describedById={describedBy('length', shownLength, true)}
              inputMode="numeric"
              className="max-w-[12rem]"
            />
          </Field>
          <Field id="target" label="Voltage drop target" hint="Your own limit for the run.">
            <SelectInput id="target" value={inputs.target} onChange={(target) => update({ target })} describedById="target-hint">
              {VD_TARGET_OPTIONS.map((p) => (
                <option key={p} value={String(p)} data-src="input">
                  {formatValue(p)} %
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>
        <p className={FIELD_HINT}>Copper only: every hot tub maker we checked rules out aluminum.</p>
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
      {result && 'run' in result && <TubResult inputs={result.inputs} r={result.run} headingRef={headingRef} shareUrl={shareUrl} />}
    </div>
  );
}

const BIG = 'mt-2 font-mono text-[34px] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[46px]';
const PANEL = 'border-t border-cut-rule pt-4';
const PANEL_H = 'font-display text-[17px] font-semibold text-ink';
const SUB = 'mt-2 text-[17px] text-ink';
const STEPS = 'mt-6 max-w-[38rem] list-decimal space-y-2 pl-6 text-[17px] leading-[1.65] text-ink';
const NOTE = 'mt-8 max-w-[38rem] border-t border-cut-rule pt-4 text-[15px] leading-[1.6] text-[#333333]';

type HeadingRef = React.RefObject<HTMLHeadingElement | null>;

function TubResult({ inputs, r, headingRef, shareUrl }: { inputs: Inputs; r: HotTubRun; headingRef: HeadingRef; shareUrl: () => string }) {
  const f = r.feeder;
  const stepped = f.size !== f.minSizeByAmpacity;
  const wireSizeHref = `/calculators/wire-size-calculator?${buildQuery({
    rating: inputs.breaker,
    material: 'cu',
    method: inputs.method === 'conductors' ? 'c' : 'nm',
    terminals: inputs.method === 'conductors' ? inputs.termination : '',
    length: inputs.length.trim(),
    phase: 'single',
    voltage: inputs.volts,
    target: inputs.target,
  })}`;
  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none">
        A <Val v={Number(inputs.breaker)} unit="A" src="input" />, <Val v={inputs.volts} unit="V" src={SPAS} /> hot tub,{' '}
        <Val v={fieldNumber(inputs.length)} unit="ft" src="input" /> one way
      </h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <div className={PANEL}>
          <h3 className={PANEL_H}>Copper wire</h3>
          <p className={BIG} data-src={CALC}>
            <Size s={f.size} />
          </p>
          <p className={SUB} data-src={CALC}>
            {stepped ? (
              <>
                for the drop; <Size s={f.minSizeByAmpacity} /> carries the breaker
              </>
            ) : (
              <>
                <Val v={f.ampacity} unit="A" src={CALC} /> at <Val v={f.columnC} unit="°C" src={CALC} />
              </>
            )}
          </p>
        </div>
        <div className={PANEL}>
          <h3 className={PANEL_H}>Ground wire</h3>
          <p className={BIG} data-src={CALC}>
            {f.egc ? <Size s={f.egc} /> : '–'}
          </p>
          <p className={SUB}>copper, Table 250.122</p>
        </div>
        <div className={PANEL}>
          <h3 className={PANEL_H}>Voltage drop</h3>
          <p className={BIG} data-src={CALC}>
            <Val v={f.vdPct} unit="%" src={CALC} format={{ fixed: 2 }} />
          </p>
          <p className={SUB} data-src={CALC}>
            <Val v={f.vdVolts} unit="V" src={CALC} format={{ fixed: 2 }} /> at the full <Val v={Number(inputs.breaker)} unit="A" src="input" />
          </p>
        </div>
        <div className={PANEL}>
          <h3 className={PANEL_H}>Wires</h3>
          <p className={BIG} data-src={CALC}>
            <Num v={r.wires} src={CALC} />
          </p>
          <p className={SUB}>{r.wires === 4 ? 'two hots, neutral, ground' : 'hot, neutral, ground'}</p>
        </div>
      </div>
      <ol className={STEPS} data-src={CALC}>
        {r.stepParts.map((parts, k) => (
          <li key={k}>
            <ValText parts={parts} />
          </li>
        ))}
      </ol>
      <p className={NOTE} data-src={SPAS}>
        Follow the hot tub&apos;s own manual where it asks for more: Marquis, for one, asks for an{' '}
        <Size s="8" /> ground wire on its <Val v={50} unit="A" src={SPAS} /> hot tubs.{' '}
        <Link href={wireSizeHref} className={LINK}>
          Open this circuit in the wire size calculator
        </Link>{' '}
        for heat or bundling.{' '}
        <Link href="/methodology#hot-tub-method" className={LINK}>
          How the calculator works
        </Link>
        .
      </p>
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}
