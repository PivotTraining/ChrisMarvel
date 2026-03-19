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
    'font-medium text-sm',
    'transition-all duration-200 ease-out',
    'active:scale-[0.97]',
    'cursor-pointer select-none',
    'font-[\'DM_Sans\',sans-serif]',
    fullWidth ? 'w-full' : '',
    disabled || loading ? 'opacity-50 pointer-events-none' : '',
  ].join(' ');

  const variants = {
    primary: 'text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30',
    ghost: 'bg-transparent hover:bg-white/5 border',
    outline: 'bg-transparent hover:bg-white/5 border',
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--accent-primary)',
      '--hover-bg': 'var(--accent-primary-hover)',
    },
    ghost: {
      color: 'var(--text-secondary)',
      borderColor: 'var(--border-subtle)',
    },
    outline: {
      color: 'var(--text-primary)',
      borderColor: 'var(--border-subtle)',
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
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
        }
      }}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
