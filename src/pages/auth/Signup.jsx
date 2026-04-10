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

  const { signUp, signInWithGoogle } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  async function handleGoogle() {
    setError('')
    try {
      setLoading(true)
      await signInWithGoogle()
      // OAuth redirects the browser; no further action here.
    } catch (err) {
      setError(err.message || 'Google sign-up failed. Please try again.')
      setLoading(false)
    }
  }

  const age = dob ? calculateAge(dob) : null
  const needsParentalConsent = age !== null && age < 13

  function validate() {
    if (!email || !password || !confirmPassword || !dob) {
      return 'All fields are required.'
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
      // If session exists, user is auto-confirmed — go to onboarding
      if (result?.session || result?.user?.email_confirmed_at) {
        showToast('Account created!', 'success')
        navigate('/onboarding')
      } else {
        // Email confirmation required — stay on page
        showToast('Account created! Check your email to verify, then sign in.', 'success')
        navigate('/login')
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
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
        <h1 className="t-title1" style={{ color: 'var(--color-text)' }}>
          Join Court<span style={{ color: 'var(--color-accent)' }}>IQ</span>
        </h1>
        <p className="t-body" style={{ color: 'var(--color-text-sec)', marginTop: 'var(--space-1)' }}>
          Create your player profile
        </p>
      </div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-4) var(--space-3)' }}>
        {/* Google sign-up */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: 'var(--radius-input)',
            border: '1px solid var(--color-border)',
            background: '#fff',
            color: '#1f1f1f',
            fontSize: '15px',
            fontWeight: 700,
            fontFamily: 'inherit',
            cursor: loading ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: 'var(--space-3)',
            opacity: loading ? 0.7 : 1,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-3)' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
          <span className="t-caption" style={{ color: 'var(--color-text-sec)' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'var(--space-2)' }}>
            <label htmlFor="email" className="t-label" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={iconStyle} />
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="input-base" style={{ paddingLeft: '40px' }} />
            </div>
          </div>

          <div style={{ marginBottom: 'var(--space-2)' }}>
            <label htmlFor="password" className="t-label" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={iconStyle} />
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" className="input-base" style={{ paddingLeft: '40px' }} />
            </div>
          </div>

          <div style={{ marginBottom: 'var(--space-2)' }}>
            <label htmlFor="confirmPassword" className="t-label" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={iconStyle} />
              <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" className="input-base" style={{ paddingLeft: '40px' }} />
            </div>
          </div>

          <div style={{ marginBottom: 'var(--space-2)' }}>
            <label htmlFor="dob" className="t-label" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>Date of Birth</label>
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
