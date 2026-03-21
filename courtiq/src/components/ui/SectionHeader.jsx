export default function SectionHeader({ title, subtitle, action }) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        {action}
      </div>
      {subtitle && (
        <p className="text-sm text-text-secondary">{subtitle}</p>
      )}
    </section>
  )
}
