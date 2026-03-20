export default function Card({ children, className = '', onClick }) {
  return (
    <div
      className={`rounded-2xl bg-bg-card border border-border p-5 ${onClick ? 'cursor-pointer card-hover' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
