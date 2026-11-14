'use client';

// Copy link and Print under a calculator's result in the look (DESIGN.md "Calculator"; D-11): the link goes through
// useShareLink, so a refused clipboard opens a read-only field with the link selected instead of failing, and "Link
// copied" is announced in a status line. No dialog, ever.
import { useId } from 'react';
import { BUTTON_SECONDARY } from '@/components/look/Form';
import { COPY_LINK_LABEL, useShareLink } from '@/lib/hooks/useShareLink';

export function ResultActions({ shareUrl }: { shareUrl: () => string }) {
  const { status, share, fieldRef, fieldUrl } = useShareLink(shareUrl, false);
  const fieldId = useId();
  return (
    <div className="mt-6 print:hidden">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={share} className={BUTTON_SECONDARY}>
          Copy link to this result
        </button>
        <button type="button" onClick={() => window.print()} className={BUTTON_SECONDARY}>
          Print
        </button>
        <p role="status" className="text-[15px] font-semibold text-ink">
          {status}
        </p>
      </div>
      {fieldUrl && (
        <div className="mt-3 max-w-[38rem]">
          <label htmlFor={fieldId} className="block font-display text-[15px] font-semibold text-ink">
            {COPY_LINK_LABEL}
          </label>
          <input
            id={fieldId}
            ref={fieldRef}
            type="text"
            readOnly
            value={fieldUrl}
            className="mt-2 h-11 w-full rounded-[6px] border border-[#8f877f] bg-white px-3 font-mono text-[14px] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ink"
          />
        </div>
      )}
    </div>
  );
}
