const paddingMap = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export default function Card({
  children,
  className = '',
  glass = false,
  padding = 'md',
  onClick,
}) {
  const base = glass
    ? 'backdrop-blur-xl bg-white/5 border border-white/10'
    : 'bg-bg-surface border border-border-subtle';

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(e); } : undefined}
      className={`
        rounded-xl
        transition-colors duration-200
        hover:bg-bg-surface-hover
        ${base}
        ${paddingMap[padding] || paddingMap.md}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
