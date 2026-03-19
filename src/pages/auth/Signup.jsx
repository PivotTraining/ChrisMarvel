import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/ui/Button'

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

  const { signUp } = useAuth()
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
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.375rem',
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
        <h1
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '2rem',
            textAlign: 'center',
            color: 'var(--text-primary)',
            marginBottom: '2rem',
          }}
        >
          Court<span style={{ color: 'var(--accent-primary)' }}>IQ</span>
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="email" style={labelStyle}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = 'var(--border-active)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="password" style={labelStyle}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = 'var(--border-active)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = 'var(--border-active)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="dob" style={labelStyle}>Date of Birth</label>
            <input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              style={{ ...inputStyle, colorScheme: 'dark' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--border-active)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
            />
          </div>

          {needsParentalConsent && (
            <div
              style={{
                marginBottom: '1.25rem',
                padding: '1rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(249,115,22,0.08)',
                border: '1px solid rgba(249,115,22,0.2)',
              }}
            >
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--accent-primary)',
                  marginBottom: '0.75rem',
                  fontWeight: 500,
                }}
              >
                Since you are under 13, parental consent is required. Please provide a parent or guardian&apos;s email address.
              </p>
              <label htmlFor="parentEmail" style={labelStyle}>Parent/Guardian Email</label>
              <input
                id="parentEmail"
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                placeholder="parent@email.com"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = 'var(--border-active)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
              />
            </div>
          )}

          {error && (
            <p
              style={{
                color: '#ef4444',
                fontSize: '0.8125rem',
                marginBottom: '1rem',
              }}
            >
              {error}
            </p>
          )}

          <Button type="submit" fullWidth loading={loading}>
            Create Account
          </Button>
        </form>

        <p
          style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
          }}
        >
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: 'var(--accent-primary)',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  )
}
