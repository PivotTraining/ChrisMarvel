export default function PageWrapper({ children }) {
  return (
    <div className="min-h-screen overflow-y-auto" style={{ padding: 'var(--space-3) var(--space-3) 6rem' }}>
      <div className="mx-auto max-w-lg">
        {children}
      </div>
    </div>
  )
}
