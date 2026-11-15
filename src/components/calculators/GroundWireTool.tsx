'use client';

// The ground wire calculator in the look (WSZ-008a; spec: research/page-specs-held.md "WSZ-008"; D-35): two modes kept
// visibly apart, because the old page mixed them up. Equipment grounding conductor: the breaker or fuse rating and the
// material give the Table 250.122 size, and with "upsized" the 250.122(B) area ratio. Grounding electrode conductor:
// the largest service-entrance conductor and its material give the Table 250.66 row. Engine:
// src/lib/calculations/grounding.ts. Results appear only after Calculate; a share link restores them.
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Num } from '@/components/content/Num';
import { Size } from '@/components/content/Size';
import { Val } from '@/components/content/Val';
import { ResultActions } from '@/components/look/ResultActions';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Field, Segmented, SelectInput, describedBy } from '@/components/look/Form';
import { focusResults, useFieldErrors, useUrlState } from '@/lib/hooks/useCalculatorForm';
import { buildQuery, choiceParam } from '@/lib/calculations/fields';
import { formatValue } from '@/lib/calculations/format';
import { ENGINE_ID, GROUND_WIRE_DEFAULTS, GROUND_WIRE_RATINGS, GROUND_WIRE_SIZES, egcFor, gecFor, isEgcError } from '@/lib/calculations/grounding';
import type { EgcResult, GecResult } from '@/lib/calculations/grounding';
import { areaCmil, formatSize } from '@/lib/verified/awg';
import type { Material, SizeKey } from '@/lib/verified/awg';

const CALC = `calc:${ENGINE_ID}`;
const GND = 'nec-250-grounding';
const OCPD = 'nec-240-ocpd';
const GEO = 'awg-geometry';
const LINK = 'text-ink underline decoration-cut-line decoration-2 underline-offset-[3px]';

type Mode = 'egc' | 'gec';
type YesNo = 'no' | 'yes';
const MATERIAL_NAME: Record<Material, string> = { Cu: 'copper', Al: 'aluminum or copper-clad aluminum' };

interface Inputs {
  mode: Mode;
  ocpd: string;
  material: Material;
  upsized: YesNo;
  minSize: SizeKey;
  installed: SizeKey;
  serviceSize: SizeKey;
  serviceMaterial: Material;
}

const DEFAULTS: Inputs = {
  mode: 'egc',
  ocpd: String(GROUND_WIRE_DEFAULTS.ocpdA),
  material: 'Cu',
  upsized: 'no',
  minSize: '12',
  installed: '10',
  serviceSize: '2/0',
  serviceMaterial: 'Cu',
};

type Outcome = { mode: 'egc'; inputs: Inputs; r: EgcResult } | { mode: 'gec'; inputs: Inputs; r: GecResult };

const SIZES_ERROR = 'Choose an installed size larger than the size the rating needs.';

function errorsOf(i: Inputs): { installed?: string } {
  if (i.mode === 'egc' && i.upsized === 'yes' && !(areaCmil(i.installed) > areaCmil(i.minSize))) return { installed: SIZES_ERROR };
  return {};
}

function compute(i: Inputs): Outcome | null {
  if (Object.keys(errorsOf(i)).length > 0) return null;
  if (i.mode === 'gec') {
    const r = gecFor(i.serviceSize, i.serviceMaterial);
    return r ? { mode: 'gec', inputs: i, r } : null;
  }
  const r = egcFor(Number(i.ocpd), i.material, i.upsized === 'yes' ? { minSize: i.minSize, installedSize: i.installed } : null);
  return isEgcError(r) ? null : { mode: 'egc', inputs: i, r };
}

const MATERIALS = ['cu', 'al'] as const;
const toMaterial = (m: string | null | undefined, fallback: Material): Material => (m === 'al' ? 'Al' : m === 'cu' ? 'Cu' : fallback);

function inputsFromQuery(params: URLSearchParams): Inputs {
  const mode = choiceParam(params, 'mode', ['egc', 'gec'] as const) ?? DEFAULTS.mode;
  const sizes = GROUND_WIRE_SIZES;
  if (mode === 'gec') {
    return {
      ...DEFAULTS,
      mode,
      serviceSize: choiceParam(params, 'size', sizes) ?? DEFAULTS.serviceSize,
      serviceMaterial: toMaterial(choiceParam(params, 'm', MATERIALS), DEFAULTS.serviceMaterial),
    };
  }
  const ocpd = choiceParam(params, 'a', GROUND_WIRE_RATINGS.map(String)) ?? DEFAULTS.ocpd;
  const min = choiceParam(params, 'min', sizes);
  const installed = choiceParam(params, 'inst', sizes);
  return {
    ...DEFAULTS,
    mode,
    ocpd,
    material: toMaterial(choiceParam(params, 'm', MATERIALS), DEFAULTS.material),
    upsized: min && installed ? 'yes' : 'no',
    minSize: min ?? DEFAULTS.minSize,
    installed: installed ?? DEFAULTS.installed,
  };
}

function queryOf(i: Inputs): string {
  if (i.mode === 'gec') return buildQuery({ mode: 'gec', size: i.serviceSize, m: i.serviceMaterial.toLowerCase() });
  return buildQuery({
    mode: 'egc',
    a: i.ocpd,
    m: i.material.toLowerCase(),
    min: i.upsized === 'yes' ? i.minSize : '',
    inst: i.upsized === 'yes' ? i.installed : '',
  });
}

export function GroundWireTool() {
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
  const shownInstalled = fieldErrors.shown('installed', errors.installed);
  const sizeOptions = GROUND_WIRE_SIZES.map((s) => (
    <option key={s} value={s} data-size={s}>
      {formatSize(s)}
    </option>
  ));

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Ground wire calculator">
        <Segmented
          name="mode"
          legend="Which ground wire"
          value={inputs.mode}
          options={[
            { value: 'egc', label: 'Equipment grounding (EGC)' },
            { value: 'gec', label: 'Grounding electrode (GEC)' },
          ]}
          onChange={(mode) => {
            fieldErrors.reset();
            update({ mode });
          }}
        />
        {inputs.mode === 'egc' ? (
          <div className="mt-7 grid gap-x-10 gap-y-7 lg:grid-cols-3">
            <Field id="ocpd" label="Breaker or fuse rating, A" hint="The device ahead of the circuit or feeder.">
              <SelectInput id="ocpd" value={inputs.ocpd} onChange={(ocpd) => update({ ocpd })} describedById="ocpd-hint">
                {GROUND_WIRE_RATINGS.map((a) => (
                  <option key={a} value={String(a)} data-src={OCPD}>
                    {formatValue(a)} A
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Segmented
              name="material"
              legend="Ground wire material"
              value={inputs.material === 'Cu' ? 'cu' : 'al'}
              options={[
                { value: 'cu', label: 'Copper' },
                { value: 'al', label: 'Aluminum or CCA' },
              ]}
              onChange={(m) => update({ material: m === 'al' ? 'Al' : 'Cu' })}
            />
            <Segmented
              name="upsized"
              legend="Circuit wires upsized?"
              value={inputs.upsized}
              options={[
                { value: 'no', label: 'No' },
                { value: 'yes', label: 'Yes, larger' },
              ]}
              onChange={(upsized) => update({ upsized })}
            />
            {inputs.upsized === 'yes' && (
              <>
                <Field id="min-size" label="Size the rating needs" hint="From the wire size calculator or your own sizing.">
                  <SelectInput id="min-size" value={inputs.minSize} onChange={(minSize) => update({ minSize })} describedById="min-size-hint">
                    {sizeOptions}
                  </SelectInput>
                </Field>
                <Field id="installed" label="Size installed" error={shownInstalled}>
                  <SelectInput
                    id="installed"
                    value={inputs.installed}
                    onChange={(installed) => {
                      fieldErrors.touch('installed');
                      update({ installed });
                    }}
                    describedById={describedBy('installed', shownInstalled, false)}
                    error={shownInstalled}
                  >
                    {sizeOptions}
                  </SelectInput>
                </Field>
              </>
            )}
          </div>
        ) : (
          <div className="mt-7 grid gap-x-10 gap-y-7 lg:grid-cols-3">
            <Field id="service-size" label="Largest service conductor" hint="The largest ungrounded service-entrance conductor.">
              <SelectInput
                id="service-size"
                value={inputs.serviceSize}
                onChange={(serviceSize) => update({ serviceSize })}
                describedById="service-size-hint"
              >
                {sizeOptions}
              </SelectInput>
            </Field>
            <Segmented
              name="service-material"
              legend="Service conductor material"
              value={inputs.serviceMaterial === 'Cu' ? 'cu' : 'al'}
              options={[
                { value: 'cu', label: 'Copper' },
                { value: 'al', label: 'Aluminum or CCA' },
              ]}
              onChange={(m) => update({ serviceMaterial: m === 'al' ? 'Al' : 'Cu' })}
            />
          </div>
        )}
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
      {result?.mode === 'egc' && <EgcOutcome r={result.r} headingRef={headingRef} shareUrl={shareUrl} />}
      {result?.mode === 'gec' && <GecOutcome r={result.r} headingRef={headingRef} shareUrl={shareUrl} />}
    </div>
  );
}

const BIG = 'font-mono text-[34px] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[46px]';
const BODY = 'mt-6 max-w-[38rem] space-y-4 text-[17px] leading-[1.65] text-ink';
const NOTE = 'mt-8 max-w-[38rem] space-y-3 border-t border-cut-rule pt-4 text-[15px] leading-[1.6] text-[#333333]';

function Cmil({ v, src }: { v: number; src: string }) {
  return (
    <span data-src={src}>
      <Num v={Math.round(v)} src={src} /> cmil
    </span>
  );
}

function EgcOutcome({
  r,
  headingRef,
  shareUrl,
}: {
  r: EgcResult;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  shareUrl: () => string;
}) {
  const up = r.upsized;
  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none">
        Equipment grounding conductor for a <Val v={r.ocpdA} unit="A" src="input" /> breaker or fuse
        {up ? ', circuit wires upsized' : ''}
      </h2>
      <p className={`mt-3 ${BIG}`} data-src={up ? CALC : GND}>
        {r.egc ? <Size s={r.egc} /> : 'No size'}
      </p>
      <p className="mt-2 text-[17px] text-ink">{r.egc ? MATERIAL_NAME[r.material] : 'in Table 310.16 is large enough'}</p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full max-w-[38rem] border-collapse text-[15px]" data-src={GND}>
          <caption className="sr-only">The Table 250.122 row for this rating</caption>
          <tbody>
            <tr className="border-b border-cut-rule border-t-2 border-t-ink">
              <th scope="row" className="py-2 pr-4 text-left font-normal">
                Table 250.122 row, not exceeding
              </th>
              <td className="whitespace-nowrap py-2 pl-4 text-right font-mono tabular-nums">
                <Val v={r.rowA} unit="A" src={GND} />
              </td>
            </tr>
            <tr className="border-b border-cut-rule">
              <th scope="row" className="py-2 pr-4 text-left font-normal">
                Copper
              </th>
              <td className="whitespace-nowrap py-2 pl-4 text-right font-mono tabular-nums">
                <Size s={r.table.cu} />
              </td>
            </tr>
            <tr className="border-b border-cut-rule">
              <th scope="row" className="py-2 pr-4 text-left font-normal">
                Aluminum or copper-clad aluminum
              </th>
              <td className="whitespace-nowrap py-2 pl-4 text-right font-mono tabular-nums">
                <Size s={r.table.alCca} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={BODY}>
        <p data-src={GND}>
          <strong>Table 250.122:</strong> the first row whose rating the device does not exceed gives <Size s={r.tableEgc} />{' '}
          {MATERIAL_NAME[r.material]}.
        </p>
        {up && (
          <p data-src={CALC}>
            <strong>250.122(B):</strong> the circuit wires went from <Size s={up.minSize} /> to <Size s={up.installedSize} />, so the ground
            wire grows by the same ratio of area: <Cmil v={areaCmil(r.tableEgc)} src={GEO} /> × <Cmil v={areaCmil(up.installedSize)} src={GEO} /> ÷{' '}
            <Cmil v={areaCmil(up.minSize)} src={GEO} /> = <Cmil v={up.requiredCmil} src={CALC} />.{' '}
            {up.egc ? (
              <>
                The smallest size with that much area is <Size s={up.egc} />.
              </>
            ) : (
              <>No size in Table 310.16 has that much area.</>
            )}
          </p>
        )}
      </div>
      <div className={NOTE}>
        {up ? (
          <p data-src={GND}>
            An increase the ambient temperature or bundling corrections require doesn&apos;t count: only one made for another reason, such as
            voltage drop.
          </p>
        ) : (
          <p data-src={GND}>
            If the circuit wires are larger than the rating needs, for voltage drop say, the ground wire grows in proportion (250.122(B)):
            choose &ldquo;Yes, larger&rdquo; above, or let the{' '}
            <Link href="/calculators/wire-size-calculator" className={LINK}>
              wire size calculator
            </Link>{' '}
            size both.
          </p>
        )}
        <p data-src={OCPD}>
          The ratings offered are the standard ones of Table 240.6(A).{' '}
          <Link href="/methodology#grounding" className={LINK}>
            How these values are found
          </Link>
          .
        </p>
      </div>
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}

function GecOutcome({
  r,
  headingRef,
  shareUrl,
}: {
  r: GecResult;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  shareUrl: () => string;
}) {
  return (
    <section aria-labelledby="result-heading" className="mt-10 border-t-2 border-ink pt-6">
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="font-display text-[15px] font-semibold text-ink focus:outline-none">
        Grounding electrode conductor for <Size s={r.serviceSize} /> {MATERIAL_NAME[r.material]} service conductors
      </h2>
      <div className="mt-3 flex flex-wrap gap-x-10 gap-y-4" data-src={GND}>
        <div>
          <p className={BIG}>
            <Size s={r.gec.cu} />
          </p>
          <p className="mt-2 text-[17px] text-ink">copper</p>
        </div>
        <div>
          <p className={BIG}>
            <Size s={r.gec.alCca} />
          </p>
          <p className="mt-2 text-[17px] text-ink">or aluminum or copper-clad aluminum</p>
        </div>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full max-w-[38rem] border-collapse text-[15px]" data-src={GND}>
          <caption className="sr-only">The Table 250.66 row for this service conductor</caption>
          <tbody>
            <tr className="border-b border-cut-rule border-t-2 border-t-ink">
              <th scope="row" className="py-2 pr-4 text-left font-normal">
                Copper grounding electrode conductor
              </th>
              <td className="whitespace-nowrap py-2 pl-4 text-right font-mono tabular-nums">
                <Size s={r.gec.cu} />
              </td>
            </tr>
            <tr className="border-b border-cut-rule">
              <th scope="row" className="py-2 pr-4 text-left font-normal">
                Aluminum or copper-clad aluminum
              </th>
              <td className="whitespace-nowrap py-2 pl-4 text-right font-mono tabular-nums">
                <Size s={r.gec.alCca} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={BODY} data-src={GND}>
        <p>
          <strong>Table 250.66:</strong> the row is set by the largest ungrounded service-entrance conductor (or the equivalent area of a
          parallel set), here <Size s={r.serviceSize} /> {MATERIAL_NAME[r.material]}; the row gives the electrode conductor in either
          material.
        </p>
      </div>
      <div className={NOTE} data-src={GND}>
        <p>
          The values are those of NFPA&apos;s 2020 grounding fact sheet. A conductor that runs only to a rod, pipe, plate or
          concrete-encased electrode has rules of its own, which this calculator doesn&apos;t apply.{' '}
          <Link href="/methodology#grounding" className={LINK}>
            How these values are found
          </Link>
          .
        </p>
      </div>
      <ResultActions shareUrl={shareUrl} />
    </section>
  );
}
