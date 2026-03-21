import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from './AuthContext'
import { useGames } from '../hooks/useGames'
import { useDrills } from '../hooks/useDrills'
import { useNotifications } from '../hooks/useNotifications'
import { checkAchievements } from '../lib/achievementChecker'
import AchievementToast from '../components/AchievementToast'

const AchievementContext = createContext()

export function AchievementProvider({ children }) {
  const { user } = useAuth()
  const { games } = useGames()
  const { sessions } = useDrills()
  const { addNotification } = useNotifications()

  const [toastQueue, setToastQueue] = useState([])
  const [currentToast, setCurrentToast] = useState(null)
  const earnedRef = useRef(new Set())
  const checkedRef = useRef(false)

  // Load earned achievements from localStorage
  useEffect(() => {
    if (!user) return
    try {
      const stored = JSON.parse(localStorage.getItem(`courtiq-achievements-${user.id}`) || '[]')
      earnedRef.current = new Set(stored)
    } catch {
      earnedRef.current = new Set()
    }
  }, [user])

  // Check for new achievements when data changes
  useEffect(() => {
    if (!user || games.length === 0) return
    // Debounce first check to avoid spamming on initial load
    if (!checkedRef.current) {
      checkedRef.current = true
      // Skip notifications on first load — just record what's already earned
      const unlocked = checkAchievements(games, sessions, new Set())
      unlocked.forEach(a => earnedRef.current.add(a.id))
      try {
        localStorage.setItem(`courtiq-achievements-${user.id}`, JSON.stringify([...earnedRef.current]))
      } catch {}
      return
    }

    const newUnlocks = checkAchievements(games, sessions, earnedRef.current)
    if (newUnlocks.length === 0) return

    // Record and notify
    newUnlocks.forEach(a => {
      earnedRef.current.add(a.id)
      addNotification({
        type: a.type || 'achievement',
        title: a.title,
        body: a.body,
        icon: a.icon,
        action_url: '/badges',
      })
    })

    try {
      localStorage.setItem(`courtiq-achievements-${user.id}`, JSON.stringify([...earnedRef.current]))
    } catch {}

    // Queue toasts
    setToastQueue(prev => [...prev, ...newUnlocks])
  }, [games.length, sessions.length]) // eslint-disable-line

  // Process toast queue
  useEffect(() => {
    if (currentToast || toastQueue.length === 0) return
    setCurrentToast(toastQueue[0])
    setToastQueue(prev => prev.slice(1))
  }, [currentToast, toastQueue])

  const dismissToast = useCallback(() => {
    setCurrentToast(null)
  }, [])

  return (
    <AchievementContext.Provider value={{}}>
      {children}
      <AchievementToast achievement={currentToast} onDismiss={dismissToast} />
    </AchievementContext.Provider>
  )
}

export function useAchievements() {
  return useContext(AchievementContext)
}
