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
          style={{ backgroundColor: 'var(--color-accent-tint)' }}
        >
          <Icon className="w-7 h-7" style={{ color: 'var(--color-accent)' }} />
        </div>
      )}
      <h3 className="t-title3 mb-2" style={{ color: 'var(--color-text)' }}>
        {title}
      </h3>
      {description && (
        <p className="t-body max-w-xs mb-6" style={{ color: 'var(--color-text-sec)' }}>
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
