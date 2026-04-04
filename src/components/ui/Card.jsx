const paddingMap = {
  sm: '14px',
  md: '18px',
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
    borderRadius: '20px',
    padding: paddingMap[padding] || paddingMap.md,
    transition: 'background 0.2s ease, border-color 0.2s ease, transform 0.15s ease',
    cursor: interactive ? 'pointer' : 'default',
    WebkitTapHighlightColor: interactive ? 'transparent' : undefined,
    touchAction: interactive ? 'manipulation' : undefined,
    userSelect: interactive ? 'none' : undefined,
    WebkitUserSelect: interactive ? 'none' : undefined,
  };

  const glassStyle = {
    ...baseStyle,
    background: 'rgba(26, 29, 46, 0.75)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid var(--color-border)',
  };

  const solidStyle = {
    ...baseStyle,
    background: 'var(--color-card)',
    border: '1px solid var(--color-border)',
  };

  const finalStyle = { ...(glass ? glassStyle : solidStyle), ...styleProp };

  const handleMouseEnter = (e) => {
    if (!interactive) return;
    e.currentTarget.style.borderColor = 'var(--border-active)';
    if (!glass) e.currentTarget.style.background = 'var(--color-muted)';
  };
  const handleMouseLeave = (e) => {
    if (!interactive) return;
    e.currentTarget.style.borderColor = 'var(--color-border)';
    if (!glass) e.currentTarget.style.background = 'var(--color-card)';
  };
  const handleMouseDown = (e) => { if (interactive) e.currentTarget.style.transform = 'scale(0.98)' };
  const handleMouseUp = (e) => { if (interactive) e.currentTarget.style.transform = 'scale(1)' };

  return (
    <div
      className={className}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.() } } : undefined}
      style={finalStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      {...props}
    >
      {children}
    </div>
  );
}
