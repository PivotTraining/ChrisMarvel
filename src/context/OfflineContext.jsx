import { createContext, useContext, useState, useEffect } from 'react'
import useOfflineSync from '../hooks/useOfflineSync'

const OfflineContext = createContext(null)

export function OfflineProvider({ children }) {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )
  const { isSyncing, pendingCount, lastSyncResult, syncAll, refreshCount } = useOfflineSync()

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
    }
    function handleOffline() {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <OfflineContext.Provider value={{ isOnline, isSyncing, pendingCount, lastSyncResult, syncAll, refreshCount }}>
      {children}
    </OfflineContext.Provider>
  )
}

export function useOffline() {
  const context = useContext(OfflineContext)
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider')
  }
  return context
}
