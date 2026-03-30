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
  ...props
}) {
  const base = [
    'inline-flex items-center justify-center gap-2',
    'px-5 py-2.5 rounded-lg',
    'font-semibold text-sm',
    'transition-all duration-200 ease-out',
    'active:scale-[0.97]',
    'cursor-pointer select-none',
    "font-['DM_Sans',sans-serif]",
    fullWidth ? 'w-full' : '',
    disabled || loading ? 'opacity-50 pointer-events-none' : '',
  ].join(' ');

  const variants = {
    primary: 'text-white',
    ghost: 'bg-transparent hover:bg-white/5 border',
    outline: 'bg-transparent hover:bg-white/5 border',
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--accent-primary)',
      boxShadow: '0 4px 14px rgba(249, 115, 22, 0.2)',
    },
    ghost: {
      color: 'var(--text-secondary)',
      borderColor: 'var(--border-subtle)',
    },
    outline: {
      color: 'var(--text-primary)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      style={variantStyles[variant] || variantStyles.primary}
      onMouseEnter={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.backgroundColor = 'var(--accent-primary-hover)';
          e.currentTarget.style.boxShadow = '0 6px 18px rgba(249, 115, 22, 0.3)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
          e.currentTarget.style.boxShadow = '0 4px 14px rgba(249, 115, 22, 0.2)';
        }
      }}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
