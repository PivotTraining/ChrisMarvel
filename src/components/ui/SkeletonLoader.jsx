function SkeletonBlock({ className = '', style = {} }) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className}`}
      style={{
        backgroundColor: 'var(--bg-surface-hover)',
        ...style,
      }}
    />
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div
      className={`rounded-xl p-5 flex flex-col gap-3 ${className}`}
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <SkeletonBlock className="h-4 w-2/3" />
      <SkeletonBlock className="h-3 w-full" />
      <SkeletonBlock className="h-3 w-4/5" />
      <div className="flex gap-2 mt-2">
        <SkeletonBlock className="h-6 w-16 rounded-full" />
        <SkeletonBlock className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonList({ rows = 4, className = '' }) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-xl p-4"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <SkeletonBlock className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <SkeletonBlock className="h-3.5 w-1/2" />
            <SkeletonBlock className="h-3 w-3/4" />
          </div>
          <SkeletonBlock className="h-6 w-12 rounded-md flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}

export default function SkeletonLoader({ variant = 'card', count = 1, rows, className = '' }) {
  if (variant === 'list') {
    return <SkeletonList rows={rows || 4} className={className} />;
  }

  return (
    <div className={`grid gap-4 ${count > 1 ? 'grid-cols-1 sm:grid-cols-2' : '' } ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
