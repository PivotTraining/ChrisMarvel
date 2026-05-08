import { useState, useCallback, lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { OfflineProvider } from './context/OfflineContext'
import { PremiumProvider } from './context/PremiumContext'
import { LinkingProvider } from './context/LinkingContext'
import Header from './components/layout/Header'
import BottomNav from './components/layout/BottomNav'
import SplashScreen from './components/SplashScreen'
// Home stays eager — it's the first screen most users see.
import Home from './pages/home/Home'
// Everything else is lazy-loaded so the initial bundle stays small.
const Login = lazy(() => import('./pages/auth/Login'))
const Signup = lazy(() => import('./pages/auth/Signup'))
const Onboarding = lazy(() => import('./pages/auth/Onboarding'))
const Training = lazy(() => import('./pages/training/Training'))
const Drills = lazy(() => import('./pages/drills/Drills'))
const Shots = lazy(() => import('./pages/shots/Shots'))
const Games = lazy(() => import('./pages/games/Games'))
const Journal = lazy(() => import('./pages/journal/Journal'))
const Settings = lazy(() => import('./pages/settings/Settings'))
const Gametime = lazy(() => import('./pages/quickgame/QuickGame'))
const Practice = lazy(() => import('./pages/practice/Practice'))
const Support = lazy(() => import('./pages/support/Support'))

function RouteFallback() {
  return (
    <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-sec)' }}>
      <div
        style={{
          width: '28px',
          height: '28px',
          border: '3px solid rgba(255,255,255,0.08)',
          borderTopColor: 'var(--color-accent)',
          borderRadius: '50%',
          margin: '0 auto',
          animation: 'spin 0.8s linear infinite',
        }}
      />
    </div>
  )
}

function AppContent() {
  const { user, loading, profile } = useAuth()
  // Only play the splash once per browser session — refreshes skip it
  const [splashDone, setSplashDone] = useState(() => {
    try { return sessionStorage.getItem('courtiq_splash_shown') === '1' } catch { return false }
  })
  const handleSplashFinish = useCallback(() => {
    try { sessionStorage.setItem('courtiq_splash_shown', '1') } catch { /* noop */ }
    setSplashDone(true)
  }, [])

  // Show splash on first load (covers auth loading too)
  if (!splashDone) {
    return <SplashScreen onFinish={handleSplashFinish} />
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 className="t-title2" style={{ color: 'var(--color-text)', marginBottom: '16px' }}>
            Court<span style={{ color: 'var(--color-accent)' }}>IQ</span>
          </h1>
          <div
            style={{
              width: '32px',
              height: '32px',
              border: '3px solid rgba(255,255,255,0.08)',
              borderTopColor: 'var(--color-accent)',
              borderRadius: '50%',
              margin: '0 auto',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  // Not authenticated — show login/signup routes
  if (!user) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/support" element={<Support />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    )
  }

  // Authenticated but onboarding not completed
  if (profile && !profile.onboarding_completed) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/support" element={<Support />} />
          <Route path="*" element={<Navigate to="/onboarding" replace />} />
        </Routes>
      </Suspense>
    )
  }

  // Authenticated and onboarded — main app
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <Header />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/training" element={<Training />} />
          <Route path="/drills" element={<Drills />} />
          <Route path="/shots" element={<Shots />} />
          <Route path="/games" element={<Games />} />
          {/* /gametime is the canonical route. /quick-game is kept for backwards-compat. */}
          <Route path="/gametime" element={<Gametime />} />
          <Route path="/quick-game" element={<Navigate to="/gametime" replace />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/support" element={<Support />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <PremiumProvider>
        <ToastProvider>
          <OfflineProvider>
            <LinkingProvider>
              <AppContent />
            </LinkingProvider>
          </OfflineProvider>
        </ToastProvider>
      </PremiumProvider>
    </AuthProvider>
  )
}
