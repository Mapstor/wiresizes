'use client';

// The conduit fill calculator in the look (WSZ-039; withdrawn in WSZ-002, back on NEC 2023 Informative Annex C): a
// raceway, a conductor type and size → the most of them in a trade size, or the smallest trade size for a number of
// them. Engine: conduitFill in src/lib/calculations/conduit-fill.ts. Results appear only after Calculate; a share link
// restores them.
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Num } from '@/components/content/Num';
import { Size } from '@/components/content/Size';
import { Val } from '@/components/content/Val';
import { ValText } from '@/components/content/ValText';
import { ResultActions } from '@/components/look/ResultActions';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Field, Segmented, SelectInput, TextInput, describedBy } from '@/components/look/Form';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '@/lib/calculations/fields';
import { formatSize } from '@/lib/verified/awg';
import {
  CONDUIT_FILL_CALC,
  CONDUIT_FILL_ERROR_MESSAGES,
  FILL_LIMITS,
  conduitFill,
  isConduitFillError,
  racewayInSentence,
  sizesFor,
} from '@/lib/calculations/conduit-fill';
import type { ConduitFillResult, FillMode } from '@/lib/calculations/conduit-fill';
import { CONDUCTOR_TYPES, CONDUIT_FILL_DOMAIN, FILL_NOTES, RACEWAYS, TRADE_SIZES, conductorType, racewayTradeIndexes } from '@/lib/verified/nec-annex-c';

const CALC = CONDUIT_FILL_CALC;
const SRC = CONDUIT_FILL_DOMAIN;
const LINK = 'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]';

interface Inputs {
  mode: FillMode;
  raceway: string;
  type: string;
  compact: 'no' | 'yes';
  size: string;
  trade: string;
  conductors: string;
}
const DEFAULTS: Inputs = { mode: 'count', raceway: 'emt', type: 'thhn', compact: 'no', size: '12', trade: '2', conductors: '' };
if (TRADE_SIZES[Number(DEFAULTS.trade)].trade !== '3/4') throw new Error('ConduitFillTool: the default trade size moved');

/** The sizes and trade sizes the current choices offer. */
function optionsFor(i: Pick<Inputs, 'raceway' | 'type' | 'compact'>) {
  const compact = i.compact === 'yes' && conductorType(i.type).compactGroup !== null;
  return { compact, sizes: sizesFor(i.raceway, i.type, compact), trades: racewayTradeIndexes(i.raceway).map(String) };
}

/** Keeps the size and trade size valid after the raceway, type or stranding changes: the nearest the reader had. */
function settle(i: Inputs): Inputs {
  const o = optionsFor(i);
  const size = o.sizes.includes(i.size) ? i.size : o.sizes.includes('12') ? '12' : o.sizes[0];
  const trade = o.trades.includes(i.trade) ? i.trade : o.trades[0];
  const compact = o.compact ? 'yes' : 'no';
  return { ...i, size, trade, compact };
}

type Errors = Partial<Record<'conductors', string>>;
function errorsOf(i: Inputs): Errors {
  if (i.mode !== 'size') return {};
  const n = fieldNumber(i.conductors);
  return Number.isInteger(n) && n >= 1 && n <= FILL_LIMITS.conductors ? {} : { conductors: `Enter a whole number, 1 to ${FILL_LIMITS.conductors}.` };
}

type Outcome = { inputs: Inputs; r: ConduitFillResult } | { inputs: Inputs; error: string };

function compute(i: Inputs): Outcome | null {
  if (Object.keys(errorsOf(i)).length > 0) return null;
  const r = conduitFill({
    raceway: i.raceway,
    type: i.type,
    compact: i.compact === 'yes',
    size: i.size,
    mode: i.mode,
    tradeIndex: Number(i.trade),
    conductors: i.mode === 'size' ? fieldNumber(i.conductors) : undefined,
  });
  return isConduitFillError(r) ? { inputs: i, error: CONDUIT_FILL_ERROR_MESSAGES[r.error] } : { inputs: i, r };
}

const RACEWAY_IDS = RACEWAYS.map((r) => r.id);
const TYPE_IDS = CONDUCTOR_TYPES.map((t) => t.id);
const ALL_SIZES = Array.from(new Set(RACEWAYS.flatMap((r) => CONDUCTOR_TYPES.flatMap((t) => [...sizesFor(r.id, t.id, false), ...sizesFor(r.id, t.id, true)]))));
const TRADE_IDS = TRADE_SIZES.map((_, k) => String(k));

function inputsFromQuery(params: URLSearchParams): Inputs {
  return settle({
    mode: choiceParam(params, 'm', ['count', 'size'] as const) ?? DEFAULTS.mode,
    raceway: choiceParam(params, 'r', RACEWAY_IDS) ?? DEFAULTS.raceway,
    type: choiceParam(params, 't', TYPE_IDS) ?? DEFAULTS.type,
    compact: choiceParam(params, 'c', ['no', 'yes'] as const) ?? 'no',
    size: choiceParam(params, 's', ALL_SIZES) ?? DEFAULTS.size,
    trade: choiceParam(params, 'ts', TRADE_IDS) ?? DEFAULTS.trade,
    conductors: numberParam(params, 'n') ?? '',
  });
}

const queryOf = (i: Inputs) =>
  buildQuery({
    m: i.mode,
    r: i.raceway,
    t: i.type,
    c: i.compact === 'yes' ? 'yes' : '',
    s: i.size,
    ts: i.mode === 'count' ? i.trade : '',
    n: i.mode === 'size' ? i.conductors.trim() : '',
  });

export function ConduitFillTool() {
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
    setInputs((prev) => settle({ ...prev, ...patch }));
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
  const o = optionsFor(inputs);
  const type = conductorType(inputs.type);
  const shownCount = fieldErrors.shown('conductors', errors.conductors);
  const countHint = 'Ground wires of the same size included.';

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Conduit fill calculator">
        <div className="grid gap-x-10 gap-y-7 lg:grid-cols-2">
          <Field id="raceway" label="Conduit or tubing" hint="The Annex C table for this raceway is used.">
            <SelectInput id="raceway" value={inputs.raceway} onChange={(raceway) => update({ raceway })} describedById="raceway-hint">
              {RACEWAYS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field id="type" label="Conductor insulation type" hint="As printed on the wire.">
            <SelectInput id="type" value={inputs.type} onChange={(t) => update({ type: t })} describedById="type-hint">
              {CONDUCTOR_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field id="size" label="Wire size" hint={o.compact ? 'Compact sizes Table 5A lists.' : 'All the conductors are this size.'}>
            <SelectInput id="size" value={inputs.size} onChange={(size) => update({ size })} describedById="size-hint">
              {o.sizes.map((s) => (
                <option key={s} value={s} data-size={s}>
                  {formatSize(s)}
                </option>
              ))}
            </SelectInput>
          </Field>
          {type.compactGroup ? (
            <Segmented
              name="compact"
              legend="Stranding"
              value={inputs.compact}
              options={[
                { value: 'no', label: 'Concentric' },
                { value: 'yes', label: 'Compact' },
              ]}
              onChange={(compact) => update({ compact })}
            />
          ) : (
            <div className="hidden lg:block" />
          )}
          <Segmented
            name="mode"
            legend="Find"
            value={inputs.mode}
            options={[
              { value: 'count', label: 'How many fit' },
              { value: 'size', label: 'Conduit size' },
            ]}
            onChange={(mode) => update({ mode })}
          />
          {inputs.mode === 'count' ? (
            <Field id="trade" label="Trade size" hint="Metric designator in brackets.">
              <SelectInput id="trade" value={inputs.trade} onChange={(trade) => update({ trade })} describedById="trade-hint">
                {o.trades.map((k) => (
                  <option key={k} value={k} data-src={SRC}>
                    {TRADE_SIZES[Number(k)].trade} ({TRADE_SIZES[Number(k)].metric})
                  </option>
                ))}
              </SelectInput>
            </Field>
          ) : (
            <Field id="conductors" label="Number of conductors" hint={countHint} error={shownCount}>
              <TextInput
                id="conductors"
                value={inputs.conductors}
                onChange={(v) => update({ conductors: v })}
                onBlur={() => fieldErrors.touch('conductors')}
                error={shownCount}
                describedById={describedBy('conductors', shownCount, true)}
                inputMode="numeric"
                className="max-w-[12rem]"
              />
            </Field>
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
      {result && 'r' in result && <Result r={result.r} headingRef={headingRef} shareUrl={shareUrl} />}
    </div>
  );
}

const BIG = 'mt-2 font-mono text-[34px] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[46px]';
const PANEL_H = 'font-display text-[17px] font-semibold text-ink';

function Result({ r, headingRef, shareUrl }: { r: ConduitFillResult; headingRef: React.RefObject<HTMLHeadingElement | null>; shareUrl: () => string }) {
  const mark = r.mode === 'count' ? r.cell : r.smallest;
  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none">
        <Size s={r.size} /> {r.typeLabel} in {racewayInSentence(r.raceway.name)}
      </h2>
      {r.mode === 'count' && r.cell && (
        <>
          <p className={BIG} data-src={SRC}>
            <Num v={r.cell.max} src={SRC} />
          </p>
          <p className="mt-2 text-[17px] text-ink">
            {r.cell.max === 1 ? 'conductor fits' : 'conductors fit'} in trade size {r.cell.trade.trade} ({r.cell.trade.metric})
          </p>
        </>
      )}
      {r.mode === 'size' &&
        (r.smallest ? (
          <>
            <p className={BIG}>{r.smallest.trade.trade}</p>
            <p className="mt-2 text-[17px] text-ink" data-src={SRC}>
              trade size ({r.smallest.trade.metric}) for <Num v={r.conductors ?? 0} src="input" />, which holds up to <Num v={r.smallest.max} src={SRC} />
            </p>
          </>
        ) : (
          <p className="mt-3 font-display text-[24px] font-semibold leading-tight text-ink sm:text-[28px]" data-src={SRC}>
            No trade size holds <Num v={r.conductors ?? 0} src="input" />.
          </p>
        ))}
      <div className="mt-6 max-w-[38rem] overflow-x-auto">
        <table className="w-full border-collapse text-[15px]" data-src={SRC}>
          <caption className="sr-only">Annex C Table {r.table}: the most conductors in each trade size</caption>
          <thead>
            <tr className="border-b-2 border-ink">
              <th scope="col" className="py-2 pr-4 text-left font-semibold">
                Trade size (metric)
              </th>
              <th scope="col" className="py-2 pl-4 text-right font-semibold">
                Most conductors
              </th>
            </tr>
          </thead>
          <tbody>
            {r.row.map((c) => (
              <tr key={c.tradeIndex} className={mark && mark.tradeIndex === c.tradeIndex ? 'border-b border-cut-rule bg-[#f2ece4] font-semibold' : 'border-b border-cut-rule'}>
                <th scope="row" className="py-2 pr-4 text-left font-normal">
                  {c.trade.trade} ({c.trade.metric})
                </th>
                <td className="whitespace-nowrap py-2 pl-4 text-right font-mono tabular-nums">
                  <Num v={c.max} src={SRC} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 max-w-[38rem] space-y-3 text-[17px] leading-[1.65] text-ink">
        {r.stepParts.map((p, k) => (
          <p key={k} data-src={k === r.stepParts.length - 1 ? SRC : CALC}>
            <ValText parts={p} />
          </p>
        ))}
      </div>
      <p className="mt-8 max-w-[38rem] border-t border-cut-rule pt-4 text-[15px] leading-[1.6] text-[#333333]" data-src={SRC}>
        A nipple of up to <Val v={FILL_NOTES.nippleMaxIn} unit="in" src={SRC} /> between boxes may be filled to{' '}
        <Val v={FILL_NOTES.nipplePercent} unit="%" src={SRC} />, more than these counts allow.{' '}
        <Link href="/methodology#conduit-fill-method" className={LINK}>
          How the calculator works
        </Link>
        .
      </p>
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}
