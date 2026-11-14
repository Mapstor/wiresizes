'use client';

// The voltage drop calculator in the look (WSZ-006b; spec: research/page-specs.md "WSZ-006"; D-35). Every number comes
// from the voltage drop engine's calculator path (src/lib/calculations/voltage-drop.ts: dropRun, sizeForTarget):
// VD = k × I × R × L ÷ 1000 with R(T) from NIST's tables (resistance.ts), k = 2 for DC and single-phase and √3 for
// three-phase, the sets in parallel dividing R. A load in watts becomes amperes through the power engine. Results appear
// only after Calculate and explain each number; a share link restores the inputs and the result.
import { useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Num } from '@/components/content/Num';
import { Val } from '@/components/content/Val';
import { ResultActions } from '@/components/look/ResultActions';
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
import { decimalsAtSig } from '@/lib/calculations/format';
import { POWER_FACTOR_INVALID_MESSAGE, THREE_PHASE_VOLTS, powerFactorValid, voltsAfterPhaseChange } from '@/lib/calculations/inputs';
import { ENGINE_ID as POWER_ENGINE, fromRealPower, isPowerError } from '@/lib/calculations/power';
import { fahrenheitToCelsius } from '@/lib/calculations/resistance';
import {
  ENGINE_ID,
  VD_TOOL_AMPS_MAX,
  VD_TOOL_LENGTH_MAX_FT,
  VD_TOOL_LENGTH_MIN_FT,
  VD_TOOL_SETS,
  VD_TOOL_SINGLE_QUICK_VOLTS,
  VD_TOOL_TARGET_MAX_PCT,
  VD_TOOL_TARGET_MIN_PCT,
  VD_TOOL_VOLTS_MAX,
  ampacityPerConductorExceeded,
  circuitFactor,
  dropNeighbours,
  dropRun,
  parallelEquivalent,
  sizeForTarget,
  voltageDropSizes,
  AMPACITY_NOTE_COLUMN,
  WIRE_SIZE_CALCULATOR_LINK,
} from '@/lib/calculations/voltage-drop';
import type { DropRun, TargetSearch, VdCircuit } from '@/lib/calculations/voltage-drop';
import { formatSize, isKcmil } from '@/lib/verified/awg';
import { VOLTAGE_DROP_NOTE } from '@/lib/verified/nec-continuous-load-2023';
import type { Material, SizeKey } from '@/lib/verified/awg';

const CALC = `calc:${ENGINE_ID}`;
const PCALC = `calc:${POWER_ENGINE}`;
const RES = 'conductor-resistance-20c';
const AMP = 'nec-310-16';
const VOLTS = 'us-nominal-voltages';
const NOTE = 'nec-continuous-load';
const LINK = 'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]';
const M_PER_FT = 0.3048;
/** The informational note's figures (2023 NEC 215.2(A), Informational Note No. 2), read from nec-continuous-load-2023.json. */
const NOTE_FEEDER_PCT = VOLTAGE_DROP_NOTE.feederPct;
const NOTE_TOTAL_PCT = VOLTAGE_DROP_NOTE.totalPct;

type Mode = 'check' | 'find';
type LoadUnit = 'A' | 'W';
type LengthUnit = 'ft' | 'm';
type TempUnit = 'C' | 'F';

interface Inputs {
  mode: Mode;
  circuit: VdCircuit;
  /** Field text */
  volts: string;
  /** Field text */
  load: string;
  loadUnit: LoadUnit;
  /** Field text */
  pf: string;
  material: Material;
  size: SizeKey;
  /** Field text */
  target: string;
  sets: number;
  /** Field text */
  length: string;
  lengthUnit: LengthUnit;
  /** Field text */
  temp: string;
  tempUnit: TempUnit;
}

const DEFAULTS: Inputs = {
  mode: 'check',
  circuit: 'single',
  volts: '120',
  load: '20',
  loadUnit: 'A',
  pf: '1',
  material: 'Cu',
  size: '12',
  target: String(VOLTAGE_DROP_NOTE.feederPct),
  sets: 1,
  length: '100',
  lengthUnit: 'ft',
  temp: '75',
  tempUnit: 'C',
};

const LENGTH_RANGE = {
  ft: { min: VD_TOOL_LENGTH_MIN_FT, max: VD_TOOL_LENGTH_MAX_FT },
  m: { min: 0.3, max: 1524 },
};
const TEMP_RANGE = { C: { min: -40, max: 90 }, F: { min: -40, max: 194 } };

type FieldName = 'volts' | 'load' | 'pf' | 'target' | 'length' | 'temp';

const usesPf = (inputs: Inputs) => inputs.loadUnit === 'W' && inputs.circuit !== 'dc';

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
  const volts = fieldNumber(inputs.volts);
  if (inputs.circuit === 'three' ? !THREE_PHASE_VOLTS.includes(volts) : !(volts >= 1 && volts <= VD_TOOL_VOLTS_MAX)) {
    errors.volts = 'Enter a voltage from 1 V to 1,000 V.';
  }
  const load = fieldNumber(inputs.load);
  if (inputs.loadUnit === 'A' && !(load > 0 && load <= VD_TOOL_AMPS_MAX)) errors.load = 'Enter a current above 0 A, up to 10,000 A.';
  if (inputs.loadUnit === 'W' && !(load > 0)) errors.load = 'Enter a power above 0 W.';
  if (usesPf(inputs) && !powerFactorValid(fieldNumber(inputs.pf))) errors.pf = POWER_FACTOR_INVALID_MESSAGE;
  const target = fieldNumber(inputs.target);
  if (inputs.mode === 'find' && !(target >= VD_TOOL_TARGET_MIN_PCT && target <= VD_TOOL_TARGET_MAX_PCT)) {
    errors.target = 'Enter a target from 0.1 % to 20 %.';
  }
  const length = fieldNumber(inputs.length);
  const lr = LENGTH_RANGE[inputs.lengthUnit];
  if (!(length >= lr.min && length <= lr.max)) {
    errors.length = inputs.lengthUnit === 'ft' ? 'Enter a length from 1 ft to 5,000 ft.' : 'Enter a length from 0.3 m to 1,524 m.';
  }
  const temp = fieldNumber(inputs.temp);
  const tr = TEMP_RANGE[inputs.tempUnit];
  if (!(temp >= tr.min && temp <= tr.max)) {
    errors.temp = inputs.tempUnit === 'C' ? 'Enter a temperature from −40 °C to 90 °C.' : 'Enter a temperature from −40 °F to 194 °F.';
  }
  return errors;
}

/** The current per phase: as entered, or from the power and power factor. */
function ampsOf(inputs: Inputs): number | null {
  const load = fieldNumber(inputs.load);
  if (inputs.loadUnit === 'A') return load;
  const r = fromRealPower({ watts: load, volts: fieldNumber(inputs.volts), circuit: inputs.circuit, pf: fieldNumber(inputs.pf) });
  return isPowerError(r) ? null : r.amps;
}

interface CheckComputed {
  mode: 'check';
  inputs: Inputs;
  run: DropRun;
  neighbours: DropRun[];
}

interface FindComputed {
  mode: 'find';
  inputs: Inputs;
  target: number;
  search: TargetSearch;
  /** The sizes around the size found (or the largest size when none meets the target). */
  neighbours: DropRun[];
}

type Computed = CheckComputed | FindComputed;

function compute(inputs: Inputs): Computed | null {
  if (Object.keys(errorsOf(inputs)).length > 0) return null;
  const amps = ampsOf(inputs);
  if (amps === null) return null;
  const base = {
    material: inputs.material,
    amps,
    lengthFt: lengthFt(inputs),
    volts: fieldNumber(inputs.volts),
    circuit: inputs.circuit,
    tempC: tempC(inputs),
    sets: inputs.sets,
  };
  if (inputs.mode === 'check') {
    const run = dropRun({ ...base, size: inputs.size });
    return run ? { mode: 'check', inputs, run, neighbours: dropNeighbours(run) } : null;
  }
  const target = fieldNumber(inputs.target);
  const search = sizeForTarget(base, target);
  const sizes = voltageDropSizes(inputs.material);
  const around = search.found ?? dropRun({ ...base, size: sizes[sizes.length - 1] });
  return around ? { mode: 'find', inputs, target, search, neighbours: dropNeighbours(around) } : null;
}

function inputsFromQuery(params: URLSearchParams): Inputs {
  const material = choiceParam(params, 'material', ['Cu', 'Al'] as Material[]) ?? DEFAULTS.material;
  const circuit = choiceParam(params, 'circuit', ['single', 'three', 'dc'] as VdCircuit[]) ?? DEFAULTS.circuit;
  return {
    mode: choiceParam(params, 'mode', ['check', 'find'] as Mode[]) ?? DEFAULTS.mode,
    circuit,
    volts: numberParam(params, 'volts') ?? DEFAULTS.volts,
    load: numberParam(params, 'load') ?? DEFAULTS.load,
    loadUnit: choiceParam(params, 'loadUnit', ['A', 'W'] as LoadUnit[]) ?? DEFAULTS.loadUnit,
    pf: numberParam(params, 'pf') ?? DEFAULTS.pf,
    material,
    size: choiceParam(params, 'size', voltageDropSizes(material)) ?? (material === 'Al' ? '12' : DEFAULTS.size),
    target: numberParam(params, 'target') ?? DEFAULTS.target,
    sets: choiceParam(params, 'sets', ['1', '2', '3', '4']) ? Number(params.get('sets')) : DEFAULTS.sets,
    length: numberParam(params, 'length') ?? DEFAULTS.length,
    lengthUnit: choiceParam(params, 'lengthUnit', ['ft', 'm'] as LengthUnit[]) ?? DEFAULTS.lengthUnit,
    temp: numberParam(params, 'temp') ?? DEFAULTS.temp,
    tempUnit: choiceParam(params, 'tempUnit', ['C', 'F'] as TempUnit[]) ?? DEFAULTS.tempUnit,
  };
}

const CIRCUIT_NAME: Record<VdCircuit, string> = { single: 'single-phase', three: 'three-phase', dc: 'DC' };

/** The length as entered, with its unit. */
function LengthText({ inputs }: { inputs: Inputs }) {
  return <Val v={fieldNumber(inputs.length)} unit={inputs.lengthUnit} src="input" />;
}

/** The temperature as entered, and in °C when the reader entered °F. */
function TempText({ inputs }: { inputs: Inputs }) {
  const v = fieldNumber(inputs.temp);
  if (inputs.tempUnit === 'C') return <Val v={v} unit="°C" src="input" />;
  return (
    <>
      <Val v={v} unit="°F" src="input" /> (<Val v={fahrenheitToCelsius(v)} unit="°C" src={CALC} format={{ upTo: 1 }} />)
    </>
  );
}

/** The current: as entered, or worked out from the watts (three significant figures). */
function AmpsText({ inputs, amps }: { inputs: Inputs; amps: number }) {
  if (inputs.loadUnit === 'A') return <Val v={amps} unit="A" src="input" />;
  return <Val v={amps} unit="A" src={PCALC} format={{ sig: 3 }} />;
}

export function VoltageDropTool() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [result, setResult] = useState<Computed | null>(null);
  const [sizeNote, setSizeNote] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fieldErrors = useFieldErrors();
  const errors = errorsOf(inputs);
  const query = useMemo(() => {
    if (!result) return '';
    const i = result.inputs;
    return buildQuery({
      mode: i.mode,
      circuit: i.circuit,
      volts: i.volts,
      load: i.load,
      loadUnit: i.loadUnit,
      pf: usesPf(i) ? i.pf : null,
      material: i.material,
      size: i.mode === 'check' ? i.size : null,
      target: i.mode === 'find' ? i.target : null,
      sets: i.sets,
      length: i.length,
      lengthUnit: i.lengthUnit,
      temp: i.temp,
      tempUnit: i.tempUnit,
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

  const setMaterial = (material: Material) => {
    if (!voltageDropSizes(material).includes(inputs.size)) {
      setSizeNote('Aluminum starts at 12 AWG in NEC Table 310.16, so the size moved to 12 AWG.');
      update({ material, size: '12' });
    } else {
      setSizeNote(null);
      update({ material });
    }
  };

  const setCircuit = (circuit: VdCircuit) => {
    const volts = fieldNumber(inputs.volts);
    update({ circuit, volts: circuit === 'three' ? String(voltsAfterPhaseChange(volts, 'three')) : inputs.volts });
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
  const sizes = voltageDropSizes(inputs.material);
  const awgSizes = sizes.filter((s) => !isKcmil(s));
  const kcmilSizes = sizes.filter((s) => isKcmil(s));

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Voltage drop calculator">
        <Segmented
          name="mode"
          legend="Calculate"
          value={inputs.mode}
          options={[
            { value: 'check', label: 'Drop for a size' },
            { value: 'find', label: 'Size for a target' },
          ]}
          onChange={(mode) => update({ mode })}
        />

        <div className="mt-7 grid gap-x-10 gap-y-7 lg:grid-cols-2">
          <div className="space-y-7">
            <Segmented
              name="circuit"
              legend="Circuit"
              value={inputs.circuit}
              options={[
                { value: 'single', label: 'Single-phase' },
                { value: 'three', label: 'Three-phase' },
                { value: 'dc', label: 'DC' },
              ]}
              onChange={setCircuit}
            />

            {inputs.circuit === 'three' ? (
              <div>
                <Segmented
                  name="three-volts"
                  legend="Voltage, line to line"
                  value={inputs.volts}
                  options={THREE_PHASE_VOLTS.map((v) => ({ value: String(v), label: <Val v={v} unit="V" src={VOLTS} /> }))}
                  onChange={(volts) => update({ volts })}
                />
                <p className={FIELD_HINT}>The nominal three-phase system voltages.</p>
              </div>
            ) : (
              <Field
                id="volts"
                label={inputs.circuit === 'dc' ? 'Supply voltage, DC' : 'Supply voltage'}
                hint={
                  inputs.circuit === 'dc' ? (
                    'The voltage at the source.'
                  ) : (
                    <span data-src={VOLTS}>
                      The voltage across the load: <Val v={240} unit="V" src={VOLTS} /> for a load across both legs of a 120/240 V service.
                    </span>
                  )
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
                  {inputs.circuit === 'single' &&
                    VD_TOOL_SINGLE_QUICK_VOLTS.map((v) => (
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
            )}

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
                  {inputs.loadUnit === 'A'
                    ? inputs.circuit === 'three'
                      ? 'The current in each line.'
                      : 'The current the load draws.'
                    : inputs.circuit === 'three'
                      ? 'Real power in watts, all three phases together.'
                      : 'Real power in watts.'}
                </p>
              )}
            </div>

            {usesPf(inputs) && (
              <Field
                id="pf"
                label="Power factor"
                hint="1 for a resistive load such as a heater; for a motor or other equipment, the value on its nameplate or data sheet."
                error={shown('pf')}
              >
                <TextInput
                  id="pf"
                  value={inputs.pf}
                  onChange={(pf) => update({ pf })}
                  onBlur={() => fieldErrors.touch('pf')}
                  error={shown('pf')}
                  describedById={describedBy('pf', shown('pf'), true)}
                  className="max-w-[7rem]"
                />
              </Field>
            )}
          </div>

          <div className="space-y-7">
            <Segmented
              name="material"
              legend="Conductor"
              value={inputs.material}
              options={[
                { value: 'Cu', label: 'Copper' },
                { value: 'Al', label: 'Aluminum' },
              ]}
              onChange={setMaterial}
            />

            {inputs.mode === 'check' ? (
              <Field
                id="size"
                label="Wire size"
                hint={
                  sizeNote ?? (
                    <>
                      {inputs.material === 'Cu' ? 'Copper' : 'Aluminum'} from <span data-size={sizes[0]}>{formatSize(sizes[0])}</span> to{' '}
                      <span data-size="2000">2000 kcmil</span>, the sizes NEC Table 310.16 lists.
                    </>
                  )
                }
              >
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
              </Field>
            ) : (
              <Field
                id="target"
                label="Your target, largest drop"
                hint={
                  <span data-src={NOTE}>
                    In percent of the supply. <Val v={NOTE_FEEDER_PCT} unit="%" src={NOTE} /> is the figure in the NEC&apos;s
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
            )}

            <div>
              <Segmented
                name="sets"
                legend="Sets in parallel"
                value={String(inputs.sets)}
                options={VD_TOOL_SETS.map((n) => ({ value: String(n), label: <Num v={n} src={CALC} /> }))}
                onChange={(sets) => update({ sets: Number(sets) })}
              />
              <p className={FIELD_HINT}>
                Conductors of this size run together for each leg of the circuit; <Num v={1} src={CALC} /> for an ordinary run.
              </p>
            </div>

            <Field id="length" label="Length, one way" hint="From the supply to the load, as the wire runs." error={shown('length')}>
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
                  <Val v={75} unit="°C" src={AMP} /> is a conductor near its rating in Table 310.16; <Val v={20} unit="°C" src={RES} />{' '}
                  is a lightly loaded one at room temperature.
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

      {result && JSON.stringify(result.inputs) !== JSON.stringify(inputs) && (
        <p role="status" className="mt-6 text-[15px] font-semibold text-ink">
          The inputs have changed since this result. Press Calculate to update it.
        </p>
      )}
      {result?.mode === 'check' && <CheckResult result={result} headingRef={headingRef} shareUrl={shareUrl} />}
      {result?.mode === 'find' && <FindResult result={result} headingRef={headingRef} shareUrl={shareUrl} />}
    </div>
  );
}

// ── Results ─────────────────────────────────────────────────────────────────────────────────────────────────────────

const BIG = 'mt-3 font-mono text-[34px] font-medium leading-none tracking-[-0.02em] text-ink tabular-nums sm:text-[46px]';
const PROSE = 'mt-6 max-w-[38rem] space-y-4 text-[17px] leading-[1.65] text-ink';

/** The circuit in words: "120 V single-phase", "480 V three-phase", "12 V DC". */
function CircuitText({ inputs }: { inputs: Inputs }) {
  return (
    <>
      <Val v={fieldNumber(inputs.volts)} unit="V" src="input" /> {CIRCUIT_NAME[inputs.circuit]}
    </>
  );
}

/** "12 AWG copper" or "2 × 1/0 AWG aluminum". */
function RunName({ run }: { run: DropRun }) {
  return (
    <>
      {run.sets > 1 && (
        <>
          <Num v={run.sets} src="input" /> ×{' '}
        </>
      )}
      <span data-size={run.size}>{formatSize(run.size)}</span> {run.material === 'Cu' ? 'copper' : 'aluminum'}
    </>
  );
}

/** The drop's figures at the significant figures of the resistance: volts, percent, load voltage, heat. */
function figures(run: DropRun) {
  const sig = { sig: run.sig };
  const decimals = decimalsAtSig(run.vdVolts, run.sig);
  return { sig, load: { fixed: decimals } };
}

/** The values table: current, resistance, drop, percent, load voltage, heat. */
function ValuesTable({ run, inputs }: { run: DropRun; inputs: Inputs }) {
  const { sig, load } = figures(run);
  const rows: { key: string; label: ReactNode; value: ReactNode }[] = [
    {
      key: 'amps',
      label: inputs.loadUnit === 'W' ? 'Current, from the power' : 'Current',
      value: <AmpsText inputs={inputs} amps={run.amps} />,
    },
    {
      key: 'r',
      label: (
        <>
          Resistance of one conductor, per 1,000 ft at <TempText inputs={inputs} />
        </>
      ),
      value: <Val v={run.perKft} unit="Ω" src={CALC} format={sig} />,
    },
    ...(run.sets > 1
      ? [
          {
            key: 'rs',
            label: (
              <>
                <Num v={run.sets} src="input" /> in parallel, per 1,000 ft
              </>
            ),
            value: <Val v={run.phaseKft} unit="Ω" src={CALC} format={sig} />,
          },
        ]
      : []),
    { key: 'vd', label: 'Voltage drop', value: <Val v={run.vdVolts} unit="V" src={CALC} format={sig} /> },
    { key: 'pct', label: 'Drop, percent of the supply', value: <Val v={run.vdPct} unit="%" src={CALC} format={sig} /> },
    { key: 'load', label: 'Voltage at the load', value: <Val v={run.loadVolts} unit="V" src={CALC} format={load} /> },
    { key: 'loss', label: 'Heat in the conductors', value: <Val v={run.lossW} unit="W" src={CALC} format={sig} /> },
  ];
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full max-w-[38rem] border-collapse text-[15px]" data-src={CALC}>
        <caption className="sr-only">The run&apos;s values</caption>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="border-b border-cut-rule first:border-t-2 first:border-t-ink">
              <th scope="row" className="py-2 pr-4 text-left font-normal">
                {r.label}
              </th>
              <td className="whitespace-nowrap py-2 pl-4 text-right font-mono tabular-nums">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** The arithmetic of the drop in words and figures. */
function HowWorkedOut({ run, inputs }: { run: DropRun; inputs: Inputs }) {
  const { sig } = figures(run);
  const k = circuitFactor(run.circuit);
  // the factors as shown; when their product rounds to a different figure, the sentence says ≈ rather than =
  const shownI = inputs.loadUnit === 'W' ? Number(run.amps.toPrecision(3)) : run.amps;
  const shownR = Number(run.phaseKft.toPrecision(run.sig));
  const shownL = Number(run.lengthFt.toFixed(1));
  const product = (k * shownI * shownR * shownL) / 1000;
  const exact = Number(product.toPrecision(run.sig)) === Number(run.vdVolts.toPrecision(run.sig));
  return (
    <p>
      <strong>How it is worked out:</strong>{' '}
      {run.circuit === 'three' ? (
        <>
          √3 × <AmpsText inputs={inputs} amps={run.amps} />
        </>
      ) : (
        <>
          <Num v={k} src={CALC} /> × <AmpsText inputs={inputs} amps={run.amps} />
        </>
      )}{' '}
      × <Val v={run.phaseKft} unit="Ω" src={CALC} format={sig} /> per 1,000 ft × <Val v={run.lengthFt} unit="ft" src={CALC} format={{ upTo: 1 }} /> ÷ 1,000{' '}
      {exact ? '=' : '≈'} <Val v={run.vdVolts} unit="V" src={CALC} format={sig} />
      {exact ? '' : ' (the factors are rounded here; the result is not)'}.{' '}
      {run.circuit === 'three'
        ? 'On a balanced three-phase circuit the drop between two lines is √3 times the drop along one conductor.'
        : 'The current runs out on one conductor and back on the other, so both lengths count.'}
    </p>
  );
}

/** The informational note's comparison, for an AC drop. */
function NoteLine({ run }: { run: DropRun }) {
  const above = run.vdPct > NOTE_FEEDER_PCT;
  return (
    <p data-src={NOTE}>
      <strong>For comparison:</strong> an informational note in the 2023 NEC (215.2(A)) says feeders sized for no more than{' '}
      <Val v={NOTE_FEEDER_PCT} unit="%" src={NOTE} /> drop at the farthest outlet, and no more than <Val v={NOTE_TOTAL_PCT} unit="%" src={NOTE} /> on
      feeder and branch circuit together, will give reasonable efficiency. It is advice, not a limit. This run&apos;s drop is{' '}
      {above ? 'above' : 'within'} <Val v={NOTE_FEEDER_PCT} unit="%" src={NOTE} />.
    </p>
  );
}

/** The ampacity check on the current in each conductor (60 °C column of Table 310.16). */
function AmpacityLine({ run }: { run: DropRun }) {
  const ampacity = ampacityPerConductorExceeded(run);
  if (ampacity === null) return null;
  return (
    <p>
      <strong>Check the ampacity too:</strong> the current in each conductor,{' '}
      <Val v={run.amps / run.sets} unit="A" src={CALC} format={{ sig: 3 }} />, is more than the{' '}
      <Val v={AMPACITY_NOTE_COLUMN} unit="°C" src={AMP} /> ampacity of <span data-size={run.size}>{formatSize(run.size)}</span>{' '}
      {run.material === 'Cu' ? 'copper' : 'aluminum'}, <Val v={ampacity} unit="A" src={AMP} /> in NEC Table 310.16. Size the wire for the
      current with the{' '}
      <Link href={WIRE_SIZE_CALCULATOR_LINK.href} className={LINK}>
        {WIRE_SIZE_CALCULATOR_LINK.text}
      </Link>{' '}
      and use the larger of the two sizes.
    </p>
  );
}

/** What the sets in parallel add up to. */
function ParallelLine({ run }: { run: DropRun }) {
  if (run.sets === 1) return null;
  const eq = parallelEquivalent(run.size, run.sets);
  return (
    <p>
      <strong>In parallel</strong>, <Num v={run.sets} src="input" /> conductors of <span data-size={run.size}>{formatSize(run.size)}</span> have{' '}
      <Val v={eq.totalCmil} unit="cmil" src={CALC} /> together, and the resistance of the run is divided by <Num v={run.sets} src="input" />.
      {eq.smallestSingleSize ? (
        <>
          {' '}
          The smallest single size with at least that area is <span data-size={eq.smallestSingleSize}>{formatSize(eq.smallestSingleSize)}</span>.
        </>
      ) : null}{' '}
      This calculator adds the areas; it doesn&apos;t check the NEC&apos;s rules for running conductors in parallel.
    </p>
  );
}

function Assumptions({ inputs }: { inputs: Inputs }) {
  return (
    <div className="mt-8 max-w-[38rem] border-t border-cut-rule pt-4 text-[15px] leading-[1.6] text-[#333333]">
      <p>
        Assumed: solid conductors at <TempText inputs={inputs} />, whose resistance comes from NIST&apos;s copper and aluminum wire
        tables; stranded wire of the same size measures slightly higher. Resistance only: an AC circuit also has reactance, which
        this calculator leaves out. It matters little on small conductors and more on large ones.{' '}
        <Link href="/methodology#resistance" className={LINK}>
          How these values are calculated
        </Link>
        .
      </p>
      <p className="mt-3">
        Next: the{' '}
        <Link href="/calculators/wire-size-calculator" className={LINK}>
          wire size calculator
        </Link>{' '}
        sizes a circuit for its breaker, and the{' '}
        <Link href="/calculators/wire-resistance-calculator" className={LINK}>
          wire resistance calculator
        </Link>{' '}
        gives the ohms of any run.
      </p>
    </div>
  );
}

function CheckResult({
  result,
  headingRef,
  shareUrl,
}: {
  result: CheckComputed;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  shareUrl: () => string;
}) {
  const { inputs, run, neighbours } = result;
  const { sig, load } = figures(run);
  const exceeds = run.vdPct >= 100;
  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none">
        <RunName run={run} />, <LengthText inputs={inputs} /> one way, <AmpsText inputs={inputs} amps={run.amps} /> on{' '}
        <CircuitText inputs={inputs} />, at <TempText inputs={inputs} />
      </h2>
      {exceeds ? (
        <p className="mt-3 max-w-[38rem] text-[17px] leading-[1.6] text-ink">
          The calculated drop is larger than the supply voltage. Choose a larger size, a shorter run or a lower current.
        </p>
      ) : (
        <>
          <p className={BIG}>
            <Val v={run.vdPct} unit="%" src={CALC} format={sig} />
          </p>
          <p className="mt-3 max-w-[38rem] text-[17px] leading-[1.6] text-ink">
            <strong>
              <Val v={run.vdVolts} unit="V" src={CALC} format={sig} />
            </strong>{' '}
            of the <Val v={run.volts} unit="V" src="input" /> supply is lost in the wire, so{' '}
            <strong>
              <Val v={run.loadVolts} unit="V" src={CALC} format={load} />
            </strong>{' '}
            reaches the load.
          </p>
          <ValuesTable run={run} inputs={inputs} />
          <div className={PROSE}>
            <HowWorkedOut run={run} inputs={inputs} />
            {run.circuit !== 'dc' && <NoteLine run={run} />}
            <p>
              <strong>Heat:</strong> at this current the conductors turn <Val v={run.lossW} unit="W" src={CALC} format={sig} /> into heat, energy
              paid for while the load runs.
            </p>
            <AmpacityLine run={run} />
            <ParallelLine run={run} />
            <p>The same run in the sizes around yours:</p>
          </div>
          <div className="mt-4 max-w-[40rem]">
            <RunBars
              rows={neighbours.map((n) => ({ size: n.size, value: n.vdPct, format: { sig: n.sig } }))}
              chosen={run.size}
              material={run.material}
              src={CALC}
              unit="%"
              label="Voltage drop in percent in nearby sizes"
            />
          </div>
        </>
      )}
      <Assumptions inputs={inputs} />
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}

function FindResult({
  result,
  headingRef,
  shareUrl,
}: {
  result: FindComputed;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  shareUrl: () => string;
}) {
  const { inputs, target, search, neighbours } = result;
  const run = search.found;
  const metal = inputs.material === 'Cu' ? 'copper' : 'aluminum';
  const amps = neighbours[0]?.amps ?? 0;
  const largest = neighbours[neighbours.length - 1];
  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none">
        Smallest {metal} size for a drop of at most <Val v={target} unit="%" src="input" />: <AmpsText inputs={inputs} amps={amps} /> on{' '}
        <CircuitText inputs={inputs} />, <LengthText inputs={inputs} /> one way, at <TempText inputs={inputs} />
        {inputs.sets > 1 && (
          <>
            , <Num v={inputs.sets} src="input" /> sets in parallel
          </>
        )}
      </h2>
      {run ? (
        <>
          <p className={BIG}>
            <span data-size={run.size}>{formatSize(run.size)}</span>
          </p>
          <p className="mt-3 max-w-[38rem] text-[17px] leading-[1.6] text-ink">
            It drops <Val v={run.vdVolts} unit="V" src={CALC} format={figures(run).sig} />,{' '}
            <strong>
              <Val v={run.vdPct} unit="%" src={CALC} format={figures(run).sig} />
            </strong>{' '}
            of the supply.{' '}
            {search.smaller ? (
              <>
                The next smaller size, <span data-size={search.smaller.size}>{formatSize(search.smaller.size)}</span>, drops{' '}
                <Val v={search.smaller.vdPct} unit="%" src={CALC} format={figures(search.smaller).sig} />, above your target.
              </>
            ) : (
              <>It is the smallest size this calculator offers.</>
            )}
          </p>
          <ValuesTable run={run} inputs={inputs} />
          <div className={PROSE}>
            <HowWorkedOut run={run} inputs={inputs} />
            <AmpacityLine run={run} />
            <ParallelLine run={run} />
            <p>
              The sizes around it; the line marks your target, <Val v={target} unit="%" src="input" />:
            </p>
          </div>
        </>
      ) : (
        <div className={PROSE}>
          <p>
            <strong>No size up to 2000 kcmil keeps the drop within your target.</strong>{' '}
            {largest.vdPct >= 100 ? (
              <>
                Even <span data-size={largest.size}>{formatSize(largest.size)}</span> would drop more than the supply voltage.
              </>
            ) : (
              <>
                <span data-size={largest.size}>{formatSize(largest.size)}</span> drops{' '}
                <Val v={largest.vdPct} unit="%" src={CALC} format={figures(largest).sig} />.
              </>
            )}{' '}
            Run conductors in parallel, shorten the run or use a higher voltage.
          </p>
          <p>The largest sizes; the line marks your target:</p>
        </div>
      )}
      <div className="mt-4 max-w-[40rem]">
        <RunBars
          rows={neighbours.map((n) => ({ size: n.size, value: n.vdPct, format: { sig: n.sig } }))}
          chosen={run?.size ?? ''}
          material={inputs.material}
          src={CALC}
          unit="%"
          label={`Voltage drop in percent in nearby sizes; your target is ${target} %`}
          target={target}
        />
      </div>
      <Assumptions inputs={inputs} />
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}
