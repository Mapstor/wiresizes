'use client';

// The low voltage calculator in the look (WSZ-006c; spec: research/page-specs.md "WSZ-006"; D-35). Every number comes
// from the DC sizing engine (src/lib/calculations/dc-sizing.ts, lowVoltageSize): CM = 2 × K × I × L ÷ VD with
// K = 10.371 × (1 + 0.00393 × (T − 20 °C)) Ω·cmil/ft from NIST's constants; the size for the drop is the smallest NEC Table
// 310.16 size with that area, the size for the current the smallest whose 60 °C copper ampacity carries it, and the
// larger applies. Results appear only after Calculate and explain each number; a share link restores them.
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Num } from '@/components/content/Num';
import { Val } from '@/components/content/Val';
import { ResultActions } from '@/components/look/ResultActions';
import { RunBars } from '@/components/look/RunBars';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Field, FIELD_HINT, FIELD_LABEL, Segmented, TextInput, describedBy } from '@/components/look/Form';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '@/lib/calculations/fields';
import {
  ENGINE_ID,
  LV_SIG,
  LV_TOOL_AMPS_MAX,
  LV_TOOL_DROP_MAX_PCT,
  LV_TOOL_DROP_MIN_PCT,
  LV_TOOL_LENGTH_MAX_FT,
  LV_TOOL_LENGTH_MIN_FT,
  LV_TOOL_QUICK_VOLTS,
  LV_TOOL_TEMPS,
  LV_TOOL_VOLTS_MAX,
  NO_SIZE_MESSAGE,
  lowVoltageSize,
} from '@/lib/calculations/dc-sizing';
import type { LvResult } from '@/lib/calculations/dc-sizing';
import { formatSize } from '@/lib/verified/awg';
import { VOLTAGE_DROP_NOTE } from '@/lib/verified/nec-continuous-load-2023';

const CALC = `calc:${ENGINE_ID}`;
const RES = 'conductor-resistance-20c';
const AMP = 'nec-310-16';
const NOTE = 'nec-continuous-load';
const LINK = 'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]';
const M_PER_FT = 0.3048;
const SIG = { sig: LV_SIG };

type LoadUnit = 'A' | 'W';
type LengthUnit = 'ft' | 'm';

interface Inputs {
  /** Field text */
  volts: string;
  /** Field text */
  load: string;
  loadUnit: LoadUnit;
  /** Field text */
  length: string;
  lengthUnit: LengthUnit;
  /** Field text */
  target: string;
  tempC: string;
}

const DEFAULTS: Inputs = {
  volts: '12',
  load: '10',
  loadUnit: 'A',
  length: '20',
  lengthUnit: 'ft',
  target: String(VOLTAGE_DROP_NOTE.feederPct),
  tempC: '75',
};

const LENGTH_RANGE = {
  ft: { min: LV_TOOL_LENGTH_MIN_FT, max: LV_TOOL_LENGTH_MAX_FT },
  m: { min: 0.3, max: 1524 },
};

type FieldName = 'volts' | 'load' | 'length' | 'target';

function errorsOf(inputs: Inputs): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  const volts = fieldNumber(inputs.volts);
  if (!(volts >= 1 && volts <= LV_TOOL_VOLTS_MAX)) errors.volts = 'Enter a voltage from 1 V to 600 V.';
  const load = fieldNumber(inputs.load);
  if (inputs.loadUnit === 'A' && !(load > 0 && load <= LV_TOOL_AMPS_MAX)) errors.load = 'Enter a current above 0 A, up to 5,000 A.';
  if (inputs.loadUnit === 'W' && !(load > 0)) errors.load = 'Enter a power above 0 W.';
  const length = fieldNumber(inputs.length);
  const lr = LENGTH_RANGE[inputs.lengthUnit];
  if (!(length >= lr.min && length <= lr.max)) {
    errors.length = inputs.lengthUnit === 'ft' ? 'Enter a length from 1 ft to 5,000 ft.' : 'Enter a length from 0.3 m to 1,524 m.';
  }
  const target = fieldNumber(inputs.target);
  if (!(target >= LV_TOOL_DROP_MIN_PCT && target <= LV_TOOL_DROP_MAX_PCT)) errors.target = 'Enter a target from 0.1 % to 20 %.';
  return errors;
}

interface Computed {
  inputs: Inputs;
  r: LvResult;
}

function compute(inputs: Inputs): Computed | null {
  if (Object.keys(errorsOf(inputs)).length > 0) return null;
  const volts = fieldNumber(inputs.volts);
  const load = fieldNumber(inputs.load);
  const length = fieldNumber(inputs.length);
  const r = lowVoltageSize({
    volts,
    amps: inputs.loadUnit === 'A' ? load : load / volts,
    lengthFt: inputs.lengthUnit === 'ft' ? length : length / M_PER_FT,
    dropPct: fieldNumber(inputs.target),
    tempC: Number(inputs.tempC),
  });
  return r ? { inputs, r } : null;
}

function inputsFromQuery(params: URLSearchParams): Inputs {
  return {
    volts: numberParam(params, 'volts') ?? DEFAULTS.volts,
    load: numberParam(params, 'load') ?? DEFAULTS.load,
    loadUnit: choiceParam(params, 'loadUnit', ['A', 'W'] as LoadUnit[]) ?? DEFAULTS.loadUnit,
    length: numberParam(params, 'length') ?? DEFAULTS.length,
    lengthUnit: choiceParam(params, 'lengthUnit', ['ft', 'm'] as LengthUnit[]) ?? DEFAULTS.lengthUnit,
    target: numberParam(params, 'target') ?? DEFAULTS.target,
    tempC: choiceParam(params, 'temp', LV_TOOL_TEMPS.map(String)) ?? DEFAULTS.tempC,
  };
}

export function LowVoltageTool() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [result, setResult] = useState<Computed | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fieldErrors = useFieldErrors();
  const errors = errorsOf(inputs);
  const query = useMemo(() => {
    if (!result) return '';
    const i = result.inputs;
    return buildQuery({
      volts: i.volts,
      load: i.load,
      loadUnit: i.loadUnit,
      length: i.length,
      lengthUnit: i.lengthUnit,
      target: i.target,
      temp: i.tempC,
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

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Low voltage wire size calculator">
        <div className="grid gap-x-10 gap-y-7 lg:grid-cols-2">
          <div className="space-y-7">
            <Field id="volts" label="System voltage, DC" hint="The battery or supply voltage." error={shown('volts')}>
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
                {LV_TOOL_QUICK_VOLTS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => update({ volts: String(v) })}
                    className="inline-flex h-11 items-center justify-center rounded-[6px] border border-ink bg-white px-2.5 font-mono text-[14px] text-ink hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ink sm:px-3 sm:text-[15px]"
                    aria-label={`Set ${v} V`}
                  >
                    <Val v={v} unit="V" src={CALC} />
                  </button>
                ))}
              </div>
            </Field>

            <div>
              <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
                <label htmlFor="load" className={FIELD_LABEL}>
                  {inputs.loadUnit === 'A' ? 'Load current' : 'Load power'}
                </label>
                <Segmented
                  name="load-unit"
                  legend="Enter the load in"
                  srLegend
                  value={inputs.loadUnit}
                  options={[
                    { value: 'A', label: 'Amps' },
                    { value: 'W', label: 'Watts' },
                  ]}
                  onChange={(loadUnit) => update({ loadUnit })}
                />
              </div>
              <div className="mt-2">
                <TextInput
                  id="load"
                  value={inputs.load}
                  onChange={(load) => update({ load })}
                  onBlur={() => fieldErrors.touch('load')}
                  error={shown('load')}
                  describedById={describedBy('load', shown('load'), true)}
                  className="max-w-[11rem]"
                />
              </div>
              {shown('load') ? (
                <p id="load-error" className="mt-1.5 text-[14px] font-semibold leading-snug text-ink">
                  {shown('load')}
                </p>
              ) : (
                <p id="load-hint" className={FIELD_HINT}>
                  {inputs.loadUnit === 'A' ? 'All the loads on the run together.' : 'All the loads on the run together, in watts.'}
                </p>
              )}
            </div>

            <Field id="length" label="Length, one way" hint="From the battery or supply to the load, as the wire runs." error={shown('length')}>
              <div className="flex gap-2">
                <TextInput
                  id="length"
                  value={inputs.length}
                  onChange={(length) => update({ length })}
                  onBlur={() => fieldErrors.touch('length')}
                  error={shown('length')}
                  describedById={describedBy('length', shown('length'), true)}
                  className="max-w-[11rem]"
                />
                <Segmented
                  name="length-unit"
                  legend="Length unit"
                  srLegend
                  value={inputs.lengthUnit}
                  options={[
                    { value: 'ft', label: 'ft' },
                    { value: 'm', label: 'm' },
                  ]}
                  onChange={(lengthUnit) => update({ lengthUnit })}
                />
              </div>
            </Field>
          </div>

          <div className="space-y-7">
            <Field
              id="target"
              label="Your target, largest drop"
              hint={
                <span data-src={NOTE}>
                  In percent of the supply. <Val v={VOLTAGE_DROP_NOTE.feederPct} unit="%" src={NOTE} /> is the figure in the NEC&apos;s
                  informational note on feeders (2023, 215.2(A)), advice for efficiency rather than a limit.
                </span>
              }
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

            <div>
              <Segmented
                name="temp"
                legend="Conductor temperature"
                value={inputs.tempC}
                options={LV_TOOL_TEMPS.map((t) => ({
                  value: String(t),
                  label: <Val v={t} unit="°C" src={t === 20 ? RES : AMP} />,
                }))}
                onChange={(tempC) => update({ tempC })}
              />
              <p className={FIELD_HINT}>
                <Val v={20} unit="°C" src={RES} /> for a lightly loaded run at room temperature; <Val v={75} unit="°C" src={AMP} /> for a
                conductor near its rating, the safer choice.
              </p>
            </div>

            <p className="max-w-[30rem] text-[15px] leading-[1.55] text-[#555555]">
              Copper, sized for the drop and for the current: the current check uses the <Val v={60} unit="°C" src={AMP} /> column of NEC
              Table 310.16.
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

function SizeName({ size }: { size: string }) {
  return <span data-size={size}>{formatSize(size)}</span>;
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
  const { inputs, r } = result;
  const { volts, amps, lengthFt, dropPct, tempC } = r.input;
  const fromWatts = inputs.loadUnit === 'W';
  const ampsSrc = fromWatts ? CALC : 'input';
  const ampsFormat = fromWatts ? SIG : undefined;
  const lengthShown = <Val v={fieldNumber(inputs.length)} unit={inputs.lengthUnit} src="input" />;
  const rows: { key: string; label: React.ReactNode; value: React.ReactNode }[] = [
    { key: 'i', label: fromWatts ? 'Current, watts ÷ volts' : 'Current', value: <Val v={amps} unit="A" src={ampsSrc} format={ampsFormat} /> },
    { key: 'vd', label: 'Allowed drop', value: <Val v={r.vdVolts} unit="V" src={CALC} format={SIG} /> },
    {
      key: 'cm',
      label: 'Copper area the drop needs',
      value: (
        <>
          <Val v={r.requiredCmil} unit="cmil" src={CALC} format={SIG} />
          <br />
          <Val v={r.requiredMm2} unit="mm²" src={CALC} format={SIG} />
        </>
      ),
    },
    { key: 'vs', label: 'Smallest size for the drop', value: r.vdSize ? <SizeName size={r.vdSize} /> : 'none' },
    {
      key: 'cs',
      label: (
        <>
          Smallest size for the current, <Val v={60} unit="°C" src={AMP} />
        </>
      ),
      value: r.currentSize ? <SizeName size={r.currentSize} /> : 'none',
    },
    ...(r.result
      ? [
          { key: 'd', label: 'Drop with the result size', value: <Val v={r.result.vdVolts} unit="V" src={CALC} format={SIG} /> },
          { key: 'p', label: 'Drop, percent of the supply', value: <Val v={r.result.vdPct} unit="%" src={CALC} format={SIG} /> },
        ]
      : []),
  ];
  // the factors as shown; ≈ when their product rounds to a different figure (DESIGN.md "Calculator")
  const shownK = Number(r.k.toPrecision(4));
  const shownI = fromWatts ? Number(amps.toPrecision(LV_SIG)) : amps;
  const shownVd = Number(r.vdVolts.toPrecision(LV_SIG));
  const shownL = Number(lengthFt.toFixed(1));
  const product = (2 * shownK * shownI * shownL) / shownVd;
  const exact = Number(product.toPrecision(LV_SIG)) === Number(r.requiredCmil.toPrecision(LV_SIG));

  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none">
        Copper for <Val v={amps} unit="A" src={ampsSrc} format={ampsFormat} /> at <Val v={volts} unit="V" src="input" /> DC,{' '}
        {lengthShown} one way, a drop of at most <Val v={dropPct} unit="%" src="input" />, at <Val v={tempC} unit="°C" src="input" />
      </h2>
      {r.resultSize && r.result ? (
        <>
          <p className="mt-3 font-mono text-[34px] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[46px]">
            <SizeName size={r.resultSize} />
          </p>
          <p className="mt-3 max-w-[38rem] text-[17px] leading-[1.6] text-ink">
            {r.governs === 'both' ? (
              <>The drop and the current both need this size.</>
            ) : r.governs === 'voltage drop' ? (
              <>
                <strong>The voltage drop sets the size.</strong> The current alone would take{' '}
                {r.currentSize ? <SizeName size={r.currentSize} /> : 'a smaller size'}.
              </>
            ) : (
              <>
                <strong>The current sets the size.</strong> The drop alone would allow {r.vdSize ? <SizeName size={r.vdSize} /> : 'a smaller size'}.
              </>
            )}{' '}
            With <SizeName size={r.resultSize} />, the run drops <Val v={r.result.vdVolts} unit="V" src={CALC} format={SIG} />,{' '}
            <Val v={r.result.vdPct} unit="%" src={CALC} format={SIG} /> of the supply.
          </p>
        </>
      ) : (
        <p className="mt-3 max-w-[38rem] text-[17px] leading-[1.6] text-ink">
          <strong>{NO_SIZE_MESSAGE}</strong>{' '}
          {!r.vdSize ? (
            <>
              The drop needs <Val v={r.requiredCmil} unit="cmil" src={CALC} format={SIG} />, more than <span data-size="2000">2000 kcmil</span>. A
              higher system voltage, a shorter run or a larger target brings it down.
            </>
          ) : (
            <>
              No copper size in its <Val v={60} unit="°C" src={AMP} /> column carries <Val v={amps} unit="A" src={ampsSrc} format={ampsFormat} />.
              A higher system voltage lowers the current for the same power.
            </>
          )}
        </p>
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full max-w-[38rem] border-collapse text-[15px]" data-src={CALC}>
          <caption className="sr-only">The sizing&apos;s values</caption>
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
        <p>
          <strong>The area:</strong> CM = <Num v={2} src={CALC} /> × K × I × L ÷ VD = <Num v={2} src={CALC} /> ×{' '}
          <Num v={r.k} src={CALC} format={{ sig: 4 }} /> × <Val v={amps} unit="A" src={ampsSrc} format={ampsFormat} /> ×{' '}
          <Val v={lengthFt} unit="ft" src={CALC} format={{ upTo: 1 }} /> ÷ <Val v={r.vdVolts} unit="V" src={CALC} format={SIG} />{' '}
          {exact ? '=' : '≈'} <Val v={r.requiredCmil} unit="cmil" src={CALC} format={SIG} />. K is copper&apos;s resistivity at{' '}
          <Val v={tempC} unit="°C" src="input" />, in Ω·cmil/ft; the <Num v={2} src={CALC} /> counts the wire out and back.
        </p>
        {r.currentSize && (
          <p>
            <strong>The current:</strong> <SizeName size={r.currentSize} /> is the smallest copper size whose ampacity in the{' '}
            <Val v={60} unit="°C" src={AMP} /> column of NEC Table 310.16, <Val v={r.currentAmpacity as number} unit="A" src={AMP} />, carries{' '}
            <Val v={amps} unit="A" src={ampsSrc} format={ampsFormat} />. That column assumes <Val v={30} unit="°C" src={AMP} /> around the
            wire and no more than three current-carrying conductors together; the{' '}
            <Link href="/guides/nec-table-310-16" className={LINK}>
              Table 310.16 page
            </Link>{' '}
            gives the corrections for hotter places and bundles.
          </p>
        )}
        <p>{r.resultSize ? 'The same run in the sizes around the result; the line marks your target:' : 'The largest sizes; the line marks your target:'}</p>
      </div>
      <div className="mt-4 max-w-[40rem]">
        <RunBars
          rows={r.neighbours.map((n) => ({ size: n.size, value: n.vdPct, format: SIG }))}
          chosen={r.resultSize ?? ''}
          material="Cu"
          src={CALC}
          unit="%"
          label={`Voltage drop in percent in nearby sizes; your target is ${dropPct} %`}
          target={dropPct}
        />
      </div>

      <div className="mt-8 max-w-[38rem] border-t border-cut-rule pt-4 text-[15px] leading-[1.6] text-[#333333]">
        <p>
          Assumed: solid copper at <Val v={tempC} unit="°C" src="input" />, with NIST&apos;s resistivity; stranded wire of the same size
          measures slightly higher, so leave some margin under your target. Boats, vehicles and RVs follow wiring standards of their own,
          which this calculator doesn&apos;t apply.{' '}
          <Link href="/methodology#resistance" className={LINK}>
            How these values are calculated
          </Link>
          .
        </p>
        <p className="mt-3">
          Next: the{' '}
          <Link href="/calculators/voltage-drop-calculator" className={LINK}>
            voltage drop calculator
          </Link>{' '}
          checks a size you already have, and the{' '}
          <Link href="/calculators/wire-resistance-calculator" className={LINK}>
            wire resistance calculator
          </Link>{' '}
          gives the ohms of the run.
        </p>
      </div>
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}
