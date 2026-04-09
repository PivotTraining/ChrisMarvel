import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Save, Crown, ChevronRight, Star, Share2, Trash2, RotateCcw, AlertTriangle } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import SeasonShareCard from '../../components/ui/SeasonShareCard'
import { useAuth } from '../../context/AuthContext'
import { usePremium } from '../../context/PremiumContext'
import { useToast } from '../../context/ToastContext'
import useGames from '../../hooks/useGames'

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C']
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced']

const ALL_STORAGE_KEYS = [
  'courtiq_games',
  'courtiq_shots',
  'courtiq_drills',
  'courtiq_journal',
  'courtiq_badges',
  'courtiq_challenges',
  'courtiq_content_saved',
  'courtiq_content_history',
  'courtiq_pack_progress',
]

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

function DangerAction({ icon: Icon, title, description, buttonLabel, onAction, confirmText }) {
  const [confirming, setConfirming] = useState(false)

  const handleClick = () => {
    if (!confirming) {
      setConfirming(true)
      return
    }
    onAction()
    setConfirming(false)
  }

  return (
    <div
      style={{
        padding: 'var(--space-2)',
        borderBottom: '1px solid rgba(239,68,68,0.1)',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: 'var(--color-danger-tint)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px',
          }}
        >
          <Icon size={18} style={{ color: 'var(--color-danger)' }} />
        </div>
        <div className="flex-1">
          <p className="t-body" style={{ fontWeight: 700, color: 'var(--color-text)' }}>{title}</p>
          <p className="t-caption" style={{ color: 'var(--color-text-sec)', marginTop: '2px' }}>{description}</p>
          {confirming && (
            <div
              style={{
                marginTop: 'var(--space-1)',
                padding: 'var(--space-1) var(--space-2)',
                borderRadius: '10px',
                backgroundColor: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
              }}
            >
              <div className="flex items-center gap-2" style={{ marginBottom: '8px' }}>
                <AlertTriangle size={14} style={{ color: 'var(--color-danger)' }} />
                <p className="t-caption" style={{ color: 'var(--color-danger)', fontWeight: 700 }}>{confirmText}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirming(false)}
                  className="t-caption"
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-card)',
                    color: 'var(--color-text-sec)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleClick}
                  className="t-caption"
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--color-danger)',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {buttonLabel}
                </button>
              </div>
            </div>
          )}
          {!confirming && (
            <button
              onClick={handleClick}
              className="t-caption"
              style={{
                marginTop: '8px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(239,68,68,0.3)',
                background: 'transparent',
                color: 'var(--color-danger)',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {buttonLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Settings() {
  const navigate = useNavigate()
  const { profile, updateProfile, signOut } = useAuth()
  const { isPro } = usePremium()
  const { showToast } = useToast()
  const { seasonAverages } = useGames()

  const [fullName, setFullName] = useState('')
  const [position, setPosition] = useState('')
  const [skillLevel, setSkillLevel] = useState('')
  const [dob, setDob] = useState('')
  const [saving, setSaving] = useState(false)

  const [streakReminder, setStreakReminder] = useState(true)
  const [weeklySummary, setWeeklySummary] = useState(true)
  const [showShareCard, setShowShareCard] = useState(false)

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

  const handleResetStats = () => {
    ALL_STORAGE_KEYS.forEach((key) => {
      try { localStorage.removeItem(key) } catch { /* noop */ }
    })
    showToast('All stats have been reset', 'success')
    window.location.reload()
  }

  const handleEraseProfile = async () => {
    // Clear all local data
    ALL_STORAGE_KEYS.forEach((key) => {
      try { localStorage.removeItem(key) } catch { /* noop */ }
    })
    try { localStorage.removeItem('courtiq_premium') } catch { /* noop */ }

    // Sign out (clears profile state)
    try {
      await signOut()
    } catch { /* noop */ }

    showToast('Profile erased', 'info')
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
      <Card className="mb-3">
        <div className="grid grid-cols-4 gap-2 text-center">
          <StatItem label="XP" value={profile?.xp ?? 0} />
          <StatItem label="Level" value={profile?.level ?? 1} />
          <StatItem label="Streak" value={profile?.streak_count ?? 0} />
          <StatItem label="Since" value={memberSince} />
        </div>
      </Card>

      {/* Share Season Card */}
      <button
        onClick={() => setShowShareCard(true)}
        style={{
          width: '100%',
          padding: '14px 20px',
          borderRadius: 'var(--radius-btn)',
          border: 'none',
          background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))',
          color: '#fff',
          fontSize: '15px',
          fontWeight: 800,
          fontFamily: 'inherit',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: 'var(--space-4)',
          boxShadow: '0 4px 16px rgba(255,107,53,0.35)',
        }}
      >
        <Share2 size={18} />
        Share Season Scorecard
      </button>

      <SectionTitle>Preferences</SectionTitle>
      <Card className="mb-5">
        <ToggleRow label="Streak Reminders" enabled={streakReminder} onToggle={handleToggleStreak} />
        <div style={{ borderTop: '1px solid var(--color-border)' }} />
        <ToggleRow label="Weekly Summary" enabled={weeklySummary} onToggle={handleToggleWeekly} />
      </Card>

      <SectionTitle>Subscription</SectionTitle>
      <Card className="mb-5" hover onClick={() => navigate('/premium')}>
        <div className="flex items-center gap-3">
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: isPro ? 'linear-gradient(135deg, #D97706, #FBBF24)' : 'var(--color-accent-tint)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {isPro ? <Star size={20} style={{ color: '#fff' }} fill="#fff" /> : <Crown size={20} style={{ color: 'var(--color-accent)' }} />}
          </div>
          <div className="flex-1">
            <p className="t-body" style={{ fontWeight: 700, color: isPro ? '#FBBF24' : 'var(--color-text)' }}>
              {isPro ? 'CourtIQ Pro' : 'Free Plan'}
            </p>
            <p className="t-caption" style={{ color: 'var(--color-text-sec)' }}>
              {isPro ? 'All features unlocked' : 'Upgrade for unlimited access'}
            </p>
          </div>
          <ChevronRight size={16} style={{ color: 'var(--color-text-sec)' }} />
        </div>
      </Card>

      <SectionTitle>Account</SectionTitle>
      <Card className="mb-5">
        <Button variant="outline" fullWidth onClick={handleSignOut} className="mb-3">
          <LogOut className="w-4 h-4" /> Sign Out
        </Button>
      </Card>

      {/* Danger Zone */}
      <SectionTitle>Danger Zone</SectionTitle>
      <div
        style={{
          borderRadius: 'var(--radius-card)',
          border: '1px solid rgba(239,68,68,0.2)',
          backgroundColor: 'var(--color-card)',
          overflow: 'hidden',
          marginBottom: 'var(--space-5)',
        }}
      >
        <DangerAction
          icon={RotateCcw}
          title="Reset All Stats"
          description="Clears all games, shots, drills, journal entries, badges, and challenges. Your profile stays intact."
          buttonLabel="Reset Stats"
          confirmText="This will permanently delete all your tracked data. This cannot be undone."
          onAction={handleResetStats}
        />
        <DangerAction
          icon={Trash2}
          title="Erase Profile"
          description="Permanently deletes your profile, all data, and signs you out. Everything will be gone."
          buttonLabel="Erase Everything"
          confirmText="This will permanently erase your entire profile and all data. You will be signed out."
          onAction={handleEraseProfile}
        />
      </div>

      <p className="t-caption" style={{ textAlign: 'center', color: 'var(--color-text-sec)', marginBottom: 'var(--space-3)' }}>
        CourtIQ v1.0
      </p>

      {/* Season Share Card Modal */}
      {showShareCard && (
        <SeasonShareCard
          player={profile}
          stats={seasonAverages}
          onClose={() => setShowShareCard(false)}
        />
      )}
    </PageWrapper>
  )
}
