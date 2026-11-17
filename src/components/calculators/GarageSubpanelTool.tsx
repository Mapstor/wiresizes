'use client';

// The garage subpanel calculator in the look (WSZ-008f; spec: research/page-specs-held.md "WSZ-008"; data gate BUILD
// since WSZ-029): the feeder from the house panel to a subpanel in a detached garage. Engine: garageRun in
// src/lib/calculations/garage-subpanel.ts (the wire size engine for the conductors, ground wire and voltage drop; 250.32
// for the four wires; 225.39 for the garage's disconnect; Table 300.5(A) for the cover). Results appear only after
// Calculate; a share link restores them.
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
import { EGC_LARGER_THAN_CONDUCTOR_NOTE } from '@/lib/calculations/conductor-sizing';
import type { Termination, WiringMethod } from '@/lib/calculations/conductor-sizing';
import { LENGTH_MAX_FT, LENGTH_MIN_FT, VD_TARGET_OPTIONS } from '@/lib/calculations/voltage-drop';
import { GARAGE_CALC, GARAGE_RATINGS, garageRun, isGarageError } from '@/lib/calculations/garage-subpanel';
import type { GarageBurial, GarageRun, GarageVolts } from '@/lib/calculations/garage-subpanel';
import { TERMINATION_RULES } from '@/lib/verified/nec-110-14c';
import { CONTINUOUS_LOAD_PERCENT } from '@/lib/verified/nec-continuous-load-2023';
import { BURIAL_METHODS, BURIAL_PLACES, NEC_300_5_DOMAIN } from '@/lib/verified/nec-300-5';
import { DISCONNECT_MIN_A } from '@/lib/verified/nec-separate-buildings';
import type { BurialPlace } from '@/lib/verified/nec-300-5';
import type { Material } from '@/lib/verified/awg';

const CALC = GARAGE_CALC;
const TERM = 'nec-110-14c';
const OCPD = 'nec-240-ocpd';
const OUT = 'nec-feeders-outbuildings';
const LOAD = 'nec-continuous-load';
const BURY = NEC_300_5_DOMAIN;
const LINK = 'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]';
const METAL: Record<Material, string> = { Cu: 'copper', Al: 'aluminum' };

interface Inputs {
  rating: string;
  load: string;
  material: Material;
  method: WiringMethod;
  termination: Termination;
  length: string;
  volts: GarageVolts;
  target: string;
  burial: GarageBurial;
  place: BurialPlace;
}
const DEFAULTS: Inputs = {
  rating: '60',
  load: '',
  material: 'Cu',
  method: 'conductors',
  termination: 'unknown',
  length: '100',
  volts: 240,
  target: '3',
  burial: 'nonmetallic',
  place: 'general',
};
const BURIALS: GarageBurial[] = ['none', ...BURIAL_METHODS.map((m) => m.id)];

// Each hint and each error fits one line down to a 320 px screen (WSZ-009a).
type Key = 'load' | 'length';
type Errors = Partial<Record<Key, string>>;

function errorsOf(i: Inputs): Errors {
  const e: Errors = {};
  const rating = Number(i.rating);
  if (i.load.trim() !== '') {
    const a = fieldNumber(i.load);
    if (!(a > 0 && a <= rating)) e.load = `Enter up to ${formatValue(rating)} A, or leave it empty.`;
  }
  const ft = fieldNumber(i.length);
  if (!(ft >= LENGTH_MIN_FT && ft <= LENGTH_MAX_FT)) e.length = `Enter ${formatValue(LENGTH_MIN_FT)} to ${formatValue(LENGTH_MAX_FT)} ft.`;
  return e;
}

type Outcome = { inputs: Inputs; r: GarageRun } | { inputs: Inputs; error: string };

function compute(i: Inputs): Outcome | null {
  if (Object.keys(errorsOf(i)).length > 0) return null;
  const r = garageRun({
    feederA: Number(i.rating),
    material: i.material,
    wiringMethod: i.method,
    termination: i.method === 'cable' ? 'unknown' : i.termination,
    loadA: i.load.trim() === '' ? null : fieldNumber(i.load),
    lengthFt: fieldNumber(i.length),
    volts: i.volts,
    vdTargetPct: Number(i.target),
    burial: i.burial,
    place: i.place,
  });
  return isGarageError(r) ? { inputs: i, error: r.error } : { inputs: i, r };
}

function inputsFromQuery(params: URLSearchParams): Inputs {
  const rating = choiceParam(params, 'rating', GARAGE_RATINGS);
  const target = choiceParam(params, 'target', VD_TARGET_OPTIONS);
  return {
    rating: rating === null ? DEFAULTS.rating : String(rating),
    load: numberParam(params, 'load') ?? '',
    material: choiceParam(params, 'material', ['cu', 'al'] as const) === 'al' ? 'Al' : 'Cu',
    method: choiceParam(params, 'method', ['cable', 'c'] as const) === 'cable' ? 'cable' : 'conductors',
    termination: choiceParam(params, 'terminals', ['unknown', '60', '75'] as const) ?? DEFAULTS.termination,
    length: numberParam(params, 'length') ?? DEFAULTS.length,
    volts: choiceParam(params, 'v', ['240', '208'] as const) === '208' ? 208 : 240,
    target: target === null ? DEFAULTS.target : String(target),
    burial: choiceParam(params, 'burial', BURIALS) ?? DEFAULTS.burial,
    place: choiceParam(params, 'place', BURIAL_PLACES.map((p) => p.id)) ?? DEFAULTS.place,
  };
}

const queryOf = (i: Inputs) =>
  buildQuery({
    rating: i.rating,
    load: i.load.trim(),
    material: i.material.toLowerCase(),
    method: i.method === 'cable' ? 'cable' : 'c',
    terminals: i.method === 'conductors' ? i.termination : '',
    length: i.length.trim(),
    v: i.volts,
    target: i.target,
    burial: i.burial,
    place: i.burial === 'none' ? '' : i.place,
  });

export function GarageSubpanelTool() {
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
  const text = (k: Key, label: string, hint: React.ReactNode) => (
    <Field id={k} label={label} hint={hint} error={shown(k)}>
      <TextInput
        id={k}
        value={inputs[k]}
        onChange={(v) => update({ [k]: v } as Partial<Inputs>)}
        onBlur={() => fieldErrors.touch(k)}
        error={shown(k)}
        describedById={describedBy(k, shown(k), true)}
        inputMode="decimal"
        className="max-w-[12rem]"
      />
    </Field>
  );

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Garage subpanel calculator">
        <div className="grid gap-x-10 gap-y-7 lg:grid-cols-2">
          <Field id="rating" label="Feeder breaker, A" hint="In the house panel, feeding the garage.">
            <SelectInput id="rating" value={inputs.rating} onChange={(rating) => update({ rating })} describedById="rating-hint">
              {GARAGE_RATINGS.map((a) => (
                <option key={a} value={String(a)} data-src={OCPD}>
                  {formatValue(a)} A
                </option>
              ))}
            </SelectInput>
          </Field>
          {text(
            'load',
            'Calculated load, A',
            <span data-src={LOAD}>
              Optional. Count continuous loads at <Val v={CONTINUOUS_LOAD_PERCENT} unit="%" src={LOAD} />.
            </span>,
          )}
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
                <Val v={TERMINATION_RULES.columnAboveLimit} unit="°C" src={TERM} /> only if every terminal is listed for it. Not sure:{' '}
                <Val v={TERMINATION_RULES.columnAtOrBelowLimit} unit="°C" src={TERM} /> up to <Val v={TERMINATION_RULES.limitA} unit="A" src={TERM} />,{' '}
                <Val v={TERMINATION_RULES.columnAboveLimit} unit="°C" src={TERM} /> above.
              </p>
            </div>
          ) : (
            <p className="self-end text-[15px] leading-[1.6] text-[#333333]" data-src={TERM}>
              Cable stays in the <Val v={TERMINATION_RULES.cableColumn} unit="°C" src={TERM} /> column.
            </p>
          )}
          {text('length', 'One-way length, ft', 'House panel to garage panel.')}
          <Segmented
            name="volts"
            legend="Supply"
            value={String(inputs.volts)}
            options={[
              { value: '240', label: <span data-src="input">120/240 V</span> },
              { value: '208', label: <span data-src="input">120/208 V</span> },
            ]}
            onChange={(v) => update({ volts: v === '208' ? 208 : 240 })}
          />
          <Field id="target" label="Voltage drop target" hint="The 215.2(A) note's figure for feeders.">
            <SelectInput id="target" value={inputs.target} onChange={(target) => update({ target })} describedById="target-hint">
              {VD_TARGET_OPTIONS.map((p) => (
                <option key={p} value={String(p)} data-src={p === 3 ? LOAD : 'input'}>
                  {formatValue(p)} %
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field id="burial" label="Underground run" hint={BURIAL_METHODS.find((m) => m.id === inputs.burial)?.label ?? 'How the feeder is buried, if it is.'}>
            <SelectInput id="burial" value={inputs.burial} onChange={(burial) => update({ burial: burial as GarageBurial })} describedById="burial-hint">
              <option value="none">Not buried</option>
              {BURIAL_METHODS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.pick}
                </option>
              ))}
            </SelectInput>
          </Field>
          {inputs.burial !== 'none' && (
            <Field
              id="place"
              label="Buried under"
              hint={<span data-src={BURY}>{BURIAL_PLACES.find((p) => p.id === inputs.place)?.label}. Table 300.5(A).</span>}
            >
              <SelectInput id="place" value={inputs.place} onChange={(place) => update({ place: place as BurialPlace })} describedById="place-hint">
                {BURIAL_PLACES.map((p) => (
                  <option key={p.id} value={p.id} data-src={BURY}>
                    {p.pick}
                  </option>
                ))}
              </SelectInput>
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
      {result && 'r' in result && <Result inputs={result.inputs} r={result.r} headingRef={headingRef} shareUrl={shareUrl} />}
    </div>
  );
}

const NOTE = 'max-w-[38rem] text-[17px] leading-[1.65] text-ink';
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
  r: GarageRun;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  shareUrl: () => string;
}) {
  const f = r.feeder;
  const rating = Number(inputs.rating);
  const length = fieldNumber(inputs.length);
  const stepped = f.size !== f.minSizeByAmpacity;
  const wireSizeHref = `/calculators/wire-size-calculator?${buildQuery({
    rating: inputs.rating,
    material: inputs.material.toLowerCase(),
    method: inputs.method === 'conductors' ? 'c' : 'nm',
    terminals: inputs.method === 'conductors' ? inputs.termination : '',
    load: inputs.load.trim(),
    length: inputs.length.trim(),
    phase: 'single',
    voltage: inputs.volts,
    target: inputs.target,
  })}`;
  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none">
        {indefiniteArticle(rating) === 'an' ? 'An' : 'A'} <Val v={rating} unit="A" src="input" /> feeder, {METAL[inputs.material]},{' '}
        <Val v={length} unit="ft" src="input" /> one way at <Val v={inputs.volts} unit="V" src="input" />
      </h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <div className={PANEL}>
          <h3 className={PANEL_H}>Hot wires</h3>
          <p className={BIG} data-src={CALC}>
            <Size s={f.size} />
          </p>
          <p className="mt-2 text-[17px] text-ink" data-src={CALC}>
            {stepped ? (
              <>
                for the drop; <Size s={f.minSizeByAmpacity} /> carries the rating
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
          <p className="mt-2 text-[17px] text-ink" data-src={CALC}>
            {METAL[inputs.material]}, the fourth wire
          </p>
        </div>
        <div className={PANEL}>
          <h3 className={PANEL_H}>Voltage drop</h3>
          <p className={BIG} data-src={CALC}>
            <Val v={f.vdPct} unit="%" src={CALC} format={{ fixed: 2 }} />
          </p>
          <p className="mt-2 text-[17px] text-ink" data-src={CALC}>
            <Val v={f.vdVolts} unit="V" src={CALC} format={{ fixed: 2 }} /> at{' '}
            <Val v={inputs.load.trim() === '' ? rating : fieldNumber(inputs.load)} unit="A" src="input" />
          </p>
        </div>
        <div className={PANEL}>
          <h3 className={PANEL_H}>{r.cover ? 'Minimum cover' : 'Garage disconnect'}</h3>
          <p className={BIG} data-src={r.cover ? BURY : OUT}>
            {r.cover ? <Val v={r.cover.inches} unit="in" src={BURY} /> : <Val v={r.disconnectMinA} unit="A" src={OUT} />}
          </p>
          <p className="mt-2 text-[17px] text-ink" data-src={r.cover ? BURY : OUT}>
            {r.cover ? (
              <>
                <Val v={r.cover.mm} unit="mm" src={BURY} />, top of the run to grade
              </>
            ) : (
              <>
                or more (225.39); <Val v={DISCONNECT_MIN_A.twoCircuits} unit="A" src={OUT} /> with no more than two 2-wire circuits
              </>
            )}
          </p>
        </div>
      </div>
      {f.egc && f.egcLargerThanConductor && <p className={`mt-5 ${NOTE}`}>{EGC_LARGER_THAN_CONDUCTOR_NOTE}</p>}
      <ol className="mt-6 max-w-[38rem] list-decimal space-y-2 pl-6 text-[17px] leading-[1.65] text-ink" data-src={CALC}>
        {r.stepParts.map((parts, k) => (
          <li key={k}>
            <ValText parts={parts} />
          </li>
        ))}
      </ol>
      <p className="mt-8 max-w-[38rem] border-t border-cut-rule pt-4 text-[15px] leading-[1.6] text-[#333333]" data-src={CALC}>
        The calculator does not pick the feeder&apos;s rating: a load calculation does.{' '}
        <Link href="/calculators/residential-load-calculator" className={LINK}>
          Residential load calculator
        </Link>
        {' · '}
        <Link href={wireSizeHref} className={LINK}>
          Open this feeder in the wire size calculator
        </Link>{' '}
        for heat or bundling.{' '}
        <Link href="/methodology#garage-method" className={LINK}>
          How the calculator works
        </Link>
        .
      </p>
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}
