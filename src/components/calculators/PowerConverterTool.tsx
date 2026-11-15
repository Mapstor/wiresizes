'use client';

// The kilowatts, kVA, watts and volts to amps and the amps to watts calculators in the look (WSZ-007b and c; spec:
// research/page-specs.md "WSZ-007"; D-35). Every number comes from the power engine's converter path
// (src/lib/calculations/power.ts: convertToAmps, convertFromAmps, ampsAtVolts, ampsFromResistance): three-phase loads run
// through the three-phase calculator's own path, single-phase loads through S = V × I and P = S × PF, DC through P = V × I
// (power factor 1), and a resistance through Ohm's law. Results appear only after Calculate and explain each
// number; a share link restores them.
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Num } from '@/components/content/Num';
import { Val } from '@/components/content/Val';
import { ResultActions } from '@/components/look/ResultActions';
import { ValueBars } from '@/components/look/ValueBars';
import type { ValueBarRow } from '@/components/look/ValueBars';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Field, Segmented, TextInput, describedBy } from '@/components/look/Form';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '@/lib/calculations/fields';
import { POWER_FACTOR_INVALID_MESSAGE, SINGLE_PHASE_VOLTS, THREE_PHASE_VOLTS, powerFactorValid } from '@/lib/calculations/inputs';
import {
  CONV_VALUE_MAX,
  ENGINE_ID,
  SQRT3,
  TP_SIG,
  TP_VOLTS_MAX,
  TP_VOLTS_MIN,
  ampsAtVolts,
  ampsFromResistance,
  convertFromAmps,
  convertToAmps,
  isConvError,
  isOhmError,
} from '@/lib/calculations/power';
import type { ConvResult, OhmResult } from '@/lib/calculations/power';

export type ConverterMode = 'kw' | 'kva' | 'volts' | 'watts' | 'amps';

const CALC = `calc:${ENGINE_ID}`;
const VOLTS = 'us-nominal-voltages';
const EIA = 'eia-power-glossary';
const DOE = 'doe-motor-load-efficiency';
const PFC = 'doe-power-factor-cost';
const MIT = 'mit-polyphase-networks';
const SI = 'nist-sp330-si-units';
const LINK = 'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]';
/** A calculated value as shown: TP_SIG significant figures, without trailing zeros. */
const r4 = (v: number) => Number(v.toPrecision(TP_SIG));

type Phases = '1' | '3' | 'dc';
type Basis = 'power' | 'resistance';
type FieldName = 'volts' | 'value' | 'pf' | 'ohms';

interface Inputs {
  phases: Phases;
  basis: Basis;
  /** Field texts */
  volts: string;
  value: string;
  pf: string;
  ohms: string;
}

const DEFAULTS: Record<ConverterMode, Inputs> = {
  kw: { phases: '1', basis: 'power', volts: '240', value: '7.2', pf: '1', ohms: '' },
  kva: { phases: '3', basis: 'power', volts: '480', value: '75', pf: '', ohms: '' },
  volts: { phases: '1', basis: 'power', volts: '240', value: '4500', pf: '1', ohms: '12.8' },
  watts: { phases: '1', basis: 'power', volts: '240', value: '4500', pf: '1', ohms: '' },
  amps: { phases: '3', basis: 'power', volts: '480', value: '50', pf: '0.92', ohms: '' },
};
/** Modes with a DC choice beside single-phase and three-phase. */
const hasDc = (mode: ConverterMode) => mode === 'watts' || mode === 'amps';
/** The query key of the entered value. */
const VALUE_KEY: Record<ConverterMode, string> = { kw: 'kw', kva: 'kva', volts: 'w', watts: 'w', amps: 'a' };

/** The power the mode takes: real power in kW, apparent power in kVA, or real power in W. */
const VALUE: Record<ConverterMode, { label: string; unit: 'kW' | 'kVA' | 'W' | 'A'; message: string; hint: string }> = {
  kw: {
    label: 'Real power, kW',
    unit: 'kW',
    message: 'Enter a real power above 0 kW, up to 1,000,000 kW.',
    hint: 'The power the load turns into work or heat.',
  },
  kva: {
    label: 'Apparent power, kVA',
    unit: 'kVA',
    message: 'Enter an apparent power above 0 kVA, up to 1,000,000 kVA.',
    hint: 'Volts times amps: a transformer or generator rating, for example.',
  },
  volts: {
    label: 'Power, W',
    unit: 'W',
    message: 'Enter a power above 0 W, up to 1,000,000 W.',
    hint: 'The real power in watts, from the nameplate or a meter.',
  },
  watts: {
    label: 'Power, W',
    unit: 'W',
    message: 'Enter a power above 0 W, up to 1,000,000 W.',
    hint: 'The real power in watts, from the nameplate or a meter.',
  },
  amps: {
    label: 'Current, A',
    unit: 'A',
    message: 'Enter a current above 0 A, up to 1,000,000 A.',
    hint: 'The current the load draws; on three-phase, the current in one line.',
  },
};

const usesPower = (mode: ConverterMode, i: Inputs) => mode !== 'volts' || i.basis === 'power';
const pfOptional = (mode: ConverterMode) => mode === 'kva';

function errorsOf(mode: ConverterMode, inputs: Inputs): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  const volts = fieldNumber(inputs.volts);
  if (!(volts >= TP_VOLTS_MIN && volts <= TP_VOLTS_MAX)) {
    errors.volts = `Enter a ${inputs.phases === '3' && usesPower(mode, inputs) ? 'line-to-line ' : ''}voltage from 1 V to 100,000 V.`;
  }
  if (usesPower(mode, inputs)) {
    const v = fieldNumber(inputs.value);
    if (!(v > 0 && v <= CONV_VALUE_MAX)) errors.value = VALUE[mode].message;
    if (pfOptional(mode)) {
      if (inputs.pf.trim() !== '' && !powerFactorValid(fieldNumber(inputs.pf))) {
        errors.pf = 'Enter a power factor above 0 and at most 1, or leave the field empty.';
      }
    } else if (inputs.phases !== 'dc' && !powerFactorValid(fieldNumber(inputs.pf))) {
      errors.pf = POWER_FACTOR_INVALID_MESSAGE;
    }
  } else {
    const ohms = fieldNumber(inputs.ohms);
    if (!(ohms > 0 && ohms <= CONV_VALUE_MAX)) errors.ohms = 'Enter a resistance above 0 Ω, up to 1,000,000 Ω.';
  }
  return errors;
}

type Computed = { inputs: Inputs; conv: ConvResult } | { inputs: Inputs; ohm: OhmResult };

function compute(mode: ConverterMode, inputs: Inputs): Computed | null {
  if (Object.keys(errorsOf(mode, inputs)).length > 0) return null;
  const volts = fieldNumber(inputs.volts);
  if (!usesPower(mode, inputs)) {
    const ohm = ampsFromResistance(volts, fieldNumber(inputs.ohms));
    return isOhmError(ohm) ? null : { inputs, ohm };
  }
  const phases = inputs.phases === '3' ? 3 : 1;
  const value = fieldNumber(inputs.value);
  const pf = inputs.phases === 'dc' ? 1 : inputs.pf.trim() === '' ? null : fieldNumber(inputs.pf);
  const conv =
    mode === 'kva'
      ? convertToAmps({ phases, volts, known: 'kva', kva: value, pf })
      : mode === 'amps'
        ? convertFromAmps({ phases, volts, amps: value, pf: pf ?? 1 })
        : convertToAmps({ phases, volts, known: 'kw-pf', kw: mode === 'kw' ? value : value / 1000, pf });
  return isConvError(conv) ? null : { inputs, conv };
}

function inputsFromQuery(mode: ConverterMode, params: URLSearchParams): Inputs {
  const d = DEFAULTS[mode];
  return {
    phases: choiceParam(params, 'phases', hasDc(mode) ? (['1', '3', 'dc'] as const) : (['1', '3'] as const)) ?? d.phases,
    basis: mode === 'volts' ? (choiceParam(params, 'basis', ['power', 'resistance'] as const) ?? d.basis) : 'power',
    volts: numberParam(params, 'volts') ?? d.volts,
    value: numberParam(params, VALUE_KEY[mode]) ?? '',
    pf: numberParam(params, 'pf') ?? '',
    ohms: numberParam(params, 'ohms') ?? '',
  };
}

export function PowerConverterTool({ mode }: { mode: ConverterMode }) {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS[mode]);
  const [result, setResult] = useState<Computed | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fieldErrors = useFieldErrors();
  const errors = errorsOf(mode, inputs);
  const power = usesPower(mode, inputs);
  const query = useMemo(() => {
    if (!result) return '';
    const i = result.inputs;
    const p = usesPower(mode, i);
    return buildQuery({
      basis: mode === 'volts' ? i.basis : null,
      phases: p ? i.phases : null,
      volts: i.volts,
      [VALUE_KEY[mode]]: p ? i.value : null,
      pf: p && i.phases !== 'dc' ? i.pf : null,
      ohms: p ? null : i.ohms,
    });
  }, [mode, result]);
  const { markChanged, shareUrl } = useUrlState(query, (params) => {
    const next = inputsFromQuery(mode, params);
    setInputs(next);
    setResult(compute(mode, next));
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
    setResult(compute(mode, inputs));
    window.requestAnimationFrame(() => focusResults(headingRef.current));
  };

  const onReset = () => {
    markChanged();
    fieldErrors.reset();
    setInputs(DEFAULTS[mode]);
    setResult(null);
  };

  const shown = (name: FieldName) => fieldErrors.shown(name, errors[name]);
  const buttons = inputs.phases === '3' && power ? THREE_PHASE_VOLTS : SINGLE_PHASE_VOLTS;
  const text = (name: FieldName, width: string) => (
    <TextInput
      id={name}
      value={inputs[name]}
      onChange={(v) => update({ [name]: v } as Partial<Inputs>)}
      onBlur={() => fieldErrors.touch(name)}
      error={shown(name)}
      describedById={describedBy(name, shown(name), true)}
      className={width}
    />
  );
  const label = {
    kw: 'Kilowatts to amps calculator',
    kva: 'kVA to amps calculator',
    volts: 'Volts to amps calculator',
    watts: 'Watts to amps calculator',
    amps: 'Amps to watts calculator',
  }[mode];

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit} noValidate aria-label={label}>
        <div className="grid gap-x-10 gap-y-7 lg:grid-cols-2">
          <div className="space-y-7">
            {mode === 'volts' && (
              <Segmented
                name="basis"
                legend="Work out the current from"
                value={inputs.basis}
                options={[
                  { value: 'power', label: 'Power' },
                  { value: 'resistance', label: 'Resistance' },
                ]}
                onChange={(basis) => update({ basis })}
              />
            )}
            {power && (
              <Segmented
                name="phases"
                legend="Circuit"
                value={inputs.phases}
                options={[
                  ...(hasDc(mode) ? [{ value: 'dc' as const, label: 'DC' }] : []),
                  { value: '1' as const, label: 'Single-phase' },
                  { value: '3' as const, label: 'Three-phase' },
                ]}
                onChange={(phases) => update({ phases })}
              />
            )}
            <Field
              id="volts"
              label={inputs.phases === '3' && power ? 'Voltage, line to line' : 'Voltage'}
              hint={
                inputs.phases === '3' && power ? (
                  <span data-src={MIT}>Between any two of the three lines.</span>
                ) : (
                  'Across the load, in volts.'
                )
              }
              error={shown('volts')}
            >
              <div className="flex flex-wrap gap-2">
                {text('volts', 'max-w-[7rem]')}
                {buttons.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => update({ volts: String(v) })}
                    className="inline-flex h-11 items-center justify-center rounded-[6px] border border-ink bg-white px-2.5 font-mono text-[14px] text-ink hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ink sm:px-3 sm:text-[15px]"
                    aria-label={`Set ${v} V`}
                  >
                    <Val v={v} unit="V" src={VOLTS} />
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <div className="space-y-7">
            {power ? (
              <>
                <Field id="value" label={VALUE[mode].label} hint={VALUE[mode].hint} error={shown('value')}>
                  {text('value', 'max-w-[11rem]')}
                </Field>
                {inputs.phases !== 'dc' && (
                <Field
                  id="pf"
                  label={pfOptional(mode) ? 'Power factor (optional)' : 'Power factor'}
                  hint={
                    <span data-src={EIA}>
                      {pfOptional(mode)
                        ? 'Real power divided by apparent power. The current doesn’t depend on it; add it to get the real and reactive power.'
                        : 'Real power divided by apparent power, from 0 to 1: from the nameplate or a meter.'}
                    </span>
                  }
                  error={shown('pf')}
                >
                  {text('pf', 'max-w-[7rem]')}
                </Field>
                )}
              </>
            ) : (
              <Field id="ohms" label="Resistance, Ω" hint="The load’s resistance in ohms, measured or from its specifications." error={shown('ohms')}>
                {text('ohms', 'max-w-[11rem]')}
              </Field>
            )}
          </div>
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

      {result && JSON.stringify(result.inputs) !== JSON.stringify(inputs) && (
        <p role="status" className="mt-6 text-[15px] font-semibold text-ink">
          The inputs have changed since this result. Press Calculate to update it.
        </p>
      )}
      {result && 'ohm' in result && <OhmOutcome r={result.ohm} headingRef={headingRef} shareUrl={shareUrl} />}
      {result && 'conv' in result && (
        <ConvOutcome mode={mode} dc={result.inputs.phases === 'dc'} r={result.conv} headingRef={headingRef} shareUrl={shareUrl} />
      )}
    </div>
  );
}

/** True when `exact`, shown at TP_SIG figures, equals `fromShown` at TP_SIG figures: the worked sum can say "=". */
function eq(exact: number, fromShown: number): '=' | '≈' {
  return Number(exact.toPrecision(TP_SIG)) === Number(fromShown.toPrecision(TP_SIG)) ? '=' : '≈';
}

const HEADING = 'font-display text-[15px] font-semibold text-ink focus:outline-none';
const BIG = 'mt-3 font-mono text-[34px] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[46px]';
const PROSE = 'mt-6 max-w-[38rem] space-y-4 text-[17px] leading-[1.65] text-ink';

function ValuesTable({ rows }: { rows: { key: string; label: React.ReactNode; value: React.ReactNode }[] }) {
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full max-w-[38rem] border-collapse text-[15px]" data-src={CALC}>
        <caption className="sr-only">The load&apos;s values</caption>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-cut-rule first:border-t-2 first:border-t-ink">
              <th scope="row" className="py-2 pr-4 text-left font-normal">
                {row.label}
              </th>
              <td className="whitespace-nowrap py-2 pl-4 text-right font-mono tabular-nums">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Footer({ assumed, method }: { assumed: React.ReactNode; method: string }) {
  return (
    <div className="mt-8 max-w-[38rem] border-t border-cut-rule pt-4 text-[15px] leading-[1.6] text-[#333333]">
      <p>
        {assumed}{' '}
        <Link href={`/methodology#${method}`} className={LINK}>
          How these values are calculated
        </Link>
        .
      </p>
      <p className="mt-3">
        Next: the{' '}
        <Link href="/calculators/wire-size-calculator" className={LINK}>
          wire size calculator
        </Link>{' '}
        picks the conductors for a current, and the{' '}
        <Link href="/calculators/voltage-drop-calculator" className={LINK}>
          voltage drop calculator
        </Link>{' '}
        checks the run.
      </p>
    </div>
  );
}

function ConvOutcome({
  mode,
  dc,
  r,
  headingRef,
  shareUrl,
}: {
  mode: ConverterMode;
  dc: boolean;
  r: ConvResult;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  shareUrl: () => string;
}) {
  const three = r.phases === 3;
  const watts = mode !== 'kw' && mode !== 'kva';
  const fromAmps = mode === 'amps';
  // the watt pages work in W and VA, the others in kW and kVA; entered values stay as entered
  const k = watts ? 1000 : 1;
  const pUnit = watts ? 'W' : 'kW';
  const sUnit = watts ? 'VA' : 'kVA';
  const kwEntered = r.input.known === 'kw-pf' && !fromAmps;
  const kvaEntered = mode === 'kva';
  const r6 = (v: number) => Number(v.toPrecision(6));
  const pShown = r.kw === null ? null : kwEntered ? r.kw * k : fromAmps ? r6(r.kw * k) : r4(r.kw * k);
  const sShown = kvaEntered ? r.kva * k : r4(r.kva * k);
  const V = <Val v={r.volts} unit="V" src="input" />;
  const I = fromAmps ? <Val v={r.amps} unit="A" src="input" /> : <Val v={r4(r.amps)} unit="A" src={CALC} />;
  const P = pShown === null ? null : <Val v={pShown} unit={pUnit} src={kwEntered ? 'input' : CALC} />;
  const S = <Val v={sShown} unit={sUnit} src={kvaEntered ? 'input' : CALC} />;
  const PF = r.pf === null || dc ? null : <Num v={r.pf} src="input" />;
  const Q = r.kvar === null || watts ? null : <Val v={r4(r.kvar)} unit="kVAR" src={CALC} />;
  const circuit = dc ? 'DC' : three ? 'three-phase' : 'single-phase';
  const sqrt = three ? '√3 × ' : '';
  const m = three ? SQRT3 : 1;
  const pW = pShown === null ? 0 : pShown * (watts ? 1 : 1000);

  const rows = [
    { key: 'i', label: three ? 'Current in each line' : 'Current', value: I },
    ...(P ? [{ key: 'p', label: dc ? 'Power' : 'Real power', value: P }] : []),
    ...(dc ? [] : [{ key: 's', label: 'Apparent power', value: S }]),
    ...(Q ? [{ key: 'q', label: 'Reactive power', value: Q }] : []),
    ...(PF ? [{ key: 'pf', label: 'Power factor', value: PF }] : []),
    ...(r.wye && r.lineToNeutral !== null
      ? [
          {
            key: 'ln',
            label: (
              <span data-src={VOLTS}>
                Line to neutral, {r.wye.lineVolts}Y/{r.wye.neutralVolts} V system
              </span>
            ),
            value: <Val v={r4(r.lineToNeutral)} unit="V" src={CALC} />,
          },
        ]
      : []),
  ];

  const others = dc ? [] : ampsAtVolts(r, three ? THREE_PHASE_VOLTS : SINGLE_PHASE_VOLTS);
  if (!dc && !others.some((o) => o.volts === r.volts)) others.push({ volts: r.volts, amps: r.amps });
  others.sort((a, b) => a.volts - b.volts);
  const bars: ValueBarRow[] = others.map((o) => ({
    key: String(o.volts),
    label: <Val v={o.volts} unit="V" src={o.volts === r.volts ? 'input' : VOLTS} />,
    value: r4(o.amps),
    unit: 'A',
    src: CALC,
    strong: o.volts === r.volts,
  }));

  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className={HEADING}>
        {fromAmps ? <>Power of {I}</> : <>Current of {kwEntered ? P : S}</>} at {V} {circuit}
        {PF && (
          <>
            , power factor {PF}
          </>
        )}
      </h2>
      <p className={BIG}>{fromAmps ? P : I}</p>
      <p className="mt-3 max-w-[38rem] text-[17px] leading-[1.6] text-ink">
        {fromAmps ? (
          dc ? (
            <>of power.</>
          ) : (
            <>
              of real power, the part that does the work. The load draws {S} of apparent power{three ? ', with this current in each of the three lines' : ''}.
            </>
          )
        ) : (
          <>
            {three ? 'in each of the three lines.' : 'in the circuit.'}{' '}
            {dc ? null : P && PF ? (
              <>The load draws {S} of apparent power, of which {P} is real power, the part that does the work.</>
            ) : (
              <>Add a power factor to get the real and reactive power; the current is the same either way.</>
            )}
          </>
        )}
      </p>

      <ValuesTable rows={rows} />

      <div className={PROSE}>
        {dc && !fromAmps && (
          <p data-src={SI}>
            <strong>The current:</strong> I = P ÷ V = <Val v={pW} unit="W" src="input" /> ÷ {V} {eq(r.amps, pW / r.volts)} {I}.
          </p>
        )}
        {dc && fromAmps && P && (
          <p data-src={SI}>
            <strong>The power:</strong> P = V × I = {V} × {I} {eq((r.kw as number) * 1000, r.volts * r.amps)} {P}.
          </p>
        )}
        {!dc && fromAmps && P && PF && (
          <p data-src={three ? DOE : EIA}>
            <strong>The real power:</strong> P = {sqrt}V × I × PF = {sqrt}
            {V} × {I} × {PF} {eq((r.kw as number) * 1000, m * r.volts * r.amps * (r.pf as number))} {P}.
          </p>
        )}
        {!dc && fromAmps && (
          <p data-src={three ? MIT : EIA}>
            <strong>The apparent power:</strong> S = {sqrt}V × I = {sqrt}
            {V} × {I} {eq(r.kva * 1000, m * r.volts * r.amps)} {S}.
          </p>
        )}
        {!dc && kwEntered && PF && P && (
          <p data-src={three ? DOE : EIA}>
            <strong>The current:</strong> I = P ÷ ({sqrt}V × PF) = <Val v={pW} unit="W" src="input" /> ÷ ({sqrt}
            {V} × {PF}) {eq(r.amps, pW / (m * r.volts * (r.pf as number)))} {I}.
          </p>
        )}
        {kvaEntered && (
          <p data-src={three ? MIT : EIA}>
            <strong>The current:</strong> I = S ÷ {three ? '(√3 × V)' : 'V'} = <Val v={sShown * 1000} unit="VA" src="input" /> ÷{' '}
            {three ? <>(√3 × {V})</> : V} {eq(r.amps, (sShown * 1000) / (m * r.volts))} {I}.
          </p>
        )}
        {!dc && kwEntered && PF && P && (
          <p data-src={EIA}>
            <strong>The apparent power:</strong> S = P ÷ PF = {P} ÷ {PF} {eq(r.kva * k, (pShown as number) / (r.pf as number))} {S}.
          </p>
        )}
        {kvaEntered && PF && P && (
          <p data-src={EIA}>
            <strong>The real power:</strong> P = S × PF = {S} × {PF} {eq((r.kw as number) * k, sShown * (r.pf as number))} {P}.
          </p>
        )}
        {Q && P && (
          <p data-src={PFC}>
            <strong>The reactive power:</strong> Q = √(S² − P²) = √(({S})² − ({P})²){' '}
            {eq(r.kvar as number, Math.sqrt(Math.max(0, sShown * sShown - (pShown as number) * (pShown as number))))} {Q}.
          </p>
        )}
        {three && (
          <p data-src={MIT}>
            √3, about <Num v={r4(SQRT3)} src={CALC} />, is the ratio of the line-to-line to the line-to-neutral voltage.
          </p>
        )}
      </div>

      {!dc && (
        <>
          <p className="mt-6 max-w-[38rem] text-[17px] leading-[1.65] text-ink">
            The current of the same load at {three ? 'the nominal three-phase voltages' : 'other voltages'}: it falls as the voltage rises.
          </p>
          <div className="mt-4 max-w-[40rem]">
            <ValueBars rows={bars} label={`Current of the same load at ${three ? 'three-phase' : 'single-phase'} voltages`} />
          </div>
        </>
      )}

      <Footer
        assumed={
          dc
            ? 'Assumed: a steady DC voltage and current.'
            : three
              ? 'Assumed: a balanced load with sinusoidal voltage and current, the same current in all three lines. V is the voltage between two lines and I the current in one line; the powers are for the whole load.'
              : 'Assumed: sinusoidal voltage and current; the current is the current in the circuit’s conductors.'
        }
        method={dc ? 'si-units' : three ? 'three-phase-power' : 'power-terms'}
      />
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}

function OhmOutcome({ r, headingRef, shareUrl }: { r: OhmResult; headingRef: React.RefObject<HTMLHeadingElement | null>; shareUrl: () => string }) {
  const V = <Val v={r.volts} unit="V" src="input" />;
  const R = <Val v={r.ohms} unit="Ω" src="input" />;
  const I = <Val v={r4(r.amps)} unit="A" src={CALC} />;
  const W = <Val v={r4(r.watts)} unit="W" src={CALC} />;
  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className={HEADING}>
        Current through {R} at {V}
      </h2>
      <p className={BIG}>{I}</p>
      <p className="mt-3 max-w-[38rem] text-[17px] leading-[1.6] text-ink">through the resistance, which takes {W} of power.</p>
      <ValuesTable
        rows={[
          { key: 'i', label: 'Current', value: I },
          { key: 'p', label: 'Power', value: W },
          { key: 'v', label: 'Voltage', value: V },
          { key: 'r', label: 'Resistance', value: R },
        ]}
      />
      <div className={PROSE} data-src={SI}>
        <p>
          <strong>The current, by Ohm&apos;s law:</strong> I = V ÷ R = {V} ÷ {R} {eq(r.amps, r.volts / r.ohms)} {I}.
        </p>
        <p>
          <strong>The power:</strong> P = V × I = {V} × {I} {eq(r.watts, r.volts * r4(r.amps))} {W}.
        </p>
      </div>
      <Footer
        assumed="Assumed: a resistance that stays the same at this voltage; on AC, a purely resistive load, so the current and voltage are in step."
        method="si-units"
      />
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}
