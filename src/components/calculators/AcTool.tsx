'use client';

// The air conditioner calculator in the look (WSZ-011e; sources WSZ-036). The two numbers on a condenser's nameplate,
// the MCA and the MOCP, and the run: the copper wire sized to the MCA (Table 310.16, 110.14(C); 240.4(G) lifts the
// 240.4(D) cap), the voltage drop at the MCA, the ground wire (Table 250.122 at the MOCP, 250.122(A) and (B)) and the
// breaker no larger than the MOCP. Copper only, as both makers' documents ask. Results appear only after Calculate; a
// share link restores them.
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
import type { Termination, WiringMethod } from '@/lib/calculations/conductor-sizing';
import { LENGTH_MAX_FT, LENGTH_MIN_FT, VD_TARGET_OPTIONS } from '@/lib/calculations/voltage-drop';
import { AC_CALC, AC_MCA_MAX, AC_MOCP_OPTIONS, acCircuit } from '@/lib/calculations/ac-circuit';
import type { AcRun } from '@/lib/calculations/ac-circuit';
import { TERMINATION_RULES } from '@/lib/verified/nec-110-14c';
import { MFR_HVAC_DOMAIN } from '@/lib/verified/mfr-hvac';

const CALC = AC_CALC;
const MFR = MFR_HVAC_DOMAIN;
const TERM = 'nec-110-14c';
const LINK = 'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]';

interface Inputs {
  mca: string;
  mocp: string;
  volts: 240 | 208;
  method: WiringMethod;
  termination: Termination;
  length: string;
  target: string;
}
const DEFAULTS: Inputs = { mca: '17.6', mocp: '30', volts: 240, method: 'conductors', termination: 'unknown', length: '50', target: '3' };

type Errors = Partial<Record<'mca' | 'length', string>>;
function errorsOf(i: Inputs): Errors {
  const errors: Errors = {};
  const mca = fieldNumber(i.mca);
  if (!(mca > 0 && mca <= AC_MCA_MAX)) errors.mca = `Enter the MCA from the nameplate, up to ${formatValue(AC_MCA_MAX)} A.`;
  const ft = fieldNumber(i.length);
  if (!(ft >= LENGTH_MIN_FT && ft <= LENGTH_MAX_FT)) errors.length = `Enter ${formatValue(LENGTH_MIN_FT)} to ${formatValue(LENGTH_MAX_FT)} ft.`;
  return errors;
}

type Outcome = { inputs: Inputs; run: AcRun } | { inputs: Inputs; error: string };
function compute(i: Inputs): Outcome | null {
  if (Object.keys(errorsOf(i)).length > 0) return null;
  const r = acCircuit({
    mcaA: fieldNumber(i.mca),
    mocpA: Number(i.mocp),
    volts: i.volts,
    wiringMethod: i.method,
    termination: i.method === 'cable' ? 'unknown' : i.termination,
    lengthFt: fieldNumber(i.length),
    vdTargetPct: Number(i.target),
  });
  return 'error' in r ? { inputs: i, error: r.error } : { inputs: i, run: r };
}

function inputsFromQuery(params: URLSearchParams): Inputs {
  const mocp = choiceParam(params, 'mocp', AC_MOCP_OPTIONS);
  const target = choiceParam(params, 'target', VD_TARGET_OPTIONS);
  return {
    mca: numberParam(params, 'mca') ?? DEFAULTS.mca,
    mocp: mocp === null ? DEFAULTS.mocp : String(mocp),
    volts: choiceParam(params, 'volts', ['240', '208'] as const) === '208' ? 208 : 240,
    method: choiceParam(params, 'method', ['cable', 'c'] as const) === 'cable' ? 'cable' : 'conductors',
    termination: choiceParam(params, 'terminals', ['unknown', '60', '75'] as const) ?? DEFAULTS.termination,
    length: numberParam(params, 'length') ?? DEFAULTS.length,
    target: target === null ? DEFAULTS.target : String(target),
  };
}

const queryOf = (i: Inputs) =>
  buildQuery({
    mca: i.mca.trim(),
    mocp: i.mocp,
    volts: i.volts,
    method: i.method === 'cable' ? 'cable' : 'c',
    terminals: i.method === 'conductors' ? i.termination : '',
    length: i.length.trim(),
    target: i.target,
  });

export function AcTool() {
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
  const shownMca = fieldErrors.shown('mca', errors.mca);
  const shownLength = fieldErrors.shown('length', errors.length);

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Air conditioner calculator">
        <div className="grid gap-x-10 gap-y-7 lg:grid-cols-2">
          <Field id="mca" label="MCA, A" hint="Minimum circuit ampacity, on the condenser’s nameplate." error={shownMca}>
            <TextInput
              id="mca"
              value={inputs.mca}
              onChange={(mca) => update({ mca })}
              onBlur={() => fieldErrors.touch('mca')}
              error={shownMca}
              describedById={describedBy('mca', shownMca, true)}
              className="max-w-[12rem]"
            />
          </Field>
          <Field id="mocp" label="MOCP, A" hint="Maximum breaker or fuse, on the same nameplate.">
            <SelectInput id="mocp" value={inputs.mocp} onChange={(mocp) => update({ mocp })} describedById="mocp-hint">
              {AC_MOCP_OPTIONS.map((a) => (
                <option key={a} value={String(a)} data-src="input">
                  {a} A
                </option>
              ))}
            </SelectInput>
          </Field>
          <Segmented
            name="volts"
            legend="Supply voltage"
            value={String(inputs.volts)}
            options={[
              { value: '240', label: <Val v={240} unit="V" src="input" /> },
              { value: '208', label: <Val v={208} unit="V" src="input" /> },
            ]}
            onChange={(v) => update({ volts: v === '208' ? 208 : 240 })}
          />
          <Segmented
            name="method"
            legend="Wiring method"
            value={inputs.method}
            options={[
              { value: 'conductors', label: 'Single conductors' },
              { value: 'cable', label: 'NM or UF cable' },
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
                <Val v={TERMINATION_RULES.columnAboveLimit} unit="°C" src={TERM} /> only if the breaker, the disconnect and the condenser are listed for
                it.
              </p>
            </div>
          ) : (
            <p className="self-end text-[15px] leading-[1.6] text-[#333333]" data-src={TERM}>
              Cable stays in the <Val v={TERMINATION_RULES.cableColumn} unit="°C" src={TERM} /> column.
            </p>
          )}
          <Field id="length" label="One-way length, ft" hint="Panel to the condenser, through the disconnect." error={shownLength}>
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
        <p className={FIELD_HINT} data-src={MFR}>
          Copper only: Carrier and Amana both ask for copper conductors.
        </p>
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
      {result && 'run' in result && <AcResult r={result.run} headingRef={headingRef} shareUrl={shareUrl} />}
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

function AcResult({ r, headingRef, shareUrl }: { r: AcRun; headingRef: HeadingRef; shareUrl: () => string }) {
  const stepped = r.size !== r.firstSize;
  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none">
        MCA <Val v={r.input.mcaA} unit="A" src="input" />, MOCP <Val v={r.input.mocpA} unit="A" src="input" />,{' '}
        <Val v={r.input.lengthFt} unit="ft" src="input" /> one way at <Val v={r.input.volts} unit="V" src="input" />
      </h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <div className={PANEL}>
          <h3 className={PANEL_H}>Copper wire</h3>
          <p className={BIG} data-src={CALC}>
            <Size s={r.size} />
          </p>
          <p className={SUB} data-src={CALC}>
            {stepped ? (
              <>
                for the drop; <Size s={r.firstSize} /> carries the MCA
              </>
            ) : (
              <>
                <Val v={r.ampacity} unit="A" src={CALC} /> at <Val v={r.columnC} unit="°C" src={CALC} />
              </>
            )}
          </p>
        </div>
        <div className={PANEL}>
          <h3 className={PANEL_H}>Ground wire</h3>
          <p className={BIG} data-src={CALC}>
            <Size s={r.egc} />
          </p>
          <p className={SUB}>
            {r.egcGrown ? 'copper, grown with the wire (250.122(B))' : r.egcCapped ? 'copper, no larger than the wire (250.122(A))' : 'copper, Table 250.122'}
          </p>
        </div>
        <div className={PANEL}>
          <h3 className={PANEL_H}>Breaker, at most</h3>
          <p className={BIG} data-src="input">
            <Val v={r.input.mocpA} unit="A" src="input" />
          </p>
          <p className={SUB}>the nameplate&apos;s MOCP</p>
        </div>
        <div className={PANEL}>
          <h3 className={PANEL_H}>Voltage drop</h3>
          <p className={BIG} data-src={CALC}>
            <Val v={r.vdPct} unit="%" src={CALC} format={{ fixed: 2 }} />
          </p>
          <p className={SUB} data-src={CALC}>
            <Val v={r.vdVolts} unit="V" src={CALC} format={{ fixed: 2 }} /> at the MCA
          </p>
        </div>
      </div>
      <ol className={STEPS} data-src={CALC}>
        {r.stepParts.map((parts, k) => (
          <li key={k}>
            <ValText parts={parts} />
          </li>
        ))}
      </ol>
      <p className={NOTE} data-src={MFR}>
        Amana asks for time-delay fuses or HACR-type breakers of the size its sheet lists; Carrier&apos;s maximum is for a time-delay fuse or a
        breaker.{' '}
        <Link href="/methodology#ac-method" className={LINK}>
          How the calculator works
        </Link>
        .
      </p>
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}
