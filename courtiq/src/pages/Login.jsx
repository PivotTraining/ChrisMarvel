import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Activity } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import PageShell from '../components/ui/PageShell'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.0 24.0 0 0 0 0 21.56l7.98-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}

export default function Login() {
  const { session, signIn, signInWithGoogle, resetPassword, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetting, setResetting] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (session) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const { error } = await signIn(email, password)
    if (error) {
      setError(error.message)
    }
    setSubmitting(false)
  }

  async function handleGoogleSignIn() {
    setError('')
    setGoogleLoading(true)
    const { error } = await signInWithGoogle()
    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
    // On success the browser redirects, so we stay in loading state
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <PageShell>
        <div className="flex flex-col gap-10">
          {/* Logo & Welcome */}
          <section className="space-y-3 text-center">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-2xl bg-blue/10 border border-blue-border flex items-center justify-center">
                <Activity size={28} className="text-blue" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
              <p className="text-sm text-text-secondary">Sign in to continue your training.</p>
            </div>
          </section>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                disabled={resetting}
                onClick={async () => {
                  if (!email) { setError('Enter your email first.'); return }
                  setError('')
                  setResetting(true)
                  const { error } = await resetPassword(email)
                  setResetting(false)
                  if (error) { setError(error.message); return }
                  setResetSent(true)
                }}
                className="text-xs text-blue hover:underline font-medium"
              >
                {resetting ? 'Sending...' : 'Forgot password?'}
              </button>
            </div>

            {resetSent && (
              <div className="rounded-xl bg-success/10 border border-success/20 px-4 py-3">
                <p className="text-sm text-success">Reset link sent! Check your email.</p>
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-danger/10 border border-danger/20 px-4 py-3">
                <p className="text-sm text-danger">{error}</p>
              </div>
            )}

            <Button type="submit" fullWidth disabled={submitting}>
              {submitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Social Auth — hidden when supabase client is null (demo mode) */}
          {supabase && (
            <>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-text-muted uppercase tracking-wide">or continue with</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm py-3 px-4 rounded-xl border border-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {googleLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                {googleLoading ? 'Redirecting...' : 'Sign in with Google'}
              </button>
            </>
          )}

          {/* Footer */}
          <p className="text-center text-sm text-text-muted">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue font-medium hover:underline">
              Sign up
            </Link>
          </p>

          <footer className="flex justify-center gap-4 text-[10px] text-text-muted">
            <Link to="/terms" className="hover:text-text-secondary transition-colors">Terms of Service</Link>
            <span aria-hidden="true">&middot;</span>
            <Link to="/privacy" className="hover:text-text-secondary transition-colors">Privacy Policy</Link>
          </footer>
        </div>
      </PageShell>
    </div>
  )
}
