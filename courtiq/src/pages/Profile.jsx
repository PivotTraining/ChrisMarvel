import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Trophy, Star, ChevronRight, LogOut, BookOpen, BarChart3, Pencil, Bell, Info, Bookmark, Flame, ClipboardList, Dumbbell, Target, Crosshair, Layers, Award, Zap, Sun, Moon, Database, Crown, Users, Film, GraduationCap } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useGames } from '../hooks/useGames'
import { useDrills } from '../hooks/useDrills'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'
import Button from '../components/ui/Button'

export default function Profile() {
  const { profile, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const { games } = useGames()
  const { sessions } = useDrills()

  const displayName = profile?.full_name || 'Player'
  const position = profile?.position || ''
  const level = profile?.level ?? 1
  const xp = profile?.xp ?? 0

  const careerAvg = useMemo(() => {
    if (games.length === 0) return null
    const t = games.reduce((a, g) => ({
      pts: a.pts + g.points, reb: a.reb + g.rebounds, ast: a.ast + g.assists,
    }), { pts: 0, reb: 0, ast: 0 })
    const n = games.length
    return {
      ppg: (t.pts / n).toFixed(1),
      rpg: (t.reb / n).toFixed(1),
      apg: (t.ast / n).toFixed(1),
    }
  }, [games])

  // Best game (highest points)
  const bestGame = useMemo(() => {
    if (games.length === 0) return null
    return games.reduce((best, g) => g.points > best.points ? g : best, games[0])
  }, [games])

  // Longest win streak
  const longestWinStreak = useMemo(() => {
    if (games.length === 0) return 0
    let max = 0
    let current = 0
    // games are sorted by date desc, reverse for chronological
    const sorted = [...games].reverse()
    for (const g of sorted) {
      if (g.result === 'Win') {
        current++
        if (current > max) max = current
      } else {
        current = 0
      }
    }
    return max
  }, [games])

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  const menuItems = [
    { label: 'My Team', icon: Users, path: '/team' },
    { label: 'Schedule', icon: Target, path: '/schedule' },
    { label: 'Goals', icon: Crosshair, path: '/goals' },
    { label: 'Workouts', icon: Layers, path: '/workouts' },
    { label: 'Programs', icon: Dumbbell, path: '/programs' },
    { label: 'Film Room', icon: Film, path: '/film' },
    { label: 'Recruiting Profile', icon: GraduationCap, path: '/recruiting' },
    { label: 'Journal', icon: BookOpen, path: '/journal' },
    { label: 'Achievements', icon: Trophy, path: '/badges' },
    { label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { label: 'Saved Content', icon: Bookmark, path: '/saved' },
  ]

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        <SectionHeader
          title="Profile"
          subtitle="Your player info and achievements."
        />

        {/* Avatar & Name */}
        <Card className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-blue/10 border border-blue-border flex items-center justify-center shrink-0">
            <User size={28} className="text-blue" />
          </div>
          <div className="space-y-1 min-w-0">
            <p className="text-lg font-bold text-text-primary">{displayName}</p>
            <p className="text-sm text-text-secondary">
              {position ? `${position} · ` : ''}Level {level} — {xp} XP
            </p>
          </div>
        </Card>

        {/* Stats */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Overview
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Streak" value={profile?.current_streak ?? 0} icon={Flame} />
            <StatCard label="Level" value={level} icon={Star} />
            <StatCard label="Games" value={games.length} icon={ClipboardList} />
            <StatCard label="Drills" value={sessions.length} icon={Dumbbell} />
          </div>
        </section>

        {/* Career Averages */}
        {careerAvg && (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
              Career Averages
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="PPG" value={careerAvg.ppg} icon={Target} className="p-4" />
              <StatCard label="RPG" value={careerAvg.rpg} className="p-4" />
              <StatCard label="APG" value={careerAvg.apg} className="p-4" />
            </div>
          </section>
        )}

        {/* Best Game & Win Streak */}
        {(bestGame || longestWinStreak > 0) && (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2">
              <Award size={14} className="text-gold" />
              Highlights
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {bestGame && (
                <Card className="space-y-2 p-4">
                  <p className="text-[10px] font-medium text-text-muted uppercase">Best Game</p>
                  <p className="text-2xl font-bold text-gold">{bestGame.points} <span className="text-xs text-text-muted">PTS</span></p>
                  <p className="text-[10px] text-text-muted">
                    {bestGame.opponent ? `vs ${bestGame.opponent}` : ''}
                    {bestGame.opponent && bestGame.game_date ? ' · ' : ''}
                    {bestGame.game_date ? new Date(bestGame.game_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                  </p>
                </Card>
              )}
              {longestWinStreak > 0 && (
                <Card className="space-y-2 p-4">
                  <p className="text-[10px] font-medium text-text-muted uppercase">Best Streak</p>
                  <p className="text-2xl font-bold text-success">{longestWinStreak} <span className="text-xs text-text-muted">Wins</span></p>
                  <p className="text-[10px] text-text-muted">Longest win streak</p>
                </Card>
              )}
            </div>
          </section>
        )}

        {/* Quick Links */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Features
          </h2>
          <div className="space-y-3">
            {menuItems.map(({ label, icon: Icon, path }) => (
              <Card
                key={label}
                onClick={() => navigate(path)}
                className="flex items-center justify-between cursor-pointer card-hover"
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className="text-text-secondary" />
                  <span className="text-sm font-medium text-text-primary">{label}</span>
                </div>
                <ChevronRight size={16} className="text-text-muted" />
              </Card>
            ))}
          </div>
        </section>

        {/* Settings */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Settings
          </h2>
          <div className="space-y-3">
            {/* Theme Toggle */}
            <Card
              onClick={toggleTheme}
              className="flex items-center justify-between cursor-pointer card-hover"
            >
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon size={18} className="text-text-secondary" /> : <Sun size={18} className="text-warning" />}
                <span className="text-sm font-medium text-text-primary">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              <div className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors ${theme === 'light' ? 'bg-blue' : 'bg-bg-section border border-border'}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${theme === 'light' ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </Card>

            {[
              { label: 'Edit Profile', icon: Pencil, path: '/profile/edit' },
              { label: 'Notifications', icon: Bell, path: '/profile/notifications' },
              { label: 'Data Backup', icon: Database, path: '/backup' },
              { label: 'Upgrade Plan', icon: Crown, path: '/pricing' },
              { label: 'About CourtIQ', icon: Info, path: '/about' },
            ].map(({ label, icon: Icon, path }) => (
              <Card
                key={label}
                onClick={() => navigate(path)}
                className="flex items-center justify-between cursor-pointer card-hover"
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className="text-text-secondary" />
                  <span className="text-sm font-medium text-text-primary">{label}</span>
                </div>
                <ChevronRight size={16} className="text-text-muted" />
              </Card>
            ))}
          </div>
        </section>

        {/* Sign Out */}
        <section className="pt-2">
          <Button variant="ghost" fullWidth onClick={handleSignOut} className="text-danger">
            <LogOut size={18} />
            Sign Out
          </Button>
        </section>
      </div>
    </PageShell>
  )
}
