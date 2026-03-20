import { Target, Dumbbell, Crosshair, ShieldCheck, Zap } from 'lucide-react'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'

const categories = [
  { name: 'Ball Handling', icon: Zap, count: 8, color: 'text-blue' },
  { name: 'Shooting', icon: Crosshair, count: 12, color: 'text-success' },
  { name: 'Finishing', icon: Target, count: 6, color: 'text-gold' },
  { name: 'Defense', icon: ShieldCheck, count: 7, color: 'text-danger' },
  { name: 'Conditioning', icon: Dumbbell, count: 5, color: 'text-warning' },
]

export default function Train() {
  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        <SectionHeader
          title="Training"
          subtitle="Browse drills and start a session."
        />

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Categories
          </h2>
          <div className="space-y-3">
            {categories.map(({ name, icon: Icon, count, color }) => (
              <Card key={name} className="flex items-center gap-4 cursor-pointer card-hover">
                <div className={`w-11 h-11 rounded-xl bg-bg-section border border-border flex items-center justify-center ${color}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary">{name}</p>
                  <p className="text-xs text-text-muted">{count} drills</p>
                </div>
                <span className="text-text-muted text-xs">→</span>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  )
}
