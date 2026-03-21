export default function Skeleton({ className = '', count = 1 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={`animate-pulse rounded-xl bg-bg-card border border-border ${className}`}
        >
          <div className="p-4 space-y-3">
            <div className="h-3 bg-bg-section rounded-lg w-1/3" />
            <div className="h-4 bg-bg-section rounded-lg w-2/3" />
            <div className="flex gap-3">
              <div className="h-3 bg-bg-section rounded-lg w-12" />
              <div className="h-3 bg-bg-section rounded-lg w-12" />
              <div className="h-3 bg-bg-section rounded-lg w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
