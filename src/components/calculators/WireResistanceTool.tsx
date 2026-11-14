'use client';

// The wire resistance calculator in the look (WSZ-006; spec: research/page-specs.md "WSZ-006"). Every number comes
// from the resistance engine (src/lib/calculations/resistance.ts): NIST Handbook 100 copper resistances at 20 °C, EC-H19
// aluminum from Handbook 109's resistivity, R(T) = R20 × (1 + α(T − 20 °C)). Results appear only after Calculate and
// explain each number; a share link restores the inputs and the result.
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Val } from '@/components/content/Val';
import { Num } from '@/components/content/Num';
import { RunBars } from '@/components/look/RunBars';
import {
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  Field,
  FIELD_HINT,
  FIELD_LABEL,
  SelectInput,
  Segmented,
  TextInput,
  describedBy,
} from '@/components/look/Form';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '@/lib/calculations/fields';
import { areaRatio } from '@/lib/calculations/awg-geometry';
import { formatSize, isKcmil } from '@/lib/verified/awg';
import type { Material, SizeKey } from '@/lib/verified/awg';
import {
  ALUMINUM_ALPHA,
  COPPER_ALPHA,
  ENGINE_ID,
  TOOL_LENGTH_MAX_FT,
  TOOL_LENGTH_MIN_FT,
  TOOL_TEMP_MAX_C,
  TOOL_TEMP_MIN_C,
  areaMm2,
  fahrenheitToCelsius,
  nearestSizeForMm2,
  resistanceAt,
  resistanceRun,
  resistanceSig,
  toolSizes,
} from '@/lib/calculations/resistance';
import type { RunResult } from '@/lib/calculations/resistance';

const CALC = `calc:${ENGINE_ID}`;
const RES = 'conductor-resistance-20c';
const AMP = 'nec-310-16';
const M_PER_FT = 0.3048;

type SizeMode = 'list' | 'mm2';
type LengthUnit = 'ft' | 'm';
type TempUnit = 'C' | 'F';

interface Inputs {
  sizeMode: SizeMode;
  size: SizeKey;
  /** Field text */
  mm2: string;
  material: Material;
  /** Field text */
  length: string;
  lengthUnit: LengthUnit;
  /** Field text */
  temp: string;
  tempUnit: TempUnit;
}

const DEFAULTS: Inputs = {
  sizeMode: 'list',
  size: '12',
  mm2: '2.5',
  material: 'Cu',
  length: '100',
  lengthUnit: 'ft',
  temp: '20',
  tempUnit: 'C',
};

const LENGTH_RANGE = {
  ft: { min: TOOL_LENGTH_MIN_FT, max: TOOL_LENGTH_MAX_FT },
  m: { min: 0.3, max: 1524 },
};
const TEMP_RANGE_F = { min: (TOOL_TEMP_MIN_C * 9) / 5 + 32, max: (TOOL_TEMP_MAX_C * 9) / 5 + 32 };

type FieldName = 'length' | 'temp' | 'mm2';

function lengthFt(inputs: Inputs): number {
  const v = fieldNumber(inputs.length);
  return inputs.lengthUnit === 'ft' ? v : v / M_PER_FT;
}

function tempC(inputs: Inputs): number {
  const v = fieldNumber(inputs.temp);
  return inputs.tempUnit === 'C' ? v : fahrenheitToCelsius(v);
}

function errorsOf(inputs: Inputs): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  const length = fieldNumber(inputs.length);
  const lr = LENGTH_RANGE[inputs.lengthUnit];
  if (!(length >= lr.min && length <= lr.max)) {
    errors.length = inputs.lengthUnit === 'ft' ? 'Enter a length from 1 ft to 5,000 ft.' : 'Enter a length from 0.3 m to 1,524 m.';
  }
  const temp = fieldNumber(inputs.temp);
  const tr = inputs.tempUnit === 'C' ? { min: TOOL_TEMP_MIN_C, max: TOOL_TEMP_MAX_C } : TEMP_RANGE_F;
  if (!(temp >= tr.min && temp <= tr.max)) {
    errors.temp = inputs.tempUnit === 'C' ? 'Enter a temperature from −40 °C to 90 °C.' : 'Enter a temperature from −40 °F to 194 °F.';
  }
  if (inputs.sizeMode === 'mm2' && !(fieldNumber(inputs.mm2) > 0)) errors.mm2 = 'Enter an area in mm² greater than 0.';
  return errors;
}

/** The size the result is for: the chosen size, or the size nearest the area entered in mm². */
function sizeOf(inputs: Inputs): SizeKey {
  if (inputs.sizeMode === 'mm2') return nearestSizeForMm2(fieldNumber(inputs.mm2), inputs.material) ?? inputs.size;
  return inputs.size;
}

interface Computed {
  inputs: Inputs;
  run: RunResult;
}

function compute(inputs: Inputs): Computed | null {
  if (Object.keys(errorsOf(inputs)).length > 0) return null;
  const run = resistanceRun(sizeOf(inputs), inputs.material, lengthFt(inputs), tempC(inputs));
  return run ? { inputs, run } : null;
}

function inputsFromQuery(params: URLSearchParams): Inputs {
  const material = choiceParam(params, 'material', ['Cu', 'Al'] as Material[]) ?? DEFAULTS.material;
  return {
    sizeMode: choiceParam(params, 'sizeIn', ['list', 'mm2'] as SizeMode[]) ?? DEFAULTS.sizeMode,
    size: choiceParam(params, 'size', toolSizes(material)) ?? (material === 'Al' ? '12' : DEFAULTS.size),
    mm2: numberParam(params, 'mm2') ?? DEFAULTS.mm2,
    material,
    length: numberParam(params, 'length') ?? DEFAULTS.length,
    lengthUnit: choiceParam(params, 'lengthUnit', ['ft', 'm'] as LengthUnit[]) ?? DEFAULTS.lengthUnit,
    temp: numberParam(params, 'temp') ?? DEFAULTS.temp,
    tempUnit: choiceParam(params, 'tempUnit', ['C', 'F'] as TempUnit[]) ?? DEFAULTS.tempUnit,
  };
}

/** The length as entered, with its unit. */
function LengthText({ inputs }: { inputs: Inputs }) {
  return <Val v={fieldNumber(inputs.length)} unit={inputs.lengthUnit} src="input" />;
}

/** The temperature as entered, and in the other unit when the reader entered °F. */
function TempText({ inputs }: { inputs: Inputs }) {
  const v = fieldNumber(inputs.temp);
  if (inputs.tempUnit === 'C') return <Val v={v} unit="°C" src="input" />;
  return (
    <>
      <Val v={v} unit="°F" src="input" /> (<Val v={fahrenheitToCelsius(v)} unit="°C" src={CALC} format={{ upTo: 1 }} />)
    </>
  );
}

export function WireResistanceTool() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [result, setResult] = useState<Computed | null>(null);
  const [sizeNote, setSizeNote] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fieldErrors = useFieldErrors();
  const errors = errorsOf(inputs);
  const query = useMemo(
    () =>
      result
        ? buildQuery({
            size: result.inputs.sizeMode === 'list' ? result.inputs.size : null,
            sizeIn: result.inputs.sizeMode === 'mm2' ? 'mm2' : null,
            mm2: result.inputs.sizeMode === 'mm2' ? result.inputs.mm2 : null,
            material: result.inputs.material,
            length: result.inputs.length,
            lengthUnit: result.inputs.lengthUnit,
            temp: result.inputs.temp,
            tempUnit: result.inputs.tempUnit,
          })
        : '',
    [result],
  );
  const { markChanged, shareUrl } = useUrlState(query, (params) => {
    const next = inputsFromQuery(params);
    setInputs(next);
    setResult(compute(next));
  });
  const [copied, setCopied] = useState(false);

  const update = (patch: Partial<Inputs>) => {
    markChanged();
    setCopied(false);
    setInputs((prev) => ({ ...prev, ...patch }));
  };

  const setMaterial = (material: Material) => {
    const sizes = toolSizes(material);
    if (!sizes.includes(inputs.size)) {
      setSizeNote('Aluminum EC-H19 is listed from 12 AWG up, so the size moved to 12 AWG.');
      update({ material, size: '12' });
    } else {
      setSizeNote(null);
      update({ material });
    }
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
    setSizeNote(null);
    setInputs(DEFAULTS);
    setResult(null);
  };

  const shown = (name: FieldName) => fieldErrors.shown(name, errors[name]);
  const sizes = toolSizes(inputs.material);
  const awgSizes = sizes.filter((s) => !isKcmil(s));
  const kcmilSizes = sizes.filter((s) => isKcmil(s));
  const mm2Size = inputs.sizeMode === 'mm2' && fieldNumber(inputs.mm2) > 0 ? nearestSizeForMm2(fieldNumber(inputs.mm2), inputs.material) : null;

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Wire resistance calculator">
        <div className="grid gap-x-10 gap-y-7 lg:grid-cols-2">
          <div className="space-y-7">
            <Segmented
              name="material"
              legend="Conductor"
              value={inputs.material}
              options={[
                { value: 'Cu', label: 'Copper' },
                { value: 'Al', label: 'Aluminum EC-H19' },
              ]}
              onChange={setMaterial}
            />

            <div>
              <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
                <label htmlFor={inputs.sizeMode === 'list' ? 'size' : 'mm2'} className={FIELD_LABEL}>
                  {inputs.sizeMode === 'list' ? 'Wire size' : 'Wire size in mm²'}
                </label>
                <Segmented
                  name="size-mode"
                  legend="Enter the size as"
                  srLegend
                  value={inputs.sizeMode}
                  options={[
                    { value: 'list', label: 'AWG or kcmil' },
                    { value: 'mm2', label: 'mm²' },
                  ]}
                  onChange={(sizeMode) => {
                    setSizeNote(null);
                    update({ sizeMode });
                  }}
                />
              </div>
              <div className="mt-2">
                {inputs.sizeMode === 'list' ? (
                  <SelectInput
                    id="size"
                    value={inputs.size}
                    onChange={(size) => {
                      setSizeNote(null);
                      update({ size });
                    }}
                    describedById="size-hint"
                  >
                    <optgroup label="AWG">
                      {awgSizes.map((s) => (
                        <option key={s} value={s} data-size={s}>
                          {formatSize(s)}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="kcmil">
                      {kcmilSizes.map((s) => (
                        <option key={s} value={s} data-size={s}>
                          {formatSize(s)}
                        </option>
                      ))}
                    </optgroup>
                  </SelectInput>
                ) : (
                  <TextInput
                    id="mm2"
                    value={inputs.mm2}
                    onChange={(mm2) => {
                      setSizeNote(null);
                      update({ mm2 });
                    }}
                    onBlur={() => fieldErrors.touch('mm2')}
                    error={shown('mm2')}
                    describedById={describedBy('mm2', shown('mm2'), true)}
                  />
                )}
              </div>
              {inputs.sizeMode === 'mm2' && shown('mm2') ? (
                <p id="mm2-error" className="mt-1.5 text-[14px] font-semibold leading-snug text-ink">
                  {shown('mm2')}
                </p>
              ) : (
                <p id={inputs.sizeMode === 'mm2' ? 'mm2-hint' : 'size-hint'} className={FIELD_HINT}>
                  {sizeNote ??
                    (inputs.sizeMode === 'mm2' && mm2Size ? (
                      <>
                        Nearest listed size: <span data-size={mm2Size}>{formatSize(mm2Size)}</span> (
                        <Val v={areaMm2(mm2Size)} unit="mm²" src={CALC} format={{ sig: 3 }} />
                        ). The result is for that size.
                      </>
                    ) : inputs.material === 'Al' ? (
                      <>
                        Aluminum EC-H19 from <span data-size="12">12 AWG</span> to <span data-size="2000">2000 kcmil</span>.
                      </>
                    ) : (
                      <>
                        Copper from <span data-size="40">40 AWG</span> to <span data-size="4/0">4/0</span>, then{' '}
                        <span data-size="250">250 kcmil</span> to <span data-size="2000">2000 kcmil</span>.
                      </>
                    ))}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-7">
            <Field
              id="length"
              label="Length of the run"
              hint="One way, as the wire runs. The result also gives a two-wire circuit, out and back."
              error={shown('length')}
            >
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

            <Field
              id="temp"
              label="Conductor temperature"
              hint={
                <>
                  NIST&apos;s tables are for <Val v={20} unit="°C" src={RES} />. A conductor carrying current runs warmer; Table 310.16&apos;s
                  columns are for conductors rated <Val v={60} unit="°C" src={AMP} />, <Val v={75} unit="°C" src={AMP} /> and{' '}
                  <Val v={90} unit="°C" src={AMP} />.
                </>
              }
              error={shown('temp')}
            >
              <div className="flex flex-wrap gap-2">
                <TextInput
                  id="temp"
                  value={inputs.temp}
                  onChange={(temp) => update({ temp })}
                  onBlur={() => fieldErrors.touch('temp')}
                  error={shown('temp')}
                  describedById={describedBy('temp', shown('temp'), true)}
                  className="max-w-[5.5rem] sm:max-w-[8rem]"
                />
                <Segmented
                  name="temp-unit"
                  legend="Temperature unit"
                  srLegend
                  value={inputs.tempUnit}
                  options={[
                    { value: 'C', label: '°C' },
                    { value: 'F', label: '°F' },
                  ]}
                  onChange={(tempUnit) => update({ tempUnit })}
                />
                {([20, 75] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => update({ temp: String(c), tempUnit: 'C' })}
                    className="inline-flex h-11 items-center justify-center rounded-[6px] border border-ink bg-white px-2.5 font-mono text-[14px] text-ink hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ink sm:px-3 sm:text-[15px]"
                    aria-label={`Set ${c} °C`}
                  >
                    <Val v={c} unit="°C" src={c === 20 ? RES : AMP} />
                  </button>
                ))}
              </div>
            </Field>
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

      {result && (
        <Result
          result={result}
          headingRef={headingRef}
          onCopy={async () => {
            await navigator.clipboard.writeText(shareUrl());
            setCopied(true);
          }}
          copied={copied}
        />
      )}
    </div>
  );
}

function Result({
  result,
  headingRef,
  onCopy,
  copied,
}: {
  result: Computed;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onCopy: () => void;
  copied: boolean;
}) {
  const { inputs, run } = result;
  const metal = inputs.material === 'Cu' ? 'copper' : 'aluminum EC-H19';
  const other: Material = inputs.material === 'Cu' ? 'Al' : 'Cu';
  const otherPerKft = resistanceAt(run.size, other, run.tempC);
  const otherRun = otherPerKft === null ? null : (otherPerKft * run.lengthFt) / 1000;
  const t = run.tempC;
  const atStandard = Math.abs(t - 20) < 1e-9 || Math.abs(t - 75) < 1e-9;
  const rise75 = (run.at75.perKft / run.at20.perKft - 1) * 100;
  const alpha = inputs.material === 'Cu' ? COPPER_ALPHA : ALUMINUM_ALPHA;
  const lengthOfWire = 2 * fieldNumber(inputs.length);
  const awgStep = areaRatio(1);
  const kmText = inputs.lengthUnit === 'm';
  // as many significant figures as NIST prints for the size (resistanceSig): 12 AWG's 1.59 stays three figures
  const SIG = { sig: run.sig };
  const KM = { sig: run.kmSig };

  const columns: { key: string; head: React.ReactNode; v: typeof run.at20 }[] = [
    ...(atStandard ? [] : [{ key: 't', head: <TempText inputs={inputs} />, v: run }]),
    { key: '20', head: <Val v={20} unit="°C" src={RES} />, v: run.at20 },
    { key: '75', head: <Val v={75} unit="°C" src={CALC} />, v: run.at75 },
  ];
  const rows: { key: keyof typeof run.at20; label: React.ReactNode }[] = [
    { key: 'conductor', label: <>One conductor, <LengthText inputs={inputs} /></> },
    {
      key: 'loop',
      label: (
        <>
          Two-wire circuit, <LengthText inputs={inputs} /> out and back
        </>
      ),
    },
    { key: 'perKft', label: 'Per 1,000 ft' },
    { key: 'perKm', label: 'Per km' },
  ];

  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2
        id="result-heading"
        ref={headingRef}
        tabIndex={-1}
        className="font-display text-[15px] font-semibold text-ink focus:outline-none"
      >
        <LengthText inputs={inputs} /> of <span data-size={run.size}>{formatSize(run.size)}</span> {metal} at <TempText inputs={inputs} />
      </h2>
      {inputs.sizeMode === 'mm2' && (
        <p className="mt-1 text-[15px] text-[#555555]">
          You entered <Val v={fieldNumber(inputs.mm2)} unit="mm²" src="input" />; the nearest listed size is{' '}
          <span data-size={run.size}>{formatSize(run.size)}</span> (<Val v={areaMm2(run.size)} unit="mm²" src={CALC} format={{ sig: 3 }} />).
        </p>
      )}
      <p className="mt-3 font-mono text-[34px] font-medium leading-none tracking-[-0.02em] text-ink tabular-nums sm:text-[46px]">
        <Val v={run.conductor} unit="Ω" src={CALC} format={SIG} />
      </p>
      <p className="mt-3 max-w-[38rem] text-[17px] leading-[1.6] text-ink">
        That is one conductor. A two-wire circuit of the same length carries current out and back through{' '}
        <Val v={lengthOfWire} unit={inputs.lengthUnit} src={CALC} /> of wire:{' '}
        <strong>
          <Val v={run.loop} unit="Ω" src={CALC} format={SIG} />
        </strong>
        .
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[22rem] max-w-[44rem] border-collapse text-[15px]" data-src={CALC}>
          <caption className="sr-only">The run&apos;s resistance at each temperature</caption>
          <thead>
            <tr className="border-b-2 border-ink">
              <th scope="col" className="py-2 pr-4 text-left font-display font-semibold">
                <span className="sr-only">Quantity</span>
              </th>
              {columns.map((c) => (
                <th key={c.key} scope="col" className="py-2 pl-4 text-right font-display font-semibold">
                  {c.key === 't' ? <>At <TempText inputs={inputs} /></> : <>At {c.head}</>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="border-b border-cut-rule">
                <th scope="row" className="py-2 pr-4 text-left font-normal">
                  {r.label}
                </th>
                {columns.map((c) => (
                  <td key={c.key} className="py-2 pl-4 text-right font-mono tabular-nums">
                    <Val v={c.v[r.key]} unit="Ω" src={CALC} format={r.key === 'perKm' ? KM : SIG} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 max-w-[38rem] space-y-4 text-[17px] leading-[1.65] text-ink">
        <p>
          <strong>
            <Val v={run.perKft} unit="Ω" src={CALC} format={SIG} /> per 1,000 ft
          </strong>{' '}
          is the rate for this size at <TempText inputs={inputs} />
          {kmText ? (
            <>
              , or <Val v={run.perKm} unit="Ω" src={CALC} format={KM} /> per km
            </>
          ) : null}
          . Resistance grows in step with length: the run is that rate times its length, so twice the length gives twice the ohms.
        </p>
        <p>
          <strong>
            Between <Val v={20} unit="°C" src={RES} /> and <Val v={75} unit="°C" src={CALC} />
          </strong>
          , {metal} gains <Val v={rise75} unit="%" src={CALC} format={{ fixed: 1 }} />: its resistance rises by <Num v={alpha} src={RES} /> of
          its <Val v={20} unit="°C" src={RES} /> value per degree. Use the <Val v={20} unit="°C" src={RES} /> value for wire at room
          temperature and the <Val v={75} unit="°C" src={CALC} /> value for a conductor that runs warm under load.
        </p>
        {otherRun !== null ? (
          <p>
            <strong>{inputs.material === 'Cu' ? 'In aluminum' : 'In copper'}</strong>, the same size over the same length reads{' '}
            <Val v={otherRun} unit="Ω" src={CALC} format={{ sig: resistanceSig(run.size, other) }} /> at this temperature
            {inputs.material === 'Cu' ? ': aluminum EC-H19 conducts less well than copper of the same area.' : '.'}
          </p>
        ) : (
          <p>
            <strong>Aluminum</strong> isn&apos;t listed at this size: NIST&apos;s EC-H19 values used here start at{' '}
            <span data-size="12">12 AWG</span>.
          </p>
        )}
        {!isKcmil(run.size) && (
          <p>
            <strong>Each AWG step</strong> changes the area by a factor of <Num v={awgStep} src={CALC} format={{ fixed: 3 }} />, so one size
            thicker cuts the resistance to <Val v={100 / awgStep} unit="%" src={CALC} format={{ fixed: 1 }} /> and one size thinner raises it
            by the same factor. The sizes around yours, over the same run:
          </p>
        )}
        {isKcmil(run.size) && <p>The sizes around yours, over the same run:</p>}
      </div>

      <div className="mt-4 max-w-[40rem]">
        <RunBars
          rows={run.neighbours}
          chosen={run.size}
          material={inputs.material}
          src={CALC}
          label={`One conductor, ${inputs.length} ${inputs.lengthUnit}, in nearby sizes`}
        />
      </div>

      <div className="mt-8 max-w-[38rem] border-t border-cut-rule pt-4 text-[15px] leading-[1.6] text-[#333333]">
        <p>
          Assumed: a solid conductor; stranded wire of the same size measures slightly higher. R = R
          <sub>20</sub> × (1 + α(T − <Val v={20} unit="°C" src={RES} />)) with α ={' '}
          <Num v={inputs.material === 'Cu' ? COPPER_ALPHA : ALUMINUM_ALPHA} src={RES} /> for {metal}.{' '}
          {inputs.material === 'Cu'
            ? 'Copper values at 20 °C are NIST Handbook 100’s (kcmil sizes calculated from its resistivity).'
            : 'Aluminum values are calculated from NIST Handbook 109’s resistivity of EC-H19.'}{' '}
          <Link href="/methodology#resistance" className="text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]">
            How these values are calculated
          </Link>
          .
        </p>
        <p className="mt-3">
          Next: the{' '}
          <Link href="/calculators/voltage-drop-calculator" className="text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]">
            voltage drop calculator
          </Link>{' '}
          turns this resistance into volts lost at a given current, and the{' '}
          <Link href="/guides/awg-wire-size-chart" className="text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]">
            AWG chart
          </Link>{' '}
          lists every gauge on one page.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 print:hidden">
        <button type="button" onClick={onCopy} className={BUTTON_SECONDARY}>
          {copied ? 'Link copied' : 'Copy link to this result'}
        </button>
        <button type="button" onClick={() => window.print()} className={BUTTON_SECONDARY}>
          Print
        </button>
      </div>
    </section>
  );
}
