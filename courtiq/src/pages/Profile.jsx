import { useNavigate } from 'react-router-dom'
import { User, Trophy, Star, ChevronRight, LogOut, BookOpen, BarChart3, Pencil, Bell, Info, Bookmark } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'
import Button from '../components/ui/Button'

export default function Profile() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  const displayName = profile?.full_name || 'Player'
  const position = profile?.position || ''
  const level = profile?.level ?? 1
  const xp = profile?.xp ?? 0

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  const menuItems = [
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
            Totals
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Streak" value={profile?.current_streak ?? 0} icon={Trophy} />
            <StatCard label="Level" value={level} icon={Star} />
          </div>
        </section>

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
            {[
              { label: 'Edit Profile', icon: Pencil, path: '/profile/edit' },
              { label: 'Notifications', icon: Bell, path: '/profile/notifications' },
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
