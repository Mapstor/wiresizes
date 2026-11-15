// The look's form controls (WSZ-006, DESIGN.md "Calculator"): labels in Archivo 600, inputs and selects with a Strong Rule
// border that turns 2 px ink on error, choices as a row of ink-bordered segments with the chosen one filled, one ink
// button per form. No shadows, 6 px corners, 16 px input text (phones zoom below it), and the look's focus outline.
import type { ReactNode } from 'react';
import { clsx } from 'clsx';

const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ink';

export const FIELD_LABEL = 'block font-display text-[15px] font-semibold leading-snug text-ink';
export const FIELD_HINT = 'mt-1.5 text-[14px] leading-snug text-[#555555]';
export const FIELD_ERROR = 'mt-1.5 text-[14px] font-semibold leading-snug text-ink';
const CONTROL =
  'h-11 w-full rounded-[6px] bg-white px-3 font-mono text-[16px] text-ink tabular-nums [font-variant-numeric:tabular-nums] ' + FOCUS;
const BORDER_OK = 'border border-[#8f877f]';
const BORDER_ERROR = 'border-2 border-ink';

export const BUTTON_PRIMARY =
  'inline-flex h-11 items-center justify-center rounded-[6px] bg-ink px-5 font-display text-[16px] font-semibold text-white hover:bg-cut-graphite ' +
  FOCUS;
export const BUTTON_SECONDARY =
  'inline-flex h-11 items-center justify-center rounded-[6px] border border-ink bg-white px-4 font-display text-[15px] font-semibold text-ink hover:bg-ink hover:text-white ' +
  FOCUS;

/** A field: its label, the control, a hint, and the error message in place of the hint while it shows. */
export function Field({
  id,
  label,
  hint,
  error,
  children,
  className,
}: {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={FIELD_LABEL}>
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${id}-error`} className={FIELD_ERROR}>
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className={FIELD_HINT}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** The ids a control names in aria-describedby: its error while it shows, otherwise its hint. */
export function describedBy(id: string, error: string | undefined, hasHint: boolean): string | undefined {
  if (error) return `${id}-error`;
  return hasHint ? `${id}-hint` : undefined;
}

export function TextInput({
  id,
  value,
  onChange,
  onBlur,
  error,
  describedById,
  inputMode = 'decimal',
  className,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  describedById?: string;
  /** 'text' for a list of numbers: a phone's decimal pad has no comma key. */
  inputMode?: 'decimal' | 'numeric' | 'text';
  className?: string;
}) {
  return (
    <input
      id={id}
      type="text"
      inputMode={inputMode}
      autoComplete="off"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedById}
      className={clsx(CONTROL, error ? BORDER_ERROR : BORDER_OK, className)}
    />
  );
}

export function SelectInput({
  id,
  value,
  onChange,
  children,
  describedById,
  error,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  describedById?: string;
  /** A choice that conflicts with another field: marked invalid like a text field, so Calculate can focus it. */
  error?: string;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedById}
        className={clsx(CONTROL, error ? BORDER_ERROR : BORDER_OK, 'appearance-none pr-10')}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 12 8"
        width="12"
        height="8"
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
      >
        <path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="#111111" strokeWidth="1.6" />
      </svg>
    </div>
  );
}

/** A row of choices: radio inputs drawn as ink-bordered segments, the chosen one filled with ink. */
export function Segmented<T extends string>({
  name,
  legend,
  value,
  options,
  onChange,
  legendClassName = FIELD_LABEL,
  srLegend = false,
}: {
  name: string;
  legend: ReactNode;
  value: T;
  options: readonly { value: T; label: ReactNode }[];
  onChange: (value: T) => void;
  legendClassName?: string;
  /** The legend for screen readers only, where a visible label sits beside the control. */
  srLegend?: boolean;
}) {
  return (
    <fieldset>
      <legend className={srLegend ? 'sr-only' : legendClassName}>{legend}</legend>
      <div className={clsx('inline-flex flex-wrap rounded-[6px] border border-ink', !srLegend && 'mt-2')}>
        {options.map((option, i) => (
          <label key={option.value} className="relative">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span
              className={clsx(
                'flex h-[42px] cursor-pointer select-none items-center px-2.5 font-display text-[15px] font-semibold text-ink sm:px-3.5',
                'peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2',
                'peer-focus-visible:outline-offset-[3px] peer-focus-visible:outline-ink',
                i === 0 && 'rounded-l-[5px]',
                i === options.length - 1 && 'rounded-r-[5px]',
                i > 0 && 'border-l border-ink',
              )}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
