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
  const cssClass = variant === 'primary'
    ? 'btn-primary'
    : variant === 'ghost'
      ? 'btn-ghost'
      : 'btn-outline';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${cssClass} ${className}`}
      style={{
        width: fullWidth ? '100%' : 'auto',
        ...styleProp,
      }}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
