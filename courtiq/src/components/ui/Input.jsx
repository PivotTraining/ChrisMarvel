export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <input
        className={`
          w-full rounded-xl bg-bg-card border border-border
          px-4 py-3 text-sm text-text-primary
          placeholder:text-text-muted
          focus:outline-none focus:border-blue-border focus:ring-1 focus:ring-blue-border
          transition-colors duration-200
          ${error ? 'border-danger' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-xs text-danger">{error}</p>
      )}
    </div>
  )
}
