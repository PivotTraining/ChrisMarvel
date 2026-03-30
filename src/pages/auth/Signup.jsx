import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { Play, Mail, Lock, Calendar, ShieldCheck } from 'lucide-react'

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

  const { signUp, demoSignIn } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

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
      await signUp(email, password, metadata)
      showToast('Account created! Check your email to verify.', 'success')
      navigate('/onboarding')
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleDemoLogin() {
    demoSignIn()
    showToast('Welcome to CourtIQ!', 'success')
    navigate('/')
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 0.875rem 0.75rem 2.5rem',
    borderRadius: '0.625rem',
    border: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    marginBottom: '0.5rem',
  }

  function handleFocus(e) {
    e.target.style.borderColor = 'var(--accent-primary)'
    e.target.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.12)'
  }

  function handleBlur(e) {
    e.target.style.borderColor = 'var(--border-subtle)'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
        padding: '1.5rem',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '2rem',
            color: 'var(--text-primary)',
            letterSpacing: '0.02em',
          }}
        >
          Join Court<span style={{ color: 'var(--accent-primary)' }}>IQ</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.375rem' }}>
          Create your player profile
        </p>
      </div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2rem 1.75rem' }}>
        {/* Demo button */}
        <button
          onClick={handleDemoLogin}
          style={{
            width: '100%',
            padding: '0.875rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(249, 115, 22, 0.3)',
            backgroundColor: 'rgba(249, 115, 22, 0.08)',
            color: 'var(--accent-primary)',
            fontSize: '0.9375rem',
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
            marginBottom: '1.75rem',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(249, 115, 22, 0.15)'
            e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(249, 115, 22, 0.08)'
            e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.3)'
          }}
        >
          <Play size={18} fill="currentColor" />
          Try Demo Instead
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            or create account
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={labelStyle}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password" style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="dob" style={labelStyle}>Date of Birth</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
          </div>

          {needsParentalConsent && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(249,115,22,0.06)',
                border: '1px solid rgba(249,115,22,0.15)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <ShieldCheck size={16} style={{ color: 'var(--accent-primary)' }} />
                <p style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 500 }}>
                  Parental consent required (under 13)
                </p>
              </div>
              <label htmlFor="parentEmail" style={labelStyle}>Parent/Guardian Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input id="parentEmail" type="email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} placeholder="parent@email.com" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
            </div>
          )}

          {error && (
            <p
              style={{
                color: '#ef4444',
                fontSize: '0.8125rem',
                marginBottom: '1rem',
                padding: '0.625rem 0.75rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.8125rem',
              borderRadius: '0.625rem',
              border: 'none',
              backgroundColor: 'var(--accent-primary)',
              color: '#fff',
              fontSize: '0.9375rem',
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.25)',
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = 'var(--accent-primary-hover)' }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = 'var(--accent-primary)' }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
