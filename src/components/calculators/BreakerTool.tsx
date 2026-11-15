'use client';

// The circuit breaker calculator in the look (WSZ-009c; spec: research/page-specs-held.md "WSZ-009"; D-35, D-40): a
// continuous and a noncontinuous load give the smallest rating 210.20(A) allows (the noncontinuous load plus 125 % of the
// continuous load), the next standard rating of Table 240.6(A), the wire for that rating in the column the terminals
// allow (110.14(C); NM or UF cable at 60 °C), the 240.4(D) moves and the Table 250.122 ground wire. Where 240.4(B) lets
// the rating protect the next smaller size and that size still carries the minimum (210.19(A)), a note says so. Engine:
// breakerRun in src/lib/calculations/breaker-sizing.ts; its stepParts are the steps shown. Results appear only after
// Calculate; a share link restores them.
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Size } from '@/components/content/Size';
import { Val } from '@/components/content/Val';
import { ValText } from '@/components/content/ValText';
import { ResultActions } from '@/components/look/ResultActions';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, FIELD_HINT, Field, Segmented, TextInput, describedBy } from '@/components/look/Form';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '@/lib/calculations/fields';
import { formatValue, indefiniteArticle } from '@/lib/calculations/format';
import { BREAKER_ERROR_MESSAGES, ENGINE_ID, breakerRun, isBreakerError, minimumRating } from '@/lib/calculations/breaker-sizing';
import type { BreakerRun } from '@/lib/calculations/breaker-sizing';
import { EGC_LARGER_THAN_CONDUCTOR_NOTE, RATING_MAX_A } from '@/lib/calculations/conductor-sizing';
import type { Termination, WiringMethod } from '@/lib/calculations/conductor-sizing';
import { TERMINATION_RULES } from '@/lib/verified/nec-110-14c';
import { CONTINUOUS_LOAD_PERCENT } from '@/lib/verified/nec-continuous-load-2023';
import { TABLE_AMBIENT } from '@/lib/verified/nec-310-16';
import type { Material } from '@/lib/verified/awg';

const CALC = `calc:${ENGINE_ID}`;
const TERM = 'nec-110-14c';
const CONT = 'nec-continuous-load';
const OCPD = 'nec-240-ocpd';
const LINK = 'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]';
const METAL: Record<Material, string> = { Cu: 'copper', Al: 'aluminum' };
const METAL_FULL: Record<Material, string> = { Cu: 'copper', Al: 'aluminum or copper-clad aluminum' };

interface Inputs {
  continuous: string;
  noncontinuous: string;
  material: Material;
  method: WiringMethod;
  termination: Termination;
}
const DEFAULTS: Inputs = { continuous: '16', noncontinuous: '', material: 'Cu', method: 'cable', termination: 'unknown' };

// Each hint and each error fits one line down to a 320 px screen, so an error that appears on blur never moves
// Calculate between mousedown and mouseup (WSZ-009a).
type Key = 'continuous' | 'noncontinuous';
type Errors = Partial<Record<Key, string>>;

/** An empty field counts as 0 A; anything else must be a number of 0 A or more. */
const loadOf = (text: string) => (text.trim() === '' ? 0 : fieldNumber(text));

function errorsOf(i: Inputs): Errors {
  const e: Errors = {};
  const c = loadOf(i.continuous);
  const n = loadOf(i.noncontinuous);
  if (!(c >= 0)) e.continuous = 'Enter 0 A or more.';
  if (!(n >= 0)) e.noncontinuous = 'Enter 0 A or more.';
  if (!e.continuous && !e.noncontinuous) {
    if (!(c + n > 0)) e.continuous = 'Enter a load here or below.';
    else if (minimumRating(c, n) > RATING_MAX_A) e.continuous = `Needs over ${formatValue(RATING_MAX_A)} A, past this tool.`;
  }
  return e;
}

type Outcome = { inputs: Inputs; r: BreakerRun } | { inputs: Inputs; error: string };

function compute(i: Inputs): Outcome | null {
  if (Object.keys(errorsOf(i)).length > 0) return null;
  const r = breakerRun({
    continuousA: loadOf(i.continuous),
    noncontinuousA: loadOf(i.noncontinuous),
    material: i.material,
    wiringMethod: i.method,
    termination: i.method === 'cable' ? 'unknown' : i.termination,
  });
  return isBreakerError(r) ? { inputs: i, error: BREAKER_ERROR_MESSAGES[r.error] } : { inputs: i, r };
}

function inputsFromQuery(params: URLSearchParams): Inputs {
  return {
    continuous: numberParam(params, 'cont') ?? (params.has('noncont') ? '' : DEFAULTS.continuous),
    noncontinuous: numberParam(params, 'noncont') ?? (params.has('cont') ? '' : DEFAULTS.noncontinuous),
    material: choiceParam(params, 'material', ['cu', 'al'] as const) === 'al' ? 'Al' : 'Cu',
    method: choiceParam(params, 'method', ['nm', 'c'] as const) === 'c' ? 'conductors' : 'cable',
    termination: choiceParam(params, 'terminals', ['unknown', '60', '75'] as const) ?? DEFAULTS.termination,
  };
}

const queryOf = (i: Inputs) =>
  buildQuery({
    cont: i.continuous.trim(),
    noncont: i.noncontinuous.trim(),
    material: i.material.toLowerCase(),
    method: i.method === 'conductors' ? 'c' : 'nm',
    terminals: i.method === 'conductors' ? i.termination : '',
  });

/** The wire size calculator with this rating, wire and load filled in. */
function wireSizeHref(i: Inputs, r: BreakerRun): string {
  const c = loadOf(i.continuous);
  const n = loadOf(i.noncontinuous);
  return `/calculators/wire-size-calculator?${buildQuery({
    rating: r.breakerA,
    material: i.material.toLowerCase(),
    method: i.method === 'conductors' ? 'c' : 'nm',
    terminals: i.method === 'conductors' ? i.termination : '',
    load: c + n,
    continuous: n === 0 ? 'yes' : '',
  })}`;
}

export function BreakerTool() {
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
      <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Circuit breaker calculator">
        <div className="grid gap-x-10 gap-y-7 lg:grid-cols-2">
          {text('continuous', 'Continuous load, A', 'Leave it empty if none.')}
          {text('noncontinuous', 'Noncontinuous load, A', 'Leave it empty if none.')}
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
                <Val v={TERMINATION_RULES.columnAboveLimit} unit="°C" src={TERM} /> only if every terminal is listed for it. Not sure:{' '}
                <Val v={TERMINATION_RULES.columnAtOrBelowLimit} unit="°C" src={TERM} /> up to <Val v={TERMINATION_RULES.limitA} unit="A" src={TERM} />,{' '}
                <Val v={TERMINATION_RULES.columnAboveLimit} unit="°C" src={TERM} /> above.
              </p>
            </div>
          ) : (
            <p className="self-end text-[15px] leading-[1.6] text-[#333333]" data-src={TERM}>
              Cable stays in the <Val v={TERMINATION_RULES.cableColumn} unit="°C" src={TERM} /> column. Choose it when not sure.
            </p>
          )}
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
  r: BreakerRun;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  shareUrl: () => string;
}) {
  const c = loadOf(inputs.continuous);
  const n = loadOf(inputs.noncontinuous);
  const below = r.below;
  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none">
        <Val v={c} unit="A" src="input" /> continuous and <Val v={n} unit="A" src="input" /> noncontinuous, {METAL[inputs.material]}
      </h2>
      <p className="mt-3 font-mono text-[34px] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[46px]" data-src={CALC}>
        <Val v={r.breakerA} unit="A" src={CALC} />
      </p>
      <p className="mt-2 text-[17px] text-ink" data-src={CALC}>
        breaker or fuse, on <Size s={r.size} /> {METAL_FULL[inputs.material]}
        {r.egc ? (
          <>
            {' '}
            with {indefiniteArticle(r.egc)} <Size s={r.egc} /> ground wire
          </>
        ) : null}
      </p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full max-w-[38rem] border-collapse text-[15px]" data-src={CALC}>
          <caption className="sr-only">Circuit breaker result</caption>
          <tbody>
            <tr className={`${ROW} border-t-2 border-t-ink`}>
              <th scope="row" className={TH}>
                Smallest rating the load allows
              </th>
              <td className={TD}>
                <Val v={r.minOcpdA} unit="A" src={CALC} format={{ upTo: 2 }} />
              </td>
            </tr>
            <tr className={ROW}>
              <th scope="row" className={TH}>
                Next standard rating
              </th>
              <td className={TD}>
                <Val v={r.breakerA} unit="A" src={CALC} />
              </td>
            </tr>
            <tr className={ROW}>
              <th scope="row" className={TH}>
                Wire for the rating, <Val v={r.columnC} unit="°C" src={CALC} /> column
              </th>
              <td className={TD}>
                <Size s={r.size} /> (<Val v={r.ampacity} unit="A" src={CALC} />)
              </td>
            </tr>
            <tr className={ROW}>
              <th scope="row" className={TH}>
                Ground wire
              </th>
              <td className={TD}>{r.egc ? <Size s={r.egc} /> : '–'}</td>
            </tr>
            <tr className={ROW}>
              <th scope="row" className={TH}>
                Largest continuous load on it
              </th>
              <td className={TD}>
                <Val v={r.maxContinuousA} unit="A" src={CALC} format={{ upTo: 1 }} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {r.egc && r.egcLargerThanConductor && <p className={`mt-5 ${NOTE}`}>{EGC_LARGER_THAN_CONDUCTOR_NOTE}</p>}
      {below && (
        <p className={`mt-5 ${NOTE}`} data-src={OCPD}>
          NEC 240.4(B) also lets this <Val v={r.breakerA} unit="A" src={CALC} /> breaker or fuse protect <Size s={below.size} /> {METAL[inputs.material]},
          good for <Val v={below.ampacity} unit="A" src={CALC} /> here, which still carries the{' '}
          <Val v={r.minOcpdA} unit="A" src={CALC} format={{ upTo: 2 }} /> this load needs (NEC 210.19(A)), when the circuit does not supply more than
          one receptacle for cord-and-plug-connected portable loads.
        </p>
      )}
      <ol className="mt-6 max-w-[38rem] list-decimal space-y-2 pl-6 text-[17px] leading-[1.65] text-ink" data-src={CALC}>
        {r.stepParts.map((parts, k) => (
          <li key={k}>
            <ValText parts={parts} />
          </li>
        ))}
      </ol>
      <p className="mt-8 max-w-[38rem] border-t border-cut-rule pt-4 text-[15px] leading-[1.6] text-[#333333]" data-src={CONT}>
        The wire here carries the rating at <Val v={TABLE_AMBIENT.c} unit="°C" src="nec-310-16" /> with no more than three current-carrying conductors. For a long
        run, heat or bundling, open{' '}
        <Link href={wireSizeHref(inputs, r)} className={LINK}>
          this circuit in the wire size calculator
        </Link>
        . A breaker and its assembly listed for <Val v={100} unit="%" src={CONT} /> operation are not covered: this sizes a standard one, at{' '}
        <Val v={CONTINUOUS_LOAD_PERCENT} unit="%" src={CONT} /> of the continuous load.{' '}
        <Link href="/methodology#breaker-method" className={LINK}>
          How the calculator picks a breaker
        </Link>
        .
      </p>
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}
