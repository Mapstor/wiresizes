'use client';

// The dryer calculator in the look (WSZ-010c; spec: research/page-specs-held.md "WSZ-010"; D-42): an electric clothes
// dryer's two numbers, kept apart: its load on a feeder or service under NEC 2023 220.54 and Table 220.54, and its own
// branch circuit, rated as the dryer's instructions give, with the wire and ground wire for that rating. Engine:
// dryerRun in src/lib/calculations/dryer-circuit.ts; its stepParts are the steps shown. Results appear only after
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
import { formatValue, indefiniteArticle } from '@/lib/calculations/format';
import { DRYERS_MAX, DRYER_CIRCUITS, ENGINE_ID, dryerRun, isDryerError } from '@/lib/calculations/dryer-circuit';
import type { DryerRun, DryerVolts } from '@/lib/calculations/dryer-circuit';
import { EGC_LARGER_THAN_CONDUCTOR_NOTE } from '@/lib/calculations/conductor-sizing';
import type { Termination, WiringMethod } from '@/lib/calculations/conductor-sizing';
import { TERMINATION_RULES } from '@/lib/verified/nec-110-14c';
import { MFR_DOMAIN } from '@/lib/verified/mfr-equipment';
import type { Material } from '@/lib/verified/awg';

const CALC = `calc:${ENGINE_ID}`;
const TERM = 'nec-110-14c';
const L = 'nec-220-load-calcs';
const EXC = 'nec-2023-rule-excerpts';
const LINK = 'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]';
const METAL_FULL: Record<Material, string> = { Cu: 'copper', Al: 'aluminum or copper-clad aluminum' };

interface Inputs {
  nameplate: string;
  dryers: string;
  volts: DryerVolts;
  circuit: string;
  material: Material;
  method: WiringMethod;
  termination: Termination;
}
const DEFAULTS: Inputs = { nameplate: '5600', dryers: '1', volts: 240, circuit: '30', material: 'Cu', method: 'cable', termination: 'unknown' };

// Each hint and each error fits one line down to a 320 px screen (WSZ-009a).
type Key = 'nameplate' | 'dryers';
type Errors = Partial<Record<Key, string>>;

function errorsOf(i: Inputs): Errors {
  const e: Errors = {};
  if (!(fieldNumber(i.nameplate) > 0)) e.nameplate = 'Enter the nameplate watts.';
  const n = fieldNumber(i.dryers);
  if (!(Number.isInteger(n) && n >= 1)) e.dryers = 'Enter a whole number, 1 or more.';
  else if (n > DRYERS_MAX) e.dryers = `Up to ${formatValue(DRYERS_MAX)} dryers.`;
  return e;
}

type Outcome = { inputs: Inputs; r: DryerRun } | { inputs: Inputs; error: string };

function compute(i: Inputs): Outcome | null {
  if (Object.keys(errorsOf(i)).length > 0) return null;
  const r = dryerRun({
    nameplateW: fieldNumber(i.nameplate),
    dryers: fieldNumber(i.dryers),
    volts: i.volts,
    circuitA: Number(i.circuit),
    material: i.material,
    wiringMethod: i.method,
    termination: i.method === 'cable' ? 'unknown' : i.termination,
  });
  return isDryerError(r) ? { inputs: i, error: 'These inputs fall outside the calculator.' } : { inputs: i, r };
}

function inputsFromQuery(params: URLSearchParams): Inputs {
  return {
    nameplate: numberParam(params, 'w') ?? DEFAULTS.nameplate,
    dryers: numberParam(params, 'n') ?? DEFAULTS.dryers,
    volts: choiceParam(params, 'v', ['240', '208'] as const) === '208' ? 208 : 240,
    circuit: choiceParam(params, 'a', DRYER_CIRCUITS.map(String)) ?? DEFAULTS.circuit,
    material: choiceParam(params, 'material', ['cu', 'al'] as const) === 'al' ? 'Al' : 'Cu',
    method: choiceParam(params, 'method', ['nm', 'c'] as const) === 'c' ? 'conductors' : 'cable',
    termination: choiceParam(params, 'terminals', ['unknown', '60', '75'] as const) ?? DEFAULTS.termination,
  };
}

const queryOf = (i: Inputs) =>
  buildQuery({
    w: i.nameplate.trim(),
    n: i.dryers.trim(),
    v: i.volts,
    a: i.circuit,
    material: i.material.toLowerCase(),
    method: i.method === 'conductors' ? 'c' : 'nm',
    terminals: i.method === 'conductors' ? i.termination : '',
  });

export function DryerTool() {
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
        inputMode={k === 'dryers' ? 'numeric' : 'decimal'}
        className="max-w-[12rem]"
      />
    </Field>
  );

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Dryer calculator">
        <div className="grid gap-x-10 gap-y-7 lg:grid-cols-2">
          {text('nameplate', 'Dryer nameplate, W', 'At the supply voltage.')}
          {text('dryers', 'Dryers on the feeder', 'One for a house.')}
          <Segmented
            name="volts"
            legend="Supply"
            value={String(inputs.volts)}
            options={[
              { value: '240', label: <span data-src={MFR_DOMAIN}>120/240 V</span> },
              { value: '208', label: <span data-src={MFR_DOMAIN}>120/208 V</span> },
            ]}
            onChange={(v) => update({ volts: v === '208' ? 208 : 240 })}
          />
          <Field id="circuit" label="Dryer circuit rating, A" hint="From the dryer's instructions.">
            <SelectInput id="circuit" value={inputs.circuit} onChange={(circuit) => update({ circuit })} describedById="circuit-hint">
              {DRYER_CIRCUITS.map((a) => (
                <option key={a} value={String(a)} data-src="nec-240-ocpd">
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

const NOTE = 'max-w-[38rem] text-[17px] leading-[1.65] text-ink';
const BIG = 'mt-2 font-mono text-[34px] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[46px]';

function Result({
  inputs,
  r,
  headingRef,
  shareUrl,
}: {
  inputs: Inputs;
  r: DryerRun;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  shareUrl: () => string;
}) {
  const n = fieldNumber(inputs.dryers);
  const w = fieldNumber(inputs.nameplate);
  const wireSizeHref = `/calculators/wire-size-calculator?${buildQuery({
    rating: r.circuitA,
    material: inputs.material.toLowerCase(),
    method: inputs.method === 'conductors' ? 'c' : 'nm',
    terminals: inputs.method === 'conductors' ? inputs.termination : '',
  })}`;
  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none">
        {n === 1 ? (
          <>
            {indefiniteArticle(w) === 'an' ? 'An' : 'A'} <Val v={w} unit="W" src="input" /> dryer
          </>
        ) : (
          <>
            <Num v={n} src="input" /> dryers of <Val v={w} unit="W" src="input" />
          </>
        )}{' '}
        at <Val v={inputs.volts} unit="V" src="input" />
      </h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <div className="border-t border-cut-rule pt-4">
          <h3 className="font-display text-[17px] font-semibold text-ink">Feeder or service load, 220.54</h3>
          <p className={BIG} data-src={CALC}>
            <Val v={r.feederW} unit="W" src={CALC} format={{ upTo: 1 }} />
          </p>
          <p className="mt-2 text-[17px] text-ink" data-src={CALC}>
            or <Val v={r.feederAmps} unit="A" src={CALC} format={{ upTo: 2 }} /> at <Val v={inputs.volts} unit="V" src="input" />
          </p>
        </div>
        <div className="border-t border-cut-rule pt-4">
          <h3 className="font-display text-[17px] font-semibold text-ink">Each dryer&apos;s own circuit</h3>
          <p className={BIG} data-src={CALC}>
            <Size s={r.size} />
          </p>
          <p className="mt-2 text-[17px] text-ink" data-src={CALC}>
            {METAL_FULL[inputs.material]} on the <Val v={r.circuitA} unit="A" src="input" /> circuit
            {r.egc ? (
              <>
                , with {indefiniteArticle(r.egc)} <Size s={r.egc} /> ground wire
              </>
            ) : null}
          </p>
        </div>
      </div>
      {r.egc && r.egcLargerThanConductor && <p className={`mt-5 ${NOTE}`}>{EGC_LARGER_THAN_CONDUCTOR_NOTE}</p>}
      <ol className="mt-6 max-w-[38rem] list-decimal space-y-2 pl-6 text-[17px] leading-[1.65] text-ink" data-src={CALC}>
        {r.stepParts.map((parts, k) => (
          <li key={k}>
            <ValText parts={parts} />
          </li>
        ))}
      </ol>
      <p className="mt-8 max-w-[38rem] border-t border-cut-rule pt-4 text-[15px] leading-[1.6] text-[#333333]" data-src={EXC}>
        The 2023 NEC requires GFCI protection for the branch circuit or outlet of a clothes dryer (210.8(D)).{' '}
        <span data-src={L}>The 220.54 load is for a feeder or service calculation, not the dryer&apos;s own circuit.</span>{' '}
        <Link href={wireSizeHref} className={LINK}>
          Open this circuit in the wire size calculator
        </Link>{' '}
        for a long run or heat.{' '}
        <Link href="/methodology#dryer-method" className={LINK}>
          How the calculator works
        </Link>
        .
      </p>
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}
