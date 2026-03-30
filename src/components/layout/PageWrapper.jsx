export default function PageWrapper({ children }) {
  return (
    <div className="min-h-screen overflow-y-auto" style={{ padding: '1.25rem 1.25rem 6rem' }}>
      <div className="mx-auto max-w-lg">
        {children}
      </div>
    </div>
  )
}
