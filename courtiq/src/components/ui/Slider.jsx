export default function Slider({
  label,
  value,
  onChange,
  min = 1,
  max = 10,
}) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="text-text-secondary text-sm">{label}</label>
          <span className="text-accent-primary font-semibold text-sm tabular-nums">
            {value}
          </span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className="
          w-full h-2 rounded-full appearance-none cursor-pointer
          bg-bg-surface-hover
          accent-accent-primary
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-accent-primary
          [&::-webkit-slider-thumb]:shadow-lg
          [&::-webkit-slider-thumb]:shadow-accent-primary/30
          [&::-webkit-slider-thumb]:transition-transform
          [&::-webkit-slider-thumb]:duration-150
          [&::-webkit-slider-thumb]:hover:scale-110
          [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:w-5
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-0
          [&::-moz-range-thumb]:bg-accent-primary
          [&::-moz-range-thumb]:shadow-lg
          [&::-moz-range-thumb]:shadow-accent-primary/30
          [&::-moz-range-track]:bg-bg-surface-hover
          [&::-moz-range-track]:rounded-full
          [&::-moz-range-track]:h-2
        "
      />
    </div>
  );
}
