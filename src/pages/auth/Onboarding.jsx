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

  const inputStyle = {
    width: '100%',
    padding: '0.625rem 0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
    appearance: 'none',
    WebkitAppearance: 'none',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.375rem',
  }

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
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            style={{
              width: '0.5rem',
              height: '0.5rem',
              borderRadius: '50%',
              backgroundColor: i === step ? 'var(--accent-primary)' : 'var(--border-subtle)',
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
            <h2
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: '1.5rem',
                color: 'var(--text-primary)',
                marginBottom: '0.5rem',
                textAlign: 'center',
              }}
            >
              Tell Us About Yourself
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1.5rem' }}>
              We&apos;ll use this to personalize your experience.
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="name" style={labelStyle}>Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = 'var(--border-active)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="position" style={labelStyle}>Position</label>
              <select
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                style={{ ...inputStyle, colorScheme: 'dark', cursor: 'pointer' }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--border-active)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
              >
                <option value="">Select position</option>
                {POSITIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="skillLevel" style={labelStyle}>Skill Level</label>
              <select
                id="skillLevel"
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                style={{ ...inputStyle, colorScheme: 'dark', cursor: 'pointer' }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--border-active)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
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
            <h2
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: '1.5rem',
                color: 'var(--text-primary)',
                marginBottom: '0.5rem',
                textAlign: 'center',
              }}
            >
              What You Can Do
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1.5rem' }}>
              Here&apos;s a quick look at CourtIQ&apos;s key features.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {TOUR_CARDS.map((card, i) => (
                <div
                  key={i}
                  style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 600,
                      fontSize: '1rem',
                      color: 'var(--accent-primary)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {card.title}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
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
            <h2
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: '1.75rem',
                color: 'var(--text-primary)',
                marginBottom: '0.5rem',
                textAlign: 'center',
              }}
            >
              You&apos;re Ready!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '2rem', lineHeight: 1.6 }}>
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
        backgroundColor: 'var(--bg-primary)',
        padding: '1rem',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem 2rem' }}>
        {renderStep()}
        {renderProgressDots()}
      </div>
    </div>
  )
}
