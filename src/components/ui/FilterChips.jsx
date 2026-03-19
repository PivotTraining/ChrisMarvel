export default function FilterChips({
  options = [],
  value,
  onChange,
  className = '',
}) {
  return (
    <div
      className={`flex gap-2 overflow-x-auto hide-scrollbar pb-1 ${className}`}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {options.map((option) => {
        const optValue = typeof option === 'string' ? option : option.value;
        const optLabel = typeof option === 'string' ? option : option.label;
        const isActive = Array.isArray(value)
          ? value.includes(optValue)
          : value === optValue;

        return (
          <button
            key={optValue}
            type="button"
            onClick={() => onChange?.(optValue)}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer active:scale-[0.97] whitespace-nowrap border"
            style={{
              backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
              color: isActive ? '#fff' : 'var(--text-secondary)',
              borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-subtle)',
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: isActive ? '0 2px 8px rgba(249, 115, 22, 0.25)' : 'none',
            }}
          >
            {optLabel}
          </button>
        );
      })}
    </div>
  );
}
