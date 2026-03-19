import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { OfflineProvider } from './context/OfflineContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';

import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';

// Auth pages (small, loaded eagerly for instant auth UX)
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Onboarding from './pages/auth/Onboarding';

// App pages (lazy-loaded for code splitting)
const Home = lazy(() => import('./pages/home/Home'));
const Train = lazy(() => import('./pages/train/Train'));
const Drills = lazy(() => import('./pages/drills/Drills'));
const Shots = lazy(() => import('./pages/shots/Shots'));
const Games = lazy(() => import('./pages/games/Games'));
const Journal = lazy(() => import('./pages/journal/Journal'));
const Settings = lazy(() => import('./pages/settings/Settings'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-6 w-6 animate-spin text-accent-primary" />
    </div>
  );
}

function AppRoutes() {
  const { user, profile, loading } = useAuth();

  /* ── Full-screen loading spinner ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <Loader2 className="h-8 w-8 animate-spin text-accent-primary" />
      </div>
    );
  }

  /* ── Not authenticated — auth routes only ── */
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  /* ── Authenticated but onboarding incomplete ── */
  if (profile && !profile.onboarding_completed) {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  /* ── Authenticated and onboarded — full app ── */
  return (
    <>
      <Header />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/train" element={<Train />} />
          <Route path="/drills" element={<Drills />} />
          <Route path="/shots" element={<Shots />} />
          <Route path="/games" element={<Games />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <BottomNav />
    </>
  );
}

export default function App() {
  return (
    <OfflineProvider>
      <AuthProvider>
        <ToastProvider>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </ToastProvider>
      </AuthProvider>
    </OfflineProvider>
  );
}
