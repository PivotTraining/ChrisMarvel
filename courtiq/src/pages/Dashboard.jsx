import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Flame, Target, TrendingUp, Crosshair, ClipboardList, Dumbbell, Calendar, BookOpen, Search, X, Zap, Clock, Trash2, Users, Radio, Bell } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { useGames } from '../hooks/useGames'
import { useDrills } from '../hooks/useDrills'
import { useShots } from '../hooks/useShots'
import ActivityCalendar from '../components/ActivityCalendar'
import OnboardingTour from '../components/OnboardingTour'
import WeeklyReport from '../components/WeeklyReport'
import SmartInsights from '../components/SmartInsights'
import { useNotifications } from '../hooks/useNotifications'
import SkillRadar from '../components/SkillRadar'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function Dashboard() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { games } = useGames()
  const { sessions, addDrillSession } = useDrills()
  const { shots } = useShots()
  const { unreadCount } = useNotifications()
  const toast = useToast()

  const [query, setQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem('courtiq-recent-searches') || '[]') }
    catch { return [] }
  })
  const [quickDrill, setQuickDrill] = useState('')
  const [quickLogging, setQuickLogging] = useState(false)
  const firstName = profile?.full_name?.split(' ')[0] || 'Player'

  function saveSearch(term) {
    if (!term.trim()) return
    const updated = [term.trim(), ...recentSearches.filter(s => s !== term.trim())].slice(0, 5)
    setRecentSearches(updated)
    try { localStorage.setItem('courtiq-recent-searches', JSON.stringify(updated)) } catch {}
  }

  function clearRecentSearches() {
    setRecentSearches([])
    try { localStorage.removeItem('courtiq-recent-searches') } catch {}
  }

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
      <OnboardingTour />
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <SectionHeader
            title={`Hey, ${firstName}`}
            subtitle="Track your progress and daily work."
          />
          <button
            onClick={() => navigate('/notifications')}
            className="relative w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors shrink-0"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Streak Banner */}
        {(() => {
          const streak = profile?.current_streak ?? 0
          if (streak === 0) return (
            <Card className="flex items-center gap-3 border-blue-border/20 bg-blue/5">
              <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center shrink-0">
                <Flame size={20} className="text-blue" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary">Start your streak today</p>
                <p className="text-[10px] text-text-muted">Log a game or drill to get going.</p>
              </div>
            </Card>
          )
          const messages = streak >= 14
            ? { title: `${streak}-day streak! Unstoppable!`, sub: "You're on a legendary run. Keep dominating." }
            : streak >= 7
              ? { title: `${streak}-day streak! On fire!`, sub: "A full week of work. Elite mentality." }
              : streak >= 3
                ? { title: `${streak}-day streak! Building momentum`, sub: "Consistency is the key to greatness." }
                : { title: `${streak}-day streak!`, sub: "Keep showing up every day." }
          return (
            <Card className="flex items-center gap-3 border-gold/30 bg-gold/5">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                <Flame size={20} className="text-gold" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary">{messages.title}</p>
                <p className="text-[10px] text-text-muted">{messages.sub}</p>
              </div>
            </Card>
          )
        })()}

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            onKeyDown={e => { if (e.key === 'Enter' && query.trim()) saveSearch(query) }}
            placeholder="Search games, drills, sessions..."
            className="w-full rounded-xl bg-bg-card border border-border pl-10 pr-10 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border transition-colors"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary" aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Recent Searches */}
        {searchFocused && !query && recentSearches.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-text-muted uppercase font-medium flex items-center gap-1">
                <Clock size={10} /> Recent
              </p>
              <button onClick={clearRecentSearches} className="text-[10px] text-text-muted hover:text-text-secondary flex items-center gap-1">
                <Trash2 size={10} /> Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {recentSearches.map((term, i) => (
                <button
                  key={i}
                  onMouseDown={e => { e.preventDefault(); setQuery(term); saveSearch(term) }}
                  className="text-[10px] text-text-secondary bg-bg-card border border-border px-2.5 py-1 rounded-full hover:border-blue-border hover:text-blue transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

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

        {/* Activity Calendar */}
        <Card>
          <ActivityCalendar games={games} drills={sessions} />
        </Card>

        {/* Weekly Report */}
        <Card>
          <WeeklyReport games={games} drills={sessions} />
        </Card>

        {/* Smart Insights */}
        <Card>
          <SmartInsights games={games} drills={sessions} shots={shots} />
        </Card>

        {/* Skill Radar */}
        <Card>
          <SkillRadar games={games} drills={sessions} shots={shots} />
        </Card>

        {/* Quick Log */}
        <Card className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-blue" />
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Quick Log</h2>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              if (!quickDrill.trim()) return
              setQuickLogging(true)
              const { error } = await addDrillSession({
                session_date: new Date().toISOString().split('T')[0],
                drill_name: quickDrill.trim(),
                category: 'Custom',
                intensity: 'Medium',
              })
              setQuickLogging(false)
              if (!error) {
                toast('Drill logged!')
                setQuickDrill('')
              }
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={quickDrill}
              onChange={e => setQuickDrill(e.target.value)}
              placeholder="Drill name (e.g. Ball handling)"
              className="flex-1 rounded-lg bg-bg-section border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border transition-colors"
            />
            <Button type="submit" size="sm" disabled={quickLogging || !quickDrill.trim()}>
              {quickLogging ? '...' : 'Log'}
            </Button>
          </form>
        </Card>

        {/* Quick Actions */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Quick Actions
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <Card onClick={() => navigate('/live')} className="flex flex-col items-center gap-3 py-5 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-danger/10 border border-danger/20 flex items-center justify-center">
                <Radio size={18} className="text-danger" />
              </div>
              <span className="text-[11px] font-semibold text-text-primary">Live Game</span>
            </Card>
            <Card onClick={() => navigate('/log/new')} className="flex flex-col items-center gap-3 py-5 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-blue/10 border border-blue-border flex items-center justify-center">
                <ClipboardList size={18} className="text-blue" />
              </div>
              <span className="text-[11px] font-semibold text-text-primary">Log Game</span>
            </Card>
            <Card onClick={() => navigate('/shots')} className="flex flex-col items-center gap-3 py-5 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center">
                <Crosshair size={18} className="text-success" />
              </div>
              <span className="text-[11px] font-semibold text-text-primary">Shots</span>
            </Card>
            <Card onClick={() => navigate('/train/new')} className="flex flex-col items-center gap-3 py-5 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                <Dumbbell size={18} className="text-gold" />
              </div>
              <span className="text-[11px] font-semibold text-text-primary">Log Drill</span>
            </Card>
            <Card onClick={() => navigate('/goals')} className="flex flex-col items-center gap-3 py-5 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-danger/10 border border-danger/20 flex items-center justify-center">
                <Target size={18} className="text-danger" />
              </div>
              <span className="text-[11px] font-semibold text-text-primary">Goals</span>
            </Card>
            <Card onClick={() => navigate('/library')} className="flex flex-col items-center gap-3 py-5 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-bg-section border border-border flex items-center justify-center">
                <BookOpen size={18} className="text-text-secondary" />
              </div>
              <span className="text-[11px] font-semibold text-text-primary">Library</span>
            </Card>
            <Card onClick={() => navigate('/journal/new')} className="flex flex-col items-center gap-3 py-5 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-blue/5 border border-blue-border/30 flex items-center justify-center">
                <BookOpen size={18} className="text-blue" />
              </div>
              <span className="text-[11px] font-semibold text-text-primary">Journal</span>
            </Card>
            <Card onClick={() => navigate('/schedule')} className="flex flex-col items-center gap-3 py-5 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center">
                <Calendar size={18} className="text-warning" />
              </div>
              <span className="text-[11px] font-semibold text-text-primary">Schedule</span>
            </Card>
            <Card onClick={() => navigate('/team')} className="flex flex-col items-center gap-3 py-5 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center">
                <Users size={18} className="text-success" />
              </div>
              <span className="text-[11px] font-semibold text-text-primary">Team</span>
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
                <div className="bg-bg-section rounded-lg px-3 py-2 text-[10px] text-text-muted max-w-xs">
                  <strong className="text-text-secondary">Tip:</strong> Start by logging a game or a quick drill from the actions above.
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
