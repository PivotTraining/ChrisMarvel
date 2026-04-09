import { useState, useCallback } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { OfflineProvider } from './context/OfflineContext'
import { PremiumProvider } from './context/PremiumContext'
import Header from './components/layout/Header'
import BottomNav from './components/layout/BottomNav'
import SplashScreen from './components/SplashScreen'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Onboarding from './pages/auth/Onboarding'
import Home from './pages/home/Home'
import Training from './pages/training/Training'
import Drills from './pages/drills/Drills'
import Shots from './pages/shots/Shots'
import Games from './pages/games/Games'
import Journal from './pages/journal/Journal'
import Settings from './pages/settings/Settings'
import QuickGame from './pages/quickgame/QuickGame'
import Practice from './pages/practice/Practice'
import Premium from './pages/premium/Premium'

function AppContent() {
  const { user, loading, profile } = useAuth()
  const [splashDone, setSplashDone] = useState(false)
  const handleSplashFinish = useCallback(() => setSplashDone(true), [])

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
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  // Authenticated but onboarding not completed
  if (profile && !profile.onboarding_completed) {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    )
  }

  // Authenticated and onboarded — main app
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/training" element={<Training />} />
        <Route path="/drills" element={<Drills />} />
        <Route path="/shots" element={<Shots />} />
        <Route path="/games" element={<Games />} />
        <Route path="/quick-game" element={<QuickGame />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
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
            <AppContent />
          </OfflineProvider>
        </ToastProvider>
      </PremiumProvider>
    </AuthProvider>
  )
}
