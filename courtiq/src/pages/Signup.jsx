import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Activity } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import PageShell from '../components/ui/PageShell'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Signup() {
  const { session, signUp, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

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

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setSubmitting(true)
    const { error } = await signUp(email, password)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setSubmitting(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <PageShell>
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center">
              <Activity size={28} className="text-success" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-text-primary">Check your email</h1>
              <p className="text-sm text-text-secondary max-w-xs">
                We sent a confirmation link to <span className="text-text-primary font-medium">{email}</span>. Click it to activate your account.
              </p>
            </div>
            <Link to="/login">
              <Button variant="secondary">Back to Sign In</Button>
            </Link>
          </div>
        </PageShell>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <PageShell>
        <div className="flex flex-col gap-10">
          {/* Logo & Title */}
          <section className="space-y-3 text-center">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-2xl bg-blue/10 border border-blue-border flex items-center justify-center">
                <Activity size={28} className="text-blue" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-text-primary">Create your account</h1>
              <p className="text-sm text-text-secondary">Start tracking your basketball development.</p>
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
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-danger/10 border border-danger/20 px-4 py-3">
                <p className="text-sm text-danger">{error}</p>
              </div>
            )}

            <Button type="submit" fullWidth disabled={submitting}>
              {submitting ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-blue font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </PageShell>
    </div>
  )
}
