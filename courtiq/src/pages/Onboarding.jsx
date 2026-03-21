import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Activity, ChevronRight, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import PageShell from '../components/ui/PageShell'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'

const POSITIONS = [
  { value: 'PG', label: 'Point Guard' },
  { value: 'SG', label: 'Shooting Guard' },
  { value: 'SF', label: 'Small Forward' },
  { value: 'PF', label: 'Power Forward' },
  { value: 'C', label: 'Center' },
]

const SKILL_LEVELS = [
  { value: 'Beginner', description: 'Just getting started' },
  { value: 'Intermediate', description: 'Solid fundamentals' },
  { value: 'Advanced', description: 'Competitive player' },
]

export default function Onboarding() {
  const { session, profile, updateProfile, loading } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [fullName, setFullName] = useState('')
  const [position, setPosition] = useState('')
  const [skillLevel, setSkillLevel] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (profile?.onboarding_completed) {
    return <Navigate to="/" replace />
  }

  async function handleComplete() {
    setError('')
    setSubmitting(true)

    const { error } = await updateProfile({
      full_name: fullName.trim(),
      position,
      skill_level: skillLevel,
      onboarding_completed: true,
    })

    if (error) {
      setError(error.message)
      setSubmitting(false)
    } else {
      navigate('/', { replace: true })
    }
  }

  const totalSteps = 3

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <PageShell>
        <div className="flex flex-col gap-10">
          {/* Progress */}
          <section className="space-y-6">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-2xl bg-blue/10 border border-blue-border flex items-center justify-center">
                <Activity size={28} className="text-blue" />
              </div>
            </div>

            {/* Step indicators */}
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i + 1 <= step ? 'w-10 bg-blue' : 'w-6 bg-border'
                  }`}
                />
              ))}
            </div>
          </section>

          {/* Step 1: Name */}
          {step === 1 && (
            <div className="flex flex-col gap-8">
              <section className="space-y-2 text-center">
                <h1 className="text-2xl font-bold text-text-primary">What's your name?</h1>
                <p className="text-sm text-text-secondary">This is how you'll appear in CourtIQ.</p>
              </section>

              <Input
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoFocus
              />

              <Button
                fullWidth
                disabled={!fullName.trim()}
                onClick={() => setStep(2)}
              >
                Continue
                <ChevronRight size={18} />
              </Button>
            </div>
          )}

          {/* Step 2: Position */}
          {step === 2 && (
            <div className="flex flex-col gap-8">
              <section className="space-y-2 text-center">
                <h1 className="text-2xl font-bold text-text-primary">What's your position?</h1>
                <p className="text-sm text-text-secondary">Pick your primary position on the court.</p>
              </section>

              <div className="space-y-3">
                {POSITIONS.map(({ value, label }) => (
                  <Card
                    key={value}
                    onClick={() => setPosition(value)}
                    className={`flex items-center justify-between cursor-pointer transition-all duration-200 ${
                      position === value
                        ? 'border-blue bg-blue/5'
                        : 'hover:border-border-blue'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-text-muted w-7">{value}</span>
                      <span className="text-sm font-medium text-text-primary">{label}</span>
                    </div>
                    {position === value && (
                      <Check size={18} className="text-blue" />
                    )}
                  </Card>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button
                  disabled={!position}
                  onClick={() => setStep(3)}
                  className="flex-1"
                >
                  Continue
                  <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Skill Level */}
          {step === 3 && (
            <div className="flex flex-col gap-8">
              <section className="space-y-2 text-center">
                <h1 className="text-2xl font-bold text-text-primary">Your skill level?</h1>
                <p className="text-sm text-text-secondary">We'll tailor your experience accordingly.</p>
              </section>

              <div className="space-y-3">
                {SKILL_LEVELS.map(({ value, description }) => (
                  <Card
                    key={value}
                    onClick={() => setSkillLevel(value)}
                    className={`cursor-pointer transition-all duration-200 ${
                      skillLevel === value
                        ? 'border-blue bg-blue/5'
                        : 'hover:border-border-blue'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-text-primary">{value}</p>
                        <p className="text-xs text-text-muted">{description}</p>
                      </div>
                      {skillLevel === value && (
                        <Check size={18} className="text-blue shrink-0" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {error && (
                <div className="rounded-xl bg-danger/10 border border-danger/20 px-4 py-3">
                  <p className="text-sm text-danger">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button
                  disabled={!skillLevel || submitting}
                  onClick={handleComplete}
                  className="flex-1"
                >
                  {submitting ? 'Saving…' : 'Get Started'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </PageShell>
    </div>
  )
}
