import { useNavigate } from 'react-router-dom'
import { Target, Dumbbell, Crosshair, ShieldCheck, Zap, Send, Plus, Star, Calendar } from 'lucide-react'
import { useDrills } from '../hooks/useDrills'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const categoryIcons = {
  'Ball Handling': Zap,
  'Shooting': Crosshair,
  'Finishing': Target,
  'Defense': ShieldCheck,
  'Passing': Send,
  'Conditioning': Dumbbell,
  'Custom': Star,
}

const categoryColors = {
  'Ball Handling': 'text-blue',
  'Shooting': 'text-success',
  'Finishing': 'text-gold',
  'Defense': 'text-danger',
  'Passing': 'text-warning',
  'Conditioning': 'text-blue',
  'Custom': 'text-text-secondary',
}

export default function Train() {
  const navigate = useNavigate()
  const { sessions, loading } = useDrills()

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        <SectionHeader
          title="Training"
          subtitle="Browse drills and log sessions."
          action={
            <Button size="sm" onClick={() => navigate('/train/new')}>
              <Plus size={16} />
              Log
            </Button>
          }
        />

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button fullWidth onClick={() => navigate('/train/new')}>
            <Dumbbell size={18} />
            Log Drill
          </Button>
          <Button variant="secondary" fullWidth onClick={() => navigate('/shots')}>
            <Crosshair size={18} />
            Track Shots
          </Button>
        </div>

        {/* Recent Sessions */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Recent Sessions
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <Card>
              <div className="flex flex-col items-center py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-bg-section border border-border flex items-center justify-center">
                  <Dumbbell size={22} className="text-text-muted" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-text-primary">No sessions yet</p>
                  <p className="text-xs text-text-muted">Log your first drill to see it here.</p>
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {sessions.map(session => {
                const Icon = categoryIcons[session.category] || Dumbbell
                const color = categoryColors[session.category] || 'text-text-secondary'
                const date = new Date(session.session_date + 'T12:00:00')
                const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

                return (
                  <Card key={session.id} className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl bg-bg-section border border-border flex items-center justify-center shrink-0 ${color}`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-sm font-semibold text-text-primary truncate">{session.drill_name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium text-text-muted bg-bg-section px-2 py-0.5 rounded-full">
                          {session.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Calendar size={10} className="text-text-muted" />
                          <span className="text-[10px] text-text-muted">{formatted}</span>
                        </div>
                      </div>
                    </div>
                    {session.rating && (
                      <div className="flex items-center gap-0.5 shrink-0">
                        <Star size={12} className="text-gold fill-gold" />
                        <span className="text-xs font-bold text-text-primary">{session.rating}</span>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </PageShell>
  )
}
