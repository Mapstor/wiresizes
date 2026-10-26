'use client';

import { useEffect, useRef, useState } from 'react';

export const LINK_COPIED_STATUS = 'Link copied';
export const COPY_LINK_LABEL = 'Copy this link:';
const STATUS_MS = 3000;

/**
 * Share without a dialog: copy the link and say "Link copied" in a status element for 3 seconds; when the
 * clipboard is missing or refuses, show the link in a read-only field instead, focused with its text selected.
 * The field follows the current inputs and closes while they are invalid (Share is disabled then).
 */
export function useShareLink(getUrl: (() => string) | undefined, disabled: boolean) {
  const [status, setStatus] = useState('');
  const [fieldOpen, setFieldOpen] = useState(false);
  const [focusRequest, setFocusRequest] = useState(0);
  const [wasDisabled, setWasDisabled] = useState(disabled);
  const fieldRef = useRef<HTMLInputElement>(null);
  const timer = useRef<number | undefined>(undefined);

  if (disabled !== wasDisabled) {
    setWasDisabled(disabled);
    if (disabled) setFieldOpen(false);
  }

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (focusRequest === 0) return;
    fieldRef.current?.focus();
    fieldRef.current?.select();
  }, [focusRequest]);

  const share = async () => {
    if (!getUrl || disabled) return;
    const url = getUrl();
    window.clearTimeout(timer.current);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard not available');
      await navigator.clipboard.writeText(url);
      setFieldOpen(false);
      setStatus(LINK_COPIED_STATUS);
      timer.current = window.setTimeout(() => setStatus(''), STATUS_MS);
    } catch {
      setStatus('');
      setFieldOpen(true);
      setFocusRequest((n) => n + 1);
    }
  };

  const fieldUrl = fieldOpen && !disabled && getUrl ? getUrl() : null;

  return { status, share, fieldRef, fieldUrl };
}
