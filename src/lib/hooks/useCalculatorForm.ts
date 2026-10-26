'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

/**
 * A field's error message shows once the field loses focus, or for every invalid field once Calculate is pressed.
 * Inputs mark themselves with aria-invalid only while their message shows.
 */
export function useFieldErrors() {
  const [touched, setTouched] = useState<ReadonlySet<string>>(() => new Set());
  const [revealed, setRevealed] = useState(false);

  const touch = useCallback((name: string) => {
    setTouched((prev) => (prev.has(name) ? prev : new Set(prev).add(name)));
  }, []);

  /** Whether field `name` shows its state: it lost focus, or Calculate was pressed. */
  const visible = (name: string): boolean => revealed || touched.has(name);

  /** The message to show under field `name`, or undefined. */
  const shown = (name: string, error: string | null | undefined): string | undefined =>
    error && visible(name) ? error : undefined;

  /** Calculate with invalid inputs: show every message, then focus the first invalid field in `container`. */
  const revealAll = useCallback((container: HTMLElement | null) => {
    flushSync(() => setRevealed(true));
    container?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, []);

  const reset = useCallback(() => {
    setTouched(new Set());
    setRevealed(false);
  }, []);

  return { touch, visible, shown, revealAll, reset };
}

/**
 * Calculate with valid inputs: focus the results heading (tabIndex -1) and bring it into view, smoothly unless the
 * reader prefers reduced motion ('instant', because 'auto' would follow the page's scroll-behavior: smooth).
 */
export function focusResults(heading: HTMLElement | null) {
  if (!heading) return;
  heading.focus({ preventScroll: true });
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  heading.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'instant' : 'smooth' });
}

/**
 * Share-link state. A shared link's query applies once after mount, so the server render and hydration use the
 * defaults. The address bar is rewritten (history.replaceState) only after a user change, so the first render
 * never overwrites a shared link.
 */
export function useUrlState(query: string, apply: (params: URLSearchParams) => void) {
  const changed = useRef(false);
  const applyRef = useRef(apply);

  useEffect(() => {
    applyRef.current = apply;
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if ([...params.keys()].length > 0) applyRef.current(params);
  }, []);

  useEffect(() => {
    if (!changed.current) return;
    // debounced: Safari limits how often a page may call the History API
    const timer = window.setTimeout(() => {
      const { pathname, hash } = window.location;
      window.history.replaceState(window.history.state, '', `${pathname}${query ? `?${query}` : ''}${hash}`);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  /** Call from every handler of a user change (and from Reset). */
  const markChanged = useCallback(() => {
    changed.current = true;
  }, []);

  const shareUrl = useCallback(
    () => `${window.location.origin}${window.location.pathname}${query ? `?${query}` : ''}`,
    [query],
  );

  return { markChanged, shareUrl };
}
