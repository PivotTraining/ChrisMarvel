const variantStyles = {
  beginner: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    color: 'var(--success)',
    borderColor: 'rgba(34, 197, 94, 0.25)',
  },
  intermediate: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    color: 'var(--accent-secondary)',
    borderColor: 'rgba(59, 130, 246, 0.25)',
  },
  elite: {
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    color: 'var(--accent-primary)',
    borderColor: 'rgba(249, 115, 22, 0.25)',
  },
  default: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    color: 'var(--text-secondary)',
    borderColor: 'var(--border-subtle)',
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
      style={{
        ...style,
        fontFamily: "'DM Sans', sans-serif",
      }}
      {...props}
    >
      {children}
    </span>
  );
}
