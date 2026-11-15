'use client';

// The range calculator in the look (WSZ-010b; spec: research/page-specs-held.md "WSZ-010"; D-42): the branch-circuit
// load of a range, of a cooktop with one or two wall ovens on one circuit, or of one oven or cooktop, by NEC 2023 Table
// 220.55 and its notes; its current at 240 or 208 V; and the wire and ground wire for the circuit rating the
// appliance's instructions give. Engine: rangeRun in src/lib/calculations/range-circuit.ts; its stepParts are the steps
// shown. Results appear only after Calculate; a share link restores them.
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Size } from '@/components/content/Size';
import { Val } from '@/components/content/Val';
import { ValText } from '@/components/content/ValText';
import { ResultActions } from '@/components/look/ResultActions';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, FIELD_HINT, Field, Segmented, SelectInput, TextInput, describedBy } from '@/components/look/Form';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '@/lib/calculations/fields';
import { formatValue, indefiniteArticle } from '@/lib/calculations/format';
import { ENGINE_ID, RANGE_CIRCUITS, RANGE_ERROR_MESSAGES, isRangeError, rangeRun } from '@/lib/calculations/range-circuit';
import type { CookingSetup, RangeRun, RangeVolts } from '@/lib/calculations/range-circuit';
import { EGC_LARGER_THAN_CONDUCTOR_NOTE } from '@/lib/calculations/conductor-sizing';
import type { Termination, WiringMethod } from '@/lib/calculations/conductor-sizing';
import { TERMINATION_RULES } from '@/lib/verified/nec-110-14c';
import { TABLE_220_55 } from '@/lib/verified/nec-220-2023';
import { MFR_DOMAIN, WHIRLPOOL_RANGE, whirlpoolRangeRow } from '@/lib/verified/mfr-equipment';
import type { Material } from '@/lib/verified/awg';

const CALC = `calc:${ENGINE_ID}`;
const TERM = 'nec-110-14c';
const EXC = 'nec-2023-rule-excerpts';
const LINK = 'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]';
const METAL_FULL: Record<Material, string> = { Cu: 'copper', Al: 'aluminum or copper-clad aluminum' };
const MIN_KW = TABLE_220_55.minKw;
const MAX_KW = TABLE_220_55.note1.maxKw;

interface Inputs {
  setup: CookingSetup;
  kw: string;
  cooktop: string;
  oven1: string;
  oven2: string;
  volts: RangeVolts;
  circuit: string;
  material: Material;
  method: WiringMethod;
  termination: Termination;
}
const DEFAULTS: Inputs = {
  setup: 'range',
  kw: '12',
  cooktop: '7',
  oven1: '4',
  oven2: '',
  volts: 240,
  circuit: '40',
  material: 'Cu',
  method: 'cable',
  termination: 'unknown',
};

// Each hint and each error fits one line down to a 320 px screen, so an error that appears on blur never moves
// Calculate between mousedown and mouseup (WSZ-009a).
type Key = 'kw' | 'cooktop' | 'oven1' | 'oven2';
type Errors = Partial<Record<Key, string>>;

const RATING = 'Enter the rating in kW.';

function errorsOf(i: Inputs): Errors {
  const e: Errors = {};
  if (i.setup === 'combo') {
    const parts = { cooktop: fieldNumber(i.cooktop), oven1: fieldNumber(i.oven1), oven2: i.oven2.trim() === '' ? 0 : fieldNumber(i.oven2) };
    if (!(parts.cooktop > 0)) e.cooktop = RATING;
    if (!(parts.oven1 > 0)) e.oven1 = RATING;
    if (!(parts.oven2 >= 0)) e.oven2 = 'Enter kW, or leave it empty.';
    const total = parts.cooktop + parts.oven1 + parts.oven2;
    if (!e.cooktop && !e.oven1 && !e.oven2 && total > MAX_KW) e.cooktop = `Together over ${formatValue(MAX_KW)} kW: past the table.`;
  } else {
    const kw = fieldNumber(i.kw);
    if (!(kw > 0)) e.kw = RATING;
    else if (i.setup === 'range' && !(kw > MIN_KW)) e.kw = `Enter more than ${formatValue(MIN_KW)} kW.`;
    else if (i.setup === 'range' && kw > MAX_KW) e.kw = `Over ${formatValue(MAX_KW)} kW: past Table 220.55.`;
  }
  return e;
}

type Outcome = { inputs: Inputs; r: RangeRun } | { inputs: Inputs; error: string };

function compute(i: Inputs): Outcome | null {
  if (Object.keys(errorsOf(i)).length > 0) return null;
  const r = rangeRun({
    setup: i.setup,
    kw: fieldNumber(i.kw),
    cooktopKw: fieldNumber(i.cooktop),
    ovensKw: [fieldNumber(i.oven1), ...(i.oven2.trim() === '' ? [] : [fieldNumber(i.oven2)])],
    volts: i.volts,
    circuitA: Number(i.circuit),
    material: i.material,
    wiringMethod: i.method,
    termination: i.method === 'cable' ? 'unknown' : i.termination,
  });
  return isRangeError(r) ? { inputs: i, error: RANGE_ERROR_MESSAGES[r.error] } : { inputs: i, r };
}

function inputsFromQuery(params: URLSearchParams): Inputs {
  const setup = choiceParam(params, 'setup', ['range', 'combo', 'single'] as const) ?? DEFAULTS.setup;
  return {
    setup,
    kw: numberParam(params, 'kw') ?? (setup === 'combo' ? DEFAULTS.kw : ''),
    cooktop: numberParam(params, 'ct') ?? (setup === 'combo' ? '' : DEFAULTS.cooktop),
    oven1: numberParam(params, 'ov') ?? (setup === 'combo' ? '' : DEFAULTS.oven1),
    oven2: numberParam(params, 'ov2') ?? '',
    volts: choiceParam(params, 'v', ['240', '208'] as const) === '208' ? 208 : 240,
    circuit: choiceParam(params, 'a', RANGE_CIRCUITS.map(String)) ?? DEFAULTS.circuit,
    material: choiceParam(params, 'material', ['cu', 'al'] as const) === 'al' ? 'Al' : 'Cu',
    method: choiceParam(params, 'method', ['nm', 'c'] as const) === 'c' ? 'conductors' : 'cable',
    termination: choiceParam(params, 'terminals', ['unknown', '60', '75'] as const) ?? DEFAULTS.termination,
  };
}

const queryOf = (i: Inputs) =>
  buildQuery({
    setup: i.setup,
    kw: i.setup === 'combo' ? '' : i.kw.trim(),
    ct: i.setup === 'combo' ? i.cooktop.trim() : '',
    ov: i.setup === 'combo' ? i.oven1.trim() : '',
    ov2: i.setup === 'combo' ? i.oven2.trim() : '',
    v: i.volts,
    a: i.circuit,
    material: i.material.toLowerCase(),
    method: i.method === 'conductors' ? 'c' : 'nm',
    terminals: i.method === 'conductors' ? i.termination : '',
  });

export function RangeTool() {
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
      <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Range calculator">
        <div className="grid gap-x-10 gap-y-7 lg:grid-cols-2">
          <Field id="setup" label="The circuit supplies" hint="One circuit, one room.">
            <SelectInput id="setup" value={inputs.setup} onChange={(v) => update({ setup: v as CookingSetup })} describedById="setup-hint">
              <option value="range">One range</option>
              <option value="combo">A cooktop and one or two ovens</option>
              <option value="single">One wall oven or one cooktop</option>
            </SelectInput>
          </Field>
          <Segmented
            name="volts"
            legend="Supply"
            value={String(inputs.volts)}
            options={[
              { value: '240', label: '120/240 V' },
              { value: '208', label: '120/208 V' },
            ]}
            onChange={(v) => update({ volts: v === '208' ? 208 : 240 })}
          />
          {inputs.setup === 'range' && text('kw', 'Range rating, kW', 'Nameplate, at the supply voltage.')}
          {inputs.setup === 'single' && text('kw', 'Oven or cooktop rating, kW', 'Nameplate, at the supply voltage.')}
          {inputs.setup === 'combo' && (
            <>
              {text('cooktop', 'Cooktop rating, kW', 'Nameplate, at the supply voltage.')}
              {text('oven1', 'Oven rating, kW', 'Nameplate, at the supply voltage.')}
              {text('oven2', 'Second oven rating, kW', 'Leave it empty if none.')}
            </>
          )}
          <Field id="circuit" label="Circuit rating, A" hint="From the instructions or nameplate.">
            <SelectInput id="circuit" value={inputs.circuit} onChange={(circuit) => update({ circuit })} describedById="circuit-hint">
              {RANGE_CIRCUITS.map((a) => (
                <option key={a} value={String(a)}>
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

const ROW = 'border-b border-cut-rule';
const TH = 'py-2 pr-4 text-left font-normal';
const TD = 'whitespace-nowrap py-2 pl-4 text-right font-mono tabular-nums';
const NOTE = 'max-w-[38rem] text-[17px] leading-[1.65] text-ink';

function heading(i: Inputs, r: RangeRun): React.ReactNode {
  const v = <Val v={i.volts} unit="V" src="input" />;
  if (i.setup === 'combo') {
    return (
      <>
        A cooktop and {i.oven2.trim() === '' ? 'an oven' : 'two ovens'}, <Val v={r.equivalentRangeKw as number} unit="kW" src={CALC} format={{ upTo: 2 }} />{' '}
        together, at {v}
      </>
    );
  }
  const kw = fieldNumber(i.kw);
  return (
    <>
      {indefiniteArticle(kw) === 'an' ? 'An' : 'A'} <Val v={kw} unit="kW" src="input" /> {i.setup === 'range' ? 'range' : 'oven or cooktop'} at {v}
    </>
  );
}

function Result({
  inputs,
  r,
  headingRef,
  shareUrl,
}: {
  inputs: Inputs;
  r: RangeRun;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  shareUrl: () => string;
}) {
  const ratingKw = inputs.setup === 'combo' ? (r.equivalentRangeKw as number) : fieldNumber(inputs.kw);
  const maker = inputs.setup === 'range' ? whirlpoolRangeRow(ratingKw, inputs.volts) : null;
  const wireSizeHref = `/calculators/wire-size-calculator?${buildQuery({
    rating: r.circuitA,
    material: inputs.material.toLowerCase(),
    method: inputs.method === 'conductors' ? 'c' : 'nm',
    terminals: inputs.method === 'conductors' ? inputs.termination : '',
    load: Math.round(r.amps * 100) / 100,
  })}`;
  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none">
        {heading(inputs, r)}
      </h2>
      <p className="mt-3 font-mono text-[34px] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[46px]" data-src={CALC}>
        <Val v={r.amps} unit="A" src={CALC} format={{ upTo: 2 }} />
      </p>
      <p className="mt-2 text-[17px] text-ink" data-src={CALC}>
        branch-circuit load, <Val v={r.loadKw} unit="kW" src={CALC} format={{ upTo: 2 }} />; on {indefiniteArticle(r.circuitA)}{' '}
        <Val v={r.circuitA} unit="A" src="input" /> circuit, <Size s={r.size} /> {METAL_FULL[inputs.material]}
        {r.egc ? (
          <>
            {' '}
            with {indefiniteArticle(r.egc)} <Size s={r.egc} /> ground wire
          </>
        ) : null}
      </p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full max-w-[38rem] border-collapse text-[15px]" data-src={CALC}>
          <caption className="sr-only">Range circuit result</caption>
          <tbody>
            <tr className={`${ROW} border-t-2 border-t-ink`}>
              <th scope="row" className={TH}>
                Branch-circuit load, Table 220.55
              </th>
              <td className={TD}>
                <Val v={r.loadKw} unit="kW" src={CALC} format={{ upTo: 2 }} />
              </td>
            </tr>
            <tr className={ROW}>
              <th scope="row" className={TH}>
                Current at <Val v={inputs.volts} unit="V" src="input" />
              </th>
              <td className={TD}>
                <Val v={r.amps} unit="A" src={CALC} format={{ upTo: 2 }} />
              </td>
            </tr>
            <tr className={ROW}>
              <th scope="row" className={TH}>
                Wire for the <Val v={r.circuitA} unit="A" src="input" /> circuit, <Val v={r.columnC} unit="°C" src={CALC} /> column
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
          </tbody>
        </table>
      </div>
      {!r.circuitCarriesLoad && (
        <p className={`mt-5 ${NOTE} font-semibold`} data-src={CALC}>
          The <Val v={r.circuitA} unit="A" src="input" /> circuit is below the <Val v={r.amps} unit="A" src={CALC} format={{ upTo: 2 }} /> the appliance
          draws by Table 220.55. Use the circuit its instructions give.
        </p>
      )}
      {r.egc && r.egcLargerThanConductor && <p className={`mt-5 ${NOTE}`}>{EGC_LARGER_THAN_CONDUCTOR_NOTE}</p>}
      {maker && (
        <p className={`mt-5 ${NOTE}`} data-src={MFR_DOMAIN}>
          For a range of this rating, Whirlpool&apos;s freestanding range manual ({WHIRLPOOL_RANGE.doc}) calls for{' '}
          {maker.circuitsA.map((a, k) => (
            <span key={a}>
              {k > 0 ? ' or ' : ''}
              <Val v={a} unit="A" src={MFR_DOMAIN} />
            </span>
          ))}
          . Other makers&apos; instructions may differ.
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
        The 2023 NEC requires GFCI protection for the branch circuit or outlet of an electric range, wall-mounted oven or counter-mounted cooking unit
        (210.8(D)). The calculator does not choose the circuit rating; the appliance&apos;s instructions do.{' '}
        <Link href={wireSizeHref} className={LINK}>
          Open this circuit in the wire size calculator
        </Link>{' '}
        for a long run or heat.{' '}
        <Link href="/methodology#range-method" className={LINK}>
          How the calculator works
        </Link>
        .
      </p>
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}

