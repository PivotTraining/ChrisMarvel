import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { Mail, Lock } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn, signInWithGoogle } = useAuth()
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

  async function handleGoogle() {
    setError('')
    try {
      setLoading(true)
      await signInWithGoogle()
      // OAuth redirects the browser; no further action needed here.
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.')
      setLoading(false)
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
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-5)' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: 'var(--space-3)',
            background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-3)',
            boxShadow: '0 8px 24px rgba(255, 107, 53, 0.4)',
          }}
        >
          <span className="t-title1" style={{ color: '#fff' }}>
            🏀
          </span>
        </div>
        <h1 className="t-title1" style={{ color: 'var(--color-text)' }}>
          Court<span style={{ color: 'var(--color-accent)' }}>IQ</span>
        </h1>
        <p className="t-body" style={{ color: 'var(--color-text-sec)', marginTop: 'var(--space-1)' }}>
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
          borderRadius: 'var(--radius-card)',
          padding: 'var(--space-4) var(--space-3)',
        }}
      >
        {/* Google sign-in */}
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
          <div style={{ position: 'relative', marginBottom: 'var(--space-2)' }}>
            <Mail size={18} style={{ position: 'absolute', left: 'var(--space-2)', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-sec)', pointerEvents: 'none' }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="input-base"
              style={{ paddingLeft: '46px' }}
            />
          </div>

          <div style={{ position: 'relative', marginBottom: 'var(--space-3)' }}>
            <Lock size={18} style={{ position: 'absolute', left: 'var(--space-2)', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-sec)', pointerEvents: 'none' }} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input-base"
              style={{ paddingLeft: '46px' }}
            />
          </div>

          {error && (
            <p
              className="t-label"
              style={{
                color: 'var(--color-danger)',
                marginBottom: 'var(--space-2)',
                padding: 'var(--space-2)',
                borderRadius: 'var(--radius-input)',
                backgroundColor: 'var(--color-danger-tint)',
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

        <p className="t-body" style={{ textAlign: 'center', marginTop: 'var(--space-3)', color: 'var(--color-text-sec)' }}>
          Don&apos;t have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 700 }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
