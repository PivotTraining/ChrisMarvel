import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { Mail, Lock } from 'lucide-react'
import { supabase } from '../../lib/supabase'

function friendlyError(msg) {
  if (!msg) return 'Failed to log in. Please try again.'
  const m = msg.toLowerCase()
  if (m.includes('email not confirmed') || m.includes('not confirmed'))
    return 'EMAIL_NOT_CONFIRMED'
  if (m.includes('invalid login') || m.includes('invalid credentials') || m.includes('wrong password'))
    return 'Wrong email or password. Double-check and try again, or sign up if you don\'t have an account.'
  if (m.includes('user not found') || m.includes('no user'))
    return 'No account found with that email. Try signing up instead.'
  if (m.includes('too many') || m.includes('rate limit'))
    return 'Too many attempts. Please wait a minute and try again.'
  return msg
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSent, setResendSent] = useState(false)

  const { signIn, user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const emailNotConfirmed = error === 'EMAIL_NOT_CONFIRMED'

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

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
      setError(friendlyError(err.message))
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setResendLoading(true)
    try {
      await supabase.auth.resend({ type: 'signup', email })
      setResendSent(true)
      showToast('Confirmation email sent!', 'success')
    } catch {
      showToast('Could not resend. Try again shortly.', 'error')
    } finally {
      setResendLoading(false)
    }
  }

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
              inputMode="email"
              autoComplete="email"
              enterKeyHint="next"
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
              autoComplete="current-password"
              enterKeyHint="go"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input-base"
              style={{ paddingLeft: '46px' }}
            />
          </div>

          {error && (
            <div
              style={{
                color: emailNotConfirmed ? 'var(--color-warning, #B45309)' : 'var(--color-danger)',
                marginBottom: 'var(--space-2)',
                padding: 'var(--space-2)',
                borderRadius: 'var(--radius-input)',
                backgroundColor: emailNotConfirmed ? 'rgba(245,158,11,0.1)' : 'var(--color-danger-tint)',
                border: emailNotConfirmed ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(239,68,68,0.2)',
              }}
            >
              {emailNotConfirmed ? (
                <>
                  <p className="t-label" style={{ margin: 0 }}>
                    📬 Check your inbox — we sent you a confirmation email when you signed up. Click the link to activate your account.
                  </p>
                  {!resendSent ? (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendLoading || !email}
                      style={{
                        marginTop: 8, background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--color-accent)', fontWeight: 700, fontSize: 13, padding: 0,
                      }}
                    >
                      {resendLoading ? 'Sending…' : 'Resend confirmation email →'}
                    </button>
                  ) : (
                    <p className="t-label" style={{ margin: '6px 0 0', color: 'var(--color-success, #15803D)' }}>
                      ✓ Email sent — check your inbox and spam folder.
                    </p>
                  )}
                </>
              ) : (
                <p className="t-label" style={{ margin: 0 }}>{error}</p>
              )}
            </div>
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
