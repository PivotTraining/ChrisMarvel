const variantStyles = {
  beginner: {
    backgroundColor: 'var(--color-success-tint)',
    color: 'var(--color-success)',
    borderColor: 'rgba(34, 197, 94, 0.25)',
  },
  intermediate: {
    backgroundColor: 'var(--color-info-tint)',
    color: 'var(--color-info)',
    borderColor: 'rgba(59, 130, 246, 0.25)',
  },
  elite: {
    backgroundColor: 'var(--color-accent-tint)',
    color: 'var(--color-accent)',
    borderColor: 'rgba(255, 107, 53, 0.25)',
  },
  default: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    color: 'var(--color-text-sec)',
    borderColor: 'var(--color-border)',
  },
};

export default function Badge({
  children,
  variant = 'default',
  className = '',
  ...props
}) {
  const style = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${className}`}
      style={style}
      {...props}
    >
      {children}
    </span>
  );
}
