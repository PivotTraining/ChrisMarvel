import { useNavigate } from 'react-router-dom'
import { Activity, Flame, Target, TrendingUp, Crosshair, ClipboardList, Dumbbell, Calendar, BookOpen } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useGames } from '../hooks/useGames'
import { useDrills } from '../hooks/useDrills'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function Dashboard() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { games } = useGames()
  const { sessions } = useDrills()

  const firstName = profile?.full_name?.split(' ')[0] || 'Player'

  // Combine recent activity
  const recentActivity = [
    ...games.slice(0, 3).map(g => ({
      id: g.id,
      type: 'game',
      title: g.opponent ? `vs ${g.opponent}` : 'Game',
      subtitle: `${g.points} PTS · ${g.rebounds} REB · ${g.assists} AST`,
      date: g.game_date,
      icon: ClipboardList,
    })),
    ...sessions.slice(0, 3).map(s => ({
      id: s.id,
      type: 'drill',
      title: s.drill_name,
      subtitle: s.category,
      date: s.session_date,
      icon: Dumbbell,
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

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
            Overview
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Streak" value={profile?.current_streak ?? 0} icon={Flame} />
            <StatCard label="XP" value={profile?.xp ?? 0} icon={TrendingUp} />
            <StatCard label="Games" value={games.length} icon={ClipboardList} />
            <StatCard label="Drills" value={sessions.length} icon={Target} />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Card onClick={() => navigate('/log/new')} className="flex flex-col items-center gap-3 py-6 cursor-pointer">
              <div className="w-11 h-11 rounded-xl bg-blue/10 border border-blue-border flex items-center justify-center">
                <ClipboardList size={20} className="text-blue" />
              </div>
              <span className="text-xs font-semibold text-text-primary">Log Game</span>
            </Card>
            <Card onClick={() => navigate('/shots')} className="flex flex-col items-center gap-3 py-6 cursor-pointer">
              <div className="w-11 h-11 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center">
                <Crosshair size={20} className="text-success" />
              </div>
              <span className="text-xs font-semibold text-text-primary">Track Shots</span>
            </Card>
            <Card onClick={() => navigate('/train/new')} className="flex flex-col items-center gap-3 py-6 cursor-pointer">
              <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                <Dumbbell size={20} className="text-gold" />
              </div>
              <span className="text-xs font-semibold text-text-primary">Log Drill</span>
            </Card>
            <Card onClick={() => navigate('/library')} className="flex flex-col items-center gap-3 py-6 cursor-pointer">
              <div className="w-11 h-11 rounded-xl bg-bg-section border border-border flex items-center justify-center">
                <BookOpen size={20} className="text-text-secondary" />
              </div>
              <span className="text-xs font-semibold text-text-primary">Library</span>
            </Card>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Recent Activity
          </h2>

          {recentActivity.length === 0 ? (
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
          ) : (
            <div className="space-y-3">
              {recentActivity.map(item => {
                const Icon = item.icon
                const date = new Date(item.date + 'T12:00:00')
                const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                return (
                  <Card key={item.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-bg-section border border-border flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-text-muted" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <p className="text-sm font-medium text-text-primary truncate">{item.title}</p>
                      <p className="text-xs text-text-muted">{item.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Calendar size={10} className="text-text-muted" />
                      <span className="text-[10px] text-text-muted">{formatted}</span>
                    </div>
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
