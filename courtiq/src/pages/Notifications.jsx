import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Bell, Trophy, Flame, Target, Star, Zap, Award, Users, Check, CheckCheck, Trash2 } from 'lucide-react'
import { useNotifications } from '../hooks/useNotifications'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const ICON_MAP = {
  trophy: Trophy,
  flame: Flame,
  target: Target,
  star: Star,
  zap: Zap,
  award: Award,
  team: Users,
  bell: Bell,
}

const TYPE_COLORS = {
  achievement: 'bg-gold/10 border-gold/20 text-gold',
  milestone: 'bg-blue/10 border-blue-border text-blue',
  streak: 'bg-success/10 border-success/20 text-success',
  tip: 'bg-bg-section border-border text-text-secondary',
  team: 'bg-blue/5 border-blue-border/30 text-blue',
  system: 'bg-bg-section border-border text-text-secondary',
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function Notifications() {
  const navigate = useNavigate()
  const { notifications, unreadCount, loading, markRead, markAllRead, clearAll } = useNotifications()

  const unread = notifications.filter(n => !n.read)
  const read = notifications.filter(n => n.read)

  function handleTap(notif) {
    if (!notif.read) markRead(notif.id)
    if (notif.action_url) navigate(notif.action_url)
  }

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors" aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
          <SectionHeader
            title="Notifications"
            subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            action={
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button size="sm" variant="ghost" onClick={markAllRead}>
                    <CheckCheck size={14} />
                  </Button>
                )}
                {notifications.length > 0 && (
                  <Button size="sm" variant="ghost" onClick={clearAll}>
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
            }
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center py-10 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-bg-section border border-border flex items-center justify-center">
                <Bell size={24} className="text-text-muted" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-text-primary">No notifications</p>
                <p className="text-xs text-text-muted">Achievements, milestones, and updates will appear here.</p>
              </div>
            </div>
          </Card>
        ) : (
          <>
            {/* Unread */}
            {unread.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">New</h2>
                {unread.map(notif => (
                  <NotificationCard key={notif.id} notif={notif} onTap={handleTap} />
                ))}
              </section>
            )}

            {/* Read */}
            {read.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Earlier</h2>
                {read.map(notif => (
                  <NotificationCard key={notif.id} notif={notif} onTap={handleTap} />
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </PageShell>
  )
}

function NotificationCard({ notif, onTap }) {
  const Icon = ICON_MAP[notif.icon] || Bell
  const typeColor = TYPE_COLORS[notif.type] || TYPE_COLORS.system

  return (
    <Card
      onClick={() => onTap(notif)}
      className={`flex gap-3 cursor-pointer card-hover ${!notif.read ? 'border-blue-border/30 bg-blue/[0.03]' : 'opacity-70'}`}
    >
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${typeColor}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-semibold truncate ${!notif.read ? 'text-text-primary' : 'text-text-secondary'}`}>
            {notif.title}
          </p>
          {!notif.read && (
            <div className="w-2 h-2 rounded-full bg-blue shrink-0 mt-1.5" />
          )}
        </div>
        {notif.body && (
          <p className="text-xs text-text-muted line-clamp-2">{notif.body}</p>
        )}
        <p className="text-[10px] text-text-muted">{timeAgo(notif.created_at)}</p>
      </div>
    </Card>
  )
}
