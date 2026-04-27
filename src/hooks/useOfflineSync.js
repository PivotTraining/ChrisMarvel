import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, BYPASS_AUTH } from '../lib/supabase'
import { getAll, dequeue, incrementRetry } from '../lib/offlineQueue'

const MAX_RETRIES = 3

async function processAction(action) {
  const { table, operation, data } = action

  switch (operation) {
    case 'insert': {
      const { error } = await supabase.from(table).insert(data)
      if (error) throw error
      break
    }
    case 'update': {
      const { id, ...updates } = data
      const { error } = await supabase.from(table).update(updates).eq('id', id)
      if (error) throw error
      break
    }
    case 'delete': {
      const { error } = await supabase.from(table).delete().eq('id', data.id)
      if (error) throw error
      break
    }
    default:
      throw new Error(`Unknown operation: ${operation}`)
  }
}

export default function useOfflineSync() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)
  const [lastSyncResult, setLastSyncResult] = useState(null)
  const syncingRef = useRef(false)

  const refreshCount = useCallback(async () => {
    try {
      const items = await getAll()
      setPendingCount(items.length)
    } catch {
      setPendingCount(0)
    }
  }, [])

  const syncAll = useCallback(async () => {
    if (BYPASS_AUTH || syncingRef.current || !navigator.onLine) return { synced: 0, failed: 0 }

    syncingRef.current = true
    setIsSyncing(true)

    let synced = 0
    let failed = 0

    try {
      const actions = await getAll()

      for (const action of actions) {
        if (action.retries >= MAX_RETRIES) {
          await dequeue(action.id)
          failed++
          continue
        }

        try {
          await processAction(action)
          await dequeue(action.id)
          synced++
        } catch {
          await incrementRetry(action.id)
          failed++
        }
      }
    } catch {
      // DB access failed
    } finally {
      syncingRef.current = false
      setIsSyncing(false)
      await refreshCount()
      setLastSyncResult({ synced, failed, at: new Date().toISOString() })
    }

    return { synced, failed }
  }, [refreshCount])

  useEffect(() => {
    refreshCount()

    const handleOnline = () => {
      syncAll()
    }

    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [syncAll, refreshCount])

  return {
    isSyncing,
    pendingCount,
    lastSyncResult,
    syncAll,
    refreshCount,
  }
}
