import { useState, useEffect } from 'react'
import { LogOut, Save, Bell, BarChart3, Calendar } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Badge from '../../components/ui/Badge'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

const barlow = { fontFamily: "'Barlow Condensed', sans-serif" }
const dmSans = { fontFamily: "'DM Sans', sans-serif" }

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C']
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced']

function SectionTitle({ children }) {
  return (
    <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)', ...barlow }}>
      {children}
    </h2>
  )
}

function ToggleRow({ label, enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full py-2.5 cursor-pointer"
      style={{ ...dmSans }}
    >
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <div
        className="relative w-11 h-6 rounded-full transition-colors duration-200"
        style={{ backgroundColor: enabled ? 'var(--accent-primary)' : 'var(--bg-surface)' ,
          border: `1px solid ${enabled ? 'var(--accent-primary)' : 'var(--border-subtle)'}` }}
      >
        <div
          className="absolute top-0.5 w-4.5 h-4.5 rounded-full transition-transform duration-200"
          style={{
            width: '18px', height: '18px',
            backgroundColor: enabled ? '#fff' : 'var(--text-muted)',
            transform: enabled ? 'translateX(22px)' : 'translateX(3px)',
          }}
        />
      </div>
    </button>
  )
}

function StatItem({ label, value }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-xl font-bold" style={{ color: 'var(--accent-primary)', ...barlow }}>{value}</span>
      <span className="text-xs" style={{ color: 'var(--text-muted)', ...dmSans }}>{label}</span>
    </div>
  )
}

export default function Settings() {
  const { profile, updateProfile, signOut } = useAuth()
  const { showToast } = useToast()

  const [fullName, setFullName] = useState('')
  const [position, setPosition] = useState('')
  const [skillLevel, setSkillLevel] = useState('')
  const [dob, setDob] = useState('')
  const [saving, setSaving] = useState(false)

  const [streakReminder, setStreakReminder] = useState(true)
  const [weeklySummary, setWeeklySummary] = useState(true)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setPosition(profile.position || '')
      setSkillLevel(profile.skill_level || '')
      setDob(profile.date_of_birth || '')
      const prefs = profile.notification_preferences || {}
      setStreakReminder(prefs.streak_reminder !== false)
      setWeeklySummary(prefs.weekly_summary !== false)
    }
  }, [profile])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      await updateProfile({
        full_name: fullName,
        position,
        skill_level: skillLevel,
        date_of_birth: dob,
      })
      showToast('Profile updated', 'success')
    } catch {
      showToast('Failed to update profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleStreak = () => {
    const next = !streakReminder
    setStreakReminder(next)
    updateProfile({ notification_preferences: { streak_reminder: next, weekly_summary: weeklySummary } })
  }

  const handleToggleWeekly = () => {
    const next = !weeklySummary
    setWeeklySummary(next)
    updateProfile({ notification_preferences: { streak_reminder: streakReminder, weekly_summary: next } })
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      showToast('Signed out', 'info')
    } catch {
      showToast('Failed to sign out', 'error')
    }
  }

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '--'

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold mb-5" style={{ color: 'var(--text-primary)', ...barlow }}>
        Settings
      </h1>

      {/* Profile */}
      <SectionTitle>Profile</SectionTitle>
      <Card className="mb-5">
        <div className="flex flex-col gap-3">
          <Input label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name" />
          <Select
            label="Position"
            value={position}
            onChange={e => setPosition(e.target.value)}
            options={POSITIONS}
            placeholder="Select position"
          />
          <Select
            label="Skill Level"
            value={skillLevel}
            onChange={e => setSkillLevel(e.target.value)}
            options={SKILL_LEVELS}
            placeholder="Select level"
          />
          <Input label="Date of Birth" type="date" value={dob} onChange={e => setDob(e.target.value)} />
          <Button onClick={handleSaveProfile} loading={saving} fullWidth>
            <Save className="w-4 h-4" /> Save Profile
          </Button>
        </div>
      </Card>

      {/* Stats Summary */}
      <SectionTitle>Stats Summary</SectionTitle>
      <Card className="mb-5">
        <div className="grid grid-cols-4 gap-2 text-center">
          <StatItem label="XP" value={profile?.xp ?? 0} />
          <StatItem label="Level" value={profile?.level ?? 1} />
          <StatItem label="Streak" value={profile?.streak_count ?? 0} />
          <StatItem label="Since" value={memberSince} />
        </div>
      </Card>

      {/* Preferences */}
      <SectionTitle>Preferences</SectionTitle>
      <Card className="mb-5">
        <ToggleRow label="Streak Reminders" enabled={streakReminder} onToggle={handleToggleStreak} />
        <div style={{ borderTop: '1px solid var(--border-subtle)' }} />
        <ToggleRow label="Weekly Summary" enabled={weeklySummary} onToggle={handleToggleWeekly} />
      </Card>

      {/* Account */}
      <SectionTitle>Account</SectionTitle>
      <Card className="mb-5">
        <Button variant="outline" fullWidth onClick={handleSignOut} className="mb-3"
          style={{ color: '#EF4444', borderColor: 'rgba(239,68,68,0.4)' }}>
          <LogOut className="w-4 h-4" /> Sign Out
        </Button>
        <p className="text-center text-xs" style={{ color: 'var(--text-muted)', ...dmSans }}>
          CourtIQ v1.0
        </p>
      </Card>
    </PageWrapper>
  )
}
