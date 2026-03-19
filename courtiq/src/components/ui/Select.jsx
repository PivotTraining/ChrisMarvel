import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select(
  { label, error, options = [], placeholder, className = '', ...rest },
  ref,
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-text-secondary text-sm mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full appearance-none rounded-xl bg-bg-surface border border-border-subtle
            px-4 py-3 pr-10 text-sm text-text-primary
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-border-active
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-danger focus:ring-danger/50' : ''}
            ${className}
          `}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled className="text-text-muted">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
      </div>
      {error && (
        <p className="text-danger text-xs mt-1">{error}</p>
      )}
    </div>
  );
});

export default Select;
