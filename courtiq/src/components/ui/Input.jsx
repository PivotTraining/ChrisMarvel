import { forwardRef } from 'react';

const Input = forwardRef(function Input({ label, error, className = '', ...rest }, ref) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-text-secondary text-sm mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          w-full rounded-xl bg-bg-surface border border-border-subtle
          px-4 py-3 text-sm text-text-primary
          placeholder:text-text-muted
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-border-active
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-danger focus:ring-danger/50' : ''}
          ${className}
        `}
        {...rest}
      />
      {error && (
        <p className="text-danger text-xs mt-1">{error}</p>
      )}
    </div>
  );
});

export default Input;
