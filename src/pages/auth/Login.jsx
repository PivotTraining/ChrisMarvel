import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { Play, Mail, Lock } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn, demoSignIn } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    try {
      setLoading(true)
      await signIn(email, password)
      showToast('Welcome back!', 'success')
      navigate('/')
    } catch (err) {
      setError(err.message || 'Failed to log in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleDemoLogin() {
    demoSignIn()
    showToast('Welcome to CourtIQ!', 'success')
    navigate('/')
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
      {/* Logo area */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            backgroundColor: 'rgba(249, 115, 22, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}
        >
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '1.5rem',
              color: 'var(--accent-primary)',
            }}
          >
            CIQ
          </span>
        </div>
        <h1
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '2.25rem',
            color: 'var(--text-primary)',
            letterSpacing: '0.02em',
          }}
        >
          Court<span style={{ color: 'var(--accent-primary)' }}>IQ</span>
        </h1>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            marginTop: '0.5rem',
          }}
        >
          Your basketball development companion
        </p>
      </div>

      {/* Card */}
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '2rem 1.75rem',
        }}
      >
        {/* Demo Login Button */}
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
          Try Demo
        </button>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.75rem',
          }}
        >
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            or sign in
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
              }}
            >
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.875rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                style={{
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
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.12)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-subtle)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.875rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                style={{
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
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.12)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-subtle)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
          </div>

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
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = 'var(--accent-primary-hover)'
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = 'var(--accent-primary)'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p
          style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
          }}
        >
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            style={{
              color: 'var(--accent-primary)',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Sign Up
          </Link>
        </p>
      </div>

      {/* Footer */}
      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.6875rem',
          marginTop: '2rem',
          opacity: 0.6,
        }}
      >
        CourtIQ v1.0
      </p>
    </div>
  )
}
