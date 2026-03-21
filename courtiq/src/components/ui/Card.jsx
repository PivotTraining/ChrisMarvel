export default function Card({ children, className = '', onClick }) {
  return (
    <div
      className={`rounded-2xl bg-bg-card border border-border p-5 transition-transform duration-150 ${onClick ? 'cursor-pointer card-hover active:scale-[0.98]' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
