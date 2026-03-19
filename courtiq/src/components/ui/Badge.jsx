const variantStyles = {
  beginner: 'bg-success/15 text-success border-success/20',
  intermediate: 'bg-accent-secondary/15 text-accent-secondary border-accent-secondary/20',
  advanced: 'bg-accent-primary/15 text-accent-primary border-accent-primary/20',
  elite: 'bg-accent-primary/15 text-accent-primary border-accent-primary/20',
  default: 'bg-white/10 text-text-secondary border-white/10',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center
        rounded-full border px-2.5 py-0.5
        text-xs font-medium leading-5
        ${variantStyles[variant] || variantStyles.default}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
