import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  style: styleProp,
  ...props
}) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.5 : 1,
    fontFamily: 'inherit',
    transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, background 0.2s ease',
    width: fullWidth ? '100%' : 'auto',
    letterSpacing: '-0.2px',
    border: 'none',
  };

  const primaryStyle = {
    ...baseStyle,
    padding: '14px 22px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))',
    color: 'white',
    fontSize: '16px',
    fontWeight: 800,
    boxShadow: '0 4px 16px rgba(255, 107, 53, 0.35)',
    minHeight: '48px',
  };

  const ghostStyle = {
    ...baseStyle,
    padding: '12px 18px',
    borderRadius: '14px',
    background: 'transparent',
    color: 'var(--color-text-sec)',
    border: '1px solid var(--color-border)',
    fontSize: '15px',
    fontWeight: 600,
  };

  const outlineStyle = {
    ...baseStyle,
    padding: '12px 18px',
    borderRadius: '14px',
    background: 'transparent',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
    fontSize: '15px',
    fontWeight: 600,
  };

  const finalStyle = isPrimary ? primaryStyle : isGhost ? ghostStyle : outlineStyle;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={className}
      style={{ ...finalStyle, ...styleProp }}
      onMouseDown={(e) => { if (!disabled && !loading) e.currentTarget.style.transform = 'scale(0.97)' }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
        if (isPrimary && !disabled) {
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 107, 53, 0.35)'
        }
        if ((isGhost || isOutline) && !disabled) {
          e.currentTarget.style.background = 'transparent'
        }
      }}
      onMouseEnter={(e) => {
        if (isPrimary && !disabled) {
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.45)'
        }
        if ((isGhost || isOutline) && !disabled) {
          e.currentTarget.style.background = 'var(--color-muted)'
        }
      }}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
