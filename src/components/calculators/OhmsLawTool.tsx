'use client';

// The Ohm's law calculator in the look (WSZ-007d; spec: research/page-specs.md "WSZ-007"; D-35): any two of volts, amps,
// ohms and watts give the other two, from the Ohm's law engine (src/lib/calculations/ohms-law.ts, solvePair) on the SI
// definitions of NIST SP 330 Table 4 (V = W/A, Ω = V/A). Results appear only after Calculate and show the formula behind
// each value; a share link restores them.
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Val } from '@/components/content/Val';
import { ResultActions } from '@/components/look/ResultActions';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Field, SelectInput, TextInput, describedBy } from '@/components/look/Form';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '@/lib/calculations/fields';
import { ENGINE_ID, OHMS_PAIRS, OHMS_VALUE_MAX, solvePair } from '@/lib/calculations/ohms-law';
import type { OhmsLawQuantity, OhmsLawValues, OhmsPair } from '@/lib/calculations/ohms-law';

const CALC = `calc:${ENGINE_ID}`;
const SI = 'nist-sp330-si-units';
const LINK = 'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]';
const SIG = 4;
const r4 = (v: number) => Number(v.toPrecision(SIG));

const UNIT: Record<OhmsLawQuantity, 'V' | 'A' | 'Ω' | 'W'> = { voltage: 'V', current: 'A', resistance: 'Ω', power: 'W' };
const NAME: Record<OhmsLawQuantity, string> = { voltage: 'Voltage', current: 'Current', resistance: 'Resistance', power: 'Power' };
const SYMBOL: Record<OhmsLawQuantity, string> = { voltage: 'V', current: 'I', resistance: 'R', power: 'P' };
const KEY: Record<OhmsLawQuantity, string> = { voltage: 'v', current: 'i', resistance: 'r', power: 'p' };

/** The formula for one quantity from a known pair, as the result shows it. */
const FORMULA: Record<OhmsPair, Partial<Record<OhmsLawQuantity, string>>> = {
  vi: { resistance: 'R = V ÷ I', power: 'P = V × I' },
  vr: { current: 'I = V ÷ R', power: 'P = V² ÷ R' },
  vp: { current: 'I = P ÷ V', resistance: 'R = V² ÷ P' },
  ir: { voltage: 'V = I × R', power: 'P = I² × R' },
  ip: { voltage: 'V = P ÷ I', resistance: 'R = P ÷ I²' },
  rp: { voltage: 'V = √(P × R)', current: 'I = √(P ÷ R)' },
};

interface Inputs {
  pair: OhmsPair;
  a: string;
  b: string;
}

const DEFAULTS: Inputs = { pair: 'vp', a: '240', b: '1500' };
const pairOf = (p: OhmsPair) => OHMS_PAIRS.find((x) => x.value === p) ?? OHMS_PAIRS[0];

function errorsOf(i: Inputs): Partial<Record<'a' | 'b', string>> {
  const errors: Partial<Record<'a' | 'b', string>> = {};
  const [qa, qb] = pairOf(i.pair).known;
  const check = (text: string, q: OhmsLawQuantity) => {
    const v = fieldNumber(text);
    return v > 0 && v <= OHMS_VALUE_MAX ? null : `Enter a ${NAME[q].toLowerCase()} above 0 ${UNIT[q]}, up to 1,000,000,000 ${UNIT[q]}.`;
  };
  const ea = check(i.a, qa);
  const eb = check(i.b, qb);
  if (ea) errors.a = ea;
  if (eb) errors.b = eb;
  return errors;
}

function compute(i: Inputs): { inputs: Inputs; values: OhmsLawValues } | null {
  if (Object.keys(errorsOf(i)).length > 0) return null;
  const values = solvePair(i.pair, fieldNumber(i.a), fieldNumber(i.b));
  return values ? { inputs: i, values } : null;
}

function inputsFromQuery(params: URLSearchParams): Inputs {
  const pair = choiceParam(params, 'known', OHMS_PAIRS.map((p) => p.value)) ?? DEFAULTS.pair;
  const [qa, qb] = pairOf(pair).known;
  return { pair, a: numberParam(params, KEY[qa]) ?? '', b: numberParam(params, KEY[qb]) ?? '' };
}

export function OhmsLawTool() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [result, setResult] = useState<{ inputs: Inputs; values: OhmsLawValues } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fieldErrors = useFieldErrors();
  const errors = errorsOf(inputs);
  const [qa, qb] = pairOf(inputs.pair).known;
  const query = useMemo(() => {
    if (!result) return '';
    const [ka, kb] = pairOf(result.inputs.pair).known;
    return buildQuery({ known: result.inputs.pair, [KEY[ka]]: result.inputs.a, [KEY[kb]]: result.inputs.b });
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
  // a quantity in both pairs keeps its value; the other field starts empty, with no error until the next Calculate
  const onPair = (pair: OhmsPair) => {
    const [oa, ob] = pairOf(inputs.pair).known;
    const old: Partial<Record<OhmsLawQuantity, string>> = { [oa]: inputs.a, [ob]: inputs.b };
    const [na, nb] = pairOf(pair).known;
    fieldErrors.reset();
    update({ pair, a: old[na] ?? '', b: old[nb] ?? '' });
  };
  const onReset = () => {
    markChanged();
    fieldErrors.reset();
    setInputs(DEFAULTS);
    setResult(null);
  };
  const shown = (name: 'a' | 'b') => fieldErrors.shown(name, errors[name]);
  const field = (name: 'a' | 'b', q: OhmsLawQuantity) => (
    <Field id={name} label={`${NAME[q]}, ${UNIT[q]}`} error={shown(name)}>
      <TextInput
        id={name}
        value={inputs[name]}
        onChange={(v) => update({ [name]: v } as Partial<Inputs>)}
        onBlur={() => fieldErrors.touch(name)}
        error={shown(name)}
        describedById={describedBy(name, shown(name), false)}
        className="max-w-[11rem]"
      />
    </Field>
  );

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Ohm's law calculator">
        <div className="grid gap-x-10 gap-y-7 lg:grid-cols-3">
          <Field id="known" label="What you know" hint="Any two of the four give the other two.">
            <SelectInput
              id="known"
              value={inputs.pair}
              onChange={(v) => onPair(v as OhmsPair)}
              describedById="known-hint"
            >
              {OHMS_PAIRS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </SelectInput>
          </Field>
          {field('a', qa)}
          {field('b', qb)}
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
      {result && <Outcome inputs={result.inputs} v={result.values} headingRef={headingRef} shareUrl={shareUrl} />}
    </div>
  );
}

function Outcome({
  inputs,
  v,
  headingRef,
  shareUrl,
}: {
  inputs: Inputs;
  v: OhmsLawValues;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  shareUrl: () => string;
}) {
  const known = pairOf(inputs.pair).known;
  const found = (['voltage', 'current', 'resistance', 'power'] as OhmsLawQuantity[]).filter((q) => !known.includes(q));
  const entered: Record<OhmsLawQuantity, number> = { ...v };
  entered[known[0]] = fieldNumber(inputs.a);
  entered[known[1]] = fieldNumber(inputs.b);
  const show = (q: OhmsLawQuantity) =>
    known.includes(q) ? <Val v={entered[q]} unit={UNIT[q]} src="input" /> : <Val v={r4(v[q])} unit={UNIT[q]} src={CALC} />;
  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none">
        {NAME[known[0]]} {show(known[0])} and {NAME[known[1]].toLowerCase()} {show(known[1])}
      </h2>
      <div className="mt-3 flex flex-wrap gap-x-10 gap-y-2">
        {found.map((q) => (
          <p key={q} className="font-mono text-[34px] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[46px]">
            {show(q)}
          </p>
        ))}
      </div>
      <p className="mt-3 max-w-[38rem] text-[17px] leading-[1.6] text-ink">
        {NAME[found[0]].toLowerCase()} and {NAME[found[1]].toLowerCase()}.
      </p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full max-w-[38rem] border-collapse text-[15px]" data-src={CALC}>
          <caption className="sr-only">Voltage, current, resistance and power</caption>
          <tbody>
            {(['voltage', 'current', 'resistance', 'power'] as OhmsLawQuantity[]).map((q) => (
              <tr key={q} className="border-b border-cut-rule first:border-t-2 first:border-t-ink">
                <th scope="row" className="py-2 pr-4 text-left font-normal">
                  {NAME[q]} ({SYMBOL[q]}){known.includes(q) ? ', entered' : ''}
                </th>
                <td className="whitespace-nowrap py-2 pl-4 text-right font-mono tabular-nums">{show(q)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 max-w-[38rem] space-y-4 text-[17px] leading-[1.65] text-ink" data-src={SI}>
        {found.map((q) => (
          <p key={q}>
            <strong>{NAME[q]}:</strong> {FORMULA[inputs.pair][q]} = {show(q)}.
          </p>
        ))}
      </div>
      <div className="mt-8 max-w-[38rem] border-t border-cut-rule pt-4 text-[15px] leading-[1.6] text-[#333333]">
        <p>
          Assumed: DC, or AC with a purely resistive load; the resistance stays the same.{' '}
          <Link href="/methodology#si-units" className={LINK}>
            How these values are calculated
          </Link>
          .
        </p>
        <p className="mt-3">
          For a load with a power factor below 1, use the{' '}
          <Link href="/calculators/watts-to-amps-calculator" className={LINK}>
            watts to amps calculator
          </Link>
          ; for the resistance of a wire, the{' '}
          <Link href="/calculators/wire-resistance-calculator" className={LINK}>
            wire resistance calculator
          </Link>
          .
        </p>
      </div>
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}
