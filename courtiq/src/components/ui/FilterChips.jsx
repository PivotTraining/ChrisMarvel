export default function FilterChips({ options = [], selected, onChange }) {
  return (
    <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1">
      {options.map((opt) => {
        const isActive = selected === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange?.(opt.value)}
            className={`
              flex-shrink-0 rounded-full px-4 py-1.5
              text-sm font-medium
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50
              cursor-pointer
              ${
                isActive
                  ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/20'
                  : 'bg-transparent border border-border-subtle text-text-secondary hover:border-border-active hover:text-text-primary'
              }
            `}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
