import { Star } from 'lucide-react';

export default function StarRating({
  value = 0,
  onChange,
  max = 5,
  size = 24,
  readOnly = false,
  label,
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          className="text-sm font-medium"
          style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}
        >
          {label}
        </label>
      )}
      <div className="flex gap-1">
        {Array.from({ length: max }).map((_, i) => {
          const starValue = i + 1;
          const filled = starValue <= value;

          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (!readOnly && onChange) {
                  onChange(starValue === value ? 0 : starValue);
                }
              }}
              className={`p-0.5 transition-transform duration-150 ${
                readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'
              }`}
              style={{ background: 'none', border: 'none' }}
              disabled={readOnly}
              aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
            >
              <Star
                size={size}
                fill={filled ? 'var(--accent-primary)' : 'none'}
                stroke={filled ? 'var(--accent-primary)' : 'var(--text-muted)'}
                strokeWidth={1.5}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
