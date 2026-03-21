export default function PageShell({ children, className = '' }) {
  return (
    <div className={`mx-auto w-full max-w-md px-7 py-8 sm:px-8 sm:py-10 ${className}`}>
      {children}
    </div>
  )
}
