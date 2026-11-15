'use client';

// The residential load calculator in the look (WSZ-010a; spec: research/page-specs-held.md "WSZ-010"; D-41): one
// dwelling unit's calculated load by both methods of NEC 2023 Article 220 from the same inputs, the standard method of
// Part III and the optional method of 220.82, each with its steps, its current at 240 V and the smallest Table 310.12
// service at or above it. Engine: dwellingLoadRun in src/lib/calculations/load-calc-2023.ts; its stepParts are the
// steps shown. Results appear only after Calculate; a share link restores them.
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Size } from '@/components/content/Size';
import { Val } from '@/components/content/Val';
import { ValText } from '@/components/content/ValText';
import { ResultActions } from '@/components/look/ResultActions';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Field, Segmented, TextInput, describedBy } from '@/components/look/Form';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { buildQuery, choiceParam, fieldNumber, numberParam, parseNumberList } from '@/lib/calculations/fields';
import { formatValue, indefiniteArticle } from '@/lib/calculations/format';
import { DWELLING_VOLTS, ENGINE_ID, RANGE_MAX_KW, RANGE_OVER_KW, dwellingLoadRun, isDwellingError } from '@/lib/calculations/load-calc-2023';
import type { DwellingMethodRun, DwellingRun, Heating } from '@/lib/calculations/load-calc-2023';
import { OPTIONAL_METHOD, STANDARD_METHOD } from '@/lib/verified/nec-220-2023';

const CALC = `calc:${ENGINE_ID}`;
const L = 'nec-220-load-calcs';
const SVC = 'nec-310-12';
const LINK = 'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]';
const APPLIANCE_MIN_W = STANDARD_METHOD.applianceMinW;

interface Inputs {
  ft2: string;
  sa: string;
  laundry: string;
  range: string;
  dryer: string;
  water: string;
  others: string;
  ev: string;
  heating: Heating;
  /** Electric heat, or a heat pump's backup heat. */
  heat: string;
  units: string;
  hp: string;
  ac: string;
}
// The golden "load-calc-2023" and "load-calc-2023-standard" house (research/golden-cases.json)
const DEFAULTS: Inputs = {
  ft2: '2000',
  sa: '2',
  laundry: '1',
  range: '12',
  dryer: '5000',
  water: '4500',
  others: '1500, 1500, 500',
  ev: '',
  heating: 'electric',
  heat: '10000',
  units: '1',
  hp: '',
  ac: '5000',
};

// Each hint and each error fits one line down to a 320 px screen, so an error that appears on blur never moves
// Calculate between mousedown and mouseup (WSZ-009a).
type Key = 'ft2' | 'sa' | 'laundry' | 'range' | 'dryer' | 'water' | 'others' | 'ev' | 'heat' | 'units' | 'hp' | 'ac';
type Errors = Partial<Record<Key, string>>;

const EMPTY_OR_WATTS = 'Enter watts, or leave it empty.';
const WHOLE_0 = 'Enter a whole number, 0 or more.';

/** An optional rating: null when empty. */
const optional = (text: string): number | null => (text.trim() === '' ? null : fieldNumber(text));

function errorsOf(i: Inputs): Errors {
  const e: Errors = {};
  const ft2 = fieldNumber(i.ft2);
  if (!(ft2 > 0)) e.ft2 = 'Enter the floor area in ft².';
  for (const k of ['sa', 'laundry'] as const) {
    const n = fieldNumber(i[k]);
    if (!(Number.isInteger(n) && n >= 0)) e[k] = WHOLE_0;
  }
  const range = optional(i.range);
  if (range !== null) {
    if (!(range > RANGE_OVER_KW)) e.range = `Enter more than ${formatValue(RANGE_OVER_KW)} kW.`;
    else if (range > RANGE_MAX_KW) e.range = `Over ${formatValue(RANGE_MAX_KW)} kW: past Table 220.55.`;
  }
  for (const k of ['dryer', 'water', 'ev'] as const) {
    const n = optional(i[k]);
    if (n !== null && !(n > 0)) e[k] = EMPTY_OR_WATTS;
  }
  const others = parseNumberList(i.others);
  if (others.some((n) => !Number.isFinite(n))) e.others = 'Numbers in watts, commas between.';
  else if (others.some((n) => n < APPLIANCE_MIN_W)) e.others = `Each ${formatValue(APPLIANCE_MIN_W)} W or more (220.53).`;
  if (i.heating === 'electric') {
    if (!(fieldNumber(i.heat) > 0)) e.heat = 'Enter the heating watts.';
    const units = fieldNumber(i.units);
    if (!(Number.isInteger(units) && units >= 1)) e.units = 'Enter a whole number, 1 or more.';
  }
  if (i.heating === 'heat-pump') {
    if (!(fieldNumber(i.hp) > 0)) e.hp = 'Enter the heat pump rating in VA.';
    const backup = optional(i.heat);
    if (backup !== null && !(backup >= 0)) e.heat = EMPTY_OR_WATTS;
  } else {
    const ac = optional(i.ac);
    if (ac !== null && !(ac >= 0)) e.ac = 'Enter VA, or leave it empty.';
  }
  return e;
}

type Outcome = { inputs: Inputs; r: DwellingRun } | { inputs: Inputs; error: string };

function compute(i: Inputs): Outcome | null {
  if (Object.keys(errorsOf(i)).length > 0) return null;
  const hp = i.heating === 'heat-pump';
  const r = dwellingLoadRun({
    ft2: fieldNumber(i.ft2),
    smallApplianceCircuits: fieldNumber(i.sa),
    laundryCircuits: fieldNumber(i.laundry),
    rangeKw: optional(i.range),
    dryerW: optional(i.dryer),
    waterHeaterW: optional(i.water),
    otherAppliancesW: parseNumberList(i.others),
    evW: optional(i.ev),
    heating: i.heating,
    heatW: i.heating === 'none' ? 0 : (optional(i.heat) ?? 0),
    heatUnits: i.heating === 'electric' ? fieldNumber(i.units) : 1,
    heatPumpVa: hp ? fieldNumber(i.hp) : 0,
    acVa: hp ? 0 : (optional(i.ac) ?? 0),
  });
  return isDwellingError(r) ? { inputs: i, error: 'These inputs fall outside the calculator. Check the range and heating fields.' } : { inputs: i, r };
}

const HEATING_PARAM = { none: 'none', electric: 'electric', 'heat-pump': 'hp' } as const;
const KEYS = ['ft2', 'sa', 'lc', 'range', 'dryer', 'wh', 'app', 'ev', 'heat', 'hw', 'units', 'hp', 'ac'];

function inputsFromQuery(params: URLSearchParams): Inputs {
  if (!KEYS.some((k) => params.has(k))) return DEFAULTS;
  const heatParam = choiceParam(params, 'heat', ['none', 'electric', 'hp'] as const) ?? 'none';
  const app = params.get('app') ?? '';
  return {
    ft2: numberParam(params, 'ft2') ?? '',
    sa: numberParam(params, 'sa') ?? '0',
    laundry: numberParam(params, 'lc') ?? '0',
    range: numberParam(params, 'range') ?? '',
    dryer: numberParam(params, 'dryer') ?? '',
    water: numberParam(params, 'wh') ?? '',
    others: app
      .split(',')
      .filter((t) => t.trim() !== '')
      .join(', '),
    ev: numberParam(params, 'ev') ?? '',
    heating: heatParam === 'hp' ? 'heat-pump' : heatParam,
    heat: numberParam(params, 'hw') ?? '',
    units: numberParam(params, 'units') ?? '1',
    hp: numberParam(params, 'hp') ?? '',
    ac: numberParam(params, 'ac') ?? '',
  };
}

const queryOf = (i: Inputs) => {
  const ratings = parseNumberList(i.others);
  return buildQuery({
    ft2: i.ft2.trim(),
    sa: i.sa.trim(),
    lc: i.laundry.trim(),
    range: i.range.trim(),
    dryer: i.dryer.trim(),
    wh: i.water.trim(),
    app: ratings.every(Number.isFinite) ? ratings.join(',') : i.others.trim(),
    ev: i.ev.trim(),
    heat: HEATING_PARAM[i.heating],
    hw: i.heating === 'none' ? '' : i.heat.trim(),
    units: i.heating === 'electric' ? i.units.trim() : '',
    hp: i.heating === 'heat-pump' ? i.hp.trim() : '',
    ac: i.heating === 'heat-pump' ? '' : i.ac.trim(),
  });
};

export function ResidentialLoadTool() {
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
  const text = (k: Key, label: string, hint: React.ReactNode, wide = false) => (
    <Field id={k} label={label} hint={hint} error={shown(k)}>
      <TextInput
        id={k}
        value={inputs[k]}
        onChange={(v) => update({ [k]: v } as Partial<Inputs>)}
        onBlur={() => fieldErrors.touch(k)}
        error={shown(k)}
        describedById={describedBy(k, shown(k), true)}
        inputMode={wide ? 'text' : 'decimal'}
        className={wide ? 'max-w-[18rem]' : 'max-w-[12rem]'}
      />
    </Field>
  );
  const each = (
    <span data-src={L}>
      <Val v={STANDARD_METHOD.smallApplianceCircuitVa} unit="VA" src={L} /> each (220.52).
    </span>
  );
  const nameplate = 'Nameplate. Empty for gas or none.';

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Residential load calculator">
        <div className="grid gap-x-10 gap-y-7 lg:grid-cols-2">
          {text('ft2', 'Floor area, ft²', 'Outside dimensions, no open porch.')}
          {text('sa', 'Small-appliance circuits', each)}
          {text('laundry', 'Laundry circuits', each)}
          {text('range', 'Electric range, kW', nameplate)}
          {text('dryer', 'Electric dryer, W', nameplate)}
          {text('water', 'Electric water heater, W', nameplate)}
          {text(
            'others',
            'Other fastened appliances, W',
            <span data-src={L}>
              Each <Val v={APPLIANCE_MIN_W} unit="W" src={L} /> or more; commas between.
            </span>,
            true,
          )}
          {text('ev', 'EV charger, W', 'Nameplate. Empty if none.')}
          <Segmented
            name="heating"
            legend="Heating"
            value={inputs.heating}
            options={[
              { value: 'none', label: 'None or gas' },
              { value: 'electric', label: 'Electric heat' },
              { value: 'heat-pump', label: 'Heat pump' },
            ]}
            onChange={(heating) => update({ heating })}
          />
          {inputs.heating !== 'heat-pump' ? text('ac', 'Air conditioning, VA', 'Nameplate rating. Empty if none.') : <div className="hidden lg:block" aria-hidden="true" />}
          {inputs.heating === 'electric' && (
            <>
              {text('heat', 'Electric heat, W', 'Baseboard, furnace or wall heaters.')}
              {text('units', 'Separately controlled units', 'Each with its own control.')}
            </>
          )}
          {inputs.heating === 'heat-pump' && (
            <>
              {text('hp', 'Heat pump, VA', 'Nameplate rating.')}
              {text('heat', 'Backup electric heat, W', 'Heat strips. Empty if none.')}
            </>
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

/** One method's answer: its service, its load and current, and the Table 310.12 conductors. */
function MethodCard({ title, run }: { title: React.ReactNode; run: DwellingMethodRun }) {
  const row = run.serviceRow;
  return (
    <div className="border-t border-cut-rule pt-4">
      <h3 className="font-display text-[17px] font-semibold text-ink">{title}</h3>
      {row ? (
        <p className="mt-2 font-mono text-[34px] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[46px]" data-src={SVC}>
          <Val v={row.ratingA} unit="A" src={SVC} />
        </p>
      ) : (
        <p className="mt-2 text-[17px] font-semibold text-ink">Past Table 310.12</p>
      )}
      <p className="mt-2 text-[17px] text-ink" data-src={CALC}>
        {row ? 'service, for ' : ''}
        <Val v={run.totalVa} unit="VA" src={CALC} format={{ upTo: 1 }} /> or <Val v={run.amps} unit="A" src={CALC} format={{ upTo: 2 }} /> at{' '}
        <Val v={DWELLING_VOLTS} unit="V" src={SVC} />
      </p>
      {row && (
        <p className="mt-1 text-[15px] leading-[1.6] text-[#333333]" data-src={SVC}>
          <Size s={row.cu} /> copper or <Size s={row.alCca} /> aluminum or copper-clad aluminum (Table 310.12)
        </p>
      )}
    </div>
  );
}

function Steps({ id, title, run }: { id: string; title: string; run: DwellingMethodRun }) {
  return (
    <div className="mt-8">
      <h3 id={id} className="font-display text-[17px] font-semibold text-ink">
        {title}
      </h3>
      <ol aria-labelledby={id} className="mt-3 max-w-[40rem] list-decimal space-y-2 pl-6 text-[17px] leading-[1.65] text-ink" data-src={CALC}>
        {run.stepParts.map((parts, k) => (
          <li key={k}>
            <ValText parts={parts} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function Result({
  inputs,
  r,
  headingRef,
  shareUrl,
}: {
  inputs: Inputs;
  r: DwellingRun;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  shareUrl: () => string;
}) {
  const smaller = r.optional.amps <= r.standard.amps ? r.optional : r.standard;
  const row = smaller.serviceRow;
  const serviceHref = row
    ? `/calculators/service-entrance-calculator?${buildQuery({ a: row.ratingA, i: Math.round(smaller.amps * 100) / 100 })}`
    : null;
  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none">
        Calculated load of {indefiniteArticle(fieldNumber(inputs.ft2))} <Val v={fieldNumber(inputs.ft2)} unit="ft²" src="input" /> dwelling, 120/240 V
      </h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <MethodCard title="Standard method" run={r.standard} />
        <MethodCard title="Optional method, 220.82" run={r.optional} />
      </div>
      <p className={`mt-6 ${NOTE}`} data-src={L}>
        Either is a calculated load the NEC accepts for one dwelling unit: the standard method of Article 220, Part III, or the optional method of
        220.82 for a unit served by a single 120/240 V or 208Y/120 V 3-wire set of service or feeder conductors with an ampacity of{' '}
        <Val v={OPTIONAL_METHOD.minAmpacityA} unit="A" src={L} /> or more.
      </p>
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-10">
        <Steps id="standard-steps" title="Standard method, step by step" run={r.standard} />
        <Steps id="optional-steps" title="Optional method, step by step" run={r.optional} />
      </div>
      <p className="mt-8 max-w-[38rem] border-t border-cut-rule pt-4 text-[15px] leading-[1.6] text-[#333333]" data-src={L}>
        NEC 2023 values; <span data-src="nec-2026-edition">the 2026 edition moved these rules to Article 120</span>. Motors other than the air
        conditioning or heat pump count at their rating: the motor rules 220.50 points to are not applied.{' '}
        {serviceHref && (
          <>
            <Link href={serviceHref} className={LINK}>
              Open the <Val v={(row as NonNullable<typeof row>).ratingA} unit="A" src={SVC} /> service in the service entrance calculator
            </Link>{' '}
            for its ground wire and voltage drop.{' '}
          </>
        )}
        <Link href="/methodology#load-method" className={LINK}>
          How the calculator counts each load
        </Link>
        .
      </p>
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}
