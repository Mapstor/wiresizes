'use client';

// The BTU to watts calculator in the look (WSZ-007d; spec: research/page-specs.md "WSZ-007"; D-35): Btu per hour, watts or
// tons of refrigeration in, the other two out, from the conversions engine (src/lib/calculations/conversions.ts) on NIST
// SP 811's factors: 1 Btu_IT/h = 0.2930711 W and 1 ton of refrigeration = 12,000 Btu_IT/h = 3,516.853 W. Results appear
// only after Calculate; a share link restores them.
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Num } from '@/components/content/Num';
import { Val } from '@/components/content/Val';
import { ResultActions } from '@/components/look/ResultActions';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Field, Segmented, TextInput, describedBy } from '@/components/look/Form';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '@/lib/calculations/fields';
import {
  BTU_PER_H_PER_TON,
  ENGINE_ID,
  W_PER_BTU_PER_H,
  btuPerHourToTons,
  btuPerHourToWatts,
  tonsToWatts,
  wattsToBtuPerHour,
} from '@/lib/calculations/conversions';

const CALC = `calc:${ENGINE_ID}`;
const SP811 = 'nist-sp811-conversions';
const LINK = 'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]';
const r6 = (v: number) => Number(v.toPrecision(6));
const MAX = 1e9;

type From = 'btu' | 'w' | 'ton';
const FROM_LABEL: Record<From, string> = { btu: 'Btu per hour', w: 'Watts', ton: 'Tons' };
const FROM_UNIT: Record<From, string> = { btu: 'Btu/h', w: 'W', ton: 'tons' };

interface Inputs {
  from: From;
  value: string;
}
const DEFAULTS: Inputs = { from: 'btu', value: '12000' };

interface Converted {
  btu: number;
  watts: number;
  tons: number;
}

function convert(from: From, value: number): Converted {
  const btu = from === 'btu' ? value : from === 'w' ? wattsToBtuPerHour(value) : value * BTU_PER_H_PER_TON;
  const watts = from === 'w' ? value : from === 'ton' ? tonsToWatts(value) : btuPerHourToWatts(value);
  return { btu, watts, tons: btuPerHourToTons(btu) };
}

const errorOf = (i: Inputs) => {
  const v = fieldNumber(i.value);
  return v > 0 && v <= MAX ? null : `Enter a value above 0 ${FROM_UNIT[i.from]}, up to 1,000,000,000 ${FROM_UNIT[i.from]}.`;
};

function compute(i: Inputs): { inputs: Inputs; out: Converted } | null {
  return errorOf(i) ? null : { inputs: i, out: convert(i.from, fieldNumber(i.value)) };
}

export function BtuTool() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [result, setResult] = useState<{ inputs: Inputs; out: Converted } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fieldErrors = useFieldErrors();
  const error = errorOf(inputs) ?? undefined;
  const query = useMemo(() => (result ? buildQuery({ from: result.inputs.from, value: result.inputs.value }) : ''), [result]);
  const { markChanged, shareUrl } = useUrlState(query, (params) => {
    const next = { from: choiceParam(params, 'from', ['btu', 'w', 'ton'] as const) ?? DEFAULTS.from, value: numberParam(params, 'value') ?? '' };
    setInputs(next);
    setResult(compute(next));
  });
  const update = (patch: Partial<Inputs>) => {
    markChanged();
    setInputs((prev) => ({ ...prev, ...patch }));
  };
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (error) {
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
  const shown = fieldErrors.shown('value', error);

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="BTU to watts calculator">
        <div className="grid gap-x-10 gap-y-7 lg:grid-cols-2">
          <Segmented
            name="from"
            legend="Convert from"
            value={inputs.from}
            options={(['btu', 'w', 'ton'] as From[]).map((f) => ({ value: f, label: FROM_LABEL[f] }))}
            onChange={(from) => update({ from })}
          />
          <Field id="value" label={`${FROM_LABEL[inputs.from]}, ${FROM_UNIT[inputs.from]}`} error={shown}>
            <TextInput
              id="value"
              value={inputs.value}
              onChange={(value) => update({ value })}
              onBlur={() => fieldErrors.touch('value')}
              error={shown}
              describedById={describedBy('value', shown, false)}
              className="max-w-[12rem]"
            />
          </Field>
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
      {result && <Outcome inputs={result.inputs} out={result.out} headingRef={headingRef} shareUrl={shareUrl} />}
    </div>
  );
}

function Outcome({
  inputs,
  out,
  headingRef,
  shareUrl,
}: {
  inputs: Inputs;
  out: Converted;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  shareUrl: () => string;
}) {
  const entered = fieldNumber(inputs.value);
  const B = <Val v={inputs.from === 'btu' ? entered : r6(out.btu)} unit="Btu/h" src={inputs.from === 'btu' ? 'input' : CALC} />;
  const W = <Val v={inputs.from === 'w' ? entered : r6(out.watts)} unit="W" src={inputs.from === 'w' ? 'input' : CALC} />;
  const tons = inputs.from === 'ton' ? entered : r6(out.tons);
  const T = (
    <span>
      <Num v={tons} src={inputs.from === 'ton' ? 'input' : CALC} /> {tons === 1 ? 'ton' : 'tons'}
    </span>
  );
  const big = inputs.from === 'btu' ? [W, T] : inputs.from === 'w' ? [B, T] : [W, B];
  const factor = <Val v={W_PER_BTU_PER_H} unit="W" src={SP811} />;
  const perTon = <Val v={BTU_PER_H_PER_TON} unit="Btu/h" src={SP811} />;
  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none">
        {inputs.from === 'btu' ? B : inputs.from === 'w' ? W : T} is
      </h2>
      <div className="mt-3 flex flex-wrap gap-x-10 gap-y-2">
        {big.map((node, k) => (
          <p key={k} className="font-mono text-[34px] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[46px]">
            {node}
          </p>
        ))}
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full max-w-[38rem] border-collapse text-[15px]" data-src={CALC}>
          <caption className="sr-only">The same rate in Btu per hour, watts and tons</caption>
          <tbody>
            {[
              ['Btu per hour', B],
              ['Watts', W],
              ['Tons of refrigeration', T],
            ].map(([label, node]) => (
              <tr key={String(label)} className="border-b border-cut-rule first:border-t-2 first:border-t-ink">
                <th scope="row" className="py-2 pr-4 text-left font-normal">
                  {label}
                </th>
                <td className="whitespace-nowrap py-2 pl-4 text-right font-mono tabular-nums">{node}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 max-w-[38rem] space-y-4 text-[17px] leading-[1.65] text-ink" data-src={SP811}>
        <p>
          <strong>The factors, from NIST SP 811:</strong> 1 Btu/h = {factor}; 1 ton of refrigeration = {perTon}.
        </p>
        <p>
          Btu per hour × <Num v={W_PER_BTU_PER_H} src={SP811} /> = watts; Btu per hour ÷ <Num v={BTU_PER_H_PER_TON} src={SP811} /> = tons.
        </p>
      </div>
      <div className="mt-8 max-w-[38rem] border-t border-cut-rule pt-4 text-[15px] leading-[1.6] text-[#333333]">
        <p>
          These are rates of heat. The watts here are the heat a unit moves or gives off, not the electric power it draws; that is on its
          nameplate.{' '}
          <Link href="/methodology#conversions" className={LINK}>
            How these values are calculated
          </Link>
          .
        </p>
      </div>
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}
