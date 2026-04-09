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

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C']
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced']

function SectionTitle({ children }) {
  return (
    <h2 className="t-title3" style={{ color: 'var(--color-text)', marginBottom: 'var(--space-2)' }}>
      {children}
    </h2>
  )
}

function ToggleRow({ label, enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full py-2.5 cursor-pointer"
      style={{ background: 'none', border: 'none', fontFamily: 'inherit' }}
    >
      <span className="t-body" style={{ color: 'var(--color-text-sec)' }}>{label}</span>
      <div
        className="relative w-11 h-6 rounded-full transition-colors duration-200"
        style={{
          backgroundColor: enabled ? 'var(--color-accent)' : 'var(--color-card)',
          border: `1px solid ${enabled ? 'var(--color-accent)' : 'var(--color-border)'}`,
        }}
      >
        <div
          className="absolute top-0.5 rounded-full transition-transform duration-200"
          style={{
            width: '18px', height: '18px',
            backgroundColor: enabled ? 'var(--color-text)' : 'var(--color-text-sec)',
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
      <span className="t-title3" style={{ color: 'var(--color-accent)' }}>{value}</span>
      <span className="t-caption" style={{ color: 'var(--color-text-sec)' }}>{label}</span>
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
      <h1 className="t-title2" style={{ color: 'var(--color-text)', marginBottom: 'var(--space-3)' }}>
        Settings
      </h1>

      <SectionTitle>Profile</SectionTitle>
      <Card className="mb-5">
        <div className="flex flex-col gap-3">
          <Input label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name" />
          <Select label="Position" value={position} onChange={e => setPosition(e.target.value)} options={POSITIONS} placeholder="Select position" />
          <Select label="Skill Level" value={skillLevel} onChange={e => setSkillLevel(e.target.value)} options={SKILL_LEVELS} placeholder="Select level" />
          <Input label="Date of Birth" type="date" value={dob} onChange={e => setDob(e.target.value)} />
          <Button onClick={handleSaveProfile} loading={saving} fullWidth>
            <Save className="w-4 h-4" /> Save Profile
          </Button>
        </div>
      </Card>

      <SectionTitle>Stats Summary</SectionTitle>
      <Card className="mb-5">
        <div className="grid grid-cols-4 gap-2 text-center">
          <StatItem label="XP" value={profile?.xp ?? 0} />
          <StatItem label="Level" value={profile?.level ?? 1} />
          <StatItem label="Streak" value={profile?.streak_count ?? 0} />
          <StatItem label="Since" value={memberSince} />
        </div>
      </Card>

      <SectionTitle>Preferences</SectionTitle>
      <Card className="mb-5">
        <ToggleRow label="Streak Reminders" enabled={streakReminder} onToggle={handleToggleStreak} />
        <div style={{ borderTop: '1px solid var(--color-border)' }} />
        <ToggleRow label="Weekly Summary" enabled={weeklySummary} onToggle={handleToggleWeekly} />
      </Card>

      <SectionTitle>Account</SectionTitle>
      <Card className="mb-5">
        <Button variant="outline" fullWidth onClick={handleSignOut} className="mb-3"
          style={{ color: 'var(--color-danger)', borderColor: 'rgba(239,68,68,0.4)' }}>
          <LogOut className="w-4 h-4" /> Sign Out
        </Button>
        <p className="t-caption" style={{ textAlign: 'center', color: 'var(--color-text-sec)' }}>
          CourtIQ v1.0
        </p>
      </Card>
    </PageWrapper>
  )
}
