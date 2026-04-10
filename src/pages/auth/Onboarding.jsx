import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C']
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Elite']
const TOTAL_STEPS = 3

const TOUR_CARDS = [
  {
    emoji: '📊',
    title: 'Track Every Game',
    description: 'Log stats after each game. Watch growth week by week, season by season.',
  },
  {
    emoji: '🔍',
    title: 'Spot Weaknesses Early',
    description: 'Analytics surface exactly where your player needs work — before the coach has to say it.',
  },
  {
    emoji: '🏆',
    title: 'Keep Them Motivated',
    description: 'XP, streaks, and milestone badges make improvement feel rewarding and fun.',
  },
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState('forward')
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
      showToast(`Welcome! Let's get ${name || 'your player'} to the next level.`, 'success')
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
        showToast('Please fill in all fields to continue.', 'error')
        return
      }
    }
    if (step < TOTAL_STEPS - 1) {
      setDirection('forward')
      setStep(step + 1)
    }
  }

  function handleBack() {
    if (step > 0) {
      setDirection('back')
      setStep(step - 1)
    }
  }

  const progressPct = Math.round(((step + 1) / TOTAL_STEPS) * 100)

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <div key="step-0" style={{ animation: 'fadeUp 0.35s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-3)' }}>
              <div style={{ fontSize: '40px', marginBottom: 'var(--space-1)' }}>🏀</div>
              <h2 className="t-title2" style={{ marginBottom: '8px' }}>
                Set up your player's profile
              </h2>
              <p className="t-body" style={{ color: 'var(--color-text-sec)' }}>
                Tell us who you're tracking so we can personalize everything.
              </p>
            </div>

            <div style={{ marginBottom: 'var(--space-2)' }}>
              <label htmlFor="name" className="t-label" style={{ display: 'block', marginBottom: '6px', color: 'var(--color-text-sec)', fontWeight: 600 }}>
                Player's Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Marcus"
                className="input-base"
                style={{ width: '100%' }}
                autoFocus
              />
            </div>

            <div style={{ marginBottom: 'var(--space-2)' }}>
              <label className="t-label" style={{ display: 'block', marginBottom: '6px', color: 'var(--color-text-sec)', fontWeight: 600 }}>
                Position
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {POSITIONS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPosition(p)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '12px',
                      border: position === p ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                      background: position === p ? 'var(--color-accent-tint)' : 'var(--color-input-bg)',
                      color: position === p ? 'var(--color-accent)' : 'var(--color-text-sec)',
                      fontWeight: 700,
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 'var(--space-3)' }}>
              <label className="t-label" style={{ display: 'block', marginBottom: '6px', color: 'var(--color-text-sec)', fontWeight: 600 }}>
                Skill Level
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {SKILL_LEVELS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSkillLevel(s)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '12px',
                      border: skillLevel === s ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                      background: skillLevel === s ? 'var(--color-accent-tint)' : 'var(--color-input-bg)',
                      color: skillLevel === s ? 'var(--color-accent)' : 'var(--color-text-sec)',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button type="button" onClick={handleNext} className="btn-primary">
              Continue
            </button>
          </div>
        )

      case 1:
        return (
          <div key="step-1" style={{ animation: 'fadeUp 0.35s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-3)' }}>
              <div style={{ fontSize: '40px', marginBottom: 'var(--space-1)' }}>💡</div>
              <h2 className="t-title2" style={{ marginBottom: '8px' }}>
                Here's what CourtIQ does
              </h2>
              <p className="t-body" style={{ color: 'var(--color-text-sec)' }}>
                Built for parents and coaches who want to see real growth.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: 'var(--space-3)' }}>
              {TOUR_CARDS.map((card, i) => (
                <div
                  key={i}
                  style={{
                    padding: 'var(--space-2)',
                    borderRadius: 'var(--radius-card)',
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    animation: `fadeUp 0.35s ease ${i * 0.08}s both`,
                  }}
                >
                  <span style={{ fontSize: '28px', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}>{card.emoji}</span>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '4px' }}>
                      {card.title}
                    </h3>
                    <p className="t-body" style={{ color: 'var(--color-text-sec)', lineHeight: 1.5 }}>
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handleBack}
                style={{
                  flex: '0 0 auto',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border)',
                  background: 'transparent',
                  color: 'var(--color-text-sec)',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Back
              </button>
              <button type="button" onClick={handleNext} className="btn-primary">
                Continue
              </button>
            </div>
          </div>
        )

      case 2:
        return (
          <div key="step-2" style={{ animation: 'fadeUp 0.35s ease', textAlign: 'center' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-3)',
                boxShadow: '0 8px 32px rgba(255, 107, 53, 0.4)',
                fontSize: '36px',
              }}
            >
              🏀
            </div>

            <h2 className="t-title1" style={{ marginBottom: '12px' }}>
              {name ? `${name}'s ready!` : "You're all set!"}
            </h2>
            <p className="t-body" style={{ color: 'var(--color-text-sec)', lineHeight: 1.7, marginBottom: 'var(--space-4)', maxWidth: '280px', margin: '0 auto var(--space-4)' }}>
              Start by logging a game after practice, and CourtIQ will begin building {name ? `${name}'s` : "your player's"} story.
            </p>

            <button
              type="button"
              onClick={handleFinish}
              disabled={loading}
              className="btn-primary"
              style={{ marginBottom: '12px' }}
            >
              {loading ? 'Setting up…' : 'Start Tracking'}
            </button>

            <button
              type="button"
              onClick={handleBack}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '16px',
                border: 'none',
                background: 'transparent',
                color: 'var(--color-text-sec)',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Go back
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-bg)',
        padding: 'var(--space-3)',
      }}
    >
      <div
        className="glass-card"
        style={{ width: '100%', maxWidth: '420px', padding: 'var(--space-4)' }}
      >
        {/* Progress bar */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <div
            style={{
              height: '4px',
              borderRadius: '99px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progressPct}%`,
                borderRadius: '99px',
                background: 'linear-gradient(90deg, var(--color-accent), var(--color-accent-dark))',
                transition: 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />
          </div>
          <p className="t-caption" style={{ color: 'var(--color-text-sec)', marginTop: '6px', textAlign: 'right' }}>
            Step {step + 1} of {TOTAL_STEPS}
          </p>
        </div>

        {renderStep()}
      </div>
    </div>
  )
}
