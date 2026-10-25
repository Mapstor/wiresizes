import { forwardRef, useId } from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, options, placeholder, className, id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const noteId = `${selectId}-note`;
    return (
      <div className="space-y-1 min-w-0">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <div className="relative min-w-0">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={error ? true : undefined}
            aria-describedby={hint || error ? noteId : undefined}
            className={clsx(
              'w-full min-w-0 px-4 py-3 border rounded-lg text-neutral-900 font-medium',
              'bg-white appearance-none cursor-pointer',
              'focus:outline-none focus:ring-2 focus:border-primary-500 transition-shadow',
              error
                ? 'border-red-300 focus:ring-red-500'
                : 'border-neutral-300 focus:ring-primary-500',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
        </div>
        {hint && !error && (
          <p id={noteId} className="text-sm text-neutral-500">{hint}</p>
        )}
        {error && (
          <p id={noteId} className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';