import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { AchievementProvider } from '../contexts/AchievementContext'
import { setupAppListeners, setupBackButton } from '../lib/native'

export default function AppLayout() {
  // Native app lifecycle — refresh data on resume, handle back button
  useEffect(() => {
    let cleanupApp, cleanupBack

    setupAppListeners(
      () => { /* onResume — app came to foreground */ },
      () => { /* onPause — app went to background */ }
    ).then(fn => { cleanupApp = fn })

    setupBackButton(({ canGoBack }) => {
      if (canGoBack) window.history.back()
    }).then(fn => { cleanupBack = fn })

    return () => {
      cleanupApp?.()
      cleanupBack?.()
    }
  }, [])

  return (
    <AchievementProvider>
      <div className="min-h-screen min-h-[100dvh] bg-bg-primary pb-32 pb-[calc(7rem+env(safe-area-inset-bottom))]">
        <main>
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </AchievementProvider>
  )
}
