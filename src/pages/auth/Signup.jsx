import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { Mail, Lock, Calendar, ShieldCheck } from 'lucide-react'

function calculateAge(dob) {
  const today = new Date()
  const birth = new Date(dob)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [dob, setDob] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signUp, signIn } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const age = dob ? calculateAge(dob) : null
  const needsParentalConsent = age !== null && age < 13

  function validate() {
    if (!email || !password || !confirmPassword) {
      return 'Email, password, and confirm password are required.'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.'
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters.'
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match.'
    }
    if (needsParentalConsent && !parentEmail) {
      return 'Parent/guardian email is required for users under 13.'
    }
    if (needsParentalConsent && parentEmail && !emailRegex.test(parentEmail)) {
      return 'Please enter a valid parent/guardian email.'
    }
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)
      const metadata = { date_of_birth: dob }
      if (needsParentalConsent) {
        metadata.parent_email = parentEmail
        metadata.parental_consent_required = true
      }
      const result = await signUp(email, password, metadata)
      if (result?.session || result?.user?.email_confirmed_at) {
        showToast('Account created!', 'success')
        navigate('/onboarding')
      } else {
        // No session returned — email confirmation may still be on.
        // Auto-sign-in so the user isn't blocked by verification emails.
        try {
          await signIn(email, password)
          showToast('Account created!', 'success')
          navigate('/onboarding')
        } catch {
          showToast('Account created! Check your email to verify, then sign in.', 'success')
          navigate('/login')
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const iconStyle = { position: 'absolute', left: 'var(--space-2)', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-sec)', pointerEvents: 'none' }

  return (
    <div
      onClick={(e) => {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
          document.activeElement?.blur()
        }
      }}
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-bg)',
        padding: 'var(--space-3)',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
        <h1 className="t-title1" style={{ color: 'var(--color-text)' }}>
          Join Court<span style={{ color: 'var(--color-accent)' }}>IQ</span>
        </h1>
        <p className="t-body" style={{ color: 'var(--color-text-sec)', marginTop: 'var(--space-1)' }}>
          Start tracking your player's growth
        </p>
      </div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-4) var(--space-3)' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'var(--space-2)' }}>
            <label htmlFor="email" className="t-label" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={iconStyle} />
              <input id="email" type="email" inputMode="email" autoComplete="email" enterKeyHint="next" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="input-base" style={{ paddingLeft: '40px' }} />
            </div>
          </div>

          <div style={{ marginBottom: 'var(--space-2)' }}>
            <label htmlFor="password" className="t-label" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={iconStyle} />
              <input id="password" type="password" autoComplete="new-password" enterKeyHint="next" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" className="input-base" style={{ paddingLeft: '40px' }} />
            </div>
          </div>

          <div style={{ marginBottom: 'var(--space-2)' }}>
            <label htmlFor="confirmPassword" className="t-label" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={iconStyle} />
              <input id="confirmPassword" type="password" autoComplete="new-password" enterKeyHint="done" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" className="input-base" style={{ paddingLeft: '40px' }} />
            </div>
          </div>

          <div style={{ marginBottom: 'var(--space-2)' }}>
            <label htmlFor="dob" className="t-label" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>Date of Birth <span style={{ color: 'var(--color-text-sec)', fontWeight: 400 }}>(optional)</span></label>
            <div style={{ position: 'relative' }}>
              <Calendar size={16} style={iconStyle} />
              <input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="input-base" style={{ paddingLeft: '40px', colorScheme: 'dark' }} />
            </div>
          </div>

          {needsParentalConsent && (
            <div
              style={{
                marginBottom: 'var(--space-2)',
                padding: 'var(--space-2)',
                borderRadius: 'var(--radius-input)',
                backgroundColor: 'var(--color-accent-tint)',
                border: '1px solid rgba(255, 107, 53, 0.15)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', marginBottom: 'var(--space-1)' }}>
                <ShieldCheck size={16} style={{ color: 'var(--color-accent)' }} />
                <p className="t-caption" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
                  Parental consent required (under 13)
                </p>
              </div>
              <label htmlFor="parentEmail" className="t-label" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>Parent/Guardian Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={iconStyle} />
                <input id="parentEmail" type="email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} placeholder="parent@email.com" className="input-base" style={{ paddingLeft: '40px' }} />
              </div>
            </div>
          )}

          {error && (
            <p
              className="t-label"
              style={{
                color: 'var(--color-danger)',
                marginBottom: 'var(--space-2)',
                padding: 'var(--space-2)',
                borderRadius: 'var(--radius-input)',
                backgroundColor: 'var(--color-danger-tint)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
              }}
            >
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="t-body" style={{ textAlign: 'center', marginTop: 'var(--space-3)', color: 'var(--color-text-sec)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
