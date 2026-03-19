import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { OfflineProvider } from './context/OfflineContext'
import Header from './components/layout/Header'
import BottomNav from './components/layout/BottomNav'
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

function AppContent() {
  const { user, loading, profile } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#0B0B12' }}>
        <div className="text-slate-400 text-sm">Loading...</div>
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
    <div className="min-h-screen" style={{ backgroundColor: '#0B0B12', color: '#E2E8F0' }}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/training" element={<Training />} />
        <Route path="/drills" element={<Drills />} />
        <Route path="/shots" element={<Shots />} />
        <Route path="/games" element={<Games />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <OfflineProvider>
          <AppContent />
        </OfflineProvider>
      </ToastProvider>
    </AuthProvider>
  )
}
