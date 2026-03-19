import { useState } from 'react';

export default function Input({
  label,
  error,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  className = '',
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium"
          style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all duration-200"
        style={{
          backgroundColor: 'var(--bg-surface)',
          color: 'var(--text-primary)',
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
      />
      {error && (
        <p className="text-xs" style={{ color: 'var(--danger)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
