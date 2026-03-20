import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Save } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C']
const LEVELS = ['Beginner', 'Intermediate', 'Advanced']

export default function EditProfile() {
  const navigate = useNavigate()
  const { profile, updateProfile } = useAuth()

  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    position: profile?.position || '',
    skill_level: profile?.skill_level || '',
    date_of_birth: profile?.date_of_birth || '',
    recruiting_profile_public: profile?.recruiting_profile_public ?? false,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function update(key, value) {
    setForm(f => ({ ...f, [key]: value }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    const { error } = await updateProfile(form)
    setSaving(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <SectionHeader title="Edit Profile" subtitle="Update your player info." />
        </div>

        {/* Avatar */}
        <Card className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-blue/10 border border-blue-border flex items-center justify-center shrink-0">
            <User size={28} className="text-blue" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-text-primary">{form.full_name || 'Player'}</p>
            <p className="text-xs text-text-muted">{form.position || 'No position set'}</p>
          </div>
        </Card>

        {/* Form Fields */}
        <Card className="space-y-5">
          <Input
            label="Full Name"
            value={form.full_name}
            onChange={e => update('full_name', e.target.value)}
            placeholder="Your name"
          />

          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Position</label>
            <div className="grid grid-cols-5 gap-2">
              {POSITIONS.map(pos => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => update('position', pos)}
                  className={`py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    form.position === pos
                      ? 'bg-blue text-white'
                      : 'bg-bg-section border border-border text-text-secondary hover:border-blue-border'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Skill Level</label>
            <div className="grid grid-cols-3 gap-2">
              {LEVELS.map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => update('skill_level', lvl)}
                  className={`py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    form.skill_level === lvl
                      ? 'bg-blue text-white'
                      : 'bg-bg-section border border-border text-text-secondary hover:border-blue-border'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Date of Birth"
            type="date"
            value={form.date_of_birth}
            onChange={e => update('date_of_birth', e.target.value)}
          />

          {/* Recruiting toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">Public Recruiting Profile</p>
              <p className="text-xs text-text-muted">Allow coaches to find you</p>
            </div>
            <button
              type="button"
              onClick={() => update('recruiting_profile_public', !form.recruiting_profile_public)}
              className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${
                form.recruiting_profile_public ? 'bg-blue' : 'bg-bg-section border border-border'
              }`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                form.recruiting_profile_public ? 'left-[22px]' : 'left-0.5'
              }`} />
            </button>
          </div>
        </Card>

        {/* Save */}
        <Button fullWidth onClick={handleSave} disabled={saving}>
          <Save size={16} />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>
    </PageShell>
  )
}
