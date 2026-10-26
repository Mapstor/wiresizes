'use client';

import { ArrowLeft } from 'lucide-react';

// The 404 page's "Go Back" button: the only part of not-found.tsx that needs the browser.
export function GoBackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
    >
      <ArrowLeft className="w-5 h-5" />
      Go Back
    </button>
  );
}
