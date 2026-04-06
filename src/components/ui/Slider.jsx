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
          <label className="t-label">{label}</label>
          <span className="t-title3 tabular-nums" style={{ color: 'var(--color-accent)' }}>
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
            background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${percentage}%, var(--color-muted) ${percentage}%, var(--color-muted) 100%)`,
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
          background: var(--color-accent);
          border: 3px solid var(--color-bg);
          box-shadow: 0 0 0 2px var(--color-accent);
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
          background: var(--color-accent);
          border: 3px solid var(--color-bg);
          box-shadow: 0 0 0 2px var(--color-accent);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
