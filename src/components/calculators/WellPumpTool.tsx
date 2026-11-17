'use client';

// The well pump calculator in the look (WSZ-011c; data: Franklin Electric's AIM Manual, 2026 edition, WSZ-034). A
// Franklin 4-inch single-phase submersible motor and the total cable length: the smallest copper size from Franklin's
// 75 °C cable table (5 % or 3 % drop; jacketed cable skips shaded cells), aluminum two sizes larger, Franklin's breaker
// and fuse sizes and the motor's amps. Results appear only after Calculate; a share link restores them.
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Size } from '@/components/content/Size';
import { Val } from '@/components/content/Val';
import { ValText } from '@/components/content/ValText';
import { ResultActions } from '@/components/look/ResultActions';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Field, Segmented, SelectInput, TextInput, describedBy } from '@/components/look/Form';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '@/lib/calculations/fields';
import { formatValue } from '@/lib/calculations/format';
import { WP_CALC, WP_LENGTH_MAX, wellPump, wpHpOptions } from '@/lib/calculations/well-pump';
import type { CableKind, WellPumpRun } from '@/lib/calculations/well-pump';
import { CABLE_RULES, MFR_WELL_PUMP_DOMAIN } from '@/lib/verified/mfr-well-pump';
import type { PumpHp, PumpVolts, PumpWires } from '@/lib/verified/mfr-well-pump';

const CALC = WP_CALC;
const MFR = MFR_WELL_PUMP_DOMAIN;
const LINK = 'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]';
const ALL_HP: PumpHp[] = ['1/2', '3/4', '1', '1.5', '2', '3', '5'];

interface Inputs {
  volts: PumpVolts;
  wires: PumpWires;
  hp: PumpHp;
  length: string;
  drop: 5 | 3;
  cable: CableKind;
}
const DEFAULTS: Inputs = { volts: 230, wires: 2, hp: '1', length: '300', drop: 5, cable: 'jacketed' };

type Errors = Partial<Record<'length', string>>;
function errorsOf(i: Inputs): Errors {
  const ft = fieldNumber(i.length);
  return ft > 0 && ft <= WP_LENGTH_MAX ? {} : { length: `Enter 1 to ${formatValue(WP_LENGTH_MAX)} ft.` };
}

/** The motor's horsepower kept when the voltage or wire count changes, else the nearest offered rating. */
function fitHp(volts: PumpVolts, wires: PumpWires, hp: PumpHp): PumpHp {
  const options = wpHpOptions(volts, wires);
  if (options.includes(hp)) return hp;
  const value = (h: PumpHp) => (h === '1/2' ? 0.5 : h === '3/4' ? 0.75 : Number(h));
  return options.reduce((best, h) => (Math.abs(value(h) - value(hp)) < Math.abs(value(best) - value(hp)) ? h : best), options[0]);
}

type Outcome = { inputs: Inputs; run: WellPumpRun } | { inputs: Inputs; error: string };
function compute(i: Inputs): Outcome | null {
  if (Object.keys(errorsOf(i)).length > 0) return null;
  const r = wellPump({ volts: i.volts, wires: i.wires, hp: i.hp, lengthFt: fieldNumber(i.length), dropPct: i.drop, cable: i.cable });
  return 'error' in r ? { inputs: i, error: r.error } : { inputs: i, run: r };
}

function inputsFromQuery(params: URLSearchParams): Inputs {
  const volts = choiceParam(params, 'volts', ['230', '115'] as const) === '115' ? 115 : 230;
  const wires = choiceParam(params, 'wires', ['2', '3'] as const) === '3' ? 3 : 2;
  const hp = choiceParam(params, 'hp', ALL_HP) ?? DEFAULTS.hp;
  return {
    volts,
    wires,
    hp: fitHp(volts, wires, hp),
    length: numberParam(params, 'length') ?? DEFAULTS.length,
    drop: choiceParam(params, 'drop', ['5', '3'] as const) === '3' ? 3 : 5,
    cable: choiceParam(params, 'cable', ['jacketed', 'conductors'] as const) ?? DEFAULTS.cable,
  };
}

const queryOf = (i: Inputs) =>
  buildQuery({ volts: i.volts, wires: i.wires, hp: i.hp, length: i.length.trim(), drop: i.drop, cable: i.cable });

export function WellPumpTool() {
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
    setInputs((prev) => {
      const next = { ...prev, ...patch };
      return { ...next, hp: fitHp(next.volts, next.wires, next.hp) };
    });
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
  const hpOptions = wpHpOptions(inputs.volts, inputs.wires);

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Well pump calculator">
        <div className="grid gap-x-10 gap-y-7 lg:grid-cols-2">
          <Segmented
            name="volts"
            legend="Motor voltage"
            value={String(inputs.volts)}
            options={[
              { value: '230', label: <span data-src={MFR}>230 V</span> },
              { value: '115', label: <span data-src={MFR}>115 V</span> },
            ]}
            onChange={(v) => update({ volts: v === '115' ? 115 : 230 })}
          />
          <Segmented
            name="wires"
            legend="Motor type"
            value={String(inputs.wires)}
            options={[
              { value: '2', label: <span data-src={MFR}>2-wire</span> },
              { value: '3', label: <span data-src={MFR}>3-wire, control box</span> },
            ]}
            onChange={(v) => update({ wires: v === '3' ? 3 : 2 })}
          />
          <Field id="hp" label="Motor horsepower" hint={inputs.wires === 2 ? <span data-src={MFR}>Franklin&apos;s 2-wire motors stop at 1.5 hp.</span> : 'From the motor nameplate.'}>
            <SelectInput id="hp" value={inputs.hp} onChange={(hp) => update({ hp })} describedById="hp-hint">
              {hpOptions.map((hp) => (
                <option key={hp} value={hp} data-src={MFR}>
                  {hp} hp
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field id="length" label="Cable length, ft" hint="Total: panel to the well, plus the drop down to the motor." error={shownLength}>
            <TextInput
              id="length"
              value={inputs.length}
              onChange={(length) => update({ length })}
              onBlur={() => fieldErrors.touch('length')}
              error={shownLength}
              describedById={describedBy('length', shownLength, true)}
              inputMode="numeric"
              className="max-w-[12rem]"
            />
          </Field>
          <Segmented
            name="drop"
            legend="Voltage drop"
            value={String(inputs.drop)}
            options={[
              { value: '5', label: <span data-src={MFR}>5 %, Franklin&apos;s basis</span> },
              { value: '3', label: <span data-src={MFR}>3 %</span> },
            ]}
            onChange={(v) => update({ drop: v === '3' ? 3 : 5 })}
          />
          <Segmented
            name="cable"
            legend="Cable"
            value={inputs.cable}
            options={[
              { value: 'jacketed', label: 'Jacketed well cable' },
              { value: 'conductors', label: 'Single conductors' },
            ]}
            onChange={(cable) => update({ cable })}
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
      {result && 'run' in result && <PumpResult inputs={result.inputs} r={result.run} headingRef={headingRef} shareUrl={shareUrl} />}
    </div>
  );
}

const BIG = 'mt-2 font-mono text-[34px] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[46px]';
const PANEL = 'border-t border-cut-rule pt-4';
const PANEL_H = 'font-display text-[17px] font-semibold text-ink';
const SUB = 'mt-2 text-[17px] text-ink';
const STEPS = 'mt-6 max-w-[38rem] list-decimal space-y-2 pl-6 text-[17px] leading-[1.65] text-ink';
const NOTE = 'mt-8 max-w-[38rem] border-t border-cut-rule pt-4 text-[15px] leading-[1.6] text-[#333333]';

type HeadingRef = React.RefObject<HTMLHeadingElement | null>;

function PumpResult({ inputs, r, headingRef, shareUrl }: { inputs: Inputs; r: WellPumpRun; headingRef: HeadingRef; shareUrl: () => string }) {
  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none">
        <span data-src={MFR}>
          A {inputs.hp} hp, <Val v={inputs.volts} unit="V" src={MFR} /> {inputs.wires}-wire motor
        </span>
        , <Val v={fieldNumber(inputs.length)} unit="ft" src="input" /> of {inputs.cable === 'jacketed' ? 'jacketed cable' : 'single conductors'}
      </h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <div className={PANEL}>
          <h3 className={PANEL_H}>Copper wire</h3>
          <p className={BIG} data-src={CALC}>
            <Size s={r.copper} />
          </p>
          <p className={SUB} data-src={CALC}>
            up to <Val v={r.copperMaxFt} unit="ft" src={CALC} format={{ upTo: 0 }} /> at <Val v={inputs.drop} unit="%" src="input" />
          </p>
        </div>
        <div className={PANEL}>
          <h3 className={PANEL_H}>Aluminum wire</h3>
          <p className={BIG} data-src={CALC}>
            {r.aluminum ? <Size s={r.aluminum} /> : '–'}
          </p>
          <p className={SUB}>{r.aluminum ? 'two sizes larger (Franklin)' : 'past 4/0 AWG: use copper'}</p>
        </div>
        <div className={PANEL}>
          <h3 className={PANEL_H}>Circuit breaker</h3>
          <p className={BIG} data-src={MFR}>
            <Val v={r.fuses.max_nec.breaker} unit="A" src={MFR} />
          </p>
          <p className={SUB} data-src={MFR}>
            at most, per the NEC; <Val v={r.fuses.typical.breaker} unit="A" src={MFR} /> typical
          </p>
        </div>
        <div className={PANEL}>
          <h3 className={PANEL_H}>Motor amps</h3>
          <p className={BIG} data-src={MFR}>
            <Val v={r.motor.max_amps} unit="A" src={MFR} format={{ fixed: 1 }} />
          </p>
          <p className={SUB} data-src={MFR}>
            at maximum load; <Val v={r.motor.fl_amps} unit="A" src={MFR} format={{ fixed: 1 }} /> at full load
          </p>
        </div>
      </div>
      <ol className={STEPS} data-src={CALC}>
        {r.stepParts.map((parts, k) => (
          <li key={k}>
            <ValText parts={parts} />
          </li>
        ))}
      </ol>
      <p className={NOTE} data-src={MFR}>
        Franklin Electric&apos;s tables for its 4-inch single-phase motors; other makers publish their own, and the motor&apos;s nameplate amps
        decide. Lengths are copper at <Val v={CABLE_RULES.dropPct} unit="%" src={MFR} /> unless you pick <Val v={3} unit="%" src={MFR} />.{' '}
        <Link href="/methodology#well-pump-method" className={LINK}>
          How the calculator works
        </Link>
        .
      </p>
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}
