export default function PageShell({ children, className = '' }) {
  return (
    <div className={`mx-auto w-full max-w-md px-4 py-6 sm:px-5 sm:py-8 ${className}`}>
      {children}
    </div>
  )
}
