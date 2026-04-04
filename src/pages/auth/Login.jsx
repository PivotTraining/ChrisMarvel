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

  const inputWrapStyle = { position: 'relative', marginBottom: '14px' }
  const iconStyle = { position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-sec)', pointerEvents: 'none' }
  const inputStyle = {
    width: '100%',
    padding: '16px 16px 16px 46px',
    borderRadius: '14px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-input-bg)',
    color: 'var(--color-text)',
    fontSize: '15px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }

  function handleFocus(e) {
    e.target.style.borderColor = 'var(--color-accent)'
    e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.15)'
  }
  function handleBlur(e) {
    e.target.style.borderColor = 'var(--color-border)'
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
        backgroundColor: 'var(--color-bg)',
        padding: '24px',
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 24px rgba(255, 107, 53, 0.4)',
          }}
        >
          <span style={{ fontWeight: 900, fontSize: '28px', color: '#fff', letterSpacing: '-1px' }}>
            🏀
          </span>
        </div>
        <h1 className="t-title1" style={{ color: 'var(--color-text)' }}>
          Court<span style={{ color: 'var(--color-accent)' }}>IQ</span>
        </h1>
        <p className="t-body" style={{ color: 'var(--color-text-sec)', marginTop: '6px' }}>
          Your basketball performance tracker
        </p>
      </div>

      {/* Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '24px',
          padding: '28px 24px',
        }}
      >
        {/* Demo button */}
        <button
          onClick={handleDemoLogin}
          className="btn-primary"
          style={{ marginBottom: '20px' }}
        >
          <Play size={18} fill="currentColor" />
          Try Demo
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
          <span className="t-caption" style={{ color: 'var(--color-text-sec)', textTransform: 'uppercase', fontWeight: 600 }}>
            or sign in
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div style={inputWrapStyle}>
            <Mail size={18} style={iconStyle} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
          </div>

          <div style={{ ...inputWrapStyle, marginBottom: '20px' }}>
            <Lock size={18} style={iconStyle} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
          </div>

          {error && (
            <p
              style={{
                color: 'var(--color-danger)',
                fontSize: '13px',
                marginBottom: '16px',
                padding: '12px 14px',
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}
            >
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="t-body" style={{ textAlign: 'center', marginTop: '20px', color: 'var(--color-text-sec)', fontSize: '14px' }}>
          Don&apos;t have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 700 }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
