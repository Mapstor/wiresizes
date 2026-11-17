'use client';

// The RV hookup calculator in the look (WSZ-011b; spec: research/page-specs-held.md "/calculators/rv-hookup-calculator";
// data gate BUILD since WSZ-033). Two jobs: one RV outlet at a house (rvOutlet: the wire size engine at 120 V for a
// TT-30R or 240 V for a 14-50R, GFCI under 210.8(F)), or an RV park feeder (rvPark: 551.73(A) site loads, the Table
// 551.73(A) demand factor, the 551.71 receptacle shares). Results appear only after Calculate; a share link restores them.
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
import { RV_CALC, RV_SITES_MAX, rvOutlet, rvPark } from '@/lib/calculations/rv-hookup';
import type { RvOutlet, RvOutletRun, RvParkRun } from '@/lib/calculations/rv-hookup';
import { TERMINATION_RULES } from '@/lib/verified/nec-110-14c';
import { NEC_551_DOMAIN, SITE_VA } from '@/lib/verified/nec-551';
import type { Material } from '@/lib/verified/awg';

const CALC = RV_CALC;
const RV = NEC_551_DOMAIN;
const TERM = 'nec-110-14c';
const LINK = 'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]';
const METAL: Record<Material, string> = { Cu: 'copper', Al: 'aluminum' };

type Mode = 'outlet' | 'park';
interface Inputs {
  mode: Mode;
  outlet: RvOutlet;
  material: Material;
  method: WiringMethod;
  termination: Termination;
  length: string;
  target: string;
  s50: string;
  s30: string;
  s20: string;
  park: 'new' | 'existing';
}
const DEFAULTS: Inputs = {
  mode: 'outlet',
  outlet: '1450',
  material: 'Cu',
  method: 'conductors',
  termination: 'unknown',
  length: '50',
  target: '3',
  s50: '12',
  s30: '18',
  s20: '',
  park: 'new',
};

type Key = 'length' | 's50' | 's30' | 's20';
type Errors = Partial<Record<Key, string>>;
const count = (t: string) => (t.trim() === '' ? 0 : fieldNumber(t));

function errorsOf(i: Inputs): Errors {
  const e: Errors = {};
  if (i.mode === 'outlet') {
    const ft = fieldNumber(i.length);
    if (!(ft >= LENGTH_MIN_FT && ft <= LENGTH_MAX_FT)) e.length = `Enter ${formatValue(LENGTH_MIN_FT)} to ${formatValue(LENGTH_MAX_FT)} ft.`;
  } else {
    for (const k of ['s50', 's30', 's20'] as const) {
      const n = count(i[k]);
      if (!(Number.isInteger(n) && n >= 0 && n <= RV_SITES_MAX)) e[k] = `A whole number, 0 to ${RV_SITES_MAX}.`;
    }
  }
  return e;
}

type Outcome = { inputs: Inputs; outlet: RvOutletRun } | { inputs: Inputs; park: RvParkRun } | { inputs: Inputs; error: string };

function compute(i: Inputs): Outcome | null {
  if (Object.keys(errorsOf(i)).length > 0) return null;
  if (i.mode === 'outlet') {
    const r = rvOutlet({
      outlet: i.outlet,
      material: i.material,
      wiringMethod: i.method,
      termination: i.method === 'cable' ? 'unknown' : i.termination,
      lengthFt: fieldNumber(i.length),
      vdTargetPct: Number(i.target),
    });
    return 'error' in r ? { inputs: i, error: r.error } : { inputs: i, outlet: r };
  }
  const r = rvPark({ sites50: count(i.s50), sites30: count(i.s30), sites20: count(i.s20), newPark: i.park === 'new' });
  return 'error' in r ? { inputs: i, error: r.error } : { inputs: i, park: r };
}

function inputsFromQuery(params: URLSearchParams): Inputs {
  const target = choiceParam(params, 'target', VD_TARGET_OPTIONS);
  // A park link with no site counts at all (a hand-typed "?mode=park") opens on the example park, not on an error.
  const sites = (['s50', 's30', 's20'] as const).some((k) => params.has(k));
  return {
    mode: choiceParam(params, 'mode', ['outlet', 'park'] as const) ?? DEFAULTS.mode,
    outlet: choiceParam(params, 'outlet', ['tt30', '1450'] as const) ?? DEFAULTS.outlet,
    material: choiceParam(params, 'material', ['cu', 'al'] as const) === 'al' ? 'Al' : 'Cu',
    method: choiceParam(params, 'method', ['cable', 'c'] as const) === 'cable' ? 'cable' : 'conductors',
    termination: choiceParam(params, 'terminals', ['unknown', '60', '75'] as const) ?? DEFAULTS.termination,
    length: numberParam(params, 'length') ?? DEFAULTS.length,
    target: target === null ? DEFAULTS.target : String(target),
    s50: numberParam(params, 's50') ?? (sites ? '' : DEFAULTS.s50),
    s30: numberParam(params, 's30') ?? (sites ? '' : DEFAULTS.s30),
    s20: numberParam(params, 's20') ?? (sites ? '' : DEFAULTS.s20),
    park: choiceParam(params, 'park', ['new', 'existing'] as const) ?? DEFAULTS.park,
  };
}

const queryOf = (i: Inputs) =>
  i.mode === 'outlet'
    ? buildQuery({
        mode: 'outlet',
        outlet: i.outlet,
        material: i.material.toLowerCase(),
        method: i.method === 'cable' ? 'cable' : 'c',
        terminals: i.method === 'conductors' ? i.termination : '',
        length: i.length.trim(),
        target: i.target,
      })
    : buildQuery({ mode: 'park', s50: i.s50.trim(), s30: i.s30.trim(), s20: i.s20.trim(), park: i.park });

export function RvHookupTool() {
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
  const text = (k: Key, label: React.ReactNode, hint: React.ReactNode) => (
    <Field id={k} label={label} hint={hint} error={shown(k)}>
      <TextInput
        id={k}
        value={inputs[k]}
        onChange={(v) => update({ [k]: v } as Partial<Inputs>)}
        onBlur={() => fieldErrors.touch(k)}
        error={shown(k)}
        describedById={describedBy(k, shown(k), true)}
        inputMode="numeric"
        className="max-w-[12rem]"
      />
    </Field>
  );

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="RV hookup calculator">
        <Segmented
          name="mode"
          legend="What are you wiring?"
          value={inputs.mode}
          options={[
            { value: 'outlet', label: 'One RV outlet' },
            { value: 'park', label: 'RV park feeder' },
          ]}
          onChange={(mode) => update({ mode })}
        />
        {inputs.mode === 'outlet' ? (
          <div className="mt-7 grid gap-x-10 gap-y-7 lg:grid-cols-2">
            <Segmented
              name="outlet"
              legend="RV outlet"
              value={inputs.outlet}
              options={[
                { value: '1450', label: <span data-src="nema-receptacle-configs">50 A, 14-50R</span> },
                { value: 'tt30', label: <span data-src="nema-receptacle-configs">30 A, TT-30R</span> },
              ]}
              onChange={(outlet) => update({ outlet })}
            />
            <Segmented
              name="material"
              legend="Conductor material"
              value={inputs.material === 'Cu' ? 'cu' : 'al'}
              options={[
                { value: 'cu', label: 'Copper' },
                { value: 'al', label: 'Aluminum' },
              ]}
              onChange={(m) => update({ material: m === 'al' ? 'Al' : 'Cu' })}
            />
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
                  <Val v={TERMINATION_RULES.columnAboveLimit} unit="°C" src={TERM} /> only if the breaker and the receptacle are listed for it.
                </p>
              </div>
            ) : (
              <p className="self-end text-[15px] leading-[1.6] text-[#333333]" data-src={TERM}>
                Cable stays in the <Val v={TERMINATION_RULES.cableColumn} unit="°C" src={TERM} /> column.
              </p>
            )}
            {text('length', 'One-way length, ft', 'Panel to the RV outlet.')}
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
        ) : (
          <div className="mt-7 grid gap-x-10 gap-y-7 lg:grid-cols-2">
            {text('s50', 'Sites with 50 A supply', <span data-src={RV}>Each counts <Val v={SITE_VA.site50} unit="VA" src={RV} />.</span>)}
            {text('s30', 'Sites with 20 A and 30 A supply', <span data-src={RV}>Each counts <Val v={SITE_VA.site30} unit="VA" src={RV} />.</span>)}
            {text('s20', 'Sites with only 20 A supply', <span data-src={RV}>Each counts <Val v={SITE_VA.site20} unit="VA" src={RV} />; not tent sites.</span>)}
            <Segmented
              name="park"
              legend="The sites are"
              value={inputs.park}
              options={[
                { value: 'new', label: 'New' },
                { value: 'existing', label: 'Existing' },
              ]}
              onChange={(park) => update({ park })}
            />
          </div>
        )}
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
      {result && 'outlet' in result && <OutletResult inputs={result.inputs} r={result.outlet} headingRef={headingRef} shareUrl={shareUrl} />}
      {result && 'park' in result && <ParkResult r={result.park} headingRef={headingRef} shareUrl={shareUrl} />}
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

function OutletResult({ inputs, r, headingRef, shareUrl }: { inputs: Inputs; r: RvOutletRun; headingRef: HeadingRef; shareUrl: () => string }) {
  const f = r.feeder;
  const stepped = f.size !== f.minSizeByAmpacity;
  const wireSizeHref = `/calculators/wire-size-calculator?${buildQuery({
    rating: r.outlet.breakerA,
    material: inputs.material.toLowerCase(),
    method: inputs.method === 'conductors' ? 'c' : 'nm',
    terminals: inputs.method === 'conductors' ? inputs.termination : '',
    length: inputs.length.trim(),
    phase: 'single',
    voltage: r.outlet.volts,
    target: inputs.target,
  })}`;
  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none">
        <span data-src="nema-receptacle-configs">
          A <Val v={r.outlet.breakerA} unit="A" src="nema-receptacle-configs" /> RV outlet, {r.outlet.config}
        </span>
        , {METAL[inputs.material]}, <Val v={fieldNumber(inputs.length)} unit="ft" src="input" /> one way
      </h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <div className={PANEL}>
          <h3 className={PANEL_H}>Wire</h3>
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
                {METAL[inputs.material]}, <Val v={f.ampacity} unit="A" src={CALC} /> at <Val v={f.columnC} unit="°C" src={CALC} />
              </>
            )}
          </p>
        </div>
        <div className={PANEL}>
          <h3 className={PANEL_H}>Ground wire</h3>
          <p className={BIG} data-src={CALC}>
            {f.egc ? <Size s={f.egc} /> : '–'}
          </p>
          <p className={SUB}>{METAL[inputs.material]}, Table 250.122</p>
        </div>
        <div className={PANEL}>
          <h3 className={PANEL_H}>Voltage drop</h3>
          <p className={BIG} data-src={CALC}>
            <Val v={f.vdPct} unit="%" src={CALC} format={{ fixed: 2 }} />
          </p>
          <p className={SUB} data-src={CALC}>
            <Val v={f.vdVolts} unit="V" src={CALC} format={{ fixed: 2 }} /> at the full <Val v={r.outlet.breakerA} unit="A" src="nema-receptacle-configs" />
          </p>
        </div>
        <div className={PANEL}>
          <h3 className={PANEL_H}>GFCI at a house</h3>
          <p className={BIG}>{r.gfciAtHouse ? 'Yes' : 'No'}</p>
          <p className={SUB}>outdoors, NEC 210.8(F)</p>
        </div>
      </div>
      <ol className={STEPS} data-src={CALC}>
        {r.stepParts.map((parts, k) => (
          <li key={k}>
            <ValText parts={parts} />
          </li>
        ))}
      </ol>
      <p className={NOTE} data-src={CALC}>
        <Link href={wireSizeHref} className={LINK}>
          Open this circuit in the wire size calculator
        </Link>{' '}
        for heat or bundling.{' '}
        <Link href="/methodology#rv-method" className={LINK}>
          How the calculator works
        </Link>
        .
      </p>
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}

function ParkResult({ r, headingRef, shareUrl }: { r: RvParkRun; headingRef: HeadingRef; shareUrl: () => string }) {
  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none">
        An RV park of <Num v={r.sites} src="input" /> sites
      </h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-3">
        <div className={PANEL}>
          <h3 className={PANEL_H}>Calculated load</h3>
          <p className={BIG} data-src={CALC}>
            <Val v={r.demandVa} unit="VA" src={CALC} format={{ upTo: 0 }} />
          </p>
          <p className={SUB} data-src={RV}>
            at <Val v={r.demandPct} unit="%" src={RV} />, Table 551.73(A)
          </p>
        </div>
        <div className={PANEL}>
          <h3 className={PANEL_H}>At 120/240 V</h3>
          <p className={BIG} data-src={CALC}>
            <Val v={r.amps240} unit="A" src={CALC} format={{ fixed: 1 }} />
          </p>
          <p className={SUB}>single-phase</p>
        </div>
        <div className={PANEL}>
          <h3 className={PANEL_H}>At 208Y/120 V</h3>
          <p className={BIG} data-src={CALC}>
            <Val v={r.amps208} unit="A" src={CALC} format={{ fixed: 1 }} />
          </p>
          <p className={SUB}>three-phase</p>
        </div>
      </div>
      <p className="mt-6 max-w-[38rem] text-[17px] font-semibold leading-[1.6] text-ink" data-src={CALC}>
        {r.meets30 && r.meets50 ? 'The receptacle mix meets 551.71.' : 'The receptacle mix falls short of 551.71: see the last step.'}
      </p>
      <ol className={STEPS} data-src={CALC}>
        {r.stepParts.map((parts, k) => (
          <li key={k}>
            <ValText parts={parts} />
          </li>
        ))}
      </ol>
      <p className={NOTE} data-src={RV}>
        Not included: tent sites, a supply that serves two RVs, and the park&apos;s other buildings and pools, which 551.73 adds separately.{' '}
        <Link href="/methodology#rv-method" className={LINK}>
          How the calculator works
        </Link>
        .
      </p>
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}
