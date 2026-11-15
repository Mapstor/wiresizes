'use client';

// The service entrance calculator in the look (WSZ-008b; spec: research/page-specs-held.md "WSZ-008"; D-35): a
// 120/240 V dwelling service rating and the conductor material give the service conductors (NEC Table 310.12) and the
// grounding electrode conductor (Table 250.66); a one-way length and a load current add the voltage drop at 75 °C
// (the voltage drop engine). Engine: serviceEntrance in src/lib/calculations/service-lookup.ts. Results appear only after
// Calculate; a share link restores them.
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Num } from '@/components/content/Num';
import { Size } from '@/components/content/Size';
import { Val } from '@/components/content/Val';
import { ResultActions } from '@/components/look/ResultActions';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Field, Segmented, SelectInput, TextInput, describedBy } from '@/components/look/Form';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '@/lib/calculations/fields';
import { formatValue } from '@/lib/calculations/format';
import { ENGINE_ID, SERVICE_LOOKUP_DEFAULTS, SERVICE_RATINGS, SERVICE_VOLTS, isServiceError, serviceEntrance } from '@/lib/calculations/service-lookup';
import type { ServiceResult } from '@/lib/calculations/service-lookup';
import { LENGTH_MAX_FT, RESISTANCE_TEMP_C } from '@/lib/calculations/voltage-drop';
import { SERVICE_AMPACITY_PERCENT } from '@/lib/verified/nec-310-12';
import type { Material } from '@/lib/verified/awg';

const CALC = `calc:${ENGINE_ID}`;
const VD = 'calc:voltage-drop';
const SVC = 'nec-310-12';
const GND = 'nec-250-grounding';
const LINK = 'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]';
const MATERIAL_NAME: Record<Material, string> = { Cu: 'copper', Al: 'aluminum or copper-clad aluminum' };

interface Inputs {
  rating: string;
  material: Material;
  length: string;
  amps: string;
}
const DEFAULTS: Inputs = { rating: String(SERVICE_LOOKUP_DEFAULTS.ratingA), material: 'Cu', length: '', amps: '' };

function errorsOf(i: Inputs): { length?: string; amps?: string } {
  const e: { length?: string; amps?: string } = {};
  const rating = Number(i.rating);
  if (i.length.trim() !== '') {
    const ft = fieldNumber(i.length);
    if (!(ft > 0 && ft <= LENGTH_MAX_FT)) e.length = `Enter a length above 0 ft, up to ${formatValue(LENGTH_MAX_FT)} ft, or leave it empty.`;
  }
  if (i.amps.trim() !== '') {
    const a = fieldNumber(i.amps);
    if (!(a > 0 && a <= rating)) e.amps = `Enter a current above 0 A, up to the ${formatValue(rating)} A rating.`;
  }
  return e;
}

function compute(i: Inputs): { inputs: Inputs; r: ServiceResult } | null {
  if (Object.keys(errorsOf(i)).length > 0) return null;
  const rating = Number(i.rating);
  const run = i.length.trim() === '' ? null : { lengthFt: fieldNumber(i.length), amps: i.amps.trim() === '' ? rating : fieldNumber(i.amps) };
  const r = serviceEntrance(rating, i.material, run);
  return isServiceError(r) ? null : { inputs: i, r };
}

function inputsFromQuery(params: URLSearchParams): Inputs {
  return {
    rating: choiceParam(params, 'a', SERVICE_RATINGS.map(String)) ?? DEFAULTS.rating,
    material: choiceParam(params, 'm', ['cu', 'al'] as const) === 'al' ? 'Al' : 'Cu',
    length: numberParam(params, 'ft') ?? '',
    amps: numberParam(params, 'i') ?? '',
  };
}

const queryOf = (i: Inputs) => buildQuery({ a: i.rating, m: i.material.toLowerCase(), ft: i.length.trim(), i: i.amps.trim() });

export function ServiceEntranceTool() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [result, setResult] = useState<{ inputs: Inputs; r: ServiceResult } | null>(null);
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
  const shownLength = fieldErrors.shown('length', errors.length);
  const shownAmps = fieldErrors.shown('amps', errors.amps);

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Service entrance calculator">
        <div className="grid gap-x-10 gap-y-7 lg:grid-cols-2">
          <Field id="rating" label="Service rating, A" hint={<span data-src={SVC}>A 120/240 V single-phase dwelling service, or a feeder that carries the dwelling&apos;s entire load.</span>}>
            <SelectInput id="rating" value={inputs.rating} onChange={(rating) => update({ rating })} describedById="rating-hint">
              {SERVICE_RATINGS.map((a) => (
                <option key={a} value={String(a)} data-src={SVC}>
                  {formatValue(a)} A
                </option>
              ))}
            </SelectInput>
          </Field>
          <Segmented
            name="material"
            legend="Conductor material"
            value={inputs.material === 'Cu' ? 'cu' : 'al'}
            options={[
              { value: 'cu', label: 'Copper' },
              { value: 'al', label: 'Aluminum or CCA' },
            ]}
            onChange={(m) => update({ material: m === 'al' ? 'Al' : 'Cu' })}
          />
          <Field id="length" label="Length, one way, ft" hint="Optional: adds the voltage drop." error={shownLength}>
            <TextInput
              id="length"
              value={inputs.length}
              onChange={(length) => update({ length })}
              onBlur={() => fieldErrors.touch('length')}
              error={shownLength}
              describedById={describedBy('length', shownLength, true)}
              className="max-w-[12rem]"
            />
          </Field>
          <Field id="amps" label="Load current, A" hint="Optional: the rating when left empty." error={shownAmps}>
            <TextInput
              id="amps"
              value={inputs.amps}
              onChange={(amps) => update({ amps })}
              onBlur={() => fieldErrors.touch('amps')}
              error={shownAmps}
              describedById={describedBy('amps', shownAmps, true)}
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

      {result && queryOf(result.inputs) !== queryOf(inputs) && (
        <p role="status" className="mt-6 text-[15px] font-semibold text-ink">
          The inputs have changed since this result. Press Calculate to update it.
        </p>
      )}
      {result && <Outcome r={result.r} headingRef={headingRef} shareUrl={shareUrl} />}
    </div>
  );
}

const ROW = 'border-b border-cut-rule';
const TH = 'py-2 pr-4 text-left font-normal';
const TD = 'whitespace-nowrap py-2 pl-4 text-right font-mono tabular-nums';

function Outcome({ r, headingRef, shareUrl }: { r: ServiceResult; headingRef: React.RefObject<HTMLHeadingElement | null>; shareUrl: () => string }) {
  const { lookup, drop } = r;
  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none">
        <Val v={lookup.ratingA} unit="A" src="input" /> dwelling service, {MATERIAL_NAME[r.material]}
      </h2>
      <p className="mt-3 font-mono text-[34px] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[46px]" data-src={SVC}>
        <Size s={r.size} />
      </p>
      <p className="mt-2 text-[17px] text-ink">
        {MATERIAL_NAME[r.material]} service conductors, with a <Size s={r.gec.cu} /> copper electrode conductor
      </p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full max-w-[38rem] border-collapse text-[15px]" data-src={CALC}>
          <caption className="sr-only">Service conductors and grounding electrode conductor</caption>
          <tbody>
            <tr className={`${ROW} border-t-2 border-t-ink`}>
              <th scope="row" className={TH}>
                Service conductors, copper
              </th>
              <td className={TD} data-src={SVC}>
                <Size s={lookup.cu} />
              </td>
            </tr>
            <tr className={ROW}>
              <th scope="row" className={TH}>
                Service conductors, aluminum or CCA
              </th>
              <td className={TD} data-src={SVC}>
                <Size s={lookup.alCca} />
              </td>
            </tr>
            <tr className={ROW}>
              <th scope="row" className={TH}>
                Electrode conductor, copper
              </th>
              <td className={TD} data-src={GND}>
                <Size s={r.gec.cu} />
              </td>
            </tr>
            <tr className={ROW}>
              <th scope="row" className={TH}>
                Electrode conductor, aluminum or CCA
              </th>
              <td className={TD} data-src={GND}>
                <Size s={r.gec.alCca} />
              </td>
            </tr>
            {drop && (
              <tr className={ROW}>
                <th scope="row" className={TH}>
                  Voltage drop, <Val v={drop.lengthFt} unit="ft" src="input" /> at <Val v={drop.amps} unit="A" src="input" />
                </th>
                <td className={TD} data-src={VD}>
                  <Val v={drop.result.vdPct} unit="%" src={VD} format={{ fixed: 2 }} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-6 max-w-[38rem] space-y-4 text-[17px] leading-[1.65] text-ink">
        <p data-src={SVC}>
          <strong>Table 310.12:</strong> the conductors need an ampacity of at least <Num v={SERVICE_AMPACITY_PERCENT} src={SVC} /> % of the
          rating, here <Val v={r.minAmpacity} unit="A" src={CALC} />, and the table lists the size for each rating.
        </p>
        <p data-src={GND}>
          <strong>Table 250.66:</strong> the electrode conductor for <Size s={r.size} /> {MATERIAL_NAME[r.material]} is <Size s={r.gec.cu} />{' '}
          copper or <Size s={r.gec.alCca} /> aluminum.
        </p>
        {drop && (
          <p data-src={VD}>
            <strong>Voltage drop:</strong> <Val v={drop.amps} unit="A" src="input" /> over <Val v={drop.lengthFt} unit="ft" src="input" /> of{' '}
            <Size s={r.size} /> {MATERIAL_NAME[r.material]} at <Val v={RESISTANCE_TEMP_C} unit="°C" src={VD} /> drops{' '}
            <Val v={drop.result.vdVolts} unit="V" src={VD} format={{ fixed: 2 }} />, <Val v={drop.result.vdPct} unit="%" src={VD} format={{ fixed: 2 }} />{' '}
            of <Val v={SERVICE_VOLTS} unit="V" src={SVC} />.
          </p>
        )}
      </div>
      <div className="mt-8 max-w-[38rem] space-y-3 border-t border-cut-rule pt-4 text-[15px] leading-[1.6] text-[#333333]">
        <p data-src={SVC}>
          Table 310.12 covers a 120/240 V single-phase service, or a feeder, that carries the entire load of one dwelling unit, with no
          ampacity corrections. A feeder that carries part of the load, such as one to a subpanel, and any other service are sized from
          Table 310.16; the{' '}
          <Link href="/calculators/wire-size-calculator" className={LINK}>
            wire size calculator
          </Link>{' '}
          does that. Electrode conductor values are those of NFPA&apos;s 2020 grounding fact sheet.{' '}
          <Link href="/methodology#service-conductors" className={LINK}>
            How these values are found
          </Link>
          .
        </p>
      </div>
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}
