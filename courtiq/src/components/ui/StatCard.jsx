import Card from './Card'

export default function StatCard({ label, value, icon: Icon, trend, className = '' }) {
  return (
    <Card className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
          {label}
        </span>
        {Icon && <Icon size={16} className="text-text-muted" />}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-text-primary">{value}</span>
        {trend && (
          <span className={`text-xs font-medium pb-0.5 ${trend > 0 ? 'text-success' : 'text-danger'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </Card>
  )
}
