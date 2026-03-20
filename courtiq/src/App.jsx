import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'
import Log from './pages/Log'
import LogGame from './pages/LogGame'
import Train from './pages/Train'
import LogDrill from './pages/LogDrill'
import ShotTracker from './pages/ShotTracker'
import Analytics from './pages/Analytics'
import Journal from './pages/Journal'
import JournalEntry from './pages/JournalEntry'
import Badges from './pages/Badges'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Onboarding from './pages/Onboarding'

const basename = import.meta.env.BASE_URL

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Protected app routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="log" element={<Log />} />
            <Route path="log/new" element={<LogGame />} />
            <Route path="train" element={<Train />} />
            <Route path="train/new" element={<LogDrill />} />
            <Route path="shots" element={<ShotTracker />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="journal" element={<Journal />} />
            <Route path="journal/new" element={<JournalEntry />} />
            <Route path="badges" element={<Badges />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
