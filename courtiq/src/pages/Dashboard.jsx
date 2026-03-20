import { Activity, Flame, Target, TrendingUp } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function Dashboard() {
  const { profile } = useAuth()

  const firstName = profile?.full_name?.split(' ')[0] || 'Player'

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <SectionHeader
          title={`Hey, ${firstName}`}
          subtitle="Track your progress and daily work."
        />

        {/* Quick Stats */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Today's Stats
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Streak" value={profile?.current_streak ?? 0} icon={Flame} />
            <StatCard label="XP" value={profile?.xp ?? 0} icon={TrendingUp} />
            <StatCard label="Sessions" value="0" icon={Target} />
            <StatCard label="Shots" value="0" icon={Activity} />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Quick Actions
          </h2>
          <Card className="space-y-4">
            <p className="text-sm text-text-secondary">
              Start tracking your basketball development today.
            </p>
            <div className="flex flex-col gap-3">
              <Button fullWidth>
                <Target size={18} />
                Log a Workout
              </Button>
              <Button variant="secondary" fullWidth>
                <Activity size={18} />
                Track Shots
              </Button>
            </div>
          </Card>
        </section>

        {/* Recent Activity */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Recent Activity
          </h2>
          <Card>
            <div className="flex flex-col items-center py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-bg-section border border-border flex items-center justify-center">
                <Activity size={22} className="text-text-muted" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-text-primary">No activity yet</p>
                <p className="text-xs text-text-muted">Your recent sessions will appear here.</p>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </PageShell>
  )
}
