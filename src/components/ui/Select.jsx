import { ChevronDown } from 'lucide-react';

export default function Select({
  label,
  error,
  id,
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  disabled = false,
  className = '',
  ...props
}) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="t-label">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="input-base w-full pr-10 appearance-none cursor-pointer"
          style={{
            color: value ? 'var(--color-text)' : 'var(--color-text-sec)',
            borderColor: error ? 'var(--color-danger)' : undefined,
            opacity: disabled ? 0.5 : 1,
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const optValue = typeof opt === 'string' ? opt : opt.value;
            const optLabel = typeof opt === 'string' ? opt : opt.label;
            return (
              <option
                key={optValue}
                value={optValue}
                style={{
                  backgroundColor: 'var(--color-card)',
                  color: 'var(--color-text)',
                }}
              >
                {optLabel}
              </option>
            );
          })}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: 'var(--color-text-sec)' }}
        />
      </div>
      {error && (
        <p className="t-caption" style={{ color: 'var(--color-danger)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
