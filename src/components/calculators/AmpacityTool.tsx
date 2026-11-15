'use client';

// The ampacity calculator in the look (WSZ-009a; spec: research/page-specs-held.md "WSZ-009"; D-35): a conductor's size,
// material and insulation column give its NEC Table 310.16 value; the ambient temperature corrects it (Table
// 310.15(B)(1)(1), the row whose printed range holds the temperature) and the count of current-carrying conductors adjusts
// it (Table 310.15(C)(1)). The corrected ampacity is then shown against each termination column 110.14(C) allows, and the
// 240.4(D) limit beside it. NM and UF cable stay in the 60 °C column (engine rule nm-cable). Engine: ampacityRun in
// src/lib/calculations/ampacity.ts. Results appear only after Calculate; a share link restores them.
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
import {
  AMPACITY_SIZES,
  CABLE_COLUMN,
  ENGINE_ID,
  ampacityRun,
  isAmpacityError,
  warmestTemp,
} from '@/lib/calculations/ampacity';
import type { AmpacityRun, TempUnit, WiringMethod } from '@/lib/calculations/ampacity';
import { TERMINATION_RULES } from '@/lib/verified/nec-110-14c';
import { columnKey, table31016 } from '@/lib/verified/nec-310-16';
import type { AmpacityColumn } from '@/lib/verified/nec-310-16';
import { isKcmil } from '@/lib/verified/awg';
import type { Material, SizeKey } from '@/lib/verified/awg';

const CALC = `calc:${ENGINE_ID}`;
const AMP = 'nec-310-16';
const COR = 'nec-310-15-corrections';
const TERM = 'nec-110-14c';
const SMALL = 'nec-240-4-d';
const LINK = 'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]';
const MATERIAL_NAME: Record<Material, string> = { Cu: 'copper', Al: 'aluminum or copper-clad aluminum' };
const COLUMNS: AmpacityColumn[] = [60, 75, 90];
const TEMP_MIN = { C: -40, F: -40 };
const TEMP_MAX = { C: 150, F: 302 };
const COUNT_MAX = 100;
const AMPS = { upTo: 2 };

interface Inputs {
  size: SizeKey;
  material: Material;
  method: WiringMethod;
  column: AmpacityColumn;
  temp: string;
  unit: TempUnit;
  count: string;
}
const DEFAULTS: Inputs = { size: '12', material: 'Cu', method: 'conductors', column: 90, temp: '30', unit: 'C', count: '3' };

type Errors = { size?: string; temp?: string; count?: string };

/** "whole degrees, −40 to 150 °C": the hint and, after "Enter", the error, so the two take the same room. */
function tempRange(unit: TempUnit): string {
  const n = (v: number) => (v < 0 ? `−${formatValue(-v)}` : formatValue(v));
  return `whole degrees, ${n(TEMP_MIN[unit])} to ${n(TEMP_MAX[unit])} °${unit}`;
}

function errorsOf(i: Inputs): Errors {
  const e: Errors = {};
  const columns = i.method === 'cable' ? [CABLE_COLUMN] : COLUMNS;
  if (columns.every((c) => table31016(i.size, columnKey(i.material, c)) === null)) {
    e.size = 'Table 310.16 lists aluminum and copper-clad aluminum from 12 AWG.';
  }
  const t = fieldNumber(i.temp);
  if (!(Number.isInteger(t) && t >= TEMP_MIN[i.unit] && t <= TEMP_MAX[i.unit])) e.temp = `Enter ${tempRange(i.unit)}.`;
  const n = fieldNumber(i.count);
  if (!(Number.isInteger(n) && n >= 1 && n <= COUNT_MAX)) e.count = `Enter a whole number of conductors from 1 to ${COUNT_MAX}.`;
  return e;
}

function compute(i: Inputs): { inputs: Inputs; r: AmpacityRun } | null {
  if (Object.keys(errorsOf(i)).length > 0) return null;
  const r = ampacityRun({ size: i.size, material: i.material, method: i.method, column: i.column, temp: fieldNumber(i.temp), unit: i.unit, count: fieldNumber(i.count) });
  return isAmpacityError(r) ? null : { inputs: i, r };
}

function inputsFromQuery(params: URLSearchParams): Inputs {
  const column = choiceParam(params, 'c', ['60', '75', '90'] as const);
  return {
    size: choiceParam(params, 's', AMPACITY_SIZES) ?? DEFAULTS.size,
    material: choiceParam(params, 'm', ['cu', 'al'] as const) === 'al' ? 'Al' : 'Cu',
    method: choiceParam(params, 'w', ['c', 'nm'] as const) === 'nm' ? 'cable' : 'conductors',
    column: column ? (Number(column) as AmpacityColumn) : DEFAULTS.column,
    temp: numberParam(params, 't') ?? DEFAULTS.temp,
    unit: choiceParam(params, 'u', ['c', 'f'] as const) === 'f' ? 'F' : 'C',
    count: numberParam(params, 'n') ?? DEFAULTS.count,
  };
}

const queryOf = (i: Inputs) =>
  buildQuery({
    s: i.size,
    m: i.material.toLowerCase(),
    w: i.method === 'cable' ? 'nm' : 'c',
    c: i.method === 'cable' ? '' : String(i.column),
    t: i.temp.trim(),
    u: i.unit.toLowerCase(),
    n: i.count.trim(),
  });

export function AmpacityTool() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [result, setResult] = useState<{ inputs: Inputs; r: AmpacityRun } | null>(null);
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
  const shownSize = fieldErrors.shown('size', errors.size);
  const shownTemp = fieldErrors.shown('temp', errors.temp);
  const shownCount = fieldErrors.shown('count', errors.count);

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Ampacity calculator">
        <div className="grid gap-x-10 gap-y-7 lg:grid-cols-2">
          <Field id="size" label="Conductor size" error={shownSize}>
            <SelectInput
              id="size"
              value={inputs.size}
              onChange={(size) => {
                fieldErrors.touch('size');
                update({ size: size as SizeKey });
              }}
              error={shownSize}
              describedById={describedBy('size', shownSize, false)}
            >
              {AMPACITY_SIZES.map((s) => (
                <option key={s} value={s} data-size={s}>
                  {s} {isKcmil(s) ? 'kcmil' : 'AWG'}
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
            onChange={(m) => {
              fieldErrors.touch('size');
              update({ material: m === 'al' ? 'Al' : 'Cu' });
            }}
          />
          <Segmented
            name="method"
            legend="Wiring method"
            value={inputs.method}
            options={[
              { value: 'conductors', label: 'Single conductors' },
              { value: 'cable', label: 'NM or UF cable' },
            ]}
            onChange={(method) => update({ method })}
          />
          {inputs.method === 'conductors' ? (
            <Segmented
              name="column"
              legend="Insulation temperature rating"
              value={String(inputs.column) as '60' | '75' | '90'}
              options={COLUMNS.map((c) => ({ value: String(c) as '60' | '75' | '90', label: <Val v={c} unit="°C" src={AMP} /> }))}
              onChange={(c) => update({ column: Number(c) as AmpacityColumn })}
            />
          ) : (
            <p className="self-end text-[15px] leading-[1.6] text-[#333333]" data-src={TERM}>
              NM and UF cable stay in the <Val v={CABLE_COLUMN} unit="°C" src={TERM} /> column, corrections included.
            </p>
          )}
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4">
            <Field id="temp" label="Ambient temperature" hint={`In ${tempRange(inputs.unit)}.`} error={shownTemp}>
              <TextInput
                id="temp"
                value={inputs.temp}
                onChange={(temp) => update({ temp })}
                onBlur={() => fieldErrors.touch('temp')}
                error={shownTemp}
                describedById={describedBy('temp', shownTemp, true)}
              />
            </Field>
            <div className="mt-[29px]">
              <Segmented
                name="unit"
                legend="Temperature unit"
                srLegend
                value={inputs.unit}
                options={[
                  { value: 'C', label: '°C' },
                  { value: 'F', label: '°F' },
                ]}
                onChange={(unit) => update({ unit })}
              />
            </div>
          </div>
          <Field id="count" label="Current-carrying conductors" hint="In the raceway or cable, counted together." error={shownCount}>
            <TextInput
              id="count"
              value={inputs.count}
              onChange={(count) => update({ count })}
              onBlur={() => fieldErrors.touch('count')}
              error={shownCount}
              describedById={describedBy('count', shownCount, true)}
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

/** "41–45 °C" from a row in the unit the reader used. */
function RowRange({ r }: { r: AmpacityRun }) {
  if (!r.row) return null;
  const text = r.unit === 'C' ? r.row.key : r.row.ambientF;
  return (
    <span data-src={COR}>
      {text} °{r.unit}
    </span>
  );
}

function Outcome({ r, headingRef, shareUrl }: { r: AmpacityRun; headingRef: React.RefObject<HTMLHeadingElement | null>; shareUrl: () => string }) {
  const { result, caps } = r;
  const ok = result.ampacity !== null;
  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none">
        <Size s={r.size} /> {MATERIAL_NAME[r.material]}, {r.method === 'cable' ? 'NM or UF cable' : <><Val v={r.column} unit="°C" src="input" /> insulation</>}, at{' '}
        <Val v={r.temp} unit={r.unit === 'C' ? '°C' : '°F'} src="input" /> with <Num v={r.count} src="input" /> current-carrying
      </h2>
      {ok ? (
        <>
          <p className="mt-3 font-mono text-[34px] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[46px]" data-src={CALC}>
            <Val v={result.ampacity ?? 0} unit="A" src={CALC} format={AMPS} />
          </p>
          <p className="mt-2 text-[17px] text-ink">corrected ampacity, before the terminals and the breaker</p>
        </>
      ) : (
        <p className="mt-3 text-[20px] font-semibold text-ink" data-src={COR}>
          {r.row ? (
            <>
              Table 310.15(B)(1)(1) gives no factor for <Val v={r.column} unit="°C" src="input" /> conductors at <RowRange r={r} />: they may not
              be used there.
            </>
          ) : (
            <>
              Table 310.15(B)(1)(1) stops at <Val v={warmestTemp(r.unit)} unit={r.unit === 'C' ? '°C' : '°F'} src={COR} />; it gives no factor
              above that.
            </>
          )}
        </p>
      )}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full max-w-[38rem] border-collapse text-[15px]" data-src={CALC}>
          <caption className="sr-only">How the ampacity is found</caption>
          <tbody>
            <tr className={`${ROW} border-t-2 border-t-ink`}>
              <th scope="row" className={TH}>
                Table 310.16, <Val v={r.column} unit="°C" src={AMP} /> column
              </th>
              <td className={TD} data-src={AMP}>
                {result.tableAmpacity === null ? '–' : <Val v={result.tableAmpacity} unit="A" src={AMP} />}
              </td>
            </tr>
            <tr className={ROW}>
              <th scope="row" className={TH}>
                Ambient correction{r.row && <>, <RowRange r={r} /></>}
              </th>
              <td className={TD} data-src={COR}>
                {result.correctionFactor === null ? '–' : <>× <Num v={result.correctionFactor} src={COR} format={{ fixed: 2 }} /></>}
              </td>
            </tr>
            <tr className={ROW}>
              <th scope="row" className={TH}>
                Adjustment, <span data-src={COR}>{r.band}</span> conductors
              </th>
              <td className={TD} data-src={COR}>
                <Val v={result.adjustmentPercent} unit="%" src={COR} />
              </td>
            </tr>
            {caps.map((c) => (
              <tr key={c.column} className={ROW}>
                <th scope="row" className={TH}>
                  With <Val v={c.column} unit="°C" src={TERM} /> terminals
                  {c.capped && c.tableA !== null && (
                    <>
                      , capped at <Val v={c.tableA} unit="A" src={AMP} />
                    </>
                  )}
                </th>
                <td className={TD} data-src={CALC}>
                  {c.usableA === null ? '–' : <Val v={c.usableA} unit="A" src={CALC} format={AMPS} />}
                </td>
              </tr>
            ))}
            {result.ocpdLimitA !== null && (
              <tr className={ROW}>
                <th scope="row" className={TH}>
                  Largest breaker or fuse, 240.4(D)
                </th>
                <td className={TD} data-src={SMALL}>
                  <Val v={result.ocpdLimitA} unit="A" src={SMALL} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-6 max-w-[38rem] space-y-4 text-[17px] leading-[1.65] text-ink">
        <p data-src={TERM}>
          <strong>Terminals:</strong> under 110.14(C), equipment for circuits rated <Val v={TERMINATION_RULES.limitA} unit="A" src={TERM} /> or
          less is used at the <Val v={TERMINATION_RULES.columnAtOrBelowLimit} unit="°C" src={TERM} /> value unless every termination is listed and
          identified for <Val v={TERMINATION_RULES.columnAboveLimit} unit="°C" src={TERM} /> conductors; above{' '}
          <Val v={TERMINATION_RULES.limitA} unit="A" src={TERM} />, at the <Val v={TERMINATION_RULES.columnAboveLimit} unit="°C" src={TERM} /> value.
          {r.method === 'cable' && <> This site keeps NM and UF cable at <Val v={CABLE_COLUMN} unit="°C" src={TERM} /> whatever the terminals.</>}
        </p>
        {result.ocpdLimitA !== null && (
          <p data-src={SMALL}>
            <strong>Breaker:</strong> 240.4(D) limits the breaker or fuse on <Size s={r.size} /> {MATERIAL_NAME[r.material]} to{' '}
            <Val v={result.ocpdLimitA} unit="A" src={SMALL} />, whatever its ampacity.
          </p>
        )}
      </div>
      <div className="mt-8 max-w-[38rem] space-y-3 border-t border-cut-rule pt-4 text-[15px] leading-[1.6] text-[#333333]">
        <p data-src={COR}>
          You count the current-carrying conductors; the rules for whether neutrals and ground wires count are not covered here. Need a size
          for a load? The{' '}
          <Link href="/calculators/wire-size-calculator" className={LINK}>
            wire size calculator
          </Link>{' '}
          picks one.{' '}
          <Link href="/methodology#ampacity" className={LINK}>
            How these values are found
          </Link>
          .
        </p>
      </div>
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}
