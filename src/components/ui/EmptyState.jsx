import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title = 'Nothing here yet',
  description,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}>
      {Icon && (
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
          style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)' }}
        >
          <Icon className="w-7 h-7" style={{ color: 'var(--accent-primary)' }} />
        </div>
      )}
      <h3
        className="text-xl mb-2"
        style={{
          color: 'var(--text-primary)',
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          className="text-sm max-w-xs mb-6"
          style={{
            color: 'var(--text-muted)',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
