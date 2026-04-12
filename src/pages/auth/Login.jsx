import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { Mail, Lock } from 'lucide-react'
import { supabase } from '../../lib/supabase'

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
  const [googleLoading, setGoogleLoading] = useState(false)

  const { signIn, signInWithGoogle } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const emailNotConfirmed = error === 'EMAIL_NOT_CONFIRMED'

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

  async function handleGoogle() {
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
      // Supabase redirects the browser — nothing to do here
    } catch (err) {
      showToast(err.message || 'Google sign-in failed.', 'error')
      setGoogleLoading(false)
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
