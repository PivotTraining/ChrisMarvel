export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-4">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-bg-card border border-border flex items-center justify-center">
          <Icon size={28} className="text-text-muted" />
        </div>
      )}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        {description && (
          <p className="text-sm text-text-secondary max-w-xs">{description}</p>
        )}
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}
