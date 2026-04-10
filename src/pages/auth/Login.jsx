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

  const { signIn } = useAuth()
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
          Track your player's journey
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
