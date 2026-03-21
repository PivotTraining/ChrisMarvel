import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import OfflineBanner from './components/OfflineBanner'
import AppLayout from './layouts/AppLayout'

// Eagerly loaded (core navigation)
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'

// Lazy loaded (secondary pages)
const Log = lazy(() => import('./pages/Log'))
const LogGame = lazy(() => import('./pages/LogGame'))
const Train = lazy(() => import('./pages/Train'))
const LogDrill = lazy(() => import('./pages/LogDrill'))
const ShotTracker = lazy(() => import('./pages/ShotTracker'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Journal = lazy(() => import('./pages/Journal'))
const JournalEntry = lazy(() => import('./pages/JournalEntry'))
const Badges = lazy(() => import('./pages/Badges'))
const Library = lazy(() => import('./pages/Library'))
const ContentDetail = lazy(() => import('./pages/ContentDetail'))
const Profile = lazy(() => import('./pages/Profile'))
const EditProfile = lazy(() => import('./pages/EditProfile'))
const NotificationSettings = lazy(() => import('./pages/NotificationSettings'))
const About = lazy(() => import('./pages/About'))
const SavedContent = lazy(() => import('./pages/SavedContent'))
const JournalDetail = lazy(() => import('./pages/JournalDetail'))
const GameDetail = lazy(() => import('./pages/GameDetail'))
const DrillDetail = lazy(() => import('./pages/DrillDetail'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Landing = lazy(() => import('./pages/Landing'))
const Onboarding = lazy(() => import('./pages/Onboarding'))
const Goals = lazy(() => import('./pages/Goals'))
const Workouts = lazy(() => import('./pages/Workouts'))
const DataBackup = lazy(() => import('./pages/DataBackup'))
const Schedule = lazy(() => import('./pages/Schedule'))
const PricingPage = lazy(() => import('./pages/PricingPage'))

const basename = import.meta.env.BASE_URL

function PageLoader() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
      <OfflineBanner />
      <BrowserRouter basename={basename}>
        <AuthProvider>
          <ToastProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/welcome" element={<Landing />} />
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
                <Route path="log/:id" element={<GameDetail />} />
                <Route path="train" element={<Train />} />
                <Route path="train/new" element={<LogDrill />} />
                <Route path="train/:id" element={<DrillDetail />} />
                <Route path="shots" element={<ShotTracker />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="journal" element={<Journal />} />
                <Route path="journal/new" element={<JournalEntry />} />
                <Route path="journal/:id" element={<JournalDetail />} />
                <Route path="goals" element={<Goals />} />
                <Route path="workouts" element={<Workouts />} />
                <Route path="schedule" element={<Schedule />} />
                <Route path="badges" element={<Badges />} />
                <Route path="library" element={<Library />} />
                <Route path="library/:id" element={<ContentDetail />} />
                <Route path="profile" element={<Profile />} />
                <Route path="profile/edit" element={<EditProfile />} />
                <Route path="profile/notifications" element={<NotificationSettings />} />
                <Route path="saved" element={<SavedContent />} />
                <Route path="backup" element={<DataBackup />} />
                <Route path="pricing" element={<PricingPage />} />
                <Route path="about" element={<About />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
