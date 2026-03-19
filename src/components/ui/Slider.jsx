export default function Slider({
  label,
  value = 5,
  onChange,
  min = 1,
  max = 10,
  step = 1,
  className = '',
  ...props
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            className="text-sm font-medium"
            style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}
          >
            {label}
          </label>
          <span
            className="text-lg font-bold tabular-nums"
            style={{ color: 'var(--accent-primary)', fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {value}
          </span>
        </div>
      )}
      <div className="relative w-full">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="w-full h-2 rounded-full appearance-none cursor-pointer outline-none"
          style={{
            background: `linear-gradient(to right, var(--accent-primary) 0%, var(--accent-primary) ${percentage}%, var(--bg-surface-hover) ${percentage}%, var(--bg-surface-hover) 100%)`,
          }}
          {...props}
        />
      </div>
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--accent-primary);
          border: 3px solid var(--bg-primary);
          box-shadow: 0 0 0 2px var(--accent-primary);
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--accent-primary);
          border: 3px solid var(--bg-primary);
          box-shadow: 0 0 0 2px var(--accent-primary);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
