import { useState } from 'react';
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
  const [focused, setFocused] = useState(false);
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium"
          style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full px-3.5 py-2.5 pr-10 rounded-lg text-sm outline-none appearance-none transition-all duration-200 cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-surface)',
            color: value ? 'var(--text-primary)' : 'var(--text-muted)',
            border: error
              ? '1px solid var(--danger)'
              : focused
                ? '1px solid var(--accent-primary)'
                : '1px solid var(--border-subtle)',
            boxShadow: focused && !error
              ? '0 0 0 3px rgba(249, 115, 22, 0.15)'
              : error
                ? '0 0 0 3px rgba(239, 68, 68, 0.15)'
                : 'none',
            fontFamily: "'DM Sans', sans-serif",
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
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                }}
              >
                {optLabel}
              </option>
            );
          })}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: 'var(--text-muted)' }}
        />
      </div>
      {error && (
        <p className="text-xs" style={{ color: 'var(--danger)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
