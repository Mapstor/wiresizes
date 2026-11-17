'use client';

// The welder calculator in the look (WSZ-011f; sources WSZ-037). Pick a welder whose manual this site has read, or
// enter I1max and the manual's minimum wire: the copper wire from that minimum, moved up until 630.12(B) allows the
// breaker and then for the voltage drop at I1max; the breaker limits of 630.12; the ground wire. Results appear only
// after Calculate; a share link restores them.
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Size } from '@/components/content/Size';
import { Val } from '@/components/content/Val';
import { ValText } from '@/components/content/ValText';
import { ResultActions } from '@/components/look/ResultActions';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, FIELD_HINT, Field, Segmented, SelectInput, TextInput, describedBy } from '@/components/look/Form';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { buildQuery, choiceParam, fieldNumber, numberParam } from '@/lib/calculations/fields';
import { formatValue } from '@/lib/calculations/format';
import type { Termination, WiringMethod } from '@/lib/calculations/conductor-sizing';
import { LENGTH_MAX_FT, LENGTH_MIN_FT, VD_TARGET_OPTIONS } from '@/lib/calculations/voltage-drop';
import { WD_CALC, WD_I1MAX_MAX, WD_MIN_SIZES, WD_OCPD_OPTIONS, WD_VOLTS, welderCircuit } from '@/lib/calculations/welder';
import type { WelderRun } from '@/lib/calculations/welder';
import type { SizeKey } from '@/lib/verified/awg';
import { TERMINATION_RULES } from '@/lib/verified/nec-110-14c';
import { MFR_WELDERS_DOMAIN, WELDER_PRESETS, manualOcpd } from '@/lib/verified/mfr-welders';

const CALC = WD_CALC;
const MFR = MFR_WELDERS_DOMAIN;
const TERM = 'nec-110-14c';
const LINK = 'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]';
const OTHER = 'other';
const PRESET_IDS = WELDER_PRESETS.map((w) => w.id);

interface Inputs {
  welder: string;
  i1max: string;
  min: SizeKey;
  breaker: string;
  method: WiringMethod;
  termination: Termination;
  length: string;
  target: string;
}
const FIRST = WELDER_PRESETS[0];
const DEFAULTS: Inputs = {
  welder: FIRST.id,
  i1max: String(FIRST.i1maxA),
  min: FIRST.minConductor,
  breaker: String(manualOcpd(FIRST)),
  method: 'conductors',
  termination: 'unknown',
  length: '50',
  target: '3',
};
const preset = (id: string) => WELDER_PRESETS.find((w) => w.id === id) ?? null;

/** A preset fills I1max and the minimum wire from its manual. */
function resolved(i: Inputs): Inputs {
  const p = preset(i.welder);
  return p ? { ...i, i1max: String(p.i1maxA), min: p.minConductor } : i;
}

type Errors = Partial<Record<'i1max' | 'length', string>>;
function errorsOf(i: Inputs): Errors {
  const errors: Errors = {};
  const a = fieldNumber(i.i1max);
  if (i.welder === OTHER && !(a > 0 && a <= WD_I1MAX_MAX)) errors.i1max = `Enter I1max, up to ${formatValue(WD_I1MAX_MAX)} A.`;
  const ft = fieldNumber(i.length);
  if (!(ft >= LENGTH_MIN_FT && ft <= LENGTH_MAX_FT)) errors.length = `Enter ${formatValue(LENGTH_MIN_FT)} to ${formatValue(LENGTH_MAX_FT)} ft.`;
  return errors;
}

type Outcome = { inputs: Inputs; run: WelderRun } | { inputs: Inputs; error: string };
function compute(raw: Inputs): Outcome | null {
  const i = resolved(raw);
  if (Object.keys(errorsOf(i)).length > 0) return null;
  const r = welderCircuit({
    i1maxA: fieldNumber(i.i1max),
    minSize: i.min,
    ocpdA: Number(i.breaker),
    wiringMethod: i.method,
    termination: i.method === 'cable' ? 'unknown' : i.termination,
    lengthFt: fieldNumber(i.length),
    vdTargetPct: Number(i.target),
  });
  return 'error' in r ? { inputs: i, error: r.error } : { inputs: i, run: r };
}

function inputsFromQuery(params: URLSearchParams): Inputs {
  const welder = choiceParam(params, 'welder', [...PRESET_IDS, OTHER]) ?? DEFAULTS.welder;
  const breaker = choiceParam(params, 'breaker', WD_OCPD_OPTIONS);
  const target = choiceParam(params, 'target', VD_TARGET_OPTIONS);
  const p = preset(welder);
  return resolved({
    welder,
    i1max: numberParam(params, 'i1max') ?? DEFAULTS.i1max,
    min: choiceParam(params, 'min', WD_MIN_SIZES) ?? DEFAULTS.min,
    breaker: breaker === null ? String(p ? manualOcpd(p) : DEFAULTS.breaker) : String(breaker),
    method: choiceParam(params, 'method', ['cable', 'c'] as const) === 'cable' ? 'cable' : 'conductors',
    termination: choiceParam(params, 'terminals', ['unknown', '60', '75'] as const) ?? DEFAULTS.termination,
    length: numberParam(params, 'length') ?? DEFAULTS.length,
    target: target === null ? DEFAULTS.target : String(target),
  });
}

const queryOf = (i: Inputs) =>
  buildQuery({
    welder: i.welder,
    i1max: i.welder === OTHER ? i.i1max.trim() : '',
    min: i.welder === OTHER ? i.min : '',
    breaker: i.breaker,
    method: i.method === 'cable' ? 'cable' : 'c',
    terminals: i.method === 'conductors' ? i.termination : '',
    length: i.length.trim(),
    target: i.target,
  });

export function WelderTool() {
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
    setInputs((prev) => resolved({ ...prev, ...patch }));
  };
  const pickWelder = (welder: string) => {
    const p = preset(welder);
    update(p ? { welder, breaker: String(manualOcpd(p)) } : { welder });
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
  const p = preset(inputs.welder);
  const shownI1max = fieldErrors.shown('i1max', errors.i1max);
  const shownLength = fieldErrors.shown('length', errors.length);

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Welder calculator">
        <div className="grid gap-x-10 gap-y-7 lg:grid-cols-2">
          <Field
            id="welder"
            label="Welder"
            hint={
              p ? (
                <span data-src={MFR}>
                  I1max <Val v={p.i1maxA as number} unit="A" src={MFR} />, minimum wire <Size s={p.minConductor} />
                  {p.fuseTimeDelayA !== null && p.fuseNormalA !== null ? (
                    <>
                      ; {p.brand} lists <Val v={p.fuseTimeDelayA} unit="A" src={MFR} /> time-delay or <Val v={p.fuseNormalA} unit="A" src={MFR} /> fuses.
                    </>
                  ) : (
                    <>
                      ; {p.brand} lists a <Val v={manualOcpd(p)} unit="A" src={MFR} /> fuse or breaker.
                    </>
                  )}
                </span>
              ) : (
                'Use the numbers from your welder’s manual or nameplate.'
              )
            }
          >
            <SelectInput id="welder" value={inputs.welder} onChange={pickWelder} describedById="welder-hint">
              {WELDER_PRESETS.map((w) => (
                <option key={w.id} value={w.id} data-src={MFR}>
                  {w.brand} {w.model}
                </option>
              ))}
              <option value={OTHER}>Other welder</option>
            </SelectInput>
          </Field>
          {inputs.welder === OTHER ? (
            <Field id="i1max" label="I1max, A" hint="On the nameplate; if there is none, the rated primary current." error={shownI1max}>
              <TextInput
                id="i1max"
                value={inputs.i1max}
                onChange={(i1max) => update({ i1max })}
                onBlur={() => fieldErrors.touch('i1max')}
                error={shownI1max}
                describedById={describedBy('i1max', shownI1max, true)}
                className="max-w-[12rem]"
              />
            </Field>
          ) : null}
          {inputs.welder === OTHER && (
            <Field id="min" label="Minimum wire in the manual" hint="The supply conductor size the manual lists.">
              <SelectInput id="min" value={inputs.min} onChange={(min) => update({ min: min as SizeKey })} describedById="min-hint">
                {WD_MIN_SIZES.map((s) => (
                  <option key={s} value={s} data-size={s}>
                    {s} AWG
                  </option>
                ))}
              </SelectInput>
            </Field>
          )}
          <Field id="breaker" label="Breaker or fuse, A" hint="The rating you will install.">
            <SelectInput id="breaker" value={inputs.breaker} onChange={(breaker) => update({ breaker })} describedById="breaker-hint">
              {WD_OCPD_OPTIONS.map((a) => (
                <option key={a} value={String(a)} data-src="input">
                  {a} A
                </option>
              ))}
            </SelectInput>
          </Field>
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
                <Val v={TERMINATION_RULES.columnAboveLimit} unit="°C" src={TERM} /> only if the breaker, the receptacle or disconnect and the wire are
                all listed for it.
              </p>
            </div>
          ) : (
            <p className="self-end text-[15px] leading-[1.6] text-[#333333]" data-src={TERM}>
              Cable stays in the <Val v={TERMINATION_RULES.cableColumn} unit="°C" src={TERM} /> column.
            </p>
          )}
          <Field id="length" label="One-way length, ft" hint="Panel to the welder’s receptacle or disconnect." error={shownLength}>
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
          <Field id="target" label="Voltage drop target" hint="Your own limit for the run, at I1max.">
            <SelectInput id="target" value={inputs.target} onChange={(target) => update({ target })} describedById="target-hint">
              {VD_TARGET_OPTIONS.map((t) => (
                <option key={t} value={String(t)} data-src="input">
                  {formatValue(t)} %
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>
        <p className={FIELD_HINT} data-src={CALC}>
          Copper at <Val v={WD_VOLTS} unit="V" src={CALC} />, as the makers&apos; guides give it.
        </p>
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
      {result && 'run' in result && <WelderResult inputs={result.inputs} r={result.run} headingRef={headingRef} shareUrl={shareUrl} />}
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

function WelderResult({ inputs, r, headingRef, shareUrl }: { inputs: Inputs; r: WelderRun; headingRef: HeadingRef; shareUrl: () => string }) {
  const p = preset(inputs.welder);
  const stepped = r.size !== r.firstSize;
  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none">
        {p ? `${p.brand} ${p.model}` : 'Your welder'}, I1max <Val v={r.input.i1maxA} unit="A" src={p ? MFR : 'input'} />,{' '}
        <Val v={r.input.ocpdA} unit="A" src="input" /> breaker, <Val v={r.input.lengthFt} unit="ft" src="input" /> one way
      </h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <div className={PANEL}>
          <h3 className={PANEL_H}>Copper wire</h3>
          <p className={BIG} data-src={CALC}>
            <Size s={r.size} />
          </p>
          <p className={SUB} data-src={CALC}>
            {stepped ? (
              <>
                for the drop; <Size s={r.firstSize} /> carries the breaker
              </>
            ) : (
              <>
                <Val v={r.ampacity} unit="A" src={CALC} /> at <Val v={r.columnC} unit="°C" src={CALC} />
              </>
            )}
          </p>
        </div>
        <div className={PANEL}>
          <h3 className={PANEL_H}>Breaker, at most</h3>
          <p className={BIG} data-src={CALC}>
            <Val v={r.maxOcpdA} unit="A" src={CALC} />
          </p>
          <p className={SUB} data-src={CALC}>
            on this wire (630.12); yours: <Val v={r.input.ocpdA} unit="A" src="input" />
          </p>
        </div>
        <div className={PANEL}>
          <h3 className={PANEL_H}>Ground wire</h3>
          <p className={BIG} data-src={CALC}>
            <Size s={r.egc} />
          </p>
          <p className={SUB}>{r.egcGrown ? 'copper, grown with the wire (250.122(B))' : r.egcCapped ? 'copper, no larger than the wire (250.122(A))' : 'copper, Table 250.122'}</p>
        </div>
        <div className={PANEL}>
          <h3 className={PANEL_H}>Voltage drop</h3>
          <p className={BIG} data-src={CALC}>
            <Val v={r.vdPct} unit="%" src={CALC} format={{ fixed: 2 }} />
          </p>
          <p className={SUB} data-src={CALC}>
            <Val v={r.vdVolts} unit="V" src={CALC} format={{ fixed: 2 }} /> at I1max
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
      <p className={NOTE}>
        Follow the manual where it asks for more.{' '}
        <Link href="/methodology#welder-method" className={LINK}>
          How the calculator works
        </Link>
        .
      </p>
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}
