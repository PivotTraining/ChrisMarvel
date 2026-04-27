import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { Mail, Lock, Calendar, ShieldCheck } from 'lucide-react'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

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

  const { signUp, signInWithGoogle, signInWithApple } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [googleLoading, setGoogleLoading] = useState(false)
  const [appleLoading, setAppleLoading] = useState(false)

  async function handleGoogle() {
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      showToast(err.message || 'Google sign-in failed.', 'error')
      setGoogleLoading(false)
    }
  }

  async function handleApple() {
    setAppleLoading(true)
    try {
      await signInWithApple()
    } catch (err) {
      showToast(err.message || 'Apple sign-in failed.', 'error')
      setAppleLoading(false)
    }
  }

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
          Start tracking your player's growth
        </p>
      </div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-4) var(--space-3)' }}>
        {/* Apple sign-in */}
        <button
          type="button"
          onClick={handleApple}
          disabled={appleLoading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '12px 16px',
            borderRadius: 'var(--radius-input)',
            background: '#000',
            border: '1px solid #000',
            color: '#fff',
            fontSize: 15,
            fontWeight: 600,
            cursor: appleLoading ? 'not-allowed' : 'pointer',
            marginBottom: 'var(--space-2)',
            opacity: appleLoading ? 0.6 : 1,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.32.07 2.23.74 3 .8 1.14-.17 2.23-.85 3.41-.76 1.44.12 2.53.65 3.26 1.63-3 1.82-2.29 5.62.54 6.66-.65 1.68-1.48 3.33-2.21 4.55zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          {appleLoading ? 'Redirecting…' : 'Continue with Apple'}
        </button>

        {/* Google sign-in */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '12px 16px',
            borderRadius: 'var(--radius-input)',
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
            fontSize: 15,
            fontWeight: 600,
            cursor: googleLoading ? 'not-allowed' : 'pointer',
            marginBottom: 'var(--space-2)',
            opacity: googleLoading ? 0.6 : 1,
          }}
        >
          <GoogleIcon />
          {googleLoading ? 'Redirecting…' : 'Continue with Google'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-2)' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          <span style={{ fontSize: 12, color: 'var(--color-text-sec)', fontWeight: 500 }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
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
