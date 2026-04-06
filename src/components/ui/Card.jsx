const paddingMap = {
  sm: '16px',
  md: '20px',
  lg: '24px',
};

export default function Card({
  children,
  padding = 'md',
  glass = false,
  hover = false,
  onClick,
  className = '',
  style: styleProp,
  ...props
}) {
  const interactive = !!(hover || onClick);

  const baseStyle = {
    borderRadius: 'var(--radius-card)',
    padding: paddingMap[padding] || paddingMap.md,
    ...(glass
      ? {
          background: 'rgba(26, 29, 46, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--color-border)',
        }
      : {
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
        }),
    ...styleProp,
  };

  return (
    <div
      className={`${interactive ? 'card-interactive' : ''} ${className}`}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.() } } : undefined}
      style={baseStyle}
      {...props}
    >
      {children}
    </div>
  );
}
