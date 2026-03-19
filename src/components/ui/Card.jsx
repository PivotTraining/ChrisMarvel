const paddingMap = {
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

export default function Card({
  children,
  padding = 'md',
  glass = false,
  hover = false,
  onClick,
  className = '',
  ...props
}) {
  const base = [
    'rounded-xl',
    'transition-all duration-200 ease-out',
    paddingMap[padding] || paddingMap.md,
    hover || onClick ? 'cursor-pointer' : '',
    className,
  ].join(' ');

  if (glass) {
    return (
      <div
        className={`${base}`}
        onClick={onClick}
        style={{
          background: 'rgba(19, 19, 26, 0.8)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--border-subtle)',
        }}
        onMouseEnter={(e) => {
          if (hover || onClick) {
            e.currentTarget.style.background = 'rgba(26, 26, 37, 0.85)';
            e.currentTarget.style.borderColor = 'var(--border-active)';
          }
        }}
        onMouseLeave={(e) => {
          if (hover || onClick) {
            e.currentTarget.style.background = 'rgba(19, 19, 26, 0.8)';
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
          }
        }}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={base}
      onClick={onClick}
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
      }}
      onMouseEnter={(e) => {
        if (hover || onClick) {
          e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
          e.currentTarget.style.borderColor = 'var(--border-active)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover || onClick) {
          e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
}
