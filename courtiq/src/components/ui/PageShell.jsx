export default function PageShell({ children, className = '' }) {
  return (
    <div className={`mx-auto w-full max-w-md px-6 py-6 sm:px-7 sm:py-8 ${className}`}>
      {children}
    </div>
  )
}
