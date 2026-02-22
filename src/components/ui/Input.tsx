import { forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: React.ReactNode;
  suffix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, icon, suffix, className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'w-full px-4 py-3 border rounded-lg text-neutral-900 font-mono text-lg',
              'placeholder:text-neutral-400',
              'focus:outline-none focus:ring-2 focus:border-primary-500 transition-shadow',
              error
                ? 'border-red-300 focus:ring-red-500'
                : 'border-neutral-300 focus:ring-primary-500',
              icon && 'pl-10',
              suffix && 'pr-16',
              className
            )}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">
              {suffix}
            </div>
          )}
        </div>
        {hint && !error && (
          <p className="text-sm text-neutral-500">{hint}</p>
        )}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';