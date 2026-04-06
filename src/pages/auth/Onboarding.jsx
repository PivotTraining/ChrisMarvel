import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/ui/Button'

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C']
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const TOTAL_STEPS = 3

const TOUR_CARDS = [
  {
    title: 'Track Your Shots',
    description: 'Log every shot with location, type, and result to build a detailed picture of your game.',
  },
  {
    title: 'Smart Analytics',
    description: 'Get AI-powered insights that highlight patterns and help you focus on what matters most.',
  },
  {
    title: 'Personalized Drills',
    description: 'Receive custom drill recommendations based on your weaknesses and goals.',
  },
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [skillLevel, setSkillLevel] = useState('')
  const [loading, setLoading] = useState(false)

  const { updateProfile } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  async function handleFinish() {
    try {
      setLoading(true)
      await updateProfile({
        full_name: name,
        position,
        skill_level: skillLevel,
        onboarding_completed: true,
      })
      showToast('You\'re all set! Welcome to CourtIQ.', 'success')
      navigate('/')
    } catch (err) {
      showToast(err.message || 'Failed to save profile.', 'error')
    } finally {
      setLoading(false)
    }
  }

  function handleNext() {
    if (step === 0) {
      if (!name.trim() || !position || !skillLevel) {
        showToast('Please fill in all fields.', 'error')
        return
      }
    }
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1)
    }
  }

  function renderProgressDots() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-1)', marginTop: 'var(--space-4)' }}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 'var(--space-1)',
              height: 'var(--space-1)',
              borderRadius: '50%',
              backgroundColor: i === step ? 'var(--color-accent)' : 'var(--color-border)',
              transition: 'background-color 0.2s',
            }}
          />
        ))}
      </div>
    )
  }

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <>
            <h2 className="t-title2" style={{ textAlign: 'center', marginBottom: 'var(--space-1)' }}>
              Tell Us About Yourself
            </h2>
            <p className="t-body" style={{ color: 'var(--color-text-sec)', textAlign: 'center', marginBottom: 'var(--space-3)' }}>
              We&apos;ll use this to personalize your experience.
            </p>

            <div style={{ marginBottom: 'var(--space-2)' }}>
              <label htmlFor="name" className="t-label" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="input-base"
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: 'var(--space-2)' }}>
              <label htmlFor="position" className="t-label" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>Position</label>
              <select
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="input-base"
                style={{ width: '100%', colorScheme: 'dark', cursor: 'pointer', appearance: 'none' }}
              >
                <option value="">Select position</option>
                {POSITIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 'var(--space-3)' }}>
              <label htmlFor="skillLevel" className="t-label" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>Skill Level</label>
              <select
                id="skillLevel"
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                className="input-base"
                style={{ width: '100%', colorScheme: 'dark', cursor: 'pointer', appearance: 'none' }}
              >
                <option value="">Select level</option>
                {SKILL_LEVELS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <Button fullWidth onClick={handleNext}>
              Next
            </Button>
          </>
        )

      case 1:
        return (
          <>
            <h2 className="t-title2" style={{ textAlign: 'center', marginBottom: 'var(--space-1)' }}>
              What You Can Do
            </h2>
            <p className="t-body" style={{ color: 'var(--color-text-sec)', textAlign: 'center', marginBottom: 'var(--space-3)' }}>
              Here&apos;s a quick look at CourtIQ&apos;s key features.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', marginBottom: 'var(--space-3)' }}>
              {TOUR_CARDS.map((card, i) => (
                <div
                  key={i}
                  style={{
                    padding: 'var(--space-2)',
                    borderRadius: 'var(--radius-card)',
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <h3 className="t-title3" style={{ color: 'var(--color-accent)', marginBottom: '4px' }}>
                    {card.title}
                  </h3>
                  <p className="t-body" style={{ color: 'var(--color-text-sec)', lineHeight: 1.5 }}>
                    {card.description}
                  </p>
                </div>
              ))}
            </div>

            <Button fullWidth onClick={handleNext}>
              Next
            </Button>
          </>
        )

      case 2:
        return (
          <>
            <h2 className="t-title1" style={{ textAlign: 'center', marginBottom: 'var(--space-1)' }}>
              You&apos;re Ready!
            </h2>
            <p className="t-body" style={{ color: 'var(--color-text-sec)', textAlign: 'center', marginBottom: 'var(--space-4)', lineHeight: 1.6 }}>
              Your profile is set up. Start tracking your game, get insights, and level up your basketball skills.
            </p>

            <Button fullWidth loading={loading} onClick={handleFinish}>
              Let&apos;s Go
            </Button>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-bg)',
        padding: 'var(--space-2)',
      }}
    >
      <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: 'var(--space-5) var(--space-4)' }}>
        {renderStep()}
        {renderProgressDots()}
      </div>
    </div>
  )
}
