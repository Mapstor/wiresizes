'use client';

// The three-phase calculator in the look (WSZ-006d; spec: research/page-specs.md "WSZ-006"; D-35). Every number comes
// from the power engine's three-phase path (src/lib/calculations/power.ts, threePhase): the line-to-line voltage plus any
// two of real power, apparent power, line current and power factor give the rest through S = √3 × V × I, P = S × PF and
// Q = √(S² − P²); a target power factor adds the capacitor kVAR that reaches it at the same real power. Results appear
// only after Calculate and explain each number; a share link restores them.
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Num } from '@/components/content/Num';
import { Val } from '@/components/content/Val';
import { ResultActions } from '@/components/look/ResultActions';
import { ValueBars } from '@/components/look/ValueBars';
import type { ValueBarRow } from '@/components/look/ValueBars';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Field, FIELD_HINT, SelectInput, TextInput, describedBy } from '@/components/look/Form';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '@/lib/calculations/fields';
import { POWER_FACTOR_INVALID_MESSAGE, THREE_PHASE_VOLTS, powerFactorValid } from '@/lib/calculations/inputs';
import { ENGINE_ID, SQRT3, TP_KNOWN, TP_SIG, TP_VOLTS_MAX, TP_VOLTS_MIN, TP_WYE_SYSTEMS, isTpError, threePhase } from '@/lib/calculations/power';
import type { TpKnown, TpResult } from '@/lib/calculations/power';

const CALC = `calc:${ENGINE_ID}`;
const VOLTS = 'us-nominal-voltages';
const EIA = 'eia-power-glossary';
const DOE = 'doe-motor-load-efficiency';
const PFC = 'doe-power-factor-cost';
const MIT = 'mit-polyphase-networks';
const LINK = 'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]';
const VALUE_MAX = 1000000;
/** A calculated value as shown: TP_SIG significant figures, without trailing zeros (75 kW, not 75.00 kW). */
const r4 = (v: number) => Number(v.toPrecision(TP_SIG));

const KNOWN_LABELS: Record<TpKnown, string> = {
  'kw-pf': 'kW and power factor',
  'kva-pf': 'kVA and power factor',
  'amps-pf': 'Amps and power factor',
  'kw-kva': 'kW and kVA',
  'kw-amps': 'kW and amps',
};

type FieldName = 'volts' | 'kw' | 'kva' | 'amps' | 'pf' | 'target';
type ValueField = 'kw' | 'kva' | 'amps' | 'pf';

const FIELDS_OF: Record<TpKnown, [ValueField, ValueField]> = {
  'kw-pf': ['kw', 'pf'],
  'kva-pf': ['kva', 'pf'],
  'amps-pf': ['amps', 'pf'],
  'kw-kva': ['kw', 'kva'],
  'kw-amps': ['kw', 'amps'],
};

interface Inputs {
  /** Field text */
  volts: string;
  known: TpKnown;
  /** Field text */
  kw: string;
  /** Field text */
  kva: string;
  /** Field text */
  amps: string;
  /** Field text */
  pf: string;
  /** Field text; empty for no correction */
  target: string;
}

const DEFAULTS: Inputs = { volts: '480', known: 'kw-pf', kw: '50', kva: '', amps: '', pf: '0.9', target: '' };

const MESSAGES: Record<Exclude<FieldName, 'volts' | 'target'>, string> = {
  kw: 'Enter a real power above 0 kW, up to 1,000,000 kW.',
  kva: 'Enter an apparent power above 0 kVA, up to 1,000,000 kVA.',
  amps: 'Enter a current above 0 A, up to 1,000,000 A.',
  pf: POWER_FACTOR_INVALID_MESSAGE,
};

function errorsOf(inputs: Inputs): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  const volts = fieldNumber(inputs.volts);
  if (!(volts >= TP_VOLTS_MIN && volts <= TP_VOLTS_MAX)) errors.volts = 'Enter a line-to-line voltage from 1 V to 100,000 V.';
  for (const f of FIELDS_OF[inputs.known]) {
    const v = fieldNumber(inputs[f]);
    const ok = f === 'pf' ? powerFactorValid(v) : v > 0 && v <= VALUE_MAX;
    if (!ok) errors[f] = MESSAGES[f];
  }
  if (inputs.target.trim() !== '' && !powerFactorValid(fieldNumber(inputs.target))) {
    errors.target = 'Enter a target power factor above 0 and at most 1, or leave the field empty.';
  }
  return errors;
}

type Computed = { inputs: Inputs; r: TpResult } | { inputs: Inputs; error: 'kw-above-kva'; kva: number };

function compute(inputs: Inputs): Computed | null {
  if (Object.keys(errorsOf(inputs)).length > 0) return null;
  const used = FIELDS_OF[inputs.known];
  const value = (f: ValueField) => (used.includes(f) ? fieldNumber(inputs[f]) : undefined);
  const volts = fieldNumber(inputs.volts);
  const r = threePhase({
    volts,
    known: inputs.known,
    kw: value('kw'),
    kva: value('kva'),
    amps: value('amps'),
    pf: value('pf'),
    targetPf: inputs.target.trim() === '' ? null : fieldNumber(inputs.target),
  });
  if (isTpError(r)) {
    if (r.error !== 'kw-above-kva') return null;
    const kva = inputs.known === 'kw-kva' ? fieldNumber(inputs.kva) : (SQRT3 * volts * fieldNumber(inputs.amps)) / 1000;
    return { inputs, error: r.error, kva };
  }
  return { inputs, r };
}

function inputsFromQuery(params: URLSearchParams): Inputs {
  return {
    volts: numberParam(params, 'volts') ?? DEFAULTS.volts,
    known: choiceParam(params, 'known', TP_KNOWN) ?? DEFAULTS.known,
    kw: numberParam(params, 'kw') ?? '',
    kva: numberParam(params, 'kva') ?? '',
    amps: numberParam(params, 'amps') ?? '',
    pf: numberParam(params, 'pf') ?? '',
    target: numberParam(params, 'target') ?? '',
  };
}

export function ThreePhaseTool() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [result, setResult] = useState<Computed | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fieldErrors = useFieldErrors();
  const errors = errorsOf(inputs);
  const query = useMemo(() => {
    if (!result) return '';
    const i = result.inputs;
    const used = FIELDS_OF[i.known];
    return buildQuery({
      volts: i.volts,
      known: i.known,
      kw: used.includes('kw') ? i.kw : null,
      kva: used.includes('kva') ? i.kva : null,
      amps: used.includes('amps') ? i.amps : null,
      pf: used.includes('pf') ? i.pf : null,
      target: i.target,
    });
  }, [result]);
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

  const shown = (name: FieldName) => fieldErrors.shown(name, errors[name]);
  const [first, second] = FIELDS_OF[inputs.known];

  const valueField = (f: ValueField) => {
    const props = {
      kw: { label: 'Real power, kW', hint: 'The power the load turns into work or heat.' },
      kva: { label: 'Apparent power, kVA', hint: 'Volts times amps: a transformer or generator rating, for example.' },
      amps: { label: 'Current in each line, A', hint: 'The current in one of the three line conductors.' },
      pf: {
        label: 'Power factor',
        hint: (
          <span data-src={EIA}>
            {inputs.known === 'kva-pf'
              ? 'From 0 to 1. The current doesn’t depend on it; the real and reactive power do.'
              : 'From 0 to 1, from the nameplate or a meter. A heater, which draws no reactive power, has 1.'}
          </span>
        ),
      },
    }[f];
    return (
      <Field key={f} id={f} label={props.label} hint={props.hint} error={shown(f)}>
        <TextInput
          id={f}
          value={inputs[f]}
          onChange={(v) => update({ [f]: v } as Partial<Inputs>)}
          onBlur={() => fieldErrors.touch(f)}
          error={shown(f)}
          describedById={describedBy(f, shown(f), true)}
          className="max-w-[11rem]"
        />
      </Field>
    );
  };

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Three-phase calculator">
        <div className="grid gap-x-10 gap-y-7 lg:grid-cols-2">
          <div className="space-y-7">
            <Field
              id="volts"
              label="Voltage, line to line"
              hint={
                <span data-src={VOLTS}>
                  Between any two of the three lines:{' '}
                  {TP_WYE_SYSTEMS.map((w, k) => (
                    <span key={w.lineVolts}>
                      {k > 0 && ', '}
                      <Val v={w.lineVolts} unit="V" src={VOLTS} /> on a {w.lineVolts}Y/{w.neutralVolts} V system
                    </span>
                  ))}
                  .
                </span>
              }
              error={shown('volts')}
            >
              <div className="flex flex-wrap gap-2">
                <TextInput
                  id="volts"
                  value={inputs.volts}
                  onChange={(volts) => update({ volts })}
                  onBlur={() => fieldErrors.touch('volts')}
                  error={shown('volts')}
                  describedById={describedBy('volts', shown('volts'), true)}
                  className="max-w-[7rem]"
                />
                {THREE_PHASE_VOLTS.map((v) => (
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

            <Field id="known" label="What you know" hint="Two values besides the voltage; the calculator works out the rest.">
              <SelectInput id="known" value={inputs.known} onChange={(v) => update({ known: v as TpKnown })} describedById="known-hint">
                {TP_KNOWN.map((k) => (
                  <option key={k} value={k}>
                    {KNOWN_LABELS[k]}
                  </option>
                ))}
              </SelectInput>
            </Field>

            <div className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
              {valueField(first)}
              {valueField(second)}
            </div>
          </div>

          <div className="space-y-7">
            <Field
              id="target"
              label="Target power factor (optional)"
              hint={<span data-src={PFC}>To size the capacitor bank that raises the power factor to it, 0.95 for example. Leave empty to skip.</span>}
              error={shown('target')}
            >
              <TextInput
                id="target"
                value={inputs.target}
                onChange={(target) => update({ target })}
                onBlur={() => fieldErrors.touch('target')}
                error={shown('target')}
                describedById={describedBy('target', shown('target'), true)}
                className="max-w-[7rem]"
              />
            </Field>
            <p className="max-w-[30rem] text-[15px] leading-[1.55] text-[#555555]">
              A balanced load: the same current in all three lines. The current is per line; the powers are for the whole load.
            </p>
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
      {result && <Result result={result} headingRef={headingRef} shareUrl={shareUrl} />}
    </div>
  );
}

/** True when `exact`, shown at TP_SIG figures, equals `fromShown` at TP_SIG figures: the worked sum can say "=". */
function sameShown(exact: number, fromShown: number): boolean {
  return Number(exact.toPrecision(TP_SIG)) === Number(fromShown.toPrecision(TP_SIG));
}

function Result({
  result,
  headingRef,
  shareUrl,
}: {
  result: Computed;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  shareUrl: () => string;
}) {
  const { inputs } = result;
  const volts = fieldNumber(inputs.volts);
  const vShown = <Val v={volts} unit="V" src="input" />;

  if ('error' in result) {
    const kw = fieldNumber(inputs.kw);
    return (
      <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
        <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none">
          No load has these values
        </h2>
        <p className="mt-3 max-w-[38rem] text-[17px] leading-[1.6] text-ink" data-src={EIA}>
          <strong>Real power can&apos;t be more than apparent power.</strong>{' '}
          {inputs.known === 'kw-kva' ? (
            <>
              <Val v={kw} unit="kW" src="input" /> is more than the <Val v={result.kva} unit="kVA" src="input" /> entered.
            </>
          ) : (
            <>
              At {vShown}, <Val v={fieldNumber(inputs.amps)} unit="A" src="input" /> in each line is{' '}
              <Val v={r4(result.kva)} unit="kVA" src={CALC} /> of apparent power, less than the <Val v={kw} unit="kW" src="input" />{' '}
              entered.
            </>
          )}{' '}
          Check the two values: the power factor, real power divided by apparent power, is at most 1.
        </p>
        <ResultActions shareUrl={shareUrl} />
      </section>
    );
  }

  const { r } = result;
  const known = r.input.known;
  const entered = (f: ValueField) => FIELDS_OF[known].includes(f);
  const src = (f: ValueField) => (entered(f) ? 'input' : CALC);
  const value = (f: ValueField) => {
    const v = f === 'kw' ? r.kw : f === 'kva' ? r.kva : f === 'amps' ? r.amps : r.pf;
    return entered(f) ? v : r4(v);
  };
  const I = <Val v={value('amps')} unit="A" src={src('amps')} />;
  const P = <Val v={value('kw')} unit="kW" src={src('kw')} />;
  const S = <Val v={value('kva')} unit="kVA" src={src('kva')} />;
  const Q = <Val v={r4(r.kvar)} unit="kVAR" src={CALC} />;
  const PF = <Num v={value('pf')} src={src('pf')} />;
  const headline: 'amps' | 'kw' | 'pf' = !entered('amps') ? 'amps' : !entered('kw') ? 'kw' : 'pf';

  // shown values the worked sums start from: entered values as entered, calculated ones at TP_SIG figures
  const sKw = value('kw');
  const sKva = value('kva');
  const sAmps = value('amps');
  const sPf = value('pf');
  const eq = (exact: number, fromShown: number) => (sameShown(exact, fromShown) ? '=' : '≈');

  const rows: { key: string; label: React.ReactNode; value: React.ReactNode }[] = [
    { key: 'i', label: 'Current in each line', value: I },
    { key: 'p', label: 'Real power', value: P },
    { key: 's', label: 'Apparent power', value: S },
    { key: 'q', label: 'Reactive power', value: Q },
    { key: 'pf', label: 'Power factor', value: PF },
    ...(r.wye
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

  const bars: ValueBarRow[] = [
    { key: 'p', label: 'Real power', value: value('kw'), unit: 'kW', src: src('kw'), strong: headline === 'kw' },
    { key: 'q', label: 'Reactive power', value: r4(r.kvar), unit: 'kVAR', src: CALC },
    { key: 's', label: 'Apparent power', value: value('kva'), unit: 'kVA', src: src('kva') },
    ...(r.correction
      ? [
          { key: 'qa', label: 'Reactive, after', value: r4(r.correction.kvarAfter), unit: 'kVAR' as const, src: CALC },
          { key: 'sa', label: 'Apparent, after', value: r4(r.correction.kvaAfter), unit: 'kVA' as const, src: CALC },
        ]
      : []),
  ];

  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none">
        {headline === 'amps' ? 'Current in each line' : headline === 'kw' ? 'Real power' : 'Power factor'} of a balanced three-phase load at{' '}
        {vShown} line to line:{' '}
        {known === 'kw-pf' && (
          <>
            {P} at power factor {PF}
          </>
        )}
        {known === 'kva-pf' && (
          <>
            {S} at power factor {PF}
          </>
        )}
        {known === 'amps-pf' && (
          <>
            {I} per line at power factor {PF}
          </>
        )}
        {known === 'kw-kva' && (
          <>
            {P} and {S}
          </>
        )}
        {known === 'kw-amps' && (
          <>
            {P} at {I} per line
          </>
        )}
      </h2>
      <p className="mt-3 font-mono text-[34px] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[46px]">
        {headline === 'amps' ? I : headline === 'kw' ? P : PF}
      </p>
      <p className="mt-3 max-w-[38rem] text-[17px] leading-[1.6] text-ink">
        {headline === 'amps' && (
          <>
            in each of the three lines. The load draws {S} of apparent power: {P} of real power, which does the work, and {Q} of reactive
            power.
          </>
        )}
        {headline === 'kw' && (
          <>
            of real power, the part that does the work. The load draws {S} of apparent power and {Q} of reactive power.
          </>
        )}
        {headline === 'pf' && (
          <>
            is the power factor: the {P} of real power divided by the {S} of apparent power. The reactive power is {Q}.
          </>
        )}
      </p>

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

      <div className="mt-6 max-w-[38rem] space-y-4 text-[17px] leading-[1.65] text-ink">
        {known === 'kw-pf' && (
          <p data-src={DOE}>
            <strong>The current:</strong> I = P ÷ (√3 × V × PF) = <Val v={sKw * 1000} unit="W" src={CALC} /> ÷ (√3 × {vShown} × {PF}){' '}
            {eq(r.amps, (sKw * 1000) / (SQRT3 * volts * sPf))} {I}.
          </p>
        )}
        {(known === 'kva-pf' || known === 'kw-kva') && (
          <p data-src={MIT}>
            <strong>The current:</strong> I = S ÷ (√3 × V) = <Val v={sKva * 1000} unit="VA" src={CALC} /> ÷ (√3 × {vShown}){' '}
            {eq(r.amps, (sKva * 1000) / (SQRT3 * volts))} {I}.
          </p>
        )}
        {(known === 'amps-pf' || known === 'kw-amps') && (
          <p data-src={MIT}>
            <strong>The apparent power:</strong> S = √3 × V × I = √3 × {vShown} × {I} {eq(r.kva, (SQRT3 * volts * sAmps) / 1000)} {S}.
          </p>
        )}
        {known === 'kw-pf' && (
          <p data-src={EIA}>
            <strong>The apparent power:</strong> S = P ÷ PF = {P} ÷ {PF} {eq(r.kva, sKw / sPf)} {S}.
          </p>
        )}
        {(known === 'kva-pf' || known === 'amps-pf') && (
          <p data-src={EIA}>
            <strong>The real power:</strong> P = S × PF = {S} × {PF} {eq(r.kw, sKva * sPf)} {P}.
          </p>
        )}
        {(known === 'kw-kva' || known === 'kw-amps') && (
          <p data-src={EIA}>
            <strong>The power factor:</strong> PF = P ÷ S = {P} ÷ {S} {eq(r.pf, sKw / sKva)} {PF}.
          </p>
        )}
        <p data-src={PFC}>
          <strong>The reactive power:</strong> Q = √(S² − P²) = √(({S})² − ({P})²) {eq(r.kvar, Math.sqrt(Math.max(0, sKva * sKva - sKw * sKw)))} {Q}. It
          acts at a right angle to the real power, so the three powers form a right triangle with S as its long side.
        </p>
        <p data-src={MIT}>
          √3, about <Num v={r4(SQRT3)} src={CALC} />, is the ratio of the line-to-line to the line-to-neutral voltage.
          {r.wye && (
            <>
              {' '}
              On this <span data-src={VOLTS}>{r.wye.lineVolts}Y/{r.wye.neutralVolts} V</span> system, each line is{' '}
              <Val v={r4(r.lineToNeutral)} unit="V" src={CALC} /> from the neutral, the{' '}
              <Val v={r.wye.neutralVolts} unit="V" src={VOLTS} /> of its name.
            </>
          )}
        </p>
      </div>

      {r.correctionState === 'at-or-above' && (
        <p className="mt-6 max-w-[38rem] text-[17px] leading-[1.6] text-ink">
          <strong>No capacitor needed:</strong> the power factor, {PF}, already meets your target of{' '}
          <Num v={fieldNumber(inputs.target)} src="input" />.
        </p>
      )}
      {r.correction && (
        <div className="mt-6 max-w-[38rem] space-y-4 text-[17px] leading-[1.65] text-ink" data-src={PFC}>
          <p>
            <strong>
              To raise the power factor to <Num v={r.correction.targetPf} src="input" />: a capacitor bank of{' '}
              <Val v={r4(r.correction.capKvar)} unit="kVAR" src={CALC} />.
            </strong>{' '}
            At the same {P}, the apparent power falls to <Val v={r4(r.correction.kvaAfter)} unit="kVA" src={CALC} /> and the current in
            each line to <Val v={r4(r.correction.ampsAfter)} unit="A" src={CALC} />,{' '}
            <Val v={r4(r.correction.currentDownPct)} unit="%" src={CALC} /> less.
          </p>
          <p>
            The capacitor supplies the reactive power the load stops drawing from the source: {Q} before,{' '}
            <Val v={r4(r.correction.kvarAfter)} unit="kVAR" src={CALC} /> after (S = P ÷ PF and Q = √(S² − P²) at the new power
            factor). The current is multiplied by PF ÷ PF′ = {PF} ÷ <Num v={r.correction.targetPf} src="input" />.
          </p>
        </div>
      )}

      <p className="mt-6 max-w-[38rem] text-[17px] leading-[1.65] text-ink">The powers to one scale:</p>
      <div className="mt-4 max-w-[40rem]">
        <ValueBars rows={bars} label="Real, reactive and apparent power of the load, to one scale" />
      </div>

      <div className="mt-8 max-w-[38rem] border-t border-cut-rule pt-4 text-[15px] leading-[1.6] text-[#333333]">
        <p>
          Assumed: a balanced load, the same current in all three lines, with sinusoidal voltage and current. V is the voltage between two
          lines and I the current in one line; the powers are for the whole load.{' '}
          <Link href="/methodology#three-phase-power" className={LINK}>
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
          checks a three-phase run.
        </p>
      </div>
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}
