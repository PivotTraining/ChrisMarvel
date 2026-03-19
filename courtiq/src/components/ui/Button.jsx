import { Loader2 } from 'lucide-react';

const variantStyles = {
  primary:
    'bg-accent-primary hover:bg-accent-primary-hover text-white font-semibold shadow-lg shadow-accent-primary/20',
  ghost:
    'bg-transparent hover:bg-bg-surface-hover text-text-secondary hover:text-text-primary',
  outline:
    'bg-transparent border border-border-subtle hover:border-border-active text-text-secondary hover:text-text-primary',
};

export default function Button({
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  children,
  onClick,
  type = 'button',
  className = '',
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl px-5 py-3 text-sm font-medium
        transition-all duration-200 ease-out
        active:scale-[0.97]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50
        ${variantStyles[variant] || variantStyles.primary}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed active:scale-100' : 'cursor-pointer'}
        ${className}
      `}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
