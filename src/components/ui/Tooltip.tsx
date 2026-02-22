'use client';

import { useState } from 'react';
import { clsx } from 'clsx';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          role="tooltip"
          className={clsx(
            'absolute z-50 px-3 py-2 text-sm text-white bg-neutral-900 rounded-lg shadow-lg',
            'whitespace-nowrap animate-fade-in',
            {
              'bottom-full left-1/2 -translate-x-1/2 mb-2': position === 'top',
              'top-full left-1/2 -translate-x-1/2 mt-2': position === 'bottom',
              'right-full top-1/2 -translate-y-1/2 mr-2': position === 'left',
              'left-full top-1/2 -translate-y-1/2 ml-2': position === 'right',
            }
          )}
        >
          {content}
          <div
            className={clsx('absolute w-2 h-2 bg-neutral-900 rotate-45', {
              'top-full left-1/2 -translate-x-1/2 -mt-1': position === 'top',
              'bottom-full left-1/2 -translate-x-1/2 -mb-1': position === 'bottom',
              'left-full top-1/2 -translate-y-1/2 -ml-1': position === 'left',
              'right-full top-1/2 -translate-y-1/2 -mr-1': position === 'right',
            })}
          />
        </div>
      )}
    </div>
  );
}