// Calculator form fields and share links. A number field keeps its text, so an empty or half-typed field stays
// as the reader typed it; a share link's value applies only when it is a finite number or one of the field's choices.

/** A number field's text as a number; empty text is NaN. */
export function fieldNumber(text: string): number {
  return text.trim() === '' ? Number.NaN : Number(text);
}

/** The first of `keys` whose query value is a finite number, as text; null when none is. */
export function numberParam(params: URLSearchParams, ...keys: string[]): string | null {
  for (const key of keys) {
    const raw = params.get(key);
    if (raw !== null && raw.trim() !== '' && Number.isFinite(Number(raw))) return raw.trim();
  }
  return null;
}

/** The query value of `key` when it is one of `choices`, else null. */
export function choiceParam<T extends string | number>(params: URLSearchParams, key: string, choices: readonly T[]): T | null {
  const raw = params.get(key);
  if (raw === null) return null;
  return choices.find((choice) => String(choice) === raw) ?? null;
}

/** Query string of the given values in order; null, undefined and empty values are left out. */
export function buildQuery(values: Record<string, string | number | boolean | null | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value === null || value === undefined || value === '') continue;
    params.set(key, String(value));
  }
  return params.toString();
}

/**
 * A list of numbers as typed: "1500, 1500, 500", "1500 1500 500" or "1,500, 500". A token in thousands form ("1,500")
 * is one number; any other comma separates two. NaN for a token that is not a number.
 */
export function parseNumberList(text: string): number[] {
  return text
    .split(/[;\s]+|,\s+/)
    .filter((t) => t !== '')
    .flatMap((t) =>
      /^\d{1,3}(,\d{3})+(\.\d+)?$/.test(t)
        ? [Number(t.replace(/,/g, ''))]
        : t
            .split(',')
            .filter((u) => u !== '')
            .map(Number),
    );
}
