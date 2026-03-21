export default function PageShell({ children, className = '' }) {
  return (
    <div className={`mx-auto w-full max-w-md px-8 py-10 sm:px-8 sm:py-10 ${className}`}>
      {children}
    </div>
  )
}
