const variants = {
  primary: 'bg-blue text-white hover:bg-blue-dark btn-glow',
  secondary: 'bg-bg-card border border-border text-text-primary hover:border-blue-border',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-card',
  danger: 'bg-danger/10 text-danger hover:bg-danger/20',
}

const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-sm',
  lg: 'px-6 py-3.5 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl font-semibold
        transition-all duration-200
        disabled:opacity-50 disabled:pointer-events-none
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
