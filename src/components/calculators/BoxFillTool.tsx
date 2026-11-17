'use client';

// The box fill calculator in the look (WSZ-009d; spec: research/page-specs-held.md "WSZ-009"; data gate BUILD since
// WSZ-032): a box from Table 314.16(A) or the volume marked on it, the conductors as 314.16(B)(1) counts them, the
// ground wires, devices, clamps and support fittings → the fill against the box volume, every allowance shown.
// Engine: boxFill in src/lib/calculations/box-fill.ts. Results appear only after Calculate; a share link restores them.
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Num } from '@/components/content/Num';
import { Size } from '@/components/content/Size';
import { Val } from '@/components/content/Val';
import { ValText } from '@/components/content/ValText';
import { ResultActions } from '@/components/look/ResultActions';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, FIELD_LABEL, Field, Segmented, SelectInput, TextInput, describedBy } from '@/components/look/Form';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '@/lib/calculations/fields';
import { formatValue } from '@/lib/calculations/format';
import { BOX_FILL_CALC, BOX_LIMITS, KIND_ORDER, boxFill, in3Format, isBoxFillError } from '@/lib/calculations/box-fill';
import type { BoxFillResult } from '@/lib/calculations/box-fill';
import { BOX_FILL_DOMAIN, BOX_SIZES, FILL_RULES, METAL_BOXES } from '@/lib/verified/nec-314-16';
import type { BoxKind, BoxSize } from '@/lib/verified/nec-314-16';

const CALC = BOX_FILL_CALC;
const SRC = BOX_FILL_DOMAIN;
const LINK = 'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]';
/** The sizes in the order a reader looks for them: house wiring first. */
const SIZE_ORDER: BoxSize[] = ['14', '12', '10', '8', '6', '16', '18'];
const KIND_GROUP: Record<BoxKind, string> = {
  device: 'Device boxes',
  square: 'Square boxes',
  'round/octagonal': 'Round and octagonal boxes',
  'masonry box/gang': 'Masonry boxes',
  'FS/FD box': 'FS and FD boxes',
};

type CountKey = `c${BoxSize}`;
interface Inputs extends Record<CountKey, string> {
  box: string;
  marked: string;
  added: string;
  egc: string;
  egcSize: BoxSize;
  devices: string;
  deviceSize: BoxSize;
  gangs: string;
  clamps: 'yes' | 'no';
  fittings: '0' | '1' | '2';
}
const DEFAULTS: Inputs = {
  box: 'device-3-2-3-1-2',
  marked: '',
  added: '',
  c18: '',
  c16: '',
  c14: '',
  c12: '4',
  c10: '',
  c8: '',
  c6: '',
  egc: '2',
  egcSize: '12',
  devices: '1',
  deviceSize: '12',
  gangs: '',
  clamps: 'yes',
  fittings: '0',
};
if (!METAL_BOXES.some((b) => b.id === DEFAULTS.box)) throw new Error('BoxFillTool: the default box is not in Table 314.16(A)');

type Key = CountKey | 'marked' | 'added' | 'egc' | 'devices' | 'gangs';
type Errors = Partial<Record<Key, string>>;
const countKey = (s: BoxSize): CountKey => `c${s}`;
/** An empty count field is zero. */
const count = (text: string) => (text.trim() === '' ? 0 : fieldNumber(text));
const wholeUpTo = (text: string, max: number) => {
  const n = count(text);
  return Number.isInteger(n) && n >= 0 && n <= max;
};

// Each hint and each error fits one line down to a 320 px screen (WSZ-009a).
function errorsOf(i: Inputs): Errors {
  const e: Errors = {};
  if (i.box === 'marked') {
    const v = fieldNumber(i.marked);
    if (!(v > 0 && v <= BOX_LIMITS.volumeIn3)) e.marked = `Enter the marked volume, up to ${BOX_LIMITS.volumeIn3} in³.`;
  }
  if (i.added.trim() !== '') {
    const v = fieldNumber(i.added);
    if (!(v >= 0 && v <= BOX_LIMITS.addedIn3)) e.added = `Enter 0 to ${BOX_LIMITS.addedIn3} in³, or leave it empty.`;
  }
  for (const s of BOX_SIZES) if (!wholeUpTo(i[countKey(s)], BOX_LIMITS.conductorsPerSize)) e[countKey(s)] = `0 to ${BOX_LIMITS.conductorsPerSize}.`;
  if (!wholeUpTo(i.egc, BOX_LIMITS.egc)) e.egc = `Enter a whole number, 0 to ${BOX_LIMITS.egc}.`;
  if (!wholeUpTo(i.devices, BOX_LIMITS.devices)) e.devices = `Enter a whole number, 0 to ${BOX_LIMITS.devices}.`;
  if (!wholeUpTo(i.gangs, BOX_LIMITS.extraGangs)) e.gangs = `Enter a whole number, 0 to ${BOX_LIMITS.extraGangs}.`;
  return e;
}

type Outcome = { inputs: Inputs; r: BoxFillResult } | { inputs: Inputs; error: string };

function compute(i: Inputs): Outcome | null {
  if (Object.keys(errorsOf(i)).length > 0) return null;
  const table = METAL_BOXES.find((b) => b.id === i.box);
  const r = boxFill({
    boxIn3: table ? table.in3 : fieldNumber(i.marked),
    boxSource: table ? 'table' : 'marked',
    addedIn3: i.added.trim() === '' ? 0 : fieldNumber(i.added),
    conductors: Object.fromEntries(BOX_SIZES.map((s) => [s, count(i[countKey(s)])])) as Record<BoxSize, number>,
    egcCount: count(i.egc),
    egcSize: i.egcSize,
    devices: count(i.devices),
    deviceSize: i.deviceSize,
    extraGangs: count(i.gangs),
    clamps: i.clamps === 'yes',
    fittingTypes: Number(i.fittings),
  });
  return isBoxFillError(r) ? { inputs: i, error: r.error } : { inputs: i, r };
}

const BOX_IDS = ['marked', ...METAL_BOXES.map((b) => b.id)];

function inputsFromQuery(params: URLSearchParams): Inputs {
  const counts = Object.fromEntries(BOX_SIZES.map((s) => [countKey(s), numberParam(params, countKey(s)) ?? ''])) as Record<CountKey, string>;
  return {
    ...counts,
    box: choiceParam(params, 'box', BOX_IDS) ?? DEFAULTS.box,
    marked: numberParam(params, 'vol') ?? '',
    added: numberParam(params, 'add') ?? '',
    egc: numberParam(params, 'g') ?? '',
    egcSize: choiceParam(params, 'gs', BOX_SIZES) ?? DEFAULTS.egcSize,
    devices: numberParam(params, 'd') ?? '',
    deviceSize: choiceParam(params, 'ds', BOX_SIZES) ?? DEFAULTS.deviceSize,
    gangs: numberParam(params, 'x') ?? '',
    clamps: choiceParam(params, 'cl', ['yes', 'no'] as const) ?? 'no',
    fittings: choiceParam(params, 'f', ['0', '1', '2'] as const) ?? '0',
  };
}

const queryOf = (i: Inputs) =>
  buildQuery({
    box: i.box,
    vol: i.box === 'marked' ? i.marked.trim() : '',
    add: i.added.trim(),
    ...Object.fromEntries(BOX_SIZES.map((s) => [countKey(s), i[countKey(s)].trim()])),
    g: i.egc.trim(),
    gs: count(i.egc) > 0 ? i.egcSize : '',
    d: i.devices.trim(),
    ds: count(i.devices) > 0 ? i.deviceSize : '',
    x: i.gangs.trim(),
    cl: i.clamps,
    f: i.fittings === '0' ? '' : i.fittings,
  });

export function BoxFillTool() {
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
  const text = (k: Key, label: React.ReactNode, hint: React.ReactNode, width = 'max-w-[12rem]') => (
    <Field id={k} label={label} hint={hint} error={shown(k)}>
      <TextInput
        id={k}
        value={inputs[k]}
        onChange={(v) => update({ [k]: v } as Partial<Inputs>)}
        onBlur={() => fieldErrors.touch(k)}
        error={shown(k)}
        describedById={describedBy(k, shown(k), hint !== null)}
        inputMode="numeric"
        className={width}
      />
    </Field>
  );
  const sizeSelect = (id: 'egcSize' | 'deviceSize', label: string, hint: string) => (
    <Field id={id} label={label} hint={hint}>
      <SelectInput id={id} value={inputs[id]} onChange={(v) => update({ [id]: v as BoxSize } as Partial<Inputs>)} describedById={`${id}-hint`}>
        {SIZE_ORDER.map((s) => (
          <option key={s} value={s}>
            {s} AWG
          </option>
        ))}
      </SelectInput>
    </Field>
  );
  const picked = METAL_BOXES.find((b) => b.id === inputs.box);

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Box fill calculator">
        <div className="grid gap-x-10 gap-y-7 lg:grid-cols-2">
          <Field
            id="box"
            label="Box"
            hint={
              picked ? (
                <span data-src={SRC}>
                  {picked.kindLabel}, <Val v={picked.in3} unit="in³" src={SRC} format={{ fixed: 1 }} /> (Table 314.16(A)).
                </span>
              ) : (
                'Plastic boxes carry their volume, 314.16(A)(2).'
              )
            }
          >
            <SelectInput id="box" value={inputs.box} onChange={(box) => update({ box })} describedById="box-hint">
              <option value="marked">Volume marked on box</option>
              {KIND_ORDER.map((kind) => (
                <optgroup key={kind} label={KIND_GROUP[kind]}>
                  {METAL_BOXES.filter((b) => b.kind === kind).map((b) => (
                    <option key={b.id} value={b.id} data-src={SRC}>
                      {b.inches}
                      {b.kind === 'FS/FD box' ? ` ${b.kindLabel.split(' ')[0]}` : ' in'}, {formatValue(b.in3, { fixed: 1 })} in³
                    </option>
                  ))}
                </optgroup>
              ))}
            </SelectInput>
          </Field>
          {inputs.box === 'marked' ? text('marked', 'Marked volume, in³', 'As molded or printed in the box.') : <div className="hidden lg:block" />}
          {text('added', 'Rings and covers, in³', 'Optional: a marked plaster or extension ring, or a domed cover.')}
          <div className="hidden lg:block" />
          <fieldset className="lg:col-span-2">
            <legend className={FIELD_LABEL}>Conductors, by size</legend>
            <p className="mt-1 max-w-[44rem] text-[15px] leading-[1.6] text-[#333333]" data-src={SRC}>
              Each wire that enters and ends or is spliced here counts once, a pass-through once, a long loop twice. Skip pigtails that stay in
              the box, and count ground wires below.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
              {SIZE_ORDER.map((s) => (
                <div key={s}>{text(countKey(s), <Size s={s} />, null, 'max-w-[7rem]')}</div>
              ))}
            </div>
          </fieldset>
          {text('egc', 'Ground wires entering', <span data-src={SRC}>Up to {FILL_RULES.egcSingleUpTo === 4 ? 'four' : FILL_RULES.egcSingleUpTo} count once.</span>)}
          {sizeSelect('egcSize', 'Largest ground wire', 'Sets the ground wire allowance.')}
          {text('devices', 'Devices (yokes or straps)', 'A switch or receptacle on one yoke counts twice.')}
          {sizeSelect('deviceSize', 'Largest wire on the devices', 'The device allowance uses this size.')}
          {text('gangs', 'Extra gangs, wide devices', 'Optional: gangs past one for a device wider than one box.')}
          <div className="hidden lg:block" />
          <Segmented
            name="clamps"
            legend="Cable clamps inside the box"
            value={inputs.clamps}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
            onChange={(clamps) => update({ clamps })}
          />
          <Segmented
            name="fittings"
            legend="Luminaire studs or hickeys"
            value={inputs.fittings}
            options={[
              { value: '0', label: 'None' },
              { value: '1', label: 'One type' },
              { value: '2', label: 'Both' },
            ]}
            onChange={(fittings) => update({ fittings })}
          />
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

const BIG = 'mt-2 font-mono text-[34px] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[46px]';
const PANEL = 'border-t border-cut-rule pt-4';
const PANEL_H = 'font-display text-[17px] font-semibold text-ink';

function Result({
  inputs,
  r,
  headingRef,
  shareUrl,
}: {
  inputs: Inputs;
  r: BoxFillResult;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  shareUrl: () => string;
}) {
  const table = METAL_BOXES.find((b) => b.id === inputs.box);
  const boxSrc = inputs.added.trim() !== '' && fieldNumber(inputs.added) > 0 ? CALC : table ? SRC : 'input';
  const boxFormat = table && boxSrc === SRC ? { fixed: 1 } : { upTo: 3 };
  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none">
        {table ? (
          <>
            {table.inches} {table.kind === 'FS/FD box' ? table.kindLabel : `in ${table.kind} box`}
          </>
        ) : (
          'A box marked with its volume'
        )}
      </h2>
      <p className="mt-3 font-display text-[24px] font-semibold leading-tight text-ink sm:text-[28px]" data-src={CALC}>
        {r.fits ? 'The box is large enough.' : 'The box is too small.'}
      </p>
      <div className="mt-4 grid gap-6 sm:grid-cols-3">
        <div className={PANEL}>
          <h3 className={PANEL_H}>Box fill</h3>
          <p className={BIG} data-src={CALC}>
            <Val v={r.fillIn3} unit="in³" src={CALC} format={in3Format(r.fillIn3)} />
          </p>
        </div>
        <div className={PANEL}>
          <h3 className={PANEL_H}>Box volume</h3>
          <p className={BIG} data-src={boxSrc}>
            <Val v={r.boxIn3} unit="in³" src={boxSrc} format={boxFormat} />
          </p>
        </div>
        <div className={PANEL}>
          <h3 className={PANEL_H}>{r.fits ? 'Room left' : 'Over by'}</h3>
          <p className={BIG} data-src={CALC}>
            <Val v={Math.abs(r.spareIn3)} unit="in³" src={CALC} format={in3Format(Math.abs(r.spareIn3))} />
          </p>
        </div>
      </div>
      <div className="mt-8 max-w-[44rem]">
        <h3 className={PANEL_H}>The fill, allowance by allowance</h3>
        <ul className="mt-3 border-t border-ink">
          {r.lines.map((l, k) => (
            <li key={k} className="border-b border-cut-rule py-3">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[17px] text-ink">{l.what}</span>
                <span className="shrink-0 font-mono text-[17px] text-ink" data-src={CALC}>
                  <Val v={l.in3} unit="in³" src={CALC} format={in3Format(l.in3)} />
                </span>
              </div>
              <p className="mt-1 text-[14px] leading-[1.5] text-[#555555]" data-src={SRC}>
                <Num v={l.allowances} src={l.rule === '(B)(1)' ? 'input' : CALC} /> × <Val v={l.perIn3} unit="in³" src={SRC} format={{ fixed: 2 }} /> ·
                314.16{l.rule} · {l.basis}
              </p>
            </li>
          ))}
          <li className="flex items-baseline justify-between gap-4 border-b-2 border-ink py-3">
            <span className="text-[17px] font-semibold text-ink">Fill</span>
            <span className="shrink-0 font-mono text-[17px] font-semibold text-ink" data-src={CALC}>
              <Val v={r.fillIn3} unit="in³" src={CALC} format={in3Format(r.fillIn3)} />
            </span>
          </li>
        </ul>
      </div>
      <p className="mt-6 max-w-[38rem] text-[17px] leading-[1.65] text-ink" data-src={CALC}>
        <ValText parts={r.stepParts[r.stepParts.length - 1]} />
      </p>
      {r.smallestByKind.length > 0 && (
        <div className="mt-6 max-w-[38rem]" data-src={SRC}>
          <h3 className={PANEL_H}>Metal boxes from Table 314.16(A) with room for this fill</h3>
          <ul className="mt-2 space-y-1 text-[17px] leading-[1.6] text-ink">
            {r.smallestByKind.map(({ kind, box }) => (
              <li key={kind}>
                {KIND_GROUP[kind]}: {box.inches}
                {box.kind === 'FS/FD box' ? ` ${box.kindLabel}` : ' in'}, <Val v={box.in3} unit="in³" src={SRC} format={{ fixed: 1 }} />
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-8 max-w-[38rem] border-t border-cut-rule pt-4 text-[15px] leading-[1.6] text-[#333333]" data-src={SRC}>
        Terminal blocks are not counted here: each block takes one allowance for its largest conductor, 314.16(B)(6).{' '}
        <Link href="/methodology#box-fill-method" className={LINK}>
          How the calculator works
        </Link>
        .
      </p>
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}
