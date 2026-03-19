export default function PageWrapper({ children }) {
  return (
    <div className="min-h-screen overflow-y-auto px-4 pt-4 pb-24">
      <div className="mx-auto max-w-lg">
        {children}
      </div>
    </div>
  )
}
