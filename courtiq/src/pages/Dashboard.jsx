import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Flame, Target, TrendingUp, Crosshair, ClipboardList, Dumbbell, Calendar, BookOpen, Search, X } from 'lucide-react'
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

  const [query, setQuery] = useState('')
  const firstName = profile?.full_name?.split(' ')[0] || 'Player'

  // Weekly activity (last 7 days)
  const weeklyStats = useMemo(() => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 7)
    const cutoffStr = cutoff.toISOString().split('T')[0]
    const weekGames = games.filter(g => g.game_date >= cutoffStr)
    const weekDrills = sessions.filter(s => s.session_date >= cutoffStr)
    const activeDays = new Set([
      ...weekGames.map(g => g.game_date),
      ...weekDrills.map(s => s.session_date),
    ]).size
    return { games: weekGames.length, drills: weekDrills.length, activeDays }
  }, [games, sessions])

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

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search games, drills, sessions..."
            className="w-full rounded-xl bg-bg-card border border-border pl-10 pr-10 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border transition-colors"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary" aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Search Results */}
        {query.trim().length > 0 && (() => {
          const q = query.toLowerCase()
          const matchedGames = games.filter(g =>
            (g.opponent || '').toLowerCase().includes(q) ||
            (g.location || '').toLowerCase().includes(q) ||
            (g.game_type || '').toLowerCase().includes(q) ||
            (g.notes || '').toLowerCase().includes(q)
          )
          const matchedDrills = sessions.filter(s =>
            (s.drill_name || '').toLowerCase().includes(q) ||
            (s.category || '').toLowerCase().includes(q) ||
            (s.notes || '').toLowerCase().includes(q)
          )
          const total = matchedGames.length + matchedDrills.length

          return (
            <section className="space-y-3">
              <p className="text-xs text-text-muted">{total} result{total !== 1 ? 's' : ''} for "{query}"</p>
              {matchedGames.map(g => (
                <Card key={g.id} onClick={() => navigate(`/log/${g.id}`)} className="flex items-center gap-3 cursor-pointer card-hover">
                  <ClipboardList size={16} className="text-text-muted shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{g.opponent ? `vs ${g.opponent}` : 'Game'}</p>
                    <p className="text-[10px] text-text-muted">{g.points} PTS · {new Date(g.game_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                  {g.result && <span className={`text-[10px] font-bold ${g.result === 'Win' ? 'text-success' : g.result === 'Loss' ? 'text-danger' : 'text-warning'}`}>{g.result}</span>}
                </Card>
              ))}
              {matchedDrills.map(s => (
                <Card key={s.id} onClick={() => navigate(`/train/${s.id}`)} className="flex items-center gap-3 cursor-pointer card-hover">
                  <Dumbbell size={16} className="text-text-muted shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{s.drill_name}</p>
                    <p className="text-[10px] text-text-muted">{s.category} · {new Date(s.session_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                </Card>
              ))}
              {total === 0 && (
                <p className="text-xs text-text-muted text-center py-4">No matches found.</p>
              )}
            </section>
          )
        })()}

        {/* Quick Stats */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Overview
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              label="Streak"
              value={`${profile?.current_streak ?? 0} 🔥`}
              icon={Flame}
              className={profile?.current_streak > 0 ? 'border-gold/30 bg-gold/5' : ''}
            />
            <StatCard label="XP" value={profile?.xp ?? 0} icon={TrendingUp} />
            <StatCard label="Games" value={games.length} icon={ClipboardList} />
            <StatCard label="Drills" value={sessions.length} icon={Target} />
          </div>
        </section>

        {/* This Week */}
        <Card className="space-y-3">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">This Week</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-xl font-bold text-text-primary">{weeklyStats.activeDays}</p>
                <p className="text-[10px] text-text-muted uppercase">Active Days</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-text-primary">{weeklyStats.games}</p>
                <p className="text-[10px] text-text-muted uppercase">Games</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-text-primary">{weeklyStats.drills}</p>
                <p className="text-[10px] text-text-muted uppercase">Drills</p>
              </div>
            </div>
            {/* 7-day dots */}
            <div className="flex gap-1">
              {Array.from({ length: 7 }, (_, i) => {
                const d = new Date()
                d.setDate(d.getDate() - (6 - i))
                const dateStr = d.toISOString().split('T')[0]
                const hasActivity = games.some(g => g.game_date === dateStr) || sessions.some(s => s.session_date === dateStr)
                return (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${hasActivity ? 'bg-blue' : 'bg-bg-section border border-border'}`}
                    title={d.toLocaleDateString('en-US', { weekday: 'short' })}
                  />
                )
              })}
            </div>
          </div>
        </Card>

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
                  <Card key={item.id} onClick={() => navigate(item.type === 'game' ? `/log/${item.id}` : `/train/${item.id}`)} className="flex items-center gap-4 cursor-pointer card-hover">
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
