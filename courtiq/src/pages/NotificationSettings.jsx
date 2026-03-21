import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Bell, Flame, BarChart3, Save } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

function Toggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-11 h-6 rounded-full transition-colors duration-200 relative shrink-0 ${
        enabled ? 'bg-blue' : 'bg-bg-section border border-border'
      }`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
        enabled ? 'left-[22px]' : 'left-0.5'
      }`} />
    </button>
  )
}

export default function NotificationSettings() {
  const navigate = useNavigate()
  const { profile, updateProfile } = useAuth()

  const [streakReminders, setStreakReminders] = useState(profile?.notification_streak_reminders ?? true)
  const [weeklySummary, setWeeklySummary] = useState(profile?.notification_weekly_summary ?? true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    const { error } = await updateProfile({
      notification_streak_reminders: streakReminders,
      notification_weekly_summary: weeklySummary,
    })
    setSaving(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <SectionHeader title="Notifications" subtitle="Manage your alerts." />
        </div>

        <Card className="space-y-6">
          {/* Streak Reminders */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center shrink-0 mt-0.5">
                <Flame size={16} className="text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Streak Reminders</p>
                <p className="text-xs text-text-muted mt-0.5">Get reminded to log activity and keep your streak alive</p>
              </div>
            </div>
            <Toggle enabled={streakReminders} onToggle={() => { setStreakReminders(!streakReminders); setSaved(false) }} />
          </div>

          <div className="border-t border-border" />

          {/* Weekly Summary */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue/10 flex items-center justify-center shrink-0 mt-0.5">
                <BarChart3 size={16} className="text-blue" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Weekly Summary</p>
                <p className="text-xs text-text-muted mt-0.5">Receive a weekly recap of your training and game stats</p>
              </div>
            </div>
            <Toggle enabled={weeklySummary} onToggle={() => { setWeeklySummary(!weeklySummary); setSaved(false) }} />
          </div>
        </Card>

        <Card className="space-y-3 border-blue/20 bg-blue/5">
          <div className="flex items-center gap-2">
            <Bell size={14} className="text-blue" />
            <p className="text-xs font-semibold text-blue uppercase tracking-wider">Coming Soon</p>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Push notifications, game-day reminders, and team updates will be available in a future update.
          </p>
        </Card>

        <Button fullWidth onClick={handleSave} disabled={saving}>
          <Save size={16} />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Preferences'}
        </Button>
      </div>
    </PageShell>
  )
}
